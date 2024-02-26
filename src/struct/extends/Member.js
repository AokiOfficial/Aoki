import PermissionsBitField from "../discord/PermissionsBitField";

const update = function(obj) {
  return this.client.settings.members.update(`${this.raw.guildID}.${this.raw.user.id}`, obj);
}

const settings = function() {
  return this.client.settings.members.get(`${this.raw.guildID}.${this.raw.user.id}`);
}

const syncSettings = function() {
  return this.client.settings.members.sync(`${this.raw.guildID}.${this.raw.user.id}`);
}

const syncSettingsCache = function() {
  if (!this.client.settings.members.cache.has(`${this.raw.guildID}.${this.raw.user.id}`)) return this.syncSettings();
}

const permissions = async function() {
  // fetch guild
  const { owner_id } = await this.client.util.call({
    method: "guild",
    param: [this.raw.guildID]
  });
  if (this.raw.user.id == owner_id) return new PermissionsBitField(PermissionsBitField.All).freeze();
  return new PermissionsBitField(this.raw.permissions).freeze();
}

export default { update, settings, syncSettings, syncSettingsCache, permissions };