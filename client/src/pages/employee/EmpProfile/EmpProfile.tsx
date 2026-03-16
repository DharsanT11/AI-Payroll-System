import { useState, useEffect } from 'react';
import { empSelfService } from '../../../services/api';
import { formatDate, formatCurrency, getInitials, getAvatarColor } from '../../../utils/helpers';
import { Mail, Phone, Building2, MapPin, Calendar, Briefcase, Edit, Save, X } from 'lucide-react';

export default function EmpProfile() {
  const [profile, setProfile] = useState(null);
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

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Unable to load profile.</div>;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and manage your personal information</p>
        </div>
        {!editing ? (
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>
            <Edit size={14} /> Edit
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}><X size={14} /> Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save</button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="card profile-header-card">
        <div className="profile-header">
          <div className="profile-avatar-large" style={{ background: getAvatarColor(fullName) }}>
            {getInitials(fullName)}
          </div>
          <div className="profile-header-info">
            <h2>{fullName}</h2>
            <p className="profile-designation">{profile.designation}</p>
            <div className="profile-meta">
              <span><Building2 size={14} /> {profile.department}</span>
              <span><Briefcase size={14} /> {profile.employeeType}</span>
              <span><Calendar size={14} /> Joined {formatDate(profile.dateOfJoining)}</span>
            </div>
          </div>
          <div className="profile-id-badge">
            {profile.id}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        {/* Personal Information */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: 'var(--color-text)' }}>Personal Information</h3>
          <div className="profile-field">
            <Mail size={14} />
            <div>
              <label>Email</label>
              <span>{profile.email}</span>
            </div>
          </div>
          <div className="profile-field">
            <Phone size={14} />
            <div>
              <label>Phone</label>
              {editing ? (
                <input
                  value={editData.phone}
                  onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  style={{ padding: '4px 8px', fontSize: 13, borderRadius: 6, border: '1px solid var(--color-border)' }}
                />
              ) : (
                <span>{profile.phone || 'Not provided'}</span>
              )}
            </div>
          </div>
          <div className="profile-field">
            <Calendar size={14} />
            <div>
              <label>Date of Birth</label>
              <span>{formatDate(profile.dateOfBirth)}</span>
            </div>
          </div>
          <div className="profile-field">
            <MapPin size={14} />
            <div>
              <label>Gender</label>
              <span>{profile.gender || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: 'var(--color-text)' }}>Compensation Details</h3>
          <div className="salary-row"><span>Annual CTC</span><span style={{ fontWeight: 600 }}>{formatCurrency(profile.salary.ctc)}</span></div>
          <div className="salary-row"><span>Basic Salary</span><span>{formatCurrency(profile.salary.basic)}</span></div>
          <div className="salary-row"><span>HRA</span><span>{formatCurrency(profile.salary.hra)}</span></div>
          <div className="salary-row"><span>Special Allowance</span><span>{formatCurrency(profile.salary.special)}</span></div>
          <div className="salary-row"><span>Conveyance</span><span>{formatCurrency(profile.salary.conveyance)}</span></div>
          <div className="salary-row"><span>Medical</span><span>{formatCurrency(profile.salary.medical)}</span></div>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: 'var(--color-text)' }}>Leave Balance</h3>
        <div className="grid grid-4">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, color: '#3b82f6', margin: 0 }}>{profile.leaveBalance?.casual || 0}</h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Casual</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, color: '#10b981', margin: 0 }}>{profile.leaveBalance?.sick || 0}</h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Sick</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, color: '#f59e0b', margin: 0 }}>{profile.leaveBalance?.earned || 0}</h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Earned</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, color: '#8b5cf6', margin: 0 }}>{profile.leaveBalance?.compOff || 0}</h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Comp Off</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: 'var(--color-text)' }}>Bank Account Details</h3>
        {profile.bankDetails ? (
          <>
            <div className="salary-row"><span>Account Holder</span><span>{profile.bankDetails.accountHolder}</span></div>
            <div className="salary-row"><span>Bank Name</span><span>{profile.bankDetails.bankName}</span></div>
            <div className="salary-row"><span>Account Number</span><span style={{ fontFamily: 'monospace' }}>{profile.bankDetails.accountNumber}</span></div>
            <div className="salary-row"><span>IFSC Code</span><span style={{ fontFamily: 'monospace' }}>{profile.bankDetails.ifsc}</span></div>
          </>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No bank details on file.</p>
        )}
      </div>
    </div>
  );
}
