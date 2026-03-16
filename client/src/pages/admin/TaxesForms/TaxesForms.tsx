import { useState, useEffect } from 'react';
import { taxService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Shield, FileText, Download } from 'lucide-react';

export default function TaxesForms() {
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxService.getSummary()
      .then(res => setTaxData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const taxItems = taxData ? [
    { key: 'epf', icon: Shield, color: 'blue', ...taxData.epf },
    { key: 'esi', icon: Shield, color: 'green', ...taxData.esi },
    { key: 'tds', icon: FileText, color: 'red', ...taxData.tds },
    { key: 'pt', icon: FileText, color: 'orange', ...taxData.pt },
  ] : [];

  const forms = [
    { name: 'Form 16', desc: 'Annual TDS certificate for employees', period: 'FY 2025-26' },
    { name: 'PF ECR', desc: 'Electronic Challan cum Return for EPF', period: 'March 2026' },
    { name: 'ESI Return', desc: 'Half-yearly ESI contribution return', period: 'Oct 2025 - Mar 2026' },
    { name: 'Form 24Q', desc: 'Quarterly TDS statement for salaries', period: 'Q4 FY 2025-26' },
    { name: 'PT Return', desc: 'Monthly Professional Tax return', period: 'March 2026' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Taxes & Forms</h1>
          <p className="page-subtitle">Statutory compliance and tax management</p>
        </div>
      </div>

      {/* Monthly Tax Summary */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {taxItems.map(item => (
          <div className="stat-card" key={item.key}>
            <div className={`stat-card-icon ${item.color}`}><item.icon size={22} /></div>
            <div className="stat-card-content">
              <h3>{formatCurrency(item.amount)}</h3>
              <p>{item.label}</p>
              <small style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{item.employees} employees</small>
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Forms */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Statutory Forms & Returns</div>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Form</th>
                <th>Description</th>
                <th>Period</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{form.name}</td>
                  <td>{form.desc}</td>
                  <td>{form.period}</td>
                  <td><span className="badge badge-approved">Available</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm">
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
