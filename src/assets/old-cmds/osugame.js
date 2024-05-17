import { SlashCommand } from "slash-create/web";
import { EmbedBuilder } from "@discordjs/builders";
import { osugame } from "../assets/const/import";

export default class OsuGame extends SlashCommand {
  constructor(creator) { super(creator, osugame) };
  async run(ctx) {
    // check if both osu!api keys are present
    if (!ctx.client.env.OSU_KEY && !ctx.client.env.OSU_AUTH) {
      console.warn("osu!API keys aren't found. Aborting command.");
      return ctx.send({ content: "This command is under construction. Sorry for the inconvenience.", flags: 64 /* ephemeral */ });
    };
    // defer reply
    await ctx.defer();
    // define util
    const util = ctx.client.util;
    // define global variables
    let user, mode, profile;
    // regex to check username
    // minimize requests
    const regex = /^[\[\]a-z0-9_-\s]+$/i;
    // get subcommand
    const sub = ctx.getSubcommand();
    // commands
    if (sub == "set") {
      // interacting with database
      user = ctx.getOption("username");
      mode = ctx.getOption("mode");
      // safety step 
      // if user doesn't exist init one row
      if (!ctx.user.settings) await ctx.user.update({ inGameName: "", defaultMode: 0 });
      // check username against our regex
      if (!regex.test(user)) return await ctx.send({ content: "Baka, that username is invalid." });
      // fetch the reply
      profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user}&m=${mode}`).then(async res => await res.json());
      profile = profile[0];
      // check if profile exists
      if (!profile.username) return await ctx.send({ content: "Baka, that user doesn't exist." });
      // check if they added same data
      // prevent useless write
      const settings = ctx.user.settings;
      // first param: check if data in the db exists
      // second param: check if username is the same
      // third param: check if mode is also the same
      if ((settings.defaultMode) && (settings.inGameName == profile.username) && (settings.defaultMode == mode)) return await ctx.send({ content: "Baka, that's useless. I'm holding the same information." });
      // throw it in the db and check the entry
      await ctx.user.update({ inGameName: profile.username, defaultMode: Number(mode) }).then(async settings => {
        if ((settings) && (settings.defaultMode == Number(mode)) && (settings.inGameName == profile.username)) {
          const replies = ["Got that.", "Noted.", "I'll write that in.", "Updated for you.", "One second, writing that in.", "Check if this is right."];
          let pickedReply = replies[Math.round(Math.random() * replies.length)];
          if (!pickedReply) pickedReply = replies[0];
          const content = `${pickedReply}\n\nYour current username is **${profile.username}**, and your current mode is **${util.osuStringModeFormat(Number(mode))}**.`;
          // reply
          await ctx.send({ content });
        } else await ctx.send({ content: "Sorry, the storage room is locked, so I can't store that for you right now.\n\nIf this still happens when you try again in 5 minutes, sensei lost the key. Do `/my fault` to send a report." });
      });
    } else if (sub == "profile") {
      // get user and mode
      // these aren't enforced, so check if the db has it
      user = ctx.getOption("username") ?? ctx.user.settings.inGameName;
      mode = ctx.getOption("mode") ?? ctx.user.settings.defaultMode;
      // if they still don't exist, stop
      if (!user || !mode) return await ctx.send({ content: "You didn't configure your in-game info, baka. I don't know you.\n\nConfigure them with `/osu set` so I can store it." });
      // check the username
      if (!regex.test(user)) return await ctx.send({ content: "Baka, the username is invalid." });
      // ask the api
      profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user}&m=${mode}`).then(async res => await res.json());
      profile = profile[0];
      // if user doesn't exist
      if (!profile.username) return await ctx.send({ content: "Baka, that user doesn't exist." });
      // get image from external source
      // useful for sharing
      const rawImage = await fetch(`https://lemmmy.pw/osusig/sig.php?colour=pink&uname=${profile.username}&mode=${mode}&pp=0`).then(async res => await res.arrayBuffer());
      // upload that image to imgbb
      const image = await util.upload(Buffer.from(rawImage).toString('base64'));
      // set grades
      // inserting these in the description alone
      let grades = "";
      const { XH, X, SH, S, A } = util.rankEmotes;
      // insert from SS to A
      grades += `${XH}\`${Number(profile.count_rank_ssh)}\``;
      grades += `${X}\`${Number(profile.count_rank_ss)}\``;
      grades += `${SH}\`${Number(profile.count_rank_sh)}\``;
      grades += `${S}\`${Number(profile.count_rank_s)}\``;
      grades += `${A}\`${Number(profile.count_rank_a)}\``;
      // playtime format
      const playTime = `${Math.floor(Number(profile.total_seconds_played) / 3600)} hrs`;
      // format level
      const levelRaw = (+Number(profile.level).toFixed(2)).toString().split(".");
      const level = `${levelRaw[1]}% of level ${levelRaw[0]}`;
      // construct embed
      const embed = new EmbedBuilder()
        .setAuthor({ name: `osu!${util.osuStringModeFormat(mode) == "osu" ? "" : util.osuStringModeFormat(mode)} profile for ${profile.username}`, iconURL: `https://assets.ppy.sh/old-flags/${profile.country}.png`, url: `https://osu.ppy.sh/u/${profile.user_id}` })
        .setColor(util.color)
        .setDescription(
          `**▸ Bancho Rank:** #${Number(profile.pp_rank).toLocaleString()} (${profile.country}#${Number(profile.pp_country_rank).toLocaleString()})\n` +
          `**▸ Level:** ${level}\n` +
          `**▸ PP:** ${(+Number(profile.pp_raw).toFixed(2)).toLocaleString()} **▸ Acc:** ${Number(profile.accuracy).toFixed(2)}%\n` +
          `**▸ Playcount:** ${Number(profile.playcount).toLocaleString()} (${playTime})\n` +
          `**▸ Ranks:** ${grades}\n` +
          `**▸ Profile image:** (from [lemmmy.pw](https://lemmmy.pw))`
        )
        .setImage(image)
        .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
        .setTimestamp();
      // reply
      await ctx.send({ embeds: [embed] });
    }
  }
}