import { useState, useEffect } from 'react';
import { loanService } from '../../../services/api';
import { formatCurrency, getBadgeClass } from '../../../utils/helpers';
import { Landmark, Plus, X } from 'lucide-react';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '', employeeName: '', type: 'Personal Loan', amount: '', emiAmount: '', tenure: '',
  });

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = () => {
    loanService.getAll()
      .then(res => setLoans(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await loanService.create({ ...formData, amount: Number(formData.amount), emiAmount: Number(formData.emiAmount), tenure: Number(formData.tenure) });
    setShowModal(false);
    fetchLoans();
  };

  const handlePayEmi = async (id) => {
    await loanService.payEmi(id);
    fetchLoans();
  };

  if (loading) return <div>Loading...</div>;

  const activeLoans = loans.filter(l => l.status === 'Active');
  const totalOutstanding = activeLoans.reduce((s, l) => s + l.remainingAmount, 0);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Loans</h1>
          <p className="page-subtitle">Employee loan management</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Loan
        </button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon blue"><Landmark size={22} /></div>
          <div className="stat-card-content">
            <h3>{loans.length}</h3>
            <p>Total Loans</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">
            <Landmark size={22} />
          </div>
          <div className="stat-card-content">
            <h3>{activeLoans.length}</h3>
            <p>Active Loans</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red">
            <Landmark size={22} />
          </div>
          <div className="stat-card-content">
            <h3>{formatCurrency(totalOutstanding)}</h3>
            <p>Total Outstanding</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Amount</th>
                <th>EMI</th>
                <th>Paid / Total</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{loan.id}</td>
                  <td style={{ fontWeight: 500 }}>{loan.employeeName}</td>
                  <td>{loan.type}</td>
                  <td>{formatCurrency(loan.amount)}</td>
                  <td>{formatCurrency(loan.emiAmount)}</td>
                  <td>{loan.paidEmis} / {loan.tenure}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(loan.remainingAmount)}</td>
                  <td><span className={`badge ${getBadgeClass(loan.status)}`}>{loan.status}</span></td>
                  <td>
                    {loan.status === 'Active' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handlePayEmi(loan.id)}>
                        Pay EMI
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No loans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Loan</h2>
              <button className="topbar-icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Employee Name *</label>
                    <input required value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Loan Type</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option>Personal Loan</option>
                      <option>Home Loan Advance</option>
                      <option>Vehicle Loan</option>
                      <option>Education Loan</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Loan Amount (₹) *</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>EMI Amount (₹) *</label>
                    <input type="number" required value={formData.emiAmount} onChange={e => setFormData({ ...formData, emiAmount: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tenure (months) *</label>
                  <input type="number" required value={formData.tenure} onChange={e => setFormData({ ...formData, tenure: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Loan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
