const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/pay-runs
router.get('/', (req, res) => {
  const payRuns = db.payRuns.map(pr => ({
    ...pr,
    employees: undefined,
    employeeCount: pr.employees ? pr.employees.length : pr.employeeCount,
  }));
  res.json({ success: true, data: payRuns });
});

// GET /api/pay-runs/:id
router.get('/:id', (req, res) => {
  const payRun = db.payRuns.find(pr => pr.id === req.params.id);
  if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
  res.json({ success: true, data: payRun });
});

// POST /api/pay-runs (create new draft)
router.post('/', (req, res) => {
  const { month, year } = req.body;
  const id = `PR-${year}-${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}`;

  // Generate payroll for all active employees
  const activeEmployees = db.employees.filter(e => e.status === 'Active');
  const employees = activeEmployees.map(emp => {
    const gross = Math.round(emp.salary.ctc / 12);
    const epf = Math.round(emp.salary.basic / 12 * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const pt = 200;
    const deductions = epf + esi + pt;
    const netPay = gross - deductions;

    return {
      employeeId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      gross,
      deductions,
      netPay,
    };
  });

  const newPayRun = {
    id,
    month,
    year,
    status: 'Draft',
    payDate: null,
    totalNetPay: employees.reduce((s, e) => s + e.netPay, 0),
    totalGross: employees.reduce((s, e) => s + e.gross, 0),
    totalDeductions: employees.reduce((s, e) => s + e.deductions, 0),
    employeeCount: employees.length,
    createdAt: new Date().toISOString(),
    processedAt: null,
    employees,
  };

  db.payRuns.unshift(newPayRun);
  res.status(201).json({ success: true, data: newPayRun });
});

// PUT /api/pay-runs/:id/approve
router.put('/:id/approve', (req, res) => {
  const payRun = db.payRuns.find(pr => pr.id === req.params.id);
  if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
  if (payRun.status !== 'Draft') {
    return res.status(400).json({ message: 'Only draft pay runs can be approved.' });
  }

  payRun.status = 'Approved';
  res.json({ success: true, data: payRun });
});

// PUT /api/pay-runs/:id/process
router.put('/:id/process', (req, res) => {
  const payRun = db.payRuns.find(pr => pr.id === req.params.id);
  if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
  if (payRun.status !== 'Approved') {
    return res.status(400).json({ message: 'Only approved pay runs can be processed.' });
  }

  payRun.status = 'Paid';
  payRun.payDate = new Date().toISOString().split('T')[0];
  payRun.processedAt = new Date().toISOString();
  res.json({ success: true, data: payRun });
});

module.exports = router;
