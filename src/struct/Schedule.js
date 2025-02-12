import { Schedule } from "../assets/const/graphql.js";
import { EmbedBuilder } from "@discordjs/builders";

export default class AniSchedule {
  constructor(client) {
    this.client = client;
    this.info = {
      mediaFormat: client.util.mediaFormat,
      months: client.util.months,
      defaultgenres: client.util.mediaGenres,
      langflags: client.util.langflags
    };
    this.schedule = Schedule;
  };
  /**
   * Fetch AniList data
   * @param {String} query GraphQL query
   * @param {String} variables Variables to insert into the GraphQL
   * @returns `Object` Request result
   */
  async fetch(query, variables) {
    return await this.client.util.anilist(query, variables);
  };
  /**
   * Run again after a set amount of time
   */
  reInit() {
    setTimeout(async () => await this.init(), 90000);
  };
  /**
   * Initialize the scheduler
   * @returns {Promise<void>}
   */
  async init() {
    /**
     * [
     *   {
     *     "id": "91275343627819",
     *     "anilistId": "21",
     *     "episode": "1100"
     *   }, {...}, {...}, ...
     * ]
     */
    // lean() is for read-only operations!
    const schedules = await this.client.settings.schedules.find({}).lean().exec().catch(() => []);
    if (!schedules?.length) return;
    // map IDs
    let watched = [], episode = [], page = 0;
    for (const schedule of schedules) {
      watched.push(schedule.anilistId);
      episode.push(schedule.nextEp);
    };
    // clean up duplicates
    watched = [...new Set(watched)];
    episode = [...new Set(episode)];
    // perform the request
    const { data } = await this.fetch(this.schedule, { page, watched, episode });
    // if data doesn't exist log it so we know
    if (!data) return this.client.util.warn('No data found for schedules.', '[AniSchedule]');
    for (const schedule of schedules) {
      // filter needed data
      const filtered = data.Page?.airingSchedules.filter(entry => {
        if (entry.episode == schedule.nextEp && entry.media.id == schedule.anilistId) return true;
      });
      if (!filtered || !filtered.length) continue;
      else {
        const date = new Date(filtered[0].airingAt * 1000);
        const embed = this._makeAnnouncementEmbed(filtered[0], date);
        const user = await this.client.users.fetch(schedule.id);
        await user.send({ embeds: [embed] });
        await user.setSchedule({ nextEp: schedule.nextEp + 1 });
      };
    };
    this.reInit();
  };
  /**
   * Embed a media object
   * @param {Object} entry The media entry with anime data
   * @param {Date} date 
   * @returns `discordjs#EmbedBuilder`
   */
  _makeAnnouncementEmbed(entry, date) {
    const sites = ['Amazon', 'Animelab', 'AnimeLab', 'Crunchyroll', 'Funimation', 'Hidive', 'Hulu', 'Netflix', 'Viz'];

    const watch = entry.media.externalLinks?.filter(x => sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    const visit = entry.media.externalLinks?.filter(x => !sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    const randomResponses = [
      'Not like I wanted to remind you or something.',
      'Sensei made me DM you. I didn\'t want to do that.',
      'Alright, me back to my routine.',
      'Whether you knew this or not is irrelevant. It is my job.',
      'Also, have you seen my sensei?',
      'Didn\'t expect to meet me, did you.'
    ];
    const pick = this.client.util.random(randomResponses);

    return new EmbedBuilder()
      .setColor(10800862)
      .setThumbnail(entry.media.coverImage.large)
      .setTitle('AniSchedule')
      .setTimestamp(date)
      .setDescription(`${[
        `You baka, episode **${entry.episode}** of **[${entry.media.title.romaji}](${entry.media.siteUrl})**`,
        `${entry.media.episodes === entry.episode ? ' **(it\'s the final episode)** ' : ' '}`,
        `is up. ${pick}${watch ? `\n\nWatch: ${watch}` : '*None yet*'}${visit ? `\n\nVisit: ${visit}` : '*None yet*'}`,
        `\n\nIt may take some time to appear on the above service(s).`
      ].join('')}`)
      .setFooter({
        text: [
          `${entry.media.format ? `Format: ${this.info.mediaFormat[entry.media.format] || 'Unknown'}` : ''}`,
          `${entry.media.duration ? `Duration: ${entry.media.duration + ' minutes' || 'Unknown'}` : ''}`,
          `${!!entry.media.studios.edges.length ? `Studio: ${entry.media.studios.edges[0].node.name}` : ''}`
        ].filter(Boolean).join('  •  ')
      });
  };
}
