const {Salesman , Product} = require("../db-associations/salesManAssocitions");
const sequelize = require("../utils/connectPostrges");
const  { v4 : uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
    region: process.env.AWS_REGION,
  });

require('dotenv').config();
const s3Bucket = new AWS.S3( { params: {Bucket: process.env.AWS_BUCKET_NAME} } );


  

const createProducts = async (request , response, next ) =>{
const {productName , productPrice  , productDescription ,salesManId , relasedDate, expirationDate, count } =request.body;
  let t ;
 const files =request.files;
    try {
        t = await sequelize.transaction();
        const salesMan = await Salesman.findByPk(salesManId);

        if(!salesMan){
            return response.status(404).json({
                message : "Salesman not found"
            })
        }

          const keys = [];

           for(let i=0; i < files.length; i++) {
            const uniqueName = uuidv4();
            const key = `${uniqueName}_${Date.now()}_${files[i].originalname}`;
            keys.push(key);
      
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: files[i].buffer,
                Key: key,
                ContentType :files[i].mimetype,
                ContentEncoding: 'base64',
              }
           
              await  s3Bucket.putObject(uploadParams,  function(err, data){
                if (err) { 
                return response.status(500).json({
                    message : "Failed to upload the image"
                })
                } 
            });
           }



      
        const product = await Product.create({
            productName,
            productImages : keys,
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


const getAllProducts = async (request, response, next) => {
    try {
        const products = await Product.findAll();
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const productImages = product.productImages;
    
            const urls = await Promise.all(
              productImages.map(async (key) => {
                const signedUrl = await s3Bucket.getSignedUrl('getObject', {
                  Key: key,
                });
                return signedUrl;
              })
            );
        
            productImages[i] = urls;
          }

        return response.status(200).json({ products });
      } catch (error) {
        next(error);
      }
  };

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
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const productImages = product.productImages;
    
            const urls = await Promise.all(
              productImages.map(async (image) => {
                const signedUrl = await s3Bucket.getSignedUrl('getObject', {
                  Key: image,
                });
                return signedUrl;
              })
            );
        
            productImages[i] = urls;
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

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const productImages = product.productImages;
    
            const urls = await Promise.all(
              productImages.map(async (image) => {
                const signedUrl = await s3Bucket.getSignedUrl('getObject', {
                  Key: image,
                });
                return signedUrl;
              })
            );
        
            productImages[i] = urls;
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

