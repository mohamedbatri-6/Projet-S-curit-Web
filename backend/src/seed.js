import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import { User } from './models/User.js';
import { Ticket } from './models/Ticket.js';
import { Comment } from './models/Comment.js';

await connectDb();

await Promise.all([
  User.deleteMany({}),
  Ticket.deleteMany({}),
  Comment.deleteMany({})
]);

const [user1, user2, admin] = await User.create([
  { name: 'Alice User', email: 'user1@example.com', password: 'User1Secure!2026', role: 'user' },
  { name: 'Bob User', email: 'user2@example.com', password: 'User2Secure!2026', role: 'user' },
  { name: 'Admin Support', email: 'admin@example.com', password: 'AdminSecure!2026', role: 'admin' }
]);

const [ticket1, ticket2, ticket3] = await Ticket.create([
  {
    title: 'Demande de mise a jour du profil',
    description: 'Je souhaite modifier les informations affichees sur mon profil utilisateur.',
    priority: 'medium',
    status: 'open',
    owner: user1._id,
    assignedTo: admin._id,
    internalNote: 'Verifier les informations avant validation.'
  },
  {
    title: 'Question sur les options du compte',
    description: 'Je voudrais recevoir plus de details sur les options disponibles pour mon compte.',
    priority: 'medium',
    status: 'in_progress',
    owner: user2._id,
    assignedTo: admin._id,
    internalNote: 'Repondre avec la liste des options actives.'
  },
  {
    title: 'Demande de suivi de dossier',
    description: 'Je souhaite obtenir une mise a jour sur le suivi de mon dossier.',
    priority: 'low',
    status: 'open',
    owner: user1._id,
    assignedTo: null,
    internalNote: 'Demande simple de suivi.'
  }
]);

await Comment.create([
  {
    ticket: ticket1._id,
    author: user1._id,
    body: 'Bonjour, pouvez-vous prendre en compte ma demande ?',
    isInternal: false
  },
  {
    ticket: ticket2._id,
    author: user2._id,
    body: 'Merci pour les informations.',
    isInternal: false
  },
  {
    ticket: ticket2._id,
    author: admin._id,
    body: 'Note interne visible dans la version vulnerable.',
    isInternal: true
  }
]);

console.log('Seed complete');
console.table([
  { role: 'user', email: user1.email, password: 'User1Secure!2026' },
  { role: 'user', email: user2.email, password: 'User2Secure!2026' },
  { role: 'admin', email: admin.email, password: 'AdminSecure!2026' }
]);

await mongoose.disconnect();
