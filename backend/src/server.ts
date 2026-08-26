import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import authRouter from './routes/auth';
import webhooksRouter from './routes/webhooks';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/webhooks', webhooksRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
