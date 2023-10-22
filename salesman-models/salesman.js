const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");

const Salesman = sequelize.define('salesman', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    phoneNumber : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true 
    },
    cardInfo : {
        type : DataTypes.JSONB,
        allowNull : false,
        unique : true 
    },
    addressInfo : {
        type : DataTypes.JSONB,
        allowNull : false
    },
    token : {
        type : DataTypes.STRING,
        allowNull : false
    },
    role : {
        type : DataTypes.STRING,
        allowNull : false
    }
})

module.exports = Salesman;
