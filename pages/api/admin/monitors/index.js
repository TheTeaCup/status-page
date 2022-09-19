import Redis from "../../../../utils/redis"
import async from "async";

export default async function handler(req, res) {
    try {

        if (!req.headers.authorization) return res.json({
            error: true,
            message: "Missing required authorization header"
        })

        let aUser = await Redis.get(req.headers.authorization);
        if (!aUser) return res.json({
            error: true,
            message: "Invalid authorization header"
        })

        let user = await Redis.get('user-' + aUser);
        if (!user) return res.json({
            error: true,
            message: "No user found"
        })
        user = JSON.parse(user);

        if (!user.authorization === req.headers.authorization) return res.json({
            error: true,
            message: "Invalid authorization header"
        })

        let monitorKeys = await Redis.keys('monitors-*');
        monitorKeys =
            await monitorKeys.filter((element) => {
                if (!element.includes('-data')) {
                    return element
                }
            })

        await async.map(monitorKeys, function (key, cb) {
            Redis.get(`${key}`, function (error, value) {
                if (error) return cb(error);
                if (value) {
                    value = JSON.parse(value);
                    delete value.password;
                    delete value.token;
                    cb(null, value);
                }
            })
        }, async function (error, results) {
            if (error) {
                console.log(error);
                return res.json({
                    error: true,
                    message: "Unknown check logs",
                    monitors: []
                });
            }

            return res.json({
                error: false,
                message: "OK",
                monitors: results || []
            });

        })

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}