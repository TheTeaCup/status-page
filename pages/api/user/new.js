import Redis from "../../../utils/redis"
import crypto from "crypto";
import pack from "../../../package.json";

export default async function handler(req, res) {
    try {

        let Setup = await Redis.get('status-page-settings');
        if (Setup) Setup = JSON.parse(Setup);
        if (!Setup?.userCreationEnabled) {
            return res.json({
                error: true,
                message: "User creation is disabled"
            })
        }

        if (req.method === 'POST') {

            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;

            if (!name || !email || !password) {
                return res.json({
                    error: true,
                    message: "Missing required params"
                });
            }

            let salt = process.env.SITESALT;

            let cipher = crypto.createCipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
            let encrypted = cipher.update(req.body.email, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            let newUser = await Redis.get('user-' + encrypted);
            if (newUser) {
                return res.json({error: true, message: "Email already registered"});
            }

            const passwordHash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
            let userId = Math.floor(100000000000000 + Math.random() * 900000000000000);
            userId = Number(`1` + userId);

            let userData = {
                username: name,
                email: encrypted,
                password: passwordHash,
                isVerified: false,
                staff: false,
                admin: false,
                createdAt: Date.now(),
                lastSeen: Date.now(),
                id: userId,
                disabled: false,
                banned: false,
                avatarURL: null,
                token: crypto.randomBytes(20).toString('hex'),
                monitors: [],
                pages: [],
                version: pack.version || '0.0.0'
            };

            Redis.set('user-' + encrypted, JSON.stringify(userData));
            Redis.set(userData.token, encrypted);
            await Redis.incr("users");

            return res.json({error: false, message: "OK"});

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