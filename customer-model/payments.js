//costmerId , productId ,  totalPrice, status, accesCode , card  

const sequelize = require("../utils/connectPostrges");
const  { DataTypes } = require('sequelize');

const Payment = sequelize.define('payments', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerId : {
        type : DataTypes.INTEGER,
        allowNull: false
    },
    product : {
     type : DataTypes.JSONB,
     allowNull : false 
   },
   status : {
    type : DataTypes.STRING,
    allowNull : false
   },
   accesCode : {
    type : DataTypes.STRING,
    allowNull : false
   },
   card : {
    type : DataTypes.STRING,
    allowNull : false
   }
   
})

module.exports = {Payment};