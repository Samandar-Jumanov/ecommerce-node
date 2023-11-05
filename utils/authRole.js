const authRole = () =>{
    return (req, res, next) =>{
        if(req.user.role === 'salesman'){
            next()
        }else{
            res.status(403).json({message: 'This page is not for you '})
        }
    }
}
module.exports = {
    authRole
}