'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, getUser } from '../../../lib/api';

export default function TicketDetailPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('open');
  const [error, setError] = useState('');
  const user = getUser();

  async function loadTicket() {
    setError('');
    try {
      const result = await api(`/api/tickets/${params.id}`);
      setData(result);
      setStatus(result.ticket.status);
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveStatus(event) {
    event.preventDefault();
    try {
      const ticket = await api(`/api/tickets/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      setData((current) => ({ ...current, ticket }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function addComment(event) {
    event.preventDefault();
    try {
      await api(`/api/tickets/${params.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: comment })
      });
      setComment('');
      loadTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTicket();
  }, []);

  return (
    <main className="shell">
      <div className="topbar">
        <div>
          <div className="brand">Detail ticket</div>
          <div className="muted">Connecte: {user?.email} - {user?.role}</div>
        </div>
        <Link className="btn" href="/tickets">Retour</Link>
      </div>

      {error && <pre className="error">{error}</pre>}

      {data && (
        <section className="stack">
          <article className="panel stack">
            <h1>{data.ticket.title}</h1>
            <div className="nav">
              <span className="badge">{data.ticket.status}</span>
              <span className="badge">{data.ticket.priority}</span>
              <span className="badge">{data.ticket.owner?.email}</span>
            </div>
            <div className="ticket-body" dangerouslySetInnerHTML={{ __html: data.ticket.description }} />
            <p className="muted">Note interne: {data.ticket.internalNote}</p>
          </article>

          <form className="panel nav" onSubmit={saveStatus}>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
            </select>
            <button className="btn" type="submit">Changer le statut</button>
          </form>

          <section className="panel stack">
            <h2>Commentaires</h2>
            {data.comments.map((item) => (
              <div className="card stack" key={item._id}>
                <div className="muted">{item.author?.email} - internal={String(item.isInternal)}</div>
                <div dangerouslySetInnerHTML={{ __html: item.body }} />
              </div>
            ))}

            <form className="stack" onSubmit={addComment}>
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
              <button className="btn primary" type="submit">Ajouter un commentaire</button>
            </form>
          </section>
        </section>
      )}
    </main>
  );
}
