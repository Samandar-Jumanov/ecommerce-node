const express = require('express');
const app = express();
const customerRouter = require('./customer-router/customerAuth');
const saveProductsRouter = require('./customer-router/saveProducts');
const salesmanRouter = require('./salesman-router/salesman');
const productRouter = require('./salesman-router/product');
const ratingRouter = require('./customer-router/rating');
const paymentRouter = require('./customer-router/payment');
const sequelize = require('./utils/connectPostrges');
const helmet = require('helmet');
const messageRouter = require('./salesman-router/messages');
const customerMessages = require('./customer-router/message');


app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//customer 
app.use('/customer/auth', customerRouter)
app.use('/customer/saved', saveProductsRouter);
app.use('/customer/ratings', ratingRouter)
app.use('/customer/payments', paymentRouter )
app.use('/customer/message' , customerMessages)

//salesman 
app.use('/salesman/auth', salesmanRouter);
app.use('/salesman/products', productRouter)
app.use('/salesman/message' , messageRouter)

app.listen(3001, () => {
    console.log('Server  is  listening on port 3001!');
})