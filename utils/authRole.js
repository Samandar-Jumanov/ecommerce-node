
const authRole = (request , response , next ) =>{
    const { role } = request.headers;
    if (role && role === 'admin') {
      next();
    } else {
      response.status(403).json({
        message: 'Unauthorized access.',
      });
    }
}

module.exports = {
    authRole
}