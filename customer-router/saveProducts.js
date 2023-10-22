const saveProductsController = require('../customer-controller/saveProducts');
const saveProductsRouter = require('express').Router();
const authanticateToken = require('../utils/authToken');

saveProductsRouter.post('/save-product' ,  authanticateToken,  saveProductsController.saveProducts);
saveProductsRouter.delete('/remove-product', authanticateToken,  saveProductsController.removeSavedProduct);
saveProductsRouter.get('/get-all-saved/:customerId',  authanticateToken,  saveProductsController.getCustomerSavedProducts);

module.exports = saveProductsRouter;


