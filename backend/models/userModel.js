const sequelize = require("../utils/db-connection");
const { DataTypes } = require("sequelize");

const userModel = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phn: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = userModel;
