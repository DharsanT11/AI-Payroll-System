import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, getBadgeClass } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';
import { Landmark, TrendingDown, CheckCircle2, Home, Car, GraduationCap, ArrowRight, Banknote, History, HelpCircle } from 'lucide-react';

export default function EmpLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    empSelfService.loans()
      .then(res => setLoans(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const activeDebt = loans.reduce((acc, loan) => acc + loan.remainingAmount, 0);

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Inter, sans-serif' }}>
          Loans Management
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{textAlign: 'right'}}>
             <div style={{fontSize: '11px', fontWeight: '700', color: '#4f46e5', letterSpacing: '0.05em'}}>EMPLOYEE PORTAL</div>
             <div style={{fontSize: '11px', color: '#94a3b8', letterSpacing: '0.05em'}}>NEXUS ENTERPRISE</div>
           </div>
           <div style={{width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', overflow: 'hidden'}}>
             <img src="https://i.pravatar.cc/100?img=11" alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
           </div>
        </div>
      </div>

      {/* Top Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '24px', marginBottom: '40px' }}>
        
        {/* Eligibility Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', letterSpacing: '0.05em', marginBottom: '12px' }}>ELIGIBILITY STATUS</div>
          <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>₹5,00,000</h2>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', maxWidth: '420px', marginBottom: '32px' }}>
             Based on your tenure and current compensation, you are eligible for an instant loan approval up to the amount shown above.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <button onClick={() => toast.success('Opening loan application form...')} style={{ backgroundColor: '#3b25e7', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 37, 231, 0.2)' }}>
                <Banknote size={18} /> Request New Loan
             </button>
             <button onClick={() => toast.info('Loading loan history...')} style={{ backgroundColor: 'transparent', color: '#475569', border: 'none', padding: '12px 16px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                View History <History size={18} />
             </button>
          </div>
          <div style={{ position: 'absolute', right: '32px', top: '32px', opacity: 0.1, color: '#94a3b8' }}>
             <Landmark size={140} strokeWidth={1.5} />
          </div>
        </div>

        {/* Preferred Rates Card */}
        <div style={{ backgroundColor: '#211e4e', borderRadius: '16px', padding: '32px', color: 'white', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(33,30,78,0.2)' }}>
          <div>
             <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <TrendingDown size={20} color="#c7d2fe" />
             </div>
             <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>Preferred Rates</h3>
             <p style={{ color: '#c7d2fe', fontSize: '13px', lineHeight: '1.6', opacity: 0.9 }}>
                Alex, as a Senior Developer, you qualify for our 3.2% exclusive interest rate on housing loans.
             </p>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
             <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#818cf8', letterSpacing: '0.05em', marginBottom: '4px' }}>CURRENT ACTIVE DEBT</div>
                <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>{formatCurrency(activeDebt)}</div>
             </div>
             <div style={{ backgroundColor: '#c7d2fe', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} color="#211e4e" strokeWidth={3} />
             </div>
          </div>
        </div>
      </div>

      {/* Browse Loan Types */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
           <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>Browse Loan Types</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Select a category to view specific terms and application details.</p>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ height: '1px', width: '200px', backgroundColor: '#e2e8f0' }} />
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', letterSpacing: '0.05em' }}>AVAILABLE CATEGORIES</div>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
           {/* Housing Loan */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ backgroundColor: '#f5f3ff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <Home size={28} color="#4f46e5" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>Housing Loan</h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px', minHeight: '66px' }}>
                 Competitive rates for first-time buyers and home renovations with tenure up to 15 years.
              </p>
              <button onClick={() => toast.info('Loading Housing Loan details...')} style={{ background: 'transparent', border: 'none', color: '#3b25e7', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                 Learn More <ArrowRight size={16} strokeWidth={2.5} />
              </button>
           </div>

           {/* Vehicle Loan */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ backgroundColor: '#f5f3ff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <Car size={28} color="#4f46e5" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>Vehicle Loan</h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px', minHeight: '66px' }}>
                 Financing for new and used vehicles with rapid approval and minimal documentation.
              </p>
              <button onClick={() => toast.info('Loading Vehicle Loan details...')} style={{ background: 'transparent', border: 'none', color: '#3b25e7', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                 Learn More <ArrowRight size={16} strokeWidth={2.5} />
              </button>
           </div>

           {/* Education Loan */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ backgroundColor: '#f5f3ff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <GraduationCap size={28} color="#4f46e5" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>Education Loan</h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px', minHeight: '66px' }}>
                 Support for your career growth and family's educational needs with deferred repayment options.
              </p>
              <button onClick={() => toast.info('Loading Education Loan details...')} style={{ background: 'transparent', border: 'none', color: '#3b25e7', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                 Learn More <ArrowRight size={16} strokeWidth={2.5} />
              </button>
           </div>
        </div>
      </div>

      {/* FAQ Header */}
      <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
         <div style={{ color: '#3b25e7' }}>
            <HelpCircle size={24} />
         </div>
         <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Frequently Asked Questions</h3>
      </div>

      {/* Existing Active Loans Features Preserved Below Dashboard */}
      {loans.length > 0 && (
         <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>Your Active Loans Details</h2>
            {loans.map(loan => (
              <div className="card" key={loan.id} style={{ marginBottom: 16 }}>
                <div className="card-header">
                  <div className="card-title">{loan.type}</div>
                  <span className={`badge ${getBadgeClass(loan.status)}`}>{loan.status}</span>
                </div>

                <div className="grid grid-4" style={{ marginTop: 12 }}>
                  <div>
                    <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Loan Amount</small>
                    <strong style={{ fontSize: 14 }}>{formatCurrency(loan.amount)}</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Monthly EMI</small>
                    <strong style={{ fontSize: 14 }}>{formatCurrency(loan.emiAmount)}</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>EMIs Paid</small>
                    <strong style={{ fontSize: 14 }}>{loan.paidEmis} / {loan.tenure}</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Remaining</small>
                    <strong style={{ fontSize: 14, color: 'var(--color-danger)' }}>{formatCurrency(loan.remainingAmount)}</strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="loan-progress" style={{ marginTop: 16 }}>
                  <div className="loan-progress-bar">
                    <div
                      className="loan-progress-fill"
                      style={{ width: `${(loan.paidEmis / loan.tenure) * 100}%`, backgroundColor: '#3b25e7' }}
                    ></div>
                  </div>
                  <small style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4, display: 'block' }}>
                    {Math.round((loan.paidEmis / loan.tenure) * 100)}% completed
                  </small>
                </div>
              </div>
            ))}
         </div>
      )}

    </div>
  );
}
