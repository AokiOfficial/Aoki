import { meta } from "@assets/cmdMeta";
import AokiError from "@struct/AokiError";
import {
  CommandContext,
  createStringOption,
  createBooleanOption,
  Declare,
  Group,
  Locales,
  Options,
  SubCommand
} from "seyfert";

const options = {
  round: createStringOption({
    description: 'the round name',
    description_localizations: meta.osu.tourney.add_round.round,
    required: true
  }),
  mod_picks: createStringOption({
    description: 'mod picks for the round (e.g. NM,HD,HR,DT)',
    description_localizations: meta.osu.tourney.add_round.mod_picks,
    required: true
  }),
  map_counts: createStringOption({
    description: 'number of maps for each mod pick (e.g. 3,2,2,2)',
    description_localizations: meta.osu.tourney.add_round.map_counts,
    required: true
  }),
  set_current: createBooleanOption({
    description: 'set this as the current active round',
    description_localizations: meta.osu.tourney.add_round.set_current,
    required: false
  })
};

@Declare({
  name: 'add-round',
  description: 'add a tournament round with mappool slots'
})
@Locales(meta.osu.tourney.add_round.loc)
@Group('tourney')
@Options(options)
export default class AddRound extends SubCommand {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const t = ctx.t.get(ctx.interaction.user.settings.language).osu.tourney.addRound;
    const { round, mod_picks: modPicksInput, map_counts: mapCountsInput, set_current: setCurrent = false } = ctx.options;

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

    // Validate mod picks and map counts
    const modPicks = modPicksInput.split(',').map(mod => mod.trim()).filter(mod => mod);
    const mapCounts = mapCountsInput.split(',').map(count => parseInt(count.trim(), 10)).filter(count => !isNaN(count));

    if (modPicks.length === 0 || mapCounts.length === 0 || modPicks.length !== mapCounts.length) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.invalidInput
      });
    }

    // Generate mappool slots
    const slots: string[] = [];
    modPicks.forEach((mod, index) => {
      const count = mapCounts[index];
      for (let i = 1; i <= count; i++) {
        slots.push(`${mod}${i}`);
      }
    });

    if (slots.length === 0) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.noSlots
      });
    }

    // Check if round already exists
    const existingMappool = settings.mappools.find(mp => mp.round === round);
    if (existingMappool) {
      return AokiError.USER_INPUT({
        sender: ctx.interaction,
        content: t.roundExists(round)
      });
    }

    // Create new mappool
    const newMappool = {
      round,
      slots,
      maps: [],
      replays: [],
      suggestions: []
    };

    // Update settings
    settings.mappools.push(newMappool);
    if (setCurrent) {
      settings.currentRound = round;
    }

    await guild.update({
      tournament: settings
    });

    await ctx.editOrReply({
      content: t.success(round, slots, setCurrent)
    });
  }
}
