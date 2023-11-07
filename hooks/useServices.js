import {useEffect, useState} from "react";
import {Status} from "@/utils/constants";

function useServices() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("./urls.cfg");
                const configText = await response.text();
                const configLines = configText.split("\n");

                const services = []
                for (let ii = 0; ii < configLines.length; ii++) {
                    const configLine = configLines[ii];
                    const [key, url] = configLine.split("=");
                    if (!key || !url) {
                        continue;
                    }
                    const log = await logs(key);

                    if (log.length > 0) {
                        services.push({id: ii, name: key, status: log[log.length - 1].status, logs: log})
                    } else {
                        services.push({id: ii, name: key, status: "unknown", logs: log})
                    }
                }
                setData(services);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return [data, isLoading, error];
}

async function logs(key) {
    const response = await fetch(`https://raw.githubusercontent.com/TheTeaCup/status-page/master/public/status/${key}_report.log`);

    const text = await response.text();
    const lines = text.split("\n");
    const logs = [];
    const logDaySummary = [];

    lines.forEach((line) => {
        const [created_at, status, response_time] = line.split(", ");
        logs.push({id: created_at, response_time, status, created_at})
    })

    const prepareSummary = Object.values(logs.reduce((r, date) => {
        const [year, month, day] = date.created_at.substr(0, 10).split('-');
        const key = `${day}_${month}_${year}`;
        r[key] = r[key] || {date: date.created_at, logs: []};
        r[key].logs.push(date);
        return r;
    }, {}));


    prepareSummary.forEach((logSummary) => {
        var avg_response_time = 0

        logSummary.logs.forEach((log) => {
            if (log.response_time) {
                avg_response_time += Number(log.response_time.replaceAll('s', ''));
            }
        });

        let status = ""
        if (logSummary.logs.length === 0) {
            status = "unknown"
        } else if (logSummary.logs.every((item) => item.status === 'success')) {
            status = Status.OPERATIONAL
        } else if (logSummary.logs.every((item) => item.status === 'failed')) {
            status = Status.OUTAGE
        } else {
            status = Status.PARTIAL_OUTAGE
        }

        logDaySummary.push({
            avg_response_time: avg_response_time / logSummary.logs.length,
            current_status: logSummary.logs[logSummary.logs.length - 1].status,
            date: logSummary.date.substr(0, 10),
            status: status
        })
    })


    return fillData(logDaySummary);
}

function fillData(data) {
    const logDaySummary = [];
    var today = new Date();

    for (var i = -1; i < 59; i += 1) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const summary = data.find((item) => item.date === d.toISOString().substr(0, 10));
        logDaySummary.push({
            avg_response_time: summary?.avg_response_time || 0,
            current_status: summary?.current_status || "unknown",
            date: d.toISOString().substr(0, 10),
            status: summary?.status || "unknown"
        })
    }

    return logDaySummary.reverse();
}


export default useServices;