const schema = async (pool) => {
  // leaving this here as fallback debug solution
  // wipe all table data and write new ones to sync id and data
  // to use: add drop1 - drop5 to pool.batch()
  // DO NOT combine these! pool.prepare() only accepts one query at a time
  // const drop1 = pool.prepare(`
  //   DROP TABLE guilds
  //   ;`)

  // const drop2 = pool.prepare(`
  //   DROP TABLE users
  //   ;`)

  // const drop3 = pool.prepare(`
  //   DROP TABLE members
  //   ;`)

  // const drop4 = pool.prepare(`
  //   DROP TABLE store
  //   ;`)

  // const drop5 = pool.prepare(`
  //   DROP TABLE client
  //   ;`)

  const guilds = pool.prepare(`
    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      anischedId INTEGER NOT NULL, 
      anischedData TEXT
    );`)

  const users = pool.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      inGameName TEXT DEFAULT NULL, 
      defaultMode INTEGER DEFAULT 0,
      bankOpened BOOLEAN DEFAULT false,
      pocketBalance INTEGER DEFAULT 0,
      bankBalance INTEGER DEFAULT 100,
      lastWorkTime TEXT DEFAULT "0",
      lastClaimTime TEXT DEFAULT "0",
      failedSteal INTEGER DEFAULT 0,
      firstFailedStealTime TEXT DEFAULT "0",
      lastStealTime TEXT DEFAULT "0",
      lastStealLevel TEXT DEFAULT "normal",
      lastPaycheck TEXT DEFAULT "0",
      piggyBalance INTEGER DEFAULT 0,
      haveVoted BOOLEAN DEFAULT false,
      lastVotedTime TEXT DEFAULT "0",
      dailyStreak INTEGER DEFAULT 0,
      background TEXT DEFAULT NULL,
      pattern TEXT DEFAULT NULL,
      emblem TEXT DEFAULT NULL,
      profileColor TEXT DEFAULT NULL,
      owns TEXT DEFAULT NULL
    );`)

  const members = pool.prepare(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      infraction INTEGER DEFAULT 0,
      lastInfractionMessageChannel TEXT,
      lastInfractionMessageId TEXT
    );`)

  const client = pool.prepare(`
    CREATE TABLE IF NOT EXISTS client (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      guildBlacklist TEXT,
      userBlacklist TEXT
    );`)

  // future plans
  // for now just make a table so I don't forget lol
  const store = pool.prepare(`
    CREATE TABLE IF NOT EXISTS store (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      guild TEXT NOT NULL,
      price INTEGER DEFAULT 0
    );`)

  await pool.batch([guilds, users, members, client, store]);
}

export default schema;