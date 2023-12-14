const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));
// Middleware to parse JSON in the request body
app.use(bodyParser.json());

const users = new Map(); // To store registered users

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register", ({ phoneNumber, username }) => {
    // Store user details in the 'users' Map
    users.set(socket.id, { phoneNumber, username });
    console.log(`${username} registered with phone number ${phoneNumber}`);

    // You might want to emit a success event back to the client
    socket.emit("registrationSuccess", { username });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast the message to everyone

    console.log({ user: "", message: msg });
  });

  // socket.on("disconnect", () => {
  //   if (users.has(socket.id)) {
  //     const { username } = users.get(socket.id);
  //     console.log(`${username} disconnected`);
  //     users.delete(socket.id);
  //   }
  // });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
