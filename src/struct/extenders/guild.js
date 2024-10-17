/**
 * Get a guild's settings
 * @returns `void`
 */
const settings = function () {
  return this.client.settings.guilds.getDefaults(this.id);
};
/**
 * Update a guild's settings
 * @param {Object} obj The object of database entries to update
 * @returns `void`
 */
const update = function (obj) {
  return this.client.settings.guilds.update(this.id, obj);
};

export {
  settings,
  update
};
