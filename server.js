const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const messages = []; // Array to store chat history

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send chat history to the newly connected user
  socket.emit("chat history", messages);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    messages.push(msg); // Store the new message
    io.emit("chat message", msg); // Broadcast message to all connected clients
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
