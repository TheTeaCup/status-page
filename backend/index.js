/* Tea Status - Website Backend
* Github Pull and Website Building */

// Packages
require('dotenv').config()
const exec = require("child_process").exec;

if (process.env.GITHUBPULL) {
    update();
    setInterval(function () {
        update()
    }, 10 * 1000);
}

async function update() {
    exec(`git pull origin master`, (error, stdout) => {
        let response = error || stdout;

        if (!error) {
            if (!response.includes("Already up to date.")) {
                console.log("Update has been pulled, working on installation...");

                exec(`npm install`, (error1, stdout1) => {
                    if (stdout1) {
                        console.log("Installing has successfully finished, now working on building website...")
                        exec(`npm run build`, (error2, stdout2) => {
                            if (stdout2) {
                                console.log("Website has been built, now restarting server...")
                                // Restart Server

                                setTimeout(() => {
                                    process.exit();
                                }, 1000);
                            }
                        })
                    }
                })

            }
        }
    })
}

require('./server.js');
// not done
require('./tracker/index');