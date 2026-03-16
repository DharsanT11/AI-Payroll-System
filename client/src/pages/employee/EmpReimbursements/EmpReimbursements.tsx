import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, getBadgeClass, formatDate } from '../../../utils/helpers';
import { Plus, X, Receipt } from 'lucide-react';

export default function EmpReimbursements() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Travel', description: '', amount: '', date: '',
  });

  useEffect(() => { fetchClaims(); }, []);

  const fetchClaims = () => {
    empSelfService.reimbursements()
      .then(res => setClaims(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await empSelfService.submitReimbursement({ ...formData, amount: Number(formData.amount) });
    setShowModal(false);
    setFormData({ category: 'Travel', description: '', amount: '', date: '' });
    fetchClaims();
  };

  if (loading) return <div>Loading...</div>;

  const totalPending = claims.filter(c => c.status === 'Pending').reduce((s, c) => s + c.amount, 0);
  const totalApproved = claims.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reimbursements</h1>
          <p className="page-subtitle">Submit and track expense claims</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Claim
        </button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon blue"><Receipt size={22} /></div>
          <div className="stat-card-content">
            <h3>{claims.length}</h3>
            <p>Total Claims</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange"><Receipt size={22} /></div>
          <div className="stat-card-content">
            <h3>{formatCurrency(totalPending)}</h3>
            <p>Pending Amount</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><Receipt size={22} /></div>
          <div className="stat-card-content">
            <h3>{formatCurrency(totalApproved)}</h3>
            <p>Approved Amount</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{claim.id}</td>
                  <td><span className="badge badge-active">{claim.category}</span></td>
                  <td>{claim.description}</td>
                  <td>{formatDate(claim.date)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(claim.amount)}</td>
                  <td>{formatDate(claim.submittedOn)}</td>
                  <td><span className={`badge ${getBadgeClass(claim.status)}`}>{claim.status}</span></td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No reimbursement claims.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Reimbursement Claim</h2>
              <button className="topbar-icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                      <option>Travel</option>
                      <option>Internet</option>
                      <option>Meal</option>
                      <option>Phone</option>
                      <option>Books & Learning</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea required rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
