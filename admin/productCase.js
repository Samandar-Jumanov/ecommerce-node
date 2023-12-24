const sequelize = require("../utils/connectPostrges");
const {ProductType , Admin} = require('./associations');
const redisClient = require('../utils/connectRedis')


const getAllProductCases = async (request, response, next) => {
    try {
        const allProductCases = await ProductType.findAll();
        const productCasesData = [];

        for (let i = 0; i < allProductCases.length; i++) {
            const data = await redisClient.hGet('productCase', allProductCases[i].id); 
            if (!data) {
                await redisClient.hSet('productCase', allProductCases[i].id, JSON.stringify(allProductCases[i]));
                productCasesData.push(allProductCases[i])
            } else {
                productCasesData.push(JSON.parse(data));
            }
        }
        return response.status(200).json({
             productCasesData
        });
    } catch (err) {
        return response.status(500).json({
            message: `Internal server error ${err.message}`
        });
    }
};

const createProductCase = async (request , response , next ) =>{
    const {adminId , productCaseName } = request.body;
    let  t;
    try{
        t = await sequelize.transaction();

        if (!productCaseName || !adminId) {
            return response.status(400).json({
                message: 'Productcase/ adminId   is required',
            });
        };

        const isCaseExist = await  ProductType.findOne({
            where : {
                productCaseName : productCaseName 
            }
        })

        if(isCaseExist){
            return response.status(400).json({
                message :"Product case is already created "
            })
        }
    
        const admin = await Admin.findByPk(adminId);

        if(!admin){
            return response.status(400).json({
                message :'Admin id required'
            })
        }
 
        const newProductCase = await ProductType.create({
            adminId : adminId ,
            productCaseName : productCaseName
        } , { transaction  : t  });
       
        console.log(newProductCase)
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
    };
};



const deleteProductCase = async (request , response , next ) =>{
    const {adminId , productCaseId} = request.params;
    let t ;
    try{

        const admin = await Admin.findByPk(adminId)
        if(!admin){
            return response.status(404).json({
                message :' Cannot find admin'
            })
        }
    const productCase = await ProductType.findByPk(productCaseId)
           
    if(!productCase){
        return response.status(404).json({
            message :' Cannot find productCase '
        })
    }

    await productCase.destroy();
    await admin.save();
    return response.status(200).json({
        message :'Deleted succefully'
    });
    }catch(err){
      return response.status(500).json({
        message :` Internal server error ${err.message}`
      })
    };
};


const updateProductCase = async (request , response , next ) =>{
    const {productCaseId , adminId} = request.params;
    let t ;
    try{

         t = await sequelize.transaction();
         const admin = await Admin.findByPk(adminId);
         if(!admin){
            return response.status(404).json({
                message :' Cannot find admin '
            })
         }

         const productCase = await ProductType.findByPk(productCaseId)
        
         if(!productCase){
            return response.status(404).json({
                message :' Cannot find product case'
            })
         }
         
         await productCase.update(request.body, { transaction : t })
         await admin.save();
         t.commit();
        return response.status(200).json({
            message :' Updated succesfully'
        })
    }catch(err){
        await t.rollback();
        return response.status(500).json({
            message : `Internal server error ${err.message}`
        })
    }
};


module.exports ={
    createProductCase ,
    deleteProductCase ,
    getAllProductCases,
    updateProductCase
}

