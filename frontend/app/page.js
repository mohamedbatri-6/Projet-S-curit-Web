import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">Support Tickets</div>
        <div className="nav">
          <Link className="btn" href="/login">Connexion</Link>
          <Link className="btn primary" href="/register">Inscription</Link>
        </div>
      </div>

      <section className="panel">
        <h1>Application de tickets de support</h1>
        <p className="muted">
          Version vulnerable pour le projet final de securite web avancee.
        </p>
      </section>
    </main>
  );
}

