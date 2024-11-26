import fastify from 'fastify';
import VerificationHandler from "./VerificationHandler";
import OsuGameHandler from "./OsuGameHandler";

export default class AokiWebAPI {
  constructor(client) {
    this.client = client;
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.verificationHandler = new VerificationHandler(client);
    this.osuGameHandler = new OsuGameHandler(client);
    this.URI = client.dev ? "http://localhost:8080" : "https://aoki.hackers.moe";

    this.server = fastify();
    this.setupRoutes();
  }

  /**
   * Setup routes for the API
   */
  setupRoutes() {
    this.server.get('/login', async (request, reply) => {
      const url = new URL(`${this.URI}${request.url}`);
      return this.verificationHandler.handleLogin(url);
    });

    this.server.get('/callback', async (request, reply) => {
      const url = new URL(`${this.URI}${request.url}`);
      return this.verificationHandler.handleCallback(url);
    });

    this.server.get('/osuedit', async (request, reply) => {
      const url = new URL(`${this.URI}${request.url}`);
      return this.osuGameHandler.handleOsuRedirect(url);
    });

    this.server.get('/osudirect', async (request, reply) => {
      const url = new URL(`${this.URI}${request.url}`);
      return this.osuGameHandler.handleOsuDirect(url);
    });

    this.server.get('/verify', async (request, reply) => {
      const url = new URL(`${this.URI}${request.url}`);
      return this.verificationHandler.verify(url);
    });

    this.server.get('/', async (request, reply) => {
      return "Why would you be here? I'll work on this later!";
    });

    this.server.setNotFoundHandler((request, reply) => {
      reply.status(404).send('Not Found');
    });
  }

  /**
   * Start the server
   */
  async serve() {
    try {
      await this.server.listen({ port: this.port });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}