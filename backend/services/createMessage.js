const userModel = require("../models/userModel");

const createMessage = async (chat, userId) => {
  const user = await userModel.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const message = await user.createMessage({ chat });
  return { ...message.toJSON(), userName: user.name };
  
  // return {user.createMessage({ chat })...,user.name}
};

module.exports = createMessage;
