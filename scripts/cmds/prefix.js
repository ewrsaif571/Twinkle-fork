const fs = require("fs-extra");
const { utils } = global;

module.exports = {
    config: {
        name: "prefix",
        version: "1.4",
        author: "NTKhang | edit SAIF",
        countDown: 5,
        role: 0,
        description: "✨ Change the bot's command prefix for your chat or system ✨",
        category: "config",
        guide: {
            vi: `🌸 Cách sử dụng 
─────────────────
🔹 {pn} <prefix mới> - Thay đổi prefix trong nhóm
🔹 {pn} <prefix mới> -g - Thay đổi prefix hệ thống (admin)
🔹 {pn} reset - Đặt lại prefix mặc định

📝 Ví dụ:
{pn} !
{pn} # -g
{pn} reset`,
            en: ` How to Use 
─────────────────
🔹 {pn} <new prefix> - Change prefix in your chat
🔹 {pn} <new prefix> -g - Change system prefix (admin)
🔹 {pn} reset - Reset to default prefix

📝 Examples:
{pn} !
{pn} # -g
{pn} reset`
        }
    },

    langs: {
        vi: {
            reset: "🔄 Đã đặt lại prefix về mặc định: 『%1』",
            onlyAdmin: "⛔ Bạn không có quyền thay đổi prefix hệ thống!",
            confirmGlobal: "⚠️ THAY ĐỔI TOÀN HỆ THỐNG ⚠️\n─────────────────\nBạn sắp thay đổi prefix cho toàn bộ bot!\n🔸 Prefix mới: 『%1』\n🔸 Reaction tin nhắn này để xác nhận!",
            confirmThisThread: "⚠️ THAY ĐỔI TRONG NHÓM ⚠️\n─────────────────\nBạn sắp thay đổi prefix cho nhóm này!\n🔸 Prefix mới: 『%1』\n🔸 Reaction tin nhắn này để xác nhận!",
            successGlobal: "✅ THÀNH CÔNG ✅\n─────────────────\nĐã thay đổi prefix hệ thống thành: 『%1』\n✨ Khởi động lại bot để áp dụng thay đổi!",
            successThisThread: "✅ THÀNH CÔNG ✅\n─────────────────\nĐã thay đổi prefix trong nhóm thành: 『%1』",
            myPrefix: `🌸 THÔNG TIN PREFIX 🌸
─────────────────
🌐 Prefix hệ thống: 『%1』
💬 Prefix nhóm bạn: 『%2』
─────────────────
Gõ "prefix reset" để đặt lại mặc định`
        },
        en: {
            reset: "🔄 Prefix reset to default: 『%1』",
            onlyAdmin: "⛔ You don't have permission to change system prefix!",
            confirmGlobal: "⚠️ GLOBAL CHANGE ⚠️\n─────────────────\nYou're about to change prefix for entire bot!\n🔸 New prefix: 『%1』\n🔸 React to this message to confirm!",
            confirmThisThread: "⚠️ CHAT CHANGE ⚠️\n─────────────────\nYou're about to change prefix for this chat!\n🔸 New prefix: 『%1』\n🔸 React to confirm!",
            successGlobal: "✅ SUCCESS ✅\n─────────────────\nChanged system prefix to: 『%1』\n✨ Restart bot to apply changes!",
            successThisThread: "✅ SUCCESS ✅\n─────────────────\nChanged chat prefix to: 『%1』",
            myPrefix: `🌸 PREFIX INFORMATION 🌸
─────────────────
🌐 System prefix: 『%1』
💬 Your chat prefix: 『%2』
─────────────────
Type "prefix reset" to restore default`
        }
    },

    onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
        if (!args[0]) {
            return message.SyntaxError();
        }

        if (args[0] === 'reset') {
            await threadsData.set(event.threadID, null, "data.prefix");
            return message.reply(getLang("reset", global.GoatBot.config.prefix));
        }

        const newPrefix = args[0];
        const formSet = {
            commandName,
            author: event.senderID,
            newPrefix
        };

        if (args[1] === "-g") {
            if (role < 2) {
                return message.reply(getLang("onlyAdmin"));
            }
            formSet.setGlobal = true;
        } else {
            formSet.setGlobal = false;
        }

        const confirmationMessage = args[1] === "-g" 
            ? getLang("confirmGlobal", newPrefix)
            : getLang("confirmThisThread", newPrefix);

        return message.reply(confirmationMessage, (err, info) => {
            formSet.messageID = info.messageID;
            global.GoatBot.onReaction.set(info.messageID, formSet);
        });
    },

    onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
        const { author, newPrefix, setGlobal } = Reaction;
        if (event.userID !== author) return;

        if (setGlobal) {
            global.GoatBot.config.prefix = newPrefix;
            fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
            return message.reply(getLang("successGlobal", newPrefix));
        } else {
            await threadsData.set(event.threadID, newPrefix, "data.prefix");
            return message.reply(getLang("successThisThread", newPrefix));
        }
    },

    onChat: async function ({ event, message, getLang }) {
        if (event.body && event.body.toLowerCase() === "prefix") {
            return message.reply(getLang(
                "myPrefix", 
                global.GoatBot.config.prefix, 
                utils.getPrefix(event.threadID)
            );
        }
    }
};