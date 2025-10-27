// 🌸 Script by ObinXyz 🌸
// Credit: @ObinXyz | Telegram: t.me/obinexyezet
// yang ganti credit gw sumpahin scnya eror 
import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import fs from "fs";
import { config } from "config.js"; // isi file config.js dengan token bot

const bot = new TelegramBot(config.botToken, { polling: true });
console.log("🤖 BOT TELE-MD AKTIF...");

// === MENU DATA ===
const menuList = {
  info: `
👤 *Menu Info User*
━━━━━━━━━━━━━━
/cekid - Lihat ID Telegram kamu
/profil - Info nama & username
/waktu - Tampilkan waktu sekarang
  `,

  tools: `
📜 *Menu Tools*
━━━━━━━━━━━━━━
/shortlink [url] - Buat link pendek
/qrcode [text] - Buat QR Code
/translate [teks] - Translate bahasa
  `,

  fun: `
🎮 *Menu Fun*
━━━━━━━━━━━━━━
/jokes - Kirim lawakan random
/meme - Kirim meme lucu
/quote - Quote motivasi harian
  `,

  admin: `
🛠️ *Menu Admin*
━━━━━━━━━━━━━━
/ban [id] - Ban user
/unban [id] - Unban user
/broadcast [pesan] - Kirim pesan ke semua user
  `,

  group: `
🧩 *Menu Group*
━━━━━━━━━━━━━━
/welcome - Aktifkan pesan selamat datang
/bye - Pesan perpisahan grup
/members - Hitung jumlah member
  `,

  ai: `
💬 *Menu AI*
━━━━━━━━━━━━━━
/ask [pertanyaan] - Tanya AI
/imagine [prompt] - Generate gambar AI
/chat [teks] - Chat dengan AI
  `,

  downloader: `
📁 *Menu Downloader*
━━━━━━━━━━━━━━
/ytmp4 [url] - Download video YouTube
/ytmp3 [url] - Download musik YouTube
/tiktok [url] - Download video TikTok
/igdl [url] - Download media Instagram
  `,

  owner: `
🕹️ *Menu Owner*
━━━━━━━━━━━━━━
/eval [kode] - Jalankan kode JS
/restart - Restart bot
/stat - Statistik bot
/send [id] [pesan] - Kirim pesan manual
  `,
};

// === /menu utama ===
bot.onText(/^\/menu$/, (msg) => {
  const chatId = msg.chat.id;

  const menuKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "👤 Info User", callback_data: "menu_info" },
          { text: "📜 Tools", callback_data: "menu_tools" },
        ],
        [
          { text: "🎮 Fun", callback_data: "menu_fun" },
          { text: "🛠️ Admin", callback_data: "menu_admin" },
        ],
        [
          { text: "🧩 Group", callback_data: "menu_group" },
          { text: "💬 AI", callback_data: "menu_ai" },
        ],
        [
          { text: "📁 Downloader", callback_data: "menu_downloader" },
          { text: "🕹️ Owner", callback_data: "menu_owner" },
        ],
      ],
    },
  };

  const menuCaption = `
🤖 *𝗠𝗘𝗡𝗨 𝗨𝗧𝗔𝗠𝗔* 🤖
━━━━━━━━━━━━━━━━
👤 Info User
📜 Menu Tools
🎮 Menu Fun
🛠️ Menu Admin
🧩 Menu Group
💬 Menu AI
📁 Menu Downloader
🕹️ Menu Owner
━━━━━━━━━━━━━━━━
Klik tombol di bawah untuk melihat isinya ↓
  `;

  // Gambar banner (bisa diganti URL-nya sesuai keinginan)
  const banner = "https://files.catbox.moe/g3zkit.jpeg";

  bot.sendPhoto(chatId, banner, {
    caption: menuCaption,
    parse_mode: "Markdown",
    ...menuKeyboard,
  });
});

// === Saat tombol ditekan ===
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("menu_")) {
    const menuName = data.split("_")[1];
    const menuContent = menuList[menuName];

    if (menuContent) {
      bot.sendMessage(chatId, menuContent, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, "❌ Menu tidak ditemukan.");
    }
  }

  bot.answerCallbackQuery(query.id);
});

// === Fitur Cek ID ===
bot.onText(/^\/cekid$/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🆔 ID Kamu: \`${msg.from.id}\`\n👤 Nama: ${msg.from.first_name}`,
    { parse_mode: "Markdown" }
  );
});

// === Fitur TikTok Downloader ===
bot.onText(/^\/tiktok (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  bot.sendMessage(chatId, "📥 Mengambil video TikTok tanpa watermark...");
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const j = await res.json();
    if (j && j.data && j.data.play) {
      const videoUrl = j.data.play;
      await bot.sendVideo(chatId, videoUrl, { caption: `🎬 ${j.data.title}` });
    } else {
      throw new Error("Data tidak valid");
    }
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal mengambil video TikTok.");
  }
});

// === Fitur Instagram Downloader ===
bot.onText(/^\/igdl (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  bot.sendMessage(chatId, "📥 Mengambil media Instagram...");
  try {
    const api = `https://api.sssinstagram.com/api/ig?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const j = await res.json();
    if (j && j.links && j.links.length > 0) {
      for (const media of j.links) {
        await bot.sendVideo(chatId, media.url, { caption: "🎬 Media Instagram" });
      }
    } else throw new Error("Tidak ada media.");
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal mengambil media Instagram.");
  }
});

// === Fitur Sticker Maker ===
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo.pop().file_id;
  const fileLink = await bot.getFileLink(fileId);
  const res = await fetch(fileLink);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync("temp.jpg", buffer);
  await bot.sendSticker(chatId, "temp.jpg");
  fs.unlinkSync("temp.jpg");
});

// === Respon sederhana ===
bot.on("message", (msg) => {
  const text = msg.text?.toLowerCase();
  const chatId = msg.chat.id;
  if (!text) return;

  if (["halo", "hai", "hi"].includes(text)) {
    bot.sendMessage(chatId, `Halo ${msg.from.first_name}! 👋\nKetik /menu untuk melihat semua fitur.`);
  }
});
