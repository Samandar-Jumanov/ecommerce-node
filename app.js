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
const adminRouter = require('./admin/router');
const sequelize = require('./utils/connectPostrges');
const redisClient = require('./utils/connectRedis');

const morgan = require('morgan');
const cors = require('cors')

//middlewares 
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"))

app.use(cors())

//customer 

app.get('/', (request , response)=>{
    response.status(200).send("Hello world")
})

app.use('/customer/auth', customerRouter)
app.use('/customer/saved', saveProductsRouter);
app.use('/customer/ratings', ratingRouter)
app.use('/customer/payments', paymentRouter )
app.use('/customer/search', searchRouter)

//salesman 

app.use('/salesman/auth', salesmanRouter);
app.use('/salesman/products', productRouter)

//admin 

app.use('/admin', adminRouter )


// Sequelize connection 
// sequelize.sync().then(res => {
//     console.log(res)
// }).then(err =>{
//     console.log(err)
// })

//start the engine 
app.listen(3001 , ()=> console.log("Server started"))


module.exports = app