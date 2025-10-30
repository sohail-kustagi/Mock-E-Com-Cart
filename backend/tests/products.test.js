const request = require('supertest');
const app = require('../server');
const Product = require('../models/Product');

describe('Products API', () => {
  it('returns seeded products', async () => {
    await Product.insertMany([
      { name: 'Product A', price: 10 },
      { name: 'Product B', price: 20 },
    ]);

    const res = await request(app).get('/api/products').expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });
});
