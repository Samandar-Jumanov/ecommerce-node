const {Admin} = require('./admin-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const  { v4 : uuidv4 } = require('uuid');
const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
    region: process.env.AWS_REGION,
  });

const s3Bucket = new AWS.S3( { params: {Bucket: process.env.AWS_BUCKET_NAME} } );

const createAccount = async (request , response , next ) =>{
    const { name, surname, email , companySecretKey , password   } = request.body;
    const file = request.file;
    
    try {
        const existingAdmin = await Admin.findOne({
            where : {
                  email : email 
            }
        })

        if(existingAdmin){
            return response.status(409).json({
                message : 'Account already exists'
            })
        }

        const uniqueName = uuidv4(); //unique name for key 
        const key = `${uniqueName}_${Date.now()}_${file.originalname}`;
        
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: key,
            ContentType : file.mimetype,
            ContentEncoding: 'base64',
        }  // upload params for s3 bucket 
        let picKey;
        await  s3Bucket.putObject(uploadParams,  function(err, data){ //putting object to s3
            if (err) { 
                return response.status(500).json({
                    message : "Failed to upload the image"
                })
            }  else {
                    picKey = key
            }
        });
        
        const hashedPassword  = await bcrypt.hash(password, 10)
        const newAdmin = await Admin.create({
            name : name ,
            surname : surname,
            password : hashedPassword,
            email : email,
            companySecretKey : companySecretKey,
            role : "admin",
            token : process.env.SECRET_KEY,
            picKey : picKey
        })

        const token = jwt.sign({userId : newAdmin.Id}, process.env.SECRET_KEY, {expiresIn : 3600})
        newAdmin.token = token 
        await   newAdmin.save()

       const  adminInfo = {
           Id  : newAdmin.Id,
            name : name ,
            phoneNumber : phoneNumber,
            cardInfo : cardInfo,
            addressInfo : addressInfo,
            role : "salesman",
            token : token 
        }
        response.cookie('token', token , { httpOnly: true });
        return response.status(201).json({
            message : 'Account created successfully',
            adminInfo
        })
    } catch (error) {
        next(error)
    }
}

const loginAccount = async (request, response, next ) =>{
 const {email , password , companySecretKey  } = request.body;

 try {
    const existingAdmin = await Admin.findOne({
        where : {
          email:email
        }
    })
    if(!existingAdmin) {
        return response.status(404).json({
            message : 'Account not found'
        })
    }

    const isTruePassword = await bcrypt.compare(password, existingAdmin.password)
    const isTrueSecretKey = await bcrypt.compare(companySecretKey , existingAdmin.companySecretKey)
    if(!isTruePassword && !isTrueSecretKey) {
        return response.status(409).json({
            message : 'Invalid password/secret key'
        })
    }

    const token = jwt.sign({userId : existingAdmin.Id}, process.env.SECRET_KEY, {expiresIn : 3600})
    existingAdmin.token = token
    await existingAdmin.save();

    const  adminInfo = {
        Id : existingAdmin.Id,
        name : existingAdmin.name,
        surname : existingAdmin.surname,
        role : "salesman",
        token : token 
    }
    response.cookie('token', token, { httpOnly: true });
    return response.status(200).json({
        message : 'Logged in succesfully',
        adminInfo
    })
 } catch (error) {
    next(error)
 }

}

const Logout = async (request, response, next ) =>{
    const {adminId} = request.params
    try {
        const admin = await Salesman.findByPk(adminId)
        admin.token = null

        return response.clearCookie('token').status(200).json({
            message :'Logged out '
        })
    } catch (error) {
        next(error)
    }
}


module.exports ={
    createAccount,
    loginAccount,
    Logout 
}