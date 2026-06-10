require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Employee, PayRun, Leave, Loan, Reimbursement, ItDeclaration, Settings } = require('../src/models/index');

async function seed() {
  try {
    console.log(`🔌 Connecting to MongoDB: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    // Wipe all collections
    await User.deleteMany({});
    await Employee.deleteMany({});
    await PayRun.deleteMany({});
    await Leave.deleteMany({});
    await Loan.deleteMany({});
    await Reimbursement.deleteMany({});
    await ItDeclaration.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️  Wiped all existing records.');

    // ─── USERS ────────────────────────────────────────────
    const hashedAdmin = bcrypt.hashSync('admin123', 10);
    const hashedEmp = bcrypt.hashSync('employee123', 10);

    const users = [
      { id: 'USR001', name: 'Dr. Kavitha Ramachandran', email: 'admin@tamilnaducollege.edu', password: hashedAdmin, role: 'admin' },
      { id: 'USR002', name: 'Meera Krishnan', email: 'meera.krishnan@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP001' },
      { id: 'USR003', name: 'Arun Selvam', email: 'arun.selvam@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP002' },
      { id: 'USR004', name: 'Priya Natarajan', email: 'priya.natarajan@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP003' },
      { id: 'USR005', name: 'Karthik Subramanian', email: 'karthik.subramanian@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP004' },
      { id: 'USR006', name: 'Lakshmi Venkatesh', email: 'lakshmi.venkatesh@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP005' },
      { id: 'USR007', name: 'Senthil Kumar', email: 'senthil.kumar@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP006' },
      { id: 'USR008', name: 'Divya Raghavan', email: 'divya.raghavan@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP007' },
      { id: 'USR009', name: 'Rajesh Pandian', email: 'rajesh.pandian@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP008' },
      { id: 'USR010', name: 'Anitha Balasubramanian', email: 'anitha.bala@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP009' },
      { id: 'USR011', name: 'Vijay Murugan', email: 'vijay.murugan@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP010' },
      { id: 'USR012', name: 'Deepa Shanmugam', email: 'deepa.shanmugam@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP011' },
      { id: 'USR013', name: 'Manoj Thirunavukkarasu', email: 'manoj.thiru@tamilnaducollege.edu', password: hashedEmp, role: 'employee', employeeId: 'EMP012' },
    ];

    // ─── EMPLOYEES ────────────────────────────────────────
    const employees = [
      {
        id: 'EMP001', firstName: 'Meera', lastName: 'Krishnan',
        email: 'meera.krishnan@tamilnaducollege.edu', phone: '+91 98765 43210',
        department: 'Computer Science', designation: 'Assistant Professor',
        joinDate: '2021-06-15', status: 'Active',
        salary: { ctc: 720000, breakdown: { basic: 360000, hra: 144000, specialAllowance: 108000, pf: 43200, pt: 2400 } },
        tax: { pan: 'ABCPK1234H', regime: 'New' },
        leaveBalance: { casual: 10, sick: 8, earned: 5, compOff: 2 }
      },
      {
        id: 'EMP002', firstName: 'Arun', lastName: 'Selvam',
        email: 'arun.selvam@tamilnaducollege.edu', phone: '+91 98765 43211',
        department: 'Mathematics', designation: 'Associate Professor',
        joinDate: '2019-08-01', status: 'Active',
        salary: { ctc: 960000, breakdown: { basic: 480000, hra: 192000, specialAllowance: 144000, pf: 57600, pt: 2400 } },
        tax: { pan: 'BCDPS5678J', regime: 'Old' },
        leaveBalance: { casual: 12, sick: 10, earned: 8, compOff: 1 }
      },
      {
        id: 'EMP003', firstName: 'Priya', lastName: 'Natarajan',
        email: 'priya.natarajan@tamilnaducollege.edu', phone: '+91 98765 43212',
        department: 'Administration', designation: 'Admin Manager',
        joinDate: '2020-01-10', status: 'Active',
        salary: { ctc: 600000, breakdown: { basic: 300000, hra: 120000, specialAllowance: 90000, pf: 36000, pt: 2400 } },
        tax: { pan: 'CDEFN9012L', regime: 'New' },
        leaveBalance: { casual: 9, sick: 12, earned: 4, compOff: 0 }
      },
      {
        id: 'EMP004', firstName: 'Karthik', lastName: 'Subramanian',
        email: 'karthik.subramanian@tamilnaducollege.edu', phone: '+91 98765 43213',
        department: 'Computer Science', designation: 'Professor & HOD',
        joinDate: '2015-07-01', status: 'Active',
        salary: { ctc: 1440000, breakdown: { basic: 720000, hra: 288000, specialAllowance: 216000, pf: 86400, pt: 2400 } },
        tax: { pan: 'DEFGS3456M', regime: 'Old' },
        leaveBalance: { casual: 12, sick: 12, earned: 15, compOff: 3 }
      },
      {
        id: 'EMP005', firstName: 'Lakshmi', lastName: 'Venkatesh',
        email: 'lakshmi.venkatesh@tamilnaducollege.edu', phone: '+91 98765 43214',
        department: 'Finance', designation: 'Finance Officer',
        joinDate: '2018-03-20', status: 'Active',
        salary: { ctc: 840000, breakdown: { basic: 420000, hra: 168000, specialAllowance: 126000, pf: 50400, pt: 2400 } },
        tax: { pan: 'EFGHV7890N', regime: 'New' },
        leaveBalance: { casual: 11, sick: 9, earned: 6, compOff: 1 }
      },
      {
        id: 'EMP006', firstName: 'Senthil', lastName: 'Kumar',
        email: 'senthil.kumar@tamilnaducollege.edu', phone: '+91 98765 43215',
        department: 'Human Resources', designation: 'HR Manager',
        joinDate: '2017-11-05', status: 'Active',
        salary: { ctc: 780000, breakdown: { basic: 390000, hra: 156000, specialAllowance: 117000, pf: 46800, pt: 2400 } },
        tax: { pan: 'FGHIK2345P', regime: 'New' },
        leaveBalance: { casual: 8, sick: 11, earned: 7, compOff: 2 }
      },
      {
        id: 'EMP007', firstName: 'Divya', lastName: 'Raghavan',
        email: 'divya.raghavan@tamilnaducollege.edu', phone: '+91 98765 43216',
        department: 'Examinations', designation: 'Controller of Examinations',
        joinDate: '2016-05-15', status: 'Active',
        salary: { ctc: 1080000, breakdown: { basic: 540000, hra: 216000, specialAllowance: 162000, pf: 64800, pt: 2400 } },
        tax: { pan: 'GHIJR6789Q', regime: 'Old' },
        leaveBalance: { casual: 12, sick: 12, earned: 10, compOff: 0 }
      },
      {
        id: 'EMP008', firstName: 'Rajesh', lastName: 'Pandian',
        email: 'rajesh.pandian@tamilnaducollege.edu', phone: '+91 98765 43217',
        department: 'Library', designation: 'Chief Librarian',
        joinDate: '2019-02-01', status: 'Active',
        salary: { ctc: 660000, breakdown: { basic: 330000, hra: 132000, specialAllowance: 99000, pf: 39600, pt: 2400 } },
        tax: { pan: 'HIJKP1234R', regime: 'New' },
        leaveBalance: { casual: 10, sick: 10, earned: 3, compOff: 1 }
      },
      {
        id: 'EMP009', firstName: 'Anitha', lastName: 'Balasubramanian',
        email: 'anitha.bala@tamilnaducollege.edu', phone: '+91 98765 43218',
        department: 'Student Affairs', designation: 'Dean of Students',
        joinDate: '2014-09-01', status: 'Active',
        salary: { ctc: 1200000, breakdown: { basic: 600000, hra: 240000, specialAllowance: 180000, pf: 72000, pt: 2400 } },
        tax: { pan: 'IJKLB5678S', regime: 'Old' },
        leaveBalance: { casual: 12, sick: 12, earned: 12, compOff: 2 }
      },
      {
        id: 'EMP010', firstName: 'Vijay', lastName: 'Murugan',
        email: 'vijay.murugan@tamilnaducollege.edu', phone: '+91 98765 43219',
        department: 'Mathematics', designation: 'Assistant Professor',
        joinDate: '2022-01-10', status: 'Active',
        salary: { ctc: 540000, breakdown: { basic: 270000, hra: 108000, specialAllowance: 81000, pf: 32400, pt: 2400 } },
        tax: { pan: 'JKLMM9012T', regime: 'New' },
        leaveBalance: { casual: 12, sick: 12, earned: 0, compOff: 0 }
      },
      {
        id: 'EMP011', firstName: 'Deepa', lastName: 'Shanmugam',
        email: 'deepa.shanmugam@tamilnaducollege.edu', phone: '+91 98765 43220',
        department: 'Computer Science', designation: 'Lab Instructor',
        joinDate: '2023-06-01', status: 'Active',
        salary: { ctc: 420000, breakdown: { basic: 210000, hra: 84000, specialAllowance: 63000, pf: 25200, pt: 2400 } },
        tax: { pan: 'KLMNS3456U', regime: 'New' },
        leaveBalance: { casual: 12, sick: 12, earned: 0, compOff: 0 }
      },
      {
        id: 'EMP012', firstName: 'Manoj', lastName: 'Thirunavukkarasu',
        email: 'manoj.thiru@tamilnaducollege.edu', phone: '+91 98765 43221',
        department: 'Finance', designation: 'Accounts Assistant',
        joinDate: '2022-07-15', status: 'Active',
        salary: { ctc: 360000, breakdown: { basic: 180000, hra: 72000, specialAllowance: 54000, pf: 21600, pt: 2400 } },
        tax: { pan: 'LMNOT7890V', regime: 'New' },
        leaveBalance: { casual: 11, sick: 10, earned: 2, compOff: 1 }
      },
    ];

    // ─── PAY RUNS ────────────────────────────────────────
    function buildPayRunEmployees(emps) {
      return emps.map(emp => {
        const gross = Math.round(emp.salary.ctc / 12);
        const epf = Math.round((emp.salary.breakdown.basic) / 12 * 0.12);
        const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
        const pt = 200;
        const deductions = epf + esi + pt;
        const netPay = gross - deductions;
        return { employeeId: emp.id, name: `${emp.firstName} ${emp.lastName}`, gross, deductions, netPay };
      });
    }

    const prEmployees = buildPayRunEmployees(employees);
    const totalGross = prEmployees.reduce((s, e) => s + e.gross, 0);
    const totalDeductions = prEmployees.reduce((s, e) => s + e.deductions, 0);
    const totalNetPay = prEmployees.reduce((s, e) => s + e.netPay, 0);

    const payRuns = [
      {
        id: 'PR-2026-01', month: 'January', year: 2026, status: 'Paid', payDate: '2026-01-28',
        processedAt: '2026-01-28T10:00:00Z', employeeCount: employees.length,
        totalGross, totalDeductions, totalNetPay, employees: prEmployees,
      },
      {
        id: 'PR-2026-02', month: 'February', year: 2026, status: 'Paid', payDate: '2026-02-27',
        processedAt: '2026-02-27T10:00:00Z', employeeCount: employees.length,
        totalGross, totalDeductions, totalNetPay, employees: prEmployees,
      },
      {
        id: 'PR-2026-03', month: 'March', year: 2026, status: 'Paid', payDate: '2026-03-28',
        processedAt: '2026-03-28T10:00:00Z', employeeCount: employees.length,
        totalGross, totalDeductions, totalNetPay, employees: prEmployees,
      },
      {
        id: 'PR-2026-04', month: 'April', year: 2026, status: 'Paid', payDate: '2026-04-28',
        processedAt: '2026-04-28T10:00:00Z', employeeCount: employees.length,
        totalGross, totalDeductions, totalNetPay, employees: prEmployees,
      },
      {
        id: 'PR-2026-05', month: 'May', year: 2026, status: 'Draft', payDate: null,
        processedAt: null, employeeCount: employees.length,
        totalGross, totalDeductions, totalNetPay, employees: prEmployees,
      },
    ];

    // ─── LEAVES ────────────────────────────────────────────
    const leaves = [
      { id: 'LV001', employeeId: 'EMP001', employeeName: 'Meera Krishnan', type: 'Casual Leave', startDate: '2026-04-14', endDate: '2026-04-14', days: 1, reason: 'Tamil New Year celebration', status: 'Approved', appliedOn: '2026-04-10' },
      { id: 'LV002', employeeId: 'EMP003', employeeName: 'Priya Natarajan', type: 'Sick Leave', startDate: '2026-04-20', endDate: '2026-04-22', days: 3, reason: 'Fever and cold', status: 'Approved', appliedOn: '2026-04-19' },
      { id: 'LV003', employeeId: 'EMP006', employeeName: 'Senthil Kumar', type: 'Earned Leave', startDate: '2026-05-10', endDate: '2026-05-14', days: 5, reason: 'Family function at Madurai', status: 'Pending', appliedOn: '2026-05-02' },
      { id: 'LV004', employeeId: 'EMP010', employeeName: 'Vijay Murugan', type: 'Casual Leave', startDate: '2026-05-08', endDate: '2026-05-09', days: 2, reason: 'Personal work in Coimbatore', status: 'Pending', appliedOn: '2026-05-03' },
      { id: 'LV005', employeeId: 'EMP002', employeeName: 'Arun Selvam', type: 'Sick Leave', startDate: '2026-03-15', endDate: '2026-03-16', days: 2, reason: 'Dental treatment', status: 'Approved', appliedOn: '2026-03-14' },
      { id: 'LV006', employeeId: 'EMP007', employeeName: 'Divya Raghavan', type: 'Casual Leave', startDate: '2026-05-15', endDate: '2026-05-16', days: 2, reason: 'Temple visit — Rameswaram', status: 'Pending', appliedOn: '2026-05-04' },
      { id: 'LV007', employeeId: 'EMP009', employeeName: 'Anitha Balasubramanian', type: 'Earned Leave', startDate: '2026-02-10', endDate: '2026-02-14', days: 5, reason: 'Vacation to Ooty', status: 'Approved', appliedOn: '2026-01-25' },
    ];

    // ─── LOANS ────────────────────────────────────────────
    const loans = [
      { id: 'LN001', employeeId: 'EMP001', employeeName: 'Meera Krishnan', type: 'Personal Loan', amount: 200000, emiAmount: 18000, tenure: 12, paidEmis: 4, remainingAmount: 128000, status: 'Active', requestDate: '2025-12-01' },
      { id: 'LN002', employeeId: 'EMP004', employeeName: 'Karthik Subramanian', type: 'Home Loan Advance', amount: 500000, emiAmount: 25000, tenure: 24, paidEmis: 6, remainingAmount: 350000, status: 'Active', requestDate: '2025-10-15' },
      { id: 'LN003', employeeId: 'EMP008', employeeName: 'Rajesh Pandian', type: 'Vehicle Loan', amount: 150000, emiAmount: 13000, tenure: 12, paidEmis: 10, remainingAmount: 20000, status: 'Active', requestDate: '2025-06-01' },
      { id: 'LN004', employeeId: 'EMP005', employeeName: 'Lakshmi Venkatesh', type: 'Education Loan', amount: 300000, emiAmount: 15000, tenure: 24, paidEmis: 3, remainingAmount: 255000, status: 'Active', requestDate: '2026-01-10' },
    ];

    // ─── REIMBURSEMENTS ────────────────────────────────────
    const reimbursements = [
      { id: 'RMB001', employeeId: 'EMP001', employeeName: 'Meera Krishnan', category: 'Travel', amount: 4500, date: '2026-04-05', description: 'Conference travel to Anna University, Chennai', status: 'Approved' },
      { id: 'RMB002', employeeId: 'EMP002', employeeName: 'Arun Selvam', category: 'Books & Research', amount: 3200, date: '2026-03-20', description: 'Research journals subscription', status: 'Approved' },
      { id: 'RMB003', employeeId: 'EMP006', employeeName: 'Senthil Kumar', category: 'Medical', amount: 8500, date: '2026-04-25', description: 'Annual health checkup at Apollo Hospital', status: 'Pending' },
      { id: 'RMB004', employeeId: 'EMP011', employeeName: 'Deepa Shanmugam', category: 'Equipment', amount: 15000, date: '2026-05-01', description: 'Lab equipment purchase for CS department', status: 'Pending' },
    ];

    // ─── IT DECLARATIONS ────────────────────────────────────
    const itDeclarations = [
      {
        id: 'ITD001', employeeId: 'EMP001', employeeName: 'Meera Krishnan', financialYear: '2025-2026',
        section80C: { ppf: 50000, elss: 30000, lifeInsurance: 25000, homeLoanPrincipal: 0, nsc: 0, total: 105000 },
        section80D: { selfInsurance: 15000, parentsInsurance: 25000, total: 40000 },
        hra: { rentPaid: 12000, monthsClaimed: 12, total: 144000 },
        otherDeductions: { section80E: 0, section80G: 5000, nps80CCD: 25000, total: 30000 },
        status: 'Submitted', submittedOn: '2026-01-15'
      },
      {
        id: 'ITD002', employeeId: 'EMP004', employeeName: 'Karthik Subramanian', financialYear: '2025-2026',
        section80C: { ppf: 100000, elss: 50000, lifeInsurance: 0, homeLoanPrincipal: 0, nsc: 0, total: 150000 },
        section80D: { selfInsurance: 25000, parentsInsurance: 25000, total: 50000 },
        hra: { rentPaid: 20000, monthsClaimed: 12, total: 240000 },
        otherDeductions: { section80E: 0, section80G: 10000, nps80CCD: 50000, total: 60000 },
        status: 'Submitted', submittedOn: '2026-02-10'
      },
    ];

    // ─── SETTINGS ────────────────────────────────────────
    const settings = {
      id: 'global_settings',
      organization: {
        name: 'Tamil Nadu Arts & Science College',
        address: '45 Gandhi Road, Madurai, Tamil Nadu 625001, India',
        financialYearStart: 'April',
        currency: 'INR (₹)',
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
    };

    // ─── INSERT ALL ─────────────────────────────────────
    await User.insertMany(users);
    console.log(`✅ Inserted ${users.length} users`);

    await Employee.insertMany(employees);
    console.log(`✅ Inserted ${employees.length} employees`);

    await PayRun.insertMany(payRuns);
    console.log(`✅ Inserted ${payRuns.length} pay runs`);

    await Leave.insertMany(leaves);
    console.log(`✅ Inserted ${leaves.length} leaves`);

    await Loan.insertMany(loans);
    console.log(`✅ Inserted ${loans.length} loans`);

    await Reimbursement.insertMany(reimbursements);
    console.log(`✅ Inserted ${reimbursements.length} reimbursements`);

    await ItDeclaration.insertMany(itDeclarations);
    console.log(`✅ Inserted ${itDeclarations.length} IT declarations`);

    await Settings.create(settings);
    console.log('✅ Inserted settings');

    console.log('\n🎉 Tamil Nadu College Payroll data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
