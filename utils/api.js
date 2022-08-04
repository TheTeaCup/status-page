const newMonitor = async function (Token, body) {
    return await fetch(`/api/monitor/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': Token || null
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

export {
    newMonitor,
}