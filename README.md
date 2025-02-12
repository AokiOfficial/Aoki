<h1 align="center"><img src='https://i.imgur.com/Nar1fRE.png' height='100'><br>Aoki</br></h1>
<p align="center">a multi-purpose Discord application to spice up your experiences.<br>focus mainly on anime, fun and utility.</br></p>
<p align="center">
  <a href="https://nodejs.org/api/esm.html/">
    <img src="https://i.imgur.com/JJkdjKu.png" height="36"/>
  </a>
  <a href="https://www.digitalocean.com/pricing/droplets/">
    <img src="https://i.imgur.com/9rZ8bLb.png" height="36"/>
  </a>
</p>

---
## Information about this project

***For users***, Aoki is your tsundere helper in Discord, the modern world's favorite messaging app. She "specializes in providing advanced anime information and handy utilities, all within your Discord server." Soon, she'll have native support for [osu!](https://osu.ppy.sh), but now with various things not available in other applications.

You want to know more right now? Head to the [info file](/INFO.md), or [invite her now](https://discord.com/oauth2/authorize?client_id=704992714109878312).

***For developers***, Aoki is a Discord application, available as both a gateway-based app (the current release) and a serverless app (before v4). The serverless app is for Cloudflare Workers. Tagged versions after v3 can be hosted anywhere with Node.js (or Bun) and process persistence.

---
## Tech stacks
Aoki is written in **JavaScript**. There are no plans to rewrite it into another language. Community rewrites are welcome, but they are **not official**.

**CommonJS** is not supported. This project uses ESM.

Aoki uses **MongoDB**. She uses the mongodb library, but this branch has experimental support for mongoose. Both logics are interchargable, please check the [Settings.js](/src/struct/Settings.js) file and the [Client.js](/src/struct/Client.js) file for more info.

Aoki **heavily relies** on APIs and external projects. This is why the project is very small in disk space size and codebase size. After compilation, the entire codebase and libraries weigh a stunning **3.455MB**.

Aoki supports Node.js v18+, and Bun v1.2+. It is recommended to use Node.js v22+ or Bun for the time being, so loading `.env` file won't be an issue. If something happen to not support that, use `npm:dotenv`.

Check the [roadmap](https://github.com/AokiOfficial/Aoki/issues/6) for future planned implementations.

---
## Code License & Contribution
[GPL-3.0](/LICENSE).

This is a learning project pushed to production, use any code that makes sense to you, but don't fully copy the entire thing.

To contribute, simply make a fork of this repository, make your changes, then make a pull request. There is a template ready for a standard PR.