const searchController = require('../customer-controller/productsSearch')
const searchRouter = require('express').Router()
const {authenticateToken} = require('../utils/authToken');

searchRouter.get('/',  authenticateToken,  searchController.searchProducts)

module.exports = searchRouter