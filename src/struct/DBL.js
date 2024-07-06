// a mock for not using any kind of packages (it's just one simple task why bother?)
export default class DBL {
  constructor(client) {
    this.client = client;
    this.token = process.env.DBL_TOKEN;
  }

  async post() {
    const server_count = this.client.guilds.cache.size;
    if (server_count === this.client.lastStats) return;

    return fetch(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
      method: 'POST',
      body: JSON.stringify({ server_count }),
      headers: {
        'Authorization': process.env.DBL_TOKEN,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (!res.ok) throw new Error("Failed to post"); else {
        this.client.util.success("Posted statistics to top.gg", "[Top.gg]");
        this.client.lastStats = server_count;
      }
    }).catch(err => this.client.util.error(`Something happened, debugging might work: ${err}`, "[Top.gg]"));
  };
}
