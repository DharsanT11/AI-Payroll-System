const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/dashboard
router.get('/', (req, res) => {
  // Active employees
  const activeEmployees = db.employees.filter(e => e.status === 'Active');

  // Latest pay run
  const latestPayRun = db.payRuns.length > 0 ? db.payRuns[0] : null;
  const lastPaidRun = db.payRuns.find(pr => pr.status === 'Paid');

  // Pending leaves
  const pendingLeaves = db.leaves.filter(l => l.status === 'Pending');

  // Tax summary
  const epfTotal = activeEmployees.reduce((s, e) => s + Math.round(e.salary.basic / 12 * 0.12), 0);
  const esiTotal = activeEmployees.reduce((s, e) => {
    const gross = Math.round(e.salary.ctc / 12);
    return s + (gross <= 21000 ? Math.round(gross * 0.0075) : 0);
  }, 0);
  const tdsTotal = activeEmployees.reduce((s, e) => {
    const taxable = e.salary.ctc - 300000;
    return s + (taxable > 0 ? Math.round(taxable * 0.1 / 12) : 0);
  }, 0);

  // Payroll cost trend (last 6 months from paid runs)
  const paidRuns = db.payRuns.filter(pr => pr.status === 'Paid').slice(0, 6);
  const costTrend = paidRuns.map(pr => ({
    month: `${pr.month} ${pr.year}`,
    netPay: pr.employees.reduce((s, e) => s + e.netPay, 0),
    deductions: pr.employees.reduce((s, e) => s + e.deductions, 0),
    gross: pr.employees.reduce((s, e) => s + e.gross, 0),
  })).reverse();

  // Department distribution
  const deptCount = {};
  activeEmployees.forEach(e => {
    deptCount[e.department] = (deptCount[e.department] || 0) + 1;
  });

  // To-do items
  const todos = [];
  if (latestPayRun && latestPayRun.status === 'Draft') {
    todos.push({ type: 'payrun', message: `Process Pay Run for ${latestPayRun.month} ${latestPayRun.year}`, status: 'Draft' });
  }
  if (pendingLeaves.length > 0) {
    todos.push({ type: 'leave', message: `${pendingLeaves.length} leave request(s) pending approval`, status: 'Pending' });
  }
  const activeLoans = db.loans.filter(l => l.status === 'Active');
  if (activeLoans.length > 0) {
    todos.push({ type: 'loan', message: `${activeLoans.length} active loan(s) to track`, status: 'Active' });
  }

  res.json({
    success: true,
    data: {
      employeeCount: activeEmployees.length,
      payRunStatus: latestPayRun ? {
        id: latestPayRun.id,
        month: latestPayRun.month,
        year: latestPayRun.year,
        status: latestPayRun.status,
      } : null,
      lastPayment: lastPaidRun ? {
        netPay: lastPaidRun.employees.reduce((s, e) => s + e.netPay, 0),
        payDate: lastPaidRun.payDate,
        employeeCount: lastPaidRun.employees.length,
      } : null,
      deductions: {
        epf: epfTotal,
        esi: esiTotal,
        tds: tdsTotal,
        pt: activeEmployees.length * 200,
      },
      costTrend,
      departmentDistribution: Object.entries(deptCount).map(([name, count]) => ({ name, count })),
      todos,
      pendingLeaves: pendingLeaves.length,
    },
  });
});

module.exports = router;
