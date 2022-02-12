const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Candidate = sequelize.define("candidate", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        len: [3, 500],
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: false,
        len: [100, 5000],
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
});

module.exports = Candidate;
