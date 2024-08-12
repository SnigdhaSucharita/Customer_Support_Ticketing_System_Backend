let { DataTypes, sequelize } = require("../lib/index");

let ticket = sequelize.define("ticket", {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  status: DataTypes.ENUM("open", "closed"),
  priority: DataTypes.INTEGER,
  customerId: DataTypes.INTEGER,
  agentId: DataTypes.INTEGER
});

module.exports = { ticket };