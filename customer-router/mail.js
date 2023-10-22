const mail= require('../customer-controller/maileCode')
const mailRouter  = require('express').Router()

mailRouter.post('/send-email',  mail.sendMail)

module.exports = mailRouter

