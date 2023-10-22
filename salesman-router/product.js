const productController = require('../salesman-controller/products')
const productRouter = require('express').Router();


productRouter.post('/create-product', productController.createProducts);
productRouter.put('/update-product/:salesManId/:productId', productController.UpdateProduct);
productRouter.get('/get-salesman-products/:salesManId', productController.getSellerProducts);
productRouter.delete('/delete-product/:salesManId/:productId', productController.deleteProduct);
productRouter.get('/get-product/rating/:productId', productController.deleteProduct);



module.exports = productRouter;
