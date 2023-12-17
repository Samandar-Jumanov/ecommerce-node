const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({url: process.env.REDIS_URL, legacyMode : true });
(async function(){
    try{
      await redisClient.connect(); 
      console.log("Redis connected ")
    }catch{
     throw new Error("Failed to connect redis", 500)
    }
})()
module.exports = redisClient