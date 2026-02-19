const sendError = require("../services/handleError");
const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");
const { Op } = require("sequelize");
const { message } = require("../models/associations");
const chat = require("../socket_io/handlers/chat");
let waitingClients = [];
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chat } = req.body;
    if (!chat) {
      return sendError(res, null, 400, "Required input Missing!");
    }
    const user = await userModel.findByPk(userId);
    // const msg = await user.createMessage({ chat });
    const msg = await messageModel.create({ chat, userId });

    waitingClients.forEach((client) => {
      client.status(200).json({ message: msg });
    });
    waitingClients = [];
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
    const data = await messageModel.findAll({
      where: { receiverId: null },
      include: {
        model: userModel,
        as: "sender",
        attributes: ["name"],
      },
    });

    res.status(200).json({ messages: data, userId });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const getPersonalMessages = async (req, res) => {
  try {
    const { userId } = req.user;
    const { receiverId } = req.query;

    const data = await messageModel.findAll({
      where: {
        [Op.or]: [
          { userId, receiverId },
          { userId: receiverId, receiverId: userId },
        ],
      },
      include: [
        { model: userModel, as: "sender", attributes: ["id", "name"] },
        { model: userModel, as: "receiver", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ messages: data, userId });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const sendMedia = async (req, res) => {
  try {
    const { userId } = req.user;
    let { receiverId } = req.body;

    if (receiverId === "null" || receiverId == null) {
      receiverId = null;
    } else {
      receiverId = Number(receiverId);
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    const nMedia = await messageModel.create({
      chat: "Media",
      url,
      messageType: "Media",
      userId,
      receiverId,
    });

    // include socket and do emit to the online users

    res.status(200).json(nMedia);
  } catch (error) {
    sendError(res, error, 500);
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessage,
  getPersonalMessages,
  sendMedia,
};
