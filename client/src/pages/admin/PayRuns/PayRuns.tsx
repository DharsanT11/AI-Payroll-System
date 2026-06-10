import { useState, useEffect } from 'react';
import { payRunService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Plus, CheckCircle, X, Wallet, Users, Clock, Filter, FileText } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function PayRuns() {
  const [payRuns, setPayRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const toast = useToast();

  useEffect(() => { fetchPayRuns(); }, []);

  const fetchPayRuns = () => {
    payRunService.getAll()
      .then(res => setPayRuns(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: string | number) => {
    try {
      await payRunService.approve(id);
      toast.success('Pay run approved. Ready for processing.');
      fetchPayRuns();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve pay run.');
    }
  };

  const handleProcess = async (id: string | number) => {
    try {
      await payRunService.process(id);
      toast.success('Pay run processed successfully! Payments disbursed.');
      fetchPayRuns();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to process pay run.');
    }
  };

  const viewDetails = async (id: string | number) => {
    const res = await payRunService.getById(id);
    setDetailData(res.data.data);
    setSelectedRun(id);
  };

  const totalNetPay = payRuns.reduce((sum, run) => run.status === 'Paid' ? sum + (run.totalNetPay || 0) : sum, 0);
  const pendingApprovals = payRuns.filter(run => run.status === 'Draft' || run.status === 'Approved').length;
  const activeEmployees = payRuns.length > 0 ? payRuns[0].employeeCount : 0;

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Pay Runs</h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, maxWidth: '500px', lineHeight: '1.5' }}>
            Manage your organization's compensation cycles, approve pending payrolls, and review historical disbursements.
          </p>
        </div>
        <button 
          onClick={async () => {
            try {
              const now = new Date();
              await payRunService.create({
                month: now.toLocaleString('en-US', { month: 'long' }),
                year: now.getFullYear(),
              });
              toast.success('New pay run created as Draft.');
              fetchPayRuns();
            } catch (err: any) {
              toast.error(err?.response?.data?.message || 'Failed to create pay run.');
            }
          }}
          style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 37, 231, 0.25)' }}
        >
          <Plus size={18} strokeWidth={3} /> New Pay Run
        </button>
      </div>

      {/* 3 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        {/* Total Net Pay */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f5f3ff', padding: '12px', borderRadius: '12px', color: '#7c3aed' }}>
              <Wallet size={20} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>TOTAL NET PAY <br/>(OCT)</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{formatCurrency(totalNetPay || 248320)}</span>
            <span style={{ color: '#3b25e7', fontSize: '12px', fontWeight: '700' }}>+4.2%</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#fff1f2', padding: '12px', borderRadius: '12px', color: '#e11d48' }}>
              <Clock size={20} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>PENDING APPROVAL</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{pendingApprovals}</span>
            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Active Cycles</span>
          </div>
        </div>

        {/* Active Employees */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
              <Users size={20} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>ACTIVE EMPLOYEES</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{activeEmployees || 142}</span>
            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Full-time</span>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Cycles</h2>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <Filter size={20} />
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>ID & PERIOD</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>EMPLOYEES</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>NET PAY</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>PAY DATE</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>STATUS</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {payRuns.map(pr => (
              <tr key={pr.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>PR-{pr.year}-{pr.id.toString().padStart(3, '0')}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{pr.month} {pr.year}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Monthly</div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#0f172a', border: '2px solid #fff', zIndex: 3, backgroundImage: 'url("https://i.pravatar.cc/100?img=1")', backgroundSize: 'cover' }}></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b25e7', border: '2px solid #fff', marginLeft: '-12px', zIndex: 2, backgroundImage: 'url("https://i.pravatar.cc/100?img=2")', backgroundSize: 'cover' }}></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#3b25e7', fontSize: '11px', fontWeight: '700', border: '2px solid #fff', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      +{pr.employeeCount}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '24px 16px', fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>
                  {formatCurrency(pr.totalNetPay)}
                </td>
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#64748b' }}>
                  {pr.payDate ? (
                    <>
                      <div style={{ color: '#0f172a', fontWeight: 600 }}>{new Date(pr.payDate).toLocaleString('default', { month: 'short' })} {new Date(pr.payDate).getDate()}</div>
                      <div>{new Date(pr.payDate).getFullYear()}</div>
                    </>
                  ) : '-'}
                </td>
                <td style={{ padding: '24px 16px' }}>
                  {pr.status === 'Draft' || pr.status === 'Approved' ? (
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#3b25e7', backgroundColor: '#eef2ff', padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b25e7' }}></div> {pr.status}
                     </div>
                  ) : (
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8' }}></div> {pr.status}
                     </div>
                  )}
                </td>
                <td style={{ padding: '24px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {(pr.status === 'Paid' || pr.status === 'Approved') && (
                      <button onClick={() => viewDetails(pr.id)} style={{ background: 'none', border: 'none', color: '#3b25e7', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        View Report
                      </button>
                    )}
                    {pr.status === 'Draft' && (
                       <>
                         <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                         <button onClick={() => handleApprove(pr.id)} style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
                           Approve
                         </button>
                       </>
                    )}
                    {pr.status === 'Approved' && (
                       <button onClick={() => handleProcess(pr.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
                         Process & Pay
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRun && detailData && (
        <div className="modal-overlay" onClick={() => setSelectedRun(null)}>
          <div className="modal" style={{ maxWidth: 700, borderRadius: '24px', padding: 0 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Pay Run — {detailData.month} {detailData.year}</h2>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px', cursor: 'pointer', display: 'flex' }} onClick={() => setSelectedRun(null)}>
                <X size={18} color="#64748b" />
              </button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>TOTAL GROSS</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formatCurrency(detailData.totalGross)}</div>
                </div>
                <div style={{ backgroundColor: '#fff1f2', borderRadius: '16px', padding: '20px', border: '1px solid #ffe4e6' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#e11d48', marginBottom: '8px' }}>TOTAL DEDUCTIONS</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#be123c' }}>{formatCurrency(detailData.totalDeductions)}</div>
                </div>
                <div style={{ backgroundColor: '#eef2ff', borderRadius: '16px', padding: '20px', border: '1px solid #e0e7ff' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b25e7', marginBottom: '8px' }}>TOTAL NET PAY</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b25e7' }}>{formatCurrency(detailData.totalNetPay)}</div>
                </div>
              </div>
              
              {detailData.employees && detailData.employees.length > 0 && (
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '16px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>EMPLOYEE</th>
                        <th style={{ padding: '16px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>GROSS</th>
                        <th style={{ padding: '16px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>DEDUCTIONS</th>
                        <th style={{ padding: '16px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>NET PAY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.employees.map((e: any, idx: number) => (
                        <tr key={e.employeeId} style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{e.name}</td>
                          <td style={{ padding: '16px', color: '#475569', fontSize: '13px' }}>{formatCurrency(e.gross)}</td>
                          <td style={{ padding: '16px', color: '#e11d48', fontSize: '13px' }}>{formatCurrency(e.deductions)}</td>
                          <td style={{ padding: '16px', fontWeight: 700, color: '#3b25e7', fontSize: '14px' }}>{formatCurrency(e.netPay)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
