const nodemailer = require('nodemailer')
const { RoleAccesCode , User  } = require('../db-associations/customerAssociations')
const bcrypt = require('bcrypt')
const generateCode =  () =>{
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min +1 ) + min)
}

const sendMail = async (request , response , next ) =>{
  const { to , password  } = request.body 
  const email = "randomMail@gmail.com"
  const text = generateCode()
  const subject = `Change role `

   try {

    const customer = await User.findOne({
      where : { email : to } 
    })

    if(!customer){
      return response.status(404).json({
        message :'Please provide your account email.'
      })
    }

    const validPassword = await bcrypt.compare(customer.password , password )
    if(!validPassword){
      return response.status(409).json({
        message :' Invalid password '
      })
    }

    const transporter = nodemailer.createTransport({
      host : 'localhost',
      port : 587,
      secure : false ,
      auth : {
        user :' username',
        pass :'password '
      }
    })

   await transporter.sendMail({
      from : email,
      to : to ,
      subject : subject ,
      text : text 
    })

    await  customer.addAccesCode(text) 
    await customer.save();
    return response.json({
      message :" Mail sent "
    })

  } catch (error) {
    throw new Error(error)
   }
}


module.exports = {
    sendMail,
}