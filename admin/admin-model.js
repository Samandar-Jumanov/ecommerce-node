
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connectPostrges");

const Admin = sequelize.define('admin', {
     Id : {
        type : DataTypes.INTEGER,
        primaryKey : true ,
        autoIncrement : true 
     },
     companySecretKey : {
        type : DataTypes.STRING,
        allowNull : false 
     },
     name : {
        type : DataTypes.STRING,
        allowNull : false 
     },
     surname : {
        type : DataTypes.STRING,
        allowNull : false 
     },
     password : {
      type : DataTypes.STRING,
      allowNull : false 
     },
     email : {
        type : DataTypes.STRING ,
        allowNull : false 
     },
     role : {
        type : DataTypes.STRING,
        allowNull : false 
     },
     token : {
        type : DataTypes.STRING,
        allowNull : false 
     }
})

module.exports = {
    Admin
}