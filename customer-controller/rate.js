const {RateBoughtProducts , User } = require("../db-associations/customerAssociations")
const { Product, ProductRates} = require('../db-associations/salesManAssocitions')
const sequelize = require("../utils/connectPostrges")


const giveRate = async (request , response , next ) =>{
    const {customerId } = request.params 
    const {rate , description  , productId} = request.body 

    let t ;
    try {
        t = await sequelize.transaction();
        const customer = await User.findByPk(customerId);
        if(!customer){
            return response.status(404).json({
                message :' Customer not found '
            });
        };
        const product = await Product.findByPk(productId);
        if(!product){
            return response.status(404).json({
                message :" Product not found "
            });
        };
        
        const newRating = await RateBoughtProducts.create({
            customerId : customerId ,
            productId : productId ,
            description : description ,
            rate : rate,
            customerName : customer.username
        } , { transaction : t });

        await customer.addRateProducts(newRating , { transaction : t })
        await customer.save();
       
       const productRate =   await ProductRates.create({
            customerId : customerId,
            productId : productId,
            description : description,
            rate : rate,
            customerName : customer.username,
            ownerId : product.salesManId
        } , { transaction : t });

        await product.addProductRate(productRate , { transaction : t })
        await product.save();
        await t.commit();
        return response.status(201).json({
            message : "Rate added ",
        })

    } catch (error) {
        await t.rollback();
        next(error)
        
    }
}



module.exports = {
    giveRate
}

