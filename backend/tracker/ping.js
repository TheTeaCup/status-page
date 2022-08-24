const got = require('got');
const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
const {version} = require('../../package.json')

module.exports.run = async function (Redis) {
    let MonitorKeys = await Redis.keys('monitors-*');
    MonitorKeys.map(async monitorKey => {
        if (monitorKey.endsWith('-data')) return;

        let MonitorInfo = await Redis.get(`${monitorKey}`);
        if (MonitorInfo) MonitorInfo = JSON.parse(MonitorInfo);
        console.log(MonitorInfo);

        let MonitorData = await Redis.get(`${monitorKey}-data`);
        if (MonitorData) MonitorData = JSON.parse(MonitorData);
        console.log(MonitorData)

        // use switch statement

        if(MonitorInfo.status === 'suspended') return;
        let lastCheck = MonitorInfo.lastCheck;
        let retries = 0;
        const isFirstBeat = !lastCheck;
        let beat = MonitorInfo.beat;
        if(MonitorInfo.retries) {
            retries = MonitorInfo.retries
        }

        if (Date.now() - parseInt(lastCheck) < beat * 1000) {
            return;
        }

        let bean = {checkedAt: Date.now()}

        try {
            if (MonitorInfo.type === 'https') {
                let startTime = dayjs().valueOf();
                // HTTP basic auth
                let basicAuthHeader = {};
                if (MonitorInfo.auth_method === "basic") {
                    basicAuthHeader = {
                        //"Authorization": "Basic " + this.encodeBase64(MonitorInfo.basic_auth_user, MonitorInfo.basic_auth_pass),
                    };
                }

                const options = {
                    url: MonitorInfo.source,
                    method: (MonitorInfo.method || "get").toLowerCase(),
                    ...(MonitorInfo.body ? { data: JSON.parse(MonitorInfo.body) } : {}),
                    timeout: MonitorInfo.interval * 1000 * 0.8,
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "User-Agent": "Tea-Time/" + version,
                        ...(MonitorInfo.headers ? JSON.parse(MonitorInfo.headers) : {}),
                        ...(basicAuthHeader),
                    },
                    maxRedirects: retries,
                };

                let res = await axios.request(options);

                // console.log(res)
                bean.msg = `${res.status} - ${res.statusText}`;
                bean.ping = dayjs().valueOf() - startTime;
                bean.status = "up";
                MonitorInfo.status = "up";
                MonitorInfo.lastCheck = Date.now();

            }
        } catch (e) {
            console.log(e)
            bean.msg = e.message;
        }

        MonitorData.push(bean);

        Redis.set('monitors-' + MonitorInfo.id, JSON.stringify(MonitorInfo));
        Redis.set('monitors-' + MonitorInfo.id + '-data', JSON.stringify(MonitorData));

    });
}
