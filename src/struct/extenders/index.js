import { User } from 'discord.js';
const _defProp = Object.defineProperties;

import * as NekoUser from './user.js';
_defProp(User.prototype, {
  settings: { get: NekoUser.settings },
  owner: { get: NekoUser.owner },
  blacklisted: { get: NekoUser.blacklisted },
  voted: { get: NekoUser.voted },
  getSchedule: { value: NekoUser.getSchedule },
  setSchedule: { value: NekoUser.setSchedule },
  update: { value: NekoUser.update }
});