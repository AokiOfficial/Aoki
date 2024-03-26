import { SlashCommandBuilder } from "@discordjs/builders";

const fun = new SlashCommandBuilder()
  .setName("fun")
  .setDescription("Long list of subcommands for... fun.")
  .addSubcommand(cmd => cmd
    .setName("8ball")
    .setDescription("ask me anything.")
    .addStringOption(option => option.setName("query").setDescription("just.. ask me.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName('fact')
    .setDescription("gives you a random fact. Mostly useless though.")
    .addStringOption(option => option
      .setName("about")
      .setDescription("whether to give facts about dogs, cats, or random")
      .addChoices(...[
        { name: "cat", value: "cat" },
        { name: "dog", value: "dog" },
        { name: "random", value: "random" }
      ])  
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("owo")
    .setDescription("owoify your message")
    .addStringOption(option => option
      .setName("query")
      .setDescription("the text you wanna owoify")
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName('today')
    .setDescription("gives you a random fact of today, in the past.")
  )
  .addSubcommand(cmd => cmd
    .setName('meme')
    .setDescription("gives you a random meme, with 10% chance cancelling you.")
    .addStringOption(option => option.setName("query").setDescription("the subreddit name. If you just want to see average memes, skip."))
  )
  .addSubcommand(cmd => cmd
    .setName('ship')
    .setDescription("ships 2 people you mention, with 5% faith in the lucky wheel.")
    .addUserOption(option => option.setName("first").setDescription("...literally the first person.").setRequired(true))
    .addUserOption(option => option.setName("second").setDescription("...literally the second person, duh!").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName('fortune')
    .setDescription("gives you a random fortune cookie's paper.")
  )
  .addSubcommand(cmd => cmd
    .setName('truth')
    .setDescription("gives you a random truth question, from the ol' truth or dare game.")
  )
  .addSubcommand(cmd => cmd
    .setName('generator')
    .setDescription('meme generator, yes, you can now make them in Discord.')
    .addStringOption(option => option
      .setName('template')
      .setDescription('meme template you wanna use')
      .addChoices(...[
        { name: "Drake Hotline Bling", value: '181913649' },
        { name: "Distracted Boyfriend", value: '112126428' },
        { name: "One Does Not Simply", value: '61579' },
        { name: "Ancient Aliens", value: '101470' },
        { name: "Tuxedo Winnie The Pooh", value: '178591752' },
        { name: "Leonardo Dicaprio Cheers", value: '5496396' },
        { name: "Always Has Been", value: '252600902' },
        { name: "Doge", value: '8072285' },
        { name: "Third World Skeptical Kid", value: '101288' }
      ])
      .setRequired(true)
    )
    .addStringOption(option => option.setName('top').setDescription('first text field (or top text)').setRequired(true))
    .addStringOption(option => option.setName("bottom").setDescription("second text field (or bottom text)").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("toss")
    .setDescription("test your chance to win some money off a randomizer.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("the amount you want to place.")
      .setRequired(true)  
    )  
    .addStringOption(option => option
      .setName("level")
      .setDescription("set the difficulty. The higher the difficulty, the more you earn.")
      .addChoices(...[
        { name: "Game", value: "ez" },
        { name: "Bet", value: "normal" },
        { name: "Double or Nothing", value: "hard" }
      ])  
    )
  )
  .addSubcommand(cmd => cmd
    .setName("slot")
    .setDescription("insert coin for slot machine gaming.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("the amount you want to place.")
      .setRequired(true)  
    )  
  )

const util = new SlashCommandBuilder()
  .setName("utility")
  .setDescription("The name says it all.")
  .addSubcommand(cmd => cmd
    .setName("avatar")
    .setDescription("display one's avatar.")
    .addUserOption(option => option.setName("member").setDescription("...just the server member.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("banner")
    .setDescription("display one's banner.")
    .addUserOption(option => option.setName("member").setDescription("...just the server member.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("channel")
    .setDescription("display a channel's information.")
    .addChannelOption(option => option.setName("channel").setDescription("...just the channel.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("github")
    .setDescription("display a (public) GitHub repo's information.")
    .addStringOption(option => option.setName("name").setDescription("Format: [repo owner]/[repo name].").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("npm")
    .setDescription("display an npm package's information.")
    .addStringOption(option => option.setName("name").setDescription("...just the package's name.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("server")
    .setDescription("display this server's information.")
  )
  .addSubcommand(cmd => cmd
    .setName("urban")
    .setDescription("the one dictionary you love.")
    .addStringOption(option => option.setName("word").setDescription("...just the word you want to define.").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("ask")
    .setDescription("you're just lazy, aren't you. Please only ask short questions, I will only read only 140 characters.")
    .addStringOption(option => option.setName("question").setDescription("thing you wanna ask").setRequired(true))
  )
  .addSubcommand(cmd => cmd
    .setName("profile")
    .setDescription("check out both your balance and osu! skills in one image.")
    .addUserOption(option => option
      .setName("user")
      .setDescription("the user you wanna check out. Default you.")  
    )  
    .addStringOption(option => option
      .setName("mode")
      .setDescription("if you wanna check out another mode. Default yours.")
      .addChoices(...[
        { name: "standard", value: "osu" },
        { name: "taiko", value: "taiko" },
        { name: "catch", value: "fruits" },
        { name: "mania", value: "mania" }
      ])  
    )
  )

const my = new SlashCommandBuilder()
  .setName("my")
  .setDescription("Commands directly related to me or my development.")
  .addSubcommand(cmd => cmd
    .setName("ping")
    .setDescription("check latency... or it's you wanting to be insulted.")  
  )
  .addSubcommand(cmd => cmd
    .setName("terms")
    .setDescription("read my neat version of Terms of Service.")
  )
  .addSubcommand(cmd => cmd
    .setName("vote")
    .setDescription("vote for me on top.gg to show some support!")
  )
  .addSubcommand(cmd => cmd
    .setName("fault")
    .setDescription("is anything wrong? Having good ideas? Share it!")
    .addStringOption(option => option
      .setName("type")
      .setDescription("the type of this feedback")
      .setRequired(true)
      .addChoices(...[
        { name: "issue", value: "Issue" },
        { name: "suggestion", value: "Suggestion" }
      ])
      .setRequired(true)
    )
    .addStringOption(option => option.setName("query").setDescription("the issue/suggestion you wanna send."))
    .addAttachmentOption(option => option.setName("attachment").setDescription("literally the attachment."))
  )

const anime = new SlashCommandBuilder()
  .setName("anime")
  .setDescription("I'm also someone fictional... you know, but not like I wanted to talk to you about it!")
  .addSubcommand(cmd => cmd
    .setName("profile")
    .setDescription("finds someone's profile on either MyAnimeList or AniList")
    .addStringOption(option => option
      .setName("platform")
      .setDescription("the platform you want to search for")
      .addChoices(...[
        { name: "AniList", value: "al" },
        { name: "MyAnimeList", value: "mal" }
      ])  
      .setRequired(true)
    )  
    .addStringOption(option => option
      .setName("query")
      .setDescription("the profile username to search for")  
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("search")
    .setDescription("finds an anime, a manga, a character, or a seiyuu")
    .addStringOption(option => option
      .setName("type")
      .setDescription("whether to search for an anime, a manga, a character, or a seiyuu")
      .addChoices(...[
        { name: "anime", value: "anime" },
        { name: "manga", value: "manga" },
        { name: "character", value: "character" },
        { name: "seiyuu", value: "seiyuu" }
      ])  
      .setRequired(true)
    )  
    .addStringOption(option => option
      .setName("query")
      .setDescription("the name to search for")  
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("meme")
    .setDescription("peaceful command, it won't cancel you like what /fun meme do")
  )
  .addSubcommand(cmd => cmd
    .setName("quote")
    .setDescription("anime quotes, best stuff ever.")
  )
  .addSubcommand(cmd => cmd
    .setName("action")
    .setDescription("spams you with images where anime characters do stuff")
    .addStringOption(option => option
      .setName("query")
      .setDescription("the thing that you want to be spammed with")
      .setRequired(true)
      .addChoices(...[
        { name: 'bully', value: 'bully' }, { name: 'cry', value: 'cry' },
        { name: 'awoo', value: 'awoo' }, { name: 'bonk', value: 'bonk' },
        { name: 'yeet', value: 'yeet' }, { name: 'hug', value: 'hug' },
        { name: 'lick', value: 'lick' }, { name: 'neko', value: 'neko' },
        { name: 'pat', value: 'pat' }, { name: 'blush', value: 'blush' },
        { name: 'slap', value: 'Slap' }, { name: 'wave', value: 'wave' },
        { name: 'smile', value: 'smile' }, { name: 'smug', value: 'smug' },
        { name: 'highfive', value: 'highfive' }, { name: 'wink', value: 'wink' },
        { name: 'handhold', value: 'handhold' }, { name: "nom", value: "nom" },
        { name: 'bite', value: 'bite' }, { name: "glomp", value: "glomp" },
        { name: "kick", value: "kick" }, { name: 'happy', value: 'happy' },
        { name: "poke", value: "poke" }, { name: 'dance', value: 'dance' },
        { name: "cringe", value: "cringe" }
      ])
    )
  )
  .addSubcommand(cmd => cmd
    .setName("random")
    .setDescription("gets a random anime or manga info")
    .addStringOption(option => option
      .setName("type")
      .setDescription("whether to get an anime or manga")
      .setRequired(true)
      .addChoices(...[
        { name: "anime", value: "anime" },
        { name: "manga", value: "manga" }
      ]) 
    )
  )

const moderate = new SlashCommandBuilder()
  .setName("moderate")
  .setDescription("moderation tools.")
  .addSubcommand(cmd => cmd
    .setName("warn")
    .setDescription("warn a user, and log their infraction.")
    .addUserOption(option => option
      .setName("member")
      .setDescription("...just the server member to warn.")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("reason")
      .setDescription("...well, this is recommended to put in.")
    )
    .addBooleanOption(option => option
      .setName("notify")
      .setDescription("should I notify the user? Defaults to no.")
    )
  )
  .addSubcommand(cmd => cmd
    .setName("ban")
    .setDescription("ban a user, and log it to their infraction data.")
    .addUserOption(option => option
      .setName("member")
      .setDescription("...just the server member to ban.")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("reason")
      .setDescription("...well, this is now enforced.")
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("clear")
    .setDescription("clear messages in this channel.")
    .addIntegerOption(option => option
      .setName("number")
      .setDescription("...just the number of messages to delete. Max 99, least 1.")
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("wipe")
    .setDescription("deletes a channel, then clone that channel with NO CONTENT in it.")
    .addChannelOption(option => option
      .setName("channel")
      .setDescription("...literally the channel to wipe.")
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("kick")
    .setDescription("kick a user, and log it to their infraction data.")
    .addUserOption(option => option
      .setName("member")
      .setDescription("...just the server member to kick.")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("reason")
      .setDescription("...well, this is now enforced.")
      .setRequired(true)
    )
  )

const osugame = new SlashCommandBuilder()
  .setName("osu")
  .setDescription("the bizzare game that you react to whatever appears on the screen.")
  .addSubcommand(cmd => cmd
    .setName("set")
    .setDescription("sets your in-game name and main gamemode.")
    .addStringOption(option => option
      .setName("username")
      .setDescription("your in-game name")
      .setRequired(true)  
    )  
    .addStringOption(option => option
      .setName("mode")
      .setDescription("your main gamemode")
      .setRequired(true)  
      .addChoices(...[
        { name: "standard", value: "0" },
        { name: "taiko", value: "1" },
        { name: "catch", value: "2" },
        { name: "mania", value: "3" }
      ])
    )
  )
  .addSubcommand(cmd => cmd
    .setName("profile")
    .setDescription("check out your in-game profile")
    .addStringOption(option => option.setName("username").setDescription("your in-game username. Not required if you have one saved"))
    .addStringOption(option => option
      .setName("mode")
      .setDescription("the mode you wish to check out. Not required if you have one saved")
      .addChoices(...[
        { name: "standard", value: "0" },
        { name: "taiko", value: "1" },
        { name: "catch", value: "2" },
        { name: "mania", value: "3" }
      ])
    )
  )

const social = new SlashCommandBuilder()
  .setName("social")
  .setDescription("collecting some yens, buying some stuff, all that.")
  .addSubcommand(cmd => cmd
    .setName("register")
    .setDescription("if you don't have a bank account yet, start here.")  
  )
  .addSubcommand(cmd => cmd
    .setName("daily")
    .setDescription("claim your daily allowance.")  
  )
  .addSubcommand(cmd => cmd
    .setName("deposit") 
    .setDescription("deposit money from your pocket to the bank.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("the amount you want to deposit.")
      .setRequired(true)
    ) 
  )
  .addSubcommand(cmd => cmd
    .setName("withdraw") 
    .setDescription("withdraw money from your bank to your pocket.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("the amount you want to withdraw.")
      .setRequired(true)
    ) 
  )
  .addSubcommand(cmd => cmd
    .setName("bank")
    .setDescription("see how much you currently possess.")  
  )
  .addSubcommand(cmd => cmd
    .setName("transfer")
    .setDescription("transfer money to other people.")
    .addIntegerOption(option => option
      .setName("amount")
      .setDescription("the amount you want to transfer")
      .setRequired(true)  
    )  
    .addUserOption(option => option
      .setName("user")
      .setDescription("whoever will receive this money.")
      .setRequired(true)
    )
  )
  .addSubcommand(cmd => cmd
    .setName("store")
    .setDescription("check out what you can buy from the store.")  
  )
  .addSubcommand(cmd => cmd
    .setName("work")
    .setDescription("make money, buy things, make more money, buy more things.")  
  )
  .addSubcommand(cmd => cmd
    .setName("steal")
    .setDescription("steal money from people. Not intended, so much more strict when you fail.")
    .addUserOption(option => option
      .setName("user")
      .setDescription("the user you want to steal from. Could be anyone, this system is global.")
      .setRequired(true)  
    )  
    .addStringOption(option => option
      .setName("level")
      .setDescription("set the difficulty level of the mission. Defaults to Commit.")
      .addChoices(...[
        { name: "Snitch", value: "ez" },
        { name: "Commit", value: "normal" },
        { name: "Insane", value: "hard" }
      ])  
    )
  )
  .addSubcommand(cmd => cmd
    .setName("customize")
    .setDescription("customize your personal user card.")
    .addStringOption(option => option
      .setName("background")
      .setDescription("set the image on your card. Must end with JPG or PNG.")  
    )
    .addStringOption(option => option
      .setName("color")
      .setDescription("set the color tint on your profile. Must be in rgb format.")  
    )
  )
  .addSubcommandGroup(group => group
    .setName("piggy")
    .setDescription("start saving today.")
    .addSubcommand(cmd => cmd
      .setName("info")
      .setDescription("read the piggy bank information before opening one.")  
    )
    .addSubcommand(cmd => cmd
      .setName("open")
      .setDescription("open a piggy bank. Make sure your bank has more than ¥5,000.")  
    )  
    .addSubcommand(cmd => cmd
      .setName("withdraw")
      .setDescription("withdraw money from your piggy bank.")
      .addIntegerOption(option => option
        .setName("amount")
        .setDescription("the amount you want to withdraw")
        .setRequired(true)  
      )
      .addBooleanOption(option => option
        .setName("force")
        .setDescription("whether to force close the bank if piggy has less than ¥2,500.")
      )
    )
    .addSubcommand(cmd => cmd
      .setName("deposit")
      .setDescription("deposit money from your bank to the piggy bank.")
      .addIntegerOption(option => option
        .setName("amount")
        .setDescription("the amount you want to deposit.")
        .setRequired(true)  
      )
    )
    .addSubcommand(cmd => cmd
      .setName("paycheck")
      .setDescription("perform a monthly paycheck.")  
    )
  )

export { fun, util, my, anime, moderate, osugame, social };