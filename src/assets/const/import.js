import { SlashCommandBuilder } from "yor.ts/builders";

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
        { name: "Panik Kalm Panik", value: '226297822' },
        { name: "Always Has Been", value: '252600902' },
        { name: "Doge", value: '8072285' },
        { name: "Third World Skeptical Kid", value: '101288' }
      ])
      .setRequired(true)
    )
    .addStringOption(option => option.setName('top').setDescription('first text field (or top text)').setRequired(true))
    .addStringOption(option => option.setName("bottom").setDescription("second text field (or bottom text)").setRequired(true))
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

export { fun, util, my, anime, moderate };