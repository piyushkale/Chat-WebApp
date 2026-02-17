// socket.join(`user_${socket.user.userId}`);
// socket.on("privateMessage", async (data) => {
//     / data.receiverId
//     try {
//       const response = await createMessage(data.chat, socket.user.userId);
//       io.to(`user_${data.receiverId}`).emit("privateMessage", response);
//       io.to(`user_${socket.user.userId}`).emit("privateMessage", response);
//     } catch (error) {
//       console.log("Socket error", error);
//     }
//   });

const createMessage = require("../../services/createMessage");
module.exports = (io, socket) => {
  // socket.on("join-room", (email) => {
  //   socket.join(email);
  //   console.log("Room joined")
  // });
  if (!socket.user) return;

  socket.join(`user_${socket.user.userId}`);
  socket.on("privateMessage", async (data) => {
    // data.receiverId
    try {
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
