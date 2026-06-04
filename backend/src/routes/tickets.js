import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Ticket } from '../models/Ticket.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.search) {
      filter.$where = `this.title.includes("${req.query.search}") || this.description.includes("${req.query.search}")`;
    }

    if (req.query.mine === 'true') {
      filter.owner = req.user._id;
    }

    const tickets = await Ticket.find(filter)
      .populate('owner')
      .populate('assignedTo')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      owner: req.body.owner || req.user._id
    });

    const fullTicket = await Ticket.findById(ticket._id).populate('owner').populate('assignedTo');
    res.status(201).json(fullTicket);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('owner').populate('assignedTo');
    const comments = await Comment.find({ ticket: req.params.id }).populate('author').sort({ createdAt: 1 });

    if (!ticket) {
      return res.status(404).json({ message: `Ticket ${req.params.id} not found` });
    }

    res.json({ ticket, comments });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false
    }).populate('owner').populate('assignedTo');

    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ ticket: req.params.id });
    res.json({ message: `Ticket ${req.params.id} deleted by ${req.user.email}` });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      ticket: req.params.id,
      author: req.body.author || req.user._id
    });

    const fullComment = await Comment.findById(comment._id).populate('author');
    res.status(201).json(fullComment);
  } catch (error) {
    next(error);
  }
});

export default router;

