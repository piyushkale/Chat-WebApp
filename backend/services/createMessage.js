const userModel = require("../models/userModel");

const createMessage = async (chat, userId) => {
  const user = await userModel.findByPk(userId);
    if (!user) {
    throw new Error("User not found");
  }
  return user.createMessage({ chat });
};

module.exports = createMessage;
