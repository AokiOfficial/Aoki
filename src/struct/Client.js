// we work with esmodule now
// commonjs is not recommended for serverless
// and we move from commonjs up anyway
import { YorClient } from "yor.ts";
import Settings from "./Settings";
// import commands
import TestCommand from "../cmd/test";
import FunCommand from "../cmd/fun";
import UtilCommand from "../cmd/utility";

export default class NekoClient extends YorClient {
  // we walk exactly like how we written server neko
  constructor(dev, env) {
    super({
      application: {
        id: env.APPID_DEV,
        publicKey: env.PUBKEY_DEV
      },
      token: env.TOKEN_DEV
    });
    this.settings = new Settings(this, env);
    this.env = env;
    this.dev = dev;
    this.util;
  }
  async start() {
    // because using fs is against cfworkers' global async i/o rule
    // we have to call every single command in here
    this.registerCommands([new TestCommand(), new FunCommand(), new UtilCommand()]);
  }
  async fetch(request, env, ctx) {
    // disallow any other method than post
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 })
    const url = new URL(request.url)
    const pathname = url.pathname
    // if we need to configure anything extra later
    // we can just make a file and serve it on a different endpoint
    // very convenient setup
    if (pathname.startsWith("/interactions")) {
      const promise = this.handleInteraction(request)
      ctx.waitUntil(promise)
      // before handling any command, parse this client's properties into ctx
      // so we can use these properties in any command
      // bad practice but it gotta be like that
      ctx.client = this;
      // handle the command
      try {
        const response = await promise
        return new Response(JSON.stringify(response))
      } catch (err) {
        console.log(err);
        // handmake an error message
        const reply = {
          type: 4,
          data: { 
            content: "Oh, that's bad. Something went... pretty horribly wrong just now.\n\nYell at my sensei by doing `/me feedback`, this should be fixed in a few working days." 
          }
        };
        // send the error message over
        return new Response(JSON.stringify(reply));
      }
    }
    // we have to pass this to discord endpoint when we update our commands
    // this will not work elsewhere
    if (pathname.startsWith("/deploy")) {
      try {
        const response = await this.deployCommands();
        return new Response(JSON.stringify(response));
      }
      catch (error) {
        return new Response(JSON.stringify(error));
      }
    }
    // disallow any other unimplemented endpoint use
    return new Response("Not found", { status: 404 })
  }
}