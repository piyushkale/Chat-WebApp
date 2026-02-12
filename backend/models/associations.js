const user = require("./userModel");
const message = require("./messageModel");

user.hasMany(message);
message.belongsTo(user);

module.exports = { user, message };
