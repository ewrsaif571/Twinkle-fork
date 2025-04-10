const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "monitor",
    aliases: ["run"],
    version: "1.3",
    author: "ayan | saif",
    role: 0,
    shortDescription: { 
      en: "Check bot's uptime & ping with a cool design!" 
    },
    longDescription: { 
      en: "Get details about how long the bot has been active along with its response time, presented in a stylish format."
    },
    category: "owner",
    guide: { 
      en: "Use {p}monitor to check bot uptime and ping with a cool design!" 
    },
    onChat: true
  },

  onStart: async function ({ api, event }) {
    return this.monitor(api, event);
  },

  onChat: async function ({ event, api }) {
    const content = event.body?.toLowerCase().trim();
    if (["monitor", "run"].includes(content)) {
      return this.monitor(api, event);
    }
  },

  monitor: async function (api, event) {
    try {
      const start = Date.now();

      const temp = await api.sendMessage("🐿️💔 𝗹𝗼𝗮𝗱𝗶𝗻𝗴...", event.threadID);
      
      setTimeout(() => {
        api.unsendMessage(temp.messageID);
      }, 1500);

      const end = Date.now();
      const ping = end - start;
      
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      let uptimeFormatted = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (days === 0) uptimeFormatted = `⏳ ${hours}h ${minutes}m ${seconds}s`;
      if (hours === 0) uptimeFormatted = `⏳ ${minutes}m ${seconds}s`;
      if (minutes === 0) uptimeFormatted = `⏳ ${seconds}s`;

      const finalMessage = `
🎀 𝖳𝗐𝗂𝗇𝗄𝗅𝖾 𝗌𝗍𝖺𝗍𝗎𝗌

𝖴𝗉𝗍𝗂𝗆𝖾: ${uptimeFormatted}

𝖯𝗂𝗇𝗀: ${ping}ms

𝖮𝗐𝗇𝖾𝗋: 𝗦𝗔𝗜𝗙 🥲
`;

      await api.sendMessage({
        body: finalMessage,
        attachment: await global.utils.getStreamFromURL("https://i.imgur.com/S46a5dl.gif")
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error in monitor command:", error);
      return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};