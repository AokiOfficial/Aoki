// this one's gonna be stressful as heck
// be careful trying to implement complex things
import { EmbedBuilder } from "@discordjs/builders";
// yes, it has become so bad we have to call structures to initialize
import { YorSlashCommand, Guild, Channel } from "yor.ts";
import he from "../assets/util/he";
import { format, parseISO } from "date-fns";
import { convert as toMarkdown } from "../assets/util/html-to-markdown";
import { Watching, User, Seiyuu, Character } from "../assets/const/graphql";
import AniSchedule from "../struct/Schedule";
import { anime } from "../assets/const/import";
import PermissionsBitField from "../struct/discord/PermissionsBitField";

export default class Anime extends YorSlashCommand {
  builder = anime
  execute = async ctx => {
    // define util
    const util = ctx.client.util;
    // defer reply
    await ctx.defer();
    // get sub
    const sub = ctx.getSubcommand();
    const subgroup = ctx.getSubcommandGroup();
    // default query param
    const query = ctx.getString("query");
    // commands
    // breathe in before reading
    if (!subgroup) {
      if (sub == "profile") {
        // we're globalizing this command
        // instead of splitting it into myanimelist and anilist
        const platform = ctx.getString("platform");
        // check query
        if (util.isProfane(query)) return await ctx.editReply({ content: "Stop sneaking in bad content please, you baka." });
        // fetch user query according to their platform choice
        if (platform == "al") {
          let res = await util.anilist(User, { search: query });
          // if no res is available
          if (res.errors) {
            let err;
            if (res.errors[0].status == 404) err = "Check your query. I just checked with the AniList data holder, they said no.";
            else if (res.errors.some(a => a.status >= 500)) err = "The AniList data holder is probably on a vacation. Wait for a little bit before trying again.";
            else if (res.errors.some(a => a.status >= 400)) err = "Sensei messed up, something's wrong with the paper sent to AniList's data holder. Try reporting this with `/my fault`||, although it's not my fault, sigh||.";
            else err = "Wow, this kind of error has never been documented. Wait for about 5-10 minutes, if nothing happens after that, report it with `/my fault`.";
            return await ctx.editReply({ content: err });
          };
          // make embed fields
          const topFields = Object.entries(res.data.User.favourites).map(([query, target]) => {
            const firstTarget = target.edges.map(entry => {
              const identifier = entry.node.title || entry.node.name;
              const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;
              return `[**${name}**](${entry.node.siteUrl})`;
            }).join('|') || 'None Listed';
            return `\n**Top 1 ${query}:** ` + firstTarget.split("|")[0];
          });
          // make embed
          const alprofile = new EmbedBuilder()
            .setColor(util.color)
            .setImage(res.data.User.bannerImage)
            .setThumbnail(res.data.User.avatar.medium)
            .setTitle(res.data.User.name)
            .setURL(res.data.User.siteUrl)
            .setDescription(`***About the user:** ${res.data.User.about ? util.textTruncate(he.decode(res.data.User.about.replace(/(<([^>]+)>)/g, '') || ''), 250) : "No description provided"}*` + `\n${topFields}`)
            .setFooter({ text: "Data sent from AniList", iconURL: util.getUserAvatar(ctx.member.raw.user) })
            .setTimestamp();
          await ctx.editReply({ embeds: [alprofile] });
        } else if (platform == "mal") {
          // fetch user query
          const res = (await fetch(`https://api.jikan.moe/v4/users/${encodeURIComponent(query)}/full`).then(res => res.json())).data;
          // if request error
          if (res.errors) {
            let err;
            if (res.errors.some(a => a.status >= 500)) err = "MyAnimeList receptionist is probably on a vacation. Wait a little bit, then try again.";
            else if (res.errors.some(a => a.status >= 400)) err = "Sensei messed up, something's wrong with the paper sent to MyAnimeList's receptionist. Try reporting this with `/my fault`||, although it's not my fault, sigh||.";
            else err = "Wow, this kind of error has never been documented. Wait for about 5-10 minutes, if nothing happens after that, report it with `/my fault`.";
            return await ctx.editReply({ content: err });
          };
          // shortcuts
          const fav_anime = util.joinArrayAndLimit(res.favorites.anime.map((entry) => {
            return `[${entry.title}](${entry.url.split('/').splice(0, 5).join('/')})`;
          }), 1000, ' • ');
          const fav_manga = util.joinArrayAndLimit(res.favorites.manga.map((entry) => {
            return `[${entry.title}](${entry.url.split('/').splice(0, 5).join('/')})`;
          }), 1000, ' • ');
          const fav_characters = util.joinArrayAndLimit(res.favorites.characters.map((entry) => {
            return `[${entry.name}](${entry.url.split('/').splice(0, 5).join('/')})`;
          }), 1000, ' • ');
          const fav_people = util.joinArrayAndLimit(res.favorites.people.map((entry) => {
            return `[${entry.name}](${entry.url.split('/').splice(0, 5).join('/')})`;
          }), 1000, ' • ');
          // make the embed
          // braindead code incoming
          const malProfileEmbed = new EmbedBuilder()
            .setColor(util.color)
            .setFooter({ text: `Data sent from MyAnimeList`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
            .setAuthor({ name: `${res.username}'s Profile`, iconURL: res.images.jpg.image_url })
            .setTimestamp()
            .setDescription([
              util.textTruncate((res.about || '').replace(/(<([^>]+)>)/ig, ''), 350, `... *[read more here](${res.url})*`),
              `• **Gender:** ${res.gender || 'Unspecified'}`,
              `• **From:** ${res.location || 'Unspecified'}`,
              `• **Joined:** ${format(parseISO(res.joined), 'EEEE, do MMMM yyyy')}`,
              `• **Last Seen:** ${format(parseISO(res.last_online), 'EEEE, do MMMM yyyy')}`
            ].join('\n'))
            .addFields([
              // thanks mai-bot for this masterpiece of formatting
              {
                name: 'Anime Statics', inline: true,
                value: '```fix\n' + Object.entries(res.statistics.anime).map(([key, value]) => {
                  const cwidth = 28;
                  const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                  const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                  return ' • ' + name + ':' + spacing + value;
                }).join('\n') + '```'
              }, {
                name: 'Manga Statics', inline: true,
                value: '```fix\n' + Object.entries(res.statistics.manga).splice(0, 10).map(([key, value]) => {
                  const cwidth = 28;
                  const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                  const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                  return ' • ' + name + ':' + spacing + value;
                }).join('\n') + '```'
              }, {
                name: 'Favorite Anime',
                value: fav_anime.text + (!!fav_anime.excess ? ` and ${fav_anime.excess} more!` : '') || 'None Listed.'
              }, {
                name: 'Favorite Manga',
                value: fav_manga.text + (!!fav_manga.excess ? ` and ${fav_manga.excess} more!` : '') || 'None Listed.'
              }, {
                name: 'Favorite Characters',
                value: fav_characters.text + (!!fav_characters.excess ? ` and ${fav_characters.excess} more!` : '') || 'None Listed.'
              }, {
                name: 'Favorite Staffs',
                value: fav_people.text + (!!fav_people.excess ? ` and ${fav_people.excess} more!` : '') || 'None Listed.'
              }
            ]);
          await ctx.editReply({ embeds: [malProfileEmbed] });
        }
      } else if (sub == "action") {
        // a more friendly command
        const actionPic = await fetch(`https://api.waifu.pics/sfw/${query}`).then(res => res.json());
        await ctx.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(util.color)
              .setImage(actionPic.url)
          ]
        });
      } else if (sub == "search") {
        // we're also globalizing this command
        // no more /anime search, /anime manga, /anime seiyuu and /anime character
        const type = ctx.getString("type");
        // searching on kitsu.io
        // check query
        if (util.isProfane(query)) return await ctx.editReply({ content: "Stop sneaking in bad content please, you baka." });
        // anime
        if (type == "anime") {
          const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${query}&page%5Boffset%5D=0&page%5Blimit%5D=1`).then(res => res.json());
          // if no data
          if (!res.data.length || !res) return await ctx.editReply({ content: `Baka, check your query. Kitsu.io's staff cannot find **${query}**, well, at least it's not in their records.` });
          // shortcut
          const data = res.data[0].attributes;
          // check again if no attribute is found
          if (!data) return await ctx.editReply({ content: `Check your query. Kitsu.io's staff cannot find **${query}**, well, at least it's not in their records.` });
          // check if channel is nsfw
          if (data.nsfw && !ctx.channel.nsfw) return await ctx.editReply({ content: `The content given to me by Kitsu.io is NSFW, and I can't show that in this channel, sorry. Please get in a NSFW channel, please.` });
          // check if content rating is nsfw
          if (data.ageRatingGuide && (data.ageRatingGuide.includes("Nudity") && data.ageRatingGuide.includes("Mature")) && !ctx.channel.nsfw) return await ctx.editReply({ content: `The content given to me by Kitsu.io has something to do with NSFW, and I can't show that in this channel, sorry. Please get in a NSFW channel, please.` });
          // make our embed
          const animeEmbed = new EmbedBuilder()
            .setTitle(`${data.titles.en_jp}`)
            .setURL(`https://kitsu.io/${res.data[0].id}`)
            .setThumbnail(data.posterImage.original)
            .setDescription(
              `*The cover of this anime can be found [here](https://media.kitsu.io/anime/poster_images/${res.data[0].id}/large.jpg)*\n\n` +
              `**Description:** ${util.textTruncate(`${data.synopsis}`, 250, `... *(read more [here](https://kitsu.io/anime/${res.data[0].id}))*`)}`
            ) // mobile users
            .setColor(util.color)
            .addFields([
              { name: "Type", value: `${data.showType}`, inline: true },
              { name: "Status", value: util.toProperCase(`${data.status}`), inline: true },
              { name: "Air Date", value: `${data.startDate}`, inline: true },
              { name: "Ep. Count", value: `${data.episodeCount}`, inline: true },
              { name: "Avg. Rating", value: `${data.averageRating}`, inline: true },
              { name: "Age Rating", value: `${data.ageRatingGuide.replace(")", "")}`, inline: true },
              { name: "Rating Rank", value: `#${data.ratingRank.toLocaleString()}`, inline: true },
              { name: "Popularity", value: `#${data.popularityRank.toLocaleString()}`, inline: true },
              { name: "NSFW?", value: util.toProperCase(`${data.nsfw}`), inline: true }
            ])
            .setFooter({ text: 'Powered by kitsu.io', iconURL: util.getUserAvatar(ctx.member.raw.user) })
            .setTimestamp();
          // send it
          await ctx.editReply({ embeds: [animeEmbed] });
        } else if (type == "manga") {
          const res = await fetch(`https://kitsu.io/api/edge/manga?filter[text]=${query}&page%5Boffset%5D=0&page%5Blimit%5D=1`).then(res => res.json());
          // if no data
          if (!res.data.length || !res) return await ctx.editReply({ content: `Baka, check your query. Kitsu.io's staff cannot find **${query}**, well, at least it's not in their records.` });
          // shortcut
          const data = res.data[0].attributes;
          // check again if no attribute is found
          if (!data) return await ctx.editReply({ content: `Check your query. Kitsu.io's staff cannot find **${query}**, well, at least it's not in their records.` });
          // check if channel is nsfw
          if (data.nsfw && !ctx.channel.nsfw) return await ctx.editReply({ content: `The content given to me by Kitsu.io is NSFW, and I can't show that in this channel, sorry. Please get in a NSFW channel, please.` });
          // check if content rating is nsfw
          if (data.ageRatingGuide && (data.ageRatingGuide.includes("Nudity") && data.ageRatingGuide.includes("Mature")) && !ctx.channel.nsfw) return await ctx.editReply({ content: `The content given to me by Kitsu.io has something to do with NSFW, and I can't show that in this channel, sorry. Please get in a NSFW channel, please.` });
          const mangaEmbed = new EmbedBuilder()
            .setTitle(`${data.titles.en_jp}`)
            .setURL(`https://kitsu.io/${res.data[0].id}`)
            .setThumbnail(data.posterImage.original)
            .setDescription(
              `*The cover of this manga can be found [here](https://media.kitsu.io/manga/poster_images/${res.data[0].id}/large.jpg)*\n\n` +
              `**Description:** ${util.textTruncate(`${data.synopsis}`, 250, `... *(read more [here](https://kitsu.io/manga/${res.data[0].id}))*`)}`
            ) // mobile users
            .setColor(util.color)
            .addFields([
              { name: "Type", value: util.toProperCase(`${data.subtype}`), inline: true },
              { name: "Status", value: util.toProperCase(`${data.status}`), inline: true },
              { name: "Air Date", value: `${data.startDate}`, inline: true },
              { name: "Volume Count", value: `${data.volumeCount ? data.volumeCount : "None recorded"}`, inline: true },
              { name: "Chapter Count", value: `${data.chapterCount ? data.chapterCount : "None recorded"}`, inline: true },
              { name: "Average Rating", value: `${data.averageRating.toLocaleString()}`, inline: true },
              { name: "Age Rating", value: `${data.ageRatingGuide ? data.ageRatingGuide : "None"}`, inline: true },
              { name: "Rating Rank", value: `#${data.ratingRank.toLocaleString()}`, inline: true },
              { name: "Popularity", value: `#${data.popularityRank.toLocaleString()}`, inline: true }
            ])
            .setFooter({ text: 'Powered by kitsu.io', iconURL: util.getUserAvatar(ctx.member.raw.user) })
            .setTimestamp();
          // send
          await ctx.editReply({ embeds: [mangaEmbed] });
        } else if (type == "character") {
          const res = (await util.anilist(Character, { search: query })).data.Character;
          // if error occurs
          if (!res) return await ctx.editReply({ content: "Can't find them. Could be server error, though. Try again with another query, or if this doesn't work as intended at all, use `/my fault`." });
          // shortcuts
          const desc = res.description.replace(/~!|!~/g, "||") || 'No description.';
          const dupeRemove = [...new Set(res.media.nodes.map(node => node.title.romaji))]
          // remove duplicate in anime/manga appearance
          let newDescStr = "";
          for (let i = 0; i < dupeRemove.length; i++) {
            newDescStr += `\n- ${dupeRemove[i]}`;
          };
          // make embed
          const embed = new EmbedBuilder()
            .setTitle(`Character information for ${res.name.full}`)
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/2048px-AniList_logo.svg.png")
            .setURL(res.siteUrl)
            .setDescription(desc)
            .addFields({
              name: 'Appears in...',
              value: newDescStr || 'None.'
            })
            .setImage(res.image.large)
            .setColor(util.color)
            .setTimestamp()
            .setFooter({ text: `Data sent from AniList • ${res.favourites} people love ${res.name.full}`, iconURL: util.getUserAvatar(ctx.member.raw.user) });
          await ctx.editReply({ embeds: [embed] });
        } else if (type == "seiyuu") {
          const res = (await util.anilist(Seiyuu, { search: query })).data;
          // if error occurs
          if (!res) return await ctx.editReply({ content: "Can't find them. Could be server error, though. Try again with another query, or if this doesn't work as intended at all, use `/my fault`." });
          // make embed
          const seiyuuEmbed = new EmbedBuilder()
            .setColor(util.color)
            .setThumbnail(res.Staff.image.large)
            .setAuthor({
              name: `${[
                res.Staff.name.full,
                res.Staff.name.native
              ].filter(Boolean).join(" | ")}`, url: res.Staff.siteUrl
            })
            .setDescription(`${[
              util.langflags.find(f => f.lang.toLowerCase() === res.Staff.language?.toLowerCase())?.flag,
              util.textTruncate(toMarkdown(he.decode(res.Staff.description || '\u200b')), 1000, `... *(read more [here](${res.Staff.siteUrl}))*`)
            ].join('\n')}`)
            .addFields([
              {
                name: `${res.Staff.name.full} voiced these characters`,
                value: `${util.joinArrayAndLimit(res.Staff.characters.nodes.map(x => {
                  return `[${x.name.full}](${x.siteUrl.split('/').slice(0, 5).join('/')})`;
                }), 1000, ' • ').text || 'None Found.'}`
              }, {
                name: `${res.Staff.name.full} is part of the staff of these anime`,
                value: `${util.joinArrayAndLimit(res.Staff.staffMedia.nodes.map(s => {
                  return `[${s.title.romaji}](${s.siteUrl.split('/').slice(0, 5).join('/')})`;
                }), 1000, ' • ').text || 'None Found.'}`
              }
            ])
            .setTimestamp()
            .setFooter({ text: `Data sent from AniList`, iconURL: util.getUserAvatar(ctx.member.raw.user) });
          await ctx.editReply({ embeds: [seiyuuEmbed] });
        }
      } else if (sub == "meme") {
        // just simple
        const res = await util.reddit("animemes");
        const meme = new EmbedBuilder()
          .setTitle(`**${res.title}**`)
          .setURL(res.url)
          .setDescription(`*Posted by **${res.author}***`)
          .setImage(res.image)
          .setColor(util.color)
          .setTimestamp()
          .setFooter({ text: `${res.upVotes} likes`, iconURL: util.getUserAvatar(ctx.member.raw.user) });
        await ctx.editReply({ embeds: [meme] });
      } else if (sub == "quote") {
        // simple
        const res = await fetch('https://animechan.xyz/api/random').then(res => res.json());
        await ctx.editReply({ content: `**${res.character}** from **${res.anime}**:\n\n*${res.quote}*` });
      } else if (sub == "random") {
        // fetch user query
        const type = ctx.getString("type");
        const res = (await fetch(`https://api.jikan.moe/v4/random/${encodeURIComponent(type)}`).then(res => res.json())).data;
        // if request error
        if (!res) return await ctx.editReply({ content: "Sensei messed up, something's wrong with the paper sent to MyAnimeList's receptionist. Try reporting this with `/my fault`||, although it's not my fault, sigh||." });
        // shortcuts
        const anime_stats = {
          "Main Genre": res.genres.length != 0 ? res.genres[0].name : "No data",
          "Source": res.source || "No data",
          "Episodes": res.episodes || "No data",
          "Status": res.status || "No data",
          "Schedule": res.broadcast ? "Every " + res.broadcast.day : "No data",
          "Duration": res.duration ? res.duration.replace(/ per /g, "/") : "No data"
        };
        const anime_scores = {
          "Average Score": res.score || "No data",
          "Scored By": res.scored_by ? res.scored_by + " people" : "No data",
          "Mean Rank": res.rank || "No data",
          "Popularity Rank": res.popularity || "No data",
          "Favorites": res.favorites || "No data",
          "Subscribed": res.members + " people" || "No data"
        }
        const manga_stats = {
          "Main Genre": res.genres.length != 0 ? res.genres[0].name : "No data",
          "Chapters": res.chapters || "No data",
          "Volumes": res.volumes || "No data",
          "Status": res.status || "No data"
        };
        const manga_scores = {
          // manga on mal has no average score
          "Mean Rank": res.rank || "No data",
          "Popularity Rank": res.popularity || "No data",
          "Favorites": res.favorites || "No data",
          "Subscribed": res.members + " people" || "No data"
        };
        // make the embed
        // braindead code incoming
        const malRandomEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setFooter({ text: `Data sent from MyAnimeList`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setAuthor({ name: `${res.title}`, iconURL: res.images.jpg.image_url })
          .setTimestamp()
          .setDescription([
            util.textTruncate((res.synopsis || '').replace(/(<([^>]+)>)/ig, ''), 350, `... *[read more here](${res.url})*`),
            `\n• **Main Theme:** ${res.themes[0]?.name || 'Unspecified'}`,
            `• **Demographics:** ${res.demographics[0]?.name || 'Unspecified'}`,
            `• **Air Season:** ${res.season ? util.toProperCase(res.season) : "Unknown"}`,
            `\n*More about the ${type} can be found [here](${res.url}), and the banner can be found [here](${res.images.jpg.image_url}).*`
          ].join('\n'))
          .addFields([
            {
              name: `${util.toProperCase(type)} Info`, inline: true,
              value: '```fix\n' + Object.entries(type == "anime" ? anime_stats : manga_stats).map(([key, value]) => {
                const cwidth = 28;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return ' • ' + name + ':' + spacing + value;
              }).join('\n') + '```'
            }, {
              name: `${util.toProperCase(type)} Scorings`, inline: true,
              value: '```fix\n' + Object.entries(type == "anime" ? anime_scores : manga_scores).splice(0, 10).map(([key, value]) => {
                const cwidth = 28;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return ' • ' + name + ':' + spacing + value;
              }).join('\n') + '```'
            }
          ]);
        await ctx.editReply({ embeds: [malRandomEmbed] });
      }
    } else if (subgroup == "schedule") {
      if (sub == "list") {
        // stable release
        // will still push to beta if needed
        let guild = await util.call({ method: "guild", param: [ctx.member.raw.guildID] });
        guild = new Guild(ctx.client, guild);
        // if (!guild.settings || !guild.settings.beta) return await ctx.editReply({ content: "Your server is not enrolled in the beta program, therefore you cannot use this command." });
        // get schedules of this guild
        const list = await guild.schedules;
        if (!list.length || list[0].anilistId == 0) return await ctx.editReply({ content: "Baka, this server has no anime subsciptions." });
        // do a full search
        // compile all ids into an array
        let watched = [];
        for (let i = 0; i < list.length; i++) {
          watched.push(list[i].anilistId);
        };
        let page = 0, hasNextPage = false, entries = [];
        const aniFetch = new AniSchedule(ctx.client);
        // fetch data
        do {
          const res = await aniFetch.fetch(Watching, { watched, page });
          // if there's some errors from anilist
          if (!res) {
            return await ctx.editReply({ content: "O-Oh, AniList returned an error. Maybe try again later?\n\n||Issue didn't resolve for more than an hour? Use `/bot feedback` to notice my sensei!||" });
            // else if there's actually nothing
          } else if (!entries.length && !res.data.Page.media.length) {
            return await ctx.editReply({ content: "Baka, this server has no anime subscriptions." });
            // else it means everything went okay
            // we store data
          } else {
            page = res.data.Page.pageInfo.currentPage + 1;
            hasNextPage = res.data.Page.pageInfo.hasNextPage;
            entries.push(...res.data.Page.media.filter(x => x.status === 'RELEASING'));
          };
        } while (hasNextPage);
        // format entries
        const description = entries.sort((A, B) => A.id - B.id).map(entry => {
          const id = ' '.repeat(6 - String(entry.id).length) + String(entry.id);
          const title = util.textTruncate(entry.title.romaji, 42, '...');
          return `• \`ID: [${id}]\` [**${title}**](${entry.siteUrl})`;
        }).join("\n");
        const embed = new EmbedBuilder()
          .setColor(util.color)
          .setDescription(`${description}`)
          .setThumbnail("https://i.imgur.com/wJqBxdk.png")
          .setAuthor({ name: `Current AniSchedule subscription list` })
          .setFooter({
            text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user)
          }).setTimestamp()
          .addFields({
            name: 'Tips', value: `${[
              `- Use \`/anime schedule add\` to add subscription`,
              `- Use \`/anime schedule remove\` to remove subscription`
            ].join('\n')}`
          });
        // send the embed
        await ctx.editReply({ embeds: [embed] });
      } else if (sub == "add") {
        const query = ctx.getString("query");
        let channel = await util.call({ method: "channel", param: [ctx.subcommandGroup.options[0].options.find(o => o.name == "channel").value] });
        channel = new Channel(ctx.client, channel);
        // check perms
        if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.ManageGuild)) return await ctx.editReply({ content: "Baka, you must have the `Manage Guild` permission to execute this command." });
        // define some utils
        const ani = new AniSchedule(ctx.client);
        // get guild settings
        let guild = await util.call({ method: "guild", param: [ctx.member.raw.guildID] });
        guild = new Guild(ctx.client, guild);
        // if (!guild.settings || !guild.settings.beta) return await ctx.editReply({ content: "Your server is not enrolled in the beta program, therefore you cannot use this command." });
        // get schedules of this guild
        let list = await guild.schedules;
        // if there's already one let them know
        if (list.length && list[0].anilistId != 0) return await ctx.editReply({ content: "For now, each server can only have **one schedule** running at a time for technical reasons.\n\nSorry for the inconvenience." });
        else {
          // check if query is a valid MAL or AniList url or id
          const anilistId = await util.getMediaId(query);
          // if it's not valid
          if (!anilistId) return await ctx.editReply({ content: "Have you made a typo or something? That one doesn't exist, baka." });
          // fetch channel
          // if channel type is voice, throw exception
          if (channel.type != 0) return await ctx.editReply({ content: "No, I can't speak in there for you, baka." });
          // fetch the media to check if it's actually airing
          const media = (await ani.fetch("query($id: Int!) { Media(id: $id) { id status nextAiringEpisode { timeUntilAiring episode } title { native romaji english } } }", { id: anilistId })).data.Media;
          if (!["NOT_YET_RELEASED", "RELEASING"].includes(media.status)) return await ctx.editReply({ content: "Baka, that's not airing. It's not an upcoming one, too. Maybe even finished." });
          // update the entry
          await guild.update({ channelId: ctx.channel.id, anilistId: media.id, nextEp: media.nextAiringEpisode.episode });
          // let them know
          return await ctx.editReply({ content: `Tracking airing episodes for **${media.title.romaji}** in ${channel ? "<#" + channel.id + ">" : "this channel"}.\n\nNext episode is airing in roughly **${Math.floor((media.nextAiringEpisode.timeUntilAiring / 60) / 60)}** hours.` });
        };
      } else if (sub == "remove") {
        // check perms
        if (!(await ctx.member.permissions).has(PermissionsBitField.Flags.ManageGuild)) return await ctx.editReply({ content: "Baka, you must have the `Manage Guild` permission to execute this command." });
        // get guild settings
        let guild = await util.call({ method: "guild", param: [ctx.member.raw.guildID] });
        guild = new Guild(ctx.client, guild);
        // if (!guild.settings || !guild.settings.beta) return await ctx.editReply({ content: "Your server is not enrolled in the beta program, therefore you cannot use this command." });
        // get schedules of this guild
        let list = await guild.schedules;
        // if there's nothing
        if (!list || list[0].anilistId == 0) return await ctx.editReply({ content: "Baka, this server has no anime subscription." });
        // define some utils
        const ani = new AniSchedule(ctx.client);
        // fetch media title
        const media = (await ani.fetch("query($id: Int!) { Media(id: $id) { id status title { native romaji english } } }", { id: list[0].anilistId })).data.Media;
        // remove the entry
        await guild.update({ channelId: '0', anilistId: 0, nextEp: 0 });
        // let them know
        return await ctx.editReply({ content: `Stopped tracking airing episodes for **${media.title.romaji}**.` });
      }
    }
  }
}
