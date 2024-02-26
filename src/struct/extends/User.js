const settings = function() {
  return this.client.settings.users.get(this.raw.id);
}

const update = function(obj) {
  return this.client.settings.users.update(this.raw.id, obj);
}

const syncSettings = function() {
  return this.client.settings.users.sync(this.raw.id);
}

const syncSettingsCache = function() {
  if (!this.client.settings.users.cache.has(this.raw.id)) return this.syncSettings();
}

export default { settings, update, syncSettings, syncSettingsCache };