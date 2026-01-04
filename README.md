# 🌸 OBINXYZ TELEGRAM BOT 🌸

Bot Telegram **multi-fitur** berbasis **Node.js**  
Dibuat oleh **🌸ObinXyz🌸**  

> ⚠️ **PERINGATAN**  
> Yang ganti credit, gw sumpahin SC-nya error pas runtime 😈

---

## 🚀 Tentang Bot
Bot ini dibuat untuk kebutuhan **hiburan, utilitas, dan downloader** dengan performa ringan dan mudah dikembangkan.  
Cocok dijalankan di **VPS**, **Linux**, **Windows**, maupun **Termux**.

---

## ✨ Fitur Utama
- `/start` → Pesan sambutan bot  
- `/menu` → Menampilkan semua fitur bot  
- `/cekid` → Melihat ID Telegram pengguna  
- `/info` → Informasi bot & developer  
- `/randomquote` → Kutipan random  
- `/weather <kota>` → Cek cuaca berdasarkan kota  
- `/tiktok <url>` → Download video TikTok tanpa watermark  
- `/igdl <url>` → Download media Instagram  
- `/sticker` → Ubah foto menjadi stiker otomatis  

---

## 🖼️ Screenshot Bot
> Contoh tampilan bot saat dijalankan

![Menu Bot](screenshots/menu.jpg)
![Downloader](screenshots/downloader.jpg)
![Sticker](screenshots/sticker.jpg)

> 📌 **Note:**  
> Letakkan file screenshot di folder `screenshots/`  
> Nama file bebas, sesuaikan dengan README.

---

## ⚙️ Cara Menjalankan Bot

### 1️⃣ Clone Repository
Klik tombol di bawah untuk menyalin perintah:

<a href="#" onclick="navigator.clipboard.writeText('git clone https://github.com/obinxyz77/bot-tele-v1.git'); alert('✅ Perintah git clone berhasil disalin!');" style="text-decoration:none;">
  <img src="https://img.shields.io/badge/📃%20Salin%20Git%20Clone-blue?style=for-the-badge">
</a>

Atau ketik manual di terminal:
```bash
git clone https://github.com/obinxyz77/bot-tele-v1.git
cd bot-tele-v1
npm install telegraf
npm install dotenv
npm install qrcode
npm install
npm start
