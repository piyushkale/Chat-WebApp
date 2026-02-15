const createMessage = require("../../services/createMessage");
module.exports = (io, socket) => {
  socket.on("message", async (data) => {
    try {
      const response = await createMessage(data.chat, socket.user.userId);
      io.emit("message", response);
    } catch (error) {
      console.log("Socket error", error);
    }
  });
};
