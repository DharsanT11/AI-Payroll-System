import { useState, useEffect } from 'react';
import { taxService } from '../../../services/api';
import { formatCurrency } from '../../../utils/helpers';
import { Shield, FileText, Download, Landmark, Briefcase, File, Receipt, Plus } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function TaxesForms() {
  const [taxData, setTaxData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    taxService.getSummary()
      .then(res => setTaxData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [forms, setForms] = useState([
    { name: 'Form 16', desc: 'Salary certificate for tax deducted at source for the full financial year cycle.', period: 'FY 2023-24', icon: File },
    { name: 'PF ECR Report', desc: 'Electronic Challan-cum-Return statement for provident fund administrative filing.', period: 'OCT 2023', icon: Receipt },
  ]);

  const [generating, setGenerating] = useState(false);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const taxItems = taxData ? [
    { key: 'epf', subtitle: 'YTD Contribution', subtitleCol: '#3820B7', icon: Landmark, bg: '#eef2ff', col: '#3820B7', labelOverride: 'PROVIDENT FUND', ...taxData.epf },
    { key: 'esi', subtitle: 'Active Status', subtitleCol: '#64748b', icon: Shield, bg: '#f8fafc', col: '#64748b', labelOverride: 'ESI STATE INS.', ...taxData.esi },
    { key: 'tds', subtitle: 'Liability Met', subtitleCol: '#ef4444', icon: Receipt, bg: '#fef2f2', col: '#ef4444', labelOverride: 'TDS (TAX DED.)', ...taxData.tds },
    { key: 'pt', subtitle: 'Monthly Ded.', subtitleCol: '#64748b', icon: Briefcase, bg: '#f8fafc', col: '#64748b', labelOverride: 'PROF. TAX', ...taxData.pt },
  ] : [];

  const handleGenerate = () => {
    setGenerating(true);
    toast.info('Tax forms are being generated for the current financial year.');
    
    // Simulate generation delay
    setTimeout(() => {
      setForms([
        { name: `ITR-1 ${new Date().getFullYear()}`, desc: 'Income Tax Return form auto-generated for the current cycle.', period: `FY ${new Date().getFullYear()-1}-${String(new Date().getFullYear()).slice(2)}`, icon: FileText },
        ...forms
      ]);
      setGenerating(false);
      toast.success('New tax forms generated successfully!');
    }, 2500);
  };

  return (
    <div className="animate-slide-up" style={{ padding: '0 0 80px 0', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>

      {/* Banner */}
      <div style={{ backgroundColor: '#2C12A3', borderRadius: '24px', padding: '40px', marginBottom: '32px', display: 'flex', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(44, 18, 163, 0.2)' }}>
        <div style={{ zIndex: 1, flex: 1 }}>
           <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
              Statutory Compliance
           </h2>
           <p style={{ fontSize: '15px', color: '#e0e7ff', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '600px' }}>
              Manage employee tax filings, provident fund contributions, and annual statutory reports for the current financial year.
           </p>
           <button disabled={generating} onClick={handleGenerate} style={{ backgroundColor: '#fff', color: '#2C12A3', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: generating ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {generating ? 'Generating...' : 'Generate Tax Forms'}
           </button>
        </div>
        {/* Background Graphic Illustration (simulated) */}
        <div style={{ position: 'absolute', right: '40px', bottom: '-20px', opacity: 0.15, display: 'flex' }}>
           <Receipt size={240} strokeWidth={2} />
        </div>
      </div>

      {/* Monthly Tax Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {taxItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: item.bg, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Icon size={20} color={item.col} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.labelOverride || item.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {formatCurrency(item.amount)}
              </div>
              <div style={{ fontSize: '11px', color: item.subtitleCol, fontWeight: '700' }}>
                {item.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Statutory Forms & Returns</h3>
        <span onClick={() => toast.info('Tax form history is available in the Reports section.')} style={{ fontSize: '13px', fontWeight: '800', color: '#2C12A3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          View History {'>'}
        </span>
      </div>

      {/* Statutory Forms List Container */}
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {forms.map((form, i) => {
          const IconComp = form.icon || FileText;
          return (
            <div key={i} style={{ padding: '32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === forms.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ backgroundColor: i % 2 === 0 ? '#eef2ff' : '#f8fafc', padding: '16px', borderRadius: '16px', color: i % 2 === 0 ? '#4f46e5' : '#64748b' }}>
                     <IconComp size={24} />
                  </div>
                  <div style={{ flex: 1, paddingRight: '24px' }}>
                     <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{form.name}</h4>
                     <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>{form.desc}</p>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                           {form.period}
                        </span>
                        <span style={{ backgroundColor: '#eef2ff', color: '#2C12A3', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                           AVAILABLE
                        </span>
                     </div>
                  </div>
               </div>

               <div style={{ marginLeft: '16px' }}>
                  <button onClick={() => toast.success(`${form.name} downloaded successfully!`)} style={{ backgroundColor: '#2C12A3', border: 'none', borderRadius: '10px', padding: '12px 20px', color: '#fff', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(44, 18, 163, 0.2)' }}>
                     <Download size={16} strokeWidth={2.5} /> Download
                  </button>
               </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button onClick={() => toast.info('New tax form generation initiated. Check the statutory forms section.')} style={{ position: 'fixed', bottom: '100px', right: '40px', width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#2C12A3', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(44, 18, 163, 0.3)', zIndex: 90 }}>
        <Plus size={28} strokeWidth={2.5} />
      </button>

    </div>
  );
}
