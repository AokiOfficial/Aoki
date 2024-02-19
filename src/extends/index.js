// extending stuff
// shortcut just to make my life easier
import { CommandContext } from "yor.ts";

// instead of having to do ctx.get{type}Option(name, index, required?)
// now we only have to specify name
// ctx.get{type}(name)
// only have to be careful about commands in subcommand group colliding with subcommands
import NekoCommandContext from "./CommandContext";
Object.defineProperties(CommandContext.prototype, {
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