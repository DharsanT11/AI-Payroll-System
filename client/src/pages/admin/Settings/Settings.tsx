import { useState, useEffect } from 'react';
import { settingsService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Building2, Calculator, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('organization');

  useEffect(() => {
    settingsService.getAll()
      .then(res => setSettings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) return <div>Loading...</div>;

  const { organization, salaryComponents } = settings;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your organization and payroll</p>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'organization' ? 'active' : ''}`} onClick={() => setActiveTab('organization')}>
          <Building2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Organization
        </div>
        <div className={`tab ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => setActiveTab('salary')}>
          <Calculator size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Salary Components
        </div>
      </div>

      {/* Organization Settings */}
      {activeTab === 'organization' && (
        <div className="card">
          <div className="settings-section">
            <h3>Organization Details</h3>
            <div className="settings-row">
              <span className="settings-label">Company Name</span>
              <span className="settings-value">{organization.name}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Address</span>
              <span className="settings-value">{organization.address}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Financial Year Start</span>
              <span className="settings-value">{organization.financialYearStart}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Currency</span>
              <span className="settings-value">{organization.currency}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Date Format</span>
              <span className="settings-value">{organization.dateFormat}</span>
            </div>
          </div>
        </div>
      )}

      {/* Salary Components */}
      {activeTab === 'salary' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ color: 'var(--color-success)' }}>Earnings</div>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.earnings.map(comp => (
                    <tr key={comp.id}>
                      <td style={{ fontWeight: 500 }}>{comp.name}</td>
                      <td><span className="badge badge-active">{comp.type}</span></td>
                      <td>{comp.percentage ? `${comp.percentage}% of CTC` : formatCurrency(comp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ color: 'var(--color-danger)' }}>Deductions</div>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.deductions.map(comp => (
                    <tr key={comp.id}>
                      <td style={{ fontWeight: 500 }}>{comp.name}</td>
                      <td><span className="badge badge-pending">{comp.type}</span></td>
                      <td>{comp.percentage ? `${comp.percentage}% of Basic` : formatCurrency(comp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
