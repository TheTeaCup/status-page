import {useEffect, useState} from "react";
import {Status} from "@/utils/constants";

function useSystemStatus() {
    const [systemStatus, setSystemStatus] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("./urls.cfg");
                const configText = await response.text();
                const configLines = configText.split("\n");
                const services = [];
                for (let ii = 0; ii < configLines.length; ii++) {
                    const configLine = configLines[ii];
                    const [key, url] = configLine.split("=");
                    if (!key || !url) {
                        continue;
                    }
                    const status = await logs(key);

                    services.push(status);
                }

                if (services.every((item) => item.status === "success")) {
                    setSystemStatus({
                        title: "All System Operational",
                        status: Status.OPERATIONAL,
                        datetime: services[0].date
                    });
                } else if (services.every((item) => item.status === "failed")) {
                    setSystemStatus({
                        title: "Outage",
                        status: Status.OUTAGE,
                        datetime: services[0].date
                    });
                } else if (services.every((item) => item.status === "")) {
                    setSystemStatus({
                        title: "Unknown",
                        status: Status.UNKNOWN,
                        datetime: services[0].date
                    });
                } else {
                    setSystemStatus({
                        title: "Partial Outage",
                        status: Status.PARTIAL_OUTAGE,
                        datetime: services[0].date
                    });
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return {systemStatus, isLoading, error};
}

async function logs(key) {
    const response = await fetch(`https://raw.githubusercontent.com/TheTeaCuo/status-page/v2/public/status/${key}_report.log`);
    const text = await response.text();
    const lines = text.split("\n");
    try {
        const line = lines[lines.length - 2];
        const [created_at, status, _] = line.split(", ");
        return {
            name: key,
            status: status,
            date: created_at,
        };
    } catch (e) {
        return {
            name: key,
            status: "unknown",
            date: undefined,
        };
    }
}

export default useSystemStatus;