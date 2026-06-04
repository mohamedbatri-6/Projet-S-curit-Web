'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../lib/api';

export default function NewTicketPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    internalNote: ''
  });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const ticket = await api('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      window.location.href = `/tickets/${ticket._id}`;
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">Nouveau ticket</div>
        <Link className="btn" href="/tickets">Retour</Link>
      </div>

      <form className="panel stack" onSubmit={submit}>
        <label className="field">
          <span>Titre</span>
          <input value={form.title} onChange={(event) => update('title', event.target.value)} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea value={form.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <label className="field">
          <span>Priorite</span>
          <select value={form.priority} onChange={(event) => update('priority', event.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="closed">closed</option>
          </select>
        </label>
        <label className="field">
          <span>Note interne</span>
          <input value={form.internalNote} onChange={(event) => update('internalNote', event.target.value)} />
        </label>
        {error && <pre className="error">{error}</pre>}
        <button className="btn primary" type="submit">Creer</button>
      </form>
    </main>
  );
}

