const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");
const createMessage = async (chat, userId, receiverId,name) => {
  // const user = await userModel.findByPk(userId);
  // if (!user) {
  //   throw new Error("User not found");
  // }

  // const message = await user.createMessage({ chat });
  const message = await messageModel.create({chat,userId,receiverId})
  return { ...message.toJSON(), userName: name };

  // return {user.createMessage({ chat })...,user.name}
};

module.exports = createMessage;
