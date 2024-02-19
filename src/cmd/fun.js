// file with super simple commands
// great as a starting point for both native fetch and simple defer-reply structure used across all commands
// there's a test file using a lot of methods located in assets - have a check there
import { YorSlashCommand } from "yor.ts";
import { EmbedBuilder } from "yor.ts/builders";
import cookies from "../assets/const/fortune.json";
import question from "../assets/const/truth.json";
import { fun } from "../assets/const/import"

// unlike server neko where we construct data options
// now we have to explicitly specify the builder and the execute context
// which is kinda new because I don't like doing
// execute = async ctx => {}
// I'd prefer doing
// async execute(ctx) {} 
export default class Fun extends YorSlashCommand {
  builder = fun
  execute = async ctx => {
    // util
    const util = ctx.client.settings;
    // get subcommand
    const sub = ctx.getSubcommand();
    // defer reply 
    await ctx.defer();
    // handle commands
    switch (sub) {
      case "8ball":
        const eightball = [
          "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.",
          "Rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.",
          "Sign point to yes.", "Reply hazy, try again.", "Ask again later.", "Will not tell you now.",
          "Cannot predict now.", "Ask again.", "Don't count on it.", "I'll say no.",
          "My sources say no.", "Outlook not so good.", "Very doubtful.", "Yes", "No", "Yeah", "Nope",
          "Flip a coin on it, I dunno.", "I mean, if that's what *you* think...",
          "Sure", "Not really.", "You know, I talked to the bard, and he doesn't think so.",
          "The dragonborn says yes.", "Well, it doesn't really matter. We're in the middle of a fight here, you know.",
          "I'd say yeah.", "Roll some dice on it. After all, the dice are never wrong.", "The dice said... uh... it's best we don't talk about it.",
          "The dice say so, so yes.", "Absofrickinlutely not.", "For sure", "Definitely.", "We flipped a dead skeleton's bone, it said no.",
          "Go wake up that hellhound over there. If you live, it's a yes, if you die, it's a no."
        ];
        if (util.isProfane(query)) return await ctx.editReply({ content: "Baka, I won't answer that one. Fix your wordings." });
        await ctx.editReply({ content: eightball[Math.floor(Math.random() * eightball.length)] });
        break;
      case "fact":
        // literally free command
        await fetch("https://uselessfacts.jsph.pl/random.json?language=en").then(async res => {
          res = await res.json();
          await ctx.editReply({ content: res.text });
        });
        break;
      case "today":
        // yet another api command
        const baseDate = new Date;
        const date = baseDate.toLocaleDateString();
        const trimmedDate = date.trim().split("/");
        const [month, day] = trimmedDate;

        const todayRes = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
        const todayJs = todayRes.json();

        const ranInt = Math.floor(Math.random() * todayJs.data.Events.length);
        const { text, year } = todayJs.data.Events[ranInt];

        await ctx.editReply({ content: `On **${todayJs.date}, ${year}**: ${text}` });
        break;
      case "meme":
        // cancel is a legit thing and it can probably make some fun
        const cancelRate = util.probability(10);
        const cancelResponse = [
          "Get cancelled.", "Baka, bad luck. You got cancelled.",
          "You've been ignored.", "He he he haw.", "Baka, you're unlucky. Get cancelled."
        ]
        const cancelled = cancelResponse[Math.floor(Math.random() * cancelResponse.length)]
        if (cancelRate) return await ctx.editReply({ content: cancelled + "\n\n||Execute the command again.||" })
        const response = await util.reddit(query ? query : "random");
        if (response.err) {
          return await ctx.editReply({ content: "U-Uh, just coming here to say that this subreddit has no posts or doesn't exist." });
        }
        // pseudo cancel if a nsfw meme gets in the way
        if (response.nsfw === true && !ctx.channel.nsfw) {
          return await ctx.editReply({ content: cancelled + "\n\n||This meme is NSFW.||" });
        }
        const meme = new EmbedBuilder()
          .setTitle(`**${response.title}**`)
          .setURL(response.url)
          .setDescription(`*Posted in **r/${query ? query : response.randomKey}** by **${response.author}***`)
          .setImage(response.image)
          .setFooter({ text: `${response.upVotes} likes`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp();
        await ctx.editReply({ embeds: [meme] });
        break;
      case "ship":
        const first = ctx.getUser("first");
        const second = ctx.getUser("second");
        if (first.id == util.id || second.id == util.id) return await ctx.editReply({ content: "Ew, I'm not a fan of shipping. Choose someone else!" })
        if (first.id == second.id) return await ctx.editReply({ content: "Pfft. No one does that, baka." })
        // lucky wheel strikes again
        const luckyWheelRate = util.probability(5);
        // roll again, but only 40% outputting true
        const rollProbability = util.probability(40)
        let result, luckyWheelArr = ["0", "100"];
        if (rollProbability) result = luckyWheelArr[1]; else result = luckyWheelArr[0];
        // just roll normally if nothing happened
        const normalRate = Math.floor(Math.random() * 100)
        // responses
        let finalShipResponse;
        if (normalRate == 0) finalShipResponse = "Woah, that's impressive. I've never seen this happen before.\n\n||That's a **0%** ship rate, consider you two lucky.||";
        else if (normalRate <= 30) finalShipResponse = `You two stood no chance. I don't like **${normalRate}%**, and maybe you don't, too.`;
        else if (normalRate <= 50) finalShipResponse = `Fair, I'd say you two need some time. You two scored **${normalRate}%**, not like I like the rate or something.`;
        else if (normalRate <= 70) finalShipResponse = `Alright, that's fine. You two scored **${normalRate}%**, I think I like that.`;
        else if (normalRate <= 90) finalShipResponse = `Hey! That's pretty good, I rarely see a couple scoring this nicely. A whopping **${normalRate}%**!`;
        else if (normalRate == 100) finalShipResponse = "Holy cow. Perfect couple right here duh? **100%** ship rate!";
        // then check if we have a lucky wheel instance
        if (luckyWheelRate) return await ctx.editReply({ content: "Lucky wheel time! Let's see if you two are lucky!" }).then(() => {
          setTimeout(async () => {
            await ctx.followUp({ content: `${result == 100 ? "Hey, good couple! You rolled **100%**!" : "Baka, you two lost. **0%** rate."}` })
          }, 3000)
        }); else await ctx.editReply({ content: finalShipResponse })
        break;
      case "fortune":
        const fortune = cookies[Math.floor(Math.random() * cookies.length)]
        await ctx.editReply({ content: fortune })
        break;
      case "truth":
        const truth = question[Math.floor(Math.random() * question.length)]
        await ctx.editReply({ content: truth })
        break;
      case "generator":
        const template_picked = ctx.getString("template");
        const text1 = ctx.getString("top");
        const text2 = ctx.getString("bottom");

        let finalMemeRes = await fetch("https://api.imgflip.com/caption_image", {
          body: new URLSearchParams({
            // safety convert
            template_id: template_picked.toString(),
            username: "akira1922",
            password: ctx.client.env.IMG_KEY,
            text0: text1,
            text1: text2
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        finalMemeRes = (await finalMemeRes.json()).data;
        const finalMemeEmbed = new EmbedBuilder()
          .setDescription(`Here you go. Not like I wanted to waste my time.`)
          .setImage(finalMemeRes.url).setTimestamp()
          .setFooter({ text: "Powered by Imgflip", iconURL: util.getUserAvatar(ctx.member.raw.user) });
        await ctx.editReply({ embeds: [finalMemeEmbed] });
        break;
      case "owo":
        const query = ctx.getString("query");
        // check ourselves - we don't like asking workers to do too many things in simple commands
        // more complex structures in other files
        if (query.length > 200) return await ctx.editReply({ content: "Less than 200 characters please, baka." });
        const owoRes = await fetch(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(query)}`).then(res => res.json());
        await ctx.editReply({ content: owoRes.owo });
        break;
      case "catfact": 
        const catfact = await fetch(`https://catfact.ninja/fact`).then(res => res.json());
        await ctx.editReply({ content: catfact.fact });
        break;
      case "dogfact": 
        const dogfact = await fetch(`https://dog-api.kinduff.com/api/facts?number=1`).then(res => res.json());
        await ctx.editReply({ content: dogfact.facts[0] });
        break;
    }
  }
}
