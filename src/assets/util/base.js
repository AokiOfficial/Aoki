// ref!: error handling
// <-->: block division
// /**/: useless? notes
import { SlashCommand } from "slash-create/web";
import { EmbedBuilder } from "@discordjs/builders";
import { fun } from "../assets/const/import";

export default class Fun extends SlashCommand {
  constructor(creator) { super(creator, fun) };
  // <--> main block
  async run(ctx) {
    this.ctx = ctx;
    // <--> get command and define utilities
    const sub = ctx.getSubcommand();
    const util = ctx.client.util;
    const query = ctx.getOption("query");
    // <--> run command in try...catch
    try {
      await ctx.defer();
      return await this[sub](ctx, query, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      };
    };
  };
  // <--> internal utilities
  async throw(content) {
    await this.ctx.send({ content });
    return Promise.reject();
  };
  get embed() {
    return new EmbedBuilder()
      .setColor(16777215)
      .setFooter({ text: `Requested by ${this.ctx.user.username}`, iconURL: this.ctx.user.dynamicAvatarURL("png") })
      .setTimestamp();
  };
}