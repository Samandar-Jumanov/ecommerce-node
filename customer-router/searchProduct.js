const searchController = require('../customer-controller/productsSearch')
const searchRouter = require('express').Router()

searchRouter.get('/', searchController.searchProducts)
module.exports = searchRouter