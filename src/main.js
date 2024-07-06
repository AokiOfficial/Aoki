import Client from "./struct/Client.js";
import "./struct/extenders/index.js";

const dev = process.argv.includes("--dev");

new Client(dev).login();