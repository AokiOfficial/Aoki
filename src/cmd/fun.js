import Command from '../struct/handlers/Command.js';
import { fun } from '../assets/const/import.js';

export default new class Fun extends Command {
  constructor() {
    super({
      data: fun,
      permissions: [],
      cooldown: 0
    });
  };
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
  // 8ball command
  async "8ball"(i, query, util) {
    if (util.isProfane(query)) return this.throw("Fix your query, please. At least give me some respect!");
    const eightball = await util.getStatic("8ball");
    return await i.editReply({ content: util.random(eightball) });
  };
  // affirmation command
  async affirmation(i) {
    await this.fetchAndSend(i, "https://www.affirmations.dev", "affirmation");
  };
  // advice command
  async advice(i) {
    await this.fetchAndSend(i, "https://api.adviceslip.com/advice", "slip.advice");
  };
  // fact command
  async fact(i, _, util) {
    // utilities
    const urls = ["https://catfact.ninja/fact", "https://uselessfacts.jsph.pl/random.json?language=en"];
    const res = await fetch(util.random(urls)).then(res => res.json());
    const content = res.text || res.fact;
    await i.editReply({ content });
  };
  // today command
  async today(i, _, util) {
    const [month, day] = new Date().toLocaleDateString().trim().split("/");
    const todayRes = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
    const todayJs = await todayRes.json();
    const { text, year } = util.random(todayJs.data.Events);
    return await i.editReply({ content: `On **${todayJs.date}, ${year}**: ${text}` });
  };
  // meme command
  async meme(i, query, util) {
    const cancelled = util.random([
      "Get cancelled.", "Baka, bad luck. You got cancelled.",
      "You've been ignored.", "He he he haw.", "Baka, you're unlucky. Get cancelled."
    ]);
    if (util.probability(10)) return this.throw(`${cancelled}\n\n||Execute the command again.||`);
    const res = await util.reddit(query || "random");
    if (res.nsfw && !i.channel.nsfw) throw new Error(`${cancelled}\n\n||This meme is NSFW.||`);
    const meme = this.embed
      .setTitle(`**${res.title}**`)
      .setURL(res.url)
      .setDescription(`*Posted in **r/${query || res.randomKey}** by **${res.author}***`)
      .setImage(res.image)
    return await i.editReply({ embeds: [meme] });
  };
  // ship command
  async ship(i, _, util) {
    const first = i.options.getUser("first");
    const second = i.options.getUser("second");
    // handle exceptions
    if (first.id == util.id || second.id == util.id) return this.throw("Ew, I'm not a fan of shipping. Choose someone else!");
    if (first.id == second.id) return this.throw("Pfft. No one does that, baka.");
    // utilities
    const luckyWheelRate = util.probability(5);
    const rollProbability = util.probability(40);
    const result = rollProbability ? "100" : "0";
    const normalRate = Math.floor(Math.random() * 100);
    // construct response
    let finalShipResponse;
    if (normalRate == 0) {
      finalShipResponse = "Woah, that's impressive. I've never seen this happen before.\n\n||That's a **0%** ship rate, consider you two lucky.||";
    } else if (normalRate <= 30) {
      finalShipResponse = `You two stood no chance. I don't like **${normalRate}%**, and maybe you don't, too.`;
    } else if (normalRate <= 50) {
      finalShipResponse = `Fair, I'd say you two need some time. You two scored **${normalRate}%**, not like I like the rate or something.`;
    } else if (normalRate <= 70) {
      finalShipResponse = `Alright, that's fine. You two scored **${normalRate}%**, I think I like that.`;
    } else if (normalRate <= 90) {
      finalShipResponse = `Hey! That's pretty good, I rarely see a couple scoring this nicely. A whopping **${normalRate}%**!`;
    } else if (normalRate == 100) {
      finalShipResponse = "Holy cow. Perfect couple right here duh? **100%** ship rate!";
    };
    // special
    if (luckyWheelRate) {
      await i.editReply({ content: "Lucky wheel time! Let's see if you two are lucky!" });
      await new Promise(resolve => setTimeout(resolve, 3000));
      return await i.editReply({ content: result == "100" ? "Hey, good couple! You rolled **100%**!" : "Baka, you two lost. **0%** rate." });
    };
    return await i.editReply({ content: finalShipResponse });
  };
  // fortune command
  async fortune(i) {
    const cookies = await util.getStatic("fortune");
    const cookie = util.random(cookies);
    await i.editReply({ content: cookie });
  };
  // truth command
  async truth(i) {
    const questions = await util.getStatic("truth");
    const question = util.random(questions);
    await i.editReply({ content: question });
  };
  // generator command
  async generator(i) {
    const template = i.options.getString("template");
    const top = i.options.getString("top");
    const bottom = i.options.getString("bottom");
    // handle user query
    const res = await fetch("https://api.imgflip.com/caption_image", {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        template_id: template,
        username: "akira1922",
        password: i.client.env.IMG_KEY,
        text0: top,
        text1: bottom
      })
    }).then(async res => await res.json());
    // send embed
    const embed = this.embed
      .setDescription(`Here you go. Not like I wanted to waste my time.`)
      .setImage(res.data.url);
    await i.editReply({ embeds: [embed] });
  };
  // owo command
  async owo(i, query) {
    const res = await fetch(`https://nekos.life/api/v2/owoify?${query}`).then(res => res.json());
    await i.editReply({ content: res.owo });
  };
  // internal utilities
  async throw(content) {
    await this.i.editReply({ content });
    return Promise.reject();
  };
  /**
   * Fetches an API, then sends a reply from the API data
   * @param {Object} i The command context
   * @param {String} url The URL of the API
   * @param {String} path The reply's object path
   */
  async fetchAndSend(i, url, path) {
    const res = await fetch(url).then(res => res.json());
    let data = path.split('.').reduce((acc, part) => acc[part], res);
    if (!data?.endsWith(".")) data += "."; /* I'm annoyed by this */
    await i.editReply({ content: data });
  };
  get embed() {
    return new EmbedBuilder()
      .setColor(10800862)
      .setFooter({ text: `Requested by ${this.i.user.username}`, iconURL: this.i.user.displayAvatarURL() })
      .setTimestamp();
  };
}