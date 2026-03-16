const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/reports/payroll-summary
router.get('/payroll-summary', (req, res) => {
  const paidRuns = db.payRuns.filter(pr => pr.status === 'Paid');
  const summary = paidRuns.map(pr => ({
    month: pr.month,
    year: pr.year,
    totalGross: pr.employees.reduce((s, e) => s + e.gross, 0),
    totalDeductions: pr.employees.reduce((s, e) => s + e.deductions, 0),
    totalNetPay: pr.employees.reduce((s, e) => s + e.netPay, 0),
    employeeCount: pr.employees.length,
  }));

  res.json({ success: true, data: summary });
});

// GET /api/reports/department-wise
router.get('/department-wise', (req, res) => {
  const departments = {};
  db.employees.filter(e => e.status === 'Active').forEach(emp => {
    if (!departments[emp.department]) {
      departments[emp.department] = { department: emp.department, count: 0, totalCtc: 0 };
    }
    departments[emp.department].count += 1;
    departments[emp.department].totalCtc += emp.salary.ctc;
  });

  res.json({ success: true, data: Object.values(departments) });
});

// GET /api/reports/employee-summary
router.get('/employee-summary', (req, res) => {
  const total = db.employees.length;
  const active = db.employees.filter(e => e.status === 'Active').length;
  const inactive = db.employees.filter(e => e.status === 'Inactive').length;
  const onboarding = db.employees.filter(e => e.status === 'Onboarding').length;

  const recentJoins = db.employees
    .filter(e => {
      const joinDate = new Date(e.dateOfJoining);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return joinDate >= threeMonthsAgo;
    })
    .length;

  res.json({
    success: true,
    data: { total, active, inactive, onboarding, recentJoins },
  });
});

module.exports = router;
