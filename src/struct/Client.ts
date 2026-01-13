import { Client, ClientEvent } from "seyfert";
import { MongoClient, ServerApiVersion } from "mongodb";
import { utils, cmds, events } from "@core";
import Settings from "./Settings";
import Schedule from "./Schedule";
import schema from "@assets/schema";

export default class AokiClient extends Client {
  constructor() {
    super({ allowedMentions: { parse: ['users'] } })
    this.dev = process.argv.includes('--dev');
    this.schedule = new Schedule(this);
    this.dbClient = null;
    this.db = null;
    this.lastGuildCount = null;
    this.startTime = Date.now();
    this.ready = false;
    this.osuV2Token = {
      access_token: null,
      expires_at: 0
    };
    this.settings = {
      users: new Settings(this, "users", schema.users),
      guilds: new Settings(this, "guilds", schema.guilds),
      schedules: new Settings(this, "schedules", schema.schedules),
      verifications: new Settings(this, "verifications", schema.verifications)
    };
    this.utils = {
      anilist: new utils.AnilistUtil(this),
      array: new utils.ArrayUtil(),
      misc: new utils.MiscUtil(),
      osu: new utils.OsuUtil(),
      profane: new utils.ProfaneUtil(),
      string: new utils.StringUtil(),
      time: new utils.TimeUtil(),
      dbl: new utils.DBL(this)
    };
  }

  /**
   * Load database
   * @returns {Promise<void>}
   */
  private async loadDatabase(): Promise<void> {
    const url = process.env.DB!;
    this.dbClient = await MongoClient.connect(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.logger.info("Connected to database");
    this.db = this.dbClient.db();

    await Promise.all(Object.values(this.settings).map(settings => settings.init()));
  };

  /**
   * Request an osu! API v2 token, then saves it.
   * Returns the token, or possibly nothing if there's an error.
   * @returns {Promise<string | null>}
   */
  public async requestV2Token(): Promise<string | null> {
    // Avoid spamming the osu api
    // If the token is still valid, return it
    if (this.osuV2Token && this.osuV2Token.expires_at || 0 > Date.now()) {
      return this.osuV2Token.access_token;
    }

    // Otherwise ask for it using our credentials
    const params = new URLSearchParams({
      client_id: this.dev ? process.env.OSU_DEV_ID! : process.env.OSU_ID!,
      client_secret: this.dev ? process.env.OSU_DEV_SECRET! : process.env.OSU_SECRET!,
      grant_type: 'client_credentials',
      scope: 'public'
    });

    const res = await fetch("https://osu.ppy.sh/oauth/token", {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await res.json();

    // Then save it for later fetches until the end of the cycle
    this.osuV2Token = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 60) * 1000
    };

    return data.access_token;
  };

  public async loadEssentials(): Promise<void> {
    // statically load cmds, locales and events
    // this makes our project buildable
    // @ts-ignore
    this.commands.set([cmds.Anime, cmds.Fun, cmds.My, cmds.OsuGame, cmds.Utility, cmds.Verify]);
    this.langs.set([
      { name: 'en-US', file: await import('../locales/en-US') },
      { name: 'vi', file: await import('../locales/vi') }
    ]);
    this.events.set(
      Object.entries(events).map(([name, event]) => ({
        data: { name, once: name === "botReady" },
        run: (i: any) => event.run(i, this, 1),
      })) as ClientEvent[],
    );
  }

  /**
   * Load everything
   * @returns {Promise<void>}
   */
  private async init(): Promise<void> {
    await Promise.all([
      this.loadDatabase(),
      this.requestV2Token(),
      this.loadEssentials()
    ]);
    // Load default locale
    this.setServices({ langs: { default: 'en-US' } });
    this.logger.info("Loaded baseline data");
  }

  /**
   * Log into client
   * @returns {Promise<string>}
   */
  public async login(): Promise<void> {
    await this.init();
    return super.start().then(() => super.uploadCommands());
  }
}
