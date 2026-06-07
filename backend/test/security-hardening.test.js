import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('ticket search does not use MongoDB $where', () => {
  const ticketsRoute = read('../src/routes/tickets.js');
  assert.equal(ticketsRoute.includes('$where'), false);
});

test('auth route rejects object-shaped credentials before querying MongoDB', () => {
  const authRoute = read('../src/routes/auth.js');
  assert.match(authRoute, /typeof email !== 'string'/);
  assert.match(authRoute, /typeof password !== 'string'/);
});

test('registration does not trust a client-provided role', () => {
  const authRoute = read('../src/routes/auth.js');
  assert.match(authRoute, /role: 'user'/);
  assert.equal(authRoute.includes('role: req.body.role'), false);
});

test('API error handler does not return stack traces or headers', () => {
  const server = read('../src/server.js');
  assert.equal(server.includes('stack: error.stack'), false);
  assert.equal(server.includes('headers: req.headers'), false);
});

