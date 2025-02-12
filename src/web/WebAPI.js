import fastify from 'fastify';
import VerificationHandler from "./VerificationHandler.js";
import OsuGameHandler from "./OsuGameHandler.js";

export default class AokiWebAPI {
  constructor(client) {
    this.client = client;
    this.port = process.env.PORT || 3000;
    this.verificationHandler = new VerificationHandler(client);
    this.osuGameHandler = new OsuGameHandler(client);
    this.URI = client.dev ? "http://localhost:8080" : "https://aoki.hackers.moe";
    this.server = fastify();
    this.setupRoutes();
  }

  setupRoutes() {
    const routes = [
      { path: '/login', handler: this.verificationHandler.handleLogin },
      { path: '/callback', handler: this.verificationHandler.handleCallback },
      { path: '/osuedit', handler: this.osuGameHandler.handleOsuRedirect },
      { path: '/osudirect', handler: this.osuGameHandler.handleOsuDirect },
      { path: '/verify', handler: this.verificationHandler.verify },
      { path: '/', handler: async () => "Why would you be here? I'll work on this later!" }
    ];

    routes.forEach(route => {
      this.server.get(route.path, async (request, reply) => {
        const url = new URL(`${this.URI}${request.url}`);
        return route.handler(url);
      });
    });

    this.server.setNotFoundHandler((request, reply) => {
      reply.status(404).send('Not Found');
    });
  }

  async serve() {
    try {
      await this.server.listen({ port: this.port });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}
