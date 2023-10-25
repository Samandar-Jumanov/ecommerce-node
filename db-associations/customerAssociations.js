const {User} = require('../customer-model/customer')
const { SavedProducts } = require('../customer-model/savedProducts')
const { Payment } = require('../customer-model/payments')
const RateBoughtProducts = require('../customer-model/Rate')

SavedProducts.belongsTo(User, {
    foreignKey: 'customerId',
})

User.hasMany(SavedProducts, {
    foreignKey : 'customerId',
    as :'savedProducts',
})

Payment.belongsTo(User , {
    foreignKey: 'customerId',
})
User.hasMany(Payment, {
    foreignKey : 'customerId',
    as : 'payments',
})

RateBoughtProducts.belongsTo(User, {
    foreignKey :'customerId'
})

User.hasMany(RateBoughtProducts , {
    foreignKey :'customerId',
    as :'rateProducts'
})




module.exports = {
    User,
    SavedProducts,
    Payment ,
    RateBoughtProducts,
}