const {Messages , Salesman } = require('../db-associations/salesManAssocitions');
const {User , CustomerMessages} = require('../db-associations/customerAssociations')
const sequelize = require('../utils/connectPostrges');
const amqplib = require('amqplib');



const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    // Use the connection object to create channels, publish messages, consume messages, etc.
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
};

connectToRabbitMQ();

const postMessage = async (request , response , next ) =>{
    const {senderUserId, recieverUserId, content} = request.body;
    const random = Math.floor(Math.random() * 10000000);
    const exchange = `log=${recieverUserId + senderUserId}key=${random}`;
    const log = `exchange=${recieverUserId}${senderUserId}key=${random}`;
    let  t ;
    try{
        t = await sequelize.transaction();
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, 'direct');
        await channel.publish(exchange, log, Buffer.from(content));
        console.log("Message sent ", content)
            const newMessage =  await Messages.create({
                salesmanId :  senderUserId, //should be salesman id 
                customerId :  recieverUserId, ///should be costumer id 
                messages: content,
                costumerStatus: 'recieve',
                salesmanStatus: 'send'
            } , { transaction : t })

            const customerMessages = await CustomerMessages.create(newMessage, { transaction : t })
            const salesman = await Salesman.findByPk(recieverUserId)
            const customer  = await User.findByPk(recieverUserId)
            await salesman.addSalesmanMessages(newMessage , { transaction : t })
            await customer.addCustomerMessages(customerMessages, { transaction : t })
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

// const getUserMessages = async (request, response, next ) =>{
//     const {userId} = request.params;
//     try {
//         const user = await User.findByPk(userId)
//         if(!user) return response.status(404).json({message :' User not found '})
//         const userMessages = 
        
//     } catch (error) {
        
//     }
// }


module.exports = {
    postMessage
}



