const cutomerRouter = require('express').Router();
const customerController = require('../customer-controller/customer');
const {authenticateToken} = require('../utils/authToken');

cutomerRouter.post('/signup', customerController.Signup)
cutomerRouter.post('/login', customerController.Login)
cutomerRouter.put('/logout/:customerId', authenticateToken, customerController.Logout)
cutomerRouter.put('/change-role', authenticateToken,  customerController.changeRole)
cutomerRouter.get('/all-users', customerController.getAllUsers)

module.exports = cutomerRouter;
