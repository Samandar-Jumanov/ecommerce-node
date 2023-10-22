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
              destination: salesman.card.number,
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
    const {customerId } = request.body;

    try {
        const customer = await User.findByPk(customerId)
        const customerPayment = await customer.getPayment()
        if(customerPayment.length === 0){
            return response.status(200).json({
                message :'No payment '
            })
        }
        return response.status(200).json({
            payment : customerPayment
        })
        
    } catch (error) {
        
    }
}

module.exports = {
    buyProduct,
    seePaymentHistory
}

