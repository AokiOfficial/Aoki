import {
  EmbedBuilder,
  StringSelectMenuBuilder as MenuBuilder,
  StringSelectMenuOptionBuilder as MenuOptionBuilder,
  ActionRowBuilder
} from "@discordjs/builders";
import { MessageFlags } from "discord-api-types/v10";

export default {
  execute: async (ctx) => {
    // define util
    const util = ctx.creator.util;
    // define what option is selected
    // as this command has only one selection at a time, this is usable
    const option = ctx.values[0];
    // find the option from the store json
    // one liner issue
    const storeEntry = ((await util.getStatic("store")).filter(obj => { return obj.name.toLowerCase() == option }))[0];
    // make preset embed
    const preset = async function ({ item, description, image }) {
      // make select menu
      // if we make buttons users can misclick at it without confirm
      // so we make a select menu instead to "pseudo-confirm" - users click twice to buy
      const selectBuy = new MenuBuilder()
        .setCustomId("buy")
        .setPlaceholder("💰 Buy")
        .addOptions([
          new MenuOptionBuilder()
            .setLabel("Confirm Buy")
            .setDescription("To confirm your payment.")
            .setValue(`${storeEntry.name}`),
          new MenuOptionBuilder()
            .setLabel("Ignore")
            .setDescription("So you don't misclick.")
            .setValue("ignore")
        ]);
      const action = new ActionRowBuilder().addComponents(selectBuy);
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Nya Store | ${item}`, iconURL: util.getUserAvatar(ctx.user) })
        .setTimestamp().setColor(util.color)
        .setFooter({ text: `Requested by ${ctx.user.username}` })
        .setDescription(description)
        .setImage(image);
      return await ctx.send({
        embeds: [embed],
        components: [action],
        flags: MessageFlags.Ephemeral
      });
    };
    // send another embed
    // make it ephemeral
    if (option == "custom") {
      await preset({
        description:
          `***Description:** ${storeEntry.description}*\n\n` +
          "**Info:** \n- Currently, there are **6 patterns** for sale in the store. However, you might not like all of them. \n- Sounds like you? Nice. My sensei does make custom ones for people who have demand for it, and you can request them to make one for you **without spending real money** (please confirm this first if anyone attempts to DM you!) \n- The pattern will be usable after 3-4 days of work.\n\n" +
          `**Price:** ¥${storeEntry.price}\n\n` +
          `**Use duration:** Indefinite`,
        item: "Pattern",
        image: storeEntry.preview
      });
    } else if (option == "request") {
      await preset({
        description:
          `***Description:** ${storeEntry.description}*\n\n` +
          "**Info:** \n- Currently, there are **12 emblems** for sale in the store. However, you might not like all of them, because they're only related to Tsukumizu's works. \n- Sounds like you? Nice. My sensei does make custom ones for people who have demand for it, and you can request them to make one for you **without spending real money** (please confirm this first if anyone attempts to DM you!) \n- The emblem will be usable after 3-4 days of work.\n\n" +
          `**Price:** ¥${storeEntry.price}\n\n` +
          `**Use duration:** Indefinite`,
        item: "Emblem",
        image: storeEntry.preview
      });
    } else {
      await preset({
        description:
          `**Description:** ${storeEntry.description}\n` +
          `**Price:** ¥${storeEntry.price}\n` +
          `**Use duration:** Indefinite`,
        item: storeEntry.name,
        image: storeEntry.preview
      });
    }
  }
}