// ping
// we have to handle ping very carefully
// because the Date.now() that cfworkers return
// is locked in place after the execution
const pingmsg = ["Ugh, again? You always wanna bother me. I responded in **{{ms}}ms**.", "Baka, I responded in **{{ms}}ms**.", "Here you go, I responded in **{{ms}}ms**. Not like I wanted to waste my time.", "Here you go, not that it was worth my time. It only took me **{{ms}}ms**.", "Is this right? I've responded in **{{ms}}ms**.", "**{{user}}**? I've responded in **{{ms}}ms**.", "**{{user}}**! You wasted **{{ms}}ms** of my time, ERGH.", "Did I do it right? I responded in **{{ms}}ms**.", "**{{user}}**, yes I'm here, and it took me **{{ms}}ms** to respond.", "**{{user}}**, why are you pinging me? You wasted **{{ms}}ms** of my time.", "Hey **{{user}}**, it took me **{{ms}}ms** to send this message", "You've made me **{{ms}}ms** older - just from asking.", "**{{user}}**, I've seen your message and it took me **{{ms}}ms** not to care.", "Do you know how long it took me to read that message? You pretty much wasted **{{ms}}ms** of my day!", "I responded in **{{ms}}ms**, you happy now?"];
// because eval() is not allowed to be used
// as cfworkers docs stated it is not secure
// we skip that command
import { my } from "../assets/const/import";
import { YorSlashCommand, Channel, Guild } from "yor.ts";
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder as MenuBuilder,
  StringSelectMenuOptionBuilder as MenuOptionBuilder
} from "@discordjs/builders";
import PermissionsBitField from "../struct/discord/PermissionsBitField";

export default class My extends YorSlashCommand {
  builder = my
  execute = async ctx => {
    // util shortcut
    const util = ctx.client.util;
    // get universal command query
    const query = ctx.getString("query");
    // get sub
    const sub = ctx.getSubcommand();
    // commands
    if (sub == "ping") {
      // send an initial reply
      await ctx.reply({ content: "Pinging..." });
      // fetch the reply to get created id
      const msg = await ctx.fetchReply();
      // then edit the reply right away
      // calculate the time taken
      const timeTaken = Date.now() - util.getCreatedTimestamp(msg.id);
      // edit the reply with the ping in it
      // use multiple replies
      const pick = Math.floor(Math.random() * 15);
      await ctx.editReply({ content: pingmsg[pick].replace(/{{user}}/g, ctx.member.raw.user.username).replace(/{{ms}}/g, `${timeTaken}`) })
    } else {
      // only now we defer the reply
      await ctx.defer();
      if (sub == "terms") {
        // just some shortened terms of service
        // this is mainly for convenience
        const termsEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setTitle("Neko - Terms of Service")
          .setThumbnail("https://i.imgur.com/jdAeUUd.png")
          .setFooter({ text: "Last edited 15/8/2022", iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setDescription("Neko has access to the End User Data through the **Discord API** (as listed on Neko's detailed profile), but Neko **does not collect, use and/or disclose** End User Data **except (a)** as necessary to exercise your rights under this Agreement, **(b)** in accordance with Discord’s Privacy Policy.\n\n" +
            "We will **never** sell, license or otherwise commercialize any End User Data. Neither will we ever use End User Data to target End Users for marketing or advertising purposes. We will **never** even disclose any End User Data to any ad network, data broker or other advertising or monetization related service.\n\n" +
            "End User Data will be retained **only** as necessary to provide the defined functionality of the Application and nothing more.\n\n" +
            "We ensure that all End User Data is stored using reasonable security measures and we take reasonable steps to secure End User Data.\n\n" +
            "By using Neko, you **expressly agree** to this Agreement. And by using Discord, you **expressly agree** to Discord’s Terms of Service, Guidelines and Privacy Policy.\n\n" +
            "To read our **full** Terms of Service, refer [here](https://github.com/NekoOfficial/Terms-and-Policy/blob/main/Terms%20of%20Service.md). For our **full** Privacy Policy, refer [here](https://github.com/NekoOfficial/Terms-and-Policy/blob/main/Privacy%20Policy.md).\n\n" +
            "*“End User Data” means all data associated with the content within the functionality enabled by the Discord API, including but not limited to message content, message metadata, voice data and voice metadata.*")
        await ctx.editReply({ embeds: [termsEmbed] });
      } else if (sub == "vote") {
        const voteTitle = ["Vote? Sweet.", "You finally decided to show up?", "Oh, hi. I'm busy, so get it done.", "Not like I'm not busy, but sure."]
        const voteResponse = voteTitle[Math.round(Math.random() * voteTitle.length)] + ` [Do that here.](<https://top.gg/bot/https://top.gg/bot/704992714109878312>)` + "\n\n||If you decided to vote, thank you. You'll get extra perks in the future.||";
        await ctx.editReply({ content: voteResponse });
      } else if (sub == "beta") {
        // no new beta feature for now
        return await ctx.editReply({ content: "There is no beta feature at the moment." });
        // check if they are already in beta
        let guild = await util.call({ method: "guild", param: [ctx.member.raw.guildID] });
        guild = new Guild(ctx.client, guild);
        if (guild.settings && guild.settings.beta) return await ctx.editReply({ content: "Your server is in beta." });
        // check user permission
        if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.Administrator)) return await ctx.editReply({ content: "Baka, only server administrators can proceed on behalf of the server owner." });
        // send an info card
        const infoCard = new EmbedBuilder()
          .setColor(16711680)
          .setTitle(`Special Terms of Neko Beta`)
          .setThumbnail("https://i.imgur.com/1xMJ0Ew.png")
          .setFooter({ text: "Please read this carefully.", iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setDescription(
            "*You are reading a **special Terms** for **Neko Beta**. Please read these carefully before proceeding.*\n\n" +
            "Every single Standard Terms condition (readable by doing `/my terms`) applies while you use Neko Beta, along with some extra conditions listed below.\n\n" +
            "- The owner of this server is **always** held responsible for all types of abusive behaviors of exploits/breaches/unintended behaviors (if any) of the Beta version investigated to be coming from this server.\n" +
            "- Any member, shall they find any kind of exploits/breaches/unintended behaviors (if any), must send a description of them by doing `/my fault`. Failing to do so will lead to an investigation of data inconsistencies, leading to a possible End of Service on **any party** (server-wise, and/or user-wise).\n" +
            "- As an owner, by agreeing to this Special Terms of Neko Beta and therefore enrolling in the Beta Program, also shall understand that the Beta may end at **any given point of time**, with the reason being explicitly stated on the Support Server.\n\n" +
            "Failing to adhere to these Special Terms may lead to an investigation."
          )
        // make select menu
        // this is to keep track of who clicked what
        // which buttons cannot do
        const confirm = new MenuBuilder()
          .setCustomId("acknowledged")
          .setPlaceholder("Confirm Box")
          .addOptions([
            new MenuOptionBuilder()
              .setLabel("I understand and wish to continue")
              .setDescription("I'll send the request to sensei.")
              .setValue(`${ctx.member.raw.guildID}-${ctx.member.raw.user.id}`),
            new MenuOptionBuilder()
              .setLabel("Ignore")
              .setDescription("So you don't misclick.")
              .setValue("ignore")
          ]);
        const action = new ActionRowBuilder().addComponents(confirm);
        // send both of them
        await ctx.editReply({ embeds: [infoCard], components: [action] });
      } else if (sub == "fault") {
        // check query and attachment
        const attachment = ctx.getAttachment("attachment") || undefined;
        if (!query && !attachment) return await ctx.editReply({ content: "Baka, I can't send empty stuff. Give me something!" });
        // making embed beforehand
        const type = ctx.getString("type");
        // get channel
        const channelRawData = await util.call({
          method: "channel",
          param: [util.logChannel]
        });
        // to use the send method
        // we must init the channel class
        const channel = new Channel(ctx.client, channelRawData);
        // make embed
        const feedbackEmbed = new EmbedBuilder()
          .setTitle(`New ${type}!`)
          .setThumbnail(type == "Issue" ? "https://i.imgur.com/1xMJ0Ew.png" : "https://i.imgur.com/XWeIyTD.png")
          .setFooter({ text: "Helpful things for you, sensei!", iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setColor(16711680).setTimestamp()
          .setDescription(`*Sent by **${ctx.member.raw.user.username}***\n\n**Description:** ${query ? query : "None"}\n**Image:** ${attachment ? "" : "None"}`)
        if (query && !attachment) {
          // check query length
          if (query.length > 500 || query.length < 30) {
            return await ctx.editReply({ content: `Baka, ${query.length > 1000 ? "are you trying to sneak in your homework essay? Make it shorter." : "are you too lazy to type out something meaningful? Write a bit more."}` });
          }
          // some gibberish check here
          // we no longer have to wait as there's a freemium available
          const gibberishCheck = await fetch(`https://gibberish-text-detection.p.rapidapi.com/detect-gibberish`, {
            method: 'POST',
            headers: {
              'X-RapidAPI-Key': ctx.client.env["RAPID_KEY"],
              'X-RapidAPI-Host': 'gibberish-text-detection.p.rapidapi.com',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: query
            })
          }).then(res => res.json());
          // check if content is gibberish
          // this can be wrong anyway
          if (gibberishCheck.noise > 0.5) {
            await ctx.editReply({ content: "I see you typing gibberish there, you baka." });
            // send extra messages
            // wait for 3 seconds
            await new Promise(resolve => setTimeout(resolve, 3000));
            // then send notes
            await ctx.channel.send({ content: "You're not sending [these](https://i.imgur.com/C5tvxfp.png) through me, please." });
            // wait for 3 seconds
            await new Promise(resolve => setTimeout(resolve, 3000));
            // then send another one
            await ctx.channel.send({ content: "I'll like [these](https://i.imgur.com/FRWBFXr.png) better." });
          } else {
            // just send over the feedback
            await ctx.editReply({ content: "Thank you for your feedback. The note will be resolved after a few working days." });
            return channel.send({ embeds: [feedbackEmbed] }).catch(() => { });
          }
        } else if (attachment) {
          // as of now we have no way to filter out bad images
          // at most we can do is nsfw
          // but I'm not bothered for now
          // now we're only checking image content
          if (!attachment.content_type.includes("image")) return await ctx.editReply({ content: "Appreciate your attachment, but for now we only support images." });
          await ctx.editReply({ content: "Thank you for your feedback. The note will be resolved after a few working days." });
          feedbackEmbed.setImage(attachment.url);
          await channel.send({ embeds: [feedbackEmbed] }).catch(() => { });
        }
      }
    }
  }
}