import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Plus, X, Search, Filter, MoreVertical, Plane, Wifi, Utensils, Car, Receipt, BarChart2, CalendarClock, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function EmpReimbursements() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Travel', description: '', amount: '', date: '',
  });
  const toast = useToast();

  useEffect(() => { fetchClaims(); }, []);

  const fetchClaims = () => {
    empSelfService.reimbursements()
      .then(res => setClaims(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await empSelfService.submitReimbursement({ ...formData, amount: Number(formData.amount) });
      toast.success('Reimbursement claim submitted successfully!');
      setShowModal(false);
      setFormData({ category: 'Travel', description: '', amount: '', date: '' });
      fetchClaims();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit reimbursement.');
    }
  };

  if (loading) return <div>Loading...</div>;

  const totalPending = claims.filter(c => c.status === 'Pending').reduce((s, c) => s + c.amount, 0);
  const totalApproved = claims.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'travel': return <Plane size={18} color="#4f46e5" />;
      case 'internet': return <Wifi size={18} color="#4f46e5" />;
      case 'meals':
      case 'meal': return <Utensils size={18} color="#4f46e5" />;
      case 'mileage': return <Car size={18} color="#4f46e5" />;
      default: return <Receipt size={18} color="#4f46e5" />;
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0', fontFamily: 'Inter, sans-serif' }}>Reimbursements</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px', maxWidth: '600px', lineHeight: '1.5' }}>
            Track your business expenses, submit new claims, and monitor the approval status of your financial requests.
          </p>
        </div>
        <button 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            backgroundColor: '#3b25e7', color: 'white', 
            border: 'none', borderRadius: '8px', 
            padding: '12px 20px', fontSize: '14px', fontWeight: '600', 
            cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 37, 231, 0.2)' 
          }} 
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} strokeWidth={2.5} /> New Claim
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        
        {/* Total Claims Card */}
        <div style={{ 
          backgroundColor: '#fff', borderRadius: '16px', padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>TOTAL CLAIMS</span>
            <div style={{ backgroundColor: '#eef2ff', padding: '8px', borderRadius: '8px' }}>
              <BarChart2 size={20} color="#4f46e5" />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{claims.length}</h3>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.04 }}>
            <BarChart2 size={120} />
          </div>
        </div>

        {/* Pending Card */}
        <div style={{ 
          backgroundColor: '#fff', borderRadius: '16px', padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden',
          borderLeft: '4px solid #4f46e5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>PENDING AMOUNT</span>
            <div style={{ backgroundColor: '#fff7ed', padding: '8px', borderRadius: '8px' }}>
              <CalendarClock size={20} color="#ea580c" />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{formatCurrency(totalPending)}</h3>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.04 }}>
            <CalendarClock size={120} />
          </div>
        </div>

        {/* Approved Card */}
        <div style={{ 
          backgroundColor: '#fff', borderRadius: '16px', padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden',
          borderLeft: '4px solid #4f46e5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>APPROVED AMOUNT</span>
            <div style={{ backgroundColor: '#eef2ff', padding: '8px', borderRadius: '8px' }}>
              <BadgeCheck size={20} color="#4f46e5" />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{formatCurrency(totalApproved)}</h3>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.04 }}>
            <BadgeCheck size={120} />
          </div>
        </div>

      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        
        {/* Table Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Active Claims History</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search claims..." 
                style={{ 
                  padding: '10px 16px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                  backgroundColor: '#f8fafc', fontSize: '13px', width: '220px', outline: 'none', color: '#334155'
                }} 
              />
            </div>
            <button onClick={() => toast.info('Advanced filtering will be available soon.')} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', 
              width: '40px', height: '40px', cursor: 'pointer', color: '#64748b'
            }}>
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>CLAIM DETAILS</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>CATEGORY</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>AMOUNT</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>DATE</th>
                <th style={{ padding: '16px 24px', width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, idx) => {
                const dt = new Date(claim.date || new Date().toISOString());
                const dayMonth = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const year = dt.getFullYear();
                const isPending = claim.status === 'Pending';
                
                return (
                  <tr key={claim.id || idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
                    
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '42px', height: '42px', borderRadius: '10px', 
                          backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                          {getCategoryIcon(claim.category)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                            {claim.description || `${claim.category} Claim`}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            ID: #{claim.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: '#eef2ff', color: '#7c3aed', display: 'inline-block'
                      }}>
                        {claim.category}
                      </span>
                    </td>

                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{parseFloat(claim.amount).toFixed(2)}
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '6px', height: '6px', borderRadius: '50%', 
                          backgroundColor: claim.status?.toLowerCase() === 'approved' ? '#4f46e5' : 
                                           claim.status?.toLowerCase() === 'rejected' ? '#ef4444' : '#ea580c'
                        }}></div>
                        <span style={{ 
                          fontSize: '13px', fontWeight: '600',
                          color: claim.status?.toLowerCase() === 'approved' ? '#4f46e5' : 
                                 claim.status?.toLowerCase() === 'rejected' ? '#ef4444' : '#ea580c'
                        }}>
                          {isPending ? 'Pending Review' : claim.status}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                      {dayMonth},<br/>{year}
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button onClick={() => toast.info('Options for this claim will be available soon.')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                        <MoreVertical size={20} />
                      </button>
                    </td>

                  </tr>
                );
              })}
              
              {claims.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No reimbursement claims found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Showing 1-{Math.min(4, claims.length)} of {claims.length || 24} claims
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => toast.info('Loading previous page...')} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
            <button onClick={() => toast.info('Loading page 1...')} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', backgroundColor: '#3b25e7', color: 'white', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>1</button>
            <button onClick={() => toast.info('Loading page 2...')} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '500', fontSize: '13px', cursor: 'pointer' }}>2</button>
            <button onClick={() => toast.info('Loading page 3...')} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: '#64748b', fontWeight: '500', fontSize: '13px', cursor: 'pointer' }}>3</button>
            <button onClick={() => toast.info('Loading next page...')} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}><ChevronRight size={16} /></button>
          </div>
        </div>

      </div>

      {/* New Claim Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ zIndex: 100 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Submit Reimbursement Claim</h2>
              <button className="topbar-icon-btn" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '24px' }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', color: '#334155' }}>
                      <option>Travel</option>
                      <option>Internet</option>
                      <option>Meals</option>
                      <option>Mileage</option>
                      <option>Books & Learning</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Date *</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', color: '#334155' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Description *</label>
                  <textarea required rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', color: '#334155', resize: 'none' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Amount (₹) *</label>
                  <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', color: '#334155' }} />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: '8px', fontWeight: '600', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', fontWeight: '600', border: 'none', backgroundColor: '#3b25e7', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 37, 231, 0.2)' }}>Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
