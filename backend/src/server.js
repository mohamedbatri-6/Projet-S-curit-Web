import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'Support Ticket API',
    version: 'vulnerable',
    debug: true,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'configured' : 'missing',
    message: 'This API intentionally exposes too much information.'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      headers: req.headers
    }
  });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Vulnerable API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
