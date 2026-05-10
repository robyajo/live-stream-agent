require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { WebcastPushConnection } = require("tiktok-live-connector");
const axios = require("axios"); // Pastikan sudah npm install axios

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// URL API Laravel Anda
const LARAVEL_API_URL = "http://localhost:8000/api/config";

async function startServer() {
  try {
    console.log("Fetching config from Laravel...");
    const response = await axios.get(LARAVEL_API_URL);
    const { tiktok_username, listener_port } = response.data;

    console.log(
      `Config loaded: Username=${tiktok_username}, Port=${listener_port}`,
    );

    let tiktokLive;

    function connectToTikTok(username) {
      if (tiktokLive) {
        tiktokLive.disconnect();
      }

      tiktokLive = new WebcastPushConnection(username);

      tiktokLive
        .connect()
        .then((state) => {
          console.log(`Connected to TikTok Live: ${username}`);
          io.emit("system_msg", { text: `Connected to ${username}` });
        })
        .catch((err) => {
          console.error("Failed to connect to TikTok", err);
          io.emit("system_msg", { text: `Error: ${err.message}` });
        });

      // Event saat ada yang bergabung
      tiktokLive.on("member", (data) => {
        io.emit("viewer_join", {
          username: data.uniqueId,
          nickname: data.nickname,
        });
      });

      // Event saat ada komentar/chat
      tiktokLive.on("chat", (data) => {
        io.emit("new_chat", {
          username: data.uniqueId,
          nickname: data.nickname,
          comment: data.comment,
          profilePicture: data.profilePictureUrl,
        });
      });

      // Event saat ada yang memberi hadiah (gift)
      tiktokLive.on("gift", (data) => {
        io.emit("new_gift", {
          username: data.uniqueId,
          giftName: data.giftName,
          repeatCount: data.repeatCount,
          giftIcon: data.giftPictureUrl,
        });
      });
    }

    // Jalankan koneksi awal dari Laravel
    connectToTikTok(tiktok_username);

    // Listen for dynamic target changes from Desktop App
    io.on("connection", (socket) => {
      console.log("Desktop App connected to socket");

      socket.on("set_target", (newUsername) => {
        console.log(`Switching target to: ${newUsername}`);
        connectToTikTok(newUsername);
      });
    });

    server.listen(listener_port, () => {
      console.log(
        `TikTok Listener Server running on http://localhost:${listener_port}`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server: Could not fetch config from Laravel.",
      error.message,
    );
    console.log("Retrying in 5 seconds...");
    setTimeout(startServer, 5000);
  }
}

startServer();
