import { useState, useEffect } from 'react';
import { reportService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';
import { BarChart3, Users, Upload, UserCheck, UserMinus, UserPlus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3820b7', '#7c3aed', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [empSummary, setEmpSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const tabs = [
    { key: 'payroll', label: 'Payroll Summary' },
    { key: 'department', label: 'Department Wise' },
    { key: 'employee', label: 'Employee Summary' },
  ];

  const totalPayroll = payrollData.reduce((acc, row) => acc + (row.totalGross || 0), 0);

  return (
    <div className="animate-slide-up" style={{ padding: '0 0 80px 0', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#3820b7', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>FINANCIAL ARCHITECT</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Payroll Reports</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Analytical breakdown of organization-wide payroll performance.</p>
        </div>
        <button onClick={() => toast.success('Report export initiated. The file will be ready shortly.')} style={{ backgroundColor: '#3820b7', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(56, 32, 183, 0.2)' }}>
          <Upload size={16} strokeWidth={2.5} /> Export Report
        </button>
      </div>

      {/* Tabs Container */}
      <div style={{ backgroundColor: '#f1f5f9', borderRadius: '16px', padding: '8px', display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isActive ? '#fff' : 'transparent',
                color: isActive ? '#3820B7' : '#94a3b8',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Payroll Summary */}
      {activeTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Main Graph Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  TOTAL PAYROLL (LAST 6 MONTHS)
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {formatCurrency(totalPayroll)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3820b7' }} />
                    GROSS PAY
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#c7d2fe' }} />
                    DEDUCTIONS
                 </div>
              </div>
            </div>

            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData} barGap={4}>
                  <XAxis dataKey="month" fontSize={10} fontWeight={800} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} textAnchor="middle" height={30} opacity={0.6} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }} />
                  <Bar dataKey="totalGross" fill="#3820b7" name="Gross Pay" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar dataKey="totalDeductions" fill="#c7d2fe" name="Deductions" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', padding: '24px 32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>Monthly Performance Data</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                    {['Month', 'Gross Pay', 'Net Pay', 'Staff Count'].map(h => (
                      <th key={h} style={{ padding: '16px 8px', textAlign: 'left', fontWeight: '800', color: '#94a3b8', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: i === payrollData.length - 1 ? 'none' : '1px solid #f8fafc' }}>
                      <td style={{ padding: '24px 8px', fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                        {row.month} {row.year}
                      </td>
                      <td style={{ padding: '24px 8px', fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                        {formatCurrency(row.totalGross)}
                      </td>
                      <td style={{ padding: '24px 8px', fontWeight: '800', color: '#3820b7', fontSize: '14px' }}>
                        {formatCurrency(row.totalNetPay)}
                      </td>
                      <td style={{ padding: '24px 8px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: '800' }}>
                           {row.employeeCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Department Wise */}
      {activeTab === 'department' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Department Distribution</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} dataKey="count" nameKey="department" cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} cornerRadius={4}>
                    {deptData.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Department', 'Employees', 'Total CTC', 'Avg CTC'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deptData.map((dept: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>{dept.department}</td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{dept.count}</td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{formatCurrency(dept.totalCtc)}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>{formatCurrency(Math.round(dept.totalCtc / dept.count))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Employee Summary */}
      {activeTab === 'employee' && empSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { label: 'Total Employees', value: empSummary.total, icon: Users, bg: '#eef2ff', col: '#4f46e5' },
            { label: 'Active', value: empSummary.active, icon: UserCheck, bg: '#f0fdf4', col: '#10b981' },
            { label: 'Inactive', value: empSummary.inactive, icon: UserMinus, bg: '#fef2f2', col: '#ef4444' },
            { label: 'Recent Joiners (3 months)', value: empSummary.recentJoins, icon: UserPlus, bg: '#f5f3ff', col: '#8b5cf6' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: card.bg, padding: '12px', borderRadius: '12px' }}>
                    <Icon size={20} color={card.col} />
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>{card.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{card.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
