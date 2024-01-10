const Salesman = require('../salesman-models/salesman')
const Product = require('../salesman-models/products')
const ProductRates = require('../salesman-models/productRates')
const {ProductType} = require('../admin/associations');


Product.belongsTo(Salesman , {
    foreignKey :'salesManId'
})

Salesman.hasMany(Product, {
    foreignKey :'salesManId',
    as : 'products'
})

ProductRates.belongsTo(Product , {
    foreignKey :'ownerId'
})

Product.hasMany(ProductRates , {
    foreignKey :'ownerId',
    as :'productRates'
})




Product.belongsTo(ProductType, {
    foreignKey :'productCaseId'
});

ProductType.hasMany(Product , {
    foreignKey : "productCaseId" , as :'products'
})


module.exports ={
    Salesman , 
    Product,
    ProductRates,
    ProductType
}