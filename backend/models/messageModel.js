const sequelize = require("../utils/db-connection");
const { DataTypes } = require("sequelize");

const messageModel = sequelize.define("message", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  chat: { type: DataTypes.STRING, allowNull: false },
  messageType:{type:DataTypes.STRING,defaultValue:"text"},
  url:{type:DataTypes.STRING}
});

module.exports = messageModel;
