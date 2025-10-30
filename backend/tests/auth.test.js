const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  it('registers a user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('logs in an existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: 'login@example.com',
    });
  });
});
