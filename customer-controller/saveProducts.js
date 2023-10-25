const {User , SavedProducts} = require('../db-associations/customerAssociations');
const {Product} = require('../db-associations/salesManAssocitions')
const sequelize = require('../utils/connectPostrges');
const redisClient = require('../utils/connectRedis')
const saveProducts = async (request, response, next ) =>{
    const {productId , customerId} = request.body
    
    let t ;
    try {
        t = await sequelize.transaction();
        const product = await Product.findByPk(productId)

        if(!product) {
            return response.status(404).json({
                message :'Product not found '
            })
        }
        const customer = await User.findByPk(customerId)
        
         if(!customer) {
            return response.status(404).json({
                message :'Customer not found '
            })
         }

         const savedProduct = await SavedProducts.create({
            product,
            customerId
        } , { transaction : t })

        await customer.addSavedProducts(savedProduct , { transaction : t })
        await customer.save()
        await t.commit();
        return response.status(201).json({
            message :"Saved"
        })
    } catch (error) {
        await t.rollback();
        next(error)
    }
}


const removeSavedProduct  = async (request , response , next ) =>{
    const {customerId , savedProductId  } = request.body

    let t; 
    try {
        t = await sequelize.transaction();
        const customer = await User.findByPk(customerId)
        if(!customer) {
            return response.status(404).json({
                message :'Customer not found '
            })
        }
        if(!savedProductId) {
            return response.status(404).json({
                message :'Product not found '
            })
        }

        const savedProduct = await SavedProducts.findByPk(savedProductId)
        await savedProduct.destroy()
        await customer.save();
        await t.commit();
        
        return response.status(200).json({
            message :"Removed successfully"
        })
    
    } catch (error) {
        await t.rollback();
        next(error)
    }
}


const getCustomerSavedProducts = async (request, response, next ) =>{
    const { customerId } = request.params
    try {
        const customer = await User.findByPk(customerId)
        const customerSavedProducts = await customer.getSavedProducts()

      
        
        if(customerSavedProducts.length === 0){
            return response.status(200).json({
                message :'No saved products'
            })
        }
        const savedProducts = [];

        for(const savedProduct of customerSavedProducts){
          const data = await  redisClient.hGet('savedProducts', savedProduct.Id)
          if(!data){
             await redisClient.hSet('savedProducts', savedProduct.Id , savedProduct)
             savedProducts.push(JSON.parse(data))
          }else {
            savedProducts.push(JSON.parse(data))
          }
        }


        return response.status(200).json({
            savedProducts : savedProducts
        })
        
    } catch (error) {
        next(error)
        
    }
}


module.exports = {
    saveProducts,
    removeSavedProduct,
    getCustomerSavedProducts
}

