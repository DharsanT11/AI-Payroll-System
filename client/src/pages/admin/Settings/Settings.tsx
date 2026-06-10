import { useState, useEffect } from 'react';
import { settingsService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';
import { Building2, Calculator, Pencil, Calendar, Banknote, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('organization');
  const toast = useToast();

  useEffect(() => {
    settingsService.getAll()
      .then(res => setSettings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) return <div style={{ padding: 24 }}>Loading...</div>;

  const { organization, salaryComponents } = settings;

  const tabs = [
    { key: 'organization', label: 'Organization' },
    { key: 'salary', label: 'Salary Components' },
  ];

  return (
    <div className="animate-slide-up" style={{ padding: '0 0 80px 0', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>

      {/* Tabs Container */}
      <div style={{ backgroundColor: '#f1f5f9', borderRadius: '16px', padding: '8px', display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isActive ? '#fff' : 'transparent',
                color: isActive ? '#3820B7' : '#64748b',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Organization Settings */}
      {activeTab === 'organization' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Organization Details</h2>
            <button onClick={() => toast.info('Organization details editor will be available soon.')} style={{ backgroundColor: '#3820B7', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(56, 32, 183, 0.2)' }}>
              <Pencil size={16} strokeWidth={2.5} /> Edit Details
            </button>
          </div>

          <div style={{ width: '100%', height: '220px', borderRadius: '24px', position: 'relative', overflow: 'hidden', backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)' }} />
             
             <div style={{ position: 'absolute', bottom: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                   <Building2 size={32} color="#0f172a" />
                </div>
                <div>
                   <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>{organization.name}</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                      <MapPin size={14} /> Global Headquarters
                   </div>
                </div>
             </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            
             <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Company Name</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{organization.name}</div>
             </div>

             <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Date Format</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{organization.dateFormat || 'DD-MM-YYYY'}</div>
             </div>

             <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Address</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', lineHeight: '1.6' }}>{organization.address}</div>
             </div>

             <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Financial Year Start</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#3820B7' }}>
                      <Calendar size={18} strokeWidth={2.5} />
                   </div>
                   <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{organization.financialYearStart}</div>
                </div>
             </div>

             <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Currency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#3820B7' }}>
                      <Banknote size={18} strokeWidth={2.5} />
                   </div>
                   <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{organization.currency}</div>
                </div>
             </div>

             <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Organization Status</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f5f3ff', color: '#3820B7', padding: '8px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em' }}>
                   <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3820B7' }} />
                   ACTIVE ENTITY
                </div>
             </div>

          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '8px' }}>Support & Compliance</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Help Center</div>
                 <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Access guides and contact our support team.</div>
                 <a href="#" style={{ fontSize: '12px', fontWeight: '800', color: '#3820b7', textDecoration: 'none', marginTop: 'auto', paddingTop: '8px' }}>View Help Center &rarr;</a>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Data Privacy</div>
                 <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Review how your organization's data is handled.</div>
                 <a href="#" style={{ fontSize: '12px', fontWeight: '800', color: '#3820b7', textDecoration: 'none', marginTop: 'auto', paddingTop: '8px' }}>View Privacy Policy &rarr;</a>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>SOC2 Audit Report</div>
                 <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Download our latest compliance and security audit.</div>
                 <a href="#" style={{ fontSize: '12px', fontWeight: '800', color: '#3820b7', textDecoration: 'none', marginTop: 'auto', paddingTop: '8px' }}>Download PDF &rarr;</a>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Salary Components */}
      {activeTab === 'salary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Earnings */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <div style={{ padding: '28px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Earnings</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Component', 'Type', 'Value'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.earnings.map((comp: any) => (
                    <tr key={comp.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>{comp.name}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{comp.type}</span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{comp.percentage ? `${comp.percentage}% of CTC` : formatCurrency(comp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <div style={{ padding: '28px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Deductions</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Component', 'Type', 'Value'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.deductions.map((comp: any) => (
                    <tr key={comp.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>{comp.name}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{comp.type}</span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{comp.percentage ? `${comp.percentage}% of Basic` : formatCurrency(comp.amount)}</td>
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
