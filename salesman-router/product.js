const productController = require('../salesman-controller/salesManProducts');
const upload = require('../utils/multer');
const productRouter = require('express').Router();


productRouter.post('/create-product', upload.array('files'),  productController.createProducts);
productRouter.put('/update-product/:salesManId/:productId', productController.UpdateProduct);
productRouter.get('/get-salesman-products/:salesManId', productController.getSellerProducts);
productRouter.delete('/delete-product/:salesManId/:productId', productController.deleteProduct);
productRouter.get('/get-product/rating/:productId', productController.getProductRatings);
productRouter.get('/all-products', productController.getAllProducts);

module.exports = productRouter;
