// ref!: error handling
// <-->: block division
// /**/: useless? notes
import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommand } from "slash-create/web";
import { format, parseISO } from "date-fns";
import { convert as toMarkdown } from "../assets/util/html-to-markdown";
import { Watching, User, Seiyuu, Character } from "../assets/const/graphql";
import { anime } from "../assets/const/import";
import { PermissionFlagsBits } from 'discord-api-types/v10';
import AniSchedule from "../struct/Schedule";
import he from "../assets/util/he";

export default class Anime extends SlashCommand {
  constructor(creator) {
    super(creator, anime);
    // <--> static and reusable variables
    this.jikan_v4 = "https://api.jikan.moe/v4";
    this.ErrorMessages = {
      500: "The service is probably dead. Wait a little bit, then try again.",
      400: "Looks like I found nothing in the records.\n\nYou believe that should exist? My sensei probably messed up. Try reporting this with `/my fault`.",
      default: "Wow, this kind of error has never been documented. Wait for about 5-10 minutes, if nothing changes after that, my sensei probably messed up. Try reporting this with `/my fault`."
    };
  };
  // <--> main block
  async run(ctx) {
    this.ctx = ctx;
    // <--> get command and define utilities
    const sub = ctx.getSubcommand();
    const util = ctx.client.util;
    const query = ctx.getOption("query");
    // <--> run command in try...catch
    try {
      await ctx.defer();
      return await this[sub](ctx, query, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      };
    };
  };
  // <--> action command
  async action(ctx, query) {
    const { url } = await this.fetch(`https://api.waifu.pics/sfw/${query}`);
    return await ctx.send({ embeds: [this.embed.setImage(url)] });
  };
  // <--> quote command
  async quote(ctx) {
    const { anime, character, quote } = await this.fetch(`https://animechan.xyz/api/random`);
    return await ctx.send({ content: `**${character}** from **${anime}**:\n\n*${quote}*` });
  };
  // <--> meme command
  async meme(ctx, _, util) {
    const res = await util.reddit("animemes");
    const meme = this.embed
      .setTitle(`**${res.title}**`)
      .setURL(res.url)
      .setDescription(`*Posted by **${res.author}***`)
      .setImage(res.image)
      .setFooter({ text: `${res.upVotes} likes`, iconURL: ctx.user.dynamicAvatarURL("png") });
    return await ctx.send({ embeds: [meme] });
  };
  // <--> random command
  async random(ctx, _, util) {
    // <--> processing api response
    const type = ctx.getOption("type");
    const res = (await this.fetch(`${this.jikan_v4}/random/${type}`)).data;
    console.log(res)
    if (!res) return this.throw(this.ErrorMessages.default);
    const stats = {
      "Main Genre": res.genres?.[0]?.name || "No data",
      ...(type === "anime") ? 
      {
        "Source": res.source || "No data",
        "Episodes": res.episodes || "No data",
        "Status": res.status || "No data",
        "Schedule": res.broadcast?.day ? `${res.broadcast.day}s` : "No data",
        "Duration": res.duration?.replace(/ per /g, "/") || "No data"
      } : {
        "Chapters": res.chapters || "No data",
        "Volumes": res.volumes || "No data"
      }
    };
    const scores = {
      "Mean Rank": res.rank || "No data",
      "Popularity": res.popularity || "No data",
      "Favorites": res.favorites || "No data",
      "Subscribed": res.members || "No data",
      ...(type === "anime") ? 
      {
        "Average Score": res.score || "No data",
        "Scored By": res.scored_by || "No data",
      } : {}
    };
    const description = [
      util.textTruncate((res.synopsis || '').replace(/(<([^>]+)>)/ig, ''), 350, `...`),
      `\n• **Main Theme:** ${res.themes?.[0]?.name || 'Unspecified'}`,
      `• **Demographics:** ${res.demographics?.[0]?.name || 'Unspecified'}`,
      `• **Air Season:** ${res.season ? util.toProperCase(res.season) : "Unknown"}`,
      `\n*More about the ${type} can be found [here](${res.url}), and the banner can be found [here](${res.images?.jpg.image_url}).*`
    ].join('\n');
    // <--> extending preset embed
    const embed = this.embed
      .setFooter({ text: `Data sent from MyAnimeList`, iconURL: ctx.user.dynamicAvatarURL("png") })
      .setAuthor({ name: `${res.title}`, iconURL: res.images?.jpg.image_url })
      .setDescription(description)
      .addFields([
        { name: `${util.toProperCase(type)} Info`, inline: true, value: util.keyValueField(stats, 25) },
        { name: `${util.toProperCase(type)} Scorings`, inline: true, value: util.keyValueField(scores, 25) }
      ]);
    return await ctx.send({ embeds: [embed] });
  };
  // <--> profile command
  async profile(ctx, query, util) {
    // <--> processing user query
    const platform = ctx.getOption("platform");
    if (util.isProfane(query)) this.throw("Stop sneaking in bad content please, you baka.");
    const fetchData = {
      al: async () => await util.anilist(User, { search: query }),
      mal: async () => (await this.fetch(`${this.jikan_v4}/users/${query}/full`)).data
    };
    const res = await fetchData[platform]();
    // <--> handling errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // <--> generate a preset embed
    const presetEmbed = this.embed.setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") });
    // <--> conditional for each platform
    if (platform == "mal") {
      // <--> processing api response
      /**
       * Format AniList array information
       * 
       * Method scoped in here is exclusive for animes and mangas
       * @param {Array} arr Array of query info to work with
       * @returns `String`
       */
      const spreadMap = function(arr) {
        const res = util.joinArrayAndLimit(arr.map((entry) => {
          return `[${entry[entry.title ? "title" : "name"]}](${entry.url.split('/').splice(0, 5).join('/')})`;
        }), 1000, ' • ');
        return res.text + (!!res.excess ? ` and ${res.excess} more!` : '') || 'None Listed.'
      };
      const fav = {
        anime: spreadMap(res.favorites.anime),
        manga: spreadMap(res.favorites.manga),
        chars: spreadMap(res.favorites.characters),
        people: spreadMap(res.favorites.people)
      };
      const cleanedAboutField = (res.about || '').replace(/(<([^>]+)>)/ig, '');
      const description = [
        util.textTruncate(cleanedAboutField, 350, `... *[read more here](${res.url})*`),
        `• **Gender:** ${res.gender || 'Unspecified'}`,
        `• **From:** ${res.location || 'Unspecified'}`,
        `• **Joined:** ${format(parseISO(res.joined), 'EEEE, do MMMM yyyy')}`,
        `• **Last Seen:** ${format(parseISO(res.last_online), 'EEEE, do MMMM yyyy')}`
      ].join('\n');
      // <--> extending preset embed
      const embed = presetEmbed
        .setAuthor({ name: `${res.username}'s Profile`, iconURL: res.images.jpg.image_url })
        .setDescription(description)
        .addFields([
          { name: 'Anime Stats', value: util.keyValueField(res.statistics.anime), inline: true },
          { name: 'Manga Stats', value: util.keyValueField(res.statistics.manga), inline: true },
          { name: 'Favourite Anime', value: fav.anime }, 
          { name: 'Favorite Manga', value: fav.manga }, 
          { name: 'Favorite Characters', value: fav.chars }, 
          { name: 'Favorite Staffs', value: fav.people }
        ]);
      return await ctx.send({ embeds: [embed] });
    } else {
      // <--> processing api response
      const topFields = Object.entries(res.data.User.favourites).map(([query, target]) => {
        const firstTarget = target.edges.map(entry => {
          const identifier = entry.node.title || entry.node.name;
          const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;
          return `[**${name}**](${entry.node.siteUrl})`;
        }).join('|') || 'None Listed';
        return `\n**Top 1 ${query}:** ` + firstTarget.split("|")[0];
      });
      const description = res.data.User.about ? util.textTruncate(he.decode(res.data.User.about?.replace(/(<([^>]+)>)/g, '') || ''), 250) : "No description provided";
      // <--> extending preset embed
      const embed = presetEmbed
        .setImage(res.data.User.bannerImage)
        .setThumbnail(res.data.User.avatar.medium)
        .setTitle(res.data.User.name)
        .setURL(res.data.User.siteUrl)
        .setDescription(`***About the user:** ${description}*` + `\n${topFields}`);
      return await ctx.send({ embeds: [embed] });
    };
  };
  // <--> search command
  async search(ctx, query, util) {
    // <--> processing user query
    const type = ctx.getOption("type");
    if (util.isProfane(query)) return this.throw("Stop sneaking in bad content please, you baka.");
    const kitsuURL = function(type) {
      return `https://kitsu.io/api/edge/${type}?filter[text]=${query}&page[offset]=0&page[limit]=1`;
    };
    const fetchData = {
      anime: async () => await this.fetch(kitsuURL("anime")),
      manga: async () => await this.fetch(kitsuURL("manga")),
      character: async () => (await util.anilist(Character, { search: query })).data.Character,
      seiyuu: async () => (await util.anilist(Seiyuu, { search: query })).data
    };
    const res = await fetchData[type]();
    // <--> error handling
    if (
      !res || /* universal */
      ((type == "anime" || type == "manga") && !res.data?.[0]) /* kitsu.io response */
    ) {
      return this.throw(this.ErrorMessages[400]);
    };
    // <--> processing api response
    const processData = {
      anime: res.data?.[0]?.attributes,
      manga: res.data?.[0]?.attributes,
      character: res.Character,
      seiyuu: res
    };
    const data = processData[type];
    if (
      (type == "anime" || type == "manga") && /* kitsu.io response */
      data.ageRatingGuide && /* ageRatingGuide exists */
      (data.ageRatingGuide.includes("Nudity") && data.ageRatingGuide.includes("Mature")) && /* ageRatingGuide has NSFW */
      !ctx.channel.nsfw /* channel is not NSFW */
    ) {
      return this.throw("The content given to me by Kitsu.io has something to do with NSFW, and I can't show that in this channel, sorry. Get in a NSFW channel, please.");
    };
    // <--> handling by type
    if (type == "anime" || type == "manga") {
      // <--> processing api response
      const presetEmbed = this.embed
        .setTitle(`${data.titles.en_jp}`)
        .setURL(`https://kitsu.io/${type}/${res.data[0].id}`)
        .setThumbnail(data.posterImage.original)
        .setDescription(
          `*The cover of this ${type} can be found [here](https://media.kitsu.io/${type}/poster_images/${res.data[0].id}/large.jpg)*\n\n` +
          `**Description:** ${util.textTruncate(`${data.synopsis}`, 250, `... *(read more [here](https://kitsu.io/${type}/${res.data[0].id}))*`)}`
        )
      const fields = [
        { name: "Type", value: `${util.toProperCase(data[type == "anime" ? "showType" : "subtype"])}`, inline: true },
        { name: "Status", value: util.toProperCase(`${data.status}`), inline: true },
        { name: "Air Date", value: `${data.startDate}`, inline: true },
        { name: "Avg. Rating", value: `${data.averageRating?.toLocaleString() || "Unknown"}`, inline: true },
        { name: "Age Rating", value: `${data.ageRatingGuide?.replace(")", "") || "Unknown"}`, inline: true },
        { name: "Rating Rank", value: `#${data.ratingRank?.toLocaleString() || "Unknown"}`, inline: true },
        { name: "Popularity", value: `#${data.popularityRank?.toLocaleString() || "Unknown"}`, inline: true },
        ...(type == "anime") ?
        [
          { name: "NSFW?", value: util.toProperCase(`${data.nsfw}`), inline: true },
          { name: "Ep. Count", value: `${data.episodeCount}`, inline: true },
        ] : [
          { name: "Volume Count", value: `${data.volumeCount || "None recorded"}`, inline: true },
          { name: "Chapter Count", value: `${data.chapterCount || "None recorded"}`, inline: true },
        ]
      ];
      const embed = presetEmbed.addFields(fields);
      await ctx.send({ embeds: [embed] });
    } else if (type == "seiyuu") {
      // <--> processing api response
      /**
       * Format AniList array information
       * 
       * Method scoped in here is exclusive for seiyuu
       * @param {Array} arr Array of query info to work with
       * @returns `String`
       */
      const spreadMap = function(arr) {
        const res = util.joinArrayAndLimit(arr.map((entry) => {
          return `[${entry[entry.title ? "title" : "name"][entry.title ? "romaji" : "full"]}](${entry.siteUrl.split('/').slice(0, 5).join('/')})`;
        }), 350, ' • ');
        return res.text + (!!res.excess ? ` and ${res.excess} more!` : '') || 'None Listed.'
      };
      const staffName = [res.Staff.name.full, res.Staff.name.native].filter(Boolean).join(" | ");
      const description = [
        util.langflags.find(f => f.lang.toLowerCase() == res.Staff.language?.toLowerCase())?.flag,
        util.textTruncate(toMarkdown(he.decode(res.Staff.description || '\u200b')), 1000, `... *(read more [here](${res.Staff.siteUrl}))*`)
      ].join('\n');
      // <--> extending preset embed
      const embed = this.embed
        .setThumbnail(res.Staff.image.large)
        .setAuthor({ name: staffName, url: res.Staff.siteUrl })
        .setDescription(description)
        .addFields([
          { name: `${staffName} voiced...`, value: spreadMap(res.Staff.characters.nodes) },
          { name: `${staffName} is part of...`, value: spreadMap(res.Staff.staffMedia.nodes) }
        ]);
      await ctx.send({ embeds: [embed] });
    } else {
      // <--> processing api response
      console.log(res.media.nodes[0])
      const description = (res.description?.replace(/~!|!~/g, "||") || 'No description.') + `\n\n*More information can be found [here](${res.siteUrl}).*`;
      const embedField = util.joinArrayAndLimit(res.media.nodes.map((entry) => {
        return `[${entry.title.romaji}](${entry.siteUrl?.split('/').slice(0, 5).join('/') || "https://anilist.co/"})`;
      }), 350, ' • ');
      // <--> extending preset embed
      const embed = this.embed
        .setTitle(`${res.name.full}`)
        .setURL(res.siteUrl)
        .setDescription(description)
        .setThumbnail(res.image.large)
        .addFields({
          name: "Appears in...",
          value: embedField.text + (!!embedField.excess ? ` and ${embedField.excess} more!` : '') || 'None Listed.'
        });
      await ctx.send({ embeds: [embed] });
    };
  };
  // <--> schedule list command
  async list(ctx) {
    // <--> get guild settings
    const guild = await ctx.guild;
    const schedule = await guild.getSchedules();
    // <--> handle exceptions
    if (!schedule?.[0]?.anilistId) return this.throw("Baka, this server has no anime subsciptions.");
    // <--> get watching data
    const aniFetch = new AniSchedule(ctx.client);
    const res = (await aniFetch.fetch(Watching, { 
      watched: [schedule[0].anilistId], 
      page: 0 
    })).data.Page.media[0];
    // <--> handle errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // <--> handle api response
    const title = `[${res.title.romaji}](${res.siteUrl})`;
    const nextEpisode = res.nextAiringEpisode.episode;
    const timeUntilAiring = Math.round(res.nextAiringEpisode.timeUntilAiring / 3600, 0);
    // <--> send response
    return await ctx.send({ content: `You are currently watching **${title}**. Its next episode is **${nextEpisode}**, airing in about **${timeUntilAiring} hours**.` });
  };
  // <--> schedule add command
  async add(ctx, query, util) {
    // <--> get guild settings
    const guild = await ctx.guild;
    const schedule = await guild.getSchedules();
    const channel = ctx.getChannel("channel");
    const aniFetch = new AniSchedule(ctx.client);
    // <--> handle exceptions
    if (schedule?.[0]?.anilistId) return this.throw("Baka, each server can only have **one schedule** running at a time.");
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageGuild)) return this.throw("Baka, you must have the `Manage Guild` permission to execute this command.");
    if (channel.type != 0) return this.throw("I can't speak in there for you, baka. Just a normal channel, please.");
    // <--> handle user query
    const anilistId = await util.getMediaId(query);
    if (!anilistId) return this.throw(this.ErrorMessages[400]);
    const media = (await aniFetch.fetch(Watching, { 
      watched: [anilistId],
      page: 0
    })).data.Page.media[0];
    // <--> handle errors
    if (!media) return this.throw(this.ErrorMessages[400]);
    else if (media?.errors) {
      const errorCodes = media.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    if (!["NOT_YET_RELEASED", "RELEASING"].includes(media.status)) return this.throw("Baka, that's not airing. It's not an upcoming one, too. Maybe even finished.");
    // <--> update database
    await guild.update({ channelId: ctx.channel.id, anilistId: media.id, nextEp: media.nextAiringEpisode.episode });
    // <--> send result
    const title = media.title.romaji;
    const channelName = channel ? "<#" + channel.id + ">" : "**this channel**";
    const timeUntilAiring = Math.round(media.nextAiringEpisode.timeUntilAiring / 3600, 0);
    return await ctx.send({ content: `Tracking airing episodes for **${title}** in ${channelName}. Next episode is airing in about **${timeUntilAiring} hours**.` });
  };
  // <--> schedule remove command
  async remove(ctx) {
    // <--> get guild settings
    const guild = await ctx.guild;
    const schedule = await guild.getSchedules();
    const aniFetch = new AniSchedule(ctx.client);
    // <--> handle exceptions
    if (!schedule?.[0]?.anilistId) return this.throw("Baka, this server has no anime subscription.");
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageGuild)) return this.throw("Baka, you must have the `Manage Guild` permission to execute this command.");
    // <--> get watching data
    const res = (await aniFetch.fetch(Watching, { 
      watched: [schedule[0].anilistId], 
      page: 0 
    })).data.Page.media[0];
    // <--> handle errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // <--> update database
    await guild.update({ channelId: '0', anilistId: 0, nextEp: 0 });
    // <--> send message
    return await ctx.send({ content: `Stopped tracking airing episodes for **${res.title.romaji}**.` });
  };
  // <--> internal utilities
  async throw(content) {
    await this.ctx.send({ content });
    return Promise.reject();
  };
  async fetch(url) {
    return await fetch(url).then(async res => await res.json());
  };
  get embed() {
    return new EmbedBuilder().setColor(16777215).setTimestamp();
  };
}