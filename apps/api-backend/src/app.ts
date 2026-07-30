import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import apiRouter from './routes/api.router';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
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

// Serve Frontend Static Web App (index.html, customer_portal.html, passport.html, assets, css, js)
app.use(express.static(path.join(__dirname, '../../../')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../index.html'));
});

export default app;
