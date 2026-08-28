const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

test('Auth System', async (t) => {
  let cookies = [];
  let accessToken = '';

  // Setup DB for tests
  await db.sequelize.sync({ force: true });

  await t.test('Register valid user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('Register duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User 2', email: 'test@example.com', password: 'password123' });
    
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.message, 'Email already registered');
  });

  await t.test('Login correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.accessToken);
    assert.ok(res.body.user);
    assert.strictEqual(res.body.user.email, 'test@example.com');
    assert.strictEqual(res.body.user.password, undefined, 'Password should not be returned');

    accessToken = res.body.accessToken;
    const setCookie = res.headers['set-cookie'];
    assert.ok(setCookie, 'Should set cookie');
    cookies = setCookie;
  });

  await t.test('Login wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, 'Invalid email or password');
  });

  await t.test('Access Protected Route', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.email, 'test@example.com');
    assert.strictEqual(res.body.data.password, undefined);
  });

  await t.test('Refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies);
    
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.accessToken);
    assert.notStrictEqual(res.body.accessToken, accessToken, 'Should return a new access token');
    cookies = res.headers['set-cookie'];
  });

  await t.test('Logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies);
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'Logged out successfully');

    // Attempting to refresh again should fail because token is revoked
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies); // send old cookie
    
    assert.strictEqual(refreshRes.status, 401);
  });
});
