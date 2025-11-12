
// 🌸 Script by ObinXyz 🌸
// Credit: @ObinXyz | Telegram: t.me/obinexyezet
// yang ganti credit gw sumpahin scnya eror 😈

import dotenv from "dotenv";
import readline from "readline";
import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

// === INPUT TOKEN & OWNER MANUAL ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
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

    // Simpan config
    fs.writeFileSync("config.json", JSON.stringify({ token, ownerId }, null, 2));

    // === Inisialisasi Bot ===
    const bot = new Telegraf(token);
    const bannedUsers = new Set();
    const allUsers = new Set();
    const OPENAI_KEY = process.env.OPENAI_KEY || "";
    const GROUP_FILE = "groupSettings.json";

    // === Load Pengaturan Grup ===
    let groupSettings = {};
    if (fs.existsSync(GROUP_FILE)) {
      try {
        groupSettings = JSON.parse(fs.readFileSync(GROUP_FILE));
      } catch {
        groupSettings = {};
      }
    }

    function saveGroupSettings() {
      fs.writeFileSync(GROUP_FILE, JSON.stringify(groupSettings, null, 2));
    }

    console.log("🤖 BOT LALA-MD AKTIF...");
    console.log(`👑 Owner ID: ${ownerId}`);

    // === MENU INLINE ===
    function mainMenuKeyboard() {
      return Markup.inlineKeyboard([
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
      ]);
    }

    // === MENU TEKS ===
    const menuList = {
      info: `
👤 *Menu Info User*
━━━━━━━━━━━━━━
/cekid - Lihat ID Telegram kamu
      `,
      tools: `
📜 *Menu Tools*
━━━━━━━━━━━━━━
/shortlink [url] - Buat link pendek ❌️
/qrcode [text] - Buat QR Code ❌️
/translate [teks] - Translate bahasa ❌️
      `,
      fun: `
🎮 *Menu Fun*
━━━━━━━━━━━━━━
/jokes - Kirim lawakan random ❌️
/meme - Kirim meme lucu ❌️
/quote - Quote motivasi harian ❌️
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
/welcome - Aktifkan/Nonaktifkan pesan selamat datang
/bye - Aktifkan/Nonaktifkan pesan perpisahan
/members - Hitung jumlah member
/tagall - Tag semua member
      `,
      ai: `
💬 *Menu AI*
━━━━━━━━━━━━━━
/ask [pertanyaan] - Tanya AI
/imagine [prompt] - Generate gambar AI ❌️
/chat [teks] - Chat dengan AI ❌️
      `,
      downloader: `
📁 *Menu Downloader*
━━━━━━━━━━━━━━
/tiktok [url] - Download video TikTok
/igdl [url] - Download media Instagram
      `,
      owner: `
🕹️ *Menu Owner*
━━━━━━━━━━━━━━
/eval [kode] - Jalankan kode JS
/addfit [nama] [kode] - Tambah fitur custom
      `,
    };

    // === START ===
    bot.start(async (ctx) => {
      if (bannedUsers.has(ctx.from.id)) return ctx.reply("❌ Kamu diblokir oleh admin.");
      allUsers.add(ctx.from.id);

      const banner = "https://files.catbox.moe/id74p9.jpg";
      const caption = `
📸 *MENU UTAMA* 📸
🌸 𝓛𝓪𝓵𝓪 MD 🌸
──────────────────────────────
✘ • ʙᴏᴛ ɴᴀᴍᴇ: LALA-MD
✘ • ᴏᴡɴᴇʀ ɴᴀᴍᴇ: OBINXYZ
✘ • ᴠᴇʀsɪ: 1.0.3
──────────────────────────────
bot masih dalam tahap pengembangan 
maaf jika fitur bot tidak berfungsi
──────────────────────────────
──────────────────────────────
Klik tombol di bawah untuk melihat menu 👇
      `;

      await ctx.replyWithPhoto(banner, {
        caption,
        parse_mode: "Markdown",
        ...mainMenuKeyboard(),
      });
    });

    // === CALLBACK MENU ===
    bot.on("callback_query", async (ctx) => {
      const data = ctx.callbackQuery.data;
      const menuName = data.split("_")[1];
      const menuContent = menuList[menuName];
      await ctx.answerCbQuery();
      await ctx.reply(menuContent || "❌ Menu tidak ditemukan.", {
        parse_mode: "Markdown",
      });
    });

    // === /cekid ===
    bot.command("cekid", (ctx) => {
      ctx.reply(`🆔 ID Kamu: \`${ctx.from.id}\`\n👤 Nama: ${ctx.from.first_name}`, {
        parse_mode: "Markdown",
      });
    });

    // === ADMIN COMMANDS ===
    bot.hears(/^\/ban (.+)/, (ctx) => {
      if (ctx.from.id.toString() !== ownerId) return;
      const id = ctx.match[1].trim();
      bannedUsers.add(Number(id));
      ctx.reply(`🚫 User ${id} telah dibanned.`);
    });

    bot.hears(/^\/unban (.+)/, (ctx) => {
      if (ctx.from.id.toString() !== ownerId) return;
      const id = ctx.match[1].trim();
      bannedUsers.delete(Number(id));
      ctx.reply(`✅ User ${id} telah diunban.`);
    });

    bot.hears(/^\/broadcast (.+)/, async (ctx) => {
      if (ctx.from.id.toString() !== ownerId) return;
      const msg = ctx.match[1];
      let count = 0;
      for (const id of allUsers) {
        if (!bannedUsers.has(id)) {
          try {
            await bot.telegram.sendMessage(id, `📢 Pesan Admin:\n${msg}`);
            count++;
          } catch {}
        }
      }
      ctx.reply(`📨 Pesan terkirim ke ${count} user.`);
    });

    // === GROUP COMMANDS ===
    bot.command("welcome", (ctx) => {
      if (ctx.chat.type === "private") return ctx.reply("❌ Perintah ini hanya untuk grup.");
      const gid = ctx.chat.id;
      groupSettings[gid] = groupSettings[gid] || { welcome: false, bye: false };
      groupSettings[gid].welcome = !groupSettings[gid].welcome;
      saveGroupSettings();
      ctx.reply(
        groupSettings[gid].welcome
          ? "✅ Pesan selamat datang diaktifkan."
          : "❌ Pesan selamat datang dimatikan."
      );
    });

    bot.command("bye", (ctx) => {
      if (ctx.chat.type === "private") return ctx.reply("❌ Perintah ini hanya untuk grup.");
      const gid = ctx.chat.id;
      groupSettings[gid] = groupSettings[gid] || { welcome: false, bye: false };
      groupSettings[gid].bye = !groupSettings[gid].bye;
      saveGroupSettings();
      ctx.reply(
        groupSettings[gid].bye
          ? "✅ Pesan perpisahan diaktifkan."
          : "❌ Pesan perpisahan dimatikan."
      );
    });

    bot.command("members", async (ctx) => {
      if (ctx.chat.type === "private") return ctx.reply("❌ Perintah ini hanya untuk grup.");
      const members = await ctx.getChatMembersCount();
      ctx.reply(`👥 Jumlah member saat ini: *${members}*`, { parse_mode: "Markdown" });
    });

    // === /tagall ===
    bot.command("tagall", async (ctx) => {
      if (ctx.chat.type === "private") return ctx.reply("❌ Hanya untuk grup.");
      const sender = ctx.from.first_name;
      const text = ctx.message.text.split(" ").slice(1).join(" ") || "📢 Panggilan untuk semua member!";
      try {
        const admins = await ctx.getChatAdministrators();
        const isAdmin = admins.some((a) => a.user.id === ctx.from.id);
        if (!isAdmin) return ctx.reply("❌ Hanya admin yang bisa menggunakan perintah ini.");

        const members = await ctx.getChatMembersCount();
        let mentions = "";
        for (let i = 0; i < Math.min(members, 50); i++) {
          mentions += `[👤](tg://user?id=${ctx.from.id}) `;
        }
        ctx.reply(`${text}\n\n${mentions}`, { parse_mode: "Markdown" });
      } catch (err) {
        console.error(err);
        ctx.reply("⚠️ Gagal men-tag semua member.");
      }
    });

    // === EVENT: NEW MEMBER / LEAVE ===
    bot.on("new_chat_members", (ctx) => {
      const gid = ctx.chat.id;
      if (groupSettings[gid]?.welcome) {
        ctx.message.new_chat_members.forEach((member) =>
          ctx.reply(`🎉 Selamat datang, ${member.first_name}!`)
        );
      }
    });

    bot.on("left_chat_member", (ctx) => {
      const gid = ctx.chat.id;
      if (groupSettings[gid]?.bye) {
        ctx.reply(`😢 Selamat tinggal, ${ctx.message.left_chat_member.first_name}!`);
      }
    });

    // === AI FEATURE ===
    bot.hears(/^\/ask (.+)/, async (ctx) => {
      const question = ctx.match[1];
      if (!OPENAI_KEY) return ctx.reply("❌ OPENAI_KEY belum diset di .env");
      ctx.reply("⏳ Sedang memproses...");
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "Kamu adalah asisten ramah bernama Lala." },
              { role: "user", content: question },
            ],
          }),
        });

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || "❌ Tidak ada jawaban.";
        ctx.reply(reply);
      } catch {
        ctx.reply("❌ Gagal memanggil AI.");
      }
    });

    // === DOWNLOADER ===
    // === AUTO DOWNLOADER ===

// TikTok auto-detect
bot.hears(/https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com)\/\S+/, async (ctx) => {
  const url = ctx.message.text.match(/https?:\/\/\S+/)[0];
  await ctx.reply("📥 Mengambil video TikTok...");
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const j = await res.json();
    if (j?.data?.play) {
      await ctx.replyWithVideo({ url: j.data.play }, { caption: `🎬 ${j.data.title}` });
    } else throw new Error();
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Gagal mengambil video TikTok.");
  }
});

// Instagram auto-detect
// Handler untuk URL Instagram/Threads
bot.hears(/https?:\/\/(www\.)?(instagram\.com|reel\.instagram\.com|www\.threads\.net)\/\S+/, async (ctx) => {
  const url = ctx.message.text.match(/https?:\/\/\S+/)[0];

  try {
    await ctx.reply("📥 Mengambil media...");

   
    const api = `https://api.sssinstagram.com/api/ig?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data?.links?.length > 0) {
      for (const media of data.links) {
        const type = media.url.endsWith('.mp4') ? 'video' : 'photo';
        const caption = type === 'video' ? '🎬 Video dari Instagram' : '📸 Foto dari Instagram';

        if (type === 'video') {
          await ctx.replyWithVideo({ url: media.url }, { caption });
        } else {
          await ctx.replyWithPhoto({ url: media.url }, { caption });
        }
      }
    } else {
      await ctx.reply("⚠️ Tidak ada media ditemukan dalam tautan ini.");
    }
  } catch (error) {
    console.error("Scraping error:", error);
    await ctx.reply("❌ Gagal mengambil media. Mungkin tautan tidak valid atau media tidak bisa diakses.");
  }
});

// Yanzxd

    // === AUTO GREET ===
    bot.hears(/^(halo|hai|hi)$/i, (ctx) => {
      ctx.reply(`Halo ${ctx.from.first_name}! 👋\nKetik /menu untuk lihat fitur.`);
    });

    // === LAUNCH BOT ===
    bot.launch().then(() => console.log("🤖 BOT LALA-MD AKTIF!"));
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  });
});
