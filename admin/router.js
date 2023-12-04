const adminRouter = require('express').Router();
const productCaseController = require('./productCase')
const adminController = require('./admin-controller')

adminRouter.post('/create', productCaseController.createProductCase)
adminRouter.post('/auth/create-account/', adminController.createAccount)
adminRouter.post('/auth/create-login/', adminController.loginAccount)
adminRouter.post('/auth/logout', adminController.Logout)

module.exports = adminRouter;
