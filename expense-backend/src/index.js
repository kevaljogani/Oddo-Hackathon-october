require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const approvalRoutes = require('./routes/approval.routes');
const approvalRuleRoutes = require('./routes/approval-rule.routes');
const companyRoutes = require('./routes/company.routes');
const utilityRoutes = require('./routes/utility.routes');
const uploadRoutes = require('./routes/upload.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { authenticateJWT } = require('./middleware/auth.middleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8001;

// Initialize Prisma client
const prisma = new PrismaClient();
global.prisma = prisma;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/expenses', authenticateJWT, expenseRoutes);
app.use('/api/approvals', authenticateJWT, approvalRoutes);
app.use('/api/approval-rules', authenticateJWT, approvalRuleRoutes);
app.use('/api/companies', authenticateJWT, companyRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api', utilityRoutes); // Includes OCR and exchange rate endpoints

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;