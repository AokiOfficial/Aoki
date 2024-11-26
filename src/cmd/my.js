import Command from '../struct/handlers/Command.js';
import os from "os";
import * as pkg from "../../package.json" with { type: 'json' };
import { version as DiscordVersion } from "discord.js";
import { my } from '../assets/const/import.js';

export default new class My extends Command {
  constructor() {
    super({
      data: my,
      permissions: [],
      cooldown: 0
    });
  };
  async execute(i) {
    this.i = i;
    const sub = i.options.getSubcommand();
    const query = i.options.getString("query");
    const util = i.client.util;

    if (sub != "ping") await i.deferReply();

    try {
      return await this[sub](i, query, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      }
    };
  };
  // ping command
  async ping(i, _, util) {
    await i.reply({ content: "Pinging..." });

    const replies = await util.getStatic("ping");

    const reply = util.random(replies)
      .replace(/{{user}}/g, i.user.username)
      .replace(/{{ms}}/g, Math.round(i.client.ws.ping));

    await i.editReply({ content: reply });
  };
  // permission command
  async rights(i) {
    const query = i.options.getString("to");
    const value = i.options.getBoolean("should_be");
    if (i.user.settings[query] == value) return this.throw(`Baka, that's your current settings.`);
    const res = await i.user.update({ [query]: value });
    if (res[query] == value) {
      await i.editReply({ content: `Updated your **${query}** settings to **${value}**.` });
    } else {
      return this.throw("The database might be having problems. Try executing this again.");
    };
  };
  // vote command
  async vote(i, _, util) {
    // construct reply
    const votes = ["Vote? Sweet.", "You finally decided to show up?", "Oh, hi. I'm busy, so get it done.", "Not like I'm not busy, but sure."];
    const voteUrl = `https://top.gg/bot/https://top.gg/bot/${i.client.user.id}`;
    const vote = `${util.random(votes)} [Do that here.](<${voteUrl}>)\n\n||If you decided to vote, thank you. You'll get extra perks in the future.||`;
    // send reply
    await i.editReply({ content: vote });
  };
  // info command
  async info(i) {
    // construct message parts
    const description = [
      "Oh, it's you? Hey, I'm **Aoki**. It only means a mere blue tree, but sensei (`shimeji.rin`, by the way) can't do anything about it, unfortunately.\n",
      "Everyone calls me a tsundere. Even my sensei does that on my [Github](https://github.com/AokiOfficial/Aoki) - yes, I'm **open-source**, and documented. But I don't think I am one, it's just because *I occasionally slap people*, sorry."
    ].join("\n");
    const fields = [
      {
        name: "What can you do?",
        value: "Probably providing advanced anime information and some little utilities so you don't have to open a browser."
      },
      {
        name: "Why isn't there a help command?",
        value: "I have written descriptions for them, they're slash commands. Just follow them to get what you want, *sigh*. I'm busy, I don't have time to write those."
      }
    ];
    // construct embed
    const embed = this.embed
      .setDescription(description)
      .addFields(fields)
      .setTitle("/my info")
      .setThumbnail("https://i.imgur.com/Nar1fRE.png")
      .setFooter({ text: `Made with ❤` });
    // send
    await i.editReply({ embeds: [embed] });
  };
  // fault command
  async fault(i, query, util) {
    const attachment = i.options.getAttachment("attachment");
    // handle exceptions
    if (!query && !attachment) return this.throw("Baka, I can't send nothing. At least give me an error message, an image, or something!");
    // preset embed
    const preset = this.embed
      .setTitle(`New issue!`)
      .setThumbnail("https://i.imgur.com/1xMJ0Ew.png")
      .setFooter({ text: "Take care of these, I'm out", iconURL: i.user.displayAvatarURL() })
      .setDescription(`*Sent by **${i.user.username}***\n\n**Description:** ${query || "None"}\n**Image:** ${attachment ? "" : "None"}`)
    // construct some utility functions
    const delay = async function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const detectGibberish = async function (text) {
      const res = await fetch(`https://gibberish-text-detection.p.rapidapi.com/detect-gibberish`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': process.env["RAPID_KEY"],
          'X-RapidAPI-Host': 'gibberish-text-detection.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      return await res.json();
    };
    const sendErrorGibberish = async function (i) {
      await i.editReply({ content: "I see you typing gibberish there, you baka." });
      await delay(3000);
      await i.editReply({ content: "You're not sending [these](https://i.imgur.com/C5tvxfp.png) through me, please." });
      await delay(3000);
      await i.editReply({ content: "I'll like [these](https://i.imgur.com/FRWBFXr.png) better." });
    };
    const isImageAttachment = function (attachment) {
      return attachment.contentType.includes("image");
    };
    const sendToLogs = async function (embed) {
      const channel = await i.client.channels.cache.get(util.logChannel);
      return await channel.send({ embeds: [embed] });
    };
    const sendFeedback = async function (i, embed) {
      await i.editReply({ content: "Thank you for your feedback. The note will be resolved after a few working days." });
      await sendToLogs(embed);
    };
    // handle user query
    if (query && !attachment) {
      const gibberishCheck = await detectGibberish(query);
      if (gibberishCheck.noise > 0.5) {
        await sendErrorGibberish(i);
      } else {
        await sendFeedback(i, preset);
      };
    } else if (attachment) {
      if (!isImageAttachment(attachment)) {
        return await this.throw("Appreciate your attachment, but for now we only support images.");
      };
      preset.setImage(attachment.url);
      await sendFeedback(i, preset);
    };
  };
  // eval
  async eval(i, query, util) {
    if (!util.owners.includes(i.user.id)) {
      return await this.throw('Baka, you can\'t do that. This command is for my sensei.');
    };
    try {
      const evaled = (0, eval)(query);
      const processedEval = typeof evaled !== 'string' 
        ? JSON.stringify(evaled, null, 2)
        : evaled;
    
      if (processedEval?.length > 1000) {
        return i.editReply({ content: "Output too big. Do this with `console.log()`." });
      }
    
      const embed = this.embed.addFields([
        {
          name: "\> Input",
          value: `\`\`\`fix\n${query}\`\`\``
        },
        {
          name: "\> Output",
          value: `\`\`\`fix\n${processedEval}\n\`\`\``
        }
      ]);
    
      await i.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await i.editReply({ content: `Baka, you messed up.\n\`\`\`fix\n${error}\n\`\`\`` });
    }
  };
  async stats(i, _, util) {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = `${(usedMem / 1024 / 1024).toFixed(2)}MB`;
    const cpuLoad = os.loadavg()[0];
    const uptime = `${(os.uptime() / 3600).toFixed(2)}h`;
    const processMemUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB';
    const techField = util.keyValueField({
      'RAM': `${(totalMem / 1024 / 1024).toFixed(2)}MB`,
      'Free': `${(freeMem / 1024 / 1024).toFixed(2)}MB`,
      'Used Total': memUsage,
      'Process Use': processMemUsage,
      'CPU Load': `${cpuLoad}%`,
      'System Uptime': uptime
    }, 25);
    const botField = util.keyValueField({
      'Client Version': pkg.default.version,
      'My Uptime': util.msToTimeString(i.client.uptime),
      'Server Count': util.commatize(i.client.guilds.cache.size),
      'Channel Count': util.commatize(i.client.channels.cache.size),
      'Unique Users': util.commatize(i.client.users.cache.size),
      'Emoji Count': util.commatize(i.client.emojis.cache.size)
    }, 25);
    const description = [
      `- **Linux Kernel** v${os.release()}`,
      `- **Node** ${process.version}`,
      `- **Discord.js** v${DiscordVersion}`,
      `- **CPU**: ${os.cpus()[0].model} \`[ ${os.cpus()[0].speed / 1000} GHz ]\``
    ].join("\n");
    const embed = this.embed
      .setAuthor({ name: "Raw Statistics", iconURL: i.client.user.displayAvatarURL() })
      .setDescription(description)
      .setFooter({ text: "Probably a moron" })
      .addFields([
        { name: 'System', value: techField, inline: true },
        { name: 'Client', value: botField, inline: true }
      ])
    await i.editReply({ embeds: [embed] });
  };
  // internal utilities
  async throw(content) {
    await this.i.editReply({ content });
    return Promise.reject();
  };
};
