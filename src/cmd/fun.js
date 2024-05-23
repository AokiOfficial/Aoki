// ref!: error handling
// <-->: block division
// /**/: useless? notes
import { SlashCommand } from "slash-create/web";
import { EmbedBuilder } from "@discordjs/builders";
import { fun } from "../assets/const/import";

export default class Fun extends SlashCommand {
  constructor(creator) { super(creator, fun) };
  // <--> main block
  async run(ctx) {
    this.ctx = ctx;
    // <--> get command and define utilities
    const sub = ctx.getSubcommand();
    const util = ctx.client.util;
    const query = ctx.getOption("query");
    // <--> run command in try...catch
    try {
      await ctx.defer();
      return await this[sub](ctx, query, util);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        const error = `\`\`\`fix\nCommand "${sub}" returned "${err}"\n\`\`\``; /* discord code block formatting */
        return this.throw(`Oh no, something happened internally. Please report this using \`/my fault\`, including the following:\n\n${error}`);
      };
    };
  };
  // <--> 8ball command
  async "8ball"(ctx, query, util) {
    if (util.isProfane(query)) return this.throw("Fix your query, please. At least give me some respect!");
    const eightball = await util.getStatic("8ball");
    return await ctx.send({ content: util.random(eightball) });
  };
  // <--> fact command
  async fact(ctx, _, util) {
    // <--> utilities
    const urls = ["https://catfact.ninja/fact", "https://uselessfacts.jsph.pl/random.json?language=en"];
    const res = await fetch(util.random(urls)).then(res => res.json());
    const content = res.text || res.fact;
    await ctx.send({ content });
  };
  // <--> today command
  async today(ctx, _, util) {
    const [month, day] = new Date().toLocaleDateString().trim().split("/");
    const todayRes = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
    const todayJs = await todayRes.json();
    const { text, year } = util.random(todayJs.data.Events);
    return await ctx.send({ content: `On **${todayJs.date}, ${year}**: ${text}` });
  };
  // <--> meme command
  async meme(ctx, query, util) {
    const cancelled = util.random([
      "Get cancelled.", "Baka, bad luck. You got cancelled.",
      "You've been ignored.", "He he he haw.", "Baka, you're unlucky. Get cancelled."
    ]);
    if (util.probability(10)) return this.throw(`${cancelled}\n\n||Execute the command again.||`);
    try {
      const res = await util.reddit(query || "random");
      if (res.nsfw && !ctx.channel.nsfw) throw new Error(`${cancelled}\n\n||This meme is NSFW.||`);
      const meme = this.embed
        .setTitle(`**${res.title}**`)
        .setURL(res.url)
        .setDescription(`*Posted in **r/${query || res.randomKey}** by **${res.author}***`)
        .setImage(res.image)
      return await ctx.send({ embeds: [meme] });
    } catch (err) {
      return this.throw(err.message);
    };
  };
  // <--> ship command
  async ship(ctx, _, util) {
    const first = ctx.getUser("first");
    const second = ctx.getUser("second");
    // <--> handle exceptions
    if (first.id == util.id || second.id == util.id) return this.throw("Ew, I'm not a fan of shipping. Choose someone else!");
    if (first.id == second.id) return this.throw("Pfft. No one does that, baka.");
    // <--> utilities
    const luckyWheelRate = util.probability(5);
    const rollProbability = util.probability(40);
    const result = rollProbability ? "100" : "0";
    const normalRate = Math.floor(Math.random() * 100);
    // <--> construct response
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
    // <--> special
    if (luckyWheelRate) {
      await ctx.send({ content: "Lucky wheel time! Let's see if you two are lucky!" });
      await new Promise(resolve => setTimeout(resolve, 3000));
      return await ctx.send({ content: result == "100" ? "Hey, good couple! You rolled **100%**!" : "Baka, you two lost. **0%** rate." });
    };
    return await ctx.send({ content: finalShipResponse });
  };
  // <--> fortune command
  async fortune(ctx) {
    const cookies = await util.getStatic("fortune");
    const cookie = util.random(cookies);
    await ctx.send({ content: cookie });
  };
  // <--> truth command
  async truth(ctx) {
    const questions = await util.getStatic("truth");
    const question = util.random(questions);
    await ctx.send({ content: question });
  };
  // <--> generator command
  async generator(ctx) {
    const template = ctx.getOption("template");
    const top = ctx.getOption("top");
    const bottom = ctx.getOption("bottom");
    // <--> handle user query
    const res = await fetch("https://api.imgflip.com/caption_image", {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        template_id: template,
        username: "akira1922",
        password: ctx.client.env.IMG_KEY,
        text0: top,
        text1: bottom
      })
    }).then(async res => await res.json());
    // <--> send embed
    const embed = this.embed
      .setDescription(`Here you go. Not like I wanted to waste my time.`)
      .setImage(res.data.url);
    await ctx.send({ embeds: [embed] });
  };
  // <--> owo command
  async owo(ctx, query) {
    if (query.length > 200) return this.throw("You throwing your essay homework in here?\n\nLess than 200 characters, please!");
    const res = await fetch(`https://nekos.life/api/v2/owoify?${query}`).then(res => res.json());
    await ctx.send({ content: res.owo });
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