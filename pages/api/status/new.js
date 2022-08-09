import Redis from "../../../utils/redis";
import crypto from "crypto";

export default async function handler(req, res) {

    if (!req.headers.authorization) return res.json({
        error: true,
        message: "Missing required authorization header"
    });

    try {
        if (req.method === 'POST') {
            //console.log(req.body);

            // check for required info
            if (!req.body.user) return res.json({
                error: true,
                message: "Missing required params"
            });

            if (!req.body.name) return res.json({
                error: true,
                message: "Missing required params"
            });

            if (!req.body.slug) return res.json({
                error: true,
                message: "Missing required params"
            });

            let slug = req.body.slug;
            slug = slug.toLowerCase();

            let name = req.body.name;
            name = name?.trim();

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

            let check = await Redis.get(`pages-slugs`);
            if (check) {
                check = JSON.parse(check);
                if (check.includes(slug)) {
                    return res.json({
                        error: true,
                        message: "Slug already taken"
                    })
                }
            } else {
                let slugs = [];
                Redis.set(`pages-slugs`, JSON.stringify(slugs));
            }

            let statusID = Math.floor(100000000000000 + Math.random() * 900000000000000);

            if (typeof slug !== "string") {
                return res.json({
                    error: true,
                    message: "Invalid request"
                })
            } else if (!slug.match(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)) {
                return res.json({
                    error: true,
                    message: "Invalid request"
                })
            } else {

                let pageData = {
                    id: statusID,
                    name: name,
                    slug: slug,
                    createdAt: Date.now(),
                    createdBy: user.id,
                }

                let userPages = user?.pages || [];
                if (!userPages) userPages = [];
                userPages.push({
                    id: statusID,
                    name: req.body.name
                });
                await Redis.set('user-' + encrypted, JSON.stringify(user));
                await Redis.incr("pages"); // set count
                await Redis.set('pages-' + statusID, JSON.stringify(pageData));
                await Redis.set(statusID, name);

                // store slugs
                let slugs = await Redis.get('pages-slugs');
                if (slugs) {
                    slugs = JSON.parse(slugs);
                    slugs.push(`${slug}`)
                    Redis.set(`pages-slugs`, JSON.stringify(slugs));
                } else {
                    let slugs = [`${slug}`];
                    Redis.set(`pages-slugs`, JSON.stringify(slugs));
                }

                return res.json({
                    error: false,
                    message: "OK",
                    id: statusID
                })
            }

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
