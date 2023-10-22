const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");



const RoleAccesCode = sequelize.define('accesCode', {
    Id :  {
        type : DataTypes.INTEGER,
        autoIncrement : true ,
        primaryKey : true 
    },
    customerId : {
        type : DataTypes.INTEGER,
        allowNull : false 
    },
    accesCode : {
        type : DataTypes.INTEGER,
        allowNull : false 
    }
})

module.exports = RoleAccesCode