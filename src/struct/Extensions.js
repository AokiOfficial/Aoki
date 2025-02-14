// extends the base User and Guild class of discord.js to include custom properties and methods
// generally Object.defineProperties is a dangerous approach, but in this case it's fine since we're only adding getters and methods
// if you edit this, make sure you DO NOT override existing properties or methods of the library itself
import { User, Guild } from 'discord.js';
const _defProp = Object.defineProperties;

const userExtensions = {
  settings() {
    return this.client.settings.users.getDefaults(this.id);
  },
  get isOwner() {
    return this.id === this.client.config.owners;
  },
  async checkIfVoted() {
    const userId = this.id;
    return fetch(`https://top.gg/api/bots/${this.client.user.id}/check`, {
      query: { userId },
      headers: { Authorization: process.env.DBL_TOKEN }
    })
      .then(res => res.json())
      .then(({ voted }) => Boolean(voted));
  },
  getSchedule() {
    return this.client.settings.schedules.findOne({ id: this.id });
  },
  setSchedule(obj) {
    return this.client.settings.schedules.update(this.id, obj);
  },
  update(obj) {
    return this.client.settings.users.update(this.id, obj);
  }
};

const guildExtensions = {
  get settings() {
    return this.client.settings.guilds.getDefaults(this.id);
  },
  update(obj) {
    return this.client.settings.guilds.update(this.id, obj);
  }
};

_defProp(User.prototype, {
  settings: { get: function () { return userExtensions.settings.call(this); } },
  isOwner: { get: function () { return userExtensions.isOwner; } },
  checkIfVoted: { value: userExtensions.checkIfVoted },
  getSchedule: { value: userExtensions.getSchedule },
  setSchedule: { value: userExtensions.setSchedule },
  update: { value: userExtensions.update }
});

_defProp(Guild.prototype, {
  settings: { get: function () { return guildExtensions.settings.call(this); } },
  update: { value: guildExtensions.update }
});