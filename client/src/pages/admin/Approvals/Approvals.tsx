import { useState, useEffect } from 'react';
import { leaveService } from '../../../services/api';
import { formatDate, getInitials, getAvatarColor } from '../../../utils/helpers';
import { Search, Filter, Calendar, X, Check, ListChecks } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchApprovals(); }, []);

  const fetchApprovals = () => {
    // Collect all pending items. Currently we only have leaves.
    leaveService.getAll({ status: 'Pending' })
      .then(res => {
        const pendingLeaves = res.data.data.map((l: any) => ({
          ...l,
          approvalType: l.type || 'Leave Request',
          title: `${l.type} (${l.days} days)`,
          description: l.reason,
          date: l.appliedOn || l.startDate
        }));
        setApprovals([...pendingLeaves]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: string | number, type: string) => {
    // For now we only have Leaves to approve
    try {
      await leaveService.approve(id);
      toast.success(`${type} approved successfully.`);
      fetchApprovals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to approve ${type}.`);
    }
  };

  const handleReject = async (id: string | number, type: string) => {
    // For now we only have Leaves to reject
    try {
      await leaveService.reject(id);
      toast.warning(`${type} has been rejected.`);
      fetchApprovals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to reject ${type}.`);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Banner */}
      <div style={{ backgroundColor: '#3820B7', borderRadius: '16px', padding: '32px', marginBottom: '32px', display: 'flex', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(56, 32, 183, 0.2)' }}>
        <div style={{ zIndex: 1 }}>
           <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '20px', color: '#c4b5fd', textTransform: 'uppercase' }}>ACTION REQUIRED</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1', margin: 0 }}>{approvals.length}</h1>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>Pending Approvals</div>
           </div>
           <p style={{ fontSize: '14px', maxWidth: '420px', color: '#e0e7ff', lineHeight: '1.6', margin: 0 }}>
              You have several leave requests and expense reports awaiting your review for the current cycle.
           </p>
        </div>
        {/* Background icons */}
        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', opacity: 0.2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <ListChecks size={120} strokeWidth={1} />
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '12px 16px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
           <Search size={20} color="#94a3b8" />
           <input type="text" placeholder="Search by employee name..." style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '14px', backgroundColor: 'transparent' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
           <Filter size={18} /> Filters
        </button>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Requests</h3>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#3820B7', letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase' }}>APPROVAL HISTORY</span>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {approvals.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eef2ff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                   {getInitials(item.employeeName || 'Unk Nown')}
                 </div>
                 <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{item.employeeName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: '500' }}>
                       <Calendar size={12} /> Applied on {formatDate(item.date)}
                    </div>
                 </div>
               </div>
               
               <div style={{ 
                  backgroundColor: String(item.approvalType).toUpperCase().includes('EARNED') ? '#f1f5f9' : '#fef2f2', 
                  color: String(item.approvalType).toUpperCase().includes('EARNED') ? '#475569' : '#b91c1c', 
                  padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' 
               }}>
                  {item.approvalType}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', padding: '20px 0' }}>
               <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>PERIOD</div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </div>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>DURATION</div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                    {item.days} Full {item.days > 1 ? 'Days' : 'Day'}
                  </div>
               </div>
               <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>REASON</div>
                  <div style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic', lineHeight: '1.5' }}>
                     "{item.description}"
                  </div>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <button 
                  onClick={() => handleReject(item.id, item.approvalType)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#f8fafc', color: '#b91c1c', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'background-color 0.2s', letterSpacing: '0.05em' }}
               >
                 <X size={16} strokeWidth={3} /> REJECT
               </button>
               <button 
                  onClick={() => handleApprove(item.id, item.approvalType)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#3820B7', color: 'white', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'background-color 0.2s', letterSpacing: '0.05em' }}
               >
                 <Check size={16} strokeWidth={3} /> APPROVE
               </button>
            </div>

          </div>
        ))}
        {approvals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '15px', fontWeight: '500', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            You're all caught up! No pending approvals.
          </div>
        )}
      </div>

    </div>
  );
}
