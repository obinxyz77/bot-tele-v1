// 🌸 Script by ObinXyz 🌸
// Credit: @ObinXyz | Telegram: t.me/obinexyezet
// yang ganti credit gw sumpahin scnya eror 

import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import fs from "fs";
import readline from "readline";

// === INPUT TOKEN & OWNER MANUAL ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Masukkan token bot Telegram kamu: ", (token) => {
  if (!token) {
    console.log("❌ Token tidak boleh kosong!");
    process.exit(1);
  }

  rl.question("Masukkan ID Telegram owner/admin kamu: ", (ownerId) => {
    if (!ownerId) {
      console.log("❌ ID Owner tidak boleh kosong!");
      process.exit(1);
    }

    // Simpan config biar gak perlu input ulang
    fs.writeFileSync("config.json", JSON.stringify({ token, ownerId }, null, 2));

    // === Inisialisasi Bot ===
    const bot = new TelegramBot(token, { polling: true });
    console.log("🤖 BOT TELE-MD AKTIF...");
    console.log(`👑 Owner ID: ${ownerId}`);

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
/addfit [nama] [kode] - Tambah fitur custom
      `,
    };

// === MENU UTAMA ===
bot.onText(/^\/menu$/, async (msg) => {
  const chatId = msg.chat.id;

  const banner = "https://files.catbox.moe/g3zkit.jpeg";

  const menuCaption = `
📸 *MENU UTAMA* 📸
🌸 𝓛𝓪𝓵𝓪 MD 🌸
──────────────────────────────
👤 Info User  
📜 Menu Tools  
🎮 Menu Fun  
🛠️ Menu Admin  
🧩 Menu Group  
💬 Menu AI  
📁 Menu Downloader  
🕹️ Menu Owner  
──────────────────────────────
Klik tombol di bawah untuk melihat isinya ⬇️
  `;

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
        [
          { text: "📋 Info Bot", callback_data: "menu_info_bot" }
        ]
      ],
    },
  };

  await bot.sendPhoto(chatId, banner, {
    caption: menuCaption,
    parse_mode: "Markdown",
    reply_markup: menuKeyboard.reply_markup,
  });
});

    // === Callback Menu ===
    bot.on("callback_query", (query) => {
      const chatId = query.message.chat.id;
      const data = query.data;

      if (data.startsWith("menu_")) {
        const menuName = data.split("_")[1];
        const menuContent = menuList[menuName];
        bot.sendMessage(chatId, menuContent || "❌ Menu tidak ditemukan.", {
          parse_mode: "Markdown",
        });
      }
      bot.answerCallbackQuery(query.id);
    });

    // === Cek ID ===
    bot.onText(/^\/cekid$/, (msg) => {
      bot.sendMessage(
        msg.chat.id,
        `🆔 ID Kamu: \`${msg.from.id}\`\n👤 Nama: ${msg.from.first_name}`,
        { parse_mode: "Markdown" }
      );
    });

    // === Tambah Fitur Dinamis ===
    bot.onText(/^\/addfit (.+)/, (msg, match) => {
  if (msg.from.id.toString() !== ownerId.toString()) {
    return bot.sendMessage(msg.chat.id, "❌ Kamu bukan owner!");
  }

  const args = match[1].trim().split(" ");
  const nama = args.shift();
  const kode = args.join(" ");

  if (!nama || !kode) {
    return bot.sendMessage(msg.chat.id, "❌ Format: /addfit [nama] [kode JS]");
  }

  try {
    // Escape karakter khusus biar aman di regex
    const safeName = nama.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Buat regex command secara dinamis
    const regex = new RegExp(`^${safeName}$`, "i");

    // Pasang handler baru
    bot.onText(regex, async (msg) => {
      try {
        eval(kode);
      } catch (e) {
        bot.sendMessage(msg.chat.id, `❌ Error di kode fitur: ${e.message}`);
      }
    });

    bot.sendMessage(
      msg.chat.id,
      `✅ Fitur baru '${nama}' berhasil ditambahkan!\n\nGunakan perintah: ${nama}`
    );
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Gagal menambah fitur: ${err.message}`);
  }
});

    // === TikTok Downloader ===
    bot.onText(/^\/tiktok (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const url = match[1];
      bot.sendMessage(chatId, "📥 Mengambil video TikTok...");
      try {
        const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const res = await fetch(api);
        const j = await res.json();
        if (j?.data?.play) {
          await bot.sendVideo(chatId, j.data.play, { caption: `🎬 ${j.data.title}` });
        } else throw new Error("Data tidak valid");
      } catch {
        bot.sendMessage(chatId, "❌ Gagal mengambil video TikTok.");
      }
    });

    // === IG Downloader ===
    bot.onText(/^\/igdl (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const url = match[1];
      bot.sendMessage(chatId, "📥 Mengambil media Instagram...");
      try {
        const api = `https://api.sssinstagram.com/api/ig?url=${encodeURIComponent(url)}`;
        const res = await fetch(api);
        const j = await res.json();
        if (j?.links?.length) {
          for (const media of j.links)
            await bot.sendVideo(chatId, media.url, { caption: "🎬 Media Instagram" });
        } else throw new Error("Tidak ada media");
      } catch {
        bot.sendMessage(chatId, "❌ Gagal mengambil media Instagram.");
      }
    });

    // === Sticker Maker ===
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
      if (!text) return;
      if (["halo", "hai", "hi"].includes(text)) {
        bot.sendMessage(msg.chat.id, `Halo ${msg.from.first_name}! 👋\nKetik /menu untuk lihat fitur.`);
      }
    });
  });
});
