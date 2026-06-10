import { useState, useEffect } from 'react';
import { loanService } from '../../../services/api';
import { formatCurrency, getBadgeClass } from '../../../utils/helpers';
import { Landmark, Plus, X, Wallet, IndianRupee, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function Loans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '', employeeName: '', type: 'Personal Loan', amount: '', emiAmount: '', tenure: '',
  });
  const toast = useToast();

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = () => {
    loanService.getAll()
      .then(res => setLoans(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    try {
      await loanService.create({ ...formData, amount: Number(formData.amount), emiAmount: Number(formData.emiAmount), tenure: Number(formData.tenure) });
      toast.success(`Loan created for ${formData.employeeName}.`);
      setShowModal(false);
      setFormData({ employeeId: '', employeeName: '', type: 'Personal Loan', amount: '', emiAmount: '', tenure: '' });
      fetchLoans();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create loan.');
    }
  };

  const handlePayEmi = async (id: any) => {
    try {
      await loanService.payEmi(id);
      toast.success('EMI payment recorded successfully.');
      fetchLoans();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to record EMI payment.');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const activeLoans = loans.filter((l: any) => l.status === 'Active');
  const totalOutstanding = activeLoans.reduce((s: number, l: any) => s + l.remainingAmount, 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return { bg: '#dbeafe', col: '#2563eb' };
      case 'Completed': return { bg: '#d1fae5', col: '#059669' };
      default: return { bg: '#fef3c7', col: '#d97706' };
    }
  };

  const statCards = [
    { label: 'Total Loans', value: loans.length, icon: Landmark, bg: '#eef2ff', col: '#4f46e5' },
    { label: 'Active Loans', value: activeLoans.length, icon: Wallet, bg: '#f0fdf4', col: '#10b981' },
    { label: 'Total Outstanding', value: formatCurrency(totalOutstanding), icon: IndianRupee, bg: '#fef2f2', col: '#ef4444' },
  ];

  return (
    <div className="animate-slide-up" style={{ padding: 0, maxWidth: '100%', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Loans</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Employee loan management</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#3b25e7', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
          <Plus size={16} strokeWidth={2.5} /> New Loan
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {statCards.map((card) => {
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

      {/* Loans Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>All Loans</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['ID', 'Employee', 'Type', 'Amount', 'EMI', 'Paid / Total', 'Remaining', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '700', color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loans.map((loan: any) => {
                const ss = getStatusStyle(loan.status);
                return (
                  <tr key={loan.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>{loan.id}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#0f172a' }}>{loan.employeeName}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{loan.type}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{formatCurrency(loan.amount)}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{formatCurrency(loan.emiAmount)}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{loan.paidEmis} / {loan.tenure}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(loan.remainingAmount)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ backgroundColor: ss.bg, color: ss.col, padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.03em' }}>{loan.status}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {loan.status === 'Active' && (
                        <button onClick={() => handlePayEmi(loan.id)} style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Pay EMI</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {loans.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '14px' }}>No loans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()} className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>New Loan</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Employee Name *</label>
                  <input required value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Loan Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}>
                    <option>Personal Loan</option>
                    <option>Home Loan Advance</option>
                    <option>Vehicle Loan</option>
                    <option>Education Loan</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Loan Amount (₹) *</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>EMI Amount (₹) *</label>
                  <input type="number" required value={formData.emiAmount} onChange={e => setFormData({ ...formData, emiAmount: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Tenure (months) *</label>
                <input type="number" required value={formData.tenure} onChange={e => setFormData({ ...formData, tenure: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#3b25e7', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Create Loan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
