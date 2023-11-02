const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");

const CustomerMessages = sequelize.define('messages',{
    Id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    senderUserId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    recieverUserId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    messages : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    salesmanStatus : {
        type : DataTypes.STRING,
        allowNull : false
    },
    costumerStatus :{
        type : DataTypes.STRING,
        allowNull : false
    }
})

module.exports = CustomerMessages; 