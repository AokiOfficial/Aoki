// back to mongodb supremacy
export default {
  users: {
    inGameName: null,
    defaultMode: 0,
    background: null,
    pattern: null,
    color: null,
    description: "wow so magical",
    ticket: 0,
    inventory: [],
    processMessagePermission: true
  },
  members: {
    infraction: 0,
    infractionData: []
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