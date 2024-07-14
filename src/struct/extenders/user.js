/**
 * Get a global user's settings
 * @returns `void`
 */
const settings = function () {
  return this.client.settings.users.getDefaults(this.id);
};
/**
 * Check if this user is the bot owner
 * @returns {Boolean}
 */
const owner = function () {
  return this.id === this.client.config.owners;
};
/**
 * Check if this user has voted today
 * @returns `void`
 */
const voted = async function () {
  const userId = this.id;
  return fetch(`https://top.gg/api/bots/${this.client.user.id}/check`, {
    query: { userId },
    headers: { Authorization: process.env.DBL_TOKEN }
  })
  .then(res => res.json())
  .then(({ voted }) => Boolean(voted));
};
/**
 * Check whether this user has already set up AniSchedule
 * @returns `Boolean`
 */
const getSchedule = function() {
  return this.client.settings.schedules.findOne({ id: this.id });
};
const setSchedule = function(obj) {
  return this.client.settings.schedules.update(this.id, obj);
}
/**
 * Update a user's settings
 * @param {Object} obj The object of database entries to update
 * @returns `void`
 */
const update = function (obj) {
  return this.client.settings.users.update(this.id, obj);
};

export {
  settings,
  owner,
  update,
  voted,
  getSchedule,
  setSchedule
};
