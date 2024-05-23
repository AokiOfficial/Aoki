import { MessageFlags } from "discord-api-types/v10";
import { EmbedBuilder } from "@discordjs/builders";

export default {
  execute: async ctx => {
    // <--> utilities
    const util = ctx.creator.util;
    const option = ctx.values[0];
    if (option.toLowerCase() == "ignore") return;
    const executor = option.split("-")[1];
    if (ctx.user.id != executor) return await ctx.send({ content: "You cannot confirm on behalf of the executor, baka.", flags: MessageFlags.Ephemeral });
    // <--> make embed
    const guildId = option.split("-")[0];
    const feedbackEmbed = new EmbedBuilder()
      .setTitle(`New Beta request`)
      .setThumbnail("https://i.imgur.com/1xMJ0Ew.png")
      .setFooter({ text: "Helpful things for you, sensei!", iconURL: ctx.user.dynamicAvatarURL("png") })
      .setColor(16711680).setTimestamp()
      .setDescription(`*Sent by **${ctx.user.username}***\n\n**Description:** Beta request for guild ID ${guildId}.`)
    // <--> send messages
    await util.call({
      method: "channelMessages",
      param: [util.logChannel]
    }, {
      method: "POST",
      body: { embeds: [feedbackEmbed.toJSON()] }
    });
    await ctx.editParent({ content: "Your beta request has been forwarded to my sensei. Please check your beta status in several hours.", components: [], embeds: [] });
  }
}