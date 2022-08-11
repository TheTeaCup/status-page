const got = require('got');

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

        if (MonitorInfo.type === 'https') {
            if (MonitorInfo.method === 'GET') {

            } else if (MonitorInfo.method === 'POST') {

            } else if (MonitorInfo.method === 'PUT') {

            } else if (MonitorInfo.method === 'PATCH') {

            } else if (MonitorInfo.method === 'DELETE') {

            } else if (MonitorInfo.method === 'HEAD') {

            } else if (MonitorInfo.method === 'OPTIONS') {

            }
        }

    });
}
