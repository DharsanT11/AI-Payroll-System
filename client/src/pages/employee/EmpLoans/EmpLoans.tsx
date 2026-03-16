import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, getBadgeClass } from '../../../utils/helpers';
import { Landmark } from 'lucide-react';

export default function EmpLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empSelfService.loans()
      .then(res => setLoans(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Loans</h1>
          <p className="page-subtitle">View your active loans and EMI details</p>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Landmark size={48} />
            <h3>No Active Loans</h3>
            <p>You don't have any active loan records.</p>
          </div>
        </div>
      ) : (
        loans.map(loan => (
          <div className="card" key={loan.id} style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">{loan.type}</div>
              <span className={`badge ${getBadgeClass(loan.status)}`}>{loan.status}</span>
            </div>

            <div className="grid grid-4" style={{ marginTop: 12 }}>
              <div>
                <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Loan Amount</small>
                <strong style={{ fontSize: 15 }}>{formatCurrency(loan.amount)}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Monthly EMI</small>
                <strong style={{ fontSize: 15 }}>{formatCurrency(loan.emiAmount)}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>EMIs Paid</small>
                <strong style={{ fontSize: 15 }}>{loan.paidEmis} / {loan.tenure}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>Remaining</small>
                <strong style={{ fontSize: 15, color: 'var(--color-danger)' }}>{formatCurrency(loan.remainingAmount)}</strong>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="loan-progress" style={{ marginTop: 16 }}>
              <div className="loan-progress-bar">
                <div
                  className="loan-progress-fill"
                  style={{ width: `${(loan.paidEmis / loan.tenure) * 100}%` }}
                ></div>
              </div>
              <small style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4, display: 'block' }}>
                {Math.round((loan.paidEmis / loan.tenure) * 100)}% completed
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
