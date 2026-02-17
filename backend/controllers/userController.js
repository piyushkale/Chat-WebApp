const sendError = require("../services/handleError");
const { Op } = require("sequelize");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
//  sendError = (res, error, statusCode = 500, message = null)
const SALT_ROUNDS = 10;
const signupUser = async (req, res) => {
  try {
    const { name, email, phn, password } = req.body;
    if (!name || !email || !phn || !password) {
      return sendError(res, null, 400, "Missing Input");
    }
    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phn,
    });

    res.status(200).json({ message: `User created - ${user.name}` });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return sendError(res, null, 400, "Account already exists");
    }
    return sendError(res, error, 500);
  }
};

const loginUser = async (req, res) => {
  try {
    const { credential, password } = req.body;

    if (!credential || !password) {
      return sendError(res, null, 400, "Invalid credential");
    }

    const user = await userModel.findOne({
      where: {
        [Op.or]: [{ email: credential }, { phn: credential }],
      },
    });

    if (!user) {
      return sendError(res, null, 404, "Account does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, null, 401, "Wrong password");
    }
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
    );

    return res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const allUsers = async (req, res) => {
  try {
    const {userId}=req.user
    const users = await userModel.findAll({ attributes: ["id", "name"] });
    res.status(200).json({users,userId});
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = { signupUser, loginUser, allUsers };
