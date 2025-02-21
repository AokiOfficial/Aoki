import Client from "./struct/Client.js";
import "./struct/Extensions.js";

(new Client(process.argv.includes("--dev"))).login();