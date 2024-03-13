import { YorSlashCommand } from "yor.ts";
import { EmbedBuilder } from "yor.ts/builders";
import { social } from "../assets/const/import";
import { timeStringToMS } from "../assets/util/time-manipulation";
import workMessages from "../assets/const/work.json";
import stealFailMessages from "../assets/const/caught.json";

// heavy db utilization
export default class Social extends YorSlashCommand {
  builder = social
  execute = async ctx => {
    // defer reply
    await ctx.defer();
    // define util
    const util = ctx.client.util;
    // get sub
    const sub = ctx.getSubcommand();
    // get subgroup
    const subGroup = ctx.getSubcommandGroup();
    // settings shortcut
    // will be used frequently
    const settings = ctx.user.settings;
    // check subgroup
    if (!subGroup) {
      // go through commands
      if (sub == "register") {
        // check if they opened a bank account
        if (settings && settings.bankOpened) return await ctx.editReply({ content: `You baka, you have already opened a bank account. You currently possess **¥${settings.bankBalance}** in your bank.` });
        // init an entry
        await ctx.user.update({ bankOpened: 1, bankBalance: 100 });
        // tell them
        // make an embed with detailed instructions on how to start and get going
        const introEmbed = new EmbedBuilder()
          .setTitle("Nya Global Trading Center | Welcome ticket")
          .setDescription(
            "*You successfully **opened** a bank account.*\n\n" +
            "**What is this?**\n" +
            "Welcome to the Nya Global Trading Center! Note, this is based off virtual money, not withdrawable into real money, and is free-to-play. You start off your bank with **¥100**, and by working, trading, or even doing nothing, you earn money to buy perks, stickers on your card, using certain commands, and more!\n\n" +
            "**Woah, okay. How do I start?**\n" + 
            "The logic behind all this is simple. You make money, that money goes to your pocket. You then gatekeep money from stealers and bad actors (which basically are users around you also playing this) by **depositing** your pocket money to the bank.\n\n" +
            "To buy goods which are purchasable by using this money, you have to **withdraw** it from your bank, right? That's right! You use the money you just withdrawn to buy cool things to show off, or get extra perks, or to use on some commands. *(however, items are not available right now, so you'll have to wait for some time)*\n\n" +
            "- To start working, do `/social work`. You can work once per minute.\n" +
            "- To claim your daily allowances, do `/social daily`. You can claim every 24 hours.\n" +
            "- To attempt stealing money from someone's pocket, do `/social steal`. Failed stealing attempts will last 7 days and deduct your earnings as you fail more, so think twice!\n" +
            "- To try saving from a piggy bank, first, make sure your bank has more than **¥5,000**, then try `/social piggy open`. More about the piggy bank in `/social piggy info`.\n" + 
            "- To transfer money to others, do `/social transfer`. You can transfer **¥5,000** at a time, with a **1%** fee after transfer.\n" +
            "- To deposit pocket money to your bank, do `/social deposit`.\n" +
            "- To withdraw bank money to your pocket, do `/social withdraw`.\n\n" +
            "**That's it!**\n" +
            "Start doing fun activites now and have fun earning!"
          )
          .setFooter({ text: `Requested by ${ctx.member.raw.user.username}`, iconURL: util.getUserAvatar(ctx.member.raw.user) })
          .setTimestamp()
          .setColor(util.color)
        await ctx.editReply({ embeds: [introEmbed] });
      } else if (sub == "daily") {
        // check if user opened a bank account
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check if it's not time yet
        if (Date.now() - settings.lastClaimTime < timeStringToMS("1d")) return await ctx.editReply({ content: `Baka, too early. You'll need to wait 24 hours after each daily claim.` });
        // check if user has had a history of excessive stealing for the week
        // if it has been over a week, wipe their steal history
        if (Date.now() - settings.firstFailedStealTime >= timeStringToMS("7d")) await ctx.user.update({ failedSteal: 0, firstFailedStealTime: "0" });
        const newSettings = ctx.user.settings;
        // if they still have a severe history during the week
        // stop them from earning from daily money
        // severe means 10-15 -- I prefer 10 times
        if (newSettings.failedSteal >= 10) return await ctx.editReply({ content: `Woah, stop right there. You tried to steal people but got caught for **${newSettings.failedSteal}** times this week, and that history is too severe for me to grant you any allowance!\n\nCome back again on <t:${settings.firstFailedStealTime + timeStringToMS("7d")}:F>!` });
        // check if user pocket is exceeding 10k yen
        // a user will always get at least 50 yen on each claim
        // so 9950 is a gatekeep number
        if (settings.pocketBalance > 9_950) return await ctx.editReply({ content: "Hey, hey, you baka! Be careful, you ain't holding **¥10,000** walking outside like that! Deposit some to your bank!" });
        // check if user get bonus
        // base claim daily is 50
        let bonus = 50, streak = settings.dailyStreak;
        // check if user voted today
        if (settings.haveVoted && Date.now() - settings.lastVoteTime > timeStringToMS("1d")) bonus += 10;
        // scale by time
        // if they claim late, scale the bonus down
        // if they claim early, scale the bonus up
        if (Date.now() - settings.lastClaimTime < timeStringToMS("1d 6h")) bonus += 10;
        else if (Date.now() - settings.lastClaimTime < timeStringToMS("1d 8h")) bonus += 5;
        else if (Date.now() - settings.lastClaimTime < timeStringToMS("1d 12h")) bonus += 1;
        // if it is a returning user, give some bonus
        if (Date.now() - settings.lastClaimTime >= timeStringToMS("3d")) bonus += 10;
        // if their streak is more than a week, give some bonus
        if (streak > 7) bonus += 10;
        // random a bonus from 0-5
        bonus += Math.floor(Math.random() * 5);
        // max bonus would be 35
        // which is fair
        // check if they keep their streak
        if (Date.now() - settings.lastClaimTime > timeStringToMS("24h")) streak = 0; else streak += 1;
        // if they'll have their balance overflowed
        // stop that from happening
        if (settings.pocketBalance + bonus > 10_000) return await ctx.editReply({ content: "Hey, hey, you baka, you ain't holding **¥10,000** like that, deposit some to your bank. Lucky I stopped this from happening." });
        // update their balance and reset claim time
        await ctx.user.update({ pocketBalance: settings.pocketBalance + bonus, lastClaimTime: Date.now(), dailyStreak: streak });
        // tell them
        const responses = [" my cat. You should feed it too.", "... well, not really. It was under a rug.", " me. Use it wisely.", " the behind of a wallpaper. I think someone sneaked it past me.", " nowhere. It randomly popped up in your pocket.", " a friend of mine. Her name is Nya.", " me, be respectful!", " a nether portal.", " a random comic you have. Was it Pokémon?", " working.", "... well, I don't know.", " the bank itself.", " bad actors. Be sure to give it back to them!", "... wait, how did you find money in a trash can?!", " doing nothing."];
        await ctx.editReply({ content: `You got **¥${bonus}** as your free allowance from${responses[Math.floor(Math.random() * responses.length)]}` });
      } else if (sub == "deposit") {
        const amount = ctx.getInteger("amount");
        // if amount is negative or 0
        if (amount < 1) return await ctx.editReply({ content: "Baka, you must be joking. You can't sneak that past me!" });
        // check if user opened bank
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check if the amount is more than what they have
        if (amount > settings.pocketBalance) return await ctx.editReply({ content: `Baka, you don't have that much money. Work some more.` });
        // deduct their pocket and put that in their bank
        let pocket = settings.pocketBalance, bank = settings.bankBalance;
        pocket -= amount; bank += amount;
        // update their entry
        await ctx.user.update({ pocketBalance: pocket, bankBalance: bank });
        // tell them
        await ctx.editReply({ content: `Received your ticket. **¥${amount}** has been transferred to your bank.` });
      } else if (sub == "withdraw") {
        const amount = ctx.getInteger("amount");
        // if amount is negative or 0
        if (amount < 1) return await ctx.editReply({ content: "Baka, you must be joking. You can't sneak that past me!" });
        // check if user opened bank
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check if the amount is more than what they have
        if (amount > settings.bankBalance) return await ctx.editReply({ content: "Hey, you don't have that much money. Work some more, baka." });
        // deduct their bank and put that in their pocket
        let pocket = settings.pocketBalance, bank = settings.bankBalance;
        pocket += amount; bank -= amount;
        // check if their pocket exceeds 10k yen
        if (pocket > 10_000) return await ctx.editReply({ content: `Your pocket is gonna overflow, you baka. You can only hold **¥10,000** at a time!` });
        // save their entry
        await ctx.user.update({ pocketBalance: pocket, bankBalance: bank });
        // tell them
        await ctx.editReply({ content: `Received your ticket. You are now holding **¥${pocket}**. Beware of stealers, always gatekeep your money!` });
      } else if (sub == "bank") {
        // check if user opened bank 
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check if user has a piggy bank
        let piggy = "";
        if (settings.piggyBalance) piggy = `, **¥${settings.piggyBalance}** in your piggy bank`;
        // temporarily reply with a message
        // later on an api will be implemented for a more helpful image
        await ctx.editReply({ content: `You currently possess **¥${settings.pocketBalance}** in your pocket${piggy}, and **¥${settings.bankBalance}** in your bank.\n\n||**Tip:** Check back on this command often, because a new :magic_wand: UI is coming soon...||` })
      } else if (sub == "work") {
        // work has a cooldown
        // making the cooldown about a minute and limit max earn to 30 yen (most are 10-15)
        // check if they opened a bank
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // if their cooldown has not passed
        if (Date.now() - settings.lastWorkTime < timeStringToMS("1m")) return await ctx.editReply({ content: `Baka, slow down. You can work again in **${60 - Math.floor((Date.now() - settings.lastWorkTime) / 1000)}** seconds.` });
        // roll custom responses
        const work = workMessages[Math.floor(Math.random() * workMessages.length)];
        // currently we have about 300 work messages in store
        // adding more if we need more
        let pocket = settings.pocketBalance;
        // update pocket with work money
        pocket += work.money_amount;
        // check their failed steal attempt
        // steal persists for a week
        // if they get 30 failed steals (that's huge), they will for sure either 
        // a) still work but get no or deducted money or
        // b) stop working at all for the rest of the week, or
        // c) start doing some steal gacha -- they can still keep stealing 
        // but with much more lower chance of success
        const firstFailedStealTime = settings.firstFailedStealTime;
        // check if it has been a week since first failed steal of any week
        // we do not have to make a timer and track every user
        // we will check when they demand money only
        // if so, wipe their record
        if (firstFailedStealTime >= timeStringToMS("7d")) await ctx.user.update({ failedSteal: 0, firstFailedStealTime: "0" });
        // tell them
        const newSettings = ctx.user.settings; let extra;
        // deduct the money they earned if the steal is still there
        pocket -= newSettings.failedSteal;
        // check if they gonna exceed 10k yen
        if (pocket > 10_000) return await ctx.editReply({ content: `Hey, hey, you baka! Deposit some of your pocket money to the bank, you're not holding more than **¥10,000** outside like that!` });
        // update user balance
        await ctx.user.update({ pocketBalance: pocket, lastWorkTime: Date.now() });
        // reply
        newSettings.failedSteal > 0 ? extra = `, but you have **${newSettings.failedSteal}** failed steal attempts this week, so you got` : extra = " and earned";
        // no worry if they haven't stolen anything 
        // because it's just a subtract 0
        // also no worry if they have negative money
        // because they cannot buy anything and have to gain to get it back to 0
        await ctx.editReply({ content: `You ${work.message}${extra} **¥${work.money_amount - newSettings.failedSteal}** from it.` });
      } else if (sub == "steal") {
        // default level is normal level, which uses normal scaling factor
        // as the scale go higher the fail rate increases
        // but when they success they get more
        const level = ctx.getString("level") || "normal";
        // get recipent
        const stealee = await ctx.getUser("user");
        // check wallet
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check steal duration
        const lastStealLevel = settings.lastStealLevel;
        if (lastStealLevel == "failed" && Date.now() - Number(settings.lastStealTime) < timeStringToMS("10m")) 
          return await ctx.editReply({ content: `Baka, you cannot steal yet. You last failed and therefore you have to wait **10 minutes** before trying again.` });
        if (lastStealLevel == "ez" && Date.now() - Number(settings.lastStealTime) < timeStringToMS("6h")) 
          return await ctx.editReply({ content: `Baka, you cannot steal yet. You last picked \`Snitch\` and therefore you have to wait **6 hours** before trying again.` });
        else if (lastStealLevel == "normal" && Date.now() - Number(settings.lastStealTime) < timeStringToMS("4h")) 
          return await ctx.editReply({ content: `Baka, you cannot steal yet. You last picked \`Commit\` and therefore you have to wait **4 hours** before trying again.` });
        else if (lastStealLevel == "hard" && Date.now() - Number(settings.lastStealTime) < timeStringToMS("2h")) 
          return await ctx.editReply({ content: `Baka, you cannot steal yet. You last picked \`Insane\` and therefore you have to wait **2 hours** before trying again.` }); 
        // if victim has no pocket money, or too little, reject
        // we put it here because the 10 minutes can override any long duration, just execute on a bot
        if (!stealee.settings) {
          return await ctx.editReply({ content: "They don't even have a wallet, good for them. And you, you just failed, but you can't know that, so keep going if you wish." });
        } else if (stealee.settings.pocketBalance < 50 || stealee.settings.pocketBalance == 0) {
          await ctx.user.update({ lastStealLevel: "failed", lastStealTime: Date.now() });
          return await ctx.editReply({ content: "They gatekept their money too well, good for them. And you, you just failed, try again later in 10 minutes." });
        };
        // scale the steal amount
        // the more money in their pocket, the more they can steal
        // but also the more they have to pay if they fail
        // scale also the cooldown to avoid getting too much advantage over timing
        let scalePercentage = level == "ez" ? 25/100 : level == "normal" ? 40/100 : 65/100, 
            pocket = settings.pocketBalance;
        // if they have had a history of extreme stealing fail
        // scale to extreme high chance of failing no matter the level
        if (settings.failedSteal > 10) scalePercentage = 90/100;
        if (settings.failedSteal > 20) scalePercentage = 95/100;
        // roll chance of fail
        const failed = util.probability(scalePercentage * 100);
        // if they failed
        if (failed) {
          // deduct that same money they are supposed to get
          // from the victim
          pocket -= Math.floor(stealee.settings.pocketBalance * scalePercentage);
          // save the result
          const hasFailedBefore = settings.firstFailedStealTime;
          if (hasFailedBefore) await ctx.user.update({ pocketBalance: pocket, failedSteal: settings.failedSteal++, lastStealTime: Date.now(), lastStealLevel: level });
          else await ctx.user.update({ pocketBalance: pocket, firstFailedStealTime: Date.now(), lastStealTime: Date.now(), lastStealLevel: level });
          // reply
          await ctx.editReply({ content: `Baka, you got caught by ${stealFailMessages[Math.floor(Math.random() * stealFailMessages.length)]}, and got fined **¥${Math.floor(stealee.settings.pocketBalance * scalePercentage)}** for it.` });
        } else {
          // gain the money and deduct victim's money
          pocket += Math.floor(stealee.settings.pocketBalance * scalePercentage);
          await stealee.update({ pocketBalance: stealee.settings.pocketBalance - (Math.floor(stealee.settings.pocketBalance * scalePercentage)) });
          await ctx.user.update({ pocketBalance: pocket, lastStealLevel: level, lastStealTime: Date.now() });
          // reply
          await ctx.editReply({ content: `Lucky you. You stole **¥${Math.floor(stealee.settings.pocketBalance * scalePercentage)}**, and they're probably really angry about that.` });
        }
      } else if (sub == "transfer") {
        const user = ctx.getUser("user");
        const amount = ctx.getInteger("amount");
        // if amount is negative or 0
        if (amount < 1) return await ctx.editReply({ content: "Baka, you must be joking. You can't sneak that past me!" });
        // check wallet
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check amount
        if (amount > 5_000) return await ctx.editReply({ content: "Baka, you can only transfer at most **¥5,000** at once." });
        // check balance 
        if (amount > settings.pocketBalance) return await ctx.editReply({ content: "You baka, your pocket doesn't have that much money. Withdraw from your bank." });
        // transfer money
        let pocket = settings.pocketBalance, receiver = user.settings.pocketBalance;
        pocket -= amount; receiver += amount;
        // transfer fee 1%
        const transferFee = Math.floor(pocket * 1/100);
        pocket -= transferFee;
        // check if receiver exceeded 10k yen
        if (receiver > 10_000) return await ctx.editReply({ content: "Their pocket is already overflowing with that money. Tell them to deposit some to their bank, I'm not letting this through." });
        // update both banks
        await ctx.user.update({ pocketBalance: pocket });
        await user.update({ pocketBalance: receiver });
        // reply
        await ctx.editReply({ content: `Received your ticket. **¥${amount}** has been transferred to the recipent, and the transfer fee is **1%** of your pocket after transfer, which is **¥${transferFee}**.` });
      }
    } else if (subGroup == "piggy") {
      if (sub == "info") {
        await ctx.editReply({ content: 
          "**Information for Piggy Bank**\n\n" +
          "Piggy bank is a way to earn passively! Each month, when you perform a paycheck by doing `/social piggy paycheck`, the initiated money will be calculated and put in the piggy bank.\n" +
          "- The monthly earning rate is **3%**.\n" +
          "- Your earnings **have to be claimed manually**. If the next paycheck is coming and you haven't checked this month, the money will be lost and considered *abandoned*.\n" +
          "- You can freely withdraw from the piggy bank, but if it holds less than **¥2,500** when you perform a paycheck, you gain no money from the paycheck, and all money from the piggy bank will be returned to your bank.\n" + 
          "- You can freely add more money to the piggy bank. As the piggy bank grows, you earn more from it.\n" +
          "- Sometimes, when the database encounter errors, if you lost your piggy bank in that occasion, please notify my sensei using `/my fault`, and include a screenshot of your piggy bank.\n" +
          "- To display this piggy bank info again later, do `/social piggy about`."
        });
      } else if (sub == "open") {
        // check wallet
        if (!settings || !settings.bankOpened) return await ctx.editReply({ content: `You baka, you haven't opened a bank account yet. Do \`/social register\` to open one.` });
        // check if piggy exists
        if (settings.piggyBalance) return await ctx.editReply({ content: `You baka, you already opened a piggy bank. Your piggy bank is currently holding **¥${settings.piggyBalance}**.` });
        // check amount
        if (settings.bankBalance < 5_000) return await ctx.editReply({ content: `Baka, you cannot open a piggy bank right now as you only have **¥${settings.bankBalance}** in your bank. The minimum requirement to open a piggy bank is **¥5,000**.` });
        // open piggy bank
        await ctx.user.update({ piggyBalance: 5_000, bankBalance: settings.bankBalance - 5_000, lastPaycheck: Date.now() });
        // reply
        await ctx.editReply({ content: "Received your ticket. A piggy bank is opened for you, and you're earning at a rate of **3%** a month. **¥5,000** from your bank has been transferred to your piggy bank." });
      } else if (sub == "withdraw") {
        const force = ctx.getBoolean("force");
        const amount = ctx.getInteger("amount");
        // if amount is negative or 0
        if (amount < 1) return await ctx.editReply({ content: "Baka, you must be joking. You can't sneak that past me!" });
        // check if piggy exists
        if (!settings || !settings.piggyBalance) return await ctx.editReply({ content: `You baka, you haven't opened a piggy bank yet. Do \`/social piggy register\` to open one.` });
        // check if amount exceed piggy balance
        if (amount > settings.piggyBalance) return await ctx.editReply({ content: `Baka, you don't have that much money in your piggy bank yet. It is currently holding **¥${settings.piggyBalance}**.` });
        // check if amount will make piggy destroy
        // and it is not forced
        if (settings.piggyBalance - amount < 2_500 && !force) return await ctx.editReply({ content: `Your piggy bank will have less than **¥2,500** after this operation, which will return you also the rest and destroy this piggy. To confirm this operation, perform this command again with the \`force\` option.` });
        // transfer
        let bank = settings.bankBalance, piggy = settings.piggyBalance;
        bank += amount; piggy -= amount;
        // check if piggy will have less than 2500 yen
        // destroy if it's the case
        if (piggy < 2_500) { bank += piggy; piggy = 0 };
        await ctx.user.update({ bankBalance: bank, piggyBalance: piggy });
        // reply
        if (piggy < 2_500) {
          return await ctx.editReply({ content: `Your piggy bank has been destroyed. All the money from it has been moved to your bank, which makes a total of **¥${bank}**.` });
        } else {
          return await ctx.editReply({ content: `Received your ticket. Your piggy bank now has **¥${piggy}** left, and **¥${amount}** has been transferred to your bank.`});
        };
      } else if (sub == "deposit") {
        const amount = ctx.getInteger("amount");
        // if amount is negative or 0
        if (amount < 1) return await ctx.editReply({ content: "Baka, you must be joking. You can't sneak that past me!" });
        // check if piggy exists
        if (!settings || !settings.piggyBalance) return await ctx.editReply({ content: `You baka, you haven't opened a piggy bank yet. Do \`/social piggy register\` to open one.` });
        // check if bank has enough money
        if (settings.bankBalance < amount) return await ctx.editReply({ content: `Baka, you don't have that much money in your bank. You currently only possess **¥${settings.bankBalance}** in there.` });
        // transfer
        let bank = settings.bankBalance, piggy = settings.piggyBalance;
        bank -= amount; piggy += amount;
        // save
        await ctx.user.update({ bankBalance: bank, piggyBalance: piggy });
        // reply
        // check if their paycheck is coming
        let paycheck = "";
        if (Date.now() - settings.lastPaycheck > timeStringToMS("30d")) paycheck = "\n\nAlso, you have a paycheck on hold. Do `/social piggy paycheck` to perform it.";
        await ctx.editReply({ content: `Received your ticket. Your piggy bank is now holding **¥${piggy}**, and your bank is holding **¥${bank}**.${paycheck}` });
      } else if (sub == "paycheck") {
        // check if piggy exists
        if (!settings || !settings.piggyBalance) return await ctx.editReply({ content: `You baka, you haven't opened a piggy bank yet. Do \`/social piggy register\` to open one.` });
        // check if it's time
        let paycheckDate = new Date(settings.lastPaycheck + timeStringToMS("30d")).toLocaleDateString("en");
        if (!(Date.now() - settings.lastPaycheck > timeStringToMS("30d"))) return await ctx.editReply({ content: `Baka, it's not time for a paycheck yet. It's on **${paycheckDate}**.` });
        // apply earning rate
        let piggy = settings.piggyBalance, earnRate = 3/100;
        piggy += Math.floor(piggy * earnRate);
        // save
        await ctx.user.update({ piggyBalance: piggy, lastPaycheck: Date.now() });
        // tell them
        await ctx.editReply({ content: `Paycheck initialized. You have earned **¥${Math.floor(piggy * earnRate)}** this month, and your piggy bank is now holding **¥${piggy}**.` });
      }
    }
  }
}