// extending stuff
// shortcut just to make my life easier
import { CommandContext, User, Member, Guild } from "yor.ts";
const _defProp = Object.defineProperties;

// instead of having to do ctx.get{type}Option(name, index, required?)
// now we only have to specify name
// ctx.get{type}(name)
// only have to be careful about commands in subcommand group colliding with subcommands
import NekoCommandContext from "./CommandContext";
_defProp(CommandContext.prototype, {
  getSubcommand: { value: NekoCommandContext.getSubcommand },
  getSubcommandGroup: { value: NekoCommandContext.getSubcommandGroup },
  getString: { value: NekoCommandContext.getString },
  getNumber: { value: NekoCommandContext.getNumber },
  getInteger: { value: NekoCommandContext.getInteger },
  getBoolean: { value: NekoCommandContext.getBoolean },
  getUser: { value: NekoCommandContext.getUser },
  getMember: { value: NekoCommandContext.getMember },
  getChannel: { value: NekoCommandContext.getChannel },
  getAttachment: { value: NekoCommandContext.getAttachment },
  getRole: { value: NekoCommandContext.getRole }
});

// extending to use database properties
import NekoUser from "./User";
_defProp(User.prototype, {
  settings: { get: NekoUser.settings },
  update: { value: NekoUser.update },
  syncSettings: { value: NekoUser.syncSettings },
  syncSettingsCache: { value: NekoUser.syncSettingsCache }
});

import NekoMember from "./Member";
_defProp(Member.prototype, {
  settings: { get: NekoMember.settings },
  update: { value: NekoMember.update },
  syncSettings: { value: NekoMember.syncSettings },
  syncSettingsCache: { value: NekoMember.syncSettingsCache },
  permissions: { get: NekoMember.permissions }
});

import NekoGuild from "./Guild";
_defProp(Guild.prototype, {
  settings: { get: NekoGuild.settings },
  update: { value: NekoGuild.update },
  syncSettings: { value: NekoGuild.syncSettings },
  schedules: { get: NekoGuild.schedules },
  wipe: { value: NekoGuild.wipe }
});