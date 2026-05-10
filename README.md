# 🛰️ TikTok Listener Server

Server backend berbasis Node.js yang berfungsi untuk menarik data real-time dari TikTok Live menggunakan `tiktok-live-connector` dan mendistribusikannya via Socket.io.

## 📋 Fitur
-   Koneksi stabil ke TikTok Live API.
-   Event Broadcaster (Join, Chat, Gift).
-   Dukungan Socket.io untuk multi-client.

## 🛠️ Instalasi
```powershell
npm install
```

## ⚙️ Konfigurasi (.env)
Salin `.env.example` menjadi `.env` dan sesuaikan nilainya:
-   `PORT`: Port server berjalan (default: 3000).
-   `TIKTOK_USERNAME`: Username TikTok yang ingin dipantau.

## 🚀 Cara Menjalankan
```powershell
node server.js
```
atau jika menggunakan nodemon:
```powershell
npx nodemon server.js
```

---
**Catatan:** Pastikan server ini berjalan sebelum membuka aplikasi Desktop.
