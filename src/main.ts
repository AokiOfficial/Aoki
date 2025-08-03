import AokiClient from "@struct/Client";
import '@struct/extenders';
const client = new AokiClient();
await client.login();

Bun.serve({
  port: 8080,
  fetch(_) {
    return new Response("I'm on an air balloon!!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
});
