// settings and utils
// some of the functions in here are unreadable and hence are hard to debug
// when a refactor is necessary to debug things I'll do that
export default class Utilities {
  constructor(client) {
    // client properties
    this.client = client;
    this.id = "704992714109878312";
    this.logChannel = "864096602952433665";
    this.owners = ["586913853804249090", "809674940994420736"];
    // utilities
    this.mediaGenres = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Mystery", "Supernatural", "Fantasy", "Sports", "Romance", "Slice of Life", "Horror", "Psychological", "Thriller", "Ecchi", "Mecha", "Music", "Mahou Shoujo", "Hentai"];
    this.mediaFormat = { TV: "TV", TV_SHORT: "TV Shorts", MOVIE: "Movie", SPECIAL: "Special", ONA: "ONA", OVA: "OVA", MUSIC: "Music", MANGA: "Manga", NOVEL: "Light Novel", ONE_SHOT: "One Shot Manga" };
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.weeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    this.rankEmotes = {
      XH: "<:xh:1184870634124226620>", X: "<:x:1184870631372750871>",
      SH: "<:sh:1184870626394128518>", S: "<:s:1184870621109297162>",
      A: "<:a:1184870604843778170>", B: "<:b:1184870609470095442>",
      C: "<:c:1184870613421150258>", D: "<:d:1184870615572824154>",
      F: "<:f_:1184872548337451089>"
    };
    this.langflags = [
      { lang: "Hungarian", flag: "🇭🇺" }, { lang: "Japanese", flag: "🇯🇵" },
      { lang: "French", flag: "🇫🇷" }, { lang: "Russian", flag: "🇷🇺" },
      { lang: "German", flag: "🇩🇪" }, { lang: "English", flag: "🇺🇸" },
      { lang: "Italian", flag: "🇮🇹" }, { lang: "Spanish", flag: "🇪🇸" },
      { lang: "Korean", flag: "🇰🇷" }, { lang: "Chinese", flag: "🇨🇳" },
      { lang: "Brazilian", flag: "🇧🇷" }
    ];
    this.fetchBadWordsRegex();
  }
  /**
   * Logs an errornous action to console.
   * @param {String} message The message to log
   * @param {String} title The title of the error message
   * @returns {Promise<void>}
   */
  error(message, title = "Error") {
    return console.log("\x1b[31m", title, "\x1b[0m", message);
  };
  /**
   * Escapes markdown characters from a string
   * @param {String} str The string to escape
   * @returns {String} The escaped string
   */
  escapeMarkdown(str) {
    return str.replace(/([*_~`])/g, "\\$1");
  }
  /**
   * Escapes special characters from a string
   * @param {String} str
   * @returns {String}
   */
  escapeRegex(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  /**
   * Logs a successful action to console.
   * @param {String} message The message to log
   * @param {String} title The title of the success message
   * @returns {Promise<void>}
   */
  success(message, title = "Success") {
    return console.log("\x1b[32m", title, "\x1b[0m", message);
  };
  /**
   * Logs a warning to console.
   * @param {String} message The message to log
   * @param {String} title The title of the warning message
   * @returns {Promise<void>}
   */
  warn(message, title = "Warn") {
    return console.log("\x1b[33m", title, "\x1b[0m", message);
  };
  /**
   * Fetches and initializes the bad words regex from npoint
   * If the fetch fails, it falls back to a simple default regex
   * @returns {Promise<void>}
   */
  async fetchBadWordsRegex() {
    try {
      const data = await this.getStatic("profane");
      this.badWordsRegex = new RegExp(data.regex, 'gi');
    } catch (error) {
      console.error('Error fetching bad words regex:', error);
      // fallback
      this.badWordsRegex = /\b(fuck|shit|ass|bitch|cunt|dick|pussy|cock|whore|slut|bastard)\b/gi;
    }
  }
  /**
   * Search for profane words in a string.
   * This function is mainly to comply with top.gg's policies
   * @param {String} str String to search for profane words
   * @returns {Boolean}
   */
  async isProfane(str) {
    if (!this.badWordsRegex) {
      await this.fetchBadWordsRegex();
    }
    return this.badWordsRegex.test(str);
  };
  /**
   * Replace profane words with # characters
   * @param {String} str The string to search for
   * @returns {String}
   */
  async cleanProfane(str) {
    if (!this.badWordsRegex) {
      await this.fetchBadWordsRegex();
    }
    return str.replace(this.badWordsRegex, () => "####");
  };
  /**
   * Probability of outputting `true`.
   * Useful with fun commands
   * @param {Number} int Chance of `true`
   * @returns {Boolean}
   */
  probability(int) {
    const n = int / 100;
    return !!n && Math.random() <= n;
  };
  /**
   * Truncates a string.
   * Mostly used for trimming long descriptions from APIs
   * @param {String} str The string to truncate
   * @param {Number} length The desired output length
   * @param {String} end Sequence of characters to put at the end. Default `...`
   * @returns {String}
   */
  textTruncate(str = '', length = 100, end = '...') {
    return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
  };
  /**
   * Formats a number with commas as thousands separators and limits the number of decimal places.
   *
   * @param {Number|String} number - The number to format.
   * @param {Number} [maximumFractionDigits=2] - The maximum number of decimal places to display
   * @returns {String} The formatted number
   */
  commatize(number, maximumFractionDigits = 2) {
    return Number(number || "").toLocaleString("en-US", {
      maximumFractionDigits
    });
  };
  /**
   * Joins an array and limits the string output
   * @param {Array} array The array to join and limit
   * @param {Number} limit The limit to limit the string output
   * @param {String} connector Value connector like that of `array.join()`
   * @returns {String}
   */
  joinArrayAndLimit(array = [], limit = 1000, connector = '\n') {
    return array.reduce((a, c, i) => a.text.length + String(c).length > limit
      ? { text: a.text, excess: a.excess + 1 }
      : { text: a.text + (!!i ? connector : '') + String(c), excess: a.excess }
      , { text: '', excess: 0 });
  };
  /**
   * Returns the ordinalized format of a number, e.g. `1st`, `2nd`, etc.
   * @param {Number} n Number to properly format
   * @returns {String}
   */
  ordinalize(n = 0) {
    return Number(n) + [, 'st', 'nd', 'rd'][n / 10 % 10 ^ 1 && n % 10] || Number(n) + 'th';
  };
  /**
   * Properly uppercase a string
   * @param {String} str The string to format
   * @returns {String}
   */
  toProperCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };
  /**
   * Fetch AniList API data
   * @param {String} query GraphQL presentation of the query
   * @param {Object} variables Variables to throw into the graphql
   * @returns {Object}
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
   * @returns {String}
   */
  osuStringModeFormat(int) {
    return (int instanceof String) ? int : ["osu", "taiko", "fruits", "mania"][int];
  };
  /**
   * Convert a `Date` to a human-readable date.
   * @param {Date} date A date object to format
   * @param {String} format Resulting format
   * @returns {String}
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
   * @returns {String}
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
  timeStringToMS(s) {
    const u = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
    return s.match(/\d+\s?\w/g).reduce((t, v) => t + parseInt(v) * u[v.trim().slice(-1)], 0);
  };
  /**
   * Takes time in `ms` and outputs time in human-readable format
   * @param {Number} ms Time in milliseconds
   * @returns {String} `(x)d(y)h(z)m(t)s` e.g. `1d3h4m2s`
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
   * @returns {String}
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
   * @returns {Number}
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
   * @returns {Number} The AniList equivalent of the provided media
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
   * @returns {String} The proper title
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
   * @param {String} name Asset name
   * @returns {Object}
   */
  async getStatic(name) {
    // simplify by adding everything into one file
    const id = "15038d9b7330785beca0";
    const res = await fetch(`https://api.npoint.io/${id}`).then(async res => await res.json());
    return res[name];
  };
  /**
   * Uploads an image to `imgbb`
   * @param {String} base64 The `base64` string of the Buffer
   * @returns {String | null} The direct URL to the image
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