import Client from "./struct/Client";
import "./struct/extends";

let client;

const getClient = (env) => {
  if (!client) { client = new Client(env); client.start() };
  return client;
};

export default {
  fetch: async (request, env, ctx) => getClient(env).fetch(request, env, ctx),
  scheduled: async (event, env, ctx) => getClient(env).cron(event, env, ctx)
};