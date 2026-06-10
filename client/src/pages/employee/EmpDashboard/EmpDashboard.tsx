import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { Landmark, Plus, FileText, Shield, Receipt, Clock, CheckCircle2, CalendarDays, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';

export default function EmpDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empSelfService.dashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 24 }}>Unable to load dashboard.</div>;

  const firstName = data.employee.name.split(' ')[0];
  const latestPayslip = data.recentPayslips[0] || null;
  const periodEnding = latestPayslip ? formatDate(latestPayslip.payDate) : 'the current cycle';

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cycleProgress = Math.round((today.getDate() / daysInMonth) * 100);
  const daysRemaining = Math.max(daysInMonth - today.getDate(), 0);
  const accruedLeave = data.totalLeaveBalance + data.pendingLeaves;

  const activities = [];
  if (data.pendingLeaves > 0) {
    activities.push({
      icon: Clock, tone: '#f59e0b', bgTone: '#fef3c7',
      title: `${data.pendingLeaves} Leave Request${data.pendingLeaves > 1 ? 's' : ''} Pending`,
      detail: 'Waiting for manager approval.', time: 'Updated now',
    });
  }
  data.recentPayslips.slice(0, 2).forEach((ps: any) => {
    activities.push({
      icon: CheckCircle2, tone: '#10b981', bgTone: '#d1fae5',
      title: 'Payslip Published',
      detail: `Payslip for ${ps.month} ${ps.year} is available.`,
      time: formatDate(ps.payDate),
    });
  });

  const calendarItems = [
    ...(latestPayslip ? [{ date: latestPayslip.payDate, title: `Payday Cycle`, detail: 'Payroll disbursement' }] : []),
    ...data.upcomingHolidays.slice(0, 2).map((h: any) => ({ date: h.date, title: h.name, detail: 'Company holiday' })),
  ];

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Hero Banner */}
      <div style={{ backgroundColor: '#0f172a', borderRadius: '24px', padding: '40px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
         <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 12px 0' }}>Welcome back, {firstName}</h1>
            <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, lineHeight: '1.5', maxWidth: '500px' }}>
              Here is your payroll overview for the period ending <span style={{color: '#fff', fontWeight: '600'}}>{periodEnding}</span>.
            </p>
         </div>
         <a href="/emp/reimbursements" style={{ backgroundColor: '#3b25e7', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} strokeWidth={2.5} /> New Request
         </a>
      </div>

      {/* Grid 1: Net Pay & Leave Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
         
         <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '16px' }}>ESTIMATED NET PAY</div>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{formatCurrency(data.salary.netPay)}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b25e7', fontSize: '13px', fontWeight: '700', marginBottom: '32px' }}>
               <TrendingUp size={16} /> Projected for {latestPayslip ? latestPayslip.month : 'Current'}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', fontWeight: '600', marginBottom: '12px' }}>
               <span>Cycle Progress: {daysRemaining} days left</span>
               <span style={{ color: '#0f172a' }}>{cycleProgress}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${cycleProgress}%`, backgroundColor: '#3b25e7', borderRadius: '4px' }}></div>
            </div>

            <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', opacity: 0.03, zIndex: 0 }}>
               <Landmark size={140} strokeWidth={1.5} />
            </div>
         </div>

         <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '24px' }}>ANNUAL LEAVE</div>
            
            <div style={{ marginBottom: '32px' }}>
               <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0', fontWeight: '600' }}>Balance</p>
               <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{data.totalLeaveBalance} <span style={{fontSize: '16px', color: '#64748b'}}>Days</span></h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
               <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Accrued</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{accruedLeave}</div>
               </div>
               <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Pending</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{data.pendingLeaves}</div>
               </div>
            </div>
            
            <a href="/emp/leave" style={{ display: 'block', textAlign: 'center', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>Apply for Leave</a>
         </div>

      </div>

      {/* Grid 2: Shortcuts */}
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
         <a href="/emp/payslips" style={{ textDecoration: 'none', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><FileText size={24} color="#7c3aed" /></div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Payslips</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Latest from {latestPayslip ? latestPayslip.month : 'N/A'}</div>
         </a>
         <a href="/emp/tax-declaration" style={{ textDecoration: 'none', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fdf2f8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><Shield size={24} color="#db2777" /></div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Tax Docs</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Open declarations</div>
         </a>
         <a href="/emp/reimbursements" style={{ textDecoration: 'none', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdfa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><Receipt size={24} color="#0d9488" /></div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Expenses</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Submit new claims</div>
         </a>
         <a href="/emp/loans" style={{ textDecoration: 'none', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><CalendarDays size={24} color="#ea580c" /></div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Loans</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active repayment</div>
         </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
         {/* Recent Activity */}
         <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Recent Activity</h3>
               <a href="/emp/payslips" style={{ fontSize: '13px', color: '#3b25e7', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View All <ArrowRight size={14} /></a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {activities.map((item, i) => {
                 const ActivityIcon = item.icon;
                 return (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: i !== activities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: item.bgTone || '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ActivityIcon size={20} color={item.tone || '#64748b'} />
                      </div>
                      <div style={{ flex: 1 }}>
                         <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                         <div style={{ fontSize: '13px', color: '#64748b' }}>{item.detail}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{item.time}</div>
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Calendar */}
         <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ marginBottom: '24px' }}>
               <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Payroll Calendar</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {calendarItems.map((item, i) => {
                 const d = new Date(item.date);
                 const valid = !Number.isNaN(d.getTime());
                 return (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px', textAlign: 'center', minWidth: '50px' }}>
                         <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '2px' }}>{valid ? d.toLocaleString('en', { month: 'short' }) : '--'}</div>
                         <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{valid ? String(d.getDate()).padStart(2, '0') : '--'}</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                         <div style={{ fontSize: '13px', color: '#64748b' }}>{item.detail}</div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>

    </div>
  );
}
