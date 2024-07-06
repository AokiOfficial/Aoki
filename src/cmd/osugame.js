import Command from '../struct/handlers/Command.js';
import { EmbedBuilder } from "discord.js";
import { osugame } from "../assets/const/import.js";

export default new class OsuGame extends Command {
  constructor() {
    super({
      data: osugame,
      permissions: [],
      cooldown: 3
    });
    this.usernameRegex = /^[\[\]a-z0-9_-\s]+$/i;
    this.baseUrl = "https://osu.ppy.sh"
    this.api_v1 = `${this.baseUrl}/api`;
    this.api_v2 = `${this.baseUrl}/api/v2`;
    this.api_oa = `${this.baseUrl}/oauth/token`;
    this.api_asset = "https://assets.ppy.sh";
  };
  async execute(i) {
    this.i = i;
    const sub = i.options.getSubcommand();
    const query = i.options.getString("query");
    const util = i.client.util;

    await i.deferReply();
    
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
  // set command
  async set(i, _, util) {
    const user = i.options.getString("username");
    const mode = i.options.getString("mode");
    // handle exceptions
    const settings = await i.user.settings;
    if (!settings) await i.user.update({ inGameName: "", defaultMode: "osu" });
    if (!this.usernameRegex.test(user)) return this.throw("Baka, the username is invalid.");
    const profile = await this.getProfile(user, mode);
    if (!profile?.username) return this.throw("Baka, that user doesn't exist.");
    // utilities
    const replies = ["Got that.", "Noted.", "I'll write that in.", "Updated for you.", "One second, writing that in.", "Check if this is right."];
    const reply = `${util.random(replies)} Your current username is \`${profile.username}\`, and your current mode is \`${mode}\`.`;
    // database check
    if (
      settings?.defaultMode && /* entry exists in db */
      settings?.inGameName == profile.username && /* ign is the same */
      settings?.defaultMode == mode /* mode is the same */
    ) {
      return this.throw(`${reply}\n\nThat's the same thing you did before, though.`);
    };
    // save to database
    await i.user.update({ inGameName: profile.username, defaultMode: mode });
    return await i.editReply({ content: reply });
  };
  // profile command
  async profile(i, _, util) {
    const settings = await i.user.settings;
    const type = i.options.getString("type") || "info";
    const user = i.options.getString("username") || settings?.inGameName;
    const mode = i.options.getString("mode") || settings?.defaultMode;
    // handle exceptions
    if (!user || !mode) return this.throw("You didn't configure your in-game info, baka. I don't know you.\n\nConfigure them with `/osu set` so I can store it.");
    if (!this.usernameRegex.test(user)) return this.throw("Baka, the username is invalid.");
    let profile = await this.getProfile(user, mode);
    if (!profile?.username) return this.throw("Baka, that user doesn't exist.");
    // utilities
    profile = {
      userId: profile.user_id,
      username: profile.username,
      mode: mode,
      properMode: mode == "osu" ? "" : mode,
      level: (+Number(profile.level).toFixed(2)).toString().split("."),
      playTime: Math.floor(Number(profile.total_seconds_played) / 3600),
      playCount: Number(profile.playcount).toLocaleString(),
      pp: (+Number(profile.pp_raw).toFixed(2)).toLocaleString(),
      rank: Number(profile.pp_rank).toLocaleString(),
      accuracy: Number(profile.accuracy).toFixed(2),
      country: profile.country,
      countryRank: Number(profile.pp_country_rank).toLocaleString(),
      ssh: profile.count_rank_ssh,
      ss: profile.count_rank_ss,
      sh: profile.count_rank_sh,
      s: profile.count_rank_s,
      a: profile.count_rank_a,
    };
    // handle types
    if (type == "info") {
      // utilities
      const rawImage = await fetch([
        `https://lemmmy.pw/osusig/sig.php?`,
        `colour=pink&`,
        `uname=${profile.username}&`,
        `mode=${util.osuNumberModeFormat(mode)}&`,
        `pp=0`
      ].join("")).then(async res => await res.arrayBuffer());
      profile.image = await util.upload(Buffer.from(rawImage).toString('base64'));
      const grades = [];
      const { XH, X, SH, S, A } = util.rankEmotes;
        grades.push(`${XH}\`${Number(profile.ssh)}\``);
        grades.push(`${X}\`${Number(profile.ss)}\``);
        grades.push(`${SH}\`${Number(profile.sh)}\``);
        grades.push(`${S}\`${Number(profile.s)}\``);
        grades.push(`${A}\`${Number(profile.a)}\``);
      const combinedGrades = grades.join('');
      const playTime = `${profile.playTime} hrs`;
      const level = `${profile.level[1]}% of level ${profile.level[0]}`;
      // construct embed
      const author = {
        name: `osu!${profile.properMode} profile for ${profile.username}`,
        iconURL: `https://flagsapi.com/${profile.country}/flat/64.png`,
        url: `${this.baseUrl}/u/${profile.userId}`
      };
      const description = [
        `**▸ Bancho Rank:** #${profile.rank} (${profile.country}#${profile.countryRank})`,
        `**▸ Level:** ${level}`,
        `**▸ PP:** ${profile.pp} **▸ Acc:** ${profile.accuracy}%`,
        `**▸ Playcount:** ${profile.playCount} (${playTime})`,
        `**▸ Ranks:** ${combinedGrades}`,
        `**▸ Profile image:** (from [lemmmy.pw](https://lemmmy.pw))`
      ].join("\n");
      const embed = this.embed
        .setAuthor(author)
        .setDescription(description)
        .setImage(profile.image)
      await i.editReply({ embeds: [embed] });
    } else if (type == "card") {
      // forward info to web
      const res = await fetch([
        `https://osu-skill.vercel.app/render?`,
        `id=${profile.userId}&`,
        `mode=${mode}&`,
        `${settings.pattern ? `image=${settings.pattern}&` : ""}`,
        `${settings.color ? `color=${settings.color}&` : ""}`,
        `${settings.background ? `bgColor=${settings.background}&` : ""}`,
        `${settings.description ? `description=${settings.description}&` : ""}`,
        `key=${process.env.RENDER_KEY}`
      ].join("")).then(async res => await res.arrayBuffer());
      // utilities
      const image = await util.upload(Buffer.from(res).toString('base64'));
      const embed = this.embed.setImage(image).setAuthor({
        name: `osu!${profile.properMode} card for ${profile.username}`,
        iconURL: `https://flagsapi.com/${profile.country}/flat/64.png`,
        url: `${this.baseUrl}/u/${profile.userId}`
      });
      await i.editReply({ embeds: [embed] });
    };
  };
  // customize command
  async customize(i) {
    const settings = await i.user.settings;
    const color = i.options.getString("color");
    const bgColor = i.options.getString("background");
    const description = i.options.getString("description");
    // handle exceptions
    if (!color && !bgColor && !description) return this.throw("What am I supposed to change then, baka.");
    const rgbRegex = /^rgb\((\d+),(\d+),(\d+)\)$/g;
    const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    function hexToRgb(hex) {
      const result = hexRegex.exec(hex);
      return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
    };
    if (
      (color && !color.match(rgbRegex) && !color.match(hexRegex)) || /* color */
      (bgColor && !bgColor.match(rgbRegex) && !bgColor.match(hexRegex)) /* bgColor */
    ) {
      return this.throw("That's an invalid color code, you baka. Either `#xxxxxx` or `rgb(xxx,xxx,xxx)` works.");
    };
    if (description?.length > 75) return this.throw("That description is a little bit too long. Only 75 characters max, please.");
    // handle user input
    let revisedColor, revisedBgColor;
    if (color?.match(hexRegex)) revisedColor = hexToRgb(color); else revisedColor = color;
    if (bgColor?.match(hexRegex)) revisedBgColor = hexToRgb(bgColor); else revisedBgColor = bgColor;
    if (
      (color && revisedColor == null) ||
      (bgColor && revisedBgColor == null)
    ) return this.throw("That's an invalid color code, you baka. Check your input.");
    // save to database
    await i.user.update({
      color: revisedColor || settings.color || "",
      background: revisedBgColor || settings.background || "",
      description: description || settings.description || ""
    });
    // handle response
    const parts = [
      color && `color is \`${color}\``,
      bgColor && `background color is \`${bgColor}\``,
      description && `description is \`${description}\``
    ].filter(Boolean);
    const content = [
      `Received your ticket.\n\nYour current `, 
      `${parts.slice(0, -1).join(', ')}`, 
      `${parts.length > 1 ? ` and ${parts.slice(-1)}` : parts.join('')}.`
    ].join("");
    return await i.editReply({ content });
  };
  // internal utilities
  async throw(content) {
    await this.i.editReply({ content });
    return Promise.reject();
  };
  async getProfile(username, mode) {
    return (await fetch([
      `${this.api_v1}/get_user?`,
      `k=${process.env["OSU_KEY"]}&`,
      `u=${username}&`,
      `m=${this.i.client.util.osuNumberModeFormat(mode)}`
    ].join("")).then(async res => await res.json()))[0];
  };
  get embed() {
    return new EmbedBuilder()
      .setColor(16777215)
      .setTimestamp()
      .setFooter({
        text: "Ooh",
        iconURL: this.i.user.displayAvatarURL()
      });
  };
}