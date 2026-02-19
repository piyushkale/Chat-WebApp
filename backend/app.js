require("dotenv").config();
const express = require("express");
const http = require("http");
const db = require("./utils/db-connection");
require("./models/associations");
const path = require("path");
const app = express();
const homeRoute = require("./routes/index");
const socket_io = require('./socket_io')

const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/", homeRoute);


// socketio
socket_io(server);


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
