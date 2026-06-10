const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Employee, PayRun, Leave, Loan, Reimbursement, ItDeclaration } = require('../models');

// All employee routes require authentication
router.use(auth);

// Helper to get employee from token using mongoose
const getEmployee = async (req) => {
  return await Employee.findOne({ id: req.user.employeeId });
};

// ─── Dashboard ─────────────────────────────────────────────
// GET /api/employee/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    // Monthly salary breakdown
    const monthlyCTC = Math.round((emp.salary.ctc || 0) / 12);
    const monthlyBasic = Math.round((emp.salary.basic || 0) / 12);
    const monthlyHRA = Math.round((emp.salary.hra || 0) / 12);
    const monthlySpecial = Math.round((emp.salary.special || 0) / 12);
    const epf = Math.round(monthlyBasic * 0.12);
    const esi = monthlyCTC <= 21000 ? Math.round(monthlyCTC * 0.0075) : 0;
    const pt = 200;
    const totalDeductions = epf + esi + pt;
    const netPay = monthlyCTC - totalDeductions;

    // Leave balance
    const leaveBalance = emp.leaveBalance || { casual: 0, sick: 0, earned: 0, compOff: 0 };
    const totalLeaveBalance = (leaveBalance.casual || 0) + (leaveBalance.sick || 0) + (leaveBalance.earned || 0) + (leaveBalance.compOff || 0);

    // Recent payslips from pay runs
    const allPayRuns = await PayRun.find({ status: 'Paid' }).sort({ createdAt: -1 });
    const myPayslips = allPayRuns
      .filter(pr => (pr.employees || []).some(e => e.employeeId === emp.id))
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
    const pendingLeaves = await Leave.countDocuments({ employeeId: emp.id, status: 'Pending' });

    // Upcoming holidays (static sample)
    const upcomingHolidays = [
      { name: 'Tamil New Year (Puthandu)', date: '2026-04-14' },
      { name: 'Chithirai Thiruvizha', date: '2026-04-28' },
      { name: 'May Day', date: '2026-05-01' },
    ];

    // Pending reimbursements
    const pendingReimbursements = await Reimbursement.countDocuments({ employeeId: emp.id, status: 'Pending' });

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
  } catch (error) {
    next(error);
  }
});

// ─── Payslips ──────────────────────────────────────────────
// GET /api/employee/payslips
router.get('/payslips', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const monthlyGross = Math.round((emp.salary.ctc || 0) / 12);
    const monthlyBasic = Math.round((emp.salary.basic || 0) / 12);
    const monthlyHRA = Math.round((emp.salary.hra || 0) / 12);
    const monthlySpecial = Math.round((emp.salary.special || 0) / 12);
    const conveyance = emp.salary.conveyance ? Math.round(emp.salary.conveyance / 12) : 1600;
    const medical = emp.salary.medical ? Math.round(emp.salary.medical / 12) : 1250;
    const epf = Math.round(monthlyBasic * 0.12);
    const esi = monthlyGross <= 21000 ? Math.round(monthlyGross * 0.0075) : 0;
    const pt = 200;

    const allPayRuns = await PayRun.find({ status: 'Paid' }).sort({ createdAt: -1 });
    const payslips = allPayRuns
      .filter(pr => (pr.employees || []).some(e => e.employeeId === emp.id))
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
  } catch (error) {
    next(error);
  }
});

// ─── Profile ───────────────────────────────────────────────
// GET /api/employee/profile
router.get('/profile', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });
    res.json({ success: true, data: emp });
  } catch (error) {
    next(error);
  }
});

// PUT /api/employee/profile
router.put('/profile', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const { phone, address, emergencyContact } = req.body;
    if (phone) emp.phone = phone;
    if (address) emp.address = address;
    if (emergencyContact) emp.emergencyContact = emergencyContact;

    await emp.save();
    res.json({ success: true, data: emp });
  } catch (error) {
    next(error);
  }
});

// ─── Leaves ────────────────────────────────────────────────
// GET /api/employee/leaves
router.get('/leaves', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const myLeaves = await Leave.find({ employeeId: emp.id });
    res.json({
      success: true,
      data: {
        leaves: myLeaves,
        balance: emp.leaveBalance || { casual: 0, sick: 0, earned: 0, compOff: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/employee/leaves
router.post('/leaves', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const totalLeaves = await Leave.countDocuments();
    const leave = new Leave({
      id: `LV${String(totalLeaves + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      ...req.body,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    });
    
    await leave.save();
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
});

// ─── Loans ─────────────────────────────────────────────────
// GET /api/employee/loans
router.get('/loans', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const myLoans = await Loan.find({ employeeId: emp.id });
    res.json({ success: true, data: myLoans });
  } catch (error) {
    next(error);
  }
});

// ─── Reimbursements ────────────────────────────────────────
// GET /api/employee/reimbursements
router.get('/reimbursements', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const myReimbursements = await Reimbursement.find({ employeeId: emp.id });
    res.json({ success: true, data: myReimbursements });
  } catch (error) {
    next(error);
  }
});

// POST /api/employee/reimbursements
router.post('/reimbursements', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const totalReimbursements = await Reimbursement.countDocuments();
    const reimbursement = new Reimbursement({
      id: `RMB${String(totalReimbursements + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      ...req.body,
      status: 'Pending',
      submittedOn: new Date().toISOString().split('T')[0],
    });
    
    await reimbursement.save();
    res.status(201).json({ success: true, data: reimbursement });
  } catch (error) {
    next(error);
  }
});

// ─── IT Declarations ───────────────────────────────────────
// GET /api/employee/it-declarations
router.get('/it-declarations', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const myDeclarations = await ItDeclaration.find({ employeeId: emp.id });
    res.json({ success: true, data: myDeclarations });
  } catch (error) {
    next(error);
  }
});

// POST /api/employee/it-declarations
router.post('/it-declarations', async (req, res, next) => {
  try {
    const emp = await getEmployee(req);
    if (!emp) return res.status(404).json({ message: 'Employee profile not found.' });

    const totalDeclarations = await ItDeclaration.countDocuments();
    const declaration = new ItDeclaration({
      id: `ITD${String(totalDeclarations + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      ...req.body,
      status: 'Submitted',
      submittedOn: new Date().toISOString().split('T')[0],
    });
    
    await declaration.save();
    res.status(201).json({ success: true, data: declaration });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
