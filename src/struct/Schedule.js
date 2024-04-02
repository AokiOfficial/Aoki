// big feature
// before anything we're going to stumble through a few problems when drafting
/**
 * 1: there's no long setTimeout() on cfworkers, because of course
 * 2: d1 database is a mystery
 * 3: we have a limit of 50 subrequests on the free plan
 */
// for issue 1, we can use cron jobs each 30 minutes
// for issue 2, we use the most simple methods to ensure accuracy
// for issue 3... first, optimizations; second, ask cf for limit increase; and third, lock this to premium until then
import { Channel } from "yor.ts";
import { Schedule } from "../assets/const/graphql";
import { formatDuration } from "date-fns";
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
    return await fetch('https://graphql.anilist.co', {
      method: "POST",
      body: JSON.stringify({
        query: query,
        variables: variables
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(async res => await res.json());
  };
  /**
   * Initialize the scheduler
   * @returns `void`
   */
  async init() {
    // fetch all schedules set
    // result format:
    /**
     * [
     *   {
     *     "id": "91275343627819",
     *     "channelId": "9283662783623525",
     *     "anilistId": "21", // One Piece
     *     "episode": "1100",
     *     "beta": true
     *   }, {...}, {...}, ...
     * ]
     */
    const { results: schedules } = await this.ctx.client.db.prepare("SELECT * FROM guilds;").all();
    // if there's nothing don't do anything
    if (!schedules) return;
    // map all ids to an array
    // we'll request with this array
    // TODO: implement pagination
    let watched = [], episode = [], page = 0;
    for (const schedule of schedules) { 
      // push all media ids in an array
      watched.push(schedule.anilistId);
      // push all needed episodes info
      episode.push(schedule.nextEp);
    };
    // clean up duplicates
    watched = [...new Set(watched)];
    episode = [...new Set(episode)];
    // perform the request
    const { data } = await this.fetch(this.schedule, { page, watched, episode });
    // iterate through the schedule list
    for (const schedule of schedules) {
      // filter the data to see which one we need to check out
      const filtered = data.airingSchedules.filter(entry => {
        if (entry.episode == schedule.episode && entry.media.id == schedule.anilistId) return true;
      });
      // if the filtered array has nothing
      // that means the episode is not airing yet
      // we simply ignore this schedule, move to the next
      if (!filtered) continue;
      // else that means the episode is airing
      else {
        // define date
        const date = new Date(filtered[0].airingAt * 1000);
        // make an embed
        const embed = this._makeAnnouncementEmbed(filtered[0], date);
        // initialize a new channel
        // fetch the channel first then init a class to send messages
        let channel = await this.client.util.call({ method: "channel", param: [schedule.channelId] });
        channel = new Channel(this.client, channel);
        // send the embed in that channel
        channel.send({ embeds: [embed] });
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

    const durationInSeconds = entry.media.duration * 60;
    const formattedDuration = formatDuration({ seconds: durationInSeconds }, { format: ['hours', 'minutes'] });

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
          `${entry.media.format ? `Format: ${this.settings.mediaFormat[entry.media.format] || 'Unknown'}` : ''}`,
          `${entry.media.duration ? `Duration: ${formattedDuration}  ` : ''}`,
          `${!!entry.media.studios.edges.length ? `Studio: ${entry.media.studios.edges[0].node.name}` : ''}`
        ].filter(Boolean).join('  •  ')
      });
  };
}