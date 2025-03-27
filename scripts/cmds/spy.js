module.exports = {
  config: {
    name: "spy",
    version: "1.0",
    author: "Shikaki x Saif ✨",
    countDown: 5,
    role: 0,
    shortDescription: "Get user information and avatar",
    longDescription: "Get user information and avatar by mentioning",
    category: "image",
  },

  onStart: async function ({ event, message, usersData, api, args, getLang }) {
    let avt;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      // Check if the argument is a numeric UID
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        // Check if the argument is a profile link
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      // If no UID was extracted from the argument, use the default logic
      uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
    }

    // Fetch user info
    api.getUserInfo(uid, async (err, userInfo) => {
      if (err) {
        return message.reply("Failed to retrieve user information.");
      }

      const avatarUrl = await usersData.getAvatarUrl(uid);

      // Gender mapping
      let genderText;
      switch (userInfo[uid].gender) {
        case 1:
          genderText = " Girl";
          break;
        case 2:
          genderText = " Boy";
          break;
        default:
          genderText = "❓ Unknown";
      }

      // Construct and send the user's information with avatar
      const userInformation = `
 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 
────────────────
•𝗇𝖺𝗆𝖾: ${userInfo[uid].name}
•𝖥𝖡 𝗎𝗋𝗅: ${userInfo[uid].profileUrl}
•𝗀𝖾𝗇𝖽𝖾𝗋: ${genderText}
•𝗎𝗌𝖾𝗋 𝗍𝗒𝗉𝖾: ${userInfo[uid].type}
•𝖿𝗋𝗂𝖾𝗇𝖽 𝗐𝗂𝗍𝗁 𝖻𝗈𝗍: ${userInfo[uid].isFriend ? " Yes" : " No"}
•𝖻𝗂𝗋𝗍𝗁𝖽𝖺𝗒 𝗍𝗈𝖽𝖺𝗒: ${userInfo[uid].isBirthday ? " yes" : "no"}
────────────────
      `;

      // Send the result
      message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });
    });
  }
};