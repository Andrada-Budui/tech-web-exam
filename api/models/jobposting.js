const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const JobPosting = sequelize.define("jobposting", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        len: [3, 500],
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = JobPosting;
