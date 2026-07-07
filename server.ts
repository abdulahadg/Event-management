import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment configurations
dotenv.config();

import apiRouter from './server/routes/api';
import { connectDB } from './server/services/dbService';

async function bootstrapServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize unified database fallback system
  await connectDB();

  // 1. Security Headers via Helmet
  // Customize helmet to allow script loading and resources from our CDN and Unsplash
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://images.pexels.com", "https://cdn.jsdelivr.net"],
        connectSrc: ["'self'", "ws:", "wss:", "http://localhost:3000", "https://*.run.app"],
        mediaSrc: ["'self'"],
        frameAncestors: ["'self'", "https://*.studio.google", "https://*.run.app", "https://ai.studio.google"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  }));

  // 2. Cross-Origin Resource Sharing (CORS)
  app.use(cors({
    origin: '*', // Dynamic wildcard or process.env.CLIENT_URL, flexible for AI Studio preview context
    credentials: true
  }));

  // 3. Request Parser (supports JSON and urlencoded)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. API Request Rate Limiter (Abuse and DDoS protection)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: {
      success: false,
      message: 'Too many liaison attempts registered from this coordinate. Please wait 15 minutes before retrying.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use('/api/', apiLimiter);

  // 5. REST API routes mount
  app.use('/api', apiRouter);

  // 6. Serve Uploads statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // 7. Dynamic Frontend Service (Vite middleware in dev, static files in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔄 Mounting Vite Interactive Dev Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('📦 Serving production static bundle from /dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 8. Global Error Handler Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('🔥 Server Crash Log:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'An unexpected operational failure occurred inside the AURA server gateway.'
    });
  });

  // Start Server Ingress Routing on port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 AURA Full-Stack Server executing successfully on http://0.0.0.0:${PORT}`);
  });
}

bootstrapServer().catch(err => {
  console.error('💀 Failed to bootstrap AURA server engine:', err);
});
