import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint to return current GMT time
app.get('/api/time', (req, res) => {
  const now = new Date();
  const gmtTime = now.toUTCString();
  res.json({ 
    time: gmtTime,
    timestamp: now.getTime(),
    timezone: 'GMT'
  });
});

// Layout endpoints (placeholder for now)
app.get('/api/layouts', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const layouts = await prisma.layout.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(layouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/layouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const layout = await prisma.layout.findUnique({
      where: { id }
    });
    
    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }
    
    res.json(layout);
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/layouts', async (req, res) => {
  try {
    const { name, userId, content } = req.body;
    
    if (!name || !userId || !content) {
      return res.status(400).json({ error: 'name, userId, and content are required' });
    }
    
    const layout = await prisma.layout.create({
      data: {
        name,
        userId,
        content
      }
    });
    
    res.status(201).json(layout);
  } catch (error) {
    console.error('Error creating layout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`⏰ Time endpoint: http://localhost:${PORT}/api/time`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer(); 