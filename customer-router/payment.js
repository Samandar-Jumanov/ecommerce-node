const payment = require('../customer-controller/payment')
const paymentRouter = require('express').Router();
const { authenticateToken } = require('../utils/authToken')

paymentRouter.post('/buy',  authenticateToken, payment.buyProduct)
paymentRouter.get('/payment-history/:customerId' ,  authenticateToken, payment.seePaymentHistory)

module.exports = paymentRouter

