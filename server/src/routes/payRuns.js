const express = require('express');
const router = express.Router();
const { PayRun, Employee } = require('../models');

// GET /api/pay-runs
router.get('/', async (req, res, next) => {
  try {
    const payRuns = await PayRun.find().sort({ createdAt: -1 });
    const formatted = payRuns.map(pr => {
      const obj = pr.toObject();
      obj.employees = undefined;
      return obj;
    });
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /api/pay-runs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const payRun = await PayRun.findOne({ id: req.params.id });
    if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
    res.json({ success: true, data: payRun });
  } catch (error) {
    next(error);
  }
});

// POST /api/pay-runs (create new draft)
router.post('/', async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const dateStr = `${month} 1, ${year}`;
    const id = `PR-${year}-${String(new Date(dateStr).getMonth() + 1).padStart(2, '0')}`;

    // Generate payroll for all active employees
    const activeEmployees = await Employee.find({ status: 'Active' });
    const employees = activeEmployees.map(emp => {
      const gross = Math.round((emp.salary.ctc || 0) / 12);
      const epf = Math.round((emp.salary.basic || 0) / 12 * 0.12);
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

    const newPayRun = new PayRun({
      id,
      month,
      year,
      status: 'Draft',
      payDate: null,
      totalNetPay: employees.reduce((s, e) => s + e.netPay, 0),
      totalGross: employees.reduce((s, e) => s + e.gross, 0),
      totalDeductions: employees.reduce((s, e) => s + e.deductions, 0),
      employeeCount: employees.length,
      processedAt: null,
      employees,
    });

    await newPayRun.save();
    res.status(201).json({ success: true, data: newPayRun });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A pay run for this month already exists.' });
    }
    next(error);
  }
});

// PUT /api/pay-runs/:id/approve
router.put('/:id/approve', async (req, res, next) => {
  try {
    const payRun = await PayRun.findOne({ id: req.params.id });
    if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
    if (payRun.status !== 'Draft') {
      return res.status(400).json({ message: 'Only draft pay runs can be approved.' });
    }

    payRun.status = 'Approved';
    await payRun.save();
    res.json({ success: true, data: payRun });
  } catch (error) {
    next(error);
  }
});

// PUT /api/pay-runs/:id/process
router.put('/:id/process', async (req, res, next) => {
  try {
    const payRun = await PayRun.findOne({ id: req.params.id });
    if (!payRun) return res.status(404).json({ message: 'Pay run not found.' });
    if (payRun.status !== 'Approved') {
      return res.status(400).json({ message: 'Only approved pay runs can be processed.' });
    }

    payRun.status = 'Paid';
    payRun.payDate = new Date().toISOString().split('T')[0];
    payRun.processedAt = new Date().toISOString();
    await payRun.save();
    res.json({ success: true, data: payRun });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
