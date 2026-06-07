'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">Admin</div>
        <Link className="btn" href="/tickets">Retour</Link>
      </div>

      {error && <pre className="error">{error}</pre>}

      {stats && (
        <section className="stack">
          <div className="grid">
            <div className="panel"><h2>{stats.counts.users}</h2><p>Utilisateurs</p></div>
            <div className="panel"><h2>{stats.counts.tickets}</h2><p>Tickets</p></div>
            <div className="panel"><h2>{stats.counts.comments}</h2><p>Commentaires</p></div>
          </div>

          <div className="panel stack">
            <h2>Utilisateurs</h2>
            <div className="table">
              <div className="row head">
                <span>Nom</span>
                <span>Email</span>
                <span>Role</span>
                <span>Creation</span>
              </div>
              {stats.users.map((user) => (
                <div className="row" key={user._id}>
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <h2>Tickets</h2>
            <div className="table">
              <div className="row head">
                <span>Titre</span>
                <span>Proprietaire</span>
                <span>Priorite</span>
                <span>Statut</span>
              </div>
              {stats.tickets.map((ticket) => (
                <div className="row" key={ticket._id}>
                  <span>{ticket.title}</span>
                  <span>{ticket.owner?.email}</span>
                  <span>{ticket.priority}</span>
                  <span>{ticket.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <h2>Commentaires</h2>
            <div className="table">
              <div className="row head">
                <span>Auteur</span>
                <span>Ticket</span>
                <span>Interne</span>
                <span>Contenu</span>
              </div>
              {stats.comments.map((comment) => (
                <div className="row" key={comment._id}>
                  <span>{comment.author?.email}</span>
                  <span>{comment.ticket?.title}</span>
                  <span>{String(comment.isInternal)}</span>
                  <span>{comment.body}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
