import { CommandContext, Declare, Embed, Locales, SubCommand } from "seyfert";
import os from "os";
import * as pkg from "../../../package.json";
import { meta } from "@assets/cmdMeta";

@Declare({
  name: "stats",
  description: "the nerdy statistics of how I'm working.",
})
@Locales(meta.my.stats.loc)
export default class Stats extends SubCommand {
  async run(ctx: CommandContext) {
    const t = ctx.t.get(ctx.interaction.user.settings.language).my.stats;

    // Defer reply since gathering stats might take time
    await ctx.deferReply();

    // Gather system stats
    const totalMemMB = os.totalmem() / 1024 / 1024;
    const freeMemMB = os.freemem() / 1024 / 1024;
    const usedMemMB = totalMemMB - freeMemMB;
    const processMemUsageMB = process.memoryUsage().rss / 1024 / 1024;
    const cpuLoad = os.loadavg()[0].toFixed(2);
    const uptimeHours = (os.uptime() / 3600).toFixed(2);

    const guilds = await ctx.client.guilds.list();
    const userCount = await Promise.all(
      guilds.map(async (guild) => (await guild.fetch()).memberCount || 0)
    ).then((counts) => counts.reduce((a, b) => a + b, 0));

    const clientUptime = ctx.client.utils.time.msToTimeString(Date.now() - ctx.client.startTime);

    const description = [
      `- **${t.desc.linKern}** v${os.release()}`,
      `- **${t.desc.nodeVer}** ${process.version}`,
      `- **${t.desc.seyfertVer}** v${pkg.dependencies.seyfert.replace("^", "")}`,
      `- **${t.desc.cpuType}**: ${os.cpus()[0].model} \`[${(os.cpus()[0].speed / 1000).toFixed(2) || t.desc.unknownClockSpeed} GHz]\``,
    ].join("\n");

    // Create formatted fields
    const techField = ctx.client.utils.string.keyValueField(
      {
        [t.systemField.ram]: `${totalMemMB.toFixed(2)}MB`,
        [t.systemField.free]: `${freeMemMB.toFixed(2)}MB`,
        [t.systemField.totalUsed]: `${usedMemMB.toFixed(2)}MB`,
        [t.systemField.procLoad]: `${processMemUsageMB.toFixed(2)}MB`,
        [t.systemField.cpuLoad]: `${cpuLoad}%`,
        [t.systemField.sysUp]: `${uptimeHours}h`,
      },
      25
    );

    const appField = ctx.client.utils.string.keyValueField(
      {
        [t.appField.cliVer]: pkg.version,
        [t.appField.cliUp]: clientUptime,
        [t.appField.cmdCount]: `${ctx.client.commands.values.length}`,
        [t.appField.srvCount]: `${guilds.length}`,
        [t.appField.usrCount]: `${userCount}`,
        [t.appField.usrOnSrvRatio]: `${(userCount / guilds.length).toFixed(2)}`,
      },
      25
    );

    // Create embed
    const embed = new Embed()
      .setColor(10800862)
      .setAuthor({ name: t.author, iconUrl: ctx.client.me!.avatarURL() })
      .setDescription(description)
      .setFooter({ text: t.footer })
      .addFields([
        { name: t.system, value: techField, inline: true },
        { name: t.app, value: appField, inline: true },
      ])
      .setTimestamp();

    // Send response
    await ctx.editOrReply({ embeds: [embed] });
  }
}
