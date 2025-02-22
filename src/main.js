import Client from "./struct/Client.js";

(new Client(process.argv.includes("--dev"))).login();