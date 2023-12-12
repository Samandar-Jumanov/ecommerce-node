// make a theme for products 
// only name and who created this with what Id
const sequelize = require("../utils/connectPostrges");
const { DataTypes } = require('sequelize')

const ProductType = sequelize.define("productType",{
     Id : {
        type : DataTypes.INTEGER,
        primaryKey : true ,
        autoIncreament : true,
    },
    productCaseName : {
        type : DataTypes.STRING ,
        allowNull : false 
    },
    adminId : {
        type : DataTypes.INTEGER,
        allowNull : false 
    }
});


module.exports = {ProductType} ;