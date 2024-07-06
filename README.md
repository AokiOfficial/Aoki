<h1 align="center"><img src='https://cdn.discordapp.com/avatars/704992714109878312/36238cb1bb35c62b251691553f8380f3?size=128' height='100'><br>Neko</br></h1>
<p align="center">A multi-purpose Discord application to spice up your experiences.<br>Focus mainly on Anime, Fun and Utility.</br></p>
<p align="center">
  <a href="https://nodejs.org/api/esm.html/">
    <img src="https://i.imgur.com/JJkdjKu.png" height="36"/>
  </a>
  <a href="https://www.digitalocean.com/pricing/droplets/">
    <img src="https://i.imgur.com/9rZ8bLb.png" height="36"/>
  </a>
</p>

---
## About this project

As I grow out of being broke as a developer, this is my another attempt at making a gateway-based app.

Took me a week of time to get everything up again, this was a very fun rewrite.

Previous versions were exclusive for Cloudflare Workers, they're still working if you want them. Those versions are tagged, and easily findable.

---

## About the code & license

I don't expect the code to be readable or clean, a lot of logic stays behind an util function in [Utilities.js](/src/struct/Utilities.js). To ease out the process of maintaining and reading, I put comments on every functions in there.

License, [GPL-3.0 license](/LICENSE), read that file. I don't have any other requirements, this is a learning project pushed to production. A lot of secret keys are missing though, you should go find out what are those if you want to self-host.

---
## Database

Neko is using MongoDB.

The `mongoose` library proves to be useless as I dislike the idea of having small fragmented files just for schemas. And it's easier to extend with `mongodb`.

About where all the JSONs are, they are stored online as the ever-expanding need of custom responses. `n:point` serves as a very good and simple JSON bin - and you can directly access anything with only the ID that you can predefine. One thing to note though, you **must lock any JSON made there**.

The function to access all of them are defined as `Util#getStatic()`.

---
## Common questions

**Q:** 2 packages? Is this any good?

- You can go check for yourself. I hate flooding my stuff with packages I won't need 90% of each.

**Q:** 5 commands? Is this ANY good?

- I prefer making sub-commands. Doing this reduces the hassle of the command limit in the future.
- This is not a finished project, I'm still working on new stuff. Make an issue if you have an idea, I might get that in my bucket list.

**Q:** Why so terrible code writing?

- Some explanations of why I used certain "workarounds" and more chonky methods than normal should be on top of the line where those are located. Those are chonky with a reason!
- I'm known for my terrible code optimizations, and I lean towards readable code. I make my code even more readable with lots, lots of comments, so that when I read back, I know what did I think.
- Note that I lowercase and use abbreviations in most of my comments. I'm usually in a tired state when writing code, because I write code before going to bed. And I go to bed at around 1AM.

**Q:** I wanna ask questions!

- Maybe file an issue, I might be able to answer a clear concern. I want to make sure you know what to do.

**Q:** I wanna contribute! How to do that?

- That's great, there's a template ready for you to write a proper PR when you get on the tab, so there should be no major issues.
- I appreciate even tiny fixes about basically anything, so get going.