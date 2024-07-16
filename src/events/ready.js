import Event from '../struct/handlers/Event.js';
import { ActivityType } from 'discord.js';

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
    setInterval(async () => await client.schedule.init(), 900000);

    // post stats to dbl if we're not using the test bot
    if (!client.dev) {
      setInterval(async () => {
        await client.poster.post();
      }, 21600000); // 6 hours
    };

    // Log on ready
    const channel = client.channels.cache.get("864096602952433665");
    channel.send({ content: `Woke up ${client.dev ? "for your development" : "to work"}.\n\nWorking with **${client.util.commatize(client.guilds.cache.size)}** servers, **${client.util.commatize(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}** users. Also reloaded **${client.commands.size}** commands.` })
      .catch(() => null);
  };
}

export default new ReadyEvent();
