// file with super simple commands (first 200 lines)
// great as a starting point for both native fetch and simple defer-reply structure used across all commands
// there's a test file using a lot of methods located in assets - have a check there
import { YorSlashCommand } from "yor.ts";
import { EmbedBuilder } from "@discordjs/builders";
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
    const util = ctx.client.util;
    const sub = ctx.getSubcommand();
    await ctx.defer();
    // handle commands
    if (sub == "8ball") {
      const query = ctx.getString("query");
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
      if (util.isProfane(query)) {
        return await ctx.editReply({ content: "Baka, I won't answer that one. Fix your wordings." });
      }
      await ctx.editReply({ content: eightball[Math.floor(Math.random() * eightball.length)] });
    } else if (sub == "fact") {
      const about = ctx.getString("about");
      let url, type;
      if (about == "cat") {
        url = "https://catfact.ninja/fact";
        type = "fact"
      } else if (about == "dog") {
        url = "https://dog-api.kinduff.com/api/facts?number=1"
      } else {
        url = "https://uselessfacts.jsph.pl/random.json?language=en",
          type = "text"
      };
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3"
        }
      }).then(res => res.json());
      await ctx.editReply({ content: `${about == "dog" ? res.facts[0] : res[type]}` });
    } else if (sub == "today") {
      const baseDate = new Date;
      const date = baseDate.toLocaleDateString();
      const trimmedDate = date.trim().split("/");
      const [month, day] = trimmedDate;

      const todayRes = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
      const todayJs = await todayRes.json();

      const ranInt = Math.floor(Math.random() * todayJs.data.Events.length);
      const { text, year } = todayJs.data.Events[ranInt];

      await ctx.editReply({ content: `On **${todayJs.date}, ${year}**: ${text}` });
    } else if (sub == "meme") {
      const cancelRate = util.probability(10);
      const cancelResponse = [
        "Get cancelled.", "Baka, bad luck. You got cancelled.",
        "You've been ignored.", "He he he haw.", "Baka, you're unlucky. Get cancelled."
      ]
      const cancelled = cancelResponse[Math.floor(Math.random() * cancelResponse.length)]
      if (cancelRate) {
        return await ctx.editReply({ content: cancelled + "\n\n||Execute the command again.||" })
      }
      const response = await util.reddit(query ? query : "random");
      if (response.err) {
        return await ctx.editReply({ content: "U-Uh, just coming here to say that this subreddit has no posts or doesn't exist." });
      }
      if (response.nsfw && !ctx.channel.nsfw) {
        return await ctx.editReply({ content: cancelled + "\n\n||This meme is NSFW.||" });
      }
      const meme = new EmbedBuilder()
        .setColor(util.color)
        .setTitle(`**${response.title}**`)
        .setURL(response.url)
        .setDescription(`*Posted in **r/${query ? query : response.randomKey}** by **${response.author}***`)
        .setImage(response.image)
        .setFooter({ text: `${response.upVotes} likes`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
        .setTimestamp();
      await ctx.editReply({ embeds: [meme] });
    } else if (sub == "ship") {
      const first = ctx.getUser("first");
      const second = ctx.getUser("second");
      if (first.raw.id == util.id || second.raw.id == util.id) {
        return await ctx.editReply({ content: "Ew, I'm not a fan of shipping. Choose someone else!" })
      }
      if (first.raw.id == second.raw.id) {
        return await ctx.editReply({ content: "Pfft. No one does that, baka." })
      }
      const luckyWheelRate = util.probability(5);
      const rollProbability = util.probability(40)
      let result, luckyWheelArr = ["0", "100"];
      if (rollProbability) result = luckyWheelArr[1]; else result = luckyWheelArr[0];
      const normalRate = Math.floor(Math.random() * 100)
      let finalShipResponse;
      if (normalRate == 0) finalShipResponse = "Woah, that's impressive. I've never seen this happen before.\n\n||That's a **0%** ship rate, consider you two lucky.||";
      else if (normalRate <= 30) finalShipResponse = `You two stood no chance. I don't like **${normalRate}%**, and maybe you don't, too.`;
      else if (normalRate <= 50) finalShipResponse = `Fair, I'd say you two need some time. You two scored **${normalRate}%**, not like I like the rate or something.`;
      else if (normalRate <= 70) finalShipResponse = `Alright, that's fine. You two scored **${normalRate}%**, I think I like that.`;
      else if (normalRate <= 90) finalShipResponse = `Hey! That's pretty good, I rarely see a couple scoring this nicely. A whopping **${normalRate}%**!`;
      else if (normalRate == 100) finalShipResponse = "Holy cow. Perfect couple right here duh? **100%** ship rate!";
      if (luckyWheelRate) {
        await ctx.editReply({ content: "Lucky wheel time! Let's see if you two are lucky!" });
        await new Promise(resolve => setTimeout(resolve, 3000));
        await ctx.followUp({ content: `${result == 100 ? "Hey, good couple! You rolled **100%**!" : "Baka, you two lost. **0%** rate."}` })
      } else await ctx.editReply({ content: finalShipResponse });
    } else if (sub == "fortune") {
      const cookies = await util.getStatic("fortune");
      const fortune = cookies[Math.floor(Math.random() * cookies.length)]
      await ctx.editReply({ content: fortune })
    } else if (sub == "truth") {
      const question = await util.getStatic("truth");
      const truth = question[Math.floor(Math.random() * question.length)]
      await ctx.editReply({ content: truth })
    } else if (sub == "generator") {
      const template_picked = ctx.getString("template");
      const text1 = ctx.getString("top");
      const text2 = ctx.getString("bottom");

      let finalMemeRes = await fetch("https://api.imgflip.com/caption_image", {
        body: new URLSearchParams({
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
        .setColor(util.color)
        .setDescription(`Here you go. Not like I wanted to waste my time.`)
        .setImage(finalMemeRes.url).setTimestamp()
        .setFooter({ text: "Powered by Imgflip", iconURL: util.getUserAvatar(ctx.member.raw.user) });
      await ctx.editReply({ embeds: [finalMemeEmbed] });
    } else if (sub == "owo") {
      const q = ctx.getString("query");
      if (q.length > 200) {
        return await ctx.editReply({ content: "Less than 200 characters please, baka." });
      }
      const owoRes = await fetch(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(q)}`).then(res => res.json());
      await ctx.editReply({ content: owoRes.owo });
    };
    // starting from here
    // commands integrating database usage will be used
    // check if user has a bank
    const settings = ctx.user.settings;
    if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
    if (sub == "toss") {
      // typeguard 0
      const amount = ctx.getInteger("amount") || 0;
      const level = ctx.getString("level") || "ez";
      // check if smaller than 20
      if (amount < 50) return await ctx.editReply({ content: "So weak, so weak... Higher than **¥50**, please." });
      // check if amount exceed pocket limit
      if (amount > settings.pocketBalance) return await ctx.editReply({ content: `Baka, you don't have that much money in your pocket. You're holding **¥${settings.pocketBalance}** only.`});
      // level scaling
      let losing, earn;
      if (level == "ez") {
        losing = 35/100;
        earn = 15/100;
      } else if (level == "normal") {
        losing = 50/100;
        earn = 30/100;
      } else if (level == "hard") {
        losing = 70/100;
        earn = 1;
      };
      // roll losing probability  
      const lost = util.probability(losing * 100);
      let pocket = settings.pocketBalance;
      const change = Math.floor(amount * earn);
      // initial response
      // we must move the response delay further down as data is not being saved right away
      // making this command broken when executed along with other commands affecting on money
      await ctx.editReply({ content: `Your **¥${amount}** is on hold... let's see what do you get from this.` });
      // if they lost
      if (lost) {
        // deduct money according to scaling
        pocket -= change;
        // save
        await ctx.user.update({ pocketBalance: pocket });
        // notify
        await new Promise(resolve => setTimeout(resolve, 5000));
        await ctx.followUp({ content: `Baka, you lost the game. You're losing **¥${change}** from your pocket.` });
      } else {
        pocket += change;
        // save
        await ctx.user.update({ pocketBalance: pocket });
        // notify
        await new Promise(resolve => setTimeout(resolve, 5000));
        await ctx.followUp({ content: `You're just lucky. You won **¥${change}** to your pocket.` });
      };
    } else if (sub == "slot") {
      // typeguard 0
      const amount = ctx.getInteger("amount") || 0;
      // if amount is too small
      if (amount < 50) return await ctx.editReply({ content: "Too little. At least **¥50**, please." });
      // define rolls
      const fruits = ["🍑", "🥝", "🍉", "🥥"];
      // define array to roll
      let result = [];
      for (let i = 0; i < 3; i++) {
        const randomPick = fruits[Math.floor(Math.random() * fruits.length)];
        // typeguarding undef
        if (!randomPick) result.push(fruits[0]); else result.push(randomPick);
      };
      // check how many matches
      // for each match reward 25% of amount
      let matches = 0, pocket = settings.pocketBalance;
      if (result[0] == result[1] && result[0] == result[2]) {
        // this means they got 3 same
        matches = 3;
        pocket += Math.floor((amount * (25/100)) * 3); // 3 times 25% of their bet
      } else if (result[0] == result[2] || result[1] == result[2] || result[0] == result[1]) {
        // this means they got 2 same
        matches = 2;
        pocket += Math.floor(amount * (25/100)); // 25% of their bet
      }
      // else if match = 0 they lose 25% of their bet
      else if (matches == 0) pocket -= Math.floor(amount * (25/100));
      // save the earing
      await ctx.user.update({ pocketBalance: pocket });
      // map the result
      result = `${matches == 0 ? "Baka, you" : "Nice, you"} got **${matches}** same fruits.\n\`\`\`fix\n${result.join(" | ")}\n\`\`\`\nAnd you ${matches == 0 ? "lost" : "won"} **¥${Math.abs(ctx.user.settings.pocketBalance - settings.pocketBalance)}**.`;
      // reply
      await ctx.editReply({ content: `Your **¥${amount}** have been placed in the slot machine... let's see what you'll get.` });
      await new Promise(resolve => setTimeout(resolve, 3000));
      await ctx.editReply({ content: result });
    }
  }
}

