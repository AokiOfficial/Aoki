import { User, Guild } from 'discord.js';
const _defProp = Object.defineProperties;

import * as AokiUser from './user.js';
_defProp(User.prototype, {
  settings: { get: AokiUser.settings },
  isOwner: { get: AokiUser.isOwner },
  checkIfVoted: { get: AokiUser.checkIfVoted },
  getSchedule: { value: AokiUser.getSchedule },
  setSchedule: { value: AokiUser.setSchedule },
  update: { value: AokiUser.update }
});

import * as AokiGuild from "./guild.js";
_defProp(Guild.prototype, {
  settings: { get: AokiGuild.settings },
  update: { value: AokiGuild.update }
});