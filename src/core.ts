// we don't really want 30-line long imports
// thankfully, we can have stuff from Golang just by writing a core file and place it in tsconfig

// commands
import Anime from "./cmd/anime";
import Fun from "./cmd/fun";
import My from "./cmd/my";
import OsuGame from "./cmd/osu";
import Utility from "./cmd/utility";
import Verify from "./cmd/verify";

export const cmds = { Anime, Fun, My, OsuGame, Utility, Verify };

// events
import botReady from "./events/botReady";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";

export const events = { botReady, interactionCreate, messageCreate };

// utils
import AnilistUtil from "@utils/AniList";
import ArrayUtil from "@utils/Array";
import MiscUtil from "@utils/Misc";
import OsuUtil from "@utils/OsuGame";
import ProfaneUtil from "@utils/Profane";
import StringUtil from "@utils/String";
import TimeUtil from "@utils/Time";
import DBL from "@utils/DBL";

export const utils = { AnilistUtil, ArrayUtil, MiscUtil, OsuUtil, ProfaneUtil, StringUtil, TimeUtil, DBL };
