// settings and utils
export default class Utilities {
  constructor(client) {
    // client properties
    this.client = client;
    this.id = "704992714109878312";
    this.logChannel = "864096602952433665";
    this.owners = ["586913853804249090", "809674940994420736"];
    // utilities
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
   * Logs an errornous action to console.
   * @param {String} message The message to log
   * @param {String} title The title of the error message
   * @returns `void` to stdout
   */
  error(message, title = "Error") {
    return console.log("\x1b[31m", title, "\x1b[0m", message);
  };
  /**
   * Escapes special characters from a string
   * @param {String} str
   * @returns `String`
   */
  escapeRegex(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  /**
   * Logs a successful action to console.
   * @param {String} message The message to log
   * @param {String} title The title of the success message
   * @returns `void` to stdout
   */
  success(message, title = "Success") {
    return console.log("\x1b[32m", title, "\x1b[0m", message);
  };
  /**
   * Logs a warning to console.
   * @param {String} message The message to log
   * @param {String} title The title of the warning message
   * @returns `void` to stdout
   */
  warn(message, title = "Warn") {
    return console.log("\x1b[33m", title, "\x1b[0m", message);
  };
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
    return str.replace(this.badWordsRegex, () => { return "####" });
  };
  /**
   * Probability of outputting `true`.
   * Useful with fun commands
   * @param { Number } int Chance of `true`
   * @returns `boolean`
   */
  probability(int) {
    const n = int / 100;
    return !!n && Math.random() <= n;
  };
  /**
   * Get a post from a subreddit.
   * Either supply a subreddit name or nothing. Nothing returns a random meme.
   * 
   * `(this function is outdated as Reddit changed how they handle random posts)`
   * @param { String } subr Subreddit name
   * @returns typeof `Object`
   */
  async reddit(subr) {
    const keys = ["me_irl", "memes", "funny"];
    const random = keys[Math.floor(Math.random() * keys.length)];
    const subreddit = subr == "random" ? random : subr;
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
  // Self-explanatory
  commatize(number, maximumFractionDigits = 2) {
    return Number(number || "").toLocaleString("en-US", {
      maximumFractionDigits
    });
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
   * Convert a `Date` to a human-readable date.
   * @param {Date} date A date object to format
   * @param {String} format Resulting format
   * @returns `String` Formatted date
   */
  formatDate(date, format) {
    const options = {};
    if (format.includes('MMMM')) options.month = 'long'; else if (format.includes('MMM')) options.month = 'short';
    if (format.includes('yyyy')) options.year = 'numeric';
    if (format.includes('dd')) options.day = '2-digit';
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  /**
   * Calculate the (approximated) time difference between 2 `Date`s
   * @param {Date} date1 The date being compared
   * @param {Date} date2 The date to compare against
   * @returns `String` Time distance
   */
  formatDistance(date1, date2) {
    const intervals = [
      { label: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
      { label: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
      { label: 'day', ms: 24 * 60 * 60 * 1000 },
      { label: 'hour', ms: 60 * 60 * 1000 },
      { label: 'minute', ms: 60 * 1000 },
      { label: 'second', ms: 1000 }
    ];
    const elapsed = Math.abs(date2 - date1);
    for (const interval of intervals) {
      const count = Math.floor(elapsed / interval.ms);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };
  /**
   * Takes human-readable time input and outputs time in `ms` (e.g.: `5m 30s` -> `330000` | `3d 5h 2m` -> `277320000`)
   * @param {string} timeStr - Time input (e.g.: `1m 20s`, `1s`, `3h 20m`)
   */
  timeStringToMS(timeString) {
    return timeString.match(/\d+\s?\w/g).reduce((acc, cur) => {
      var multiplier = 1000;
      switch (cur.slice(-1)) {
        case 'd': multiplier *= 24;
        case 'h': multiplier *= 60;
        case 'm': multiplier *= 60;
        case 's':
          return ((parseInt(cur) ? parseInt(cur) : 0) * multiplier) + acc;
      }
      return acc;
    }, 0);
  };
  /**
   * Takes time in `ms` and outputs time in human-readable format
   * @param {Number} ms Time in milliseconds
   * @returns `String` `(x)d(y)h(z)m(t)s` e.g. `1d3h4m2s`
   */
  msToTimeString(ms) {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  
    return `${d ? d + "d" : ""}${d ? " " : ""}${h ? h + "h" : ""}${h ? " " : ""}${m ? m + "m" : ""}${m ? " " : ""}${s ? s + "s" : ""}`;
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
   * @returns `String | null` The direct URL to the image
   */
  async upload(base64) {
    const form = new FormData();
    form.append("image", base64);
    const res = await fetch([
      `https://api.imgbb.com/1/upload?`,
      `expiration=${this.timeStringToMS("30m") / 1000}&`,
      `key=${process.env.UPLOAD_KEY}`
    ].join(""), {
      method: "POST",
      body: form
    }).then(async res => await res.json());
    return res.data?.url || null;
  };
}