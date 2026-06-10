import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('payroll_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────
export const authService = {
  login: (email?: any, password?: any) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// ─── Dashboard ───────────────────────────────────────────
export const dashboardService = {
  getData: () => api.get('/dashboard'),
};

// ─── Employees ───────────────────────────────────────────
export const employeeService = {
  getAll: (params?: any) => api.get('/employees', { params }),
  getById: (id?: any) => api.get(`/employees/${id}`),
  create: (data?: any) => api.post('/employees', data),
  update: (id?: any, data?: any) => api.put(`/employees/${id}`, data),
  delete: (id?: any) => api.delete(`/employees/${id}`),
};

// ─── Pay Runs ────────────────────────────────────────────
export const payRunService = {
  getAll: () => api.get('/pay-runs'),
  getById: (id?: any) => api.get(`/pay-runs/${id}`),
  create: (data?: any) => api.post('/pay-runs', data),
  approve: (id?: any) => api.put(`/pay-runs/${id}/approve`),
  process: (id?: any) => api.put(`/pay-runs/${id}/process`),
};

// ─── Leaves ──────────────────────────────────────────────
export const leaveService = {
  getAll: (params?: any) => api.get('/leaves', { params }),
  create: (data?: any) => api.post('/leaves', data),
  approve: (id?: any) => api.put(`/leaves/${id}/approve`),
  reject: (id?: any) => api.put(`/leaves/${id}/reject`),
};

// ─── Taxes ───────────────────────────────────────────────
export const taxService = {
  getSummary: () => api.get('/taxes/summary'),
  getEmployee: (id?: any) => api.get(`/taxes/employee/${id}`),
};

// ─── Loans ───────────────────────────────────────────────
export const loanService = {
  getAll: () => api.get('/loans'),
  create: (data?: any) => api.post('/loans', data),
  payEmi: (id?: any) => api.put(`/loans/${id}/pay-emi`),
};

// ─── Reports ─────────────────────────────────────────────
export const reportService = {
  payrollSummary: () => api.get('/reports/payroll-summary'),
  departmentWise: () => api.get('/reports/department-wise'),
  employeeSummary: () => api.get('/reports/employee-summary'),
};

// ─── Settings ────────────────────────────────────────────
export const settingsService = {
  getAll: () => api.get('/settings'),
  updateOrg: (data?: any) => api.put('/settings/organization', data),
  updateSalary: (data?: any) => api.put('/settings/salary-components', data),
};

// ─── Employee Self-Service ───────────────────────────────
export const empSelfService = {
  dashboard: () => api.get('/employee/dashboard'),
  payslips: () => api.get('/employee/payslips'),
  profile: () => api.get('/employee/profile'),
  updateProfile: (data?: any) => api.put('/employee/profile', data),
  leaves: () => api.get('/employee/leaves'),
  applyLeave: (data?: any) => api.post('/employee/leaves', data),
  loans: () => api.get('/employee/loans'),
  reimbursements: () => api.get('/employee/reimbursements'),
  submitReimbursement: (data?: any) => api.post('/employee/reimbursements', data),
  itDeclarations: () => api.get('/employee/it-declarations'),
  submitItDeclaration: (data?: any) => api.post('/employee/it-declarations', data),
};

// ─── AI Chatbot ──────────────────────────────────────────
export const chatbotService = {
  sendMessage: (message: string) => api.post('/chatbot', { message }),
};

export default api;
