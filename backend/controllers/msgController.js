const sendError = require("../services/handleError");
const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");

let waitingClients= []
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chat } = req.body;
    if (!chat) {
      return sendError(res, null, 400, "Required input Missing!");
    }
    const user = await userModel.findByPk(userId);
    const msg = await user.createMessage({ chat });

    waitingClients.forEach((client)=>{
      client.status(200).json({ message: msg})
    })
    waitingClients=[]
    res.status(201).json({ msg });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const getMessage = async (req, res) => {
  try {
    // const { userId } = req.user;
    // const data = await messageModel.findAll();

    // res.status(200).json({ messages: data, userId });
    waitingClients.push(res);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await messageModel.findAll({include:{
      model:userModel,
      attributes:['name']
    }});

    res.status(200).json({ messages: data, userId });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = { sendMessage, getAllMessages ,getMessage};
