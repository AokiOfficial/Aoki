const settings = function() {
  return this.client.settings.guilds.get(this.id);
}

const syncSettings = function() {
  return this.client.settings.guilds.sync(this.id);
}

const schedules = async function() {
  const { results } = await this.client.db.prepare("SELECT * FROM guilds WHERE id = ?1;").bind(this.id).all();
  return results;
}

const wipe = function () {
  return this.client.settings.guilds.delete(this.id);
}

const update = function(obj) {
  return this.client.settings.guilds.update(this.id, obj);
}

export default { settings, syncSettings, update, schedules, wipe };