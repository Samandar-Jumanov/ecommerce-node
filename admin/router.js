const adminRouter = require('express').Router();
const productCaseController = require('./productCase')
const adminController = require('./admin-controller')
//admin 
adminRouter.post('/auth/create-account/', adminController.createAccount)
adminRouter.post('/auth/account-login/', adminController.loginAccount)
adminRouter.post('/auth/logout/:adminId', adminController.Logout)

//product cases
adminRouter.post('/product-case/create', productCaseController.createProductCase)
adminRouter.delete('/product-case/delete/:adminId/:productCaseId', productCaseController.deleteProductCase)
adminRouter.get('/product-cases/all' , productCaseController.getAllProductCases)
adminRouter.put('/product-cases/update/:adminId/:productCaseId' , productCaseController.updateProductCase)


module.exports = adminRouter;
