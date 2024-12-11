import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { redis } from '../utils/redis';
import { initializeDatabase } from '../config/database';
import rateLimit from 'express-rate-limit';

const app = express();

// Initialize database connection
initializeDatabase();

// Middleware
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const userId = await redis.get(`auth:${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy middleware setup
const createServiceProxy = (serviceName: string, port: number) => 
  createProxyMiddleware({
    target: `http://${serviceName}:${port}`,
    changeOrigin: true,
  });

const services = [
  { path: '/api/auth', name: 'auth-service', port: 3010 },
  { path: '/api/crm', name: 'crm-service', port: 3001 },
  { path: '/api/cms', name: 'cms-service', port: 3002 },
  { path: '/api/pms', name: 'pms-service', port: 3003 },
  { path: '/api/accounting', name: 'accounting-service', port: 3004 },
  { path: '/api/fiscalization', name: 'fiscalization-service', port: 3005 },
  { path: '/api/notification', name: 'notification-service', port: 3006 },
  { path: '/api/report', name: 'report-service', port: 3007 },
  { path: '/api/analytics', name: 'analytics-service', port: 3008 },
  { path: '/api/file', name: 'file-service', port: 3009 },
];

// Set up routes for each service
services.forEach(({ path, name, port }) => {
  app.use(path, createServiceProxy(name, port));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
