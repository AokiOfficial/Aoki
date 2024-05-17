// settings and utils
import { Routes, RouteBases, CDNRoutes } from "discord-api-types/v10";
import { DiscordSnowflake } from "@sapphire/snowflake";
import AniSchedule from "./Schedule";

export default class Utilities {
  constructor(client, env) {
    // <--> client properties
    this.client = client;
    this.id = "704992714109878312";
    this.env = env;
    this.db = env.database;
    this.logChannel = "864096602952433665";
    this.owners = ["586913853804249090", "809674940994420736"];
    // <--> utilities
    this.badWordsRegex = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
    this.mediaGenres = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Mystery", "Supernatural", "Fantasy", "Sports", "Romance", "Slice of Life", "Horror", "Psychological", "Thriller", "Ecchi", "Mecha", "Music", "Mahou Shoujo", "Hentai"];
    this.mediaFormat = { TV: "TV", TV_SHORT: "TV Shorts", MOVIE: "Movie", SPECIAL: "Special", ONA: "ONA", OVA: "OVA", MUSIC: "Music", MANGA: "Manga", NOVEL: "Light Novel", ONE_SHOT: "One Shot Manga" };
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.weeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    this.rankEmotes = {
      XH: "<:xh:1184870634124226620>",
      X: "<:x:1184870631372750871>",
      SH: "<:sh:1184870626394128518>",
      S: "<:s:1184870621109297162>",
      A: "<:a:1184870604843778170>",
      B: "<:b:1184870609470095442>",
      C: "<:c:1184870613421150258>",
      D: "<:d:1184870615572824154>",
      F: "<:f_:1184872548337451089>"
    };
    this.langflags = [
      { lang: "Hungarian", flag: "🇭🇺" },
      { lang: "Japanese", flag: "🇯🇵" },
      { lang: "French", flag: "🇫🇷" },
      { lang: "Russian", flag: "🇷🇺" },
      { lang: "German", flag: "🇩🇪" },
      { lang: "English", flag: "🇺🇸" },
      { lang: "Italian", flag: "🇮🇹" },
      { lang: "Spanish", flag: "🇪🇸" },
      { lang: "Korean", flag: "🇰🇷" },
      { lang: "Chinese", flag: "🇨🇳" },
      { lang: "Brazilian", flag: "🇧🇷" }
    ];
  }
  /**
   * Search for profane words in a string.
   * This function is mainly to comply with top.gg's policies
   * @param { String } str String to search for profane words
   * @returns `boolean`
   */
  isProfane(str) {
    return this.badWordsRegex.test(str)
  };
  /**
   * Replace profane words with # characters
   * @param {String} str The string to search for
   * @returns `String` The filtered string
   */
  cleanProfane(str) {
    return str.replace(this.badWordsRegex, function () {
      return '####';
    });
  };
  /**
   * Probability of outputting `true`.
   * Useful with fun commands
   * @param { Number } int Chance of `true`
   * @returns `boolean`
   */
  probability(int) {
    const n = int / 100
    return !!n && Math.random() <= n;
  };
  /**
   * Get a post from a subreddit.
   * Either supply a subreddit name or nothing. Nothing returns a random meme.
   * @param { String } subr Subreddit name
   * @returns typeof `Object`
   */
  async reddit(subr) {
    const keys = [
      "me_irl",
      "memes",
      "funny"
    ];
    const random = keys[Math.floor(Math.random() * keys.length)];
    const subreddit = subr == "random" ? random : subr;
    // keep reminding ourselves that we're on cfworkers
    // make sure to add a user agent to stop 403s
    let data = await fetch(`https://www.reddit.com/r/${subreddit}/random/.json`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
      }
    }).then(async res => await res.json());
    data = data[0].data;
    let permalink = data.children[0].data.permalink;
    let url = `https://reddit.com${permalink}`;
    let upVotes = data.children[0].data.ups;
    let downVotes = data.children[0].data.downs;
    let image = data.children[0].data.url;
    let nsfw = data.children[0].data.over_18;
    let title = data.children[0].data.title;
    let numComments = data.children[0].data.num_comments;
    let author = data.children[0].data.author;
    return { url, upVotes, downVotes, image, nsfw, title, numComments, author, randomKey: subreddit };
  }
  /**
   * Truncates a string.
   * Mostly used for trimming long descriptions from APIs
   * @param { String } str The string to truncate
   * @param { Number } length The desired output length
   * @param { String } end Sequence of characters to put at the end. Default `...`
   * @returns `String` Truncated string
   */
  textTruncate(str = '', length = 100, end = '...') {
    return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
  };
  /**
   * Joins an array and limits the string output
   * @param { Array } array The array to join and limit
   * @param { Number } limit The limit to limit the string output
   * @param { String } connector Value connector like that of `array.join()`
   * @returns `String` The joined and limited string
   */
  joinArrayAndLimit(array = [], limit = 1000, connector = '\n') {
    return array.reduce((a, c, i, x) => a.text.length + String(c).length > limit
      ? { text: a.text, excess: a.excess + 1 }
      : { text: a.text + (!!i ? connector : '') + String(c), excess: a.excess }
      , { text: '', excess: 0 });
  };
  /**
   * Returns the ordinalized format of a number, e.g. `1st`, `2nd`, etc.
   * @param {Number} n Number to properly format
   * @returns `String` Formatted number
   */
  ordinalize(n = 0) {
    return Number(n) + [, 'st', 'nd', 'rd'][n / 10 % 10 ^ 1 && n % 10] || Number(n) + 'th';
  };
  /**
   * Properly uppercase a string
   * @param { String } str The string to format
   * @returns `String` The reformatted string
   */
  toProperCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };
  /**
   * Fetch AniList API data
   * @param { String } query GraphQL presentation of the query
   * @param { Object } variables Variables to throw into the graphql
   * @returns `Object` Fetched API data
   */
  async anilist(query, variables) {
    return await fetch('https://graphql.anilist.co', {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(async res => await res.json());
  };
  /**
   * Format numerical osu! mode to its string equivalent
   * @param {Number} int the number to convert to mode name
   * @returns `String` mode name `| undefined`
   */
  osuStringModeFormat(int) {
    return (int instanceof String) ? int : ["osu", "taiko", "fruits", "mania"][int];
  };
  /**
   * Takes human-readable time input and outputs time in `ms` (e.g.: `5m 30s` -> `330000` | `3d 5h 2m` -> `277320000`)
   * @param {string} timeStr - Time input (e.g.: `1m 20s`, `1s`, `3h 20m`)
   */
  timeStringToMS(timeString) {
    return timeString.match(/\d+\s?\w/g).reduce((acc, cur) => {
      var multiplier = 1000;
      switch (cur.slice(-1)) {
        case 'd':
          multiplier *= 24;
        case 'h':
          multiplier *= 60;
        case 'm':
          multiplier *= 60;
        case 's':
          return ((parseInt(cur) ? parseInt(cur) : 0) * multiplier) + acc;
      }
      return acc;
    }, 0);
  };
  /**
   * Pseudo-randomly pick an entry from the given array
   * @param {Array} arr The array to randomly pick from
   * @returns `arr[entry]` An item from the array
   */
  random(arr) {
    const pick = Math.floor(Math.random() * arr.length);
    return arr[pick] || arr[0];
  };
  /**
   * Generates a proper embed field value for key-value objects
   * @param {Object} obj The object with key-value pairs
   * @param {Number} cwidth The width between key and value
   * @returns `String` Formatted field
   */
  keyValueField(obj, cwidth = 24) {
    return '```fix\n' + Object.entries(obj).map(([key, value]) => {
      const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
      const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));
      return '• ' + name + ':' + spacing + value;
    }).join('\n') + '```'
  };
  /**
   * Gets a user banner URL.
   * Note that it is necessary to force-fetch the user before using this method
   * @param { Object } user The user object
   * @param { Number } size The image size
   * @returns `String` The image URL
   */
  getUserBanner(user, size = "256") {
    // handle animated banners
    let bannerExtension = "png";
    if (user.banner.startsWith("a_")) bannerExtension = "gif";
    return `${RouteBases.cdn}${CDNRoutes.userBanner(user.id, user.banner, bannerExtension)}?size=${size}`;
  }
  /**
   * Gets a guild icon URL
   * @param { Object } guild The guild object
   * @param { Number } size The image size
   * @returns `String` The image URL
   */
  getGuildIcon(guild, size = "256") {
    // handle animated icons
    let iconExtension = "png";
    if (guild.icon.startsWith("a_")) iconExtension = "gif";
    // please be extremely careful with the /
    // it only applies for this guild icon method
    return `${RouteBases.cdn}/${CDNRoutes.guildIcon(guild.id, guild.icon, iconExtension)}?size=${size}`;
  }
  /**
   * Gets timestamp from a Discord Snowflake
   * @param { String } timestamp The snowflake
   * @returns `String` The timestamp
   */
  getCreatedTimestamp(timestamp) {
    return DiscordSnowflake.timestampFrom(timestamp);
  }
  /**
   * Gets date from a Discord Snowflake
   * @param { String } timestamp The snowflake
   * @returns `String` The date
   */
  getCreatedAt(timestamp) {
    return new Date(this.getCreatedTimestamp(timestamp));
  };
  /**
   * Format string osu! mode to its numerical value
   * @param {String} str Mode string to convert
   * @returns `Number` Mode converted to number
   */
  osuNumberModeFormat(str) {
    if (str == "osu") return 0;
    if (str == "taiko") return 1;
    if (str == "fruits") return 2;
    if (str == "mania") return 3;
    else return Number(str);
  };
  // TehNut @ GitHub written these getMediaID and getTitle in ts
  /**
   * Get AniList ID equivalent for MAL, or parse an AniList URL to ID
   * @param {String} input The string to be parsed
   * @returns `Number` The AniList equivalent of the provided media
   */
  async getMediaId(input) {
    // if the input is already an id
    const output = parseInt(input);
    if (output) return output;
    // else check url against the regex
    const alIdRegex = /anilist\.co\/anime\/(.\d*)/;
    const malIdRegex = /myanimelist\.net\/anime\/(.\d*)/;
    // parse if match
    let match = alIdRegex.exec(input);
    if (match) return parseInt(match[1]);
    // else try parsing with mal
    match = malIdRegex.exec(input);
    // if it still fail that means the provided input is invalid
    if (!match) return null;
    // else fetch anilist equivalent
    const ani = new AniSchedule(this.client)
    const res = await ani.fetch("query($malId: Int) { Media(idMal: $malId) { id } }", { malId: match[1] });
    // if there's no res return null for handling later
    if (!res) return null;
    return res.data.Media.id;
  }
  /**
   * Convert raw title key to proper title from AniList media object
   * @param {Object} title The title object from fetched media
   * @param {String} wanted The wanted format of the title
   * @returns `String` The proper title
   */
  getTitle(title, wanted) {
    switch (wanted) {
      case "NATIVE": return title.native;
      case "ROMAJI": return title.romaji;
      case "ENGLISH": return title.english || title.romaji;
      default: return title.romaji;
    }
  }
  /**
   * Fetches static JSON asset stored on `npoint.io`.
   * @param { String } name Asset name
   * @returns `Object` response
   */
  async getStatic(name) {
    // switch cases
    let id;
    switch (name) {
      case "fortune": id = "581a1d8f207eebd37dce"; break
      case "work": id = "ce24c6594944510ad47f"; break
      case "caught": id = "db3797439edb317a3aac"; break
      case "truth": id = "0cda95c7f398cec569dc"; break
      case "store": id = "7caa1a8787a53b391d22"; break
      case "ping": id = "1a006901b761c2a1538c"; break
      case "nsfw": id = "cd2d0d098676b641fa49"; break
      case "8ball": id = "e4756a8bba56a05fa4ca"; break
    };
    // fetch data
    const res = await fetch(`https://api.npoint.io/${id}`).then(async res => await res.json());
    return res;
  };
  /**
   * Uploads an image to `imgbb`
   * @param {String} base64 The `base64` string of the Buffer
   * @returns `String | undefined` The direct URL to the image
   */
  async upload(base64) {
    const form = new FormData();
    form.append("image", base64);
    const res = await fetch(`https://api.imgbb.com/1/upload?expiration=${this.timeStringToMS("30m") / 1000}&key=${this.env.UPLOAD_KEY}`, {
      method: "POST",
      body: form
    }).then(async res => await res.json());
    return res.data.url || null;
  };
  /**
   * Screenshot a website and upload the image to imgbb
   * @param {String} url The URL of the site to screenshot
   * @returns `String` The URL of the screenshot'd image
   */
  async screenshot(url) {
    const res = await fetch([
      `https://api.screenshotone.com/take?`,
      `access_key=${this.env.SCREENSHOT_KEY}&`,
      `url=${url}&`,
      `viewport_width=1920&`,
      `viewport_height=1080&`,
      `device_scale_factor=1&`,
      `image_quality=80&`,
      `format=jpg&`,
      `block_ads=true&`,
      `block_cookie_banners=true&`,
      `full_page=false&`,
      `block_trackers=true&`,
      `block_banners_by_heuristics=false&`,
      `delay=0&`,
      `timeout=10`
    ].join("")).then(async res => await res.arrayBuffer());
    return await this.upload(Buffer.from(res).toString('base64'));
  };
  // sometimes we'll have to reach out to raw api calls 
  // as a fallback solution when slash-create does not support something
  // in that case we'll have to import Routes and RouteBases 
  // from d-api-types
  // and do RouteBases.api + Route...
  // and then ask fetch to do the job, etc. etc.
  // we want to simplify that
  /**
   * Do a raw API call to Discord
   * 
   * Using `discord-api-types/v10`'s API endpoint
   * @param { String } method type of API call
   * @param { String } param the param of the call
   * @returns `Object` response
   */
  async call(method, options = {}) {
    const apiCallURL = `${RouteBases.api}${Routes[method.method](...(method.param ? method.param : []))}`;
    // stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // make request
    const res = await fetch(apiCallURL, {
      headers: {
        Authorization: `Bot ${this.env.TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      ...options
    });
    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      throw new Error(JSON.stringify(data));
    }
    // return original response
    if (options.method == "DELETE" || options.method == "POST") return true; else return await res.json();
  }
}