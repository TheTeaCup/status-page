const express = require('express')
const next = require('next');

const port = process.env.PORT;
const app = next({})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    server.use(async (req, res, next) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST");

        console.log(
            (req.headers["cf-connecting-ip"] ||
                req.headers["x-forwarded-for"] ||
                req.ip) +
            " [" +
            req.method +
            "] " +
            req.url
        );
        next()
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
})