const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/auth');
const employeeMgmtRoutes = require('./routes/employees');
const payRunRoutes = require('./routes/payRuns');
const leaveRoutes = require('./routes/leaves');
const taxRoutes = require('./routes/taxes');
const loanRoutes = require('./routes/loans');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard');
const empSelfRoutes = require('./routes/employee');
const chatbotRoutes = require('./routes/chatbot');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Global Middleware ───────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ──────────────────────────────────────────────
const authMiddleware = require('./middleware/auth');
const requireRole = require('./middleware/roles');

app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/employees', authMiddleware, requireRole('admin'), employeeMgmtRoutes);
app.use('/api/pay-runs', authMiddleware, requireRole('admin'), payRunRoutes);
app.use('/api/leaves', authMiddleware, requireRole('admin'), leaveRoutes);
app.use('/api/taxes', authMiddleware, requireRole('admin'), taxRoutes);
app.use('/api/loans', authMiddleware, requireRole('admin'), loanRoutes);
app.use('/api/reports', authMiddleware, requireRole('admin'), reportRoutes);
app.use('/api/settings', authMiddleware, requireRole('admin'), settingsRoutes);
app.use('/api/dashboard', authMiddleware, requireRole('admin'), dashboardRoutes);

// Employee Self-Service Routes
app.use('/api/employee', authMiddleware, requireRole('employee'), empSelfRoutes);

// Chatbot (accessible by both admin and employee)
app.use('/api/chatbot', authMiddleware, chatbotRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler (must be last) ────────────────────────────
app.use(errorHandler);

module.exports = app;
