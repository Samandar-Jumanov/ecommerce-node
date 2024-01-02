const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true,
});



redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err.message);
    throw new Error(err.message, 500);
});

(async function connect(){
    try{
        await redisClient.connect();
        console.log("Connected redis")
    }catch(err){
         console.log(err.message)
    }
})();



module.exports = redisClient;
