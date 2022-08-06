import Redis from "../../../../utils/redis"

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

        // functions...
        let monitor = await Redis.get('monitors-' + req.query.id);
        if (!monitor) return res.json({error: true, message: "No monitor found"});
        monitor = JSON.parse(monitor);

        res.json({
            error: false,
            message: "OK",
            monitor: monitor
        });


    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }

}
