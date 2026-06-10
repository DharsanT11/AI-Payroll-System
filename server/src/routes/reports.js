const express = require('express');
const router = express.Router();
const { PayRun, Employee } = require('../models');

// GET /api/reports/payroll-summary
router.get('/payroll-summary', async (req, res, next) => {
  try {
    const paidRuns = await PayRun.find({ status: 'Paid' });
    const summary = paidRuns.map(pr => ({
      month: pr.month,
      year: pr.year,
      totalGross: pr.employees.reduce((s, e) => s + e.gross, 0),
      totalDeductions: pr.employees.reduce((s, e) => s + e.deductions, 0),
      totalNetPay: pr.employees.reduce((s, e) => s + e.netPay, 0),
      employeeCount: pr.employees.length,
    }));

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/department-wise
router.get('/department-wise', async (req, res, next) => {
  try {
    const departments = {};
    const employees = await Employee.find({ status: 'Active' });
    employees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      if (!departments[dept]) {
        departments[dept] = { department: dept, count: 0, totalCtc: 0 };
      }
      departments[dept].count += 1;
      departments[dept].totalCtc += (emp.salary.ctc || 0);
    });

    res.json({ success: true, data: Object.values(departments) });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/employee-summary
router.get('/employee-summary', async (req, res, next) => {
  try {
    const employees = await Employee.find();
    
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = employees.filter(e => e.status === 'Inactive').length;
    const onboarding = employees.filter(e => e.status === 'Onboarding').length;

    const recentJoins = employees
      .filter(e => {
        if (!e.dateOfJoining) return false;
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
  } catch (error) {
    next(error);
  }
});

module.exports = router;
