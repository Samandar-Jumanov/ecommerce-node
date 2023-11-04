const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
      apiKey: process.env.ELASTIC_API_KEY
  }
});

module.exports = client;