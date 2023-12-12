const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = {}; // Store connected users

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("login", (userData) => {
    // Simulated user authentication (replace this with your actual authentication logic)
    // Here, you could check against a database or an authentication service
    if (
      (userData.username === "user" && userData.password === "pass") ||
      (userData.username === "username" && userData.password === "password")
    ) {
      users[socket.id] = { id: socket.id, username: userData.username }; // Store user information
      socket.emit("login success");
    } else {
      socket.emit("login failed");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete users[socket.id]; // Remove the user on disconnect
  });

  socket.on("chat message", (msg) => {
    // Only allow authenticated users to send messages
    if (users[socket.id]) {
      console.log("message: " + msg);
      io.emit("chat message", `${users[socket.id].username}: ${msg}`);
    }
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
