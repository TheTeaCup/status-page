require('dotenv').config()
const schedule = require("node-cron");
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL);


console.log("Starting Monitoring...")
require('./ping').run(redis);

schedule.schedule('* * * * *', function () {
    require('./ping').run(redis);
}, {
    timezone: "America/New_York"
})