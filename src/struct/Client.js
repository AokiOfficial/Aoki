import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { MongoClient, ServerApiVersion } from "mongodb";
import Settings from './Settings.js';
import Utilities from './Utilities.js';
import Schedule from './Schedule.js';
import DBL from "./DBL.js";
import schema from '../assets/const/schema.js';
import processEvents from '../assets/util/exceptions.js';
import fs from 'fs';

class NekoClient extends Client {
  constructor(dev) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
      ],
      allowedMentions: { parse: ['users'] },
      partials: [Partials.Channel]
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
      schedules: new Settings(this, "schedules", schema.schedules)
    };
    this.once("ready", this.onReady.bind(this));
    this.util.warn("Logging in...", "[Warn]");
  };
  /**
   * Load commands
   * @returns `void`
   */
  async loadCommands() {
    const commandFiles = fs.readdirSync(`${process.cwd()}/src/cmd`).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
      await import(`../cmd/${file}`).then((command) => {
        this.commands.set(command.default.data.name, command.default);
        commands.push(command.default.data.toJSON());
      });
    }

    const rest = new REST({ version: '10' }).setToken(this.dev ? process.env.TOKEN_DEV : process.env.TOKEN);

    if (this.dev) {
      rest.put(Routes.applicationGuildCommands(process.env.APPID_DEV, process.env.GUILD), { body: commands })
        .catch(console.error);
    } else {
      rest.put(Routes.applicationCommands(process.env.APPID), { body: commands })
        .catch(console.error);
    };
  };
  /**
   * Load events
   * @returns `void`
   */
  loadEvents() {
    const eventFiles = fs.readdirSync(`${process.cwd()}/src/events`).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      import(`../events/${file}`).then((event) => {
        this.events.set(event.default.name, event.default);

        if (event.default.once) {
          this.once(event.default.name, (...args) => event.default.execute(this, ...args));
        } else {
          this.on(event.default.name, (...args) => event.default.execute(this, ...args));
        }
      });
    }
  };
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
   * @returns `void`
   */
  onReady() {
    this.ready = true;
    this.util.success(`Logged in as ${this.user.username}`, "[Client]");
  };
  /**
   * Load everything
   * @returns `void`
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
    this.util.success("Loaded commands and settings", "[General]");
  };
  /**
   * Log into client
   * @returns `void`
   */
  async login() {
    await this.init();
    return super.login(this.dev ? process.env.TOKEN_DEV : process.env.TOKEN);
  };
}

export default NekoClient;
