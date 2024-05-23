// extending stuff
// shortcut just to make my life easier
import { CommandContext, User, Member } from "slash-create/web";
// this interface is not exported by the package
// we have to extend it so the getMember() method can access
// member's resolved settings
import { ResolvedMember } from "../../../node_modules/slash-create/lib/structures/resolvedMember";
const _defProp = Object.defineProperties;

// easing out typings
import NekoCommandContext from "./CommandContext";
_defProp(CommandContext.prototype, {
  client: { get: NekoCommandContext.client },
  getGuild: { value: NekoCommandContext.getGuild },
  getSubcommand: { value: NekoCommandContext.getSubcommand },
  getSubcommandGroup: { value: NekoCommandContext.getSubcommandGroup },
  getOption: { value: NekoCommandContext.getOption },
  getUser: { value: NekoCommandContext.getUser },
  getMember: { value: NekoCommandContext.getMember },
  getChannel: { value: NekoCommandContext.getChannel },
  getAttachment: { value: NekoCommandContext.getAttachment },
  getRole: { value: NekoCommandContext.getRole }
});

// extending to use database properties
import NekoUser from "./User";
_defProp(User.prototype, {
  getSettings: { value: NekoUser.getSettings },
  update: { value: NekoUser.update }
});

import NekoMember from "./Member";
_defProp(Member.prototype, {
  getSettings: { get: NekoMember.getSettings },
  update: { value: NekoMember.update }
});

_defProp(ResolvedMember.prototype, {
  getSettings: { get: NekoMember.getSettings },
  update: { value: NekoMember.update }
});