import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' }
});

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateRegistration(body) {
  const { name, email, password } = body;

  if (typeof name !== 'string' || name.trim().length < 2) {
    return 'Name must contain at least 2 characters';
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Email format is invalid';
  }

  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must contain at least 8 characters';
  }

  return null;
}

function validateLogin(body) {
  const { email, password } = body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return 'Invalid credentials';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Invalid credentials';
  }

  return null;
}

function issueAuthCookie(res, user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const validationError = validateRegistration(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.create({
      name: req.body.name.trim(),
      email: normalizeEmail(req.body.email),
      password: req.body.password,
      role: 'user'
    });

    issueAuthCookie(res, user);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const validationError = validateLogin(req.body);

    if (validationError) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email: normalizeEmail(req.body.email) }).select('+password');

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    issueAuthCookie(res, user);
    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ message: 'Logged out' });
});

export default router;
