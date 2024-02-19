// settings and utils in one place for ease of access
// if we need to use the settings just init this class and we're done
import { Routes, RouteBases, CDNRoutes } from "discord-api-types/v10";
import { DiscordSnowflake } from "@sapphire/snowflake";

export default class Settings {
  constructor(client, env) {
    this.client = client;
    this.id = "838729358041677856";
    this.env = env;
    this.collections = ["discovery", "economy", "memes", "xp"];
    this.baseImgUrl = "https://iili.io/";
    this.owners = ["586913853804249090", "809674940994420736"];
    this.osu_card = [
      { "id": "16688499", "name": "njshift1", "card": "JYdgIHX", "star": "JYd4vta", "halfstar": "JYd4UMv" },
      { "id": "9623142", "name": "davidminh0111", "card": "JYdrqmu" },
      { "id": "22698999", "name": "hi_there_osu", "card": "JYdgMOu" },
      { "id": "21290592", "name": "MyWifeMiku", "card": "JYdgllS" },
      { "id": "17302272", "name": "Kurumiism", "card": "JYdgTRn" },
      { "id": "10278890", "name": "Marota", "card": "JYdrCzb" },
      { "id": "19817503", "name": "DeepInDark", "card": "JYdg7V4" },
      { "id": "22515524", "name": "Creeperbrine303", "card": "JYdgGRe" },
      { "id": "15429414", "name": "dots_", "card": "JYdgolI" },
      { "id": "19207842", "name": "-[SnowFlakes]-", "card": "JYdgADG" },
      { "id": "26012543", "name": "-M_A_T_C_H_A-", "card": "JYdgSOg" },
      { "id": "22069182", "name": "nahieu2005", "card": "JYdgVDb" },
      { "id": "19787040", "name": "-NTD-", "card": "JYdg5xf" },
      { "id": "25076492", "name": "MEGALOFI", "card": "JYdgeUP" },
      { "id": "16039831", "name": "buttermiilk", "card": "JYdgnKN" },
      { "id": "21591099", "name": "PstormQT", "card": "JYdg0U7" },
      { "id": "20161708", "name": "hx7ru0n9", "card": "JYdgYil" },
      { "id": "20569770", "name": "NovaSeele", "card": "JYdgcf2" },
      { "id": "20569770", "name": "[ Primakien ]", "card": "JYdgjiQ" },
      { "id": "10494860", "name": "MashedPotato", "card": "JYdgxSt" },
      { "id": "7844013", "name": "Mafuyu Kirisu", "card": "JYdrfee" },
      { "id": "18782185", "name": "SplexBiTe", "card": "JYdguNs" },
      { "id": "24042710", "name": "RandomNameIdk", "card": "JYdrK79" },
    ];
    this.rank_emote = {
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
    this.mediaGenres = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Mystery", "Supernatural", "Fantasy", "Sports", "Romance", "Slice of Life", "Horror", "Psychological", "Thriller", "Ecchi", "Mecha", "Music", "Mahou Shoujo", "Hentai"];
    this.mediaFormat = {
      TV: "TV",
      TV_SHORT: "TV Shorts",
      MOVIE: "Movie",
      SPECIAL: "Special",
      ONA: "ONA",
      OVA: "OVA",
      MUSIC: "Music",
      MANGA: "Manga",
      NOVEL: "Light Novel",
      ONE_SHOT: "One Shot Manga"
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
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.weeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    this.malGenres = {
      action: 1,
      adventure: 2,
      cars: 3,
      comedy: 4,
      dementia: 5,
      demons: 6,
      mystery: 7,
      drama: 8,
      ecchi: 9,
      fantasy: 10,
      game: 11,
      hentai: 12,
      historical: 13,
      horror: 14,
      kids: 15,
      magic: 16,
      "martial arts": 17,
      mecha: 18,
      music: 19,
      parody: 20,
      samurai: 21,
      romance: 22,
      school: 23,
      "sci-fi": 24,
      shoujo: 25,
      "shoujo ai": 26,
      shounen: 27,
      "shounen ai": 28,
      space: 29,
      sports: 30,
      "super power": 31,
      vampire: 32,
      yaoi: 33,
      yuri: 34,
      harem: 35,
      "slice of life": 36,
      supernatural: 37,
      military: 38,
      police: 39,
      psychological: 40,
      thriller: 41,
      seinen: 42,
      josei: 43
    };
  }
  /**
   * Search for profane words in a string.
   * This function is mainly to comply with top.gg's policies
   * @param { String } str String to search for profane words
   * @returns `boolean`
   */
  isProfane(str) {
    // Very, very, very long regex
    const regex = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
    return regex.test(str)
  }
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
    console.log(data.children[0].data)
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
   * Cleans backticks with zero-width spaces from a string
   * 
   * Used to avoid unintended escapes
   * @param { String } text The string to be cleaned
   * @returns `String` Cleaned string
   */
  clean(text) {
    return String(text).replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
  };
  /**
   * Gets a user avatar URL
   * @param { Object } user The user object
   * @param { Number } size The image size
   * @returns `String` The image URL
   */
  getUserAvatar(user, size = "256") {
    // handle animated avatars
    let avatarExtension = "png";
    if (user.avatar.startsWith("a_")) avatarExtension = "gif";
    return `${RouteBases.cdn}${CDNRoutes.userAvatar(user.id, user.avatar, avatarExtension)}?size=${size}`;
  };
  /**
   * Gets a user banner URL.
   * Note that it is necessary to force-fetch the user before
   * using this method
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
  }
  // sometimes we'll have to reach out to raw api calls as a fallback solution
  // in that case we'll have to import Routes and RouteBases from d-api-types
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
    const apiCallURL = `${RouteBases.api}${Routes[method.method](method.param)}`;
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
      console.log(res.status);
      throw new Error(JSON.stringify(data));
    }
    // return original response
    return await res.json();
  }
}