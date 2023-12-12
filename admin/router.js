const adminRouter = require('express').Router();
const productCaseController = require('./productCase')
const adminController = require('./admin-controller')

adminRouter.post('/product-case/create', productCaseController.createProductCase)
adminRouter.post('/auth/create-account/', adminController.createAccount)
adminRouter.post('/auth/create-login/', adminController.loginAccount)
adminRouter.post('/auth/logout', adminController.Logout)
adminRouter.delete('/product-case/delete', productCaseController.deleteProductCase)
adminRouter.get('/product-cases/all' , productCaseController.getAllProductCases)
adminRouter.put('/product-cases/update/:adminId/:productCaseId' , productCaseController.updateProductCase)


module.exports = adminRouter;
