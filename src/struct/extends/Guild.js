const settings = function() {
  return this.client.settings.guilds.get(this.id);
}

const syncSettings = function() {
  return this.client.settings.guilds.sync(this.id);
}

const update = function(obj) {
  return this.client.settings.guilds.update(this.id, obj);
}

export default { settings, syncSettings, update };