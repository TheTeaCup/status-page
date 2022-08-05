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

        res.json({
            error: false,
            message: "OK",
            user: user
        });

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Error Occurred"})
    }
}
