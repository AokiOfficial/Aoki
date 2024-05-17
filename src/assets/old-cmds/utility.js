import { SlashCommand } from "slash-create/web";
import { EmbedBuilder } from "@discordjs/builders";
import { format, formatDistance, parseISO } from "date-fns";
import { util } from "../assets/const/import";

export default class Utility extends SlashCommand {
  constructor(creator) { super(creator, util) };
  async run(ctx) {
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
        if (!user) return ctx.send({ content: "You baka, that's not a valid user." });
        // get avatar
        // use variable size so user has many options to pick from
        const img = (s) => util.getUserAvatar(user, s);
        // reply
        const avatarEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${user.username}'s Avatar` })
          .setImage(img(2048)).setTimestamp()
          .setDescription(`Quality: [x128](${img(128)}) | [x256](${img(256)}) | [x512](${img(512)}) | [x1024](${img(1024)}) | [x2048](${img(2048)})`)
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") });
        await ctx.send({ embeds: [avatarEmbed] });
      } else if (sub == "banner") {
        let user = ctx.getUser("member");
        // check user
        if (!user) return ctx.send({ content: "You baka, that's not a valid user." });
        // force fetch the user
        // the banner property is only accessible by force fetching
        // as documented in the d.js repo
        const fetchedUser = await util.call({
          method: "user",
          param: [user.id]
        });
        user = fetchedUser;
        // check if user has banner
        if (!user.banner) return ctx.send({ content: "Baka, this user has no banner." });
        // get banner
        const img = (s) => util.getUserBanner(user, s);
        // reply
        const bannerEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${user.username}'s Avatar` })
          .setImage(img(2048)).setTimestamp()
          .setDescription(`Quality: [x128](${img(128)}) | [x256](${img(256)}) | [x512](${img(512)}) | [x1024](${img(1024)}) | [x2048](${img(2048)})`)
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") });
        await ctx.send({ embeds: [bannerEmbed] });
      } else if (sub == "channel") {
        const channel = ctx.getChannel("channel");
        // check channel
        // edge case handling again
        if (!channel) return await ctx.send({ content: "Baka, that channel does not exist." });
        // date shortcut
        const createdAt = new Date(util.getCreatedAt(channel.id));
        const time = formatDistance(createdAt, new Date(), { addSuffix: true });
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
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
          .setTimestamp()
          .addFields([
            {
              name: "\u2000",
              value: '```fix\n' + Object.entries({
                "Position": channel.position || "Unknown",
                "Type": type,
                "Created": time,
                "NSFW?": channel.nsfw ? "Yes" : "No",
                "Slowmode": channel.slowmode || "None",
                "ID": channel.id,
                "Topic": channel.topic
              }).map(([key, value]) => {
                const cwidth = 30;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return '• ' + name + (name.endsWith("?") ? ' ' :':') + spacing + value;
              }).join('\n') + '```'
            }
          ]);
        // finally send the embed
        await ctx.send({ embeds: [channelEmbed] });
      } else if (sub == "server") {
        // get the server id
        const guildID = ctx.member.guildID;
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
        const since = format(new Date(util.getCreatedAt(guildInfo.id)), 'MMMM yyyy');
        // filter channel based on channel type
        const text = guildInfo.channels.filter(channel => channel.type == 0).length;
        const voice = guildInfo.channels.filter(channel => channel.type == 2).length;
        const category = guildInfo.channels.filter(channel => channel.type == 4).length;
        const news = guildInfo.channels.filter(channel => channel.type == 5).length;
        // make the embed
        const guildEmbed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: `${guildInfo.name}`, iconURL: icon })
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
          .setTimestamp()
          .setDescription(`*${guildInfo.description == null ? "Server has no description." : guildInfo.description}*\n\n`)
          .addFields([
            {
              name: "General Info",
              value: '```fix\n' + Object.entries({
                "Owner": util.textTruncate(owner.username, 11),
                "Role Count": guildInfo.roles.length,
                "Emoji Count": guildInfo.emojis.length,
                "Created": since,
                "Boosts": guildInfo.premium_subscription_count,
                "Main Locale": guildInfo.preferred_locale,
                "Verification": guildInfo.verification_level,
                "Filter": guildInfo.explicit_content_filter
              }).map(([key, value]) => {
                const cwidth = 24;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return '• ' + name + (name.endsWith("?") ? ' ' :':') + spacing + value;
              }).join('\n') + '```',
              inline: true
            },
            {
              name: "Channels Info",
              value: '```fix\n' + Object.entries({
                "Text Channels": text,
                "Voice Channels": voice,
                "Categories": category,
                "News Channels": news,
                "AFK Channel": guildInfo.afk_channel ? guildInfo.afk_channel.name : "None"
              }).map(([key, value]) => {
                const cwidth = 24;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return '• ' + name + (name.endsWith("?") ? ' ' :':') + spacing + value;
              }).join('\n') + '```',
              inline: true
            }
          ])
        // now send the embed
        await ctx.send({ embeds: [guildEmbed] })
      } else if (sub == "github") {
        // get user and repo from input
        const [u, r] = (ctx.getOption("name")).trim().split("/");
        // check if them both are present
        if (!u || !r) return await ctx.send({ content: "Baka, follow this format: `[repo owner]/[repo name]`." });
        // call the api
        // have to specify the user agent here
        const repoData = await fetch(`https://api.github.com/repos/${u}/${r}`, {
          headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
          }
        }).then(res => res.json());
        // check if repo exists
        if (!repoData.id) return await ctx.send({ content: "Baka, that repository doesn't exist." });
        // small methods
        // format bype to human readable size
        const formatBytes = (bytes) => {
          if (bytes === 0) return '0 Bytes';
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', "PB", 'EB', 'ZB', 'YB'];
          const i = Math.floor(Math.log(bytes) / Math.log(1024));
          return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
        };
        const size = formatBytes(repoData.size);
        const license = repoData.license.name;
        // make embed
        const embed = new EmbedBuilder()
          .setColor(util.color)
          .setAuthor({ name: "GitHub", iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' })
          .setTitle(`${repoData.full_name}`)
          .setURL(repoData.html_url)
          .setThumbnail(repoData.owner.avatar_url)
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
          .setTimestamp()
          .setDescription(`${repoData.description}\n\n`)
          .addFields([
            {
              name: "\u2000",
              value: '```fix\n' + Object.entries({
                "Language": repoData.language || "Unknown",
                "Forks": repoData.forks_count.toLocaleString(),
                "License": license,
                "Open Issues": repoData.open_issues.toLocaleString(),
                "Watchers": repoData.subscribers_count.toLocaleString(),
                "Stars": repoData.stargazers_count.toLocaleString(),
                "Size": size,
                "Archived?": repoData.archived ? "Yes" : "No",
                "Disabled?": repoData.disabled ? "Yes" : "No",
                "Forked?": repoData.fork ? "Yes" : "No"
              }).map(([key, value]) => {
                const cwidth = 30;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return '• ' + name + (name.endsWith("?") ? ' ' :':') + spacing + value;
              }).join('\n') + '```'
            }
          ])
        // send it
        await ctx.send({ embeds: [embed] })
      } else if (sub == "npm") {
        const name = ctx.getOption("name");
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
        if (!npmData || npmData.length < 1) return await ctx.send({ content: "Baka, that's an invalid repository. Or did you make a typo?" });
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
          .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
          .setTimestamp()
          .setDescription(
            `${util.textTruncate(npmData.description, 75)}\n\n` +
            `**Keywords:** ${npmData.keywords && npmData.keywords.length > 0 ? `${keywords}` : "None"}\n` +
            `**Maintainers:** ${maintainers.join(", ")}`
          )
          .addFields([
            {
              name: "\u2000",
              value: '```fix\n' + Object.entries({
                "Version": npmData.version || "Unknown",
                "Author": npmData.publisher.username,
                "Modified": format(parseISO(npmData.date), 'EEEE, do MMMM yyyy'),
                "Score": (score.final * 100).toFixed(1)
              }).map(([key, value]) => {
                const cwidth = 40;
                const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
                const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

                return '• ' + name + ':' + spacing + value;
              }).join('\n') + '```'
            }
          ])
        // send embed
        await ctx.send({ embeds: [npmEmbed] });
      } else if (sub == "urban") {
        const query = ctx.getOption("word");
        // base api url
        const apiUrl = `https://api.urbandictionary.com/v0/define?term=${query}`;
        // check for nsfw
        if (util.isProfane(query) && !ctx.channel.nsfw) return await ctx.send({ content: "Hey, I won't search for that! Don't tell me to search for bad words in here!" });
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
            .setFooter({ text: `Requested by ${ctx.user.username}`, iconURL: ctx.user.dynamicAvatarURL("png") })
            .addFields([
              {
                name: 'Definition',
                value: '```fix\n' + `${ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.definition)
                  : util.textTruncate(util.cleanProfane(definition.definition), 1000)}` + '\n```',
              },
              {
                name: 'Examples',
                value: '```fix\n' + `${ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.example || 'N/A')
                  : util.textTruncate(util.cleanProfane(definition.example || 'N/A'), 1000)}` + '\n```',
              },
              {
                name: 'Submitted by',
                value: '```fix\n' + `${ctx.channel.nsfw === true || ctx.channel.nsfw === undefined
                  ? util.textTruncate(definition.author || 'N/A', 250)
                  : util.textTruncate(util.cleanProfane(definition.author || 'N/A'), 250)}` + '\n```',
              },
              {
                name: 'Profane Word?',
                value: 'Yell at my sensei through `/my fault`, the patch should be added in a few working days.',
              },
            ]);
          return await ctx.send({ embeds: [embed] });
        } else {
          return await ctx.send({ content: "Hmph, seems like there's no definition for that. Even on Urban Dictionary.\n\nYou know what that means." });
        }
      } else if (sub == "ask") {
        const question = ctx.getOption("question");
        // restrict length
        if (question.length > 180) return await ctx.send({ content: "Write a shorter question. I'm not that bothered to work with only you, I got works to do." })
        // check for nsfw
        if (util.isProfane(question) && !ctx.channel.nsfw) return await ctx.send({ content: "Hey, I can't help you with that! Don't tell me to deal with bad words in here!" });
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
        await ctx.send({ content: data.candidates[0].content.parts[0].text }).catch(async err => {
          console.log(err);
          await ctx.send({ content: "Hang on there, I'm busy. It should be done in about an hour.\n\nIf nothing changes after that timeframe, probably give my sensei a yell. Do `/my fault`." });
        });
      } else if (sub == "profile") {
        // this command is so problematic we have to go try/catch
        try {
          // all of these information are not required
          const user = ctx.getUser("user") || ctx.user;
          // 1. use specified mode OR 2. use user mode OR 3. use default mode "taiko"
          // not supporting std yet
          const mode = ctx.getOption("mode") || ctx.user.settings?.defaultMode || "taiko";
          if (mode == "standard") return await ctx.send({ content: "Support for mode `standard` is not yet implemented! Please come back again later."});
          // check wallet
          // make user entry if something happens
          // create an initial settings variable to use along with reply
          const initialSettings = user.settings;
          if (!initialSettings?.bankOpened) await user.update({ bankOpened: 1, bankBalance: 100 });
          // check if user has osu profile
          // if not we mock data to all 0
          // we're gonna fetch a lot of things
          let profile;
          // define the presets
          // define data to send to renderer
          // as cfworkers cannot render images with canvas
          // we're using this instead
          let data = {
            avatar: util.getUserAvatar(user != ctx.user ? (ctx.getUser("user")) : ctx.user),
            name: user != ctx.user ? (ctx.getUser("user")).username : ctx.user.username,
            color: user.settings?.profileColor || "rgb(105, 105, 105)",
            background: user.settings?.background || "https://i.imgur.com/WCgt3Ql.jpeg",
            pattern: user.settings?.pattern || "https://i.imgur.com/nx5qJUb.png",
            emblem: user.settings?.emblem || undefined,
            owns: user.settings?.owns ? user.settings.owns.toString().split(",").length : "0",
            key: ctx.client.env["RENDER_KEY"],
            bank: {
              wallet: user.settings?.pocketBalance || "0",
              bank: user.settings?.bankBalance || "100"
            }
          };
          // check if background is still usable and not expired
          // an expired image url will throw
          if (user.settings?.background) {
            try {
              await fetch(user.settings.background).then(async res => await res.arrayBuffer());
            } catch {
              return await ctx.send({ content: "Baka, your background URL expired. Set a new one." });
            };
          };
          // only fetch plays if they have set their osu info
          if (user.settings?.inGameName) {
            profile = await fetch(`https://osu.ppy.sh/api/get_user?k=${ctx.client.env["OSU_KEY"]}&u=${user.settings.inGameName}&m=${util.osuNumberModeFormat(mode)}`).then(async res => await res.json());
            profile = profile[0];
            // if still no data
            if (!profile.username) return await ctx.send({ content: "The osu! profile linked with the profile does not exist." });
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
            const best = await fetch(`https://osu.ppy.sh/api/v2/users/${profile.user_id}/scores/best?mode=${util.osuStringModeFormat(mode)}&limit=51`, {
              headers: {  
                "Authorization": `Bearer ${loginCredentials.access_token}` 
              }
            }).then(async res => await res.json());
            // check if best is less than 50
            if (best.length < 50) return await ctx.send({ content: `Baka, you only have **${best.length}**/50 plays (your username is set to **${profile.username}**). You can't render a card for **${mode}** yet.` });
            // set to data
            data = { ...data, osu: { name: profile.username, best: best, mode: util.osuNumberModeFormat(mode) } };
          }
          // if user has no osu profile
          // mock it
          else {
            data = { ...data, osu: { name: undefined, best: undefined, mode: undefined } };
          };
          // ask renderer to process our data
          // cfworkers does not count fetch() processes to cpu time
          // (source: https://stackoverflow.com/questions/68720436/what-is-cpu-time-and-wall-time-in-the-context-of-cloudflare-worker-request)
          // so we are good
          const rawImage = await fetch("https://unusual-tan-threads.cyclic.app/render", {
            method: "POST",
            body: JSON.stringify({ data: data }), 
            headers: { 'Content-Type': 'application/json' },
          }).then(async res => await res.arrayBuffer());
          // get reply context to provide info
          let replyContext;
          if (!initialSettings) replyContext = "**Tip:** A bank has already been opened for you upon this execution! You now have **¥100** in your bank.";
          else if (!user.settings?.defaultMode) replyContext = "**Tip:** You don't have an osu! profile linked! Do that by using `/osu set`."
          else replyContext = "**Tip:** Background looks wrong? Try resizing it. The area's resolution is **475x250**."
          // upload image to imgbb
          const image = await util.upload(Buffer.from(rawImage).toString('base64'));
          // make new embed
          const embed = new EmbedBuilder().setImage(image).setColor(util.color);
          // send it
          return ctx.send({ content: `${replyContext}`, embeds: [embed] });
        } catch (err) {
          await ctx.send({ content: `Oh, something happened internally. It's my sensei's fault, please report this with \`/my fault\`, and pass this error message in there.\n\`\`\`fix\n${err}\n\`\`\``});
        };
      }
    }
  }
}