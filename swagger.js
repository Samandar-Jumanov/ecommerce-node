const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const specs = swaggerJsdoc(
   { 
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'Ecommerce node api',
          version: '1.0.0',
          description: 'Documentation for your Node.js API',
          contact :{
            name :"Samandar Jumanov",
            email :"samandarjumanov055@gmail.com"
        }
        },
      },
      servers : [
        {
            url :'http://localhost:3001/'
        }
    ],
   

    apis: ['./customer-router/customerAuth', 
            './customer-router/saveProducts', 
            './salesman-router/salesman' ,
            './salesman-router/product',
            './customer-router/rating',
            './customer-router/payment',
            './customer-router/searchProduct',
            './admin/router'
    
    ], 
}
);



module.exports = {
  swaggerUi,
  specs,
};
