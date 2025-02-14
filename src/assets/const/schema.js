// this is the schema file
// it is compatible with both mongodb and mongoose libraries, because our logic handling is in the other structure files
// you can use either and stop caring about this file
export default {
  users: {
    inGameName: null,
    defaultMode: 0,
    processMessagePermission: true
  },
  schedules: {
    anilistId: null,
    nextEp: null
  },
  guilds: {
    timestampChannel: null,
    verification: {
      status: false,
      roleId: null,
      channelId: null,
      messageId: null,
      title: null,
      description: null,
      thumbnail: null,
      color: null
    },
  },
  verifications: {
    id: null,
    state: null,
    createdAt: null,
    guildId: null
  }
};