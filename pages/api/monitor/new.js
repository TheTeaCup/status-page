import Redis from "../../../utils/redis";
import crypto from "crypto";

export default async function handler(req, res) {

    if (!req.headers.authorization) return res.json({
        error: true,
        message: "Missing required authorization header"
    });

    try {
        if (req.method === 'POST') {
            console.log(req.body);

            // check for required info
            if (!req.body.user) return res.json({
                error: true,
                message: "Missing required params"
            });

            if (!req.body.type) return res.json({
                error: true,
                message: "Missing required params"
            });

            if (!req.body.name) return res.json({
                error: true,
                message: "Missing required params"
            });

            if (!req.body.source) return res.json({
                error: true,
                message: "Missing required params"
            });

            let body = null;
            if (req.body.body) {
                body = JSON.stringify(req.body.body)
            }

            let headers = null;
            if (req.body.headers) {
                headers = JSON.stringify(req.body.headers)
            }

            // validate user info
            let cipher = crypto.createCipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
            let encrypted = cipher.update(req.body.user, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            let user = await Redis.get('user-' + encrypted);
            if (!user) return res.json({error: true, message: "No user found"});
            if (user) user = JSON.parse(user);

            if (!user.token === req.headers.authorization) return res.json({
                error: true,
                message: "Invalid authorization header"
            });

            let monitorID = Math.floor(100000000000000 + Math.random() * 900000000000000);

            let monitorData = {
                id: monitorID,
                name: req.body.name,
                type: req.body.type,
                method: req.body.method || 'GET',
                source: req.body.source,
                beat: req.body.heartBeat || 60,
                retires: req.body.retires,
                body: body,
                headers: headers,
                createdAt: Date.now(),
                lastCheck: null,
                status: 'unknown',
                createdBy: user.id,
                users: [`${user.id}`]
            }

            let userMonitors = user.monitors || [];
            userMonitors.push({
                id: monitorID,
                name: req.body.name
            });
            Redis.set('user-' + encrypted, JSON.stringify(user));
            await Redis.incr("monitors"); // set count
            Redis.set('monitors-' + monitorID, JSON.stringify(monitorData));
            Redis.set('monitors-' + monitorID + '-data', JSON.stringify([]));

            return res.json({
                error: false,
                message: "OK",
                id: monitorID
            })

        } else {
            return res.json({
                error: true,
                message: "Invalid request"
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}
