// yor.ts just kinda handled 90% of this file
// I just want to work the way I did with djs
export default {
  /**
   * Gets a subcommand from API raw data
   * @returns `string` Subcommand name
   */
  getSubcommand() {
    if (this.subcommandGroup) {
      return this.subcommandGroup?.options[0].name;
    } else if (this.subcommand) {
      return this.subcommand?.name;
    }
    return this.raw?.data?.options?.name;
  },
  /**
   * Gets a subcommand group from API raw data
   * @returns `string` Subcommand group name
   */
  getSubcommandGroup() {
    return this.subcommandGroup?.name;
  },
  /**
   * Finds a string option from API raw data
   * @param { String } string The string option's name
   * @returns `String | undefined`
   */
  getString(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getStringOption(string);
    } else if (this.subcommand) {
      option = this.getStringOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getStringOption(string, 2);
    }
    return option;
  },
  /**
   * Finds a number option from API raw data
   * @param { String } string The number option's name
   * @returns `Number | undefined`
   */
  getNumber(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getNumberOption(string);
    } else if (this.subcommand) {
      option = this.getNumberOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getNumberOption(string, 2);
    }
    return option;
  },
  /**
   * Finds an integer option from API raw data
   * @param { String } string The integer option's name
   * @returns `Number | undefined`
   */
  getInteger(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getIntegerOption(string);
    } else if (this.subcommand) {
      option = this.getIntegerOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getIntegerOption(string, 2);
    }
    return option;
  },
  /**
   * Finds a boolean option from API raw data
   * @param { String } string The boolean option's name
   * @returns `Boolean | undefined`
   */
  getBoolean(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getBooleanOption(string);
    } else if (this.subcommand) {
      option = this.getBooleanOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getBooleanOption(string, 2);
    }
    return option;
  },
  /**
   * Finds a user option from API raw data
   * @param { String } string The user option's name
   * @returns `User | undefined`
   */
  getUser(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getUserOption(string);
    } else if (this.subcommand) {
      option = this.getUserOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getUserOption(string, 2);
    }
    return option.raw;
  },
  /**
   * Finds a role option from API raw data
   * @param { String } string The role option's name
   * @returns `Role | undefined`
   */
  getRole(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getRoleOption(string);
    } else if (this.subcommand) {
      option = this.getRoleOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getRoleOption(string, 2);
    }
    return option.raw;
  },
  /**
   * Finds a channel option from API raw data
   * @param { String } string The channel option's name
   * @returns `Channel | undefined`
   */
  getChannel(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getChannelOption(string);
    } else if (this.subcommand) {
      option = this.getChannelOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getChannelOption(string, 2);
    }
    return option.raw;
  },
  /**
   * Finds a member option from API raw data
   * @param { String } string The member option's name
   * @returns `Member | undefined`
   */
  getMember(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getMemberOption(string);
    } else if (this.subcommand) {
      option = this.getMemberOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getMemberOption(string, 2);
    }
    return option.raw;
  },
  /**
   * Finds an attachment option from API raw data
   * @param { String } string The attachment option's name
   * @returns `Attachment | undefined`
   */
  getAttachment(string) {
    let option;
    if (!this.subcommand && !this.subcommandGroup) {
      option = this.getAttachmentOption(string);
    } else if (this.subcommand) {
      option = this.getAttachmentOption(string, 1);
    } else if (this.subcommandGroup) {
      option = this.getAttachmentOption(string, 2);
    }
    return option.raw;
  }
}
