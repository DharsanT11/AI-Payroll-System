import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Shield, Save, Plus, X, PiggyBank, Cross, Home, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function EmpTaxDeclaration() {
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    financialYear: '2025-26',
    section80C: { ppf: 0, elss: 0, lifeInsurance: 0, homeLoanPrincipal: 0, nsc: 0 },
    section80D: { selfInsurance: 0, parentsInsurance: 0 },
    hra: { rentPaid: 0, monthsClaimed: 12 },
    otherDeductions: { section80E: 0, section80G: 0, nps80CCD: 0 },
  });
  const toast = useToast();

  useEffect(() => {
    empSelfService.itDeclarations()
      .then(res => setDeclarations(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const s80C = Object.values(formData.section80C).reduce((a: number, b: any) => a + Number(b), 0);
      const s80D = Object.values(formData.section80D).reduce((a: number, b: any) => a + Number(b), 0);
      const hra = Number(formData.hra.rentPaid) * Number(formData.hra.monthsClaimed);
      const other = Object.values(formData.otherDeductions).reduce((a: number, b: any) => a + Number(b), 0);
      
      await empSelfService.submitItDeclaration({
        ...formData,
        section80C: { ...formData.section80C, total: s80C },
        section80D: { ...formData.section80D, total: s80D },
        hra: { ...formData.hra, total: hra },
        otherDeductions: { ...formData.otherDeductions, total: other },
      });
      toast.success('IT Declaration submitted successfully!');
      setShowForm(false);
      empSelfService.itDeclarations().then(res => setDeclarations(res.data.data));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit declaration.');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const latestDecl = declarations[0];
  const getPercent = (total: any, limit: number) => {
    if (!limit) return 0;
    return Math.min(100, Math.round((Number(total || 0) / Number(limit)) * 100));
  };

  const section80CRows = [
    { label: 'Public Provident Fund (PPF)', value: latestDecl?.section80C?.ppf || 0 },
    { label: 'ELSS Mutual Funds', value: latestDecl?.section80C?.elss || 0 },
    { label: 'Life Insurance Premium', value: latestDecl?.section80C?.lifeInsurance || 0 },
    { label: 'Home Loan Principal', value: latestDecl?.section80C?.homeLoanPrincipal || 0 },
    { label: 'NSC', value: latestDecl?.section80C?.nsc || 0 },
  ];

  const section80DRows = [
    { label: 'Self & Family Insurance', value: latestDecl?.section80D?.selfInsurance || 0 },
    { label: 'Parents Insurance', value: latestDecl?.section80D?.parentsInsurance || 0 },
  ];

  const hraOtherRows = [
    { label: 'HRA (Rent Paid)', value: latestDecl?.hra?.total || 0 },
    { label: 'Section 80E (Education Loan)', value: latestDecl?.otherDeductions?.section80E || 0 },
    { label: 'Section 80G (Donations)', value: latestDecl?.otherDeductions?.section80G || 0 },
    { label: 'NPS 80CCD(1B)', value: latestDecl?.otherDeductions?.nps80CCD || 0 },
  ];

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Tabs */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px', fontSize: '14px', fontWeight: '700' }}>
         <div style={{ color: '#3b25e7', borderBottom: '2px solid #3b25e7', paddingBottom: '12px', cursor: 'pointer' }}>Declarations</div>
         <div style={{ color: '#64748b', paddingBottom: '12px', cursor: 'pointer' }}>Historical Data</div>
         <div style={{ color: '#64748b', paddingBottom: '12px', cursor: 'pointer' }}>Tax Planner</div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
             <span style={{ backgroundColor: '#eef2ff', color: '#3b25e7', padding: '4px 10px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', borderRadius: '20px' }}>ACTIVE</span>
             <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Income Tax Declarations</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Assessment Year {latestDecl ? latestDecl.financialYear : formData.financialYear}</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
            Submit and manage declaration details for successful verification.
          </p>
        </div>
        {!latestDecl && (
          <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#3b25e7', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}>
            <Plus size={16} strokeWidth={2.5} /> New Declaration
          </button>
        )}
      </div>

      {latestDecl ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PiggyBank size={20} color="#7c3aed" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>SECTION 80C</div>
               </div>
               <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 24px 0', color: '#0f172a' }}>{formatCurrency(latestDecl.section80C?.total || 0)}</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>/ 1,50,000</span>
                  <strong style={{ color: '#0f172a' }}>{getPercent(latestDecl.section80C?.total, 150000)}%</strong>
               </div>
               <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getPercent(latestDecl.section80C?.total, 150000)}%`, backgroundColor: '#7c3aed', borderRadius: '4px' }}></div>
               </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Cross size={20} color="#db2777" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>SECTION 80D</div>
               </div>
               <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 24px 0', color: '#0f172a' }}>{formatCurrency(latestDecl.section80D?.total || 0)}</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>/ 25,000</span>
                  <strong style={{ color: '#0f172a' }}>{getPercent(latestDecl.section80D?.total, 25000)}%</strong>
               </div>
               <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getPercent(latestDecl.section80D?.total, 25000)}%`, backgroundColor: '#db2777', borderRadius: '4px' }}></div>
               </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Home size={20} color="#0d9488" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>HRA & OTHERS</div>
               </div>
               <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 24px 0', color: '#0f172a' }}>{formatCurrency((latestDecl.hra?.total || 0) + (latestDecl.otherDeductions?.total || 0))}</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status</span>
                  <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> ACTIVE</strong>
               </div>
               <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', backgroundColor: '#0d9488', borderRadius: '4px' }}></div>
               </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px', overflow: 'hidden' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                   <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Section 80C Investments</h3>
                   <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Maximum limit of 1,50,000 applicable</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total Declared</div>
                   <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{formatCurrency(latestDecl.section80C?.total || 0)}</div>
                </div>
             </div>
             <div style={{ padding: '16px 32px' }}>
                {section80CRows.map((row: any, i) => (
                   <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: i !== section80CRows.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#475569' }}>{row.label}</span>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{formatCurrency(row.value)}</strong>
                   </div>
                ))}
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                   <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Section 80D</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Medical insurance</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{formatCurrency(latestDecl.section80D?.total || 0)}</div>
                   </div>
                </div>
                <div style={{ padding: '16px 32px' }}>
                   {section80DRows.map((row: any, i) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: i !== section80DRows.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                         <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>{row.label}</span>
                         <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatCurrency(row.value)}</strong>
                      </div>
                   ))}
                </div>
             </div>

             <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                   <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>HRA & Others</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Rent, education & NPS</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{formatCurrency((latestDecl.hra?.total || 0) + (latestDecl.otherDeductions?.total || 0))}</div>
                   </div>
                </div>
                <div style={{ padding: '16px 32px' }}>
                   {hraOtherRows.map((row: any, i) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: i !== hraOtherRows.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                         <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>{row.label}</span>
                         <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatCurrency(row.value)}</strong>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </>
      ) : !showForm ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '80px 32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#cbd5e1', marginBottom: '24px' }}><Shield size={64} /></div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>No Tax Declaration</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>Submit your investment declaration to optimize tax savings.</p>
          <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#3b25e7', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
             <Plus size={16} /> Create Declaration
          </button>
        </div>
      ) : null}

      {/* Declaration Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowForm(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()} className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Tax Declaration — FY 2025-26</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#3b25e7', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Section 80C</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>PPF</label><input type="number" value={formData.section80C.ppf} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, ppf: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>ELSS</label><input type="number" value={formData.section80C.elss} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, elss: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Life Insurance</label><input type="number" value={formData.section80C.lifeInsurance} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, lifeInsurance: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>NSC</label><input type="number" value={formData.section80C.nsc} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, nsc: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#3b25e7', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Section 80D</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Self & Family</label><input type="number" value={formData.section80D.selfInsurance} onChange={e => setFormData({ ...formData, section80D: { ...formData.section80D, selfInsurance: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Parents</label><input type="number" value={formData.section80D.parentsInsurance} onChange={e => setFormData({ ...formData, section80D: { ...formData.section80D, parentsInsurance: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                   <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#3b25e7', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>HRA</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Monthly Rent (₹)</label><input type="number" value={formData.hra.rentPaid} onChange={e => setFormData({ ...formData, hra: { ...formData.hra, rentPaid: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Months</label><input type="number" max="12" value={formData.hra.monthsClaimed} onChange={e => setFormData({ ...formData, hra: { ...formData.hra, monthsClaimed: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                   </div>
                </div>
                <div>
                   <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#3b25e7', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Other Deductions</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>NPS 80CCD(1B)</label><input type="number" value={formData.otherDeductions.nps80CCD} onChange={e => setFormData({ ...formData, otherDeductions: { ...formData.otherDeductions, nps80CCD: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Donations 80G</label><input type="number" value={formData.otherDeductions.section80G} onChange={e => setFormData({ ...formData, otherDeductions: { ...formData.otherDeductions, section80G: e.target.value } })} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }} /></div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#3b25e7', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={16} /> Submit Declaration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
