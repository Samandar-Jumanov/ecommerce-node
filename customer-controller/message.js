const {Messages , Salesman } = require('../db-associations/salesManAssocitions');
const {User , CustomerMessages} = require('../db-associations/customerAssociations')
const sequelize = require('../utils/connectPostrges');
const amqplib = require('amqplib');
const redisClient = require('../utils/connectRedis')
require('dotenv').config();

const generateLog = ( recieverUserId , senderUserId ) =>{
    return  `log=${recieverUserId}${senderUserId}`;
}


const generateExchangeName = (recieverUserId , senderUserId) =>{
    return `exchange=${recieverUserId + senderUserId}`;
}

const postMessage = async (request , response , next ) =>{
    const {senderUserId, recieverUserId, content} = request.body;
    let log = generateLog( recieverUserId ,senderUserId  ) 
    let exchange= generateExchangeName(recieverUserId ,senderUserId)
  
    let  t ;
    try{
        t = await sequelize.transaction();
        const connection = await amqplib.connect('amqp://localhost')
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, 'direct');
        const sentMessage =   await channel.publish(exchange, log, Buffer.from(content));

            const newMessage =  await Messages.create({
                salesmanId :  recieverUserId, 
                customerId :  senderUserId, 
                message: sentMessage,
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
    const { senderUserId , recieverUserId } = request.params;
    let exchange= generateExchangeName(recieverUserId ,senderUserId)
    try {
      let recentMessage = ''
      const connection = await amqplib.connect('amqp://localhost')
      const channel = await connection.createChannel()
      await channel.assertExchange(exchange, "direct",  { durable : false })
      const queue = await channel.assertQueue('', { exclusive: true })
      await channel.bindQueue(queue.queue, exchange, "error")
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue)
      channel.consume(queue.queue, (msg) => {
      console.log(" [x] Received %s", msg.content.toString())
      recentMessage = msg.toString();
      channel.ack(msg)
  }, { noAck: false })

      const salesman = await User.findByPk(senderUserId , {
        include : {
          model : CustomerMessages,
          as :'customerMessages'

        }
      } );
      const salesmanMessages = await salesman.getCustomerMessages();
  
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
        messages: messages,
        recentMessage : recentMessage
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




