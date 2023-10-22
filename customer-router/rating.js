const ratingController = require('../customer-controller/rate')
const ratingRouter = require('express').Router();

ratingRouter.post('/give-rate/:customerId', ratingController.giveRate)


module.exports = ratingRouter 
