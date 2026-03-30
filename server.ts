import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PORT } from './server/config.js';
import { connectMongo } from './server/db.js';
import { OrderModel } from './server/models/order.js';
import { registerApiRoutes } from './server/routes/api.js';

async function startServer() {
  const app = express();
  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);

  app.use(cors());
  app.use(express.json());

  connectMongo();
  registerApiRoutes(app, OrderModel);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
