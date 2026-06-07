'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getUser, logout } from '../../lib/api';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const user = getUser();

  async function loadTickets(query = '') {
    setError('');
    try {
      const path = query ? `/api/tickets?search=${encodeURIComponent(query)}` : '/api/tickets?mine=true';
      const data = await api(path);
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <main className="shell">
      <div className="topbar">
        <div>
          <div className="brand">Tickets</div>
          <div className="muted">{user?.email} - {user?.role}</div>
        </div>
        <div className="nav">
          <Link className="btn primary" href="/tickets/new">Nouveau ticket</Link>
          {user?.role === 'admin' && <Link className="btn" href="/admin">Admin</Link>}
          <button className="btn" onClick={logout}>Deconnexion</button>
        </div>
      </div>

      <section className="panel stack">
        <form className="nav" onSubmit={(event) => { event.preventDefault(); loadTickets(search); }}>
          <input placeholder="Recherche" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button className="btn" type="submit">Rechercher</button>
          <button className="btn" type="button" onClick={() => { setSearch(''); loadTickets(); }}>Mes tickets</button>
        </form>
        {error && <pre className="error">{error}</pre>}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        {tickets.map((ticket) => (
          <Link className="card stack" key={ticket._id} href={`/tickets/${ticket._id}`}>
            <h2>{ticket.title}</h2>
            <div className="nav">
              <span className="badge">{ticket.status}</span>
              <span className="badge">{ticket.priority}</span>
            </div>
            <p className="muted">Owner: {ticket.owner?.email}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
