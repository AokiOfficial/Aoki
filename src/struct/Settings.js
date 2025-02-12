// @ravener wrote the logics, check out his miyako discord app on github for this
import * as mongoose from 'mongoose';
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
  /**
   * @param {Object} client - The client instance.
   * @param {String} collection - The name of the collection.
   * @param {Object} defaults - Default settings for this collection.
   */
  constructor(client, collection, defaults = {}) {
    this.client = client;
    this.cache = new Map();
    this.collection = collection;
    this.defaults = defaults;

    // Create a flexible schema that stores an "id" and allows any other fields.
    const settingsSchema = new mongoose.Schema(
      {
        id: { type: String, required: true, unique: true }
      },
      { strict: false, versionKey: false }
    );

    // For the "verifications" collection, add a createdAt field and a TTL index.
    if (collection === 'verifications') {
      settingsSchema.add({
        createdAt: { type: Date, default: Date.now }
      });
      settingsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
    }

    // Use an existing model if available to avoid OverwriteModelError
    this.model =
      mongoose.models[collection] ||
      mongoose.model(collection, settingsSchema, collection);
  }

  /**
   * Retrieve a document from the cache by its id.
   * @param {String} id 
   * @returns {?Object}
   */
  get(id) {
    return this.cache.get(id);
  }

  /**
   * Update a document by its id. If it doesn’t exist, it is created.
   * @param {String} id 
   * @param {Object} obj - Object with key-value changes.
   * @returns {Object} The updated document.
   */
  async update(id, obj) {
    if (typeof obj !== 'object') {
      throw new Error('Expected an object.');
    }

    // findOneAndUpdate: upsert if not found, return the new document,
    // remove _id, and return a plain JavaScript object via lean().
    const updatedDoc = await this.model
      .findOneAndUpdate({ id }, { $set: obj }, { upsert: true, new: true })
      .select('-_id')
      .lean();

    const merged = this.mergeDefault(this.defaults, updatedDoc);
    this.cache.set(id, merged);
    return merged;
  }

  /**
   * Sync a document from the database to the cache.
   * @param {String} id 
   * @returns {Object} The fetched document.
   */
  async sync(id) {
    const doc = await this.model.findOne({ id }).select('-_id').lean();
    if (!doc) return;
    const merged = this.mergeDefault(this.defaults, doc);
    this.cache.set(id, merged);
    return merged;
  }

  /**
   * Delete a document by its id.
   * @param {String} id 
   */
  async delete(id) {
    await this.model.deleteOne({ id });
    this.cache.delete(id);
  }

  /**
   * Alias for model.find(...)
   */
  find(...args) {
    return this.model.find(...args);
  }

  /**
   * Alias for model.findOne(...)
   */
  findOne(...args) {
    return this.model.findOne(...args);
  }

  /**
   * Returns the document from the cache if it exists, otherwise returns the default values.
   * @param {String} id 
   */
  getDefaults(id) {
    return this.cache.get(id) || this.defaults;
  }

  /**
   * Load all documents from the database into the cache.
   * Call this before the client is fully ready.
   */
  async init() {
    const docs = await this.model.find({}).select('-_id').lean();

    // For the "verifications" collection, ensure the TTL index exists.
    if (this.collection === 'verifications') {
      await this.model.collection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 3600 }
      );
    }

    for (const doc of docs) {
      this.cache.set(doc.id, this.mergeDefault(this.defaults, doc));
    }
  }

  /**
   * Recursively applies default properties to an object.
   * @param {Object} def - Default properties.
   * @param {Object} given - Object to apply defaults to.
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
  }
}
