import { YorInteractionComponent } from "yor.ts";
import { EmbedBuilder } from "@discordjs/builders";
import { MessageFlags } from "discord-api-types/v10";

// we have to put components inside yet another folder
// then import it for use in our Client.js
// there's no such thing as "events" here like d.js
// firstly, we define the id of the component
// then if we ever have to duplicate an entry, we check if it's coming from the specific type
// yor.ts supports both button and select menu
export default class Custom extends YorInteractionComponent {
  id = "store"
  execute = async ctx => {
    // define util
    const util = ctx.client.util;
    // define what option is selected
    // as this command has only one selection at a time, this is usable
    const option = ctx.raw.data.values[0];
    // send another embed
    // make it ephemeral
    if (option == "custom") {
      const custom = (await util.getStatic("store"))[1]
      const embed = new EmbedBuilder()
        .setAuthor({ name: "Nya Store | Custom Pattern", iconURL: util.getUserAvatar(ctx.member.raw.user) })
        .setTimestamp().setColor(util.color)
        .setFooter({ text: `Requested by ${ctx.member.raw.user.username} `})
        .setDescription(
          `***Description:** ${custom.description}*\n\n` +
          "**Info:** \n- Currently, there are **6 patterns** for sale in the store. However, you might not like all of them. \n- Sounds like you? Nice. My sensei does make custom ones for people who have demand for it, and you can request them to make one for you **without spending real money** (please confirm this first if anyone attempts to DM you!) \n- The pattern will be usable after 3-4 days of work.\n\n" +
          `**Price:** ¥150,000\n\n` +
          `**Use duration:** Indefinite`
        )
      // send it
      await ctx.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } else if (option == "request") {
      const custom = (await util.getStatic("store"))[0];
      const embed = new EmbedBuilder()
        .setAuthor({ name: "Nya Store | Custom Emblem", iconURL: util.getUserAvatar(ctx.member.raw.user) })
        .setTimestamp().setColor(util.color)
        .setFooter({ text: `Requested by ${ctx.member.raw.user.username} `})
        .setDescription(
          `***Description:** ${custom.description}*\n\n` +
          "**Info:** \n- Currently, there are **12 emblems** for sale in the store. However, you might not like all of them, because they're only related to Tsukumizu's works. \n- Sounds like you? Nice. My sensei does make custom ones for people who have demand for it, and you can request them to make one for you **without spending real money** (please confirm this first if anyone attempts to DM you!) \n- The emblem will be usable after 3-4 days of work.\n\n" +
          `**Price:** ¥150,000\n\n` +
          `**Use duration:** Indefinite`
        )
      // send it
      await ctx.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  }
}