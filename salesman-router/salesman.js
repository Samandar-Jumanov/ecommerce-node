const salesmanController = require('../salesman-controller/salesman');
const salesmanRouter = require('express').Router();


salesmanRouter.post('/create-account', salesmanController.createAccount);
salesmanRouter.post('/login-account', salesmanController.loginAccount);
salesmanRouter.post('/logout-account', salesmanController.Logout);

module.exports = salesmanRouter;


