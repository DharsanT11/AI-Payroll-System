import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Shield, Save, Plus, X } from 'lucide-react';

export default function EmpTaxDeclaration() {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    financialYear: '2025-26',
    section80C: { ppf: 0, elss: 0, lifeInsurance: 0, homeLoanPrincipal: 0, nsc: 0 },
    section80D: { selfInsurance: 0, parentsInsurance: 0 },
    hra: { rentPaid: 0, monthsClaimed: 12 },
    otherDeductions: { section80E: 0, section80G: 0, nps80CCD: 0 },
  });

  useEffect(() => {
    empSelfService.itDeclarations()
      .then(res => setDeclarations(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setShowForm(false);
    empSelfService.itDeclarations().then(res => setDeclarations(res.data.data));
  };

  if (loading) return <div>Loading...</div>;

  const latestDecl = declarations[0];

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">IT Declaration</h1>
          <p className="page-subtitle">Investment declarations for tax savings</p>
        </div>
        {!latestDecl && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Declaration
          </button>
        )}
      </div>

      {latestDecl ? (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">FY {latestDecl.financialYear} Declaration</div>
              <span className={`badge ${latestDecl.status === 'Submitted' ? 'badge-active' : 'badge-pending'}`}>{latestDecl.status}</span>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            {/* Section 80C */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: 'var(--color-primary)' }}>Section 80C (Max ₹1,50,000)</h3>
              <div className="salary-row"><span>PPF</span><span>{formatCurrency(latestDecl.section80C.ppf)}</span></div>
              <div className="salary-row"><span>ELSS</span><span>{formatCurrency(latestDecl.section80C.elss)}</span></div>
              <div className="salary-row"><span>Life Insurance</span><span>{formatCurrency(latestDecl.section80C.lifeInsurance)}</span></div>
              <div className="salary-row"><span>Home Loan Principal</span><span>{formatCurrency(latestDecl.section80C.homeLoanPrincipal)}</span></div>
              <div className="salary-row"><span>NSC</span><span>{formatCurrency(latestDecl.section80C.nsc)}</span></div>
              <div className="salary-row total"><span>Total 80C</span><span>{formatCurrency(latestDecl.section80C.total)}</span></div>
            </div>

            {/* Section 80D */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: 'var(--color-primary)' }}>Section 80D — Medical Insurance</h3>
              <div className="salary-row"><span>Self & Family Insurance</span><span>{formatCurrency(latestDecl.section80D.selfInsurance)}</span></div>
              <div className="salary-row"><span>Parents Insurance</span><span>{formatCurrency(latestDecl.section80D.parentsInsurance)}</span></div>
              <div className="salary-row total"><span>Total 80D</span><span>{formatCurrency(latestDecl.section80D.total)}</span></div>
            </div>
          </div>

          <div className="grid grid-2">
            {/* HRA */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: 'var(--color-primary)' }}>HRA Exemption</h3>
              <div className="salary-row"><span>Monthly Rent</span><span>{formatCurrency(latestDecl.hra.rentPaid)}</span></div>
              <div className="salary-row"><span>Months Claimed</span><span>{latestDecl.hra.monthsClaimed}</span></div>
              <div className="salary-row total"><span>Total HRA</span><span>{formatCurrency(latestDecl.hra.total)}</span></div>
            </div>

            {/* Other */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: 'var(--color-primary)' }}>Other Deductions</h3>
              <div className="salary-row"><span>Section 80E (Education Loan)</span><span>{formatCurrency(latestDecl.otherDeductions.section80E)}</span></div>
              <div className="salary-row"><span>Section 80G (Donations)</span><span>{formatCurrency(latestDecl.otherDeductions.section80G)}</span></div>
              <div className="salary-row"><span>NPS 80CCD(1B)</span><span>{formatCurrency(latestDecl.otherDeductions.nps80CCD)}</span></div>
              <div className="salary-row total"><span>Total Others</span><span>{formatCurrency(latestDecl.otherDeductions.total)}</span></div>
            </div>
          </div>
        </div>
      ) : !showForm ? (
        <div className="card">
          <div className="empty-state">
            <Shield size={48} />
            <h3>No IT Declaration</h3>
            <p>Submit your investment declaration to optimize tax savings.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create Declaration
            </button>
          </div>
        </div>
      ) : null}

      {/* Declaration Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>IT Declaration — FY 2025-26</h2>
              <button className="topbar-icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-primary)' }}>Section 80C</h4>
                <div className="form-row">
                  <div className="form-group"><label>PPF</label><input type="number" value={formData.section80C.ppf} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, ppf: e.target.value } })} /></div>
                  <div className="form-group"><label>ELSS</label><input type="number" value={formData.section80C.elss} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, elss: e.target.value } })} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Life Insurance</label><input type="number" value={formData.section80C.lifeInsurance} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, lifeInsurance: e.target.value } })} /></div>
                  <div className="form-group"><label>NSC</label><input type="number" value={formData.section80C.nsc} onChange={e => setFormData({ ...formData, section80C: { ...formData.section80C, nsc: e.target.value } })} /></div>
                </div>

                <h4 style={{ fontSize: 13, fontWeight: 600, margin: '16px 0 8px', color: 'var(--color-primary)' }}>Section 80D</h4>
                <div className="form-row">
                  <div className="form-group"><label>Self & Family</label><input type="number" value={formData.section80D.selfInsurance} onChange={e => setFormData({ ...formData, section80D: { ...formData.section80D, selfInsurance: e.target.value } })} /></div>
                  <div className="form-group"><label>Parents</label><input type="number" value={formData.section80D.parentsInsurance} onChange={e => setFormData({ ...formData, section80D: { ...formData.section80D, parentsInsurance: e.target.value } })} /></div>
                </div>

                <h4 style={{ fontSize: 13, fontWeight: 600, margin: '16px 0 8px', color: 'var(--color-primary)' }}>HRA</h4>
                <div className="form-row">
                  <div className="form-group"><label>Monthly Rent (₹)</label><input type="number" value={formData.hra.rentPaid} onChange={e => setFormData({ ...formData, hra: { ...formData.hra, rentPaid: e.target.value } })} /></div>
                  <div className="form-group"><label>Months</label><input type="number" max="12" value={formData.hra.monthsClaimed} onChange={e => setFormData({ ...formData, hra: { ...formData.hra, monthsClaimed: e.target.value } })} /></div>
                </div>

                <h4 style={{ fontSize: 13, fontWeight: 600, margin: '16px 0 8px', color: 'var(--color-primary)' }}>Other Deductions</h4>
                <div className="form-row">
                  <div className="form-group"><label>NPS 80CCD(1B)</label><input type="number" value={formData.otherDeductions.nps80CCD} onChange={e => setFormData({ ...formData, otherDeductions: { ...formData.otherDeductions, nps80CCD: e.target.value } })} /></div>
                  <div className="form-group"><label>Donations 80G</label><input type="number" value={formData.otherDeductions.section80G} onChange={e => setFormData({ ...formData, otherDeductions: { ...formData.otherDeductions, section80G: e.target.value } })} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={14} /> Submit Declaration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
