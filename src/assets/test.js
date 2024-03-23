// a test command
// this use nothing complex
import { YorSlashCommand } from "yor.ts";
import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } from "@discordjs/builders"

// unlike server neko where we construct data options
// now we have to explicitly specify the builder and the execute context
// which is kinda inconvenient
export default class Test extends YorSlashCommand {
  builder = new SlashCommandBuilder()
    .setName("test")
    .setDescription("a test command")
    .addSubcommand(cmd => cmd 
      .setName("one")
      .setDescription("first test") 
    )
    .addSubcommand(cmd => cmd
      .setName("two")
      .setDescription("second test: return what you type")
      .addStringOption(option => option
        .setName("string")
        .setDescription("the string you want to repeat")
        .setRequired(true)
      )
    )
    .addSubcommand(cmd => cmd
      .setName("three")
      .setDescription("third test: multiple options to join")
      .addStringOption(option => option
        .setName("first")
        .setDescription("first string")
        .setRequired(true)  
      )
      .addStringOption(option => option
        .setName("second")
        .setDescription("second string")
        .setRequired(true)
      )
    )
    .addSubcommand(cmd => cmd
      .setName("user")
      .setDescription("user mention test")
      .addUserOption(option => option
        .setName("mention")
        .setDescription("the user")  
        .setRequired(true)
      )  
    )
    .addSubcommand(cmd => cmd
      .setName("role")
      .setDescription("role test")
      .addRoleOption(option => option
        .setName("mention")
        .setDescription("the role")  
        .setRequired(true)
      )  
    )
    .addSubcommand(cmd => cmd
      .setName("channel")
      .setDescription("channel mention test")
      .addChannelOption(option => option
        .setName("mention")
        .setDescription("the channel")  
        .setRequired(true)
      )  
    )
    .addSubcommandGroup(cmd => cmd
      .setName("group")
      .setDescription("group sub test")
      .addSubcommand(cmd => cmd
        .setName("one")
        .setDescription("first group test") 
      )  
      .addSubcommand(cmd => cmd
        .setName("two")
        .setDescription("second group test")
        .addStringOption(option => option
          .setName("string")
          .setDescription("string to repeat again, with options")
          .addChoices(...[
            { name: "str1", value: "str1" },
            { name: "str2", value: "str2" }
          ])  
          .setRequired(true)
        )
      )
    )
  execute = async (ctx) => {
    // get subcommand group info
    const group = ctx.getSubcommandGroup();
    // get subcommand info
    const sub = ctx.getSubcommand();
    if (!group) {
      if (sub == "one") {
        await ctx.defer();
        await ctx.editReply({ content: "Hi!" });
      } else if (sub == "two") {
        await ctx.defer();
        const string = ctx.getString("string");
        await ctx.editReply({ content: string });
      } else if (sub == "three") {
        await ctx.defer();
        const first = ctx.getString("first");
        const second = ctx.getString("second");
        await ctx.editReply({ content: (first + second) });
      } else if (sub == "user") {
        await ctx.defer();
        const user = await ctx.getUser("mention");
        console.log(user);
        await ctx.editReply({ content: `<@${user.id}>` });
      } else if (sub == "role") {
        await ctx.defer();
        const user = await ctx.getRole("mention");
        console.log(user);
        await ctx.editReply({ content: `<@${user.id}>` });
      } else if (sub == "channel") {
        await ctx.defer();
        const user = await ctx.getChannel("mention");
        console.log(user);
        await ctx.editReply({ content: `<@${user.id}>` });
      }
    } else if (group == "group") {
      if (sub == "one") {
        await ctx.defer();
        await ctx.editReply({ content: "Hi from a subcommandGroup!" });
      } else if (sub == "two") {
        await ctx.defer();
        const confirm = new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(1);
        const actionRow = new ActionRowBuilder().addComponents(confirm);
        const string = ctx.getString("string");
        await ctx.editReply({ content: string, components: [actionRow] });
      }
    }
  }
}
