const { Server } = require("socket.io");
const authenticate = require("./authMiddleware");
const chatHandler = require("./handlers/chat");
const personalChatHandler = require('./handlers/personalChat')
module.exports = (server) => {
  const io = new Server(server);
  authenticate(io);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    chatHandler(io, socket);
    personalChatHandler(io,socket);
  });
};
