import Redis from "../../../utils/redis"

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

        let Setup = await Redis.get('status-page-settings');
        if (Setup) Setup = JSON.parse(Setup);

        if (req.method === 'POST') {

            let domain = req.body.domain;
            let userCreationEnabled = req.body.userCreationEnabled;
            let maintenance = req.body.maintenance;

            if (!domain) return res.json({
                error: false,
                message: "Missing required form entry"
            });

            Setup.domain = domain || 'https://example.com';
            Setup.maintenance = maintenance || false;
            Setup.userCreationEnabled = userCreationEnabled || false;

            await Redis.set('status-page-settings', JSON.stringify(Setup));

            res.json({
                error: false,
                message: "OK"
            });
        } else {
            res.json({
                error: false,
                message: "OK",
                settings: Setup
            });
        }

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}