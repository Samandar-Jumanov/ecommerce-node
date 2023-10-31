require('dotenv').config()
const stripe = require('stripe')
const {User , Payment ,  } = require('../db-associations/customerAssociations');
const sequelize = require('../utils/connectPostrges');
const { Product} = require('../db-associations/salesManAssocitions')
const redisClient = require('../utils/connectRedis')

stripe.setApiKey(process.env.STRIPE_API_KEY , process.env.STRIPE_SECRET_KEY)

const buyProduct = async (request, response , next ) => {
    const {  productId , customerId  , cardNum } = request.body; 
    let t ;
     try {
        t = await sequelize.transaction();
        const product = await Product.findByPk(productId);
        const customer = await User.findByPk(customerId);

      const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price,
      currency: process.env.CURRENCY,
      automatic_payment_method :{
        enabled: true,
      }
    });

          if (paymentIntent.error) {
            return response.json({ error: paymentIntent.error.message });
          }

    const payment = await Payment.create({
        customerId : customerId,
        product : product,
        status  :'ok',
        accesCode : 200,
        card  : cardNum
    } , {transaction : t })

    await customer.addPayment(payment, {transaction : t})
    await customer.save();
    await t.commit();

    return response.status(201).json({
        message :"Successfully done ",
    })
        
     } catch (error) {
        await t.rollback();
        next(error)
        
     }

}
  
const seePaymentHistory = async (request, response, next ) =>{
    const {customerId } = request.params;

    try {
        const customer = await User.findByPk(customerId)
        const paymentData = [];

        if(!customer){
            return response.status(404).json({
                message :'Customer not found'
            })
        }

        const customerPayment = await customer.getPayments()
        if(customerPayment === null){
            return response.status(200).json({
                message :'No payment history'
            })
        }

        for(const payment of customerPayment ) {
        const data = await    redisClient.hGet('customerPayment', payment.Id)
        if(data){
          paymentData.push(JSON.parse(data))
        }else {
          await  redisClient.hSet('customerPayment', payment.Id , JSON.stringify(payment))
          paymentData.push(payment)
        }
        }

        return response.status(200).json(paymentData)
        
    } catch (error) {
      next(error)
        
    }
}

module.exports = {
    buyProduct,
    seePaymentHistory
}

