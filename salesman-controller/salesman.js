const {Salesman} = require('../db-associations/salesManAssocitions')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createAccount = async (request , response , next ) =>{
    const { name, password, phoneNumber , cardInfo , addressInfo  } = request.body;
    try {
        
        const exisitingSalesMan = await Salesman.findOne({
            where : {
                phoneNumber : phoneNumber
            }
        })

        if(exisitingSalesMan){
            return response.status(409).json({
                message : 'Account already exists'
            })
        };
        const hashedPassword  = await bcrypt.hash(password, 10)
        const newSalesman = await Salesman.create({
            name : name ,
            password : hashedPassword,
            phoneNumber : phoneNumber,
            cardInfo : cardInfo,
            addressInfo : addressInfo,
            role : "salesman",
            token : process.env.SECRET_KEY
        })

        const token = jwt.sign({userId : newSalesman.Id}, process.env.SECRET_KEY, {expiresIn : 3600})
        newSalesman.token = token 
        await   newSalesman.save()

       const  salesmanInfo = {
            Id  : newSalesman.Id,
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
            salesmanInfo
        })
    } catch (error) {
        next(error)
    }
}

const loginAccount = async (request, response, next ) =>{
 const {phoneNumber , password } = request.body;

 try {
    const exisitingSalesMan = await Salesman.findOne({
        where : {
          phoneNumber:phoneNumber
        }
    })
    if(!exisitingSalesMan) {
        return response.status(404).json({
            message : 'Account not found'
        })
    }

    const isTruePassword = await bcrypt.compare(password, exisitingSalesMan.password);
    if(!isTruePassword) {
        return response.status(409).json({
            message : 'Invalid password'
        })
    }

    const token = jwt.sign({userId : exisitingSalesMan.Id}, process.env.SECRET_KEY, {expiresIn : 3600})
    exisitingSalesMan.token = token
    await exisitingSalesMan.save()
    const  salesmanInfo = {
        Id : exisitingSalesMan.Id,
        name : exisitingSalesMan.name,
        phoneNumber :exisitingSalesMan.phoneNumber,
        cardInfo :exisitingSalesMan.cardInfo,
        addressInfo : exisitingSalesMan.addressInfo,
        role : "salesman",
        token : token 
    }
    response.cookie('token', token, { httpOnly: true });
    return response.status(200).json({
        message : 'Logged in succesfully',
        salesmanInfo
    })
 } catch (error) {
    next(error)
 }

}

const Logout = async (request, response, next ) =>{
    const {salesmanId} = request.params
    try {
        const salesman = await Salesman.findByPk(salesmanId)
        salesman.token = null

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