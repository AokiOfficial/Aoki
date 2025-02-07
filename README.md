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
## About this project

As I grow out of being broke as a developer, this is my another attempt at making a gateway-based app.

Took me a week of time to get everything up again, this was a very fun rewrite.

Previous versions were exclusive for Cloudflare Workers, they're still working if you want them. Those versions are tagged, and easily findable.

---

## About the code & license

A lot of logic stays behind a file, [Utilities.js](/src/struct/Utilities.js). I put comments on every function in there.

License, [GPL-3.0 license](/LICENSE). I don't have any other requirements, this is a learning project pushed to production. 

A lot of secret keys are missing though, you should go find out what are those if you want to self-host.

---
## Database

Aoki is using MongoDB.

It's easier to extend with `mongodb` library.

`n:point` is a simple JSON bin, you can access stuff with the ID they give. **Don't forget to lock them.**

---
## Common questions

**Q:** 3 packages?

- I hate flooding my stuff with packages I won't need 90% of each.

**Q:** 6 commands?

- I prefer making sub-commands.
- This is not a finished project, I'm still working on new stuff. Make an issue if you have an idea, I might get that in my bucket list.

**Q:** Why so terrible code quality?

- I lean towards readable code.
- I write code before going to bed. And I go to bed at around 1AM.

**Q:** I wanna ask questions!

- Maybe file an issue.

**Q:** I wanna contribute!

- Great, there's a template ready for you to write a proper PR when you get on the tab.