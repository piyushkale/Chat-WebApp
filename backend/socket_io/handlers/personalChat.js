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
  socket.on("join-room", (email) => {
    socket.join(email);
    console.log("Room joined")
  });
  socket.on("privateMessage", async (data) => {
    // data.receiverId
    try {
      const response = await createMessage(data.chat, socket.user.userId);
      io.to(data.currentRoom).emit("privateMessage", response);
      // io.to(`user_${socket.user.userId}`).emit("privateMessage", response);
    } catch (error) {
      console.log("Socket error", error);
    }
  });
};
