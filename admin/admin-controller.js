const {Admin} = require('./associations');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const createAccount = async (request , response , next ) =>{
    const { name, surname, email , companySecretKey , password   } = request.body;
    try {
        const existingAdmin = await Admin.findOne({
            where : {
                  email : email 
            }
        });


        if(existingAdmin){
            return response.status(409).json({
                message : 'Account already exists'
            })
        }

        const hashedPassword  = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            name : name ,
            surname : surname,
            password : hashedPassword,
            email : email,
            companySecretKey : companySecretKey,
            role : "admin",
            token : process.env.SECRET_KEY,
        })

        const token = jwt.sign({userId : newAdmin.Id}, process.env.SECRET_KEY, {expiresIn : 3600})
        newAdmin.token = token;
        await   newAdmin.save();

       const  adminInfo = {
           Id  : newAdmin.Id,
            name : name ,
            email : email,
            surname : surname,
            role : "admin",
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
    };

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
        role : "admin",
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
        const admin = await Admin.findByPk(adminId)

        if(!admin){
            return response.status(404).json({
                message  :'Cannot find admin with this id '
            })
        };

        admin.token = "";
        await admin.save();

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