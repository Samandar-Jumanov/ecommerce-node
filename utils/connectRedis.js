const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({url: process.env.REDIS_URL, legacyMode : true });

(async function(){
   try{
    await redisClient.connect();
    console.log("Connected to redis ")
   }catch(err){
        throw new Error(err.message , 500)
   };
})

module.exports =  redisClient;