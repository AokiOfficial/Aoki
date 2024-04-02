import { YorInteractionComponent, User, Channel } from "yor.ts";
import { MessageFlags } from "discord-api-types/v10";
import { EmbedBuilder } from "@discordjs/builders";

export default class Acknowledged extends YorInteractionComponent {
  id = "acknowledged"
  execute = async ctx => {
    // define util
    const util = ctx.client.util;
    // define settings
    // yor.ts somehow messed up this part of the request
    // so we have to implement user manually here
    const user = new User(ctx.client, ctx.member.raw.user);
    ctx.user = user;
    // defer reply
    await ctx.defer();
    // define what option is selected
    const option = ctx.raw.data.values[0];
    // if they picked ignore don't do anything
    if (option.toLowerCase() == "ignore") return;
    // now get executor id;
    // if user trying to confirm is not executor
    const executor = option.split("-")[1];
    if (ctx.member.raw.user.id != executor) return await ctx.followUp({ content: "You cannot confirm on behalf of the executor, baka.", flags: MessageFlags.Ephemeral });
    // else forward the request to us
    // get channel
    const channelRawData = await util.call({
      method: "channel",
      param: [util.logChannel]
    });
    // to use the send method
    // we must init the channel class
    const channel = new Channel(ctx.client, channelRawData);
    // make embed
    const guildId = option.split("-")[0];
    const feedbackEmbed = new EmbedBuilder()
      .setTitle(`New Beta request`)
      .setThumbnail("https://i.imgur.com/1xMJ0Ew.png")
      .setFooter({ text: "Helpful things for you, sensei!", iconURL: util.getUserAvatar(ctx.member.raw.user) })
      .setColor(16711680).setTimestamp()
      .setDescription(`*Sent by **${ctx.member.raw.user.username}***\n\n**Description:** Beta request for guild ID ${guildId}.`)
    // send that to the log channel
    await channel.send({ embeds: [feedbackEmbed] });
    // and let the user know
    // along with that destroy the select menu
    await ctx.editReply({ content: "Your beta request has been forwarded to my sensei. Please check your beta status in several hours.", components: [], embeds: [] });
  }
}