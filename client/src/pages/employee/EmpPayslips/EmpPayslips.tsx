import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';
import { FileText, Download, Mail, Eye, Search, ChevronDown, ChevronUp, Briefcase, FileCheck, IndianRupee } from 'lucide-react';

export default function EmpPayslips() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    empSelfService.payslips()
      .then(res => setPayslips(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const sortedPayslips = [...payslips].sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime());
  const latestPayslip = sortedPayslips[0];

  const getPeriodHeading = (ps: any) => {
    const d = new Date(ps.payDate);
    if (Number.isNaN(d.getTime())) return `${ps.month} ${ps.year}`;

    const monthName = d.toLocaleString('en-US', { month: 'long' });
    const day = String(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()).padStart(2, '0');
    return `${monthName} 01 - ${day}, ${d.getFullYear()}`;
  };

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>My Payslips</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
            Manage and download your historical earnings statements, view tax summaries, and track your year-to-date compensation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => toast.success('Statements have been sent to your registered email.')} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#475569', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <Mail size={16} /> Email Statements
          </button>
          <button onClick={() => toast.success('Downloading latest payslip...')} style={{ backgroundColor: '#3b25e7', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
            <Download size={16} /> Download Latest
          </button>
        </div>
      </div>

      {sortedPayslips.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '60px 0', textAlign: 'center', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#94a3b8', marginBottom: '16px' }}><FileText size={48} /></div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>No Payslips Yet</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Your payslips will appear here once payroll is processed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {/* Latest Payslip Breakdown */}
             <div style={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '10px', opacity: 0.1 }}>
                   <Briefcase size={200} />
                </div>
                <div style={{ position: 'relative', zIndex: 10 }}>
                   <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>LATEST PAY PERIOD</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{getPeriodHeading(latestPayslip)}</h2>
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>PAID</span>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                         <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>Net Pay</div>
                         <div style={{ fontSize: '24px', fontWeight: '800' }}>{formatCurrency(latestPayslip.netPay)}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                         <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>Total Earnings</div>
                         <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(latestPayslip.earnings.totalEarnings)}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                         <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>Total Deductions</div>
                         <div style={{ fontSize: '20px', fontWeight: '700', color: '#f87171' }}>-{formatCurrency(latestPayslip.deductions.totalDeductions)}</div>
                      </div>
                   </div>

                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                         <div><span style={{ color: '#94A3B8', marginRight: '8px' }}>PAY DATE:</span> <strong style={{ fontWeight: 600 }}>{formatDate(latestPayslip.payDate)}</strong></div>
                         <div><span style={{ color: '#94A3B8', marginRight: '8px' }}>DEPOSIT:</span> <strong style={{ fontWeight: 600 }}>Bank Transfer</strong></div>
                      </div>
                      <button onClick={() => setExpanded(v => !v)} style={{ backgroundColor: 'transparent', border: 'none', color: '#a5b4fc', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                         {expanded ? 'Hide Breakup' : 'View Breakup'} {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                   </div>
                </div>

                {expanded && (
                   <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', marginTop: '24px', color: '#0f172a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                      <div>
                         <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Earnings</h4>
                         {[
                            ['Basic Salary', latestPayslip.earnings.basic],
                            ['HRA', latestPayslip.earnings.hra],
                            ['Special Allowance', latestPayslip.earnings.special],
                            ['Conveyance', latestPayslip.earnings.conveyance],
                            ['Medical', latestPayslip.earnings.medical],
                         ].map(([label, val]: any, i) => (
                           <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                              <span>{label}</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(val)}</span>
                           </div>
                         ))}
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '16px' }}>
                            <span>Total Earnings</span><span>{formatCurrency(latestPayslip.earnings.totalEarnings)}</span>
                         </div>
                      </div>
                      <div>
                         <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Deductions</h4>
                         {[
                            ['EPF (12%)', latestPayslip.deductions.epf],
                            latestPayslip.deductions.esi > 0 ? ['ESI (0.75%)', latestPayslip.deductions.esi] : null,
                            ['Professional Tax', latestPayslip.deductions.pt],
                            latestPayslip.deductions.tds > 0 ? ['TDS', latestPayslip.deductions.tds] : null,
                         ].filter(Boolean).map((row: any, i) => (
                           <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                              <span>{row[0]}</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(row[1])}</span>
                           </div>
                         ))}
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '16px' }}>
                            <span>Total Deductions</span><span>{formatCurrency(latestPayslip.deductions.totalDeductions)}</span>
                         </div>
                      </div>
                   </div>
                )}
             </div>

             {/* Statement History List */}
             <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f1f5f9' }}>
                   <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Statement History</h3>
                   <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <Search size={16} color="#94a3b8" />
                      <input type="text" placeholder="Search month or year" style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', fontSize: '13px', width: '160px' }} />
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '16px 32px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>
                      <span>PAY PERIOD</span>
                      <span>DATE</span>
                      <span>NET AMOUNT</span>
                      <span>STATUS</span>
                      <span style={{ textAlign: 'right' }}>ACTIONS</span>
                   </div>
                   {sortedPayslips.map((ps, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               <FileCheck size={20} color="#7c3aed" />
                            </div>
                            <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{ps.month} {ps.year}</strong>
                         </div>
                         <div style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(ps.payDate)}</div>
                         <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(ps.netPay)}</div>
                         <div><span style={{ backgroundColor: '#eef2ff', color: '#3b25e7', padding: '4px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '20px', letterSpacing: '0.05em' }}>PAID</span></div>
                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => toast.info(`Viewing details for ${ps.month} ${ps.year} payslip.`)} style={{ border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Eye size={16} /></button>
                            <button onClick={() => toast.success(`Downloading ${ps.month} ${ps.year} payslip...`)} style={{ border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Download size={16} /></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {/* Tax Summary Sidebar Widget */}
             <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                   <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IndianRupee size={20} color="#0d9488" /></div>
                   <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>YTD Tax Summary</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                   {[
                      ['EPF Contribution', latestPayslip.deductions.epf * 12, 84],
                      ['Professional Tax', latestPayslip.deductions.pt * 12, 61],
                      ['ESI / TDS', (latestPayslip.deductions.esi + latestPayslip.deductions.tds) * 12, 42],
                   ].map(([label, val, pct]: any, i) => (
                     <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                           <span style={{ color: '#475569' }}>{label}</span>
                           <span style={{ color: '#0f172a' }}>{formatCurrency(val)}</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                           <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#0d9488', borderRadius: '3px' }}></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                   Your tax and deduction snapshots are visible for this current payroll year. For exact filings, refer to your Form 16.
                </div>
             </div>
          </div>
          
        </div>
      )}

    </div>
  );
}
