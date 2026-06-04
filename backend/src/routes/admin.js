import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const [users, tickets, comments] = await Promise.all([
      User.find(),
      Ticket.find().populate('owner').populate('assignedTo'),
      Comment.find().populate('author').populate('ticket')
    ]);

    res.json({
      requestedBy: req.user,
      counts: {
        users: users.length,
        tickets: tickets.length,
        comments: comments.length
      },
      users,
      tickets,
      comments
    });
  } catch (error) {
    next(error);
  }
});

export default router;

