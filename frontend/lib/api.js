export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function setSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  sessionStorage.removeItem('user');
  window.location.href = '/login';
}

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}
