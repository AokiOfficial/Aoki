import Event from '../struct/handlers/Event.js';
import { ActivityType } from 'discord.js';
import { logOnReady } from '../assets/util/junk.js';

class ReadyEvent extends Event {
  constructor() {
    super('ready', true);
  }
  /**
   * Execute the event
   * @param {Object} client Client object
   */
  async execute(client) {
    if (!client.dev) {
      client.user.setPresence({ status: "online" });
      client.user.setActivity("/my info", { type: ActivityType.Custom });
    } else {
      client.user.setPresence({ status: "idle" });
      client.user.setActivity("I'm in development mode!", { type: ActivityType.Custom });
    };

    // anischedule
    await client.schedule.init();

    // post stats to dbl every start up (configure to restart every n hours)
    if (!client.dev) await client.poster.post();

    // log on ready
    logOnReady(client);
  };
}

export default new ReadyEvent();
