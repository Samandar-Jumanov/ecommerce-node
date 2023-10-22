const {Salesman , Product} = require("../db-associations/salesManAssocitions");
const sequelize = require("../utils/connectPostrges");


const createProducts = async (request , response, next ) =>{
const {productName , productPrice , productImages , productDescription ,
 salesManId , relasedDate, expirationDate, count } =request.body;
    let t ;
    try {
        t = await sequelize.transaction();
        const salesMan = await Salesman.findByPk(salesManId);

        if(!salesMan){
            return response.status(404).json({
                message : "Salesman not found"
            })
        }

        const product = await Product.create({
            productName,
            productImages,
            productPrice,
            productDescription,
            salesManId,
            relasedDate,
            expirationDate,
            count
         } , { transaction : t });

        await salesMan.addProducts(product , { transaction : t });
        await salesMan.save();
        await t.commit();
        
        return response.status(201).json({
            message : "Product created successfully",
        })

    } catch (error) {
        await t.rollback();
        next(error)
    }
}


const getAllProducts = async (request, response, next ) =>{
    try {
        const products = await Product.findAll();
        return response.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

const getSellerProducts = async (request , response , next ) =>{
    const {salesManId} = request.params;
    try {
        const salesMan = await Salesman.findByPk(salesManId);
        if(!salesMan){
            return response.status(404).json({
                message : "Salesman not found"
            })
        }

        const products = await salesMan.getProducts();
        if(products.length === 0) {
            return response.status(200).json({
                message : "You have no products "
            })
        }
        return response.status(200).json(products);
    } catch (error) {
        next(error)
    }
}


const UpdateProduct = async (request, response, next ) =>{
    const { productBody} = request.body;
    const {salesManId , productId } = request.params;
 let t ;
    try {
        t = await sequelize.transaction();
        
        const salesMan = await Salesman.findByPk(salesManId , {
            include : [
                {model : Product , as :'products'}
            ]
        });

        if(!salesMan){
            return response.status(404).json({
                message : "Salesman not found"
            })
        }
        const product = await Product.findByPk(productId);
        if(!product){
            return response.status(404).json({
                message : "Product not found"
            })
        }
        
        await product.update(productBody);
        await product.save();
        await salesMan.save()
        return response.status(200).json(product);
    } catch (error) {
        next(error)
        
    }
}

const deleteProduct = async (request, response, next ) =>{
    const {salesManId, productId } = request.params;
    try {
        const salesman = await Salesman.findByPk(salesManId);
        if(!salesman){
            return response.status(404).json({
                message : "Salesman not found"
            })
        }
        const product = await Product.findByPk(productId);

        if(!product){
            return response.status(404).json({
                message : "Product not found"
            })
        }
        await salesman.save()

        await product.destroy();
        return response.json({
           message :'Deleted succefully'
        })

    } catch (error) {
        next(error)
    }
}



const getProductRatings = async (request , response , next ) =>{
    const {productId} = request.params 
    try {
        
        const product = await Product.findByPk(productId)
        if(!product){
            return response.status(404).json({
                message : "Product has been deleted "
            })
        }

        const productRates = await product.getProductRates()
        
        if(productRates.length === 0 ) {
            return response.status(200).json({
                message :  "Product has no rates yet "
            })
        }

        return response.status(200).json({
            productRates : productRates
        })

    } catch (error) {
        next(error)
        
    }
}


module.exports = {
    createProducts,
    getAllProducts,
    UpdateProduct,
    getSellerProducts,
    deleteProduct,
    getProductRatings
};

