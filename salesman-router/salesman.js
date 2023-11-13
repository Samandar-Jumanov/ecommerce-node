const salesmanController = require('../salesman-controller/salesman');
const salesmanRouter = require('express').Router();
const { authRole } = require('../utils/authRole');

salesmanRouter.post('/create-account', salesmanController.createAccount);
salesmanRouter.post('/login-account', salesmanController.loginAccount);
salesmanRouter.post('/logout-account/:salesmanId', authRole,  salesmanController.Logout);

module.exports = salesmanRouter;


