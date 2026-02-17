const user = require("./userModel");
const message = require("./messageModel");

// User → Sent Messages
user.hasMany(message, {
  foreignKey: "userId",
  as: "sentMessages"
});

// User → Received Messages
user.hasMany(message, {
  foreignKey: "receiverId",
  as: "receivedMessages"
});

// Message → Sender
message.belongsTo(user, {
  foreignKey: "userId",
  as: "sender"
});

// Message → Receiver
message.belongsTo(user, {
  foreignKey: "receiverId",
  as: "receiver"
});


module.exports = { user, message };
