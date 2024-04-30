// we work with esmodule now
// slash-create/web is a web interface for discord apps
// so things like cfworkers or vercel serverless can work
// build issues will raise if you use the normal standard lib
import { SlashCreator, CloudflareWorkerServer } from "slash-create/web";
import Utility from "./Utilities";
import Database from "./Database";
import AniSchedule from "./Schedule";
import initSchema from "../assets/const/schema";
// import commands
import Fun from "../cmd/fun";
import Util from "../cmd/utility";
import My from "../cmd/my";
import Anime from "../cmd/anime";
import OsuGame from "../cmd/osugame";
import Social from "../cmd/social";
// import components
import store from "../menu/store";
import buy from "../menu/buy";
import acknowledged from "../menu/acknowledged";

export default class NekoClient extends SlashCreator {
  // we walk exactly like how we written server neko
  constructor(env) {
    // init the client
    super({
      applicationID: env.APPID,
      publicKey: env.PUBKEY,
      token: env.TOKEN
    });
    // indicating this app will run on cfworkers
    this.workers = new CloudflareWorkerServer();
    // env sent by the request
    this.env = env;
    // database prop
    // if it's not connected return null
    this.db = env.database;
    // database settings
    this.settings = {
      guilds: new Database(this, "guilds"),
      members: new Database(this, "members"),
      users: new Database(this, "users"),
    };
    // util
    // init this class and then use it everywhere
    this.util = new Utility(this, env);
  }
  async start() {
    // because using fs is against cfworkers' global async i/o rule
    // we have to call every single command in here
    // that probably yell'd "make more subcommands" strong enough
    this.withServer(this.workers).registerCommands([ Anime, Fun, My, Util, OsuGame, Social ]);
    // handle component interactions
    this.on('componentInteraction', async ctx => {
      // make a function map
      // later on we'll only have to import and add entries
      const functions = { "store": store, "buy": buy, "acknowledged": acknowledged };
      // select the according function
      const interaction = functions[ctx.customID];
      // execute the function
      return interaction.execute(ctx);
    });
    // handle other events
    // we'll only handle errors in prod
    this.on('error', (error) => console.error(error.stack || error.toString()));
    this.on('commandError', (command, error) =>
      console.error(`${command.commandName}:`, error.stack || error.toString())
    );
  };
  async cron(event, env, ctx) {
    if (event.cron == "0 */6 * * *") {
      // if there's no dbl token just skip it
      if (!env.DBL_TOKEN) return new Response("No DBL token present.");
      // else do the posting like normal
      const { approximate_guild_count } = await this.util.call({ method: "currentApplication" });
      const res = await fetch("https://top.gg/api/bots/stats", {
        method: "POST",
        headers: {
          Authorization: env["DBL_TOKEN"],
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          server_count: approximate_guild_count,
          shard_id: undefined,
          shard_count: 1
        })
      }).then(async res => await res.json());
      return new Response(JSON.stringify(res));
    } else if (event.cron == "0 */1 * * *") {
      const schedule = new AniSchedule(this);
      ctx.waitUntil(await schedule.init());
      return new Response(JSON.stringify("Done", { status: 200 }));
    };
  };
  // support for html page and database connection
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname;
    // init database
    await initSchema(env.database);
    // handle different paths
    if (pathname.startsWith("/interactions")) return this.workers.fetch(request, env, ctx);
    if (pathname.startsWith("/home")) {
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Neko</title><link href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAmazlAAcEdgCAgIAA////AHFxjQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREQAAAAAREREARERERAARM0REAgRERDMEQEQABEBEQAREBEREBERABERAREBERDAERARERARDMARAREREQDMwBEREREQzNTAEREREQ1NTMBBEQAAABVMBEEQBEREQMwERABEREREAEREBERERERAREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" rel="icon" type="image/x-icon"><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;700&display=swap" rel="stylesheet"><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet"><style>body{font-family:'Google Sans',sans-serif;background-color:#fdfd96;margin:0;padding:0;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;height:100vh;overflow:hidden;flex-direction:row;position:relative}.navbar{position:absolute;top:20px;left:20px;display:flex;align-items:center}.navbar-icon{width:40px;height:40px;border-radius:50%;background-image:url(https://i.imgur.com/FbzLt6F.png);background-size:cover;background-position:center;background-color:#333;margin-right:10px}.navbar-text{font-size:24px;font-weight:700;color:#333}.big-text{text-align:left;font-size:40px;padding-left:20px;white-space:nowrap;overflow:hidden;margin-bottom:10px;line-height:1.2}.main-text{font-size:60px;font-weight:700;margin-right:10px;margin-bottom:5px;align-self:flex-start;line-height:1.2}.only{font-weight:700}.discord-icon{height:80px;vertical-align:middle;margin-bottom:0}.delete-animation{animation:delete 2s steps(15,end) infinite;display:inline-block}@keyframes delete{0%{width:0}100%{width:100%}}.neko-image{height:500px;margin-left:20px;margin-right:20px}.icons{position:absolute;bottom:40px;left:0;width:100%;text-align:center}.icons a{margin:0 10px;color:#333;text-decoration:none;font-size:24px}.made-with-heart{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-size:18px;margin-bottom:10px}@media only screen and (max-width:600px){body{flex-direction:column;align-items:center;justify-content:center;height:auto}.big-text{font-size:30px;padding-left:10px}.main-text{font-size:40px}.discord-icon{height:60px}.neko-image{height:auto;width:80%;margin:20px 0}.icons{position:static;margin-bottom:20px}.made-with-heart{position:static;margin:20px 0}.navbar{top:10px;left:10px}.navbar-icon{width:30px;height:30px}.navbar-text{font-size:18px}}</style></head><body><div class="navbar"><div class="navbar-icon"></div><div class="navbar-text">Neko</div></div><div class="big-text"><div class="main-text">The <span class="only">only </span><img src="https://svgshare.com/i/14mu.svg" class="discord-icon" title="discord"> app</div><div id="text-animation" class="delete-animation"></div></div><div class="icons"><a href="https://github.com/NekoOfficial/Neko"><i class="fab fa-github"></i></a><a href="mailto:shimeji.rin@gmail.com"><i class="fas fa-envelope"></i></a></div><div class="made-with-heart">Made with ❤️ by Rin</div><img src="https://i.imgur.com/diyoRrd.png" class="neko-image"><script>const phrases=["with ✨ tsundere vibes","with ✨ customized responses","with ✨ silly economy games","with ✨ a full-fledged profile store","operating fully on ✨ Cloudflare"];let index=0,textElement=document.getElementById("text-animation");function typeDelete(){let e=phrases[index].split(""),t=0;e.forEach((n,l)=>{setTimeout(()=>{let t=textElement.innerHTML;t+=n,textElement.innerHTML=t,l===e.length-1&&setTimeout(deleteText,1e3)},t+=100)}),index=(index+1)%phrases.length}function deleteText(){let e=textElement.innerHTML,t=setInterval(()=>{e=e.slice(0,-1),textElement.innerHTML=e,""===e&&(clearInterval(t),setTimeout(typeDelete,500))},100)}typeDelete();</script></body></html>`;
      return new Response(html, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    };
    // disallow any other unimplemented endpoint use
    return new Response("Not found", { status: 404 })
  }
}