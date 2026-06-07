'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_URL, setSession } from '../../lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      setSession(data.user);
      window.location.href = '/tickets';
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <form className="panel form stack" onSubmit={submit}>
        <h1>Inscription</h1>
        <label className="field">
          <span>Nom</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => update('email', event.target.value)} />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} />
        </label>
        {error && <pre className="error">{error}</pre>}
        <button className="btn primary" type="submit">Creer le compte</button>
        <Link href="/login">Deja inscrit ?</Link>
      </form>
    </main>
  );
}
