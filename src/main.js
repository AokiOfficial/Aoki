import Client from "./struct/Client.js";
import "./struct/extenders/index.js";

const dev = process.argv.includes("--dev");

const client = new Client(dev);

client.login();