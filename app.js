const express = require('express');
const app = express();
const customerRouter = require('./customer-router/customerAuth');
const saveProductsRouter = require('./customer-router/saveProducts');
const salesmanRouter = require('./salesman-router/salesman');
const productRouter = require('./salesman-router/product');
const ratingRouter = require('./customer-router/rating');
const paymentRouter = require('./customer-router/payment');
const helmet = require('helmet');
const searchRouter = require('./customer-router/searchProduct');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml'); 
const cors = require('cors')
const adminRouter = require('./admin/router');

//middlewares 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(helmet());
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json('Hello World!');
})

//customer 
app.use('/customer/auth', customerRouter)
app.use('/customer/saved', saveProductsRouter);
app.use('/customer/ratings', ratingRouter)
app.use('/customer/payments', paymentRouter )
app.use('/customer/search', searchRouter)
//salesman 
app.use('/salesman/auth', salesmanRouter);
app.use('/salesman/products', productRouter)

//admin 
app.use('/admin', adminRouter)



app.listen(3001, () => {
    console.log('Server  is  listening on port 3001!');
})