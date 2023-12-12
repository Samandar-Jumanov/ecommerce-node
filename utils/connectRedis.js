const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({url: process.env.REDIS_URL, legacyMode : true });
module.exports = redisClient