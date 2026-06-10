import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { getBadgeClass, formatDate } from '../../../utils/helpers';
import { Plus, X, Plane, BriefcaseMedical, TentTree, Clock3, CalendarHeart, AlertCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function EmpLeave() {
  const [data, setData] = useState<any>({ leaves: [], balance: {} });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave', startDate: '', endDate: '', days: 1, reason: '',
  });
  const toast = useToast();

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = () => {
    empSelfService.leaves()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApply = async (e: any) => {
    e.preventDefault();
    try {
      await empSelfService.applyLeave(formData);
      toast.success('Leave request submitted successfully!');
      setShowModal(false);
      setFormData({ type: 'Casual Leave', startDate: '', endDate: '', days: 1, reason: '' });
      fetchLeaves();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit leave request.');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const { leaves, balance } = data;
  const padCount = (value: any) => String(value || 0).padStart(2, '0');

  const balanceCards = [
    { key: 'earned', label: 'Earned Leave', value: balance.earned || 0, icon: Plane, bg: '#fef2f2', col: '#ef4444' },
    { key: 'sick', label: 'Sick Leave', value: balance.sick || 0, icon: BriefcaseMedical, bg: '#fff7ed', col: '#ea580c' },
    { key: 'casual', label: 'Casual Leave', value: balance.casual || 0, icon: TentTree, bg: '#f0fdf4', col: '#22c55e' },
    { key: 'compOff', label: 'Comp Off', value: balance.compOff || 0, icon: Clock3, bg: '#f5f3ff', col: '#8b5cf6' },
  ];

  const getStatusColor = (status: string) => {
     switch(status.toLowerCase()) {
        case 'approved': return { bg: '#d1fae5', col: '#059669' };
        case 'rejected': return { bg: '#fee2e2', col: '#dc2626' };
        default: return { bg: '#fef3c7', col: '#d97706' };
     }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>Leave Management</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
            Plan your time off and track your balances effortlessly.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#3b25e7', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
          <Plus size={16} strokeWidth={2.5} /> Apply Leave
        </button>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>AVAILABLE BALANCES</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {balanceCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-12px', bottom: '-12px', opacity: 0.05 }}>
                   <Icon size={120} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={item.col} />
                   </div>
                   <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>{item.label}</div>
                </div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#0f172a', position: 'relative', zIndex: 1 }}>
                   {padCount(item.value)} 
                   <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '6px', fontWeight: '600' }}>Days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Leave History</h3>
          <button onClick={() => toast.info('Loading complete leave history...')} style={{ backgroundColor: 'transparent', border: 'none', color: '#3b25e7', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>View All</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 0.5fr)', padding: '16px 32px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>
              <span>LEAVE TYPE & REASON</span>
              <span>DURATION</span>
              <span>DAYS</span>
              <span>STATUS</span>
           </div>
           
           {leaves.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                 <CalendarHeart size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                 <h4 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 8px 0' }}>No leaves found</h4>
                 <p style={{ margin: 0, fontSize: '14px' }}>You haven't requested any time off yet.</p>
              </div>
           ) : (
              leaves.map((leave: any) => {
                 let statusStyle = getStatusColor(leave.status);
                 let IconCode = AlertCircle;
                 let iTone = '#64748b';
                 if(leave.type === 'Sick Leave') { IconCode = BriefcaseMedical; iTone = '#ea580c'; }
                 if(leave.type === 'Earned Leave') { IconCode = Plane; iTone = '#ef4444'; }
                 if(leave.type === 'Casual Leave') { IconCode = TentTree; iTone = '#22c55e'; }
                 if(leave.type === 'Comp Off') { IconCode = Clock3; iTone = '#8b5cf6'; }

                 return (
                   <div key={leave.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.5fr) minmax(0, 0.5fr)', padding: '20px 32px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                         <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: iTone }}></div>
                         <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{leave.type}</div>
                            <div style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{leave.reason}</div>
                         </div>
                      </div>
                      <div>
                         <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</div>
                         <div style={{ fontSize: '12px', color: '#94a3b8' }}>Applied {formatDate(leave.appliedOn)}</div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                         {leave.days}
                      </div>
                      <div>
                         <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.col, padding: '6px 12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', borderRadius: '20px' }}>
                            {leave.status.toUpperCase()}
                         </span>
                      </div>
                   </div>
                 );
              })
           )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()} className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Apply for Leave</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Leave Type *</label>
                <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#0f172a', outline: 'none' }}>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Comp Off</option>
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>From Date *</label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#0f172a', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>To Date *</label>
                  <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#0f172a', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Number of Days *</label>
                <input type="number" min="0.5" step="0.5" required value={formData.days} onChange={e => setFormData({ ...formData, days: Number(e.target.value) })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#0f172a', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Reason *</label>
                <textarea required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows={3} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', color: '#0f172a', outline: 'none', resize: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#3b25e7', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
