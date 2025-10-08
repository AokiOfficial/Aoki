import { createEvent } from 'seyfert';
import { ActivityType, PresenceUpdateStatus } from 'seyfert/lib/types';
 
export default createEvent({
  data: { once: true, name: 'botReady' },
  async run(_, client) {
    // status
    client.gateway.setPresence({
      status: PresenceUpdateStatus.Online,
      activities: [{ name: "the annihilation...", type: ActivityType.Watching }],
      since: null,
      afk: false
    });
    // anischedule
    await client.schedule.init();
    // post stats to dbl every start up (configure to restart every n hours)
    if (!client.dev) await client.utils.dbl.post();
    // log on ready
    await client.utils.misc.logOnReady(client);
  }
})
