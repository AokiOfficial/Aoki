import { Schedule } from "../assets/const/graphql";
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
   * Initialize the scheduler
   * @returns `void`
   */
  async init() {
    /**
     * [
     *   {
     *     "id": "91275343627819",
     *     "channelId": "9283662783623525",
     *     "anilistId": "21",
     *     "episode": "1100"
     *   }, {...}, {...}, ...
     * ]
     */
    const { results: schedules } = await this.client.db.prepare("SELECT * FROM guilds;").all();
    if (!schedules) return;
    // <--> map IDs
    let watched = [], episode = [], page = 0;
    for (const schedule of schedules) { 
      watched.push(schedule.anilistId);
      episode.push(schedule.nextEp);
    };
    // <--> clean up duplicates
    watched = [...new Set(watched)];
    episode = [...new Set(episode)];
    // <--> perform the request
    const { data } = await this.fetch(this.schedule, { page, watched, episode });
    for (const schedule of schedules) {
      // <--> filter needed data
      const filtered = data.Page.airingSchedules.filter(entry => {
        if (entry.episode == schedule.nextEp && entry.media.id == schedule.anilistId) return true;
      });
      if (!filtered || !filtered.length) continue;
      else {
        const date = new Date(filtered[0].airingAt * 1000);
        const embed = this._makeAnnouncementEmbed(filtered[0], date);
        await this.client.util.call({
          method: "channelMessages",
          param: [schedule.channelID]
        }, {
          method: "POST",
          body: { embeds: [embed.toJSON()] }
        });
        await this.client.db.prepare("UPDATE guilds SET nextEp = ?1 WHERE id = ?2;").bind(schedule.nextEp + 1, schedule.id).all();
      };
    };
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

    return new EmbedBuilder()
      .setColor(this.client.util.color)
      .setThumbnail(entry.media.coverImage.large)
      .setAuthor({ name: 'AniSchedule' })
      .setTimestamp(date)
      .setDescription(`${[
        `Episode **${entry.episode}** of **[${entry.media.title.romaji}](${entry.media.siteUrl})**`,
        `${entry.media.episodes === entry.episode ? ' **(Final Episode)** ' : ' '}`,
        `has just aired.${watch ? `\n\nWatch: ${watch}` : '*None yet*'}${visit ? `\n\nVisit: ${visit}` : '*None yet*'}`,
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