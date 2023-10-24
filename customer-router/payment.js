const payment = require('../customer-controller/payment')
const paymentRouter = require('express').Router();

paymentRouter.post('/buy', payment.buyProduct)
paymentRouter.get('/payment-history/:customerId', payment.seePaymentHistory)

module.exports = paymentRouter

