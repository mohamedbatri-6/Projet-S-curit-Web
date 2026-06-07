import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 4000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3001';

app.use(helmet());
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'Support Ticket API',
    version: 'secure',
    nodeEnv: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'configured' : 'missing'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, req, res, next) => {
  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  if (error?.name === 'ValidationError') {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Secure API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
