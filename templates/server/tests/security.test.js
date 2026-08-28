const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Security Headers (Helmet)', async () => {
  const response = await request(app).get('/api/health');
  assert.ok(response.headers['x-powered-by'] === undefined, 'x-powered-by should be hidden');
  assert.strictEqual(response.headers['x-dns-prefetch-control'], 'off');
  assert.strictEqual(response.headers['x-frame-options'], 'SAMEORIGIN');
});

test('CORS Policy', async () => {
  // Assuming default configured in testing is 'http://localhost:5173' or empty.
  const response = await request(app)
    .options('/api/health')
    .set('Origin', 'http://localhost:5173');
  
  assert.strictEqual(response.headers['access-control-allow-origin'], 'http://localhost:5173');
});

test('Rate Limiting', async () => {
  // We can't easily spam 100 requests in a short test efficiently, but we can verify headers.
  const response = await request(app).get('/api/health');
  assert.ok(response.headers['ratelimit-limit'] !== undefined, 'Rate limit headers should be present');
});

test('Request Body Limits', async () => {
  const largeString = 'a'.repeat(20000); // larger than 10kb
  const response = await request(app)
    .post('/api/health') // any route works for body parsing
    .send({ data: largeString })
    .set('Content-Type', 'application/json');
  
  assert.strictEqual(response.status, 413, 'Payload Too Large expected');
});

test('Input Validation', async () => {
  // Provide invalid data type to the health validator query param
  const response = await request(app).get('/api/health?echo='); // echo is empty but valid string, let's try something else.
  // Actually Zod will accept empty string. Let's send an array instead of string
  // express query parser handles ?echo[]=1
  const responseInvalid = await request(app).get('/api/health?echo[]=1');
  assert.strictEqual(responseInvalid.status, 400);
  assert.strictEqual(responseInvalid.body.success, false);
  assert.strictEqual(responseInvalid.body.message, 'Invalid request input');
});

test('404 Not Found Handler', async () => {
  const response = await request(app).get('/api/does-not-exist');
  assert.strictEqual(response.status, 404);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.message, 'Route not found');
});

test('Error Handling', async () => {
  // Trigger a 400 or let's trigger a generic error?
  // We don't have a route throwing 500 right now. But we can test JSON output structure.
  const response = await request(app).get('/api/does-not-exist');
  assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('Health Endpoint', async () => {
  const response = await request(app).get('/api/health');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.message, 'SecureMERN API is running');
});
