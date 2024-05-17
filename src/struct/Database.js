// Ravener wrote this code 4 years ago, I happened to keep it ^-^
// you can find him on GitHub @Ravener, or on Discord @_ravener, he makes cool stuff
export default class Database {
  constructor(client, table) {
    this.client = client;
    this.table = table;
  };

  /**
   * Get an entry by ID
   * @param {String} id - The ID to lookup
   * @returns {?Object} The document if available
   */
  async get(id) {
    // as there's no caching for a short-lived process, we ignore the cache to keep requests at bay
    return (await this.client.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?1;`).bind(id).all()).results[0];
  };

  /**
   * Updates settings for the table this settings instance manages
   * 
   * The input is safe for upserts. If the document does not exist it inserts it
   * @param {String} id - The ID of the document to update
   * @param {Object} obj - An object with key-value changes to apply
   * @returns {Object} The updated object from the database
   */
  async update(id, obj) {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const query = `INSERT INTO "${this.table}" ("id", ${
      keys.map((key) => `"${key}"`).join(", ")}) VALUES (?1, ${
      keys.map((_, i) => `?${i + 2}`).join(", ")}) ON CONFLICT ("id") DO UPDATE SET ${
      keys.map((key, i) => `"${key}" = ?${i + 2}`).join(", ")} RETURNING *;`;
    const { results: rows } = await this.client.db.prepare(query).bind(id, ...values).all();
    return rows[0];
  };
}