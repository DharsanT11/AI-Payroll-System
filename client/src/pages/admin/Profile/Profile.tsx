import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { LogOut, User, Mail, Shield, Building2, Calendar, Phone } from 'lucide-react';

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const toast = useToast();

  return (
    <div className="animate-slide-up" style={{ padding: '0 0 80px 0', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Admin Profile</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Manage your account settings and preferences.</p>
        </div>
        <button onClick={logout} style={{ backgroundColor: '#fff', color: '#e11d48', border: '1px solid #ffe4e6', borderRadius: '12px', padding: '12px 24px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <LogOut size={16} strokeWidth={2.5} /> Sign Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
        
        {/* Left Card: Avatar & Summary */}
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
           <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '4px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', marginBottom: '24px', backgroundImage: 'url("https://i.pravatar.cc/150?img=11")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
           <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{user?.name || 'Administrator'}</h2>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eef2ff', color: '#3820b7', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px' }}>
              <Shield size={14} /> {user?.role || 'System Admin'}
           </div>
           
           <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9', margin: '0 0 24px 0' }} />
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                 <Mail size={16} /> <span style={{ fontSize: '13px', fontWeight: '600' }}>{user?.email || 'admin@organization.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                 <Phone size={16} /> <span style={{ fontSize: '13px', fontWeight: '600' }}>+1 (555) 019-2837</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                 <Building2 size={16} /> <span style={{ fontSize: '13px', fontWeight: '600' }}>HQ, Executive Floor</span>
              </div>
           </div>
        </div>

        {/* Right Area: Detailed Information Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           {/* General Info */}
           <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                 <div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Full Name</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{user?.name || 'Administrator'}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Email Address</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{user?.email || 'Not Provided'}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Phone Number</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>+1 (555) 019-2837</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Timezone</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>America/New_York (EST)</div>
                 </div>
              </div>
           </div>

           {/* Security Settings Placeholder */}
           <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>Security Settings</h3>
              
              <div style={{ border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Add an extra layer of security to your account.</div>
                 </div>
                 <button onClick={() => toast.info('Two-Factor Authentication configuration will be available in the next release.')} style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                    Enable 2FA
                 </button>
              </div>

              <div style={{ marginTop: '24px', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Password</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Last changed 3 months ago.</div>
                 </div>
                 <button onClick={() => toast.success('A password reset link has been sent to your email.')} style={{ backgroundColor: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                    Update Password
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
