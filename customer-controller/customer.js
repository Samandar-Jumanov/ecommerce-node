const {User} = require('../db-associations/customerAssociations')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const redisClient = require('../utils/connectReddis')
require('dotenv').config()

const getAllUsers = async (request , response , next ) =>{
    try {
        const allUsers = await User.findAll()
    //      allUsers.forEach(user => {
    //      const data  =  redisClient.hGet(user.email )
    //        if(!data){
    //         redisClient.hSet(user.email, user)
    //        }
    //        return response.json({
    //         allUsers : JSON.parse(data)
    //        })
    //    })

        return   response.json({
            allUsers : allUsers
        })
    } catch (error) {
        next(error)
    }
}

const Signup = async (request , response , next ) =>{
    const {username , password , email , role   } =  request.body 
    try {
        const user = await User.findOne({
            where : {email}
        } )
        
        if(user){
            return response.status(409).json({
                message : 'User already exists '
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        const newUser = await User.create({
            username : username ,
            password : hashedPassword,
            email : email , 
            token : process.env.SECRET_KEY,
            role :role
        } )
        
       

        const token = await jwt.sign({userId : newUser.id}, process.env.SECRET_KEY)
        newUser.token = token
        await newUser.save()
        response.cookie('token', token, { httpOnly: true });
        return response.status(201).json({
            username : newUser.username,
            userId : newUser.id ,
            token :  token,
            role : role 
        })
        } catch (error) {
            console.log(error)
            next(error)
    }
}

const Login = async (request , response , next ) =>{
    const {email , password } = request.body 

    try {
        const user = await User.findOne({
            where : {email}
        })
        
        if(!user){
            return response.status(404).json({
                message :'User not  found  '
            })
        }

        const isTruePassword = await bcrypt.compare(password , user.password)

        if(!isTruePassword){
            return response.status(409).json({
                message :'Invalid password '
            })
        }

        const newToken = await jwt.sign({userId : user.id}, process.env.SECRET_KEY)
        user.token =  newToken
        await user.save()
        response.cookie('token', newToken, { httpOnly: true });
        return response.status(200).json({
            username: user.username ,
            userId : user.id,
            token : newToken, 
            message :'Logged in succesfully'
        })

    } catch (error) {
            next(error)        
    }
}

const Logout = async (request, response, next ) =>{
    const {customerId } = request.params 
    try {
        const user = await User.findByPk(customerId)
        user.token = null
        await response.clearCookie('token')
        await user.save()
        return response.status(200).json({
            message: 'Logged out successfully',
          });

        } catch (error) {
          next(error);
        }
    } 

const changeRole = async (request , response , next ) =>{
    const {userId , accesCode} = request.params 
  
    try {
        const user = await User.findByPk(userId)

        if(!user) {
            return response.status(404).json({
                message :'User not found '
            })
        }

        const userAccesCode = await user.getAccesCode()
        if(userAccesCode !== accesCode){
            return response.status(409).json({
                message : "Incorrect acces code "
            })
        }
        user.role = "salesman"
        await user.save()
        return response.status(201).json({
            message :'Succesfully changed '
        })
    } catch (error) {
        next(error)
    }
}

module.exports ={
    Signup,
    Login ,
    getAllUsers,
    changeRole,
    Logout
}

