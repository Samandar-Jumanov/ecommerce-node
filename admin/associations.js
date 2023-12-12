const {Admin} = require('./admin-model')
const {ProductType} = require('./productCaseModel')

ProductType.belongsTo(Admin, {
    foreignKey : "adminId"
})

Admin.hasMany(ProductType , {
    foreignKey : "adminId" , as :'productCases'
})




module.exports = {
    ProductType ,
    Admin 
   
};

