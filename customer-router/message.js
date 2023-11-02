const messageController = require('../customer-controller/message')
const customerMessages = require('express').Router();

customerMessages.post('/send-message', messageController.postMessage)
customerMessages.get('/get-message/:senderUserId', messageController.cosumeMessages)



module.exports = customerMessages;