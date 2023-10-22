const sequelize = require("../utils/connectPostrges");
const { DataTypes } = require('sequelize');


const User = sequelize.define('user', {
    Id : {
        type :DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username : {
        type :DataTypes.STRING,
        allowNull: false
    },
    password : {
        type :DataTypes.STRING,
        allowNull: false
    },
    email : {
        type :DataTypes.STRING,
        allowNull: false,
        unique : true 
    },
    token : {
        type :DataTypes.STRING,
        allowNull: false
    },
    role : {
        type :DataTypes.STRING,
        allowNull: false
    }
})

module.exports = {User};