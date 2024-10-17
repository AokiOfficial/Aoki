// @ravener wrote the logics, check out his miyako discord app on github for this
/**
 * Manages settings for a specific table.
 * To make sure the cache is in sync methods from here must be used.
 * 
 * @example
 * // Add a new settings instance for each table to manage in client
 * this.settings = new Settings(this, "guilds");
 * // Then use it anywhere
 * this.client.settings[prop].update({ ... });
 */
export default class Settings {
  constructor(client, collection, defaults = {}) {
    this.client = client;
    this.cache = new Map();
    this.collection = collection;
    this.defaults = defaults;
  };
  /**
   * Get an entry by ID from cache.
   * @param {String} id - The ID to lookup the cache.
   * @returns {?Object} The document from the cache if available.
   */
  get(id) {
    return this.cache.get(id);
  };
  /**
   * Updates settings for the table this settings instance manages.
   * 
   * The input is safe for upserts. If the document does not exist it inserts it.
   * @example
   * update(id, { something: true, another_thing: [] });
   * @param {String} id - The ID of the document to update.
   * @param {Object} obj - An object with key-value changes to apply.
   * @returns {Object} The updated object from the database.
   */
  async update(id, obj) {
    if (typeof obj !== "object") throw new Error("Expected an object.");
    const value = await this.client.db.collection(this.collection).findOneAndUpdate({ id }, { $set: obj }, {
      upsert: true,
      // https://mongodb.github.io/node-mongodb-native/6.8/interfaces/FindOneAndUpdateOptions.html#returnDocument
      // the importance of reading documentations
      returnDocument: 'after',
      projection: { _id: 0 }
    });
    this.cache.set(id, this.mergeDefault(this.defaults, value));
    return value;
  };
  /**
   * Syncs the cache with the database.
   * Use this in case the cache becomes outdated.
   * @param {String} id - ID of the document to sync.
   * @returns {Object} The newly fetched data from the database.
   */
  async sync(id) {
    const doc = await this.client.db.collection(this.collection).findOne({ id }, { projection: { _id: 0 } });
    if (!doc) return;
    this.cache.set(id, this.mergeDefault(this.defaults, doc));
    return doc;
  };
  /**
   * Deletes a document with the given ID.
   * @param {String} id - ID of the document to delete.
   */
  async delete(id) {
    await this.client.db.collection(this.collection).deleteOne({ id });
    this.cache.delete(id);
  };
  /**
   * Alias to db.collection(col).find(...)
   */
  find(...args) {
    return this.client.db.collection(this.collection).find(...args);
  };
  /**
   * Alias to db.collection(col).findOne(...)
   */
  findOne(...args) {
    return this.client.db.collection(this.collection).findOne(...args);
  };
  /**
  * Return cache if available, else return the default values.
  */
  getDefaults(id) {
    return this.cache.get(id) || this.defaults;
  }
  /**
   * Initializes this settings by loading the cache.
   * Call this before the client is logged in.
   */
  async init() {
    const docs = await this.client.db
      .collection(this.collection)
      .find({}, { projection: { _id: 0 } })
      .toArray();

    // set verification collection ttl to 1h
    if (this.collection == "verifications") await this.client.db
      .collection(this.collection)
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

    for (const doc of docs) this.cache.set(doc.id, this.mergeDefault(this.defaults, doc));
  };
  // discord late v14 removed this bit of utility
  // bringing back for local use because this method is pretty good for our use case
  /**
   * Sets default properties on an object that aren't already specified.
   * @param {Object} def Default properties
   * @param {Object} given Object to assign defaults to
   * @returns {Object}
   */
  mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
      if (!Object.hasOwn(given, key) || given[key] === undefined) {
        given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
        given[key] = this.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  };
};