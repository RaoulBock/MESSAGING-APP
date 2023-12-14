const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));
// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");

  // // Perform a simple query (e.g., selecting data)
  // connection.query("SELECT * FROM your_table", (queryErr, results) => {
  //   if (queryErr) {
  //     console.error("Error executing query:", queryErr);
  //     return;
  //   }
  //   console.log("Query results:", results);
  // });

  // Close the connection after querying
  connection.end((endErr) => {
    if (endErr) {
      console.error("Error closing connection:", endErr);
      return;
    }
    console.log("Connection closed");
  });
});

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
