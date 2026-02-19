const createMessage = require("../../services/createMessage");
module.exports = (io, socket) => {
  socket.on("message", async (data) => {
    try {
      if (data.res?.messageType==="Media") {
        io.emit("message",{...data.res,userName:socket.user.name})
        return
      }
      const response = await createMessage(
        data.chat,
        socket.user.userId,
        data.receiverId,
        socket.user.name,
      );
      console.log("Public chat socket handler")
      io.emit("message", response);
    } catch (error) {
      console.log("Socket error", error);
    }
  });
};
