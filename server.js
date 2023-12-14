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

io.on("connection", (socket) => {
  console.log("a user connected");

  // Endpoint to handle the POST request for uploaded data
  app.post("/uploadData", (req, res) => {
    const receivedData = req.body.data; // Assuming 'data' is the key sent from the client

    // Do something with the received data (e.g., log it)
    console.log("Received data:", receivedData);

    // Send a response (optional)
    res.json({ message: "Data received on the server" });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast the message to everyone
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
