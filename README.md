# Support Ticket Security Project

Projet final - Securite web avancee.

Cette branche contient la version volontairement vulnerable d'une application de tickets de support.

## Stack

- Frontend: Next.js
- Backend: Node.js + Express
- Base de donnees: MongoDB

## Structure

```text
frontend/   Interface web Next.js
backend/    API REST Express + MongoDB
docs/       Notes de demonstration et captures a ajouter
```

## Lancement

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

Backend: http://localhost:4000

## Comptes de test

| Role | Email | Mot de passe |
| --- | --- | --- |
| user | user1@example.com | password123 |
| user | user2@example.com | password123 |
| admin | admin@example.com | admin123 |

## Collections MongoDB

MongoDB cree les collections automatiquement au premier insert.

### users

| Champ | Type | Exemple |
| --- | --- | --- |
| `_id` | ObjectId | genere par MongoDB |
| `name` | String | Alice User |
| `email` | String | user1@example.com |
| `password` | String | password123 |
| `role` | String | user ou admin |
| `createdAt` | Date | automatique |
| `updatedAt` | Date | automatique |

### tickets

| Champ | Type | Exemple |
| --- | --- | --- |
| `_id` | ObjectId | genere par MongoDB |
| `title` | String | Probleme de connexion |
| `description` | String | Je ne peux pas me connecter |
| `priority` | String | low, medium, high |
| `status` | String | open, in_progress, closed |
| `owner` | ObjectId ref users | utilisateur createur |
| `assignedTo` | ObjectId ref users ou null | admin/support |
| `internalNote` | String | note interne support |
| `createdAt` | Date | automatique |
| `updatedAt` | Date | automatique |

### comments

| Champ | Type | Exemple |
| --- | --- | --- |
| `_id` | ObjectId | genere par MongoDB |
| `ticket` | ObjectId ref tickets | ticket concerne |
| `author` | ObjectId ref users | auteur du commentaire |
| `body` | String | contenu du commentaire |
| `isInternal` | Boolean | false |
| `createdAt` | Date | automatique |
| `updatedAt` | Date | automatique |

## Failles intentionnelles dans cette branche

Cette version est volontairement vulnerable et ne doit pas etre utilisee en production.

- NoSQL injection sur `/api/auth/login`.
- IDOR/BOLA sur `/api/tickets/:id`.
- XSS stockee dans les descriptions et commentaires de tickets.
- Authentification faible: mots de passe en clair, JWT faible, messages d'erreur trop precis, pas de rate limiting.
- Mass assignment sur les mises a jour utilisateurs/tickets.
- Information disclosure: erreurs detaillees, donnees utilisateur trop exposees, headers de securite absents.
- CORS ouvert a toutes les origines.

