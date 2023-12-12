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

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log("A user connected");

  // Check if the user has a stored cookie with login details
  const storedUsername = socket.request.cookies
    ? socket.request.cookies.username
    : null;
  const storedPassword = socket.request.cookies
    ? socket.request.cookies.password
    : null;

  if (
    (storedUsername === "user" && storedPassword === "pass") ||
    (storedUsername === "username" && storedPassword === "password")
  ) {
    users[socket.id] = { id: socket.id, username: storedUsername }; // Store user information
    socket.emit("login success");
    // Emit chat history to the newly connected user
    socket.emit("chat history", chatHistory);
  }

  socket.on("login", (userData) => {
    // Simulated user authentication (replace this with your actual authentication logic)
    if (
      (userData.username === "user" && userData.password === "pass") ||
      (userData.username === "username" && userData.password === "password")
    ) {
      // Store username and password in cookies
      socket.emit("set cookie", {
        username: userData.username,
        password: userData.password,
      });

      users[socket.id] = { id: socket.id, username: userData.username }; // Store user information
      socket.emit("login success");
      // Emit chat history to the newly connected user
      socket.emit("chat history", chatHistory);
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
      const fullMessage = `${users[socket.id].username}: ${msg}`;
      chatHistory.push(fullMessage); // Store the message in chat history
      io.emit("chat message", fullMessage);
    }
  });
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
