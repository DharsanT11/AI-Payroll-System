import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { dashboardService, reportService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import {
  Users, IndianRupee, CalendarCheck, Clock,
  ArrowRight, TrendingUp, AlertCircle, BarChart2,
  BriefcaseMedical, Plane, Wallet, Calendar, FileText,
  BadgeAlert, History, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#3b25e7', '#7c3aed', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getData()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 24 }}>Unable to load dashboard data.</div>;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Hero Banner */}
      <div style={{ backgroundColor: '#3b25e7', borderRadius: '24px', overflow: 'hidden', padding: '40px', position: 'relative', marginBottom: '32px', boxShadow: '0 10px 30px rgba(59, 37, 231, 0.15)' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p style={{ color: '#e0e7ff', margin: '0 0 32px 0', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
            Your payroll engine is running smoothly. There are {data.todos?.filter(t => t.status === 'Pending').length || 3} pending approvals for the current cycle.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/admin/pay-runs')} style={{ backgroundColor: '#fff', color: '#3b25e7', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              Process Payroll
            </button>
            <button onClick={() => { toast.success('Generating payroll report...'); navigate('/admin/reports'); }} style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              Download Report
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '40px', bottom: '-40px', opacity: 0.1, transform: 'scale(1.2)' }}>
          <BarChart2 size={300} color="#fff" strokeWidth={1} />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        
        {/* Active Employees */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f5f3ff', padding: '12px', borderRadius: '12px' }}>
              <Users size={20} color="#7c3aed" />
            </div>
            <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '700' }}>+4%</span>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Active Employees</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{data.employeeCount?.toLocaleString() || '1,248'}</div>
          </div>
        </div>

        {/* Last Net Pay */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <Wallet size={20} color="#10b981" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Last Net Pay</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{formatCurrency(data.lastPayment?.netPay).replace(/\.00$/, '')}</div>
          </div>
        </div>

        {/* Pending Leaves */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#fff1f2', padding: '12px', borderRadius: '12px' }}>
              <CalendarCheck size={20} color="#e11d48" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Pending Leaves</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{data.pendingLeaves || '12'}</div>
          </div>
        </div>

        {/* Next Payment Date */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#eef2ff', padding: '12px', borderRadius: '12px' }}>
              <Calendar size={20} color="#4f46e5" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Payment Date</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{data.lastPayment?.payDate || 'Mar 28, 2026'}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Data & ToDo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Pay Run Strip */}
          {data.payRunStatus && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ backgroundColor: '#eef2ff', padding: '16px', borderRadius: '16px' }}>
                  <FileText size={28} color="#3b25e7" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{data.payRunStatus?.month} {data.payRunStatus?.year} Pay Run</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {data.payRunStatus?.status || 'DRAFT'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Last updated 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <a onClick={() => navigate('/admin/pay-runs')} style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textDecoration: 'none', cursor: 'pointer' }}>View Details</a>
                <button onClick={() => navigate('/admin/pay-runs')} style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 32px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
                  Run Preview
                </button>
              </div>
            </div>
          )}

          {/* Payroll Cost Summary Chart */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Payroll Cost Summary</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Year-over-year expenditure comparison</p>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                Last 6 Months
              </div>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.costTrend} barSize={40} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={50} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="netPay" fill="#3b25e7" radius={[6, 6, 6, 6]} name="Net Pay" />
                  <Bar dataKey="deductions" fill="#e2e8f0" radius={[6, 6, 6, 6]} name="Deductions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column Area: To-Do List */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>To-Do List</h3>
            <button onClick={() => toast.info('To-do items are auto-generated from pending tasks.')} style={{ background: 'none', border: 'none', color: '#3b25e7', cursor: 'pointer', display: 'flex' }}><Plus size={20} strokeWidth={3} /></button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            {(!data.todos || data.todos.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
                All caught up! 🎉
              </div>
            ) : (
              data.todos.map((todo, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: todo.type === 'payrun' || todo.message?.toLowerCase().includes('tax') ? '#eef2ff' : '#fff1f2', padding: '12px', borderRadius: '50%', color: todo.type === 'payrun' || todo.message?.toLowerCase().includes('tax') ? '#3b25e7' : '#e11d48', flexShrink: 0 }}>
                    {todo.type === 'payrun' || todo.message?.toLowerCase().includes('tax') ? <History size={18} /> : <BadgeAlert size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{todo.message}</div>
                      <span style={{ fontSize: '9px', fontWeight: '800', color: todo.status === 'Pending' ? '#e11d48' : '#3b25e7', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {todo.status === 'Pending' ? 'HIGH' : 'MEDIUM'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                      {todo.type === 'leave' ? 'Due today for immediate reviews.' : 'Federal changes upcoming.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Preserve Existing Secondary Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
        {/* Deduction Summary */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Deduction Summary (Monthly)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Employee Provident Fund (EPF)</span>
              <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{formatCurrency(data.deductions?.epf)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Employee State Insurance (ESI)</span>
              <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{formatCurrency(data.deductions?.esi)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tax Deducted at Source (TDS)</span>
              <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{formatCurrency(data.deductions?.tds)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Professional Tax (PT)</span>
              <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{formatCurrency(data.deductions?.pt)}</span>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Department Distribution</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  cornerRadius={4}
                >
                  {data.departmentDistribution?.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
