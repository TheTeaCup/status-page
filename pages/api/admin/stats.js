import Redis from "../../../utils/redis"
import pack from "../../../package.json";

export default async function handler(req, res) {
    try {

        if (!req.headers.authorization) return res.json({
            error: true,
            message: "Missing required authorization header"
        })

        let aUser = await Redis.get(req.headers.authorization);
        if(!aUser) return res.json({
            error: true,
            message: "Invalid authorization header"
        })

        let user = await Redis.get('user-' + aUser);
        if(!user) return res.json({
            error: true,
            message: "No user found"
        })
        user = JSON.parse(user);

        if(!user.authorization === req.headers.authorization) return res.json({
            error: true,
            message: "Invalid authorization header"
        })

        res.json({
            error: false,
            message: "OK",
            stats: {
                version: pack.version,
                users: await Redis.get('users') || "0",
                monitors: await Redis.get('monitors') || "0",
                pages: await Redis.get('pages') || "0"
            }
        });

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}