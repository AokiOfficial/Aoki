import { YorSlashCommand } from "yor.ts";
import { EmbedBuilder } from "yor.ts/builders";
import { osugame } from "../assets/const/import";
// structures
// import skillCalc from "../struct/osugame/Skills";
// import bestPlays from "../struct/osugame/GetTop";
// import modsEnum from "../struct/osugame/ModsEnum";

export default class OsuGame extends YorSlashCommand {
  builder = osugame
  execute = async ctx => {
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
      user = ctx.getString("username");
      mode = ctx.getString("mode");
      // safety step 
      // if user doesn't exist init one row
      if (!ctx.user.settings) await ctx.user.update({ inGameName: "", defaultMode: 0 });
      // check username against our regex
      if (!regex.test(user)) return await ctx.editReply({ content: "Baka, that username is invalid." });
      // fetch the reply
      profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user}&m=${mode}`).then(async res => await res.json());
      profile = profile[0];
      // check if profile exists
      if (!profile.username) return await ctx.editReply({ content: "Baka, that user doesn't exist." });
      // check if they added same data
      // prevent useless write
      const settings = ctx.user.settings;
      // first param: check if data in the db exists
      // second param: check if username is the same
      // third param: check if mode is also the same
      if ((settings.defaultMode) && (settings.inGameName == profile.username) && (settings.defaultMode == mode)) return await ctx.editReply({ content: "Baka, that's useless. I'm holding the same information." });
      // throw it in the db and check the entry
      await ctx.user.update({ inGameName: profile.username, defaultMode: Number(mode) }).then(async settings => {
        if ((settings) && (settings.defaultMode == Number(mode)) && (settings.inGameName == profile.username)) {
          const replies = ["Got that.", "Noted.", "I'll write that in.", "Updated for you.", "One second, writing that in.", "Check if this is right."];
          const pickedReply = replies[Math.round(Math.random() * replies.length)]
          const content = `${pickedReply}\n\nYour current username is **${profile.username}**, and your current mode is **${util.osuModeFormat(Number(mode))}**.`;
          // reply
          await ctx.editReply({ content });
        } else await ctx.editReply({ content: "Sorry, the storage room is locked, so I can't store that for you right now.\n\nIf this still happens when you try again in 5 minutes, sensei lost the key. Do `/my fault` to send a report." });
      });
    } else if (sub == "profile") {
      // get user and mode
      // these aren't enforced, so check if the db has it
      user = ctx.getString("username") ?? ctx.user.settings.inGameName;
      mode = ctx.getString("mode") ?? ctx.user.settings.defaultMode;
      // if they still don't exist, stop
      if (!user || !mode) return await ctx.editReply({ content: "You didn't configure your in-game info, baka. I don't know you.\n\nConfirgure them with `/osu set` so I can store it." });
      // check the username
      if (!regex.test(user)) return await ctx.editReply({ content: "Baka, the username is invalid." });
      // ask the api
      profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user}&m=${mode}`).then(async res => await res.json());
      profile = profile[0];
      // if user doesn't exist
      if (!profile.username) return await ctx.editReply({ content: "Baka, that user doesn't exist." });
      // get image from external source
      // useful for sharing
      let image = await fetch(`https://lemmmy.pw/osusig/sig.php?colour=pink&uname=${profile.username}&mode=${mode}&pp=0`).then(async res => await res.arrayBuffer());
      // buffer the image
      image = Buffer.from(image);
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
      // make an attachment for the image
      // yor.ts use files object from RawFile
      // of discord.js' rest library
      const attachment = {
        contentType: "Buffer",
        data: image,
        name: "profile.png"
      };
      // construct embed
      const embed = new EmbedBuilder()
        .setAuthor({ name: `osu!${util.osuModeFormat(mode)} profile for ${profile.username}`, iconURL: `https://assets.ppy.sh/old-flags/${profile.country}.png`, url: `https://osu.ppy.sh/u/${profile.user_id}` })
        .setColor(util.color)
        .setDescription(
          `**▸ Bancho Rank:** #${Number(profile.pp_rank).toLocaleString()} (${profile.country}#${Number(profile.pp_country_rank).toLocaleString()})\n` +
          `**▸ Level:** ${level}\n` +
          `**▸ PP:** ${(+Number(profile.pp_raw).toFixed(2)).toLocaleString()} **▸ Acc:** ${Number(profile.accuracy).toFixed(2)}%\n` +
          `**▸ Playcount:** ${Number(profile.playcount).toLocaleString()} (${playTime})\n` +
          `**▸ Ranks:** ${grades}\n` +
          `**▸ Profile image:** (from [lemmmy.pw](https://lemmmy.pw))`
        )
        .setImage("attachment://profile.png")
        .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
        .setTimestamp();
      // reply
      await ctx.editReply({ embeds: [embed], files: [attachment] });
    }
  }
}