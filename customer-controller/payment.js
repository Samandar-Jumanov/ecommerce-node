require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {User , Payment ,  } = require('../db-associations/customerAssociations');
const sequelize = require('../utils/connectPostrges');
const { Salesman , Product} = require('../db-associations/salesManAssocitions')

const buyProduct = async (request, response , next ) => {
    const {  productId , customerId , salesmanId , cardNum , exp_month, exp_year , cvc } = request.body; 
    let t ;
     try {
        t = await sequelize.transaction();
        const product = await Product.findByPk(productId);
        const customer = await User.findByPk(customerId);
        const salesman = await Salesman.findByPk(salesmanId);

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: cardNum,
              exp_month: exp_month,
              exp_year: exp_year,
              cvc: cvc,
            },
          });
          
          const paymentIntent = await stripe.paymentIntents.create({
            amount: product.price,
            currency: process.env.CURRENCY,
            payment_method_types: ['card'],
            payment_method: paymentMethod.id,
            payment_method_options: {
              card: {
                request_three_d_secure: 'any',
              },
            },
            transfer_data: {
              destination: salesman.cardInfo.cardNumber,
            },
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
        return response.status(200).json({
            payment : customerPayment
        })
        
    } catch (error) {
      next(error)
        
    }
}

module.exports = {
    buyProduct,
    seePaymentHistory
}

