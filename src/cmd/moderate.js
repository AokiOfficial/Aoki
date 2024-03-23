// the very first file we're interacting with the new db
import { Emoji, YorSlashCommand, Channel, Guild } from "yor.ts";
import { EmbedBuilder } from "@discordjs/builders";
import { moderate } from "../assets/const/import";
import { DiscordSnowflake } from "@sapphire/snowflake";
// permission flags
import PermissionsBitField from "../struct/discord/PermissionsBitField";

export default class Moderate extends YorSlashCommand {
  builder = moderate
  execute = async ctx => {
    // define util
    const util = ctx.client.util;
    // defer reply
    await ctx.defer();
    // get default values
    const reason = ctx.getString("reason");
    const notify = ctx.getBoolean("notify");
    // get subcommand
    const sub = ctx.getSubcommand();
    // util function for user check 
    // avoid repetitive code
    const userCheck = async (member) => {
      // check if user is valid
      // get guild owner id
      const { name, owner_id } = await util.call({
        method: "guild",
        param: [ctx.member.raw.guildID]
      });
      // edge case
      if (!member) return await ctx.editReply({ content: "Hey, they're not here. I suppose they left before you did anything, slowie." });
      // if member is author
      if (member.raw.user.id == ctx.member.raw.user.id) return await ctx.editReply({ content: "Baka, don't you dare. You're a weird person." });
      // if member is guild owner
      if (member.raw.user.id == owner_id) return await ctx.editReply({ content: "You baka, that's not funny." });
      // if member is this bot
      if (member.raw.user.id == util.id) return await ctx.editReply({ content: "I'm gonna write that to your records instead, you baka." });
      // if member is a bot
      if (member.user.isBot()) return await ctx.editReply({ content: "Why would you even warn a bot, baka." });
      // get member highest role
      const memberHighestRolePosition = (member.raw.roles.sort((prev, role) => (prev.position < role.position)))[0].position;
      // get author highest role
      const authorHighestRolePosition = (ctx.member.raw.roles.sort((prev, role) => (prev.position < role.position)))[0].position;
      // compare
      if (memberHighestRolePosition >= authorHighestRolePosition) return ctx.editReply({ content: `Hey, let me tell you something. They have ${memberHighestRolePosition > authorHighestRolePosition ? "the higher role than you, baka. Be careful." : "the same role as you, baka."}` });
      // check reason length
      if (reason && reason > 100) return await ctx.editReply({ content: "Baka, are you trying to sneak in your homework essay? Keep it under 100 words, please!" });
      return name;
    };
    // commands
    if (sub == "warn") {
      // because directly calling getMember will not return user id
      // for some reason,
      // we're getting user first 
      // then fetch the member, finally initializing member class
      // check all the logic in the extend file
      const member = await ctx.getMember("member");
      // safety step
      // if user has no record write it in initially
      // the other two values must be a string because d1 does not
      // support bigints yet
      // and current snowflake has already exceeded the MAX_SAFE_INTEGER
      if (!member.settings) await member.update({ infraction: 0, lastInfractionMessageChannel: "0", lastInfractionMessageId: "0" });
      console.log(member.settings);
      // increment base
      const increment = member.settings.infraction + 1;
      // check user
      const name = await userCheck(member);
      // name.id is sign of a reply
      // which means something was returned beforehand
      if (name.id) return;
      // d1's array is not usable with our current db structure
      // we're using another approach here is to store message link
      // we're going to send a message with the infraction data
      // and take the id to redirect them if they forget
      const prevInfraction = member.settings.lastInfractionMessageChannel == 0 ? "" : `\n- Your last infraction report can be found [here](<https://discord.com/channels/${ctx.member.raw.guildID}/${member.settings.lastInfractionMessageChannel}/${member.settings.lastInfractionMessageId}>).`;
      // send the message containing data
      // format hell
      await ctx.editReply({ content: `${notify ? `<@${member.raw.user.id}>` : `**${member.raw.user.id}**`}, baka, wake up. This is your warning report.\n\n- This is your **${util.ordinalize(increment)}** infraction.\n- This warning was invoked by **${ctx.member.raw.user.username}**.\n- This warning was invoked on <t:${Math.floor(+new Date / 1000)}:F>\n- They warned you with this reason:\n\`\`\`fix\n${reason}\`\`\`${prevInfraction}\n\n*Please **do not** delete this message. This message is used to keep track of this baka's infractions.*` });
      const interaction = await ctx.fetchReply();
      // save it and check the entry
      await member.update({ infraction: increment, lastInfractionMessageChannel: ctx.channel.id.toString(), lastInfractionMessageId: interaction.id.toString() }).then(async () => {
        console.log(member.settings);
        if (!increment == member.settings.infraction)
          await ctx.editReply({ content: "Database is probably out of reach right now. This should not happen.\n\nTry again in 5 minutes, and if nothing changes, use `/my fault`." });
      });
    } else if (sub == "ban") {
      const member = await ctx.getMember("member");
      // safety step
      // if user has no record write it in initially
      if (!member.settings) await member.update({ infraction: 0, lastInfractionMessageChannel: "0", lastInfractionMessageId: "0" });
      // increment base
      const increment = member.settings.infraction + 1;
      // check member and get guild name
      const name = await userCheck(member);
      // name.id means a message was sent instead
      if (name.id) return;
      // check author permission
      if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.BanMembers)) return await ctx.editReply({ content: "Baka, you don't have permissions to do that." });
      // proceed with the ban
      await member.ban({ reason: reason });
      // send an indicator
      await ctx.editReply({ content: "Proceeding with the ban..." });
      const interaction = await ctx.fetchReply();
      // fetch reply for id
      // save it and check the entry
      await member.update({ infraction: increment, lastInfractionMessageChannel: ctx.channel.id.toString(), lastInfractionMessageId: interaction.id.toString() }).then(async () => {
        if (increment == member.settings.infraction) {
          // create dm channel with the user
          let DMChannel = await member.user.createDM();
          DMChannel = new Channel(ctx.client, DMChannel);
          // send a message in there
          // if we can't send it just gracefully ignore
          await DMChannel.send({ content: `<@${member.raw.user.id}>, you've been banned from **${name}** by **${ctx.member.raw.user.username}**!\n\n- Your infraction count until before the ban was **${increment - 1}**.\n- You've been banned for this reason:\n\`\`\`fix\n${reason}\n\`\`\`` }).catch(() => {});
          // then send an indicator
          await ctx.editReply({ content: `The hammer has spoken, <@${member.raw.user.id}> is banned. Lift it up later some time, sad to see them go.` })
        } else {
          await ctx.editReply({ content: "Database is probably out of reach right now. This should not happen.\n\nTry again in 5 minutes, and if nothing changes, use `/my fault`." });
        }
      });
    } else if (sub == "clear") {
      // get stuff
      const { channel, member } = ctx;
      // because we're deferring our own reply
      // we have to add one so it deletes the deferred reply and the actual message
      // applies for cases when user hilariously specify 1 message
      const amount = ctx.getInteger("number") + 1;
      // check for permissions
      // permissions is a mock and requires fetching the api
      // for the owner id, which is why it's awaited
      if (!(await member.permissions).has(PermissionsBitField.Flags.ManageMessages)) {
        return await ctx.editReply({ content: "Baka, you can't do that. You're missing the permission to manage messages." });
      }
      // check amount
      if (amount < 1 || amount > 99) {
        return await ctx.editReply({ content: `Baka, ${amount < 1 ? "the least you can do is 1 message." : "the limit is 99 messages."}` });
      }
      // fetch the messages
      const messages = await channel.fetchMessages({ limit: amount });
      // filter the array for messages younger than 2 weeks old
      const passedMessagesArray = messages.filter(message => Date.now() - DiscordSnowflake.timestampFrom(message.id) < 1209600000);
      // if all messages are more than 2 weeks old
      if (passedMessagesArray.length === 0) {
        return await ctx.editReply({ content: "Baka, all messages are more than 2 weeks old." });
      }
      // map the id of the messages to pass to api call
      const messagesIdArray = passedMessagesArray.map(message => message.id);
      // if user specified 1 message
      if (messagesIdArray.length === 1) {
        await util.call({ method: "channelMessage", param: [channel.id, messagesIdArray[0]] }, { method: "DELETE" });
      } else {
        await channel.bulkDeleteMessages(messagesIdArray);
      }
      const deletedCount = messagesIdArray.length - 1;
      // grammar check
      await ctx.channel.send({ content: `Deleted **${deletedCount}** message${deletedCount == 1 ? "" : "s"} from this channel.` });
    } else if (sub == "wipe") {
      // get channel
      const channel = ctx.getChannel("channel");
      // check user permission
      if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.ManageChannels)) {
        return await ctx.editReply({ content: "Baka, you can't do that. You're missing the permission to manage channels." });
      };
      // currently we only support wiping a text or voice channel
      // return no for others
      if (!["0", "2"].includes(channel.raw.type.toString())) return await ctx.editReply({ content: "Only text and voice channels can be wiped by now, sorry." });
      // check if this channel is of a special type
      // fetch guild first
      const guild = await util.call({
        method: "guild",
        param: [ctx.member.raw.guildID]
      });
      // check
      if ([guild.system_channel_id, guild.rules_channel_id, guild.public_update_channel_id].includes(channel.raw.id)) return await ctx.editReply({ content: "Baka, that's a special channel. I can't clone that one.\n\n*Special types of channels: **System channels**, **Rules channel** and **Public Update channels**.*" });
      // send an initial message
      await ctx.editReply({ content: "I'm doing some job in the background, go get a cup of tea and wait until I respond again." });
      await new Promise(resolve => setTimeout(resolve, 5000))
      await ctx.deleteReply();
      // delete the channel
      const data = await channel.delete().catch(() => {});
      // if channel is not deletable
      if (!data) return await ctx.editReply({ content: "My permissions are either:\n\n- Configured incorrectly on this server/channel;\n- Configured incorrectly internally.\n\nIf the latter is the case, use `/my fault`." });
      // shortcut
      const {
        name,
        type,
        position,
        topic,
        nsfw,
        bitrate,
        user_limit,
        parent_id,
        permission_overwrites,
        rate_limit_per_user,
        default_auto_archive_duration,
        rtc_region,
        video_quality_mode
      } = channel.raw;
      // create new channel
      const classGuild = new Guild(ctx.client, guild);
      const created = await classGuild.createChannel({
        reason: `${ctx.member.raw.user.username}: channel wipe`,
        name,
        type,
        position,
        topic,
        nsfw,
        bitrate,
        user_limit,
        parent_id,
        permission_overwrites,
        rate_limit_per_user,
        default_auto_archive_duration,
        rtc_region,
        video_quality_mode
      });
      // send indicator
      await created.send({ content: `*This channel was wiped. Requested by **${ctx.member.raw.user.username}**, on **<t:${Math.floor(+new Date / 1000)}:F>***` });
    } else if (sub == "kick") {
      const member = await ctx.getMember("member");
      // safety step
      // if user has no record write it in initially
      if (!member.settings) await member.update({ infraction: 0, lastInfractionMessageChannel: "0", lastInfractionMessageId: "0" });
      // increment base
      const increment = member.settings.infraction + 1;
      // check member and get guild name
      const name = await userCheck(member);
      // name.id means a message was sent instead
      if (name.id) return;
      // check author permission
      if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.KickMembers)) return await ctx.editReply({ content: "Baka, you don't have permissions to do that." });
      // proceed with the ban
      await member.kick({ reason: reason });
      // send an indicator
      await ctx.editReply({ content: "Proceeding with the kick..." });
      const interaction = await ctx.fetchReply();
      // fetch reply for id
      // save it and check the entry
      await member.update({ infraction: increment, lastInfractionMessageChannel: ctx.channel.id.toString(), lastInfractionMessageId: interaction.id.toString() }).then(async () => {
        if (increment == member.settings.infraction) {
          // create dm channel with the user
          let DMChannel = await member.user.createDM();
          DMChannel = new Channel(ctx.client, DMChannel);
          // send a message in there
          // if we can't send it just gracefully ignore
          await DMChannel.send({ content: `<@${member.raw.user.id}>, you've been kicked from **${name}** by **${ctx.member.raw.user.username}**!\n\n- Your infraction count until before the kick was **${increment - 1}**.\n- You've been kicked for this reason:\n\`\`\`fix\n${reason}\n\`\`\`` }).catch(() => {});
          // then send an indicator
          await ctx.editReply({ content: `That was a pretty painful kick. <@${member.raw.user.id}> is gone, and this is their **${util.ordinalize(increment)}** infraction.` });
        } else {
          await ctx.editReply({ content: "Database is probably out of reach right now. This should not happen.\n\nTry again in 5 minutes, and if nothing changes, use `/my fault`." });
        }
      });
    }
  }
}