import { useState, useEffect } from 'react';
import { payRunService } from '../../../services/api';
import { formatCurrency, getBadgeClass, formatDate } from '../../../utils/helpers';
import { Plus, CheckCircle, DollarSign, Eye, X } from 'lucide-react';

export default function PayRuns() {
  const [payRuns, setPayRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => { fetchPayRuns(); }, []);

  const fetchPayRuns = () => {
    payRunService.getAll()
      .then(res => setPayRuns(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    await payRunService.approve(id);
    fetchPayRuns();
  };

  const handleProcess = async (id) => {
    await payRunService.process(id);
    fetchPayRuns();
  };

  const viewDetails = async (id) => {
    const res = await payRunService.getById(id);
    setDetailData(res.data.data);
    setSelectedRun(id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pay Runs</h1>
          <p className="page-subtitle">Process and manage monthly payroll</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          const now = new Date();
          payRunService.create({
            month: now.toLocaleString('en-US', { month: 'long' }),
            year: now.getFullYear(),
          }).then(() => fetchPayRuns());
        }}>
          <Plus size={16} /> New Pay Run
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pay Run ID</th>
                <th>Month</th>
                <th>Employees</th>
                <th>Net Pay</th>
                <th>Pay Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payRuns.map(pr => (
                <tr key={pr.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{pr.id}</td>
                  <td style={{ fontWeight: 500 }}>{pr.month} {pr.year}</td>
                  <td>{pr.employeeCount}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(pr.totalNetPay)}</td>
                  <td>{pr.payDate ? formatDate(pr.payDate) : '-'}</td>
                  <td><span className={`badge ${getBadgeClass(pr.status)}`}>{pr.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {pr.status === 'Draft' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(pr.id)}>
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {pr.status === 'Approved' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleProcess(pr.id)}>
                          <DollarSign size={13} /> Process
                        </button>
                      )}
                      {(pr.status === 'Paid' || pr.status === 'Approved') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => viewDetails(pr.id)}>
                          <Eye size={13} /> View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRun && detailData && (
        <div className="modal-overlay" onClick={() => setSelectedRun(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pay Run — {detailData.month} {detailData.year}</h2>
              <button className="topbar-icon-btn" onClick={() => setSelectedRun(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-3" style={{ marginBottom: 20 }}>
                <div className="stat-card" style={{ padding: 16 }}>
                  <div className="stat-card-content">
                    <h3 style={{ fontSize: 18 }}>{formatCurrency(detailData.totalGross)}</h3>
                    <p>Total Gross</p>
                  </div>
                </div>
                <div className="stat-card" style={{ padding: 16 }}>
                  <div className="stat-card-content">
                    <h3 style={{ fontSize: 18 }}>{formatCurrency(detailData.totalDeductions)}</h3>
                    <p>Total Deductions</p>
                  </div>
                </div>
                <div className="stat-card" style={{ padding: 16 }}>
                  <div className="stat-card-content">
                    <h3 style={{ fontSize: 18 }}>{formatCurrency(detailData.totalNetPay)}</h3>
                    <p>Total Net Pay</p>
                  </div>
                </div>
              </div>
              {detailData.employees && detailData.employees.length > 0 && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Gross</th>
                      <th>Deductions</th>
                      <th>Net Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.employees.map(e => (
                      <tr key={e.employeeId}>
                        <td style={{ fontWeight: 500 }}>{e.name}</td>
                        <td>{formatCurrency(e.gross)}</td>
                        <td>{formatCurrency(e.deductions)}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(e.netPay)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
