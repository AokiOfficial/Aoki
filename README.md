<h1 align="center"><img src='https://cdn.discordapp.com/avatars/704992714109878312/36238cb1bb35c62b251691553f8380f3?size=128' height='100'><br>Neko</br></h1>
<p align="center">A multi-purpose bot to spice up your Discord experiences.<br>Focus mainly on Anime, Fun and Utility.</br></p>
<p align="center">
  <a href="https://forthebadge.com/">
    <img src="https://i.imgur.com/JJkdjKu.png" height="36"/>
  </a>
  <a href="https://workers.cloudflare.com/">
    <img src="https://i.imgur.com/WWKxNLN.png" height="36"/>
  </a>
</p>

---
## About this project

Serious, I'm writing Neko to be compatible with Cloudflare Workers. I use a library, of course, [yor.ts](https://github.com/OreOreki/yor.ts). The package itself is not perfect *just yet* for me, so I still use the old-school extend methods. You can find the extensions I frequently use in my code in [src/struct/extends](/src/struct/extends/).

I initially wrote this in CommonJS, but many and many and many problems arised about incompatibility, most of them came from Workers. Therefore I changed to ESModule.

It took me about a week just to understand the logic in writing Workers-compatible Discord bot, and without the beauty core of [yor.ts](https://github.com/OreOreki/yor.ts) and Discord official documentation on [receiving and responding to interactions](https://discord.com/developers/docs/interactions/receiving-and-responding), this wouldn't even be possible.

---

## About the code & license

I don't expect the code to be readable or clean, a lot of logic stays behind an util function in one single settings file. To ease out the process of maintaining and reading, I put comments on every functions in there.

License, [GPL-3.0 license](/LICENSE), read that file. I don't have any other requirements, this is a learning project pushed to production. A lot of secret keys are missing though, you should go find out what are those if you want to self-host.

---

## Setup

### Automated way

> [!IMPORTANT]
> Before continuing, make sure you have all example files edited and with the word `example` removed from the file name.

The local setup process is automated in setup files provided in the root of this repository. Run the file appropriately depending on your system, e.g. Windows users should run `setup.bat`, and Linux users should run `setup`.

> [!CAUTION]
> Linux users should modify the `setup` bash file to use the correct terminal command if you're not using the GNOME user interface, and grant the file execution permission.

For production deployment, I *don't recommend* you to use this in production; but this option is available. Simply run:

```bash
npm run deploy
```

### What's next? I see a new terminal opening!

<img src=https://i.imgur.com/a0MaNWA.png>

It should look like this inside while developing locally. The URL in the `Forwarding` field, ending with `.ngrok-free.app`, is your local URL exposed to the Internet. You will use that URL to put inside the `Application Command URL` field, on your Discord Application page.

**Why can't you use `localhost:8787`?** It's not exposed to Discord. Simply put, it can't see your local address.

### So... what do I do with production?

> [!WARNING]
> Make sure to fill `wrangler.example.toml` completely, remove the `example` from the name and double-check to make sure the information are correct!

Upon running `npm run deploy`, it will end with this line:

```bash
Current deploy URL: https://something.fancy.workers.dev/
```

That's the URL you'll be using to put inside the `Application Command URL` field, on your Discord Application page.

### What's the `build.js` file in the `src` folder?

Cloudflare Workers requires your entire script to be compiled into one single `.js` file. That `build` file serves that exact purpose.

It will be compiled (and made compact) to a new folder named `dist`. Shorthand for `distribution`, by the way.

> [!CAUTION]
> DO NOT edit `/dist/main.js` and/or `/dist/main.js.map` directly! To make changes, edit the source code, and rebuild the project.

---
## Database

Neko uses the new open-beta Workers D1 database, which is a SQL database.

Workers KV (key-value) proves to be useless for our use case as we're dealing with collections of data in tables/queries.

It's built-in, so there's no need to install anything. Check it out by doing:
```bash
wrangler d1
```


About where all the JSONs are, they are stored online as the ever-expanding need of custom responses. `n:point` serves as a very good and simple JSON bin - and you can directly access anything with only the ID that you can predefine. One thing to note though, you **must lock any JSON made there**.

The function to access all of them are defined as `Util#getStatic()`.

---
## Common questions

**Q:** Why not `slash-create`?

- It is very troublesome figuring out how to write a Workers-compatible bot with that library. I continuously receive errors about Workers complaining nothing is polyfilled, when there's not a single polyfill for it!
- That issue persists *within* the library itself no matter if you choose to write with **CommonJS or ESModule**! Only when you write your code in TypeScript and include defining files, it will work. I personally don't like TypeScript as I never had time to properly type all types.

**Q:** Why not any other serverless platforms, like Vercel or AWS Lambda?

- You must have heard of **"cold starts"**. Serverless functions from there take time to turn their service up, *only then* it runs your code. That is not good for a Dicord bot where it requires you to initially respond to an interaction within 3 seconds.
- Cloudflare instead uses **V8 Isolates**, developed by Google. This is a game changer as we say goodbye to cold starts. Code runs within *miliseconds*.
- There is a very big downside though, you are very limited in dependencies. This project uses very raw files like the entire `jimp` library in one file. That's a hassle to commit, so you can just install `jimp` instead.

**Q:** Why so terrible code writing?

- Some explanations of why I used certain "workarounds" and more chonky methods than normal should be on top of the line where those are located. Those are chonky with a reason!
- I'm known for my terrible code optimizations, and I lean towards readable code. I make my code even more readable with lots, lots of comments, so that when I read back, I know what did I think.
- Note that I lowercase and use abbr. in most of my comments. I'm usually in a tired state when writing code, because I write code before going to bed. And I go to bed at around 1AM.

**Q:** I wanna ask questions!

- Maybe file an issue, I might be able to answer a clear concern. I want to make sure you know what to do.

**Q:** I wanna contribute! How to do that?

- That's great! There's a template ready for you to write a proper PR when you get on the tab, so there should be no major issues!
- I appreciate even tiny fixes about basically anything, so get going and jump right on it!