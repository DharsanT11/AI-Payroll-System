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

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Global Middleware ───────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeMgmtRoutes);
app.use('/api/pay-runs', payRunRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employee', empSelfRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler (must be last) ────────────────────────────
app.use(errorHandler);

module.exports = app;
