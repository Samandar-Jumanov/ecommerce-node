const sequelize = require("../utils/connectPostrges");
const { DataTypes } = require('sequelize');


const SavedProducts = sequelize.define('savedProducts', {
    Id : {
        type :DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerId : {
        type :DataTypes.INTEGER,
        allowNull: false
    },
    product:{
        type :DataTypes.JSONB,
        allowNull: false
    }
})

module.exports = {SavedProducts};