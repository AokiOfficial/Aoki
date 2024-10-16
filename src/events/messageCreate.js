import Event from '../struct/handlers/Event.js';
import { wolframAnswerPlease, followUpWithProperTimestamp } from '../assets/util/junk.js';

class MessageCreateEvent extends Event {
  constructor() {
    super('messageCreate');
  }

  /**
   * Execute the event
   * @param {Object} client Client object
   * @param {Object} msg Message object from Discord
   */
  async execute(client, msg) {
    // if the settings for processing this user's messages is off, do nothing
    if (msg.author.bot || !msg.author.settings.processMessagePermission) return;

    // match "hey aoki" or "yo aoki" or bot mention
    const prefixMatch = new RegExp(`^(?:(?:(?:hey|yo),? )?aoki,? )|^<@!?${client.user.id}>`, 'i');
    // if the message does not match the prefix or mention do nothing
    if (prefixMatch.test(msg.content)) return await wolframAnswerPlease(msg);

    // match timestamp if the message is in the designated channel of the guild
    const timestampChannel = msg.guild.settings.timestampChannel;
    if (msg.channel.id == timestampChannel) {
      const timestampRegex = /(\d+):(\d{2}):(\d{3})\s*(\(((\d+(\|)?,?)+)\))?/gim;
      const timestamps = msg.content.match(timestampRegex);
      if (timestamps) return await followUpWithProperTimestamp(msg, timestamps, timestampRegex);
    };
  }
}

export default new MessageCreateEvent();
