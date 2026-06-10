const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  employeeId: String,
  avatar: String
}, { timestamps: true });

// Employee Schema
const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  department: String,
  designation: String,
  joinDate: String,
  status: { type: String, default: 'Active' },
  salary: {
    ctc: Number,
    breakdown: {
      basic: Number,
      hra: Number,
      specialAllowance: Number,
      pf: Number,
      pt: Number
    }
  },
  tax: {
    pan: String,
    regime: String
  },
  leaveBalance: {
    casual: Number,
    sick: Number,
    earned: Number,
    compOff: Number
  }
}, { timestamps: true });

// PayRun Schema
const payRunSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  month: String,
  year: Number,
  period: String, // e.g., 'April 2026'
  processedDate: String,
  payDate: String,
  processedAt: String,
  status: { type: String, enum: ['Draft', 'Approved', 'Paid'], default: 'Draft' },
  totalEmployees: Number,
  employeeCount: Number,
  totalEarnings: Number,
  totalGross: Number,
  totalDeductions: Number,
  totalNetPay: Number,
  netPay: Number,
  employees: [{
    employeeId: String,
    employeeName: String,
    name: String,
    department: String,
    earnings: Number,
    gross: Number,
    deductions: Number,
    netPay: Number
  }]
}, { timestamps: true });

// Leave Schema
const leaveSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: String,
  employeeName: String,
  type: String, // 'Casual Leave', 'Sick Leave'
  startDate: String,
  endDate: String,
  days: Number,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: String
}, { timestamps: true });

// Loan Schema
const loanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: String,
  employeeName: String,
  type: String,
  amount: Number,
  purpose: String,
  emi: Number,
  emiAmount: Number,
  tenure: Number,
  paidEmis: Number,
  remainingAmount: Number,
  status: { type: String, default: 'Active' },
  requestDate: String
}, { timestamps: true });

// Reimbursement Schema
const reimbursementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: String,
  employeeName: String,
  category: String,
  amount: Number,
  date: String,
  description: String,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

// IT Declaration Schema
const itDeclarationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: String,
  employeeName: String,
  financialYear: String,
  section80C: {
    ppf: { type: Number, default: 0 },
    elss: { type: Number, default: 0 },
    lifeInsurance: { type: Number, default: 0 },
    homeLoanPrincipal: { type: Number, default: 0 },
    nsc: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  section80D: {
    selfInsurance: { type: Number, default: 0 },
    parentsInsurance: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  hra: {
    rentPaid: { type: Number, default: 0 },
    monthsClaimed: { type: Number, default: 12 },
    total: { type: Number, default: 0 }
  },
  otherDeductions: {
    section80E: { type: Number, default: 0 },
    section80G: { type: Number, default: 0 },
    nps80CCD: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  status: { type: String, default: 'Pending' },
  submittedOn: String
}, { timestamps: true });

// Settings Schema (Store single config doc)
const settingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global_settings', unique: true },
  organization: {
    name: String,
    address: String,
    financialYearStart: String,
    currency: String,
    dateFormat: String
  },
  salaryComponents: {
    earnings: Array,
    deductions: Array
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Employee: mongoose.model('Employee', employeeSchema),
  PayRun: mongoose.model('PayRun', payRunSchema),
  Leave: mongoose.model('Leave', leaveSchema),
  Loan: mongoose.model('Loan', loanSchema),
  Reimbursement: mongoose.model('Reimbursement', reimbursementSchema),
  ItDeclaration: mongoose.model('ItDeclaration', itDeclarationSchema),
  Settings: mongoose.model('Settings', settingsSchema)
};
