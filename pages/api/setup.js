import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/sessionSettings";
import Redis from "../../utils/redis"
import * as crypto from "crypto";
import csrf from "../../utils/csrf";
import pack from '../../package.json';

export default withIronSessionApiRoute(authLogin, sessionOptions);

async function authLogin(req, res) {
    let SiteLogs = await Redis.get('site-logs');
    if (SiteLogs) SiteLogs = JSON.parse(SiteLogs);
    if (!SiteLogs) SiteLogs = [];

    if (req.method === 'POST') {

        try {
            await csrf(req, res)
        } catch (e) {
            return res.json({error: true, message: "Missing csrf token"})
        }

        let Setup = await Redis.get('status-page-settings');
        if (Setup) return res.json({
            error: true,
            message: "Already done"
        });

        try {
            if (!req.body.email || !req.body.password || !req.body.username) return res.json({
                error: true,
                message: "Missing required params"
            });

            let salt = process.env.SITESALT;

            let cipher = crypto.createCipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
            let encrypted = cipher.update(req.body.email, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            let user = await Redis.get('user-' + encrypted);
            if (user) {
                return res.json({error: true, message: "Email already registered"});
            }

            // create user

            const passwordHash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
            let userId = Math.floor(100000000000000 + Math.random() * 900000000000000);
            userId = Number(`1` + userId);

            let userData = {
                username: req.body.username,
                email: encrypted,
                password: passwordHash,
                isVerified: false,
                staff: true,
                admin: true,
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

            userData.email = req.body.email;
            req.session.user = userData;
            await req.session.save();

            let siteSettings = {
                setup: true,
                domain: 'https://example.com',
                maintenance: false,
            }
            Redis.set('status-page-settings', JSON.stringify(siteSettings));

            // create site settings in db
            return res.json({error: false, message: "OK"})
        } catch (e) {
            console.log(e)
            return res.json({error: true, message: "Error Occurred"})
        }

    } else {
        let Setup = await Redis.get('status-page-settings');
        if (!Setup) return res.json({
            error: true,
            message: "Needs Setup"
        });

        return res.json({
            error: false,
            message: "OK"
        });
    }

}