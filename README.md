# Checkout the v1 branch for more updates

# Tea Cup's Status Page

Built with React, Chakra-UI and love from North Carolina!

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

## ⭐ Live Demo

Coming soon!

## 🔧 How to Install

Required Tools:

- [Node.js](https://nodejs.org/en/download/) >= 14
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) - For run in background

```bash
# Update your npm to the latest version
npm install npm -g

git clone https://github.com/TheTeaCup/status-page.git
cd status-page
npm install # Install the required repositories
npm run build # Build the Next.JS App (Website)

# Setup Configs
# first rename `example.env` => `.env`
# add your REDIS_URL (This is the database we use)
# setup your crypto keys (Used to protect user information)
# fill in session pass `SESSION_PASS` (Used for login)

# Option 1. Try it
node backend/index.js

# (Recommended) Option 2. Run in background using PM2
# Install PM2 if you don't have it: 
npm install pm2 -g

# Start Server
pm2 start backend/index.js --name status-page


```

Browse to http://localhost:3001 after starting.

More useful PM2 Commands

```bash
# If you want to see the current console output
pm2 monit

# If you want to add it to startup
pm2 save && pm2 startup
```

## 🗣️ Discussion

### Issues Page

You can discuss or ask for help in [issues](https://github.com/TheTeaCup/status-page/issues). <br/>
Or in my personal [discord](https://discord.gg/v9sfD3JNEH) just use the status-page channel.

### Bug Reports / Feature Requests

If you want to report a bug or request a new feature, feel free to open
a [new issue](https://github.com/TheTeaCup/status-page/issues).


[contributors-shield]: https://img.shields.io/github/contributors/TheTeaCup/status-page.svg?style=for-the-badge

[contributors-url]: https://github.com/TheTeaCup/status-page/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/TheTeaCup/status-page.svg?style=for-the-badge

[forks-url]: https://github.com/TheTeaCup/status-page/network/members

[stars-shield]: https://img.shields.io/github/stars/TheTeaCup/status-page.svg?style=for-the-badge

[stars-url]: https://github.com/TheTeaCup/status-page/stargazers

[issues-shield]: https://img.shields.io/github/issues/TheTeaCup/status-page.svg?style=for-the-badge

[issues-url]: https://github.com/TheTeaCup/status-page/issues
