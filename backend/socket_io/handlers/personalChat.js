const createMessage = require("../../services/createMessage");
module.exports = (io, socket) => {
  if (!socket.user) return;

  socket.join(`user_${socket.user.userId}`);
  socket.on("privateMessage", async (data) => {
    // data.receiverId
    try {
      if (data.res?.messageType === "Media") {
        io.to(`user_${data.res.receiverId}`)
          .to(`user_${socket.user.userId}`)
          .emit("privateMessage", { ...data.res, userName: socket.user.name });
        console.log("this is private message socket event");
        return;
      }
      const response = await createMessage(
        data.chat,
        socket.user.userId,
        data.receiverId,
        socket.user.name,
      );
      io.to(`user_${data.receiverId}`)
        .to(`user_${socket.user.userId}`)
        .emit("privateMessage", response);
    } catch (error) {
      console.log("Socket error", error);
    }
  });
};
