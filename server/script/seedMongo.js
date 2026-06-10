require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { User, Employee, PayRun, Leave, Loan, Reimbursement, ItDeclaration, Settings } = require('../src/models/index');

function loadJSON(filename) {
  const filePath = path.join(__dirname, '..', 'src', 'data', filename);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

async function seed() {
  try {
    console.log(`🔌 Connecting to MongoDB: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    // Wipe collections
    await User.deleteMany({});
    await Employee.deleteMany({});
    await PayRun.deleteMany({});
    await Leave.deleteMany({});
    await Loan.deleteMany({});
    await Reimbursement.deleteMany({});
    await ItDeclaration.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️  Wiped existing records.');

    // Load static arrays
    const users = loadJSON('users.json');
    const employees = loadJSON('employees.json');
    const payRuns = loadJSON('payRuns.json');
    const leaves = loadJSON('leaves.json');
    const loans = loadJSON('loans.json');
    const reimbursements = loadJSON('reimbursements.json');
    const itDeclarations = loadJSON('itDeclarations.json');
    
    // Custom logic to grab settings from db.js logic manually since it wasn't a distinct file
    // But I'll just push standard default settings
    const defaultSettings = {
      id: 'global_settings',
      organization: {
        name: 'Northview University',
        address: '12 University Avenue, Bengaluru, India',
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
        ]
      }
    };

    // Insert
    if (users.length) await User.insertMany(users);
    if (employees.length) await Employee.insertMany(employees);
    if (payRuns.length) await PayRun.insertMany(payRuns);
    if (leaves.length) await Leave.insertMany(leaves);
    if (loans.length) await Loan.insertMany(loans);
    if (reimbursements.length) await Reimbursement.insertMany(reimbursements);
    if (itDeclarations.length) await ItDeclaration.insertMany(itDeclarations);
    await Settings.create(defaultSettings);

    console.log('🚀 Seed successful! Data migrated to MongoDB.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
