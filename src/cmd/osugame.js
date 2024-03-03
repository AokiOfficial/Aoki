// interacting with image manipulation library, jimp
// takes up quite a lot of memory
// our cpu time is just 10ms on a free plan
// standard mode might not be supported
import { YorSlashCommand } from "yor.ts";
import { EmbedBuilder } from "yor.ts/builders";
import { osugame } from "../util/imports";
import jimp from "../assets/util/jimp";
import text2png from "../assets/util/text2png";
// structures
import skillCalc from "../struct/osugame/Skills";
import bestPlays from "../struct/osugame/GetTop";
import modsEnum from "../struct/osugame/ModsEnum";

export default class OsuGame extends YorSlashCommand {
  builder = osugame
  execute = async ctx => {
    // defer reply
    await ctx.defer();
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
      // check username against our regex
      if (!regex.test(user)) return await ctx.editReply({ content: "Baka, that username is invalid." });
      // fetch the reply
      profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user}&m=${mode}`).then(res => res.json());
      // check if profile exists
      if (!profile.username) return await ctx.editReply({ content: "Baka, that user doesn't exist." });
      // check if they added same data
      // prevent useless write
      const settings = ctx.user.settings;
      // first param: check if data in the db exists
      // second param: check if username is the same
      // third param: check if mode is also the same
      if ((settings.defaultMode) && (settings.inGameName == profile.username) && (settings.defaultMode == mode)) return await ctx.editReply("Baka, that's useless. I'm holding the same information.");
      // throw it in the db and check the entry
      await ctx.user.update({ inGameName: profile.username, defaultMode: mode }).then(async () => {
        if (settings.defaultMode == mode && settings.inGameName == profile.username) {
          const replies = ["Got that.", "Noted.", "I'll write that in.", "Updated for you.", "One second, writing that in.", "Check if this is right."];
          const pickedReply = replies[Math.round(Math.random() * replies.length)]
          const content = `${pickedReply}\n\nYour current username is **${profile.username}**, and your current mode is **${util.osugame_modeFormat(mode)}**.`;
          // reply
          await ctx.editReply({ content });
        } else await ctx.editReply({ content: "Sorry, the storage room is locked, so I can't store that for you right now.\n\nIf this still happens when you try again in 5 minutes, sensei lost the key. Do `/my fault` to send a report." });
      });
    }
  }
}