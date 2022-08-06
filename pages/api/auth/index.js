import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import Redis from "../../../utils/redis"
import * as crypto from "crypto";
import pack from '../../../package.json';

export default withIronSessionApiRoute(authLogin, sessionOptions);

async function authLogin(req, res) {
    let SiteLogs = await Redis.get('site-logs');
    if (SiteLogs) SiteLogs = JSON.parse(SiteLogs);
    if (!SiteLogs) SiteLogs = [];

    let Setup = await Redis.get('status-page-settings');
    if (!Setup) return res.json({
        error: true,
        message: "Needs Setup"
    });

    if (req.method === 'POST') {

        try {
            if (!req.body.email || !req.body.password) return res.json({
                error: true,
                message: "Missing Email or Password"
            });

            let salt = process.env.SITESALT;

            let cipher = crypto.createCipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
            let encrypted = cipher.update(req.body.email, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            let user = await Redis.get('user-' + encrypted);

            if (!user) {
                return res.json({error: true, message: "Invalid Email or Password"});
            } else {
                user = JSON.parse(user);

                const passwordHash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
                if (passwordHash === user.password) {

                    user.lastSeen = Date.now();
                    user.version = pack.version || '0.0.0';
                    let decipher = crypto.createDecipheriv('aes-256-cbc', process.env.SITECRYPTO, process.env.SITEIV);
                    let decrypted = decipher.update(encrypted, 'base64', 'utf8');

                    Redis.set('user-' + encrypted, JSON.stringify(user));
                    Redis.set(user.token, encrypted);
                    user.email = decrypted + decipher.final('utf8');
                    user.encryptedEmail = encrypted;
                    req.session.user = user;
                    await req.session.save();
                    // create user session then return a success message
                    return res.json({error: false, message: "OK"})
                } else {
                    return res.json({error: true, message: "Invalid Email or Password"});
                }
            }

        } catch (e) {
            console.log(e)
            return res.json({error: true, message: "Error Occurred"})
        }

    } else {
        return res.json({
            error: true,
            message: "Invalid request"
        })
    }

}