const request = require('supertest');
const app = require('../app');
const redis = require('../utils/connectRedis')

describe('Connect redis', () => {
  it(" should connect redis ", async ()=>{
       await redis.connect();
  })
})


describe('GET /',  () => {
  it('responds with hello message', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello world');
    expect(response.status).toBe(200);
  });
});


