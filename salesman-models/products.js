const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");


const Product = sequelize.define('product', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    productName : {
        type : DataTypes.STRING,
        allowNull : false
    },
    productImages : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        allowNull : false 
    },
    productPrice : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false 
    },
    productDescription : {
        type : DataTypes.STRING,
        allowNull : false
    },
    salesManId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    relasedDate : {
        type : DataTypes.STRING,
        allowNull : false
    },
    expirationDate :{
        type : DataTypes.STRING,
        allowNull : false
    },
    count : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

module.exports = Product