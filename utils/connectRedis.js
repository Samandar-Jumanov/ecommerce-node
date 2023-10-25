const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({url: process.env.REDIS_URL, legacyMode : true });

redisClient.connect().then(()=>{
    console.log('redis connected ')
}).catch(err=>{
    console.log(err)
})



module.exports = redisClient