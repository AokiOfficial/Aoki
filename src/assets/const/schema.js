// file for table creations
// these tables will automatically initialize themselves
// when a very first request on a worker is called
// we currently have some issues about d1 database
/**
 * 1: JSON handling is too complicated and it has too many methods
 * 2: one of our missions is "no SQL anywhere else"
 * 3: the current documentation is very technical (I'm not a native)
 * 4: future issues will arise as we come closer to r/w limit
 */ 
// these tables will still have breaking changes
const initSchema = async (pool) => {
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
      lastSlotMachine TEXT DEFAULT "0",
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