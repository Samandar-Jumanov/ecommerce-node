const messageController = require('../salesman-controller/messages-controller')
const messageRouter = require('express').Router();


messageRouter.post('/send-message', messageController.postMessage)
messageRouter.get('/get-message/:senderUserId', messageController.cosumeMessages)



module.exports = messageRouter;