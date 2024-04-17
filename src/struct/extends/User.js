const settings = function() {
  return this._creator.settings.users.get(this.id);
}

const update = function(obj) {
  return this._creator.settings.users.update(this.id, obj);
}

export default { settings, update };