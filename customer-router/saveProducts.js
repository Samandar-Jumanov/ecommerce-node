const saveProductsController = require('../customer-controller/saveProducts');
const saveProductsRouter = require('express').Router();
const {authenticateToken} = require('../utils/authToken');

saveProductsRouter.post('/save-product' ,  authenticateToken,  saveProductsController.saveProducts);
saveProductsRouter.delete('/remove-product', authenticateToken,  saveProductsController.removeSavedProduct);
saveProductsRouter.get('/get-all-saved/:customerId',  authenticateToken,  saveProductsController.getCustomerSavedProducts);

module.exports = saveProductsRouter;


