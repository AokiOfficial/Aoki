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
    description: 'the slot to add this map to',
    description_localizations: meta.osu.mappool.approve.slot,
    required: true
  }),
  url: createStringOption({
    description: 'the beatmap URL (or custom map URL)',
    description_localizations: meta.osu.mappool.approve.url,
    required: true
  })
};

@Declare({
  name: 'approve',
  description: 'approve a map and move it to the current round\'s finalized mappool.'
})
@Locales(meta.osu.mappool.approve.loc)
@Group('mappool')
@Options(options)
export default class Approve extends SubCommand {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const t = ctx.t.get(ctx.interaction.user.settings.language).osu.mappool.approve;
    const url = ctx.options.url;
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

    // Check permission - only hosts, advisors, and mappoolers can add maps
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
    if (!mappool.slots.includes(slot)) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.invalidSlot(slot, mappool.slots, currentRound)
      });
    }

    // Validate osu! URL format if it's an osu! map
    const fullUrlPattern = /^https?:\/\/osu\.ppy\.sh\/beatmapsets\/\d+#(?:osu|taiko|fruits|mania)\/\d+$/i;
    const shortUrlPattern = /^https?:\/\/osu\.ppy\.sh\/b\/\d+$/i;

    let fullRecognizer = url; // Default to the provided URL
    if (fullUrlPattern.test(url) || shortUrlPattern.test(url)) {
      // if it passes the url test, it is an osu! url
      // we can safely parse the output of this function
      const diffId = ctx.client.utils.osu.extractDifficultyId(url)!;
      const mapInfo = await ctx.client.utils.osu.fetchBeatmapInfo(ctx.client, diffId);

      if (!mapInfo) {
        return AokiError.API_ERROR({
          sender: ctx.interaction,
          content: t.fetchError
        });
      }

      fullRecognizer = `${mapInfo.beatmapset.artist} - ${mapInfo.beatmapset.title} [${mapInfo.version}]`;
    } else {
      fullRecognizer = t.customMap;
    };

    // Check if map already exists for this slot
    const existingMap = mappool.maps.find(m => m.slot === slot);
    if (existingMap) {
      // Update existing map
      existingMap.url = url;
      existingMap.fullRecognizer = fullRecognizer;

      await guild.update({
        tournament: settings
      });

      await ctx.editOrReply({
        content: t.mapUpdated(fullRecognizer, url, slot, currentRound)
      });
    } else {
      // Add new map
      mappool.maps.push({
        slot,
        url,
        fullRecognizer
      });

      await guild.update({
        tournament: settings
      });

      await ctx.editOrReply({
        content: t.mapAdded(fullRecognizer, url, slot, currentRound)
      });
    }
  }
}
