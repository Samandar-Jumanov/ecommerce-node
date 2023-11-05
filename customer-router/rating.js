const ratingController = require('../customer-controller/rate');
const { authenticateToken } = require('../utils/authToken');
const ratingRouter = require('express').Router();

ratingRouter.post('/give-rate/:customerId',   authenticateToken, ratingController.giveRate)


module.exports = ratingRouter 
