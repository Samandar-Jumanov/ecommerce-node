const payment = require('../customer-controller/payment')
const paymentRouter = require('express').Router();

paymentRouter.post('/buy', payment.buyProduct)
paymentRouter.post('/payment-history', payment.seePaymentHistory)

module.exports = paymentRouter

