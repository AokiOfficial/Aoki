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
  )
  .addSubcommand(cmd => cmd
    .setName("catfact")
    .setDescription("gives you a fact about cats... which you might not know.")
  )
  .addSubcommand(cmd => cmd
    .setName("dogfact")
    .setDescription("gives you a fact about dogs... which you might not know.")
  )
  .addSubcommand(cmd => cmd
    .setName("owo")
    .setDescription("owoify your message")
    .addStringOption(option => option
      .setName("query")
      .setDescription("the text you wanna owoify")
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
    .setDescription("dsplay this server's information.")
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

export { fun, util };