const {Messages , Salesman } = require('../db-associations/salesManAssocitions');
const {User , CustomerMessages} = require('../db-associations/customerAssociations')
const sequelize = require('../utils/connectPostrges');
const amqplib = require('amqplib');
const redisClient = require('../utils/connectRedis')

const postMessage = async (request , response , next ) =>{
    const {senderUserId, recieverUserId, content} = request.body;
    const exchange = `exchange=${recieverUserId + senderUserId}`;
    const log = `log=${recieverUserId}${senderUserId}`;
    let  t ;
    try{
        t = await sequelize.transaction();
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, 'direct');
        await channel.publish(exchange, log, Buffer.from(content));

            const newMessage =  await Messages.create({
                salesmanId :  recieverUserId, 
                customerId :  senderUserId, 
                message: content,
                costumerStatus: 'send',
                salesmanStatus: 'recieve'
            } , { transaction : t })

            const salesman = await Salesman.findByPk(recieverUserId)
            await salesman.addSalesmanMessages(newMessage , { transaction : t })
            const costumer = await User.findByPk(recieverUserId)
            const cutomerMessage = await CustomerMessages.create({
                salesmanId :  recieverUserId, 
                customerId :  senderUserId, 
                message: content,
                costumerStatus:'send',
                salesmanStatus:'recieve'
            })
            await costumer.addCustomerMessages(cutomerMessage, { transaction : t })
            await t.commit();
            response.status(201).json({
                message : "Sent succesfully"
            })
    }catch(error){
        console.log(error)
        await t.rollback();
        next(error)
    }
}
const cosumeMessages = async (request, response, next) => {
    const { senderUserId } = request.params;
  
    try {
      const salesman = await User.findByPk(senderUserId);
      const salesmanMessages = await salesman.getCostumerMessages();
  
      if (salesmanMessages.length === 0) {
        return response.status(200).json({
          message: 'No messages'
        });
      }
  
      const messages = [];
  
      for (const message of salesmanMessages) {
        const data = await redisClient.hGet('costumerMessages', message.Id);
  
        if (!data) {
          await redisClient.hSet('costumerMessages', message.Id, JSON.stringify(message));
          messages.push(message);
        } else {
          messages.push(JSON.parse(data));
        }
      }
  
      return response.status(200).json({
        messages: messages
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
module.exports = {
    postMessage,
    cosumeMessages
}




