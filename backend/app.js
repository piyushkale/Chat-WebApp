require("dotenv").config();
const express = require("express");
const db = require("./utils/db-connection");
require("./models/userModel");
const path = require("path");
const app = express();
const homeRoute = require('./routes/index')

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/", homeRoute);

db.sync({ alter: true })
  .then(() => {
    console.log("Models attached to DB are synced");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(3000, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Server running on port 3000");
});
