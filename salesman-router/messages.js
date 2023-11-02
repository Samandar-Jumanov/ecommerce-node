const messageController = require('../salesman-controller/messages-controller')
const messageRouter = require('express').Router();


messageRouter.post('/send-message', messageController.postMessage)


module.exports = messageRouter;