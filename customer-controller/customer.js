const {User} = require('../db-associations/customerAssociations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../utils/connectRedis');
require('dotenv').config();

const getAllUsers = async (request, response, next) => {
    try {
      const allUsers = await User.findAll();
      const usersData = [];

      for (const user of allUsers) {
        const data = await redisClient.hGet('users', user.email);
        if (!data) {
          await redisClient.hSet('users', user.email, JSON.stringify(user) , );
          usersData.push(user);
        } else {
          usersData.push(JSON.parse(data));
        }
      }
  
      return response.json({
        allUsers: usersData
      });      
    } catch (error) {
      next(error);
    }
  };

const Signup = async (request , response , next ) =>{
    const {username , password , email    } =  request.body;
    try {
        const user = await User.findOne({
            where : {email}
        });
        
        if(user){
            return response.status(409).json({
                message : 'User already exists '
            });
        };

        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await User.create({
            username : username ,
            password : hashedPassword,
            email : email , 
            token : process.env.SECRET_KEY,
            role :"customer"
        });

        const token = await jwt.sign({userId : newUser.id}, process.env.SECRET_KEY);
        newUser.token = token;
        await newUser.save();
        response.cookie('token', token, { httpOnly: true });
        return response.status(201).json({
            username : newUser.username,
            userId : newUser.Id,
            token :  token,
            role : "customer" 
        });
        } catch (error) {
            console.log(error);
            next(error)
    };
};

const Login = async (request , response , next ) =>{
    const {email , password } = request.body;

    try {
        const user = await User.findOne({
            where : {email}
        });
        
        if(!user){
            return response.status(404).json({
                message :'User not  found  '
            });
        };

        const isTruePassword = await bcrypt.compare(password , user.password);

        if(!isTruePassword){
            return response.status(409).json({
                message :'Invalid password '
            });
        };

        const newToken = await jwt.sign({userId : user.Id}, process.env.SECRET_KEY);
        user.token =  newToken;
        await user.save();
        
        response.cookie('token', newToken, { httpOnly: true });
        return response.status(200).json({
            username: user.username ,
            userId : user.id,
            token : newToken, 
            message :'Logged in succesfully'
        })
    } catch (error) {
            next(error)        
    };
};

const Logout = async (request, response, next ) =>{
    const {customerId } = request.params;
    try {
        const user = await User.findByPk(customerId);
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
    const {email , password } = request.body;
  
    try {
        const user = await User.findOne({ where : {email}});

        if(!user) {
            return response.status(404).json({ message :'User not found ' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return response.status(409).json({message : "Incorrect acces code "})
        };

        user.role = "salesman"
        await user.save();
        return response.status(201).json({
            message :'Succesfully changed '
        });
    } catch (error) {
        next(error)
    };
};

module.exports ={
    Signup,
    Login ,
    getAllUsers,
    changeRole,
    Logout
}

