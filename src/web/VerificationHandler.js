// main function file for verification
// exists on one guild as a test, will release later
export default class VerificationHandler {
  constructor(client) {
    this.client = client;
    this.settings = client.settings.verifications;
    this.OSU_CLIENT_ID = client.dev ? process.env.OSU_DEV_ID : process.env.OSU_ID;
    this.OSU_SECRET = client.dev ? process.env.OSU_DEV_SECRET : process.env.OSU_SECRET;
    this.REDIRECT_URI = client.dev ? "http://localhost:8080/callback" : "https://aoki.hackers.moe/callback";
    this.AUTH_URL = "https://osu.ppy.sh/oauth/authorize";
    this.TOKEN_URL = "https://osu.ppy.sh/oauth/token";
    this.USER_INFO_URL = "https://osu.ppy.sh/api/v2/me";
    this.VERIFY_ROLE = "Member";
    this.VIETNAM_ROLE = "Vietnamese";
  }

  async verify(url) {
    const guildId = url.searchParams.get('guildId');
    const userId = url.searchParams.get('userId');
    if (!guildId || !userId) {
      return new Response('Missing guildId or userId', { status: 400 });
    }
    return this.handleLogin(url);
  };

  async handleLogin(url) {
    const id = url.searchParams.get("id");
    const guildId = url.searchParams.get("guildId");
    // structure the state
    // to retrieve, use state.split("_");
    const state = `${id}_${guildId}_${Date.now()}`;
    await this.settings.update(id, { state, createdAt: Date.now(), guildId });

    const authUrl = `${this.AUTH_URL}?response_type=code&client_id=${this.OSU_CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}&scope=identify&state=${state}`;
    return new Response(null, {
      status: 302,
      headers: { Location: authUrl },
    });
  }

  async customizeVerificationMessage(guildId, customization) {
    await this.client.settings.guilds.update(guildId, {
      verification: {
        ...customization,
        status: true
      }
    });
  }

  async handleCallback(url) {
    try {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      const tokenData = await this.exchangeCodeForToken(code);
      const user = await this.fetchOsuUserData(tokenData.access_token);
      const verificationData = await this.settings.findOne({ state });

      if (!verificationData) {
        throw new Error("Invalid or expired state");
      }

      await this.saveUserData(verificationData.id, user);
      await this.grantRoles(verificationData.id, verificationData.guildId, user);

      return new Response("Verification successful. You can now return to Discord.");
    } catch (err) {
      console.error("Error during verification process:", err);
      return new Response(err.message || "An error occurred during verification", { status: 500 });
    }
  }

  async grantRoles(id, guildId, user) {
    const guild = this.client.guilds.cache.get(guildId);

    const guildSettings = await this.client.settings.guilds.findOne({ id: guildId });

    if (!guildSettings?.verification?.status) {
      return new Response("Verification is not enabled for this server.");
    }

    const member = await this.fetchMember(guild, id);

    if (!member) {
      throw new Error("Member not found in guild. Either the cache is broken or something is wrong.");
    }

    const role = await guild.roles.cache.get(guildSettings.verification.roleId);
    if (!role) {
      return new Response("Verification role not found. Please contact the server administrator.");
    }

    await member.roles.add(role);

    // Special case for the specific guild with two-role verification
    if (guildId === process.env.VERIF_GUILD) {
      const vnRole = guild.roles.cache.find((r) => r.name === this.VIETNAM_ROLE);
      if (user.country.code.toLowerCase() === "vn" && vnRole) {
        await member.roles.add(vnRole);
      }
    }

    return new Response("Verification successful. You can now return to Discord.");
  }

  /**
   * Exchange the OAuth2 code for an access token.
   * @param {string} code The OAuth2 authorization code.
   */
  async exchangeCodeForToken(code) {
    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.OSU_CLIENT_ID,
        client_secret: this.OSU_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    return await response.json();
  }

  /**
   * Fetch osu! user data using the access token.
   * @param {string} accessToken The access token.
   */
  async fetchOsuUserData(accessToken) {
    const response = await fetch(this.USER_INFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch osu! user data");
    }

    return await response.json();
  }

  /**
   * Save user data in the database.
   * @param {string} id The Discord user ID.
   * @param {Object} user The osu! user data.
   */
  async saveUserData(id, user) {
    const defaultMode = this.client.util.osuNumberModeFormat(user.playmode);
    await this.client.settings.users.update(id, {
      inGameName: user.username,
      defaultMode,
    });
  }

  /**
   * Fetch a member from the guild, either from cache or via API
   * @param {Object} guild The guild object
   * @param {string} id The Discord user ID
   * @returns {Object} The guild member or null if not found
   */
  async fetchMember(guild, id) {
    let member = guild.members.cache.get(id);
    if (!member) {
      try {
        member = await guild.members.fetch(id);
      } catch (error) {
        console.error(`Failed to fetch member ${id}:`, error);
      }
    }
    return member;
  }
}