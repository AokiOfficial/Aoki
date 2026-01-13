import { meta } from "@assets/cmdMeta";
import AokiError from "@struct/AokiError";
import {
  CommandContext,
  createStringOption,
  Declare,
  Group,
  Locales,
  Options,
  SubCommand
} from "seyfert";

const options = {
  slot: createStringOption({
    description: 'the slot to remove the map from',
    description_localizations: meta.osu.mappool.disprove.slot,
    required: true
  })
};

@Declare({
  name: 'disprove',
  description: 'remove a map from the current round\'s mappool.'
})
@Locales(meta.osu.mappool.disprove.loc)
@Group('mappool')
@Options(options)
export default class Disprove extends SubCommand {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const t = ctx.t.get(ctx.interaction.user.settings.language).osu.mappool.disprove;
    let slot = ctx.options.slot.toUpperCase();

    await ctx.deferReply();

    // Get tournament settings
    const guild = await ctx.client.guilds.fetch(ctx.guildId!);
    const settings = guild.settings.tournament;
    if (!settings.name) {
      return AokiError.NOT_FOUND({
        sender: ctx.interaction,
        content: t.noTournament
      });
    }

    // Check permission - only hosts, advisors, and mappoolers can remove maps
    const permittedRoles = [
      ...settings.roles.host,
      ...settings.roles.advisor,
      ...settings.roles.mappooler
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

    // Check if the slot exists in the mappool
    const mapIndex = mappool.maps.findIndex(m => m.slot.toLowerCase() === slot.toLowerCase());
    if (mapIndex === -1) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.invalidSlot(slot, mappool.slots, currentRound)
      });
    }

    // Remove the map from the slot
    mappool.maps.splice(mapIndex, 1);

    await guild.update({
      tournament: settings
    });

    await ctx.editOrReply({
      content: t.mapRemoved(slot, currentRound)
    });
  }
}