const redisClient = require('../utils/connectRedis');
const sequelize = require('../utils/connectPostrges')
// Connect redis

describe("It should connect Redis", () => {
  it("Connect redis", async () => {
     try{
           await redisClient.connect();
           console.log("Redis connection established")
     }catch(err){
           console.log("Could not connect Redis : ", err)
           throw err 
       }  
  });
});



//Connect Elastic 
