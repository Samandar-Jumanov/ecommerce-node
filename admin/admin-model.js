// validate smth speical for admin like comoany given id or smth  (request headers);
// full name 
// email 
// password 
// and picture of the admin (key for aws admin pic )
// role actually main admin or usual admin 
// there can be two different admins as main-admin and admin 
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
     picKey : {
        type : DataTypes.STRING,
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