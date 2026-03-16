// ─── In-Memory Data Store ─────────────────────────────────
// This acts as our "database". All data lives in memory and
// is seeded from JSON files on server start.

const fs = require('fs');
const path = require('path');

function loadJSON(filename) {
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

const employees = loadJSON('employees.json');

const db = {
  users: [
    // ─── Admin Users ───────────────────────────────────────
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@payroll.com',
      password: 'admin123',
      role: 'admin',
      employeeId: null,
      avatar: null,
    },
    // ─── Employee Users (auto-generated from employee data) ─
    ...employees.map(emp => ({
      id: `user-${emp.id}`,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      password: 'employee123',
      role: 'employee',
      employeeId: emp.id,
      avatar: null,
    })),
  ],
  employees,
  payRuns: loadJSON('payRuns.json'),
  leaves: loadJSON('leaves.json'),
  attendance: loadJSON('attendance.json'),
  loans: loadJSON('loans.json'),
  reimbursements: [
    {
      id: 'RMB001',
      employeeId: 'EMP001',
      employeeName: 'Meera Krishnan',
      category: 'Travel',
      description: 'Client site visit - Bangalore to Chennai',
      amount: 4500,
      date: '2026-03-05',
      status: 'Pending',
      receipt: 'receipt_001.pdf',
      submittedOn: '2026-03-08',
    },
    {
      id: 'RMB002',
      employeeId: 'EMP001',
      employeeName: 'Meera Krishnan',
      category: 'Internet',
      description: 'Monthly broadband bill - Feb 2026',
      amount: 1500,
      date: '2026-02-28',
      status: 'Approved',
      receipt: 'receipt_002.pdf',
      submittedOn: '2026-03-01',
    },
    {
      id: 'RMB003',
      employeeId: 'EMP002',
      employeeName: 'Sandeep Patel',
      category: 'Meal',
      description: 'Team lunch during sprint review',
      amount: 2200,
      date: '2026-03-10',
      status: 'Pending',
      receipt: 'receipt_003.pdf',
      submittedOn: '2026-03-11',
    },
  ],
  itDeclarations: [
    {
      id: 'ITD001',
      employeeId: 'EMP001',
      financialYear: '2025-26',
      section80C: {
        ppf: 50000,
        elss: 30000,
        lifeInsurance: 25000,
        homeLoanPrincipal: 0,
        nsc: 0,
        total: 105000,
      },
      section80D: {
        selfInsurance: 25000,
        parentsInsurance: 15000,
        total: 40000,
      },
      hra: {
        rentPaid: 20000,
        monthsClaimed: 12,
        total: 240000,
      },
      otherDeductions: {
        section80E: 0,
        section80G: 5000,
        nps80CCD: 30000,
        total: 35000,
      },
      status: 'Submitted',
      submittedOn: '2026-01-15',
    },
  ],
  settings: {
    organization: {
      name: 'Zylker Corp',
      address: '123 Business Park, Bangalore, India',
      financialYearStart: 'April',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
    },
    salaryComponents: {
      earnings: [
        { id: 'basic', name: 'Basic Salary', type: 'fixed', percentage: 50 },
        { id: 'hra', name: 'House Rent Allowance', type: 'fixed', percentage: 20 },
        { id: 'special', name: 'Special Allowance', type: 'fixed', percentage: 15 },
        { id: 'conveyance', name: 'Conveyance Allowance', type: 'fixed', amount: 1600 },
        { id: 'medical', name: 'Medical Allowance', type: 'fixed', amount: 1250 },
      ],
      deductions: [
        { id: 'epf', name: 'Employee Provident Fund', type: 'statutory', percentage: 12 },
        { id: 'esi', name: 'Employee State Insurance', type: 'statutory', percentage: 0.75 },
        { id: 'pt', name: 'Professional Tax', type: 'statutory', amount: 200 },
        { id: 'tds', name: 'Tax Deducted at Source', type: 'statutory', percentage: 0 },
      ],
    },
  },
};

module.exports = db;
