// ref!: error handling
// <-->: block division
// /**/: useless? notes
import { SlashCommand } from "slash-create/web";
import { EmbedBuilder } from "@discordjs/builders";
import { format, formatDistance, parseISO } from "date-fns";
import { util } from "../assets/const/import";

export default class Utility extends SlashCommand {
  constructor(creator) {
    super(creator, util);
    this.imgur = "https://i.imgur.com/";
    this.headers = {
      'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
    };
  };
  // <--> main block
  async run(ctx) {
    this.ctx = ctx;
    // <--> get command and define utilities
    const sub = ctx.getSubcommand();
    const util = ctx.client.util;
    // <--> run command in try...catch
    try {
      await ctx.defer();
      return await this[sub](ctx, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      };
    };
  };
  // <--> avatar command
  async avatar(ctx) {
    const user = ctx.getUser("user") || ctx.user;
    // <--> handle different sizes
    const avatar = (s) => {
      return user.dynamicAvatarURL("png", s);
    };
    const description = [
      `Quality: `,
      `[x128](${avatar(128)}) | `,
      `[x256](${avatar(256)}) | `,
      `[x512](${avatar(512)}) | `,
      `[x1024](${avatar(1024)}) | `,
      `[x2048](${avatar(2048)})`
    ].join("");
    const embed = this.embed
      .setAuthor({ name: `${user.username}'s Avatar` })
      .setDescription(description)
      .setImage(avatar(2048));
    await ctx.send({ embeds: [embed] });
  };
  // <--> avatar command
  async banner(ctx, util) {
    const user = ctx.getUser("user") || ctx.user;
    // <--> force fetch user
    const fetchedUser = await util.call({ method: "user", param: [user.id] });
    if (!fetchedUser.banner) return this.throw("Baka, this user has no banner.");
    // <--> handle different sizes
    const banner = (s) => {
      return util.getUserBanner(fetchedUser, s);
    };
    const description = [
      `Quality: `,
      `[x128](${banner(128)}) | `,
      `[x256](${banner(256)}) | `,
      `[x512](${banner(512)}) | `,
      `[x1024](${banner(1024)}) | `,
      `[x2048](${banner(2048)})`
    ].join("");
    const embed = this.embed
      .setAuthor({ name: `${user.username}'s Banner` })
      .setDescription(description)
      .setImage(banner(2048));
    await ctx.send({ embeds: [embed] });
  };
  // <--> channel command
  async channel(ctx, util) {
    const channel = ctx.getChannel("channel") || ctx.channel;
    // <--> utilities
    const channelTypes = {
      0: { icon: `${this.imgur}IkQqhRj.png`, type: "Text Channel" },
      2: { icon: `${this.imgur}VuuMCXq.png`, type: "Voice Channel" },
      4: { icon: `${this.imgur}Ri5YA3G.png`, type: "Guild Category" },
      5: { icon: `${this.imgur}4TKO7k6.png`, type: "News Channel" },
      10: { icon: `${this.imgur}Dfu73ox.png`, type: "Threads Channel" },
      11: { icon: `${this.imgur}Dfu73ox.png`, type: "Threads Channel" },
      12: { icon: `${this.imgur}Dfu73ox.png`, type: "Threads Channel" },
      13: { icon: `${this.imgur}F92hbg9.png`, type: "Stage Channel" },
      14: { icon: `${this.imgur}Dfu73ox.png`, type: "Guild Directory" },
      15: { icon: `${this.imgur}q13YoYu.png`, type: "Guild Forum" },
    };
    const { icon, type } = channelTypes[channel.type] || {};
    const createdAt = new Date(util.getCreatedAt(channel.id));
    const time = formatDistance(createdAt, new Date(), { addSuffix: true });
    const authorFieldName = `${channel.name}${channel.name.endsWith("s") ? "'" : "'s"} Information`;
    const field = util.keyValueField({
      "Position": channel.position || "Unknown",
      "Type": type,
      "Created": time,
      "NSFW?": channel.nsfw ? "Yes" : "No",
      "Slowmode": channel.slowmode || "None",
      "ID": channel.id,
      "Topic": channel.topic
    }, 30);
    // <--> make embed
    const embed = this.embed
      .setAuthor({ name: authorFieldName })
      .setThumbnail(icon)
      .addFields([{ name: "\u2000", value: field }]);
    await ctx.send({ embeds: [embed] });
  };
  // <--> server command
  async server(ctx, util) {
    const guild = await ctx.getGuild();
    // <--> handle extra info
    const [channels, owner] = await Promise.all([
      await util.call({ method: "guildChannels", param: [guild.id] }),
      await util.call({ method: "user", param: [guild.owner_id] })
    ]);
    guild.channels = channels;
    guild.owner = owner;
    guild.icon = util.getGuildIcon(guild);
    // <--> utilities
    const since = format(new Date(util.getCreatedAt(guild.id)), 'MMMM yyyy');
    const channelCounts = guild.channels.reduce((counts, channel) => {
      counts[channel.type] = (counts[channel.type] || 0) + 1;
      return counts;
    }, {});
    const { 0: text = 0, 2: voice = 0, 4: category = 0, 5: news = 0 } = channelCounts;
    const description = `*${guild.description == null ? "Server has no description." : guild.description}*\n\n`;
    const generalInfoField = util.keyValueField({
      "Owner": util.textTruncate(owner.username, 20),
      "Role Count": guild.roles.length,
      "Emoji Count": guild.emojis.length,
      "Created": since,
      "Boosts": guild.premium_subscription_count,
      "Main Locale": guild.preferred_locale,
      "Verification": guild.verification_level,
      "Filter": guild.explicit_content_filter
    }, 30);
    const channelInfoField = util.keyValueField({
      "Categories": category,
      "Text Channels": text,
      "Voice Channels": voice,
      "News Channels": news,
      "AFK Channel": guild.afk_channel?.name || "None"
    }, 30);
    // <--> make embed
    const embed = this.embed
      .setAuthor({ name: `${guild.name}`, iconURL: guild.icon })
      .setDescription(description)
      .addFields([
        { name: "General Info", value: generalInfoField },
        { name: "Channels Info", value: channelInfoField }
      ]);
    await ctx.send({ embeds: [embed] });
  };
  // <--> github command
  async github(ctx, util) {
    const user = ctx.getOption("user");
    const repo = ctx.getOption("repo");
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`, { headers: this.headers }).then(res => res.json());
    if (!res?.id) return this.throw("Baka, that repo doesn't exist.");
    // <--> utilities
    const formatBytes = (bytes) => {
      if (bytes == 0) return '0B';
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', "PB", 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))}${sizes[i]}`
    };
    const icon = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    const size = formatBytes(res.size);
    const license = repo.license?.name || "Unknown";
    const field = util.keyValueField({
      "Language": res.language || "Unknown",
      "Forks": res.forks_count.toLocaleString(),
      "License": license,
      "Open Issues": res.open_issues.toLocaleString(),
      "Watchers": res.subscribers_count.toLocaleString(),
      "Stars": res.stargazers_count.toLocaleString(),
      "Size": size,
      "Archived?": res.archived ? "Yes" : "No",
      "Disabled?": res.disabled ? "Yes" : "No",
      "Forked?": res.fork ? "Yes" : "No"
    }, 30);
    // <--> make embed
    const embed = this.embed
      .setAuthor({ name: "GitHub", iconURL: icon })
      .setTitle(`${user}/${repo}`)
      .setURL(res.html_url)
      .setThumbnail(res.owner.avatar_url)
      .setDescription(`${res.description}\n\n`)
      .addFields([{ name: "\u2000", value: field }]);
    await ctx.send({ embeds: [embed] });
  };
  // <--> npm command
  async npm(ctx, util) {
    const query = ctx.getOption("query");
    const raw = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}&size=1`, { headers: this.headers }).then(res => res.json());
    const res = raw.objects?.[0]?.package;
    if (!res) return this.throw("Baka, that's an invalid repository. Or did you make a typo?");
    // <--> utilities
    const score = raw.objects[0].score;
    const maintainers = res.maintainers.map(maintainer => `\`${maintainer.username}\``).join(', ');
    const keywords = res.keywords?.map(keyword => `\`${keyword}\``).join(', ') || "None";
    const description = [
      `${util.textTruncate(res.description, 75)}\n\n`,
      `**Keywords:** ${keywords}\n`,
      `**Maintainers:** ${maintainers}`
    ].join("");
    const field = util.keyValueField({
      "Version": res.version || "Unknown",
      "Author": res.publisher.username,
      "Modified": format(parseISO(res.date), 'EEEE, do MMMM yyyy'),
      "Score": (score.final * 100).toFixed(1)
    }, 40);
    // <--> make embed
    const embed = this.embed
      .setAuthor({ name: "npm Registry", iconURL: 'https://i.imgur.com/24yrZxG.png' })
      .setTitle(`${res.name}`)
      .setURL(`https://www.npmjs.com/package/${res.name}`)
      .setDescription(description)
      .addFields([{ name: "\u2000", value: field }]);
    await ctx.send({ embeds: [embed] });
  };
  // <--> urban command
  async urban(ctx, util) {
    const query = ctx.getOption("query");
    // <--> handle user query
    if (util.isProfane(query) && !ctx.channel.nsfw) return this.throw("Your query has some profanity in there.\n\nEither get into a NSFW channel, or change your query.");
    const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`, { headers: this.headers }).then(res => res.json());
    if (!res?.list?.length) return this.throw("Hmph, seems like there's no definition for that. Even on Urban Dictionary.\n\nYou know what that means.")
    const definition = res.list[0];
    // <--> utilities
    const nsfw = ctx.channel.nsfw;
    const truncateText = (text, maxLength) => util.textTruncate(nsfw ? text : util.cleanProfane(text), maxLength);
    const fields = {
      definition: '```fix\n' + truncateText(definition.definition, 1000) + '\n```',
      example: '```fix\n' + truncateText(definition.example || 'N/A', 1000) + '\n```',
      author: '```fix\n' + truncateText(definition.author || 'N/A', 250) + '\n```'
    };
    // <--> make embed
    const embed = this.embed
      .setTitle(`Definition of ${definition.word}`)
      .setURL(definition.urbanURL)
      .addFields([
        { name: 'Definition', value: fields.definition },
        { name: 'Examples', value: fields.example },
        { name: 'Submitted by', value: fields.author },
        { name: 'Profane Word?', value: 'Yell at my sensei through `/my fault`, the patch should be added in a few working days.' }
      ]);
    await ctx.send({ embeds: [embed] });
  };
  // <--> screenshot command
  async screenshot(ctx, util) {
    const query = ctx.getOption("query");
    // <--> handle user query
    const url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    if (!query.match(url)) return this.throw("Baka, that's not a valid URL.\n\nMake sure it starts with either `https://` or `http://`.");
    const nsfwPages = await util.getStatic("nsfw");
    if (nsfwPages.domains.includes(query) && !ctx.channel.nsfw) return this.throw("That's a NSFW page, you moron!");
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${ctx.client.env.URLSAFE_KEY}`, {
      method: 'POST',
      body: JSON.stringify({
        "client": {
          "clientId":      "neko-discord-bot",
          "clientVersion": "3.0.0"
        },
        "threatInfo": {
          "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
          "platformTypes":    ["ANY_PLATFORM"],
          "threatEntryTypes": ["URL"],
          "threatEntries": [
            { "url": query }
          ]
        }
      })
    }).then(async res => await res.json());
    if (res.matches) return this.throw("That's a dangerous URL, you moron!");
    // <--> take screenshot
    try {
      const screenshot = await util.screenshot(query);
      const embed = this.embed.setImage(screenshot);
      await ctx.send({ embeds: [embed] });
    } catch {
      return this.throw("Something's wrong with that URL.\n\nCheck if you made a typo.");
    };
  };
  // <--> wiki command
  async wiki(ctx, util) {
    const query = ctx.getOption("query");
    // <--> handle exceptions
    if (util.isProfane(query) && !ctx.channel.nsfw) return this.throw("Your query has something to do with profanity, baka.\n\nEither move to a NSFW channel, or change the query.");
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`).then(async res => await res.json());
    if (!res?.title) return this.throw("Can't find that. Check your query.");
    // <--> utilities
    const timestamp = new Date(res.timestamp);
    const thumbnail = "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png";
    const description = [
        `***Description:** ${res.description || "None"}*\n\n`,
        `**Extract:** ${util.textTruncate(res.extract, 1000).split(". ").join(".\n- ")}`
    ].join("");
    // <--> make embed
    const embed = this.embed
      .setTimestamp(timestamp)
      .setTitle(res.title)
      .setThumbnail(thumbnail)
      .setURL(res.content_urls.desktop.page)
      .setDescription(description);
    await ctx.send({ embeds: [embed] });
  };
  // <--> internal utilities
  async throw(content) {
    await this.ctx.send({ content });
    return Promise.reject();
  };
  get embed() {
    return new EmbedBuilder()
      .setColor(16777215)
      .setFooter({ text: `Requested by ${this.ctx.user.username}`, iconURL: this.ctx.user.dynamicAvatarURL("png") })
      .setTimestamp();
  };
}