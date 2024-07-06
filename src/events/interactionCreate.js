import Event from '../struct/handlers/Event.js';

class InteractionCreateEvent extends Event {
  constructor() {
    super('interactionCreate');
  }
  /**
   * Execute the event
   * @param {Object} client Client object
   */
  async execute(client, i) {
    if (!i.isChatInputCommand()) return;

    const command = i.client.commands.get(i.commandName);
    if (!command) return await i.reply({ content: 'That command is probably gone. It\'ll disappear in a while.', ephemeral: true });;

    if (!command.hasPermissions(i)) {
      await i.reply({ content: 'Baka, you don\'t have the permissions to use this command.', ephemeral: true });
      return;
    }

    if (command.isOnCooldown(i.user.id)) {
      await i.reply({ 
        content: `Baka, I'm not a spamming machine. Try again in ${command.getRemainingCooldown(i.user.id)} seconds.`, 
        ephemeral: true 
      });
      return;
    }

    try {
      await command.execute(i);
      if (command.cooldown) command.setCooldown(i.user.id);
    } catch (error) {
      console.error(error);
      await i.reply({ 
        content: `Oh, something happened. Give my sensei a yell by doing \`/my fault\`:\n\n\`\`\`fix\n${error}\n\`\`\``, 
        ephemeral: true 
      });
    }
  }
}

export default new InteractionCreateEvent();
