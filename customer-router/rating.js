const ratingController = require('../customer-controller/rate')
const ratingRouter = require('express').Router();

ratingRouter.post('/give-rate/:customerId/:productId', ratingController.giveRate)


module.exports = ratingRouter 
