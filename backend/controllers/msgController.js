const sendError = require("../services/handleError");
const userModel = require("../models/userModel");

const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chat } = req.body;
    if (!chat) {
      return sendError(res, null, 400, "Required input Missing!");
    }
    const user = await userModel.findByPk(userId);
    const msg = await user.createMessage({ chat });
    res.status(201).json({ msg });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = { sendMessage };
