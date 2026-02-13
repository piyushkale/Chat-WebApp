require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("./utils/db-connection");
require("./models/associations");
const path = require("path");
const createMessage = require("./services/createMessage");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const homeRoute = require("./routes/index");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/", homeRoute);

// socket auth
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    next(new Error("Authentication failed")); // reject connection
  }
});
// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", async (data) => {
    const response = await createMessage(data.chat, socket.user.userId);
    io.emit("message", response);
  });
});

db.sync({ alter: true })
  .then(() => {
    console.log("Models attached to DB are synced");
  })
  .catch((err) => {
    console.log(err.message);
  });

server.listen(3000, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Server running on port 3000");
});
