const update = function(obj) {
  return this._creator.settings.members.update(`${this.guildID}.${this.user.id}`, obj);
}

const settings = function() {
  return this._creator.settings.members.get(`${this.guildID}.${this.user.id}`);
}

export default { update, settings };