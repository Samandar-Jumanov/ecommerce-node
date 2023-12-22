require('dotenv').config();
const {Product} = require('../db-associations/salesManAssocitions');
const client = require('../utils/connectElastic')

const searchProducts = async (request, response, next) => {
  const { searchText } = request.query;
  try {
    const products = await Product.findAll();
    
    await client.helpers.bulk({
      datasource: products,
      pipeline: process.env.ELASTIC_PIPELINE,
      onDocument: (doc) => ({ index: { _index: process.env.ELASTIC_INDEX}}),
    });

    const searchResult = await client.search({
      index:  process.env.ELASTIC_INDEX,
      q: searchText,
    });
    
    const allProducts = searchResult.hits.hits.map((hit) => hit._source.name);
    return response.status(200).json(allProducts);
  } catch (error) {
    response.status(500).send('An error occurred while searching for products.');
  }
};

module.exports = {
  searchProducts,
};