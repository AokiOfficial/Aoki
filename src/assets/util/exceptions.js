/**
 * Handle unhandledRejection
 * @param {Error} error The error object
 * @param {*} args other arguments passed through the event
 * @returns {Promise<Message|undefined>}
 */
function unhandledRejection([error, ...args], client) {
  const channel = client.channels.cache.get("864096602952433665");
  const timezone = 9;
  const offset = 60000 * (new Date().getTimezoneOffset() - -timezone * 60);
  const time = parseDate(new Date(Date.now() + offset).toLocaleString("ja-JP", { timezone: "Asia/Tokyo" }).split(/:|\s|\//));

  console.log(error);
  return channel?.send(`\\🛠 ${error.name} caught!\n\`${time}\`\n\`\`\`xl\n${error.stack?.split("\n").splice(0, 5).join("\n").split(process.cwd()).join("MAIN_PROCESS")}\n.....\n\`\`\``);
}

/**
 * Handle uncaughtException
 * @param {Error} error The error object
 * @param {*} args other arguments passed through the event
 * @returns {Promise<Message|undefined>}
 */
function uncaughtException([error, ...args], client) {
  const channel = client.channels.cache.get("864096602952433665");
  const timezone = 9;
  const offset = 60000 * (new Date().getTimezoneOffset() - -timezone * 60);
  const time = parseDate(new Date(Date.now() + offset).toLocaleString("ja-JP", { timezone: "Asia/Tokyo" }).split(/:|\s|\//));

  console.log(error);
  return channel?.send(`\\🛠 ${error.name} caught!\n\`${time}\`\n\`\`\`xl\n${error.stack.split("\n").splice(0, 5).join("\n").split(process.cwd()).join("MAIN_PROCESS")}\n.....\n\`\`\``);
}

/**
 * parse Date
 * @param {Error} error The error object
 * @param {*} args other arguments passed through the event
 * @returns {string} The formatted date
 */
function parseDate([m, d, y, h, min, s, a]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return `${weeks[new Date(parseInt(y), m - 1, d).getDay()]} ${months[m - 1]} ${d} ${parseInt(y)} ${h == 0 ? 12 : h > 12 ? h - 12 : h}:${min}:${s} ${a ? a : h < 12 ? "AM" : "PM"} JST`;
}

// registered functions to use
const registers = { unhandledRejection, uncaughtException };

export default function processEvents(event, args, client) {
  if (registers[event]) {
    return registers[event](args, client);
  } else {
    return client.util.warn(`Function for process#event '${event}' not registered at /util/processEvents.js`, "[PROCESS]");
  }
};
