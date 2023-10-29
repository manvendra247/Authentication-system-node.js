const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

describe('User Session Management', () => {
  let token;

  // Test for user registration
  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password'
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  // Test for user login
  it('should authenticate a user', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'john@example.com',
      password: 'password'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  // Test for user profile update
  it('should update user profile', async () => {
    const res = await request(app).put('/api/users/profile').set('Authorization', `Bearer ${token}`).send({
      name: 'Jane Doe',
      email: 'jane@example.com'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Jane Doe');
    expect(res.body).toHaveProperty('email', 'jane@example.com');
  });

  // Test for user password change
  it('should change user password', async () => {
    const res = await request(app).put('/api/users/change-password').set('Authorization', `Bearer ${token}`).send({
      oldPassword: 'password',
      newPassword: 'newPassword'
    });

    expect(res.statusCode).toEqual(200);
  });

  // Test for user logout
  it('should logout a user', async () => {
    const res = await request(app).post('/api/users/logout').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
});
