<h1 align="center"><img src='https://cdn.discordapp.com/avatars/704992714109878312/36238cb1bb35c62b251691553f8380f3?size=128' height='100'><br>Neko</br></h1>
<p align="center">A multi-purpose Discord application to spice up your experiences.<br>Focus mainly on Anime, Fun and Utility.</br></p>
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

Serious, I'm writing Neko to be compatible with Cloudflare Workers.

I initially wrote this in CommonJS, but many and many and many problems arised about incompatibility, most of them came from Workers. Therefore I changed to ESModule.

It took me about a week just to understand the logic in writing Workers-compatible Discord app, and without the beauty core of [slash-create](https://github.com/Snazzah/slash-create) and Discord official documentation on [receiving and responding to interactions](https://discord.com/developers/docs/interactions/receiving-and-responding), this wouldn't even be possible.

Setup procedures and extra information are in the [wiki page](https://github.com/NekoOfficial/Neko.cf/wiki), take a look there.

---

## About the code & license

I don't expect the code to be readable or clean, a lot of logic stays behind an util function in [Utilities.js](/src/struct/Utilities.js). To ease out the process of maintaining and reading, I put comments on every functions in there.

License, [GPL-3.0 license](/LICENSE), read that file. I don't have any other requirements, this is a learning project pushed to production. A lot of secret keys are missing though, you should go find out what are those if you want to self-host.

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

**Q:** Why not any other serverless platforms, like Vercel or AWS Lambda?

- You must have heard of **"cold starts"**. Serverless functions from there take time to turn their service up, *only then* it runs your code. That is not good for a Dicord app where it requires you to initially respond to an interaction within 3 seconds.
- Cloudflare instead uses **V8 Isolates**, developed by Google. This is a game changer as we say goodbye to cold starts. Code runs within *miliseconds*.
- There is a very big downside though, you are very limited in dependencies. Your package has something to do with polyfill? Too bad. Get that package out or it won't compile.

**Q:** Why so terrible code writing?

- Some explanations of why I used certain "workarounds" and more chonky methods than normal should be on top of the line where those are located. Those are chonky with a reason!
- I'm known for my terrible code optimizations, and I lean towards readable code. I make my code even more readable with lots, lots of comments, so that when I read back, I know what did I think.
- Note that I lowercase and use abbr. in most of my comments. I'm usually in a tired state when writing code, because I write code before going to bed. And I go to bed at around 1AM.

**Q:** I wanna ask questions!

- Maybe file an issue, I might be able to answer a clear concern. I want to make sure you know what to do.

**Q:** I wanna contribute! How to do that?

- That's great, there's a template ready for you to write a proper PR when you get on the tab, so there should be no major issues.
- I appreciate even tiny fixes about basically anything, so get going and jump right on it!