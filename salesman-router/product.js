const productController = require('../salesman-controller/salesManProducts');
const upload = require('../utils/multer');
const productRouter = require('express').Router();
const { authRole } = require('../utils/authRole');
const { authenticateToken } = require('../utils/authToken')


productRouter.post('/create-product', authenticateToken ,  authRole, upload.array('files'),  productController.createProducts);
productRouter.put('/update-product/:salesManId/:productId'  ,authenticateToken, authRole, productController.UpdateProduct);
productRouter.get('/get-salesman-products/:salesManId' ,authenticateToken , authRole, productController.getSellerProducts);
productRouter.delete('/delete-product/:salesManId/:productId'  ,authenticateToken, authRole, productController.deleteProduct);
productRouter.get('/get-product/rating/:productId'  ,authenticateToken, authRole, productController.getProductRatings);
productRouter.get('/all-products', authenticateToken, productController.getAllProducts);

module.exports = productRouter;
