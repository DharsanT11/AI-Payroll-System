import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatDate, formatCurrency, getInitials, getAvatarColor } from '../../../utils/helpers';
import { Mail, Phone, Building2, MapPin, Calendar, Briefcase, Edit2, Save, X, Camera, Plane, BriefcaseMedical, IdCard, Users, AtSign, Smartphone, Landmark, IndianRupee } from 'lucide-react';

export default function EmpProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    empSelfService.profile()
      .then(res => {
        setProfile(res.data.data);
        setEditData({ phone: res.data.data.phone || '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await empSelfService.updateProfile(editData);
    const res = await empSelfService.profile();
    setProfile(res.data.data);
    setEditing(false);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!profile) return <div style={{ padding: 24 }}>Unable to load profile.</div>;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
        <div style={{ height: '140px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}></div>
        <div style={{ padding: '0 32px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px' }}>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
               <div style={{ width: '120px', height: '120px', borderRadius: '24px', backgroundColor: '#e2e8f0', border: '5px solid #fff', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#3b25e7', width: '32px', height: '32px', borderRadius: '8px', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={16} color="#fff" />
               </div>
            </div>
            
            <div style={{ paddingBottom: '8px' }}>
               <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{fullName}</h1>
               <div style={{ display: 'flex', gap: '16px', color: '#475569', fontSize: '13px', fontWeight: '500', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} color="#64748b" /> {profile.designation}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={16} color="#64748b" /> {profile.department}</span>
               </div>
            </div>
          </div>
          
          <div style={{ paddingBottom: '8px' }}>
             {!editing ? (
                <button style={{ backgroundColor: '#3b25e7', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 37, 231, 0.2)' }} onClick={() => setEditing(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setEditing(false)}>
                     <X size={16} /> Cancel
                  </button>
                  <button style={{ backgroundColor: '#3b25e7', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 37, 231, 0.2)' }} onClick={handleSave}>
                     <Save size={16} /> Save
                  </button>
                </div>
              )}
          </div>

        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div>
           {/* Leave Balances */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Leave Balances</h3>
                 <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5', cursor: 'pointer' }}>Details</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {/* Annual Leave */}
                 <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                       <div style={{ backgroundColor: '#eef2ff', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plane size={20} color="#4f46e5" style={{ transform: 'rotate(-45deg)' }} />
                       </div>
                       <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Annual Leave</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Accrued monthly</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '16px', fontWeight: '800', color: '#3b25e7' }}>{profile.leaveBalance?.earned || '18.5'}</div>
                       <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>DAYS</div>
                    </div>
                 </div>
                 {/* Sick Leave */}
                 <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                       <div style={{ backgroundColor: '#fee2e2', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BriefcaseMedical size={20} color="#ef4444" />
                       </div>
                       <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Sick Leave</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Used: 2 days</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>{profile.leaveBalance?.sick || '10'}</div>
                       <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>DAYS</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Professional Info */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>Professional Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: '#f5f3ff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <IdCard size={18} color="#7c3aed" />
                    </div>
                    <div>
                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>EMPLOYEE ID</div>
                       <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{profile.id || 'NX-HCM-2024-9402'}</div>
                    </div>
                 </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: '#f5f3ff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <Users size={18} color="#7c3aed" />
                    </div>
                    <div>
                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>REPORTS TO</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src="https://i.pravatar.cc/100?img=5" alt="Manager" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Sarah Jenkins (VP Eng)</div>
                       </div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: '#f5f3ff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <MapPin size={18} color="#7c3aed" />
                    </div>
                    <div>
                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>BASE OFFICE</div>
                       <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Austin Tech Hub, TX</div>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        {/* Right Column */}
        <div>
           {/* Personal Details */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#3b25e7' }}>
                       <Users size={22} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Personal Details</h3>
                 </div>
                 <div style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '4px 12px', borderRadius: '16px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em' }}>
                    VERIFIED
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '32px 24px' }}>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>FULL LEGAL NAME</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{profile.firstName} {profile.lastName}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>DATE OF BIRTH</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{formatDate(profile.dateOfBirth) || 'August 24, 1992'}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>GENDER</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{profile.gender || 'Male'}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>MARITAL STATUS</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Single</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>TAX ID / SSN</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>XXX-XX-4921</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>NATIONALITY</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>United States</div>
                 </div>
              </div>
           </div>

           {/* Contact Channels */}
           <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <div style={{ color: '#3b25e7' }}>
                    <IdCard size={22} />
                 </div>
                 <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Contact Channels</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '24px' }}>
                 {/* Email */}
                 <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: '#7c3aed' }}><AtSign size={20} /></div>
                    <div style={{ overflow: 'hidden' }}>
                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>PRIMARY EMAIL</div>
                       <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden' }}>{profile.email}</div>
                    </div>
                 </div>

                 {/* Phone */}
                 <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: '#7c3aed' }}><Smartphone size={20} /></div>
                    <div>
                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>MOBILE NUMBER</div>
                       {editing ? (
                          <input
                             value={editData.phone}
                             onChange={e => setEditData({ ...editData, phone: e.target.value })}
                             style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                          />
                       ) : (
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{profile.phone || '+1 (512) 555-0192'}</div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Hidden but preserved details: Salary & Bank */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ color: '#3b25e7' }}><IndianRupee size={22} /></div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Compensation</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Annual CTC</span><span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{formatCurrency(profile.salary?.ctc || 0)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Basic Salary</span><span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{formatCurrency(profile.salary?.basic || 0)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>HRA</span><span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{formatCurrency(profile.salary?.hra || 0)}</span></div>
                  </div>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ color: '#3b25e7' }}><Landmark size={22} /></div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Bank Account</h3>
                  </div>
                  {profile.bankDetails ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Account Holder</span><span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{profile.bankDetails.accountHolder}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Bank Name</span><span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{profile.bankDetails.bankName}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Account Number</span><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{profile.bankDetails.accountNumber}</span></div>
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No bank details on file.</p>
                  )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
