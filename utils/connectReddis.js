require('dotenv').config();

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    legacyMode : true,
})





module.exports = redisClient;
