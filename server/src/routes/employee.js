const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// All employee routes require authentication
router.use(auth);

// Helper to get employee from token
function getEmployee(req) {
  return db.employees.find(e => e.id === req.user.employeeId);
}

// ─── Dashboard ─────────────────────────────────────────────
// GET /api/employee/dashboard
router.get('/dashboard', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  // Monthly salary breakdown
  const monthlyCTC = Math.round(emp.salary.ctc / 12);
  const monthlyBasic = Math.round(emp.salary.basic / 12);
  const monthlyHRA = Math.round(emp.salary.hra / 12);
  const monthlySpecial = Math.round(emp.salary.special / 12);
  const epf = Math.round(monthlyBasic * 0.12);
  const esi = monthlyCTC <= 21000 ? Math.round(monthlyCTC * 0.0075) : 0;
  const pt = 200;
  const totalDeductions = epf + esi + pt;
  const netPay = monthlyCTC - totalDeductions;

  // Leave balance
  const leaveBalance = emp.leaveBalance || { casual: 0, sick: 0, earned: 0, compOff: 0 };
  const totalLeaveBalance = leaveBalance.casual + leaveBalance.sick + leaveBalance.earned + leaveBalance.compOff;

  // Recent payslips from pay runs
  const myPayslips = db.payRuns
    .filter(pr => pr.status === 'Paid' && pr.employees.some(e => e.employeeId === emp.id))
    .slice(0, 3)
    .map(pr => {
      const myEntry = pr.employees.find(e => e.employeeId === emp.id);
      return {
        month: pr.month,
        year: pr.year,
        payDate: pr.payDate,
        gross: myEntry.gross,
        deductions: myEntry.deductions,
        netPay: myEntry.netPay,
      };
    });

  // Pending leaves
  const pendingLeaves = db.leaves.filter(l => l.employeeId === emp.id && l.status === 'Pending').length;

  // Upcoming holidays (static sample)
  const upcomingHolidays = [
    { name: 'Holi', date: '2026-03-17' },
    { name: 'Good Friday', date: '2026-04-03' },
    { name: 'May Day', date: '2026-05-01' },
  ];

  // Pending reimbursements
  const pendingReimbursements = db.reimbursements.filter(r => r.employeeId === emp.id && r.status === 'Pending').length;

  res.json({
    success: true,
    data: {
      employee: {
        name: `${emp.firstName} ${emp.lastName}`,
        designation: emp.designation,
        department: emp.department,
        id: emp.id,
      },
      salary: { monthlyCTC, netPay, totalDeductions, monthlyBasic, monthlyHRA, monthlySpecial, epf, esi, pt },
      leaveBalance,
      totalLeaveBalance,
      pendingLeaves,
      recentPayslips: myPayslips,
      upcomingHolidays,
      pendingReimbursements,
    },
  });
});

// ─── Payslips ──────────────────────────────────────────────
// GET /api/employee/payslips
router.get('/payslips', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const monthlyGross = Math.round(emp.salary.ctc / 12);
  const monthlyBasic = Math.round(emp.salary.basic / 12);
  const monthlyHRA = Math.round(emp.salary.hra / 12);
  const monthlySpecial = Math.round(emp.salary.special / 12);
  const conveyance = emp.salary.conveyance ? Math.round(emp.salary.conveyance / 12) : 1600;
  const medical = emp.salary.medical ? Math.round(emp.salary.medical / 12) : 1250;
  const epf = Math.round(monthlyBasic * 0.12);
  const esi = monthlyGross <= 21000 ? Math.round(monthlyGross * 0.0075) : 0;
  const pt = 200;

  const payslips = db.payRuns
    .filter(pr => pr.status === 'Paid' && pr.employees.some(e => e.employeeId === emp.id))
    .map(pr => {
      const myEntry = pr.employees.find(e => e.employeeId === emp.id);
      return {
        payRunId: pr.id,
        month: pr.month,
        year: pr.year,
        payDate: pr.payDate,
        earnings: {
          basic: monthlyBasic,
          hra: monthlyHRA,
          special: monthlySpecial,
          conveyance,
          medical,
          totalEarnings: myEntry.gross,
        },
        deductions: {
          epf,
          esi,
          pt,
          tds: 0,
          totalDeductions: myEntry.deductions,
        },
        netPay: myEntry.netPay,
      };
    });

  res.json({ success: true, data: payslips });
});

// ─── Profile ───────────────────────────────────────────────
// GET /api/employee/profile
router.get('/profile', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });
  res.json({ success: true, data: emp });
});

// PUT /api/employee/profile
router.put('/profile', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const idx = db.employees.findIndex(e => e.id === emp.id);
  // Only allow updating certain fields
  const { phone, address, emergencyContact } = req.body;
  if (phone) db.employees[idx].phone = phone;
  if (address) db.employees[idx].address = address;
  if (emergencyContact) db.employees[idx].emergencyContact = emergencyContact;

  res.json({ success: true, data: db.employees[idx] });
});

// ─── Leaves ────────────────────────────────────────────────
// GET /api/employee/leaves
router.get('/leaves', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const myLeaves = db.leaves.filter(l => l.employeeId === emp.id);
  res.json({
    success: true,
    data: {
      leaves: myLeaves,
      balance: emp.leaveBalance || { casual: 0, sick: 0, earned: 0, compOff: 0 },
    },
  });
});

// POST /api/employee/leaves
router.post('/leaves', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const leave = {
    id: `LV${String(db.leaves.length + 1).padStart(3, '0')}`,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    ...req.body,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0],
  };
  db.leaves.push(leave);
  res.status(201).json({ success: true, data: leave });
});

// ─── Loans ─────────────────────────────────────────────────
// GET /api/employee/loans
router.get('/loans', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const myLoans = db.loans.filter(l => l.employeeId === emp.id);
  res.json({ success: true, data: myLoans });
});

// ─── Reimbursements ────────────────────────────────────────
// GET /api/employee/reimbursements
router.get('/reimbursements', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const myReimbursements = db.reimbursements.filter(r => r.employeeId === emp.id);
  res.json({ success: true, data: myReimbursements });
});

// POST /api/employee/reimbursements
router.post('/reimbursements', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const reimbursement = {
    id: `RMB${String(db.reimbursements.length + 1).padStart(3, '0')}`,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    ...req.body,
    status: 'Pending',
    submittedOn: new Date().toISOString().split('T')[0],
  };
  db.reimbursements.push(reimbursement);
  res.status(201).json({ success: true, data: reimbursement });
});

// ─── IT Declarations ───────────────────────────────────────
// GET /api/employee/it-declarations
router.get('/it-declarations', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const myDeclarations = db.itDeclarations.filter(d => d.employeeId === emp.id);
  res.json({ success: true, data: myDeclarations });
});

// POST /api/employee/it-declarations
router.post('/it-declarations', (req, res) => {
  const emp = getEmployee(req);
  if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

  const declaration = {
    id: `ITD${String(db.itDeclarations.length + 1).padStart(3, '0')}`,
    employeeId: emp.id,
    ...req.body,
    status: 'Submitted',
    submittedOn: new Date().toISOString().split('T')[0],
  };
  db.itDeclarations.push(declaration);
  res.status(201).json({ success: true, data: declaration });
});

module.exports = router;
