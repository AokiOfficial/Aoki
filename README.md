<h1 align="center"><img src='https://i.imgur.com/Nar1fRE.png' height='100'><br>Aoki</br></h1>
<p align="center">a multi-purpose Discord application to spice up your experiences.<br>focus mainly on anime, fun and utility.</br></p>

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/oauth2/authorize?client_id=704992714109878312)
[![License](https://img.shields.io/github/license/ProjectMewo/Aoki?style=for-the-badge)](https://github.com/ProjectMewo/Aoki/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/ProjectMewo/Aoki?style=for-the-badge)](https://github.com/ProjectMewo/Aoki/stargazers)
[![Issues](https://img.shields.io/github/issues/ProjectMewo/Aoki?style=for-the-badge)](https://github.com/ProjectMewo/Aoki/issues)

</div>

---
## Information about this branch

> [!NOTE]
> This branch serves as a **proof-of-concept** of Aoki ported to [Seyfert](https://www.seyfert.dev).

***For you developers***, this branch is Aoki using [Seyfert](https://www.seyfert.dev) instead of Discord.js.

Seyfert is a pretty interesting and new library coming into play and competing with Discord.js. While it still has its own limitations (at least it's not an entire team that makes *outrageously* impractical decisions like Discord.js), what it offers do lift a significant amount of work for normal Discord.js developers.

However you don't get a lot of useful information on Seyfert, because it doesn't have a proper documentation. You have a [guide](https://docs.seyfert.dev), which includes outdated information, along with its undocumented code to work with, that's it. Obviously that's quite insufficient, so when you read the code you might find more spaghetti.

The library itself works and its philosophy does hold up. However, for very technical and obscure details I learned working this early into Seyfert, head over to [INSTRUCTIONS.md](/INSTRUCTIONS.md).

***For you end users***, why are you here anyway.

## Local development setup
Make sure you have Bun on your local machine, because Aoki will not run otherwise. [Install it here](https://bun.sh).

Place all the necessary keys required by first renaming the `.env.example` file to `.env`, and then fill it. **It is recommended that you use only the DEV variant of the keys.**

Start the dev client by running this one-liner (which installs 2 dependencies and start it):
```bash
bun i && bun dev
```

## Code License & Contribution
[GPL-3.0](/LICENSE).

This is a learning project pushed to production, use any code that makes sense to you, but don't fully copy the entire thing.

To contribute, simply make a fork of this repository, make your changes, then make a pull request. There is a template ready for a standard PR.

To work with the codebase, specifically this branch, make sure:
- You document the code wherever relevant; i.e. stuff that will be hard to look at without it, if you're making a PR.
- You keep the overall structure intact and consistent. Sync with other files if there is already one (or some) of the same format.
- You stay sane and happy.