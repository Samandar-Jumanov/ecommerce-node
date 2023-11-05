const productController = require('../salesman-controller/salesManProducts');
const upload = require('../utils/multer');
const productRouter = require('express').Router();
const { authRole } = require('../utils/authRole');

productRouter.post('/create-product', authRole, upload.array('files'),  productController.createProducts);
productRouter.put('/update-product/:salesManId/:productId' , authRole, productController.UpdateProduct);
productRouter.get('/get-salesman-products/:salesManId' , authRole, productController.getSellerProducts);
productRouter.delete('/delete-product/:salesManId/:productId' , authRole, productController.deleteProduct);
productRouter.get('/get-product/rating/:productId' , authRole, productController.getProductRatings);
productRouter.get('/all-products', productController.getAllProducts);

module.exports = productRouter;
