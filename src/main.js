// entry file
import Client from "./struct/Client";
import "./struct/extends";

// expose a client variable
// we will only make a new client when no client is available
let client;

// we have to expose a default "fetch" function for cloudflare to call
// when it receives a yell from discord
// so we have to put it in the main file so cf knows it"s there and not somewhere else
export default {
  fetch: async (request, env, ctx) => {
    // make a new client when no client is available
    if (!client) { client = new Client(env); client.start() };
    // then run the main thing
    return await client.fetch(request, env, ctx);
  },
  scheduled: async (event, env, ctx) => {
    // just some cron jobs here
    if (!client) { client = new Client(env); client.start() };
    return await client.cron(event, env, ctx);
  }
};