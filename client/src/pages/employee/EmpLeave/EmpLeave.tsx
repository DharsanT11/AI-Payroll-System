import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { getBadgeClass, formatDate } from '../../../utils/helpers';
import { Plus, X, CalendarDays } from 'lucide-react';

export default function EmpLeave() {
  const [data, setData] = useState<any>({ leaves: [], balance: {} });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave', startDate: '', endDate: '', days: 1, reason: '',
  });

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = () => {
    empSelfService.leaves()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    await empSelfService.applyLeave(formData);
    setShowModal(false);
    setFormData({ type: 'Casual Leave', startDate: '', endDate: '', days: 1, reason: '' });
    fetchLeaves();
  };

  if (loading) return <div>Loading...</div>;

  const { leaves, balance } = data;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave</h1>
          <p className="page-subtitle">Manage your leave requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon blue"><CalendarDays size={20} /></div>
          <div className="stat-card-content">
            <h3>{balance.casual || 0}</h3>
            <p>Casual Leave</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><CalendarDays size={20} /></div>
          <div className="stat-card-content">
            <h3>{balance.sick || 0}</h3>
            <p>Sick Leave</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><CalendarDays size={20} /></div>
          <div className="stat-card-content">
            <h3>{balance.earned || 0}</h3>
            <p>Earned Leave</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple"><CalendarDays size={20} /></div>
          <div className="stat-card-content">
            <h3>{balance.compOff || 0}</h3>
            <p>Comp Off</p>
          </div>
        </div>
      </div>

      {/* Leave History */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Leave History</h3>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
                  <td style={{ fontWeight: 500 }}>{leave.type}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.days}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{leave.reason}</td>
                  <td>{formatDate(leave.appliedOn)}</td>
                  <td><span className={`badge ${getBadgeClass(leave.status)}`}>{leave.status}</span></td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No leave records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for Leave</h2>
              <button className="topbar-icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Leave Type *</label>
                  <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Earned Leave</option>
                    <option>Comp Off</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>From Date *</label>
                    <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>To Date *</label>
                    <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Number of Days *</label>
                  <input type="number" min="0.5" step="0.5" required value={formData.days} onChange={e => setFormData({ ...formData, days: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Reason *</label>
                  <textarea required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
