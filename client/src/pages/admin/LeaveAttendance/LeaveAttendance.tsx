import { useState, useEffect } from 'react';
import { leaveService } from '../../../services/api';
import { formatDate, getInitials, getAvatarColor } from '../../../utils/helpers';
import { CheckCircle, XCircle, Search, Filter, Plus } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function LeaveAttendance() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = () => {
    leaveService.getAll()
      .then(res => setLeaves(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: string | number) => {
    try {
      await leaveService.approve(id);
      toast.success('Leave request approved successfully.');
      fetchLeaves();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve leave.');
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      await leaveService.reject(id);
      toast.warning('Leave request rejected.');
      fetchLeaves();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject leave.');
    }
  };

  const filtered = leaves.filter(l => 
    (activeTab === 'all' || l.status === activeTab) && 
    (!searchQuery || l.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Leave & Attendance</h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
             Manage and track employee time-off requests effectively.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '0 16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', width: '240px' }}>
              <Search size={16} color="#94a3b8" />
              <input 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                style={{ border: 'none', padding: '12px 12px', width: '100%', outline: 'none', background: 'transparent', fontSize: '13px', color: '#334155' }}
              />
            </div>
            <button onClick={() => toast.info('Advanced filtering will be available soon.')} style={{ backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <Filter size={18} />
            </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        {/* Total Requests */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', borderLeft: '4px solid #3b25e7', position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em', marginBottom: '16px' }}>TOTAL REQUESTS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{leaves.length}</span>
            <span style={{ color: '#3b25e7', fontSize: '12px', fontWeight: '700' }}>+12% vs last month</span>
          </div>
        </div>

        {/* Pending Review */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', borderLeft: '4px solid #f59e0b', position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em', marginBottom: '16px' }}>PENDING REVIEW</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{leaves.filter(l => l.status === 'Pending').length}</span>
            <span style={{ color: '#d97706', fontSize: '12px', fontWeight: '700' }}>8 Urgent</span>
          </div>
        </div>

        {/* Approved */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', borderLeft: '4px solid #10b981', position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em', marginBottom: '16px' }}>APPROVED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{leaves.filter(l => l.status === 'Approved').length}</span>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700' }}>This Month</span>
          </div>
        </div>

        {/* Rejected */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', borderLeft: '4px solid #e11d48', position: 'relative' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em', marginBottom: '16px' }}>REJECTED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{leaves.filter(l => l.status === 'Rejected').length}</span>
            <span style={{ color: '#e11d48', fontSize: '12px', fontWeight: '700' }}>Needs Feedback</span>
          </div>
        </div>

      </div>

      {/* Main List Section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        
        {/* Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'all', label: 'All Leaves' },
              { id: 'Pending', label: 'Pending' },
              { id: 'Approved', label: 'Approved' },
              { id: 'Rejected', label: 'Rejected' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: activeTab === tab.id ? '#eef2ff' : 'transparent',
                  color: activeTab === tab.id ? '#3b25e7' : '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button onClick={() => toast.success('Opening New Policy configuration modal...')} style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
            <Plus size={16} strokeWidth={3} /> New Policy
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>EMPLOYEE</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>LEAVE TYPE</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>DURATION & DATES</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>REASON</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>STATUS</th>
              <th style={{ padding: '0 16px 24px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(leave => (
              <tr key={leave.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '24px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#3b25e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>
                        {getInitials(leave.employeeName || 'Unk Nown')}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{leave.employeeName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Employee</div>
                      </div>
                    </div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                    <span style={{ display: 'inline-block', backgroundColor: '#eef2ff', color: '#4f46e5', fontSize: '11px', fontWeight: '800', padding: '6px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                      {leave.type}
                    </span>
                </td>
                <td style={{ padding: '24px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{leave.days} Day{leave.days > 1 ? 's' : ''}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {new Date(leave.startDate).toLocaleString('default', { month: 'short', day: '2-digit' })} - {new Date(leave.endDate).toLocaleString('default', { month: 'short', day: '2-digit' })}
                    </div>
                </td>
                <td style={{ padding: '24px 16px', maxWidth: '250px' }}>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{leave.reason}</div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                    {leave.status === 'Pending' && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#d97706', backgroundColor: '#fef3c7', padding: '6px 12px', borderRadius: '20px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d97706' }}></div> {leave.status}
                        </div>
                    )}
                    {leave.status === 'Approved' && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#059669', backgroundColor: '#d1fae5', padding: '6px 12px', borderRadius: '20px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }}></div> {leave.status}
                        </div>
                    )}
                    {leave.status === 'Rejected' && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#e11d48', backgroundColor: '#ffe4e6', padding: '6px 12px', borderRadius: '20px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e11d48' }}></div> {leave.status}
                        </div>
                    )}
                </td>
                <td style={{ padding: '24px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {leave.status === 'Pending' && (
                            <>
                                <button onClick={() => handleApprove(leave.id)} style={{ backgroundColor: '#fff', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button onClick={() => handleReject(leave.id)} style={{ backgroundColor: '#fff', border: '1px solid #e11d48', color: '#e11d48', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <XCircle size={14} /> Reject
                                </button>
                            </>
                        )}
                    </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>No leave requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
