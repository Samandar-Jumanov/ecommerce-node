const {Product} = require('../db-associations/salesManAssocitions')
const {Admin} = require('./admin-model')
const {ProductCase} = require('./productCaseModel')

ProductCase.belongsTo(Admin, {
    foreignKey : "adminId"
})

Admin.hasMany(ProductCase , {
    foreignKey : "adminId" , as :'productCases'
})

Product.belongsTo(ProductCase, {
    foreignKey :'productCaseId'
})
ProductCase.hasMany(Product , {
    foreignKey : "productCaseId" , as :'products'
})


module.exports = {
    ProductCase ,
    Admin ,
    Product
};

