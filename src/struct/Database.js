// no sql will be used anywhere else
// ravener wrote this code 4 years ago, I happened to keep it ^-^
// this is modified a bit to work with d1
// we're using workers d1, an open beta sql db for cfworkers
// which.. is sql, yeah
// we cannot use mongodb as cfworkers i/o rules does not allow us to do that 
export default class Database {
  constructor(client, table) {
    this.client = client;
    // k-v structure (key-value)
    // assumes we're using a standard id column
    this.cache = new Map();
    this.table = table;
  }

  /**
   * Get a guild by ID from cache.
   * @param {String} id - The ID to lookup the cache.
   * @returns {?Object} The document from the cache if available.
   */
  get(id) {
    return this.cache.get(id);
  }

  /**
   * Updates settings for the table this settings instance manages.
   * The input is safe for upserts. If the document does not exist it inserts it
   * @example
   * update(id, { levelup: false, social: true });
   * @param {String} id - The ID of the document to update
   * @param {Object} obj - An object with key-value changes to apply
   * @returns {Object} The updated object from the database
   */
  async update(id, obj) {
    // get keys and values
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    // construct the query
    // note: DO NOT use the dollar symbol! d1 does not support it yet
    // todo: return only 1 row when this gets big enough
    // for now we leave this here for debugging
    // to understand the logic do console.log(await db.prepare(query).bind(id, ...values))
    // it will log the completed query
    const query = `INSERT INTO "${this.table}" ("id", ${
      keys.map((key) => `"${key}"`).join(", ")}) VALUES (?1, ${
      keys.map((_, i) => `?${i + 2}`).join(", ")}) ON CONFLICT ("id") DO UPDATE SET ${
      keys.map((key, i) => `"${key}" = ?${i + 2}`).join(", ")} RETURNING *;`;
    // todo: check d1 docs again
    // this should be working
    const { results: rows } = await this.client.db.prepare(query).bind(id, ...values).all();
    this.cache.set(id, rows[0]);
    return rows[0];
  }

  /**
   * Syncs the cache with the database.
   * Use this in case the cache becomes outdated
   * @param {String} id - ID of the document to sync
   * @returns {Object} The newly fetched data from the database
   */
  async sync(id) {
    const { results: rows } = await this.client.db.prepare(`SELECT * FROM "${this.table}" WHERE id = ?1`).bind(id).all();
    if(!rows.length) return;
    this.cache.set(id, rows[0]);
    return rows[0];
  }

  /**
   * Deletes a document with the given ID.
   * @param {String} id - ID of the document to delete.
   */
  async delete(id) {
    await this.client.db.prepare(`DELETE FROM "${this.table}" WHERE id = ?1`).bind(id).all();
    this.cache.delete(id);
  }

  /**
   * @example
   * find({ where: { guild: "id", price: { gt: 25, lt: 100 } }, sort: { price: -1 }, limit: 5 })
   */
  find(options = {}) {
    let count = 1;
    const values = [];
    const where = options.where ? ` WHERE ${Object.entries(options.where).map(([k, v]) => {
      if(typeof v !== "object") {
        values.push(v);
        return `"${k}" = ?${count++}`;
      }

      if(v.like) {
        values.push(v.like);
        return `"${k}" LIKE ?${count++}`;
      }

      if(!isNaN(v.gt) && !isNaN(v.lt)) {
        values.push(v.gt);
        values.push(v.lt);

        count += 2;
        return `"${k}" > ?${count - 2} AND "${k}" < ?${count - 1}`;
      } else if(!isNaN(v.gt)) {
        values.push(v.gt);
        return `"${k}" > ?${count++}`;
      } else if(!isNaN(v.lt)) {
        values.push(v.lt);
        return `"${k}" < ?${count++}`;
      }

    }).join(" AND ")}` : "";
    const sort = options.sort && Object.keys(options.sort).length === 1 ? ` ORDER BY "${Object.keys(options.sort)[0]}" ${
      Object.values(options.sort)[0] === 1 ? "ASC" : "DESC"}` : "";
    const limit = options.limit ? ` LIMIT ${options.limit}` : "";
    const query = `SELECT * FROM "${this.table}"${where}${sort}${limit}`;
    return this.client.db.prepare(query).bind(...values).run().then((r) => r.results);
  }

  /**
   * Like find but returns only the first element or null.
   */
  findOne(options = {}) {
    return this.find(options).then((r) => r[0] || null);
  }

  /**
   * Initializes this settings by loading the cache.
   * Call this before the client is logged in.
   */
  async init() {
    const { results: rows } = await this.client.db.prepare(`SELECT * FROM "${this.table}"`).all();
    for (const row of rows) this.cache.set(row.id, row);
  }
}