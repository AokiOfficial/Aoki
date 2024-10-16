// the beginning of the future
import * as Bun from "bun";
import VerificationHandler from "./VerificationHandler";
import OsuGameHandler from "./OsuGameHandler";

export default class AokiWebAPI {
  constructor(client) {
    this.client = client;
    this.port = process.env.PORT;
    this.verificationHandler = new VerificationHandler(client);
    this.osuGameHandler = new OsuGameHandler(client);
    // ensures 'this' in _fetch always refer to this instance
    this._fetch = this._fetch.bind(this);
  }

  /**
   * Serve the API for verification
   */
  serve() {
    Bun.serve({
      port: this.port,
      fetch: this._fetch,
    });
  }

  /**
   * Internal method for Bun.serve()
   * @param {Object} req The request
   * @returns {Promise<Response>}
   */
  async _fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\//g, "");

    const routes = {
      login: () => this.verificationHandler.handleLogin(url),
      callback: () => this.verificationHandler.handleCallback(url),
      osuedit: () => this.osuGameHandler.handleOsuRedirect(url),
      osudirect: () => this.osuGameHandler.handleOsuDirect(url),
      verify: async () => await this.verificationHandler.verify(url),
      "": () => new Response("Why would you be here? I'll work on this later!"),
    };

    // checks if the url path exists in our routes
    return routes[path]?.() || new Response("Not Found", { status: 404 });
  }
}
