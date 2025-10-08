import { meta } from "@assets/cmdMeta";
import AokiError from "@struct/AokiError";
import {
  CommandContext,
  Declare,
  Embed,
  Group,
  Locales,
  SubCommand
} from "seyfert";

@Declare({
  name: 'view',
  description: 'view the finalized mappool for the current round.'
})
@Locales(meta.osu.mappool.view.loc)
@Group('mappool')
export default class View extends SubCommand {
  async run(ctx: CommandContext): Promise<void> {
    const t = ctx.t.get(ctx.interaction.user.settings.language).osu.mappool.view;
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

    // Fetch all beatmap details and create description
    const mapDetails = [];
    for (const map of mappool.maps) {
      try {
        const difficultyId = ctx.client.utils.osu.extractDifficultyId(map.url);
        
        if (!difficultyId) {
          // Check if the URL is a Discord CDN URL
          const discordCdnRegex = /^https:\/\/cdn\.discordapp\.com\//;
          if (discordCdnRegex.test(map.url)) {
            mapDetails.push(t.discordCdnMap(map.slot, map.url));
          } else {
            // Handle custom URLs
            mapDetails.push(t.customMap(map.slot, map.url));
          }
          continue;
        }

        const beatmap = await ctx.client.utils.osu.fetchBeatmapInfo(ctx.client, difficultyId);
        if (beatmap) {
          const slot = map.slot;
          const artist = beatmap.beatmapset.artist_unicode;
          const title = beatmap.beatmapset.title;
          const version = beatmap.version;
          const url = beatmap.url;
          let od, sr, bpm;

          // Taiko-specific attributes
          const diffAttr = async (diffId: string, mods: (number | string)[]) => {
            try {
              const response = await fetch(`https://osu.ppy.sh/api/v2/beatmaps/${diffId}/attributes`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${await ctx.client.requestV2Token()}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({ mods })
              });
              return await response.json();
            } catch (error) {
              console.error(`Failed to fetch beatmap attributes for ${diffId}:`, error);
              return null;
            }
          };

          const mods = [];
          if (map.slot.includes("HR")) mods.push("HR");
          if (map.slot.includes("DT") || map.slot.includes("NC")) mods.push("DT");

          const attr = mods.length > 0 ? await diffAttr(difficultyId, mods) : null;

          od = mods.includes("HR")
            ? parseFloat((Math.floor(Math.min(beatmap.accuracy * 1.4, 10) * 100) / 100).toFixed(2)).toString()
            : mods.includes("DT")
              ? parseFloat((Math.floor(((50 - ((50 - 3 * beatmap.accuracy) / 1.5)) / 3) * 100) / 100).toFixed(2)).toString()
              : parseFloat((Math.floor(beatmap.accuracy * 100) / 100).toFixed(2)).toString();

          sr = attr
            ? parseFloat((Math.floor(attr.attributes.star_rating * 100) / 100).toFixed(2)).toString()
            : parseFloat((Math.floor(beatmap.difficulty_rating * 100) / 100).toFixed(2)).toString();

          bpm = mods.includes("DT")
            ? parseFloat((beatmap.bpm * 1.5).toFixed(2)).toString()
            : parseFloat(beatmap.bpm.toFixed(2)).toString();

          const totalTime = Math.floor(beatmap.total_length / 60) + ":" + (beatmap.total_length % 60).toString().padStart(2, '0');
          mapDetails.push(t.mapDetails(slot, artist, title, version, url, od, sr, bpm, totalTime));
        } else {
          mapDetails.push(t.mapUnavailable(map.slot, map.url));
        }
      } catch (error) {
        mapDetails.push(t.mapError(map.slot, map.url));
      }
    }

    const srValues = mapDetails
      .map(detail => {
        const match = detail.match(/<:star:\d+>\`([\d.]+)\`/);
        return match ? Number(match[1]) : null;
      })
      .filter(sr => sr !== null);

    const highestSr = Math.max(...srValues);
    const lowestSr = Math.min(...srValues);

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
    };

    // Use the function before creating the embed
    const sortedMapDetails = sortBySlot(mapDetails, mappool.slots);

    const preDesc = [
      t.someInfo,
      `- ${t.totalMaps(sortedMapDetails.length)}`,
      `- ${t.srRange(highestSr, lowestSr)}\n`,
    ].join("\n");

    // Create a single embed with all maps
    const embed = new Embed()
      .setTitle(t.embedTitle(currentRound))
      .setDescription(preDesc + sortedMapDetails.join('\n'))
      .setColor(10800862)
      .setTimestamp();

    // Send the embed
    await ctx.editOrReply({ embeds: [embed] });
  }
}
