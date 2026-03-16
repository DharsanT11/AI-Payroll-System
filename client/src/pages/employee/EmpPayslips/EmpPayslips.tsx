import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';

export default function EmpPayslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    empSelfService.payslips()
      .then(res => setPayslips(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Payslips</h1>
          <p className="page-subtitle">View your monthly salary details</p>
        </div>
      </div>

      {payslips.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={48} />
            <h3>No Payslips Yet</h3>
            <p>Your payslips will appear here once payroll is processed.</p>
          </div>
        </div>
      ) : (
        payslips.map((ps, i) => (
          <div className="card payslip-card" key={i} style={{ marginBottom: 16 }}>
            <div className="payslip-header" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="payslip-header-left">
                <div className="payslip-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{ps.month} {ps.year}</h3>
                  <small style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Paid on {formatDate(ps.payDate)}</small>
                </div>
              </div>
              <div className="payslip-header-right">
                <span className="payslip-net">{formatCurrency(ps.netPay)}</span>
                {expanded === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expanded === i && (
              <div className="payslip-detail animate-slide-up">
                <div className="payslip-detail-grid">
                  {/* Earnings */}
                  <div className="payslip-section">
                    <h4 className="salary-section-title earnings">Earnings</h4>
                    <div className="salary-row"><span>Basic Salary</span><span>{formatCurrency(ps.earnings.basic)}</span></div>
                    <div className="salary-row"><span>HRA</span><span>{formatCurrency(ps.earnings.hra)}</span></div>
                    <div className="salary-row"><span>Special Allowance</span><span>{formatCurrency(ps.earnings.special)}</span></div>
                    <div className="salary-row"><span>Conveyance</span><span>{formatCurrency(ps.earnings.conveyance)}</span></div>
                    <div className="salary-row"><span>Medical</span><span>{formatCurrency(ps.earnings.medical)}</span></div>
                    <div className="salary-row total"><span>Total Earnings</span><span>{formatCurrency(ps.earnings.totalEarnings)}</span></div>
                  </div>

                  {/* Deductions */}
                  <div className="payslip-section">
                    <h4 className="salary-section-title deductions">Deductions</h4>
                    <div className="salary-row"><span>EPF (12%)</span><span>{formatCurrency(ps.deductions.epf)}</span></div>
                    {ps.deductions.esi > 0 && <div className="salary-row"><span>ESI (0.75%)</span><span>{formatCurrency(ps.deductions.esi)}</span></div>}
                    <div className="salary-row"><span>Professional Tax</span><span>{formatCurrency(ps.deductions.pt)}</span></div>
                    {ps.deductions.tds > 0 && <div className="salary-row"><span>TDS</span><span>{formatCurrency(ps.deductions.tds)}</span></div>}
                    <div className="salary-row total"><span>Total Deductions</span><span>{formatCurrency(ps.deductions.totalDeductions)}</span></div>
                  </div>
                </div>

                <div className="salary-net" style={{ marginTop: 16 }}>
                  <span>Net Pay</span>
                  <span>{formatCurrency(ps.netPay)}</span>
                </div>

                <div style={{ textAlign: 'right', marginTop: 12 }}>
                  <button className="btn btn-secondary btn-sm">
                    <Download size={13} /> Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
