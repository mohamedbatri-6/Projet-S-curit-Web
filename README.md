# Support Ticket Security Project

Projet final - Securite web avancee.

Cette branche contient la version securisee d'une application de tickets de support.

## Stack

- Frontend: Next.js
- Backend: Node.js + Express
- Base de donnees: MongoDB

## Structure

```text
frontend/   Interface web Next.js
backend/    API REST Express + MongoDB
docs/       Notes de demonstration et captures
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
npm run dev -- -p 3001
```

Frontend: http://localhost:3001

Backend: http://localhost:4000

## Comptes de test

| Role | Email | Mot de passe |
| --- | --- | --- |
| user | user1@example.com | User1Secure!2026 |
| user | user2@example.com | User2Secure!2026 |
| admin | admin@example.com | AdminSecure!2026 |

## Collections MongoDB

MongoDB cree les collections automatiquement au premier insert.

### users

| Champ | Type | Exemple |
| --- | --- | --- |
| `_id` | ObjectId | genere par MongoDB |
| `name` | String | Alice User |
| `email` | String | user1@example.com |
| `password` | String hash bcrypt | masque dans les reponses API |
| `role` | String | user ou admin |
| `createdAt` | Date | automatique |
| `updatedAt` | Date | automatique |

### tickets

| Champ | Type | Exemple |
| --- | --- | --- |
| `_id` | ObjectId | genere par MongoDB |
| `title` | String | Demande de mise a jour du profil |
| `description` | String | Je souhaite modifier les informations affichees |
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

## Securisations appliquees dans cette branche

- mots de passe hashes avec bcrypt ;
- authentification par cookie HTTP-only ;
- validation stricte des identifiants ;
- messages d'erreur generiques ;
- rate limiting sur le login ;
- controle ownership sur les tickets ;
- route admin protegee par role ;
- suppression du rendu HTML dangereux ;
- filtrage des champs sensibles ;
- headers HTTP via Helmet ;
- CORS limite a l'origine frontend configuree.
