// settings and utils in one place for ease of access
// if we need to use the settings just init this class and we're done
export default class Settings {
  constructor(client, env) {
    this.client = client;
    this.env = env;
    this.collections = ['discovery', 'economy', 'memes', 'xp'];
    this.baseImgUrl = "https://iili.io/";
    this.owners = ["586913853804249090", "809674940994420736"];
    this.osu_card = [
      { 'id': '16688499', 'name': 'njshift1', 'card': "JYdgIHX", 'star': 'JYd4vta', 'halfstar': "JYd4UMv" },
      { 'id': '9623142', 'name': 'davidminh0111', 'card': "JYdrqmu" },
      { 'id': '22698999', 'name': 'hi_there_osu', 'card': "JYdgMOu" },
      { 'id': '21290592', 'name': 'MyWifeMiku', 'card': "JYdgllS" },
      { 'id': '17302272', 'name': 'Kurumiism', 'card': "JYdgTRn" },
      { 'id': '10278890', 'name': 'Marota', 'card': "JYdrCzb" },
      { 'id': '19817503', 'name': 'DeepInDark', 'card': "JYdg7V4" },
      { 'id': '22515524', 'name': 'Creeperbrine303', 'card': "JYdgGRe" },
      { 'id': '15429414', 'name': 'dots_', 'card': "JYdgolI" },
      { 'id': '19207842', 'name': '-[SnowFlakes]-', 'card': "JYdgADG" },
      { 'id': '26012543', 'name': '-M_A_T_C_H_A-', 'card': "JYdgSOg" },
      { 'id': '22069182', 'name': 'nahieu2005', 'card': "JYdgVDb" },
      { 'id': '19787040', 'name': '-NTD-', 'card': "JYdg5xf" },
      { 'id': '25076492', 'name': 'MEGALOFI', 'card': "JYdgeUP" },
      { 'id': '16039831', 'name': 'buttermiilk', 'card': "JYdgnKN" },
      { 'id': '21591099', 'name': 'PstormQT', 'card': "JYdg0U7" },
      { 'id': '20161708', 'name': 'hx7ru0n9', 'card': "JYdgYil" },
      { 'id': '20569770', 'name': 'NovaSeele', 'card': "JYdgcf2" },
      { 'id': '20569770', 'name': '[ Primakien ]', 'card': "JYdgjiQ" },
      { 'id': '10494860', 'name': 'MashedPotato', 'card': "JYdgxSt" },
      { 'id': '7844013', 'name': 'Mafuyu Kirisu', 'card': "JYdrfee" },
      { 'id': '18782185', 'name': 'SplexBiTe', 'card': "JYdguNs" },
      { 'id': '24042710', 'name': 'RandomNameIdk', 'card': "JYdrK79" },
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
    this.mediaGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Mystery', 'Supernatural', 'Fantasy', 'Sports', 'Romance', 'Slice of Life', 'Horror', 'Psychological', 'Thriller', 'Ecchi', 'Mecha', 'Music', 'Mahou Shoujo', 'Hentai'];
    this.mediaFormat = {
      TV: 'TV',
      TV_SHORT: 'TV Shorts',
      MOVIE: 'Movie',
      SPECIAL: 'Special',
      ONA: 'ONA',
      OVA: 'OVA',
      MUSIC: 'Music',
      MANGA: 'Manga',
      NOVEL: 'Light Novel',
      ONE_SHOT: 'One Shot Manga'
    };
    this.langflags = [
      { lang: 'Hungarian', flag: '🇭🇺' },
      { lang: 'Japanese', flag: '🇯🇵' },
      { lang: 'French', flag: '🇫🇷' },
      { lang: 'Russian', flag: '🇷🇺' },
      { lang: 'German', flag: '🇩🇪' },
      { lang: 'English', flag: '🇺🇸' },
      { lang: 'Italian', flag: '🇮🇹' },
      { lang: 'Spanish', flag: '🇪🇸' },
      { lang: 'Korean', flag: '🇰🇷' },
      { lang: 'Chinese', flag: '🇨🇳' },
      { lang: 'Brazilian', flag: '🇧🇷' }
    ];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.weeks = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
      'martial arts': 17,
      mecha: 18,
      music: 19,
      parody: 20,
      samurai: 21,
      romance: 22,
      school: 23,
      'sci-fi': 24,
      shoujo: 25,
      'shoujo ai': 26,
      shounen: 27,
      'shounen ai': 28,
      space: 29,
      sports: 30,
      'super power': 31,
      vampire: 32,
      yaoi: 33,
      yuri: 34,
      harem: 35,
      'slice of life': 36,
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
   * Gets a command option from an array of options.
   * This tackles working a lot around the `ctx` object
   * 
   * Note that by default the namespace `query` will be used for the search
   * @example
   * subcommandObject.find(obj => { return obj.name == "..." }); // don't do this
   * this.getString(subcommandObject); // do this instead for readability
   * @param { Object } obj 
   */
  getOption(obj, query = "query") {
    try { 
      // check if an object is provided
      if (!(obj instanceof Object)) throw new Error("The provided object parameter is not an object");
      const result = obj.options.find(obj => { return obj.name == query })
      return result.value;
    } catch (err) { throw new Error(err) };
  }
  /**
   * Trims down subcommand object if `subcommandGroup` is present.
   * This helps ignore `ctx.subcommandGroup` and write needed info to `ctx.subcommand`
   * 
   * This also automatically ignores `ctx.subcommand` if `subcommandGroup` is not present.
   * 
   * To avoid already made subcommands and the actual subcommand in the group "collides", 
   * `${subcommandGroup.name}_` will be injected before the name of the command
   * 
   * Two examples below demonstrate the immense effect of this function:
   * @example
   * bad_usage(ctx) {
   *  const sub = ctx.subcommandGroup ?? ctx.subcommand
   *  if (sub == ctx.subcommandGroup) { this.getOptions(...) } else { this.getOptions(...) }
   *  // blah blah blah a bunch of logic...
   * }
   * good_usage(ctx) {
   *  this.trimSubcommand(ctx) // this leaves a clean ctx.subcommand for use
   *  this.getOptions(ctx.subcommand)
   * }
   * @param {*} ctx 
   */
  trimSubcommand(ctx) {
    try {
      // breaks down the subcommandGroup layer
      // we only do this if and only if subcommandGroup is present
      // else we keep the ctx.subcommand object as-is
      if (ctx.subcommandGroup) {
        const layeredOptions = ctx.subcommandGroup.options[0];
        // write them back to ctx.subcommand
        ctx.subcommand = {
          name: `${ctx.subcommandGroup.name}_${layeredOptions.name}`,
          options: layeredOptions.options,
          type: layeredOptions.type
        }
      }
      return ctx.subcommand;
    } catch (err) { throw new Error(err) };
  }
}