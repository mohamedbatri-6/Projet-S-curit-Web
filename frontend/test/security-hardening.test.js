import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('frontend does not render user content with dangerouslySetInnerHTML', () => {
  const ticketDetail = read('../app/tickets/[id]/page.js');
  assert.equal(ticketDetail.includes('dangerouslySetInnerHTML'), false);
});

test('registration form does not expose role selection', () => {
  const registerPage = read('../app/register/page.js');
  assert.equal(registerPage.includes('admin</option>'), false);
  assert.equal(registerPage.includes('Role'), false);
});

test('frontend does not store JWT in localStorage', () => {
  const api = read('../lib/api.js');
  assert.equal(api.includes("localStorage.setItem('token'"), false);
  assert.equal(api.includes('Authorization:'), false);
});

