// resembles djs a little bit
export default {
  // replace ctx.creator by ctx.client for familiarity
  client() { return this.creator },
  async guild() {
    const guildId = this.guildID;
    // scope bind
    const c = this;
    // fetch the guild
    let guild = await this.creator.util.call({
      method: "guild",
      param: [guildId]
    });
    // super dodgy code piece
    guild = {
      get settings() {
        return c.creator.settings.guilds.get(guildId);
      },
      wipe() {
        return c.creator.settings.guilds.delete(guildId);
      },
      get schedules() {
        return (async () => {
          const query = await c.creator.db.prepare("SELECT * FROM guilds WHERE id = ?1;").bind(guildId).all();
          return query.results;
        })();
      },
      update(obj) {
        return c.creator.settings.guilds.update(guildId, obj);
      }
    };
    return guild;
  },
  /**
   * Gets a subcommand
   * @returns `string` Subcommand name
   */
  getSubcommand() {
    // get the raw subcommand array
    const subcommandRawArr = this.subcommands;
    // check if its size is 2+
    if (subcommandRawArr.length >= 2) {
      // if it is, return the last entry
      return subcommandRawArr[subcommandRawArr.length - 1];
    } else {
      // else return the first entry
      return subcommandRawArr[0];
    };
  },
  /**
   * Gets a subcommand group
   * @returns `string` Subcommand group name
   */
  getSubcommandGroup() {
    // get the raw subcommand array
    const subcommandRawArr = this.subcommands;
    // if there is no group return null
    // no group means that command is a subcommand
    if (subcommandRawArr.length == 1) return null;
    // else return first entry
    return subcommandRawArr[0];
  },
  /**
   * Finds a generic option
   * @param { String } string The option's name
   */
  getOption(name) {
    if (this.getSubcommandGroup()) return this.options[this.getSubcommandGroup()][this.getSubcommand()][name];
    return this.options[this.getSubcommand()][name] || null;
  },
  /**
   * Finds a user option
   * @param { String } string The user option's name
   * @returns `User | undefined`
   */
  getUser(string) {
    const query = this.getOption(string);
    return this.users.get(query);
  },
  /**
   * Finds a member option
   * @param { String } string The user option's name
   * @returns `User | undefined`
   */
  getMember(string) {
    const query = this.getOption(string);
    return this.members.get(query);
  },
  /**
   * Finds a role option
   * @param { String } string The role option's name
   * @returns `Role | undefined`
   */
  getRole(string) {
    const query = this.getOption(string);
    return this.roles.get(query);
  },
  /**
   * Finds a channel option
   * @param { String } string The channel option's name
   * @returns `Channel | undefined`
   */
  getChannel(string) {
    const query = this.getOption(string);
    return this.channels.get(query);
  },
  /**
   * Finds an attachment option
   * @param { String } string The attachment option's name
   * @returns `Attachment | undefined`
   */
  getAttachment(string) {
    const query = this.getOption(string);
    return this.attachments.get(query);
  }
}
