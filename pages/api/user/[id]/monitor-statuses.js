import Redis from "../../../../utils/redis"
import * as crypto from "crypto";
import async from "async";

export default async function handler(req, res) {
    try {

        if (!req.query.id) return res.json({
            error: true,
            message: "Missing required params"
        })

        if (!req.headers.authorization) return res.json({
            error: true,
            message: "Missing required authorization header"
        })

        let cipher = crypto.createCipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
        let encrypted = cipher.update(req.query.id, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        let user = await Redis.get('user-' + encrypted);

        if (!user) return res.json({error: true, message: "No user found"});
        user = JSON.parse(user);

        let decipher = crypto.createDecipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        user.email = decrypted + decipher.final('utf8')

        if (!user.token === req.headers.authorization) return res.json({
            error: true,
            message: "Invalid authorization header"
        });

        // fetch monitor statuses
        let data = {
            online: 0,
            offline: 0,
            unknown: 0,
            paused: 0
        };

        await async.map(user.monitors, function (key, cb) {
            Redis.get(`monitors-${key.id}`, function (error, value) {
                if (error) return cb(error);
                if (value) {
                    value = JSON.parse(value);
                    delete value.headers;
                    delete value.body;

                    if (value.status === 'up') {
                        data["online"] = data.online + 1
                    } else if (value.status === 'offline') {
                        data["offline"] = data.offline + 1
                    } else if (value.status === 'paused') {
                        data["paused"] = data.paused + 1
                    } else {
                        data["unknown"] = data.unknown + 1
                    }

                    cb(null, value);
                } else {
                    cb(null, value);
                }
            })
        }, async function (error, results) {

            return res.json({
                error: false,
                message: "OK",
                data: data
            });

        })

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}