require('dotenv').config();
const jwt = require('jsonwebtoken')

const  authenticateToken = async (req, res, next) =>  {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return res.sendStatus(401); 
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach the user object to the request
      next(); // Pass the request to the next middleware
    });
  }

  module.exports = authenticateToken



