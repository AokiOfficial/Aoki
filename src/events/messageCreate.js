import Event from '../struct/handlers/Event.js';

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
    if (!msg.author.settings.processMessagePermission) return;
    if (msg.author.bot) return;

    // match "hey aoki" or "yo aoki" or bot mention
    const prefixMatch = new RegExp(`^(?:(?:(?:hey|yo),? )?aoki,? )|^<@!?${client.user.id}>`, 'i').exec(msg.content);

    // if the message does not match the prefix or mention do nothing
    if (!prefixMatch) return;

    // extract the question
    const commandBody = msg.content.slice(prefixMatch[0].length).trim();
    if (!commandBody) return;

    // ask walpha to answer the question
    try {
      const url = `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(commandBody)}&appid=${process.env.WOLFRAM_KEY}&output=json`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("HTTP error, this is normal. Ask again later.");

      const data = await response.json();

      const answer = client.util.textTruncate(data.queryresult?.pods?.[1]?.subpods?.[0]?.plaintext, 1980).replace(/Wolfram\|Alpha/g, "Aoki") || "Can't answer that one.";
      msg.reply({ content: answer });
    } catch (error) {
      await msg.reply({ 
        content: `Oh, something happened. Give my sensei a yell by doing \`/my fault\`:\n\n\`\`\`fix\n${error}\n\`\`\``, 
        ephemeral: true 
      }).catch(() => {});
    }
  }
}

export default new MessageCreateEvent();
