const adminRouter = require('express').Router();
const productCaseController = require('./productCase')
const adminController = require('./admin-controller')
const  {authenticateToken} =require('../utils/authToken');

//admin 
adminRouter.post('/auth/create-account/', adminController.createAccount)
adminRouter.post('/auth/account-login/', adminController.loginAccount)
adminRouter.post('/auth/logout/:adminId', authenticateToken ,  adminController.Logout)

//product cases
adminRouter.post('/product-case/create',authenticateToken ,  productCaseController.createProductCase)
adminRouter.delete('/product-case/delete/:adminId/:productCaseId', authenticateToken, productCaseController.deleteProductCase)
adminRouter.get('/product-cases/all' , authenticateToken , productCaseController.getAllProductCases)
adminRouter.put('/product-cases/update/:adminId/:productCaseId',authenticateToken , productCaseController.updateProductCase)


module.exports = adminRouter;
