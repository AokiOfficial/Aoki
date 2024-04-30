// no sql will be used anywhere else
// ravener wrote this code 4 years ago, I happened to keep it ^-^
// this is modified a bit to work with d1
// we're using workers d1, an open beta sql db for cfworkers
// which.. is sql, yeah
export default class Database {
  constructor(client, table) {
    this.client = client;
    this.table = table;
  }

  /**
   * Get an entry by ID from cache
   * @param {String} id - The ID to lookup the cache.
   * @returns {?Object} The document from the cache if available.
   */
  async get(id) {
    return await this.client.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?1;`).bind(id).all();
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
    // get keys and values
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    // construct the query
    const query = `INSERT INTO "${this.table}" ("id", ${
      keys.map((key) => `"${key}"`).join(", ")}) VALUES (?1, ${
      keys.map((_, i) => `?${i + 2}`).join(", ")}) ON CONFLICT ("id") DO UPDATE SET ${
      keys.map((key, i) => `"${key}" = ?${i + 2}`).join(", ")} RETURNING *;`;
    const { results: rows } = await this.client.db.prepare(query).bind(id, ...values).all();
    return rows[0];
  };
}