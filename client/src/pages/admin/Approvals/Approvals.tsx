import { useState, useEffect } from 'react';
import { leaveService } from '../../../services/api';
import { getBadgeClass, formatDate } from '../../../utils/helpers';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Approvals() {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveService.getAll({ status: 'Pending' })
      .then(res => setPendingLeaves(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await leaveService.approve(id);
    setPendingLeaves(prev => prev.filter(l => l.id !== id));
  };

  const handleReject = async (id) => {
    await leaveService.reject(id);
    setPendingLeaves(prev => prev.filter(l => l.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Approvals</h1>
          <p className="page-subtitle">Pending items that require your attention</p>
        </div>
      </div>

      <div className="stat-card" style={{ marginBottom: 24 }}>
        <div className="stat-card-icon orange"><Clock size={22} /></div>
        <div className="stat-card-content">
          <h3>{pendingLeaves.length}</h3>
          <p>Pending Approvals</p>
        </div>
      </div>

      {pendingLeaves.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <CheckCircle size={48} />
            <h3>All caught up!</h3>
            <p>No pending approvals at this time.</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Employee</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td><span className="badge badge-pending">{leave.type}</span></td>
                    <td style={{ fontWeight: 500 }}>{leave.employeeName}</td>
                    <td>{formatDate(leave.startDate)} — {formatDate(leave.endDate)}</td>
                    <td>{leave.days}</td>
                    <td>{leave.reason}</td>
                    <td>{formatDate(leave.appliedOn)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(leave.id)}>
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleReject(leave.id)}>
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
