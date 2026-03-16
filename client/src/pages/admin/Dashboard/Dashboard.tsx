import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { dashboardService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import {
  Users, IndianRupee, CalendarCheck, Clock,
  ArrowRight, TrendingUp, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#e5343d', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getData()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-content">Loading...</div>;
  if (!data) return <div className="page-content">Unable to load dashboard data.</div>;

  return (
    <div className="animate-slide-up">
      {/* Welcome Card */}
      <div className="welcome-card">
        <h2>Welcome, {user?.name?.split(' ')[0] || 'Admin'}! 👋</h2>
        <p>Here's what's happening with your payroll today.</p>
      </div>

      {/* Pay Run Status Card */}
      {data.lastPayment && (
        <div className="payrun-card">
          <div className="payrun-card-header">
            <div>
              <div className="card-title" style={{ fontSize: 16 }}>
                Process Pay Run for {data.payRunStatus?.month} {data.payRunStatus?.year}
              </div>
              <span className={`badge badge-${data.payRunStatus?.status?.toLowerCase()}`} style={{ marginTop: 6, display: 'inline-block' }}>
                {data.payRunStatus?.status}
              </span>
            </div>
            <button className="btn btn-primary btn-sm">
              View Details <ArrowRight size={14} />
            </button>
          </div>
          <div className="payrun-card-metrics">
            <div className="payrun-metric">
              <label>Employees' Net Pay</label>
              <span>{formatCurrency(data.lastPayment.netPay)}</span>
            </div>
            <div className="payrun-metric">
              <label>Payment Date</label>
              <span>{data.lastPayment.payDate || '-'}</span>
            </div>
            <div className="payrun-metric">
              <label>No. of Employees</label>
              <span>{data.lastPayment.employeeCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon blue"><Users size={22} /></div>
          <div className="stat-card-content">
            <h3>{data.employeeCount}</h3>
            <p>Active Employees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><IndianRupee size={22} /></div>
          <div className="stat-card-content">
            <h3>{formatCurrency(data.lastPayment?.netPay)}</h3>
            <p>Last Net Pay</p>
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
          <div className="stat-card-icon purple"><CalendarCheck size={22} /></div>
          <div className="stat-card-content">
            <h3>{data.lastPayment?.payDate || '-'}</h3>
            <p>Last Payment Date</p>
          </div>
        </div>
      </div>

      {/* Charts + To-Do Row */}
      <div className="grid grid-2-1" style={{ marginBottom: 24 }}>
        {/* Payroll Cost Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Payroll Cost Summary</div>
            <TrendingUp size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.costTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: '#9a9ab0' }} />
                <YAxis fontSize={11} tick={{ fill: '#9a9ab0' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e8e8ef', fontSize: 12 }}
                />
                <Bar dataKey="netPay" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Net Pay" />
                <Bar dataKey="deductions" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Deductions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* To-Do Tasks */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">To Do Tasks</div>
            <AlertCircle size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          {data.todos.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>All caught up! 🎉</p>
          ) : (
            data.todos.map((todo, i) => (
              <div className="todo-item" key={i}>
                <div className="todo-item-left">
                  <div className={`todo-dot ${todo.type === 'payrun' ? 'orange' : todo.type === 'leave' ? 'blue' : 'red'}`}></div>
                  <span style={{ fontSize: 13 }}>{todo.message}</span>
                </div>
                <span className={`badge badge-${todo.status.toLowerCase().replace(' ', '-')}`}>{todo.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deduction Summary & Department Distribution */}
      <div className="grid grid-2">
        {/* Deduction Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Deduction Summary (Monthly)</div>
          </div>
          <div className="deduction-card">
            <span className="deduction-label">Employee Provident Fund (EPF)</span>
            <span className="deduction-amount">{formatCurrency(data.deductions.epf)}</span>
          </div>
          <div className="deduction-card">
            <span className="deduction-label">Employee State Insurance (ESI)</span>
            <span className="deduction-amount">{formatCurrency(data.deductions.esi)}</span>
          </div>
          <div className="deduction-card">
            <span className="deduction-label">Tax Deducted at Source (TDS)</span>
            <span className="deduction-amount">{formatCurrency(data.deductions.tds)}</span>
          </div>
          <div className="deduction-card">
            <span className="deduction-label">Professional Tax (PT)</span>
            <span className="deduction-amount">{formatCurrency(data.deductions.pt)}</span>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Department Distribution</div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {data.departmentDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8e8ef', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
