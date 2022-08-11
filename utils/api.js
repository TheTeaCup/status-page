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

const newPage = async function (Token, body) {
    return await fetch(`/api/status/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': Token || null
        },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

const getMonitor = async function (ID, Auth) {
    return await fetch(`/api/monitor/${ID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': Auth || null
        },
    }).then(res => res.json());
};

const getMonitorPublic = async function (ID, Auth) {
    return await fetch(`/api/monitor/${ID}/public`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json());
};

const newUser = async function (Auth, Body) {
    return await fetch(`/api/admin/users/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': Auth || null
        },
        body: JSON.stringify(Body),
    }).then(res => res.json());
};

export {
    newMonitor,
    newPage,
    getMonitor,
    newUser,
    getMonitorPublic
}