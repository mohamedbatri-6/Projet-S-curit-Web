import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Ticket } from '../models/Ticket.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

const allowedPriorities = ['low', 'medium', 'high'];
const allowedStatuses = ['open', 'in_progress', 'closed'];

function isAdmin(user) {
  return user.role === 'admin';
}

function isOwner(ticket, user) {
  return ticket.owner?._id?.toString() === user._id.toString() || ticket.owner?.toString() === user._id.toString();
}

function canRead(ticket, user) {
  return isAdmin(user) || isOwner(ticket, user);
}

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = {};

    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const safeSearch = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      filter.$or = [{ title: safeSearch }, { description: safeSearch }];
    }

    if (!isAdmin(req.user) || req.query.mine === 'true') {
      filter.owner = req.user._id;
    }

    const tickets = await Ticket.find(filter)
      .populate('owner', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must contain at least 3 characters' });
    }

    if (typeof description !== 'string' || description.trim().length < 5) {
      return res.status(400).json({ message: 'Description must contain at least 5 characters' });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Priority is invalid' });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      status: 'open',
      owner: req.user._id
    });

    const fullTicket = await Ticket.findById(ticket._id)
      .populate('owner', 'name email role')
      .populate('assignedTo', 'name email role');

    res.status(201).json(fullTicket);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await Ticket.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket || !canRead(ticket, req.user)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const commentFilter = { ticket: req.params.id };
    if (!isAdmin(req.user)) commentFilter.isInternal = false;

    const comments = await Comment.find(commentFilter)
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    res.json({ ticket, comments });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !canRead(ticket, req.user)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (isOwner(ticket, req.user)) {
      const { title, description, priority } = req.body;

      if (typeof title === 'string') {
        if (title.trim().length < 3) return res.status(400).json({ message: 'Title must contain at least 3 characters' });
        ticket.title = title.trim();
      }

      if (typeof description === 'string') {
        if (description.trim().length < 5) {
          return res.status(400).json({ message: 'Description must contain at least 5 characters' });
        }
        ticket.description = description.trim();
      }

      if (priority) {
        if (!allowedPriorities.includes(priority)) return res.status(400).json({ message: 'Priority is invalid' });
        ticket.priority = priority;
      }
    }

    if (isAdmin(req.user)) {
      const { status, assignedTo, internalNote } = req.body;

      if (status) {
        if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Status is invalid' });
        ticket.status = status;
      }

      if (assignedTo === null || validateObjectId(assignedTo)) {
        ticket.assignedTo = assignedTo || null;
      }

      if (typeof internalNote === 'string') {
        ticket.internalNote = internalNote.trim();
      }
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('owner', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json(updatedTicket);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !canRead(ticket, req.user)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ ticket: req.params.id });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !canRead(ticket, req.user)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (typeof req.body.body !== 'string' || !req.body.body.trim()) {
      return res.status(400).json({ message: 'Comment body is required' });
    }

    const comment = await Comment.create({
      ticket: req.params.id,
      author: req.user._id,
      body: req.body.body.trim(),
      isInternal: isAdmin(req.user) && req.body.isInternal === true
    });

    const fullComment = await Comment.findById(comment._id).populate('author', 'name email role');
    res.status(201).json(fullComment);
  } catch (error) {
    next(error);
  }
});

export default router;
