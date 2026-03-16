import { useState, useEffect } from 'react';
import { reportService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { BarChart3, Users, Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#e5343d', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [payrollData, setPayrollData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [empSummary, setEmpSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.payrollSummary(),
      reportService.departmentWise(),
      reportService.employeeSummary(),
    ])
      .then(([p, d, e]) => {
        setPayrollData(p.data.data);
        setDeptData(d.data.data);
        setEmpSummary(e.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Payroll analytics and insights</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="tabs">
        {[
          { key: 'payroll', label: 'Payroll Summary' },
          { key: 'department', label: 'Department Wise' },
          { key: 'employee', label: 'Employee Summary' },
        ].map(tab => (
          <div
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Payroll Summary */}
      {activeTab === 'payroll' && (
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title">Monthly Payroll Cost Breakdown</div>
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                  <XAxis dataKey="month" fontSize={11} tick={{ fill: '#9a9ab0' }} />
                  <YAxis fontSize={11} tick={{ fill: '#9a9ab0' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={value => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: '1px solid #e8e8ef', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="totalGross" fill="#3b82f6" name="Gross Pay" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalDeductions" fill="#f59e0b" name="Deductions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalNetPay" fill="#10b981" name="Net Pay" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Employees</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{row.month} {row.year}</td>
                    <td>{formatCurrency(row.totalGross)}</td>
                    <td>{formatCurrency(row.totalDeductions)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(row.totalNetPay)}</td>
                    <td>{row.employeeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Wise */}
      {activeTab === 'department' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Department Distribution</div>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} dataKey="count" nameKey="department" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {deptData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Total CTC</th>
                  <th>Avg CTC</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map((dept, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{dept.department}</td>
                    <td>{dept.count}</td>
                    <td>{formatCurrency(dept.totalCtc)}</td>
                    <td>{formatCurrency(Math.round(dept.totalCtc / dept.count))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Summary */}
      {activeTab === 'employee' && empSummary && (
        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card-icon blue"><Users size={22} /></div>
            <div className="stat-card-content">
              <h3>{empSummary.total}</h3>
              <p>Total Employees</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon green"><Users size={22} /></div>
            <div className="stat-card-content">
              <h3>{empSummary.active}</h3>
              <p>Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon red"><Users size={22} /></div>
            <div className="stat-card-content">
              <h3>{empSummary.inactive}</h3>
              <p>Inactive</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon purple"><Users size={22} /></div>
            <div className="stat-card-content">
              <h3>{empSummary.recentJoins}</h3>
              <p>Recent Joiners (3 months)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
