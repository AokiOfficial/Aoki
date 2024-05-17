const getSettings = async function() {
  return await this._creator.settings.users.get(this.id);
}

const update = function(obj) {
  return this._creator.settings.users.update(this.id, obj);
}

export default { getSettings, update };