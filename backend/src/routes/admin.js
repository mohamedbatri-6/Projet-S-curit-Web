import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const [users, tickets, comments] = await Promise.all([
      User.find(),
      Ticket.find().populate('owner', 'name email role').populate('assignedTo', 'name email role'),
      Comment.find().populate('author', 'name email role').populate('ticket', 'title status priority')
    ]);

    res.json({
      requestedBy: req.user.toJSON(),
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
