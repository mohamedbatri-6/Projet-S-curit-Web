import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  res.json(req.user);
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (typeof name === 'string') {
      if (name.trim().length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters' });
      user.name = name.trim();
    }

    if (typeof email === 'string') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ message: 'Email format is invalid' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (typeof password === 'string') {
      if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters' });
      user.password = password;
    }

    await user.save();

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
