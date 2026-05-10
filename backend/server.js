require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// CORS — allow the frontend origin
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV || 'development' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/opportunities', require('./routes/jobs')); // Alias so /opportunities/:id/apply works
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/roadmap', require('./routes/roadmap'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Socket.io — AI Counselling
const { generateCounsellingResponse } = require('./services/aiService');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-counselling', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined counselling room`);
  });

  socket.on('send-message', async ({ userId, message, context, history }) => {
    // Don't echo back user message — frontend adds it optimistically
    try {
      const aiResponse = await generateCounsellingResponse(message, context, history);
      socket.emit('receive-message', { role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error('AI counselling error:', error.message);
      
      // Check for specific error from aiService or general failure
      const errorText = error.message.includes('OPENAI_API_KEY') 
        ? error.message 
        : "I apologize — I encountered an issue processing your request. AI service might be temporarily offline.";
        
      socket.emit('receive-message', {
        role: 'assistant',
        content: errorText,
        isError: true
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Talent-BridgeX server running on port ${PORT}`);
  console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL ? '✓ configured' : '⚠ missing'}`);
  console.log(`   OpenAI:   ${process.env.OPENAI_API_KEY ? '✓ configured' : '⚠ missing'}`);
});
