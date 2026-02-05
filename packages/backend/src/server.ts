import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/mongodb';
import { initializeModels } from './models';
import userRoutes from './routes/users';
import agentRoutes, { initializeOrchestrator } from './routes/agents';
import nftRoutes from './routes/nfts';
import petRoutes from './routes/pets';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import merchantRoutes from './routes/merchant';
import aiRoutes from './routes/ai';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize database models and indexes
    await initializeModels();

    // Initialize agent orchestrator (optional)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      initializeOrchestrator(apiKey);
      console.log('✅ Agent orchestrator initialized');
    } else {
      console.log('⚠️  OPENAI_API_KEY not configured, agent routes may not work');
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 PetSuite Backend Server`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
