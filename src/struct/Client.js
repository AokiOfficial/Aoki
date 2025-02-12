import { Client, Collection, GatewayIntentBits, Options, Partials, REST, Routes } from 'discord.js';
import { MongoClient, ServerApiVersion } from "mongodb";
import { auth } from "osu-api";
import Settings from './Settings.js';
import Utilities from './Utilities.js';
import Schedule from './Schedule.js';
import AokiWebAPI from '../web/WebAPI.js';
import DBL from "./DBL.js";
import schema from '../assets/const/schema.js';
import processEvents from '../assets/util/exceptions.js';

class AokiClient extends Client {
  constructor(dev) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
      ],
      allowedMentions: { parse: ['users'] },
      partials: [Partials.Channel],
      sweepers: Options.DefaultSweeperSettings,
      makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        // limit cache to 200 guild members
        // keep only the bot's own member object if limit is exceeded
        GuildMemberManager: {
          maxSize: 200,
          keepOverLimit: member => member.id === this.user?.id
        },
        GuildScheduledEventManager: 0,
        GuildStickerManager: 0,
        MessageManager: {
          maxSize: 200,
          keepOverLimit: message => message.author.id === this.user?.id
        },
        PresenceManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: {
          maxSize: 200,
          keepOverLimit: user => user.id === this.user?.id
        },
        VoiceStateManager: 0
      })
    });
    this.commands = new Collection();
    this.events = new Collection();
    this.util = new Utilities(this);
    this.poster = new DBL(this);
    this.schedule = new Schedule(this);
    this.dev = dev;
    this.lastStats = null;
    this.dbClient = null;
    this.db = null;
    this.settings = {
      users: new Settings(this, "users", schema.users),
      members: new Settings(this, "members", schema.members),
      guilds: new Settings(this, "guilds", schema.guilds),
      schedules: new Settings(this, "schedules", schema.schedules),
      verifications: new Settings(this, "verifications", schema.verifications)
    };
    this.once("ready", this.onReady.bind(this));
    this.util.warn("Logging in...", "[Warn]");
  };
  /**
   * Load commands
   * @returns {Promise<void>}
   */
  async loadCommands() {
    const commands = [];

    const commandModules = await Promise.all([
      import('../cmd/anime.js'),
      import('../cmd/fun.js'),
      import('../cmd/my.js'),
      import('../cmd/osugame.js'),
      import('../cmd/utility.js'),
      import('../cmd/verify.js'),
    ]);

    for (const commandModule of commandModules) {
      const command = commandModule.default;
      this.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(this.dev ? process.env.TOKEN_DEV : process.env.TOKEN);

    if (this.dev) {
      rest.put(Routes.applicationGuildCommands(process.env.APPID_DEV, process.env.GUILD), { body: commands })
        .catch(console.error);
    } else {
      rest.put(Routes.applicationCommands(process.env.APPID), { body: commands })
        .catch(console.error);
    }
  }

  /**
   * Load events
   * @returns {Promise<void>}
   */
  async loadEvents() {
    const eventModules = await Promise.all([
      import('../events/interactionCreate.js'),
      import('../events/messageCreate.js'),
      import('../events/ready.js'),
    ]);

    for (const eventModule of eventModules) {
      const event = eventModule.default;
      this.events.set(event.name, event);

      if (event.once) {
        this.once(event.name, (...args) => event.execute(this, ...args));
      } else {
        this.on(event.name, (...args) => event.execute(this, ...args));
      }
    }
  }
  /**
   * Listen to internal exception throws
   * @param {Array} events Exception names
   * @param {Object} config To ignore exceptions or not
   */
  listenToProcess(events = [], config = {}) {
    for (const event of events) {
      process.on(event, (...args) => {
        if (config.ignore && typeof config.ignore === "boolean") return;
        else return processEvents(event, args, this);
      });
    }
  };
  /**
   * Set ready status after emitting event
   * @returns {Promise<void>}
   */
  onReady() {
    this.ready = true;
    this.util.success(`Logged in as ${this.user.username}`, "[Client]");
  };
  /**
   * Load everything
   * @returns {Promise<void>}
   */
  async init() {
    this.listenToProcess(['unhandledRejection', 'uncaughtException'], { ignore: false });
    await this.loadCommands();
    this.loadEvents();

    const url = process.env.MONGO_KEY;
    this.dbClient = await MongoClient.connect(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.util.success("Connected to database", "[Database]");
    this.db = this.dbClient.db();
    
    for (const [_, settings] of Object.entries(this.settings)) { await settings.init() };

    await auth.login({
      type: 'v2',
      client_id: this.dev ? process.env.OSU_DEV_ID : process.env.OSU_ID,
      client_secret: this.dev ? process.env.OSU_DEV_SECRET : process.env.OSU_SECRET
    });
    await auth.login({
      type: 'v1',
      api_key: process.env.OSU_KEY
    });

    this.util.success("osu! API authorized", "[osu!]");

    new AokiWebAPI(this).serve();

    this.util.success("Loaded commands, settings and web server", "[General]");
  };
  /**
   * Log into client
   * @returns {Promise<void>}
   */
  async login() {
    await this.init();
    return super.login(this.dev ? process.env.TOKEN_DEV : process.env.TOKEN);
  };
}

export default AokiClient;
