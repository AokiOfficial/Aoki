<h1 align="center"><img src='https://cdn.discordapp.com/avatars/704992714109878312/fd49d4d9006710f8b9b5bdc027e6440a.png?size=128' height='100'><br>Neko</br></h1>
<p align="center">A multi-purpose bot to spice up your Discord experiences.<br>Focus mainly on Anime, Fun and Utility.</br></p>
<p align="center">
  <a href="http://forthebadge.com/">
    <img src="https://i.imgur.com/JJkdjKu.png" height="36"/>
  </a>
  <a href="https://workers.cloudflare.com/">
    <img src="https://i.imgur.com/WWKxNLN.png" height="36"/>
  </a>
</p>

---
## About this project

Serious, I'm writing Neko to be compatible with Cloudflare Workers. I use a library, of course, [yor.ts](https://github.com/OreOreki/yor.ts). The package itself is not perfect, so I still use the old-school extend methods. You can find the extensions I frequently use in my code in [src/extends]().

I initially wrote this in CommonJS, but many and many and many problems arised about incompatibility, most of them came from Workers. Therefore I changed to ESModule.

It took me about a week just to understand the logic in writing Workers-compatible Discord bot, and without the beauty core of [yor.ts](https://github.com/OreOreki/yor.ts) and Discord official documentation on [receiving and responding to interactions](https://discord.com/developers/docs/interactions/receiving-and-responding), this wouldn't even be possible.

---

## Code license

[MIT license](), read that file. I don't have any other requirements, this is a learning project pushed to production. A lot of secret keys are missing though, you should go find out what are those if you want to self-host.

---

## Setup

You should be able to notice a build script lying in the source folder. That's mainly for *polyfilling* core Node modules, as Workers' environment is not native Node, but browser JavaScript. The script will compile the project and create a `dist` folder where you'll run your code from, unlike old Neko where you can just `npm run start` and it runs.

For local development, make a file and name it `.dev.vars`. Your secret keys stay in there with this format:

```json
KEY: "value"
```

When you finish filling in all secret values and things, go ahead and do:

```bash
$ npm run build
```

Some files should be created in the newly made `dist` folder. If any errors occur, you edited the code. Otherwise, file an issue.

After that, to locally develop and debug the code, go ahead and do:

```bash
$ npm run dev
```

This runs `wrangler dev` under the hood. It simulates an environment similar to Cloudflare Workers'.

Becaue you're not passing `http://localhost:8787` to Discord Interactions Endpoint field, use some tool, such as `ngrok`, to open a public URL for local development. When you have initial things done for `ngrok`, go ahead and do:

```bash
$ ngrok http 8787
```

You should be good to go with local development preparations. To publish anything to Workers, go ahead and do:

```bash
$ npm run deploy
```

A new `.workers.dev` domain will be there for the Interactions Endpoint field.

---
## Common questions

**Q:** Why not `slash-create`?

- It is very troublesome figuring out how to write a Workers-compatible with that library. I continuously receive errors about Workers complaining nothing is polyfilled, when there's not a single polyfill for it!
- That issue persists *within* the library itself no matter if you choose to write with **CommonJS or ESModule**! Only when you write your code in TypeScript and include defining files, it will work. I personally don't like TypeScript as I never had time to properly type all types.

**Q:** Why not any other serverless platforms, like Vercel or AWS Lambda?

- You must have heard of **"cold starts"**. Serverless functions from there take time to turn their service up, *only then* it runs your code. That is not good for a Dicord bot where it requires you to initially respond to an interaction within 3 seconds.
- Cloudflare instead uses **V8 Isolates**, developed by Google. This is a game changer as we say goodbye to cold starts. Code runs within *miliseconds*.

**Q:** Why so terrible code writing?

- Some explanations of why I used certain "workarounds" and more chonky methods than normal should be on top of the line where those are located. Those are chonky with a reason!
- I'm known for my terrible code optimizations, and I lean towards readable code. I make my code even more readable with lots, lots of comments, so that when I read back, I know what did I think.
- Note that I lowercase and use abbr. in most of my comments. I'm usually in a tired state when writing code, because I write code before going to bed. And I go to bed at around 1AM.

**Q:** Why hide so many details?

- I do be like that, work with it. I'm not here to spoonfeed any code, I'm not obligated to do so. Help yourself!
- Maybe file an issue, I might be able to answer a clear concern. I want to make sure you know what to do.