// file for table creations
// these tables will still have breaking changes
const initSchema = async (pool) => {
  const users = pool.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      inGameName TEXT DEFAULT NULL, 
      defaultMode INTEGER DEFAULT 0,
      background TEXT DEFAULT NULL,
      pattern TEXT DEFAULT NULL,
      color TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL
    );`)

  const members = pool.prepare(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      infraction INTEGER DEFAULT 0,
      lastInfractionMessageChannel TEXT,
      lastInfractionMessageId TEXT
    );`)

  const guilds = pool.prepare(`
    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY NOT NULL,
      beta BOOLEAN DEFAULT false,
      channelID TEXT DEFAULT "0",
      anilistId INTEGER DEFAULT 0,
      nextEp INTEGER DEFAULT 0
    );`);


  await pool.batch([guilds, users, members]); 
}

export default initSchema;