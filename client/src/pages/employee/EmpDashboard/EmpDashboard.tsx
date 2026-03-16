import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import {
  IndianRupee, CalendarDays, FileText, Clock,
  ArrowRight, Gift, AlertCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function EmpDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empSelfService.dashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Unable to load dashboard.</div>;

  const leaveData = [
    { name: 'Casual', value: data.leaveBalance.casual },
    { name: 'Sick', value: data.leaveBalance.sick },
    { name: 'Earned', value: data.leaveBalance.earned },
    { name: 'Comp Off', value: data.leaveBalance.compOff },
  ];

  return (
    <div className="animate-slide-up">
      {/* Welcome Section */}
      <div className="emp-welcome-card">
        <div className="emp-welcome-left">
          <h2>Welcome, {data.employee.name.split(' ')[0]}! 👋</h2>
          <p>{data.employee.designation} — {data.employee.department}</p>
          <p className="emp-id">ID: {data.employee.id}</p>
        </div>
      </div>

      {/* Salary Summary + Quick Stats */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><IndianRupee size={22} /></div>
          <div className="stat-card-content">
            <h3>{formatCurrency(data.salary.netPay)}</h3>
            <p>Monthly Net Pay</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon blue"><CalendarDays size={22} /></div>
          <div className="stat-card-content">
            <h3>{data.totalLeaveBalance}</h3>
            <p>Leave Balance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Clock size={22} /></div>
          <div className="stat-card-content">
            <h3>{data.pendingLeaves}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple"><FileText size={22} /></div>
          <div className="stat-card-content">
            <h3>{data.pendingReimbursements}</h3>
            <p>Pending Reimbursements</p>
          </div>
        </div>
      </div>

      {/* Salary Breakdown + Leave Balance */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Salary Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Salary Breakdown (Monthly)</div>
          </div>
          <div className="salary-breakdown">
            <div className="salary-section">
              <h4 className="salary-section-title earnings">Earnings</h4>
              <div className="salary-row">
                <span>Basic Salary</span>
                <span>{formatCurrency(data.salary.monthlyBasic)}</span>
              </div>
              <div className="salary-row">
                <span>HRA</span>
                <span>{formatCurrency(data.salary.monthlyHRA)}</span>
              </div>
              <div className="salary-row">
                <span>Special Allowance</span>
                <span>{formatCurrency(data.salary.monthlySpecial)}</span>
              </div>
              <div className="salary-row total">
                <span>Gross Earnings</span>
                <span>{formatCurrency(data.salary.monthlyCTC)}</span>
              </div>
            </div>
            <div className="salary-section">
              <h4 className="salary-section-title deductions">Deductions</h4>
              <div className="salary-row">
                <span>EPF</span>
                <span>-{formatCurrency(data.salary.epf)}</span>
              </div>
              {data.salary.esi > 0 && (
                <div className="salary-row">
                  <span>ESI</span>
                  <span>-{formatCurrency(data.salary.esi)}</span>
                </div>
              )}
              <div className="salary-row">
                <span>Professional Tax</span>
                <span>-{formatCurrency(data.salary.pt)}</span>
              </div>
              <div className="salary-row total">
                <span>Total Deductions</span>
                <span>-{formatCurrency(data.salary.totalDeductions)}</span>
              </div>
            </div>
            <div className="salary-net">
              <span>Net Pay</span>
              <span>{formatCurrency(data.salary.netPay)}</span>
            </div>
          </div>
        </div>

        {/* Leave Balance Donut */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Leave Balance</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {leaveData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8e8ef', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="leave-balance-grid">
            <div className="leave-balance-item">
              <span className="leave-dot" style={{ background: '#3b82f6' }}></span>
              Casual: <strong>{data.leaveBalance.casual}</strong>
            </div>
            <div className="leave-balance-item">
              <span className="leave-dot" style={{ background: '#10b981' }}></span>
              Sick: <strong>{data.leaveBalance.sick}</strong>
            </div>
            <div className="leave-balance-item">
              <span className="leave-dot" style={{ background: '#f59e0b' }}></span>
              Earned: <strong>{data.leaveBalance.earned}</strong>
            </div>
            <div className="leave-balance-item">
              <span className="leave-dot" style={{ background: '#8b5cf6' }}></span>
              Comp Off: <strong>{data.leaveBalance.compOff}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payslips + Upcoming Holidays */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Payslips</div>
            <a href="/emp/payslips" className="card-link">View All <ArrowRight size={14} /></a>
          </div>
          {data.recentPayslips.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No payslips yet.</p>
          ) : (
            data.recentPayslips.map((ps, i) => (
              <div className="todo-item" key={i}>
                <div className="todo-item-left">
                  <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{ps.month} {ps.year}</span>
                    <small style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: 11 }}>{formatDate(ps.payDate)}</small>
                  </div>
                </div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(ps.netPay)}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Upcoming Holidays</div>
          </div>
          {data.upcomingHolidays.map((h, i) => (
            <div className="todo-item" key={i}>
              <div className="todo-item-left">
                <Gift size={16} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 13 }}>{h.name}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(h.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
