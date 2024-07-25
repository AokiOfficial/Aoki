import { User } from 'discord.js';
const _defProp = Object.defineProperties;

import * as AokiUser from './user.js';
_defProp(User.prototype, {
  settings: { get: AokiUser.settings },
  owner: { get: AokiUser.owner },
  blacklisted: { get: AokiUser.blacklisted },
  voted: { get: AokiUser.voted },
  getSchedule: { value: AokiUser.getSchedule },
  setSchedule: { value: AokiUser.setSchedule },
  update: { value: AokiUser.update }
});