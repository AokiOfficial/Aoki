import { MessageFlags } from "discord-api-types/v10";

export default {
  execute: async ctx => {
    // define util
    const util = ctx.creator.util;
    // define settings
    const settings = ctx.user.settings;
    // define what option is selected
    const option = ctx.values[0];
    // if they picked ignore don't do anything
    if (option.toLowerCase() == "ignore") return;
    // find the option from the store json
    const storeEntry = ((await util.getStatic("store")).filter(obj => { return obj.name.toLowerCase() == option.toLowerCase() }))[0];
    // get the price
    const productPrice = storeEntry.price;
    // if they don't have a bank yet
    if (!settings || !settings.bankOpened) return await ctx.send({ content: "Baka, you don't have a bank account yet. Do `/social register` to make one.", flags: MessageFlags.Ephemeral });
    // if they don't have enough pocket money
    if (settings.pocketBalance < productPrice) return await ctx.send({ content: "Baka, you don't have enough pocket money to buy that. Withdraw from your bank, or work some more.", flags: MessageFlags.Ephemeral });
    // define properties
    let pocket = settings.pocketBalance;
    let productsOwned = settings.owns ? settings.owns.split(",") : [];
    // if they already owned the product
    if (productsOwned.includes(`${storeEntry.type}.${storeEntry.id}`)) return await ctx.send({ content: "Baka, you have already purchased this product.", flags: MessageFlags.Ephemeral });
    // deduct money and add the item
    pocket -= productPrice;
    productsOwned.push(`${storeEntry.type}.${storeEntry.id}`);
    // convert products owned to string to store
    productsOwned = productsOwned.join(",");
    // store data
    // check what type have they bought, and set it along for them
    if (storeEntry.type == 0) {
      await ctx.user.update({ pocketBalance: pocket, owns: productsOwned, emblem: storeEntry.preview });
    } else if (storeEntry.type == 1) {
      await ctx.user.update({ pocketBalance: pocket, owns: productsOwned, pattern: storeEntry.preview });
    };
    // reply
    await ctx.send({ content: `Successfully purchased **${util.toProperCase(option)}**. Check it out by doing \`/utility profile\`.`, flags: MessageFlags.Ephemeral });
  }
}