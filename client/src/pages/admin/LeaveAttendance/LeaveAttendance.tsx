import { useState, useEffect } from 'react';
import { leaveService } from '../../../services/api';
import { getBadgeClass, formatDate } from '../../../utils/helpers';
import { CheckCircle, XCircle } from 'lucide-react';

export default function LeaveAttendance() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = () => {
    leaveService.getAll()
      .then(res => setLeaves(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    await leaveService.approve(id);
    fetchLeaves();
  };

  const handleReject = async (id) => {
    await leaveService.reject(id);
    fetchLeaves();
  };

  const filtered = activeTab === 'all' ? leaves : leaves.filter(l => l.status === activeTab);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave & Attendance</h1>
          <p className="page-subtitle">Manage employee leave requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'all', label: 'All Leaves' },
          { key: 'Pending', label: 'Pending' },
          { key: 'Approved', label: 'Approved' },
          { key: 'Rejected', label: 'Rejected' },
        ].map(tab => (
          <div
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.key === 'all' ? leaves.length : leaves.filter(l => l.status === tab.key).length})
          </div>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{leaves.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 style={{ color: 'var(--color-warning)' }}>{leaves.filter(l => l.status === 'Pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 style={{ color: 'var(--color-success)' }}>{leaves.filter(l => l.status === 'Approved').length}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 style={{ color: 'var(--color-danger)' }}>{leaves.filter(l => l.status === 'Rejected').length}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(leave => (
                <tr key={leave.id}>
                  <td style={{ fontWeight: 500 }}>{leave.employeeName}</td>
                  <td>{leave.type}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.days}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{leave.reason}</td>
                  <td><span className={`badge ${getBadgeClass(leave.status)}`}>{leave.status}</span></td>
                  <td>
                    {leave.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(leave.id)}>
                          <CheckCircle size={13} />
                        </button>
                        <button className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleReject(leave.id)}>
                          <XCircle size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No leave requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
