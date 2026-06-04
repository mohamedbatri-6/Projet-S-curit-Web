'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_URL, setSession } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('user1@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      setSession(data.token, data.user);
      window.location.href = '/tickets';
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <form className="panel form stack" onSubmit={submit}>
        <h1>Connexion</h1>
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <pre className="error">{error}</pre>}
        <button className="btn primary" type="submit">Se connecter</button>
        <Link href="/register">Creer un compte</Link>
      </form>
    </main>
  );
}

