import { createEvent } from 'seyfert';

export default createEvent({
  data: { once: false, name: 'messageCreate' },
  async run(msg, client) {
    if (msg.author.bot || !msg.guildId) return;
    const guild = await client.guilds.fetch(msg.guildId);
    if (!msg.author.settings.processMessagePermission) return;

    const prefixRegex = new RegExp(`^(?:(?:hey|yo),? aoki,? )|^<@!?${client.me?.id}>`, 'i');
    if (prefixRegex.test(msg.content)) {
      const prefixMatch = msg.content.match(prefixRegex);
      if (prefixMatch) {
        await client.utils.misc.wolframAnswerPlease(prefixMatch as RegExpExecArray, msg);
      }
      return;
    }

    const timestampChannel = guild.settings.timestampChannel;
    if (
      Array.isArray(timestampChannel) ? 
        timestampChannel.includes(msg.channelId) : 
        msg.channelId === timestampChannel
    ) {
      const timestampRegex = /(\d+):(\d{2}):(\d{3})\s*(\(((\d+(\|)?,?)+)\))?/gim;
      const timestamps = msg.content.match(timestampRegex);
      if (timestamps) {
        await client.utils.misc.followUpWithProperTimestamp(msg, timestamps, timestampRegex);
        return;
      }
    }
  }
})
