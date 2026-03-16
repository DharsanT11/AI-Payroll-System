module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'zoho-payroll-clone-secret-key-2024',
  JWT_EXPIRES_IN: '24h',

  EMPLOYEE_STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ONBOARDING: 'Onboarding',
    TERMINATED: 'Terminated',
  },

  PAYRUN_STATUS: {
    DRAFT: 'Draft',
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
  },

  LEAVE_STATUS: {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  },

  LEAVE_TYPES: {
    CASUAL: 'Casual Leave',
    SICK: 'Sick Leave',
    EARNED: 'Earned Leave',
    MATERNITY: 'Maternity Leave',
    PATERNITY: 'Paternity Leave',
    COMP_OFF: 'Compensatory Off',
  },

  LOAN_STATUS: {
    ACTIVE: 'Active',
    CLOSED: 'Closed',
    PENDING: 'Pending Approval',
  },

  TAX_SLABS_NEW_REGIME: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 700000, rate: 5 },
    { min: 700000, max: 1000000, rate: 10 },
    { min: 1000000, max: 1200000, rate: 15 },
    { min: 1200000, max: 1500000, rate: 20 },
    { min: 1500000, max: Infinity, rate: 30 },
  ],

  DEPARTMENTS: [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Support',
  ],
};
