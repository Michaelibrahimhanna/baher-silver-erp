import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/api.router';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Baher Silver Manufacturing ERP API Engine',
    version: '4.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

export default app;
