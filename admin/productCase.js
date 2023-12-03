// make an crud operation 
// only admin can crud one of these 
// an product case should be unique 
const sequelize = require('../utils/connectPostgres')
const {ProductCase , Admin} = require('./associations');

const createProductCase = async (request , response , next ) =>{
    const {adminId , productCaseName } = request.body;
    let  t = await sequelize.transaction();
    try{
        if (!productCaseName || !adminId) {
            return response.status(400).json({
                message: 'Productcase / adminId   is required',
            });
        }

        const isCaseExist = ProductCase.findOne({
            where : {
                productCaseName : productCaseName 
            }
        })

        if(isCaseExist !== null ){
            return response.status(404).json({
                message :"Product case is already created "
            })
        }
    
        const admin = await Admin.findByPk(adminId);
        

        if(!admin){
            return response.status(400).json({
                message :'Admin id required'
            })
        }
 
        const newProductCase = await ProductCase.create({
            adminId : adminId ,
            productCaseName : productCaseName 
        } , { transaction : t  });
        
        await admin.addProductCases(newProductCase , {transaction :t })
        await admin.save();
        await t.commit();

        return response.status(201).json({
            message :' Created ',
        })
        

    }catch(err){
        await t.rollback();
        return response.status(500).json({
            message: `Internal server error: ${err.message}`,
        });
    }
}

module.exports ={
    createProductCase 
}