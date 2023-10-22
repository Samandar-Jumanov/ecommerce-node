const express = require('express');
const app = express();
const customerRouter = require('./customer-router/customerAuth');
const sequelize = require('./utils/connectPostrges');
const saveProductsRouter = require('./customer-router/saveProducts');
const salesmanRouter = require('./salesman-router/salesman');
const productRouter = require('./salesman-router/product');
const mailRouter = require('./customer-router/mail');
const ratingRouter = require('./customer-router/rating');
const paymentRouter = require('./customer-router/payment');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//customer 
app.use('/customer/auth', customerRouter)
app.use('/customer/saved', saveProductsRouter);
app.use('/customer/mails', mailRouter)
app.use('/customer/ratings', ratingRouter)
app.use('/customer//payments', paymentRouter )

//salesman 
app.use('/salesman/auth', salesmanRouter);
app.use('/salesman/products', productRouter)


    app.listen(3001, () => {
        console.log('Server  is  listening on port 3001!');
    })


