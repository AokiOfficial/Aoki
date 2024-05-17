// ref!: error handling
// <-->: block division
// /**/: useless? notes
import { my } from "../assets/const/import";
import { SlashCommand } from "slash-create/web";
import { PermissionFlagsBits } from 'discord-api-types/v10';
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder as MenuBuilder,
  StringSelectMenuOptionBuilder as MenuOptionBuilder
} from "@discordjs/builders";

export default class My extends SlashCommand {
  constructor(creator) { super(creator, my) };
  // <--> main block
  async run(ctx) {
    this.ctx = ctx;
    // <--> get command and define utilities
    const sub = ctx.getSubcommand();
    const util = ctx.client.util;
    const query = ctx.getOption("query");
    // <--> run command in try...catch
    try {
      if (sub != "ping") await ctx.defer();
      return await this[sub](ctx, query, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      };
    };
  };
  // <--> ping command
  async ping(ctx, _, util) {
    await ctx.send({ content: "Pinging..." });
    // <--> utilities
    const msg = await ctx.fetch();
    const replies = await util.getStatic("ping");
    // <--> calculate roundtrip
    const timeTaken = Date.now() - util.getCreatedTimestamp(msg.id);
    // <--> construct reply
    const reply = util.random(replies)
      .replace(/{{user}}/g, ctx.user.username)
      .replace(/{{ms}}/g, timeTaken);
    // <--> send ping
    await ctx.editOriginal({ content: reply });
  };
  // <--> vote command
  async vote(ctx, _, util) {
    // <--> construct reply
    const votes = ["Vote? Sweet.", "You finally decided to show up?", "Oh, hi. I'm busy, so get it done.", "Not like I'm not busy, but sure."];
    const voteUrl = `https://top.gg/bot/https://top.gg/bot/${util.id}`;
    const vote = `${util.random(votes)} [Do that here.](<${voteUrl}>)\n\n||If you decided to vote, thank you. You'll get extra perks in the future.||`;
    // <--> send reply
    await ctx.send({ content: vote });
  };
  // <--> info command
  async info(ctx) {
    // <--> construct message parts
    const description = [
      "Oh, it's you? Hey, I'm **Neko**. That's an undesired name, but sensei (`hashima.rin`, by the way) can't change it, unfortunately.\n",
      "Everyone calls me a tsundere. Even my sensei does that on my [Github](https://github.com/NekoOfficial/Neko) - yes, I'm **open-source**, and documented. But I don't think I am one, it's just because *I occasionally slap people*, sorry."
    ].join("\n");
    const fields = [
      {
        name: "What can you do?",
        value: "Probably providing advanced anime information, a social system and some utilities so you don't have to open a browser."
      },
      {
        name: "Why isn't there a help command?",
        value: "I have written descriptions for them, they're slash commands. Just follow them to get what you want, *sigh*. I'm busy, I don't have time to write those."
      }
    ];
    // <--> construct embed
    const embed = this.embed
      .setDescription(description)
      .addFields(fields)
      .setTitle("/my info")
      .setThumbnail("https://i.imgur.com/xlO42xi.png")
      .setFooter({ text: `Made with ❤` });
    // <--> send
    await ctx.send({ embeds: [embed] });
  };
  // <--> fault command
  async fault(ctx, query, util) {
    const attachment = ctx.getAttachment("attachment");
    // <--> handle exceptions
    if (!query && !attachment) return this.throw("Baka, I can't send nothing. At least give me an error message, an image, or something!");
    // <--> preset embed
    const preset = this.embed
      .setTitle(`New issue!`)
      .setThumbnail("https://i.imgur.com/1xMJ0Ew.png")
      .setFooter({ text: "Helpful things for you, sensei!", iconURL: ctx.user.dynamicAvatarURL("png") })
      .setDescription(`*Sent by **${ctx.user.username}***\n\n**Description:** ${query ? query : "None"}\n**Image:** ${attachment ? "" : "None"}`)
    // <--> construct some utility functions
    const delay = async function(ms) { 
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const detectGibberish = async function(text) {
      const res = await fetch(`https://gibberish-text-detection.p.rapidapi.com/detect-gibberish`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': ctx.client.env["RAPID_KEY"],
          'X-RapidAPI-Host': 'gibberish-text-detection.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      return await res.json();
    };
    const sendErrorGibberish = async function(ctx) {
      await ctx.send({ content: "I see you typing gibberish there, you baka." });
      await delay(3000);
      await ctx.send({ content: "You're not sending [these](https://i.imgur.com/C5tvxfp.png) through me, please." });
      await delay(3000);
      await ctx.send({ content: "I'll like [these](https://i.imgur.com/FRWBFXr.png) better." });
    };
    const isImageAttachment = function(attachment) {
      console.log(attachment)
      return attachment.content_type.includes("image");
    };
    const sendToLogs = async function(embed) {
      return await util.call({
        method: "channelMessages",
        param: [util.logChannel]
      }, {
        method: "POST",
        body: { embeds: [embed.toJSON()] }
      });
    };
    const sendFeedback = async function(ctx, embed) {
      await ctx.send({ content: "Thank you for your feedback. The note will be resolved after a few working days." });
      await sendToLogs(embed);
    };
    // <--> handle user query
    if (query && !attachment) {
      if (query.length > 500 || query.length < 30) {
        return await ctx.send({ content: `Baka, ${query.length > 1000 ? "are you trying to sneak in your homework essay? Make it shorter." : "are you too lazy to type out something meaningful? Write a bit more."}` });
      };
      const gibberishCheck = await detectGibberish(query);
      if (gibberishCheck.noise > 0.5) {
        await sendErrorGibberish(ctx);
      } else {
        await sendFeedback(ctx, preset);
      };
    } else if (attachment) {
      if (!isImageAttachment(attachment)) {
        return await ctx.send({ content: "Appreciate your attachment, but for now we only support images." });
      };
      preset.setImage(attachment.url);
      await sendFeedback(ctx, preset);
    };
  };
  // <--> internal utilities
  async throw(content) {
    await this.ctx.send({ content });
    return Promise.reject();
  };
  get embed() {
    return new EmbedBuilder().setColor(16777215).setTimestamp();
  };
}