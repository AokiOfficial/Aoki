import { meta } from "@assets/cmdMeta";
import AokiError from "@struct/AokiError";
import {
  CommandContext,
  Declare,
  Group,
  Locales,
  SubCommand
} from "seyfert";

@Declare({
  name: 'export',
  description: 'Export the finalized mappool as a JSON list.'
})
@Locales(meta.osu.mappool.export.loc)
@Group('mappool')
export default class Export extends SubCommand {
  async run(ctx: CommandContext): Promise<void> {
    const t = ctx.t.get(ctx.interaction.user.settings.language).osu.mappool.export;
    await ctx.deferReply();

    // Fetch tournament settings
    const guild = await ctx.client.guilds.fetch(ctx.guildId!);
    const settings = guild.settings.tournament;

    if (!settings.name) {
      return AokiError.NOT_FOUND({
        sender: ctx.interaction,
        content: t.noTournament
      });
    }

    // Check user permissions
    const permittedRoles = [
      ...settings.roles.host,
      ...settings.roles.advisor,
      ...settings.roles.mappooler,
      ...settings.roles.testReplayer
    ];
    const userRoles = (await ctx.interaction.member!.roles.list()).map(role => role.id);
    const hasPermittedRole = permittedRoles.some(roleId => userRoles.includes(roleId));

    if (!hasPermittedRole) {
      return AokiError.PERMISSION({
        sender: ctx.interaction,
        content: t.noPermission
      });
    }

    // Check if a current round is set
    const { currentRound, mappools } = settings;
    if (!currentRound) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.noActiveRound
      });
    }

    // Find the mappool for the current round
    const mappool = mappools.find(mp => mp.round === currentRound);
    if (!mappool) {
      return AokiError.NOT_FOUND({
        sender: ctx.interaction,
        content: t.noMappool(currentRound)
      });
    }

    // Check if there are any confirmed maps
    if (!mappool.maps || mappool.maps.length === 0) {
      return AokiError.NOT_FOUND({
        sender: ctx.interaction,
        content: t.noMaps(currentRound)
      });
    }

    // Sort maps by slot
    function sortBySlot(mapDetails: string[], desiredOrder: string[]): string[] {
      return mapDetails.sort((a, b) => {
        const getSlot = (str: string) => {
          const match = str.match(/([A-Z]+[0-9]*)/);
          return match ? match[1] : "";
        };

        const slotA = getSlot(a);
        const slotB = getSlot(b);

        const idxA = desiredOrder.indexOf(slotA);
        const idxB = desiredOrder.indexOf(slotB);

        return idxA - idxB;
      });
    }

    const sortedMaps = sortBySlot(
      mappool.maps.map(map => map.slot),
      mappool.slots
    );

    // Create JSON list
    const jsonList = sortedMaps.reduce((acc: Record<string, string>, slot) => {
      const map = mappool.maps.find(m => m.slot === slot);
      if (map) {
        acc[slot] = map.url.split('/').pop()!;
      }
      return acc;
    }, {} as Record<string, string>);

    // Send JSON as a response
    await ctx.editOrReply({
      content: `\`\`\`json\n${JSON.stringify(jsonList, null, 2)}\n\`\`\``
    });
  }
}