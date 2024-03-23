import { YorSlashCommand, User } from "yor.ts";
import { EmbedBuilder } from "@discordjs/builders";
import { format, formatDistance, parseISO } from "date-fns";
import { util } from "../assets/const/import";

export default class Utility extends YorSlashCommand {
  builder = util
  execute = async ctx => {
    // defer reply
    await ctx.defer();
    // define util
    const util = ctx.client.util;
    // get subgroup
    const subGroup = ctx.getSubcommandGroup();
    // get subcommand
    const sub = ctx.getSubcommand();
    // check if subgroup
    if (!subGroup) {
      // commands
      if (sub == "avatar") {
        const user = ctx.getUser("member");
        // check user
        // in edge cases, user might leave right at the time of execution
        if (!user) return ctx.editReply({ content: "You baka, that's not a valid user." });
        // get avatar
        // use variable size so user has many options to pick from
        const img = (s) => util.getUserAvatar(user.raw, s);
        // reply
        const avatarEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${user.raw.username}'s Avatar` })
          .setImage(img(2048)).setTimestamp()
          .setDescription(`Quality: [x128](${img(128)}) | [x256](${img(256)}) | [x512](${img(512)}) | [x1024](${img(1024)}) | [x2048](${img(2048)})`)
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) });
        await ctx.editReply({ embeds: [avatarEmbed] });
      } else if (sub == "banner") {
        let user = ctx.getUser("member");
        // check user
        if (!user) return ctx.editReply({ content: "You baka, that's not a valid user." });
        // force fetch the user
        // the banner property is only accessible by force fetching
        // as documented in the d.js repo
        const fetchedUser = await util.call({
          method: "user",
          param: [user.raw.id]
        });
        user = fetchedUser;
        // check if user has banner
        if (!user.banner) return ctx.editReply({ content: "Baka, this user has no banner." });
        // get banner
        const img = (s) => util.getUserBanner(user, s);
        // reply
        const bannerEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${user.username}'s Avatar` })
          .setImage(img(2048)).setTimestamp()
          .setDescription(`Quality: [x128](${img(128)}) | [x256](${img(256)}) | [x512](${img(512)}) | [x1024](${img(1024)}) | [x2048](${img(2048)})`)
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) });
        await ctx.editReply({ embeds: [bannerEmbed] });
      } else if (sub == "channel") {
        const channel = ctx.getChannel("channel");
        // check channel
        // edge case handling again
        if (!channel) return await ctx.editReply({ content: "Baka, that channel does not exist." });
        // date shortcut
        const createdAt = new Date(util.getCreatedAt(channel.id));
        const time = formatDistance(createdAt, new Date(), { addSuffix: true });
        const discordDate = "<t:" + Math.round(util.getCreatedTimestamp(channel.id) / 1000) + ":D>";
        // channel type
        let icon, type;
        switch (channel.type) {
          // Enum value
          case 0: icon = "https://i.imgur.com/IkQqhRj.png"; type = "Text Channel"; break;
          case 2: icon = "https://i.imgur.com/VuuMCXq.png"; type = "Voice Channel"; break;
          case 4: icon = "https://i.imgur.com/Ri5YA3G.png"; type = "Guild Category"; break;
          case 5: icon = "https://i.imgur.com/4TKO7k6.png"; type = "News Channel"; break;
          case 10: icon = "https://i.imgur.com/Dfu73ox.png"; type = "Threads Channel"; break;
          case 11: icon = "https://i.imgur.com/Dfu73ox.png"; type = "Threads Channel"; break;
          case 12: icon = "https://i.imgur.com/Dfu73ox.png"; type = "Threads Channel"; break;
          case 13: icon = "https://i.imgur.com/F92hbg9.png"; type = "Stage Channel"; break;
          case 14: icon = "https://i.imgur.com/Dfu73ox.png"; type = "Guild Directory"; break;
          case 15: icon = "https://i.imgur.com/q13YoYu.png"; type = "Guild Forum"; break;
        };
        // make embed
        const channelEmbed = new EmbedBuilder()
          // grammar check
          // if channel ends with "s" only write a tick
          // else do like normal
          .setAuthor({ name: `${channel.name}${channel.name.endsWith("s") ? "'" : "'s"} Information` })
          .setThumbnail(icon)
          .setColor(util.color)
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .addFields([
            { name: '• Position', value: `${channel.position + 1 == "NaN" ? channel.position + 1 : "Unknown"}` },
            { name: `• Type`, value: `${type}` },
            { name: `• Created At`, value: `${discordDate} [\`${time}\`]` },
            { name: `• NSFW`, value: `${channel.nsfw ? "Yes" : "No"}` },
            { name: `• Slowmode`, value: `${channel.slowmode || "No Slowmode"}` },
            { name: '• Channel ID', value: `${channel.id}` },
            { name: "• Channel Topic", value: `${channel.topic || "No Topic"}` }
          ]);
        // finally send the embed
        await ctx.editReply({ embeds: [channelEmbed] });
      } else if (sub == "server") {
        // get the server id
        const guildID = ctx.member.raw.guildID;
        // make an api call to fetch the server info
        // does not include channels
        // therefore we have to make another one
        let guildInfo = await util.call({
          method: "guild",
          param: [guildID]
        });
        // get it in the guildinfo object to avoid polluting
        guildInfo.channels = await util.call({
          method: "guildChannels",
          param: [guildID]
        });
        // shortcuts
        // get owner
        const owner = await util.call({
          method: "user",
          param: [guildInfo.owner_id]
        });
        // get icon
        const icon = util.getGuildIcon(guildInfo);
        // created date
        const since = format(new Date(util.getCreatedAt(guildInfo.id)), 'EEEE, do MMMM yyyy');
        // filter channel based on channel type
        const text = guildInfo.channels.filter(channel => channel.type == 0).length;
        const voice = guildInfo.channels.filter(channel => channel.type == 2).length;
        const category = guildInfo.channels.filter(channel => channel.type == 4).length;
        const news = guildInfo.channels.filter(channel => channel.type == 5).length;
        // make the embed
        const guildEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${guildInfo.name}`, iconURL: icon })
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setDescription(
            `*${guildInfo.description == null ? "Server has no description." : guildInfo.description}*\n\n` +
            `**• Owner:** [${owner.username}](https://discord.com/users/${owner.id})\n` +
            `**• Channels:** ${text} text \| ${voice} voice \| ${category} ${category > 1 ? "categories" : "category"} \| ${news} news\n` +
            `**• Role Count:** ${guildInfo.roles.length}\n` +
            `**• Emoji Count:** ${guildInfo.emojis.length}\n` +
            `**• Created:** ${since}\n` +
            `**• Preferred Locale:** ${guildInfo.preferred_locale}\n` +
            `**• Boosting:** Level ${guildInfo.premium_tier}, ${guildInfo.premium_subscription_count} boost${guildInfo.premium_subscription_count > 1 ? "s" : ""}\n` +
            `**• Verification Level:** ${guildInfo.verification_level}\n` +
            `**• Content Filter:** ${guildInfo.explicit_content_filter}\n` +
            `**• AFK Channel ID:** ${guildInfo.afk_channel ? guildInfo.afk_channel.id : "None"}`
          )
        // now send the embed
        await ctx.editReply({ embeds: [guildEmbed] })
      } else if (sub == "github") {
        // get user and repo from input
        const [u, r] = (ctx.getString("name")).trim().split("/");
        // check if them both are present
        if (!u || !r) return await ctx.editReply({ content: "Baka, follow this format: `[repo owner]/[repo name]`." });
        // call the api
        // have to specify the user agent here
        const repoData = await fetch(`https://api.github.com/repos/${u}/${r}`, {
          headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
          }
        }).then(res => res.json());
        // check if repo exists
        if (!repoData.id) return await ctx.editReply({ content: "Baka, that repository doesn't exist." });
        // small methods
        // format bype to human readable size
        const formatBytes = (bytes) => {
          if (bytes === 0) return '0 Bytes';
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', "PB", 'EB', 'ZB', 'YB'];
          const i = Math.floor(Math.log(bytes) / Math.log(1024));
          return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
        };
        const size = formatBytes(repoData.size);
        const license = repoData.license && repoData.license.name && repoData.license.url ? `[${repoData.license.name}](${repoData.license.url})` : repoData.license && repoData.license.name || "None";
        // make embed
        const embed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: "GitHub", iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' })
          .setTitle(`${repoData.full_name}`)
          .setURL(repoData.html_url)
          .setThumbnail(repoData.owner.avatar_url)
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setDescription(
            `${repoData.fork ? `***Forked** from **[${repoData.parent.full_name}](${repoData.parent.html_url})**.*` : "*Parent repository.*"}\n\n` +
            `**• Language:** ${repoData.language || "Unknown"}\n` +
            `**• Forks:** ${repoData.forks_count.toLocaleString()}\n` +
            `**• License:** ${license}\n` +
            `**• Open Issues:** ${repoData.open_issues.toLocaleString()}\n` +
            `**• Watchers:** ${repoData.subscribers_count.toLocaleString()}\n` +
            `**• Stars:** ${repoData.stargazers_count.toLocaleString()}\n` +
            `**• Size:** ${size}\n` +
            `**• Archive Status:** ${repoData.archived ? "Yes" : "No"}\n` +
            `**• Disabled?** ${repoData.disabled ? "Yes" : "No"}\u200b`
          )
        // send it
        await ctx.editReply({ embeds: [embed] })
      } else if (sub == "npm") {
        const name = ctx.getString("name");
        // call api
        const rawData = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(name)}&size=1`, {
          headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
          }
        }).then(res => res.json());
        // make the data usable
        const npmData = rawData.objects[0].package;
        const score = rawData.objects[0].score;
        let maintainers = [];
        // check repo
        if (!npmData || npmData.length < 1) return await ctx.editReply({ content: "Baka, that's an invalid repository. Or did you make a typo?" });
        // push maintainers
        for (let n = 0; n < npmData.maintainers.length; n++) {
          maintainers.push("`" + npmData.maintainers[n].username + "`")
        };
        // map keywords
        const keywords = npmData.keywords.map(k => `\`${k}\``).join(', ');
        // make embed
        const npmEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: "npm Registry", iconURL: 'https://i.imgur.com/24yrZxG.png' })
          .setTitle(`${npmData.name}`)
          .setURL(`https://www.npmjs.com/package/${npmData.name}`)
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setDescription(
            `${util.textTruncate(npmData.description, 75)}\n\n` +
            `**• Version:** ${npmData.version || "Unknown"}\n` +
            `**• Author:** ${npmData.publisher.username}\n` +
            `**• Modified:** ${format(parseISO(npmData.date), 'EEEE, do MMMM yyyy')}\n` +
            `**• Score:** ${(score.final * 100).toFixed(1)}%\n` +
            `**• Maintainers:** ${maintainers.join(', ')}\n` +
            `**• Keywords:** ${npmData.keywords && npmData.keywords.length > 0 ? `${keywords}` : "None"}`
          )
        // send embed
        await ctx.editReply({ embeds: [npmEmbed] });
      } else if (sub == "urban") {
        const query = ctx.getString("word");
        // base api url
        const apiUrl = `https://api.urbandictionary.com/v0/define?term=${query}`;
        // check for nsfw
        if (util.isProfane(query) && !ctx.channel.nsfw) return await ctx.editReply({ content: "Hey, I won't search for that! Don't tell me to search for bad words in here!" });
        // else just continue
        // fetch the urban definition
        const data = await fetch(apiUrl, {
          headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
          }
        }).then(res => res.json());
        // only if a list exists we proceed
        if (data.list && data.list.length > 0) {
          const definition = data.list[0];
          const embed = new EmbedBuilder()
            .setColor(util.color)
            .setTitle(`Definition of ${definition.word}`)
            .setURL(definition.urbanURL)
            .setThumbnail("https://static.wikia.nocookie.net/logopedia/images/a/a7/UDAppIcon.jpg")
            .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
            .addFields([
              {
                name: 'Definition',
                value: ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.definition)
                  : util.textTruncate(util.clean(definition.definition), 1000),
              },
              {
                name: 'Examples',
                value: ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.example || 'N/A')
                  : util.textTruncate(util.clean(definition.example || 'N/A'), 1000),
              },
              {
                name: 'Submitted by',
                value: ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.author || 'N/A', 250)
                  : util.textTruncate(util.clean(definition.author || 'N/A'), 250),
              },
              {
                name: 'Profane Word?',
                value: 'Yell at my sensei through `/my fault`, the patch should be added in a few working days.',
              },
            ]);
          return await ctx.editReply({ embeds: [embed] });
        } else {
          return await ctx.editReply({ content: "Hmph, seems like there's no definition for that. Even on Urban Dictionary.\n\nYou know what that means." });
        }
      } else if (sub == "ask") {
        const question = ctx.getString("question");
        // restrict length
        if (question.length > 180) return await ctx.editReply({ content: "Write a shorter question. I'm not that bothered to work with only you, I got works to do." })
        // check for nsfw
        if (util.isProfane(question) && !ctx.channel.nsfw) return await ctx.editReply({ content: "Hey, I can't help you with that! Don't tell me to deal with bad words in here!" });
        // ask gemini things
        const data = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${ctx.client.env["GEMINI_KEY"]}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                // match personality tho
                // it's more fun than normal repetitive ai tone
                // y'know, you'll see things like baka and science in one same reply
                text: `${question}, reply as a tsundere scientist and make it short`
              }]
            }],
            generationConfig: {
              temperature: 1.0,
              maxOutputTokens: 400,
              topP: 0.8,
              topK: 10
            }
          })
        }).then(res => res.json());
        await ctx.editReply({ content: data.candidates[0].content.parts[0].text }).catch(async err => {
          console.log(err);
          await ctx.editReply({ content: "Hang on there, I'm busy. It should be done in about an hour.\n\nIf nothing changes after that timeframe, probably give my sensei a yell. Do `/my fault`." });
        });
      } else if (sub == "profile") {
        // all of these information are not required
        const user = ctx.getUser("user") || ctx.user;
        // 1. use specified mode OR 2. use user mode OR 3. use default mode "osu"
        const mode = ctx.getString("mode") || ctx.user.settings.defaultMode || "osu";
        // check if user has osu profile
        // if not we mock data to all 0
        // we're gonna fetch a lot of things
        let data, profile;
        // only fetch plays if they have set their osu info
        if (user.settings.inGameName) {
          profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user.settings.inGameName}&m=${util.requestModeFormat(mode)}`).then(async res => await res.json());
          profile = profile[0];
          // if still no data
          if (!profile.username) return await ctx.editReply({ content: "Baka, that user doesn't exist." });
          // login with oapiv2
          // to get top plays to push into
          let loginCredentials = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            body: JSON.stringify({
              grant_type: 'client_credentials',
              client_id: '14095',
              client_secret: ctx.client.env["OSU_AUTH"],
              scope: 'public',
            }), 
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(async res => await res.json());
          // use that token to get user best
          const best = await fetch(`https://osu.ppy.sh/api/v2/users/${profile.user_id}/scores/best?mode=${mode}&limit=51`, {
            headers: {  
              "Authorization": `Bearer ${loginCredentials.access_token}` 
            }
          }).then(async res => await res.json());
          // check if best is less than 50
          if (best.length < 50) return await ctx.editReply({ content: `Baka, you only have **${best.length}**/50 plays. You can't render a card for that mode yet.` });
          // set to data
          // define data to send to renderer
          // as cfworkers cannot render images with canvas
          // we're using this instead
          data = {
            avatar: util.getUserAvatar(ctx.getUser("user") || ctx.member.raw.user),
            name: ctx.getUser("user") ? ctx.getUser("user").username : ctx.member.raw.user.username,
            osu: {
              name: profile.username,
              best: best,
              mode: util.requestModeFormat(mode)
            },
            color: user.settings.profileColor || "rgb(211, 211, 211)",
            background: user.settings.background || "https://i.imgur.com/WCgt3Ql.jpeg",
            pattern: user.settings.pattern || "https://i.imgur.com/nx5qJUb.png",
            emblem: user.settings.emblem || undefined,
            owns: user.settings.owns || "0",
            bank: {
              wallet: user.settings.pocketBalance || "0",
              bank: user.settings.bankBalance || "0"
            },
          };
        }
        // if user has no osu profile
        // mock it
        else {
          data = {
            avatar: util.getUserAvatar(ctx.getUser("user") || ctx.member.raw.user),
            name: ctx.getUser("user") ? ctx.getUser("user").username : ctx.member.raw.user.username,
            osu: {
              name: undefined,
              best: undefined,
              mode: undefined
            },
            color: user.settings.profileColor || "rgb(211, 211, 211)",
            background: user.settings.background || "https://i.imgur.com/WCgt3Ql.jpeg",
            pattern: user.settings.pattern || "https://i.imgur.com/nx5qJUb.png",
            emblem: user.settings.emblem || undefined,
            owns: user.settings.owns || "0",
            bank: {
              wallet: user.settings.pocketBalance || "0",
              bank: user.settings.bankBalance || "0"
            },
          };
        };
        // ask renderer to process our data
        // cfworkers does not count fetch() processes to cpu time
        // (source: https://stackoverflow.com/questions/68720436/what-is-cpu-time-and-wall-time-in-the-context-of-cloudflare-worker-request)
        // so we are good
        const image = await fetch("https://unusual-tan-threads.cyclic.app/render", {
          method: "POST",
          body: JSON.stringify({
            data: data
          }), 
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async res => await res.arrayBuffer());
        // load image data
        const attachment = {
          contentType: "Buffer",
          data: image,
          name: "profile.png"
        };
        // send
        await ctx.editReply({ files: [attachment] });
      }
    }
  }
}