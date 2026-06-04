# Vulnerabilites intentionnelles - branche vulnerable

Ce fichier sert de brouillon pour le futur rapport `SECURITY_AUDIT.md`.

## VULN-01 - NoSQL Injection sur login

- Type: Injection / NoSQL Injection
- Endpoint: `POST /api/auth/login`
- Cause: le backend passe directement `email` et `password` depuis `req.body` dans `User.findOne`.
- Exemple: envoyer un objet JSON avec `$ne` au lieu d'une chaine.

## VULN-02 - IDOR/BOLA sur consultation de ticket

- Type: Broken Access Control / IDOR / BOLA
- Endpoint: `GET /api/tickets/:id`
- Cause: le backend recupere le ticket par ID sans verifier `owner`.
- Exemple: `user1` consulte un ticket appartenant a `user2`.

## VULN-03 - XSS stockee

- Type: XSS stockee
- Zones: description de ticket, commentaire
- Cause: le frontend utilise `dangerouslySetInnerHTML` sur du contenu utilisateur.
- Exemple: `<img src=x onerror=alert("xss")>`.

## VULN-04 - Authentification faible

- Type: Authentication weakness
- Zones: login, JWT, stockage token
- Cause: mots de passe en clair, messages d'erreur precis, secret JWT faible, token stocke dans `localStorage`, pas de rate limiting.

## VULN-05 - Mass Assignment

- Type: Mass Assignment
- Endpoints: `POST /api/auth/register`, `PATCH /api/users/me`, `POST /api/tickets`, `PATCH /api/tickets/:id`
- Cause: le backend accepte directement `req.body`.
- Exemple: creer un compte avec `role: "admin"` ou modifier `status`, `owner`, `assignedTo`.

## VULN-06 - Information Disclosure / Security Misconfiguration

- Type: Information disclosure / Security misconfiguration
- Zones: erreurs API, endpoint racine, listes utilisateurs, admin stats
- Cause: stack traces exposees, `process.env` retourne, donnees sensibles retournees, CORS ouvert.

