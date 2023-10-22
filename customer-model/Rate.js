const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");



const RateBoughtProducts = sequelize.define('rateProducts', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true ,
        primaryKey : true 
    }, 
    customerId : {
        type : DataTypes.INTEGER,
        allowNull : false 
    },
    productId : {
        type : DataTypes.INTEGER,
        allowNull : false 
    },
    rate : {
        type : DataTypes.INTEGER, // assuming out of ten 
        allowNull : false 
    },
    description : {
        type : DataTypes.STRING ,
        allowNull : false 
    },
    customerName : {
        type : DataTypes.STRING ,
        allowNull : false 
    }
})

module.exports = RateBoughtProducts