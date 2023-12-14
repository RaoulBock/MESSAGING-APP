const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const compress = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const server = http.createServer(app);
const io = socketIO(server);

const users = {}; // Store connected users
const chatHistory = []; // Store chat history

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("login", (phoneNumber) => {
    if (!phoneNumber || isNaN(phoneNumber) || phoneNumber.length !== 10) {
      // Reject login if the phone number is invalid
      socket.emit("login error", "Please enter a valid 10-digit phone number.");
      return;
    }
    // Store the phone number as the user's identifier
    connectedUsers[socket.id] = phoneNumber;
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Remove the user from connected users on disconnect
    delete connectedUsers[socket.id];
  });

  socket.on("chat message", (msg) => {
    // Broadcast the message to everyone along with the sender's phone number
    io.emit("chat message", {
      phoneNumber: connectedUsers[socket.id],
      message: msg,
    });
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
