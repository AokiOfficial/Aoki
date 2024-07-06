import Command from '../struct/handlers/Command.js';import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { convert as toMarkdown } from "../assets/util/html2md.js";
import { Watching, User, Seiyuu, Character, Schedule } from "../assets/const/graphql.js";
import { anime } from "../assets/const/import.js";
import he from "../assets/util/he.js";

export default new class Anime extends Command {
  constructor() {
    super({
      data: anime,
      permissions: [],
      cooldown: 2
    });
    // static and reusable variables
    this.jikan_v4 = "https://api.jikan.moe/v4";
    this.ErrorMessages = {
      500: "The service is probably dead. Wait a little bit, then try again.",
      400: "Looks like I found nothing in the records.\n\nYou believe that should exist? My sensei probably messed up. Try reporting this with `/my fault`.",
      default: "Wow, this kind of error has never been documented. Wait for about 5-10 minutes, if nothing changes after that, my sensei probably messed up. Try reporting this with `/my fault`."
    };
  };
  // main block
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
  // action command
  async action(i, query) {
    const { url } = await this.fetch(`https://api.waifu.pics/sfw/${query}`);
    return await i.editReply({ embeds: [this.embed.setImage(url)] });
  };
  // quote command
  async quote(i) {
    const { author, anime, quote } = await fetch(`https://waifu.it/api/v4/quote`, {
      headers: { 'Authorization': process.env.WAIFU_KEY }
    }).then(async res => await res.json());
    return await i.editReply({ content: `**${author}** from **${anime}**:\n\n*${quote}*` });
  };
  // meme command
  async meme(i, _, util) {
    const res = await util.reddit("animemes");
    const meme = this.embed
      .setTitle(`**${res.title}**`)
      .setURL(res.url)
      .setDescription(`*Posted by **${res.author}***`)
      .setImage(res.image)
      .setFooter({ text: `${res.upVotes} likes`, iconURL: i.user.displayAvatarURL() });
    return await i.editReply({ embeds: [meme] });
  };
  // random command
  async random(i, _, util) {
    // processing api response
    const type = i.options.getString("type");
    const res = (await this.fetch(`${this.jikan_v4}/random/${type}`)).data;
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
    // extending preset embed
    const embed = this.embed
      .setFooter({ text: `Data sent from MyAnimeList`, iconURL: i.user.displayAvatarURL() })
      .setAuthor({ name: `${res.title}`, iconURL: res.images?.jpg.image_url })
      .setDescription(description)
      .addFields([
        { name: `${util.toProperCase(type)} Info`, inline: true, value: util.keyValueField(stats, 25) },
        { name: `${util.toProperCase(type)} Scorings`, inline: true, value: util.keyValueField(scores, 25) }
      ]);
    return await i.editReply({ embeds: [embed] });
  };
  // profile command
  async profile(i, query, util) {
    // processing user query
    const platform = i.options.getString("platform");
    if (util.isProfane(query)) this.throw("Stop sneaking in bad content please, you baka.");
    const fetchData = {
      al: async () => await util.anilist(User, { search: query }),
      mal: async () => (await this.fetch(`${this.jikan_v4}/users/${query}/full`)).data
    };
    const res = await fetchData[platform]();
    // handling errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // generate a preset embed
    const presetEmbed = this.embed.setFooter({ text: `Requested by ${i.user.username}`, iconURL: i.user.displayAvatarURL() });
    // conditional for each platform
    if (platform == "mal") {
      // processing api response
      /**
       * util.formatDate AniList array inutil.formatDateion
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
        `• **Joined:** ${util.formatDate(new Date(res.joined), 'dd MMMM yyyy')}`,
        `• **Last Seen:** ${util.formatDate(new Date(res.last_online), 'dd MMMM yyyy')}`
      ].join('\n');
      // extending preset embed
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
      return await i.editReply({ embeds: [embed] });
    } else {
      // processing api response
      const topFields = Object.entries(res.data.User.favourites).map(([query, target]) => {
        const firstTarget = target.edges.map(entry => {
          const identifier = entry.node.title || entry.node.name;
          const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;
          return `[**${name}**](${entry.node.siteUrl})`;
        }).join('|') || 'None Listed';
        return `\n**Top 1 ${query}:** ` + firstTarget.split("|")[0];
      });
      const description = res.data.User.about ? util.textTruncate(he.decode(res.data.User.about?.replace(/(<([^>]+)>)/g, '') || ''), 250) : "No description provided";
      // extending preset embed
      const embed = presetEmbed
        .setImage(res.data.User.bannerImage)
        .setThumbnail(res.data.User.avatar.medium)
        .setTitle(res.data.User.name)
        .setURL(res.data.User.siteUrl)
        .setDescription(`***About the user:** ${description}*` + `\n${topFields}`);
      return await i.editReply({ embeds: [embed] });
    };
  };
  // search command
  async search(i, query, util) {
    // processing user query
    const type = i.options.getString("type");
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
    // error handling
    if (
      !res || /* universal */
      ((type == "anime" || type == "manga") && !res.data?.[0]) /* kitsu.io response */
    ) {
      return this.throw(this.ErrorMessages[400]);
    };
    // processing api response
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
      !i.channel.nsfw /* channel is not NSFW */
    ) {
      return this.throw("The content given to me by Kitsu.io has something to do with NSFW, and I can't show that in this channel, sorry. Get in a NSFW channel, please.");
    };
    // handling by type
    if (type == "anime" || type == "manga") {
      // processing api response
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
      await i.editReply({ embeds: [embed] });
    } else if (type == "seiyuu") {
      // processing api response
      /**
       * util.formatDate AniList array inutil.formatDateion
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
      // extending preset embed
      const embed = this.embed
        .setThumbnail(res.Staff.image.large)
        .setAuthor({ name: staffName, url: res.Staff.siteUrl })
        .setDescription(description)
        .addFields([
          { name: `${staffName} voiced...`, value: spreadMap(res.Staff.characters.nodes) },
          { name: `${staffName} is part of...`, value: spreadMap(res.Staff.staffMedia.nodes) }
        ]);
      await i.editReply({ embeds: [embed] });
    } else {
      // processing api response
      const description = (res.description?.replace(/~!|!~/g, "||") || 'No description.') + `\n\n*More inutil.formatDateion can be found [here](${res.siteUrl}).*`;
      const embedField = util.joinArrayAndLimit(res.media.nodes.map((entry) => {
        return `[${entry.title.romaji}](${entry.siteUrl?.split('/').slice(0, 5).join('/') || "https://anilist.co/"})`;
      }), 350, ' • ');
      // extending preset embed
      const embed = this.embed
        .setTitle(`${res.name.full}`)
        .setURL(res.siteUrl)
        .setDescription(description)
        .setThumbnail(res.image.large)
        .addFields({
          name: "Appears in...",
          value: embedField.text + (!!embedField.excess ? ` and ${embedField.excess} more!` : '') || 'None Listed.'
        });
      await i.editReply({ embeds: [embed] });
    };
  };
  // schedule current command
  async current(i, _, util) {
    // get user sschedules
    const schedule = await i.user.getSchedule();
    // handle exceptions
    if (!schedule) return this.throw("Baka, you have no anime subscription.");
    // get watching data
    const res = (await util.anilist(Watching, { 
      watched: [schedule.anilistId], 
      page: 0 
    })).data.Page.media[0];
    // handle errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // handle api response
    const title = `[${res.title.romaji}](${res.siteUrl})`;
    const nextEpisode = res.nextAiringEpisode.episode;
    const timeUntilAiring = Math.round(res.nextAiringEpisode.timeUntilAiring / 3600, 0);
    // send response
    return await i.editReply({ content: `You are currently watching **${title}**. Its next episode is **${nextEpisode}**, airing in about **${timeUntilAiring} hours**.` });
  };
  // schedule add command
  async add(i, query, util) {
    // get user schedule
    const schedule = await i.user.getSchedule();
    // handle exceptions
    if (schedule?.anilistId) return this.throw("Baka, you can only have **one schedule** running at a time.");
    // handle user query
    const anilistId = await util.getMediaId(query);
    if (!anilistId) return this.throw(this.ErrorMessages[400]);
    const media = (await util.anilist(Watching, { 
      watched: [anilistId],
      page: 0
    })).data.Page.media[0];
    // handle errors
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
    // update database
    await i.user.setSchedule({ anilistId: media.id, nextEp: media.nextAiringEpisode.episode });
    // send result
    const title = media.title.romaji;
    const timeUntilAiring = Math.round(media.nextAiringEpisode.timeUntilAiring / 3600, 0);
    return await i.editReply({ content: `Tracking airing episodes for **${title}**. Next episode is airing in about **${timeUntilAiring} hours**.` });
  };
  // schedule remove command
  async remove(i, _, util) {
    // get user schedule
    const schedule = await i.user.getSchedule();
    // handle exceptions
    if (!schedule?.anilistId) return this.throw("Baka, you have no anime subscription.");
    // handle user query
    const res = (await util.anilist(Watching, { 
      watched: [schedule.anilistId],
      page: 0
    })).data.Page.media[0];
    // handle errors
    if (!res) return this.throw(this.ErrorMessages[400]);
    else if (res?.errors) {
      const errorCodes = res.errors;
      if (errorCodes.some(code => code.status >= 500)) {
        return this.throw(this.ErrorMessages[500]);
      } else if (errorCodes.some(code => code.status >= 400)) {
        return this.throw(this.ErrorMessages[400]);
      } else return this.throw(this.ErrorMessages.default);
    };
    // update database
    await i.user.setSchedule({ anilistId: 0, nextEp: 0 });
    // send message
    return await i.editReply({ content: `Stopped tracking airing episodes for **${res.title.romaji}**.` });
  };
  // internal utilities
  async throw(content) {
    await this.i.editReply({ content });
    return Promise.reject();
  };
  async fetch(url) {
    return await fetch(url).then(async res => await res.json());
  };
  get embed() {
    return new EmbedBuilder().setColor(16777215).setTimestamp();
  };
}