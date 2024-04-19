// extending stuff
// shortcut just to make my life easier
import { CommandContext, User, Member } from "slash-create/web";
// this interface is not exported by the package
// we have to extend it so the getMember() method can access
// member's resolved settings
import { ResolvedMember } from "../../../node_modules/slash-create/lib/structures/resolvedMember";
const _defProp = Object.defineProperties;

// instead of having to do ctx.get{type}Option(name, index, required?)
// now we only have to specify name
// ctx.get{type}(name)
// only have to be careful about commands in subcommand group colliding with subcommands
import NekoCommandContext from "./CommandContext";
_defProp(CommandContext.prototype, {
  client: { get: NekoCommandContext.client },
  guild: { get: NekoCommandContext.guild },
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
  settings: { get: NekoUser.settings },
  update: { value: NekoUser.update }
});

import NekoMember from "./Member";
_defProp(Member.prototype, {
  settings: { get: NekoMember.settings },
  update: { value: NekoMember.update }
});

_defProp(ResolvedMember.prototype, {
  settings: { get: NekoMember.settings },
  update: { value: NekoMember.update }
});