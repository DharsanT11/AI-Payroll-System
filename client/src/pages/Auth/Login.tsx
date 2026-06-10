import { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield, GraduationCap, Users, IndianRupee, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@tamilnaducollege.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleSwitch = (newRole: string) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setEmail('admin@tamilnaducollege.edu');
      setPassword('admin123');
    } else {
      setEmail('meera.krishnan@tamilnaducollege.edu');
      setPassword('employee123');
    }
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="tn-login-page">
      {/* Animated background orbs — on hero side */}
      <div className="tn-login-orb tn-login-orb-1" />
      <div className="tn-login-orb tn-login-orb-2" />
      <div className="tn-login-orb tn-login-orb-3" />

      {/* Left — Full-height Hero */}
      <div className="tn-login-hero">
        <div className="tn-login-hero-content">
          <div className="tn-login-hero-badge">
            <Shield size={14} />
            <span>SECURED ACCESS</span>
          </div>

          <h1 className="tn-login-hero-title">
            Payroll<br />
            <span>Management System</span>
          </h1>

          <p className="tn-login-hero-desc">
            Enterprise-grade payroll management for educational institutions across Tamil Nadu.
            Compliant with Indian tax regulations and built for modern teams.
          </p>

          {/* Stats Row */}
          <div className="tn-login-stats-row">
            <div className="tn-login-stat">
              <div className="tn-login-stat-icon"><Users size={16} /></div>
              <div>
                <div className="tn-login-stat-value">12+</div>
                <div className="tn-login-stat-label">Employees</div>
              </div>
            </div>
            <div className="tn-login-stat">
              <div className="tn-login-stat-icon"><IndianRupee size={16} /></div>
              <div>
                <div className="tn-login-stat-value">₹96L+</div>
                <div className="tn-login-stat-label">Annual Payroll</div>
              </div>
            </div>
            <div className="tn-login-stat">
              <div className="tn-login-stat-icon"><BarChart3 size={16} /></div>
              <div>
                <div className="tn-login-stat-value">100%</div>
                <div className="tn-login-stat-label">Compliance</div>
              </div>
            </div>
          </div>

          {/* College Badge */}
          <div className="tn-login-college-badge">
            <GraduationCap size={20} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>TN Arts & Science College</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Madurai, Tamil Nadu</div>
            </div>
          </div>
        </div>

        {/* Decorative grid overlay */}
        <div className="tn-login-hero-grid" />
      </div>

      {/* Right — Full-height Form */}
      <div className="tn-login-form-panel">
        <div className="tn-login-form-inner">

          <div className="tn-login-greeting">{greeting} 👋</div>

          <h2 className="tn-login-form-title">Sign in to your account</h2>
          <p className="tn-login-form-subtitle">Access your payroll dashboard securely.</p>

          {/* Role Switcher */}
          <div className="tn-login-role-switcher">
            <button
              className={`tn-role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('admin')}
              type="button"
            >
              <Shield size={14} />
              Administrator
            </button>
            <button
              className={`tn-role-btn ${role === 'employee' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('employee')}
              type="button"
            >
              <Users size={14} />
              Employee
            </button>
          </div>

          {error && <div className="tn-login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="tn-login-form">
            <div className="tn-form-field">
              <label>Email Address</label>
              <div className="tn-input-wrapper">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@tamilnaducollege.edu' : 'employee@tamilnaducollege.edu'}
                  required
                />
              </div>
            </div>

            <div className="tn-form-field">
              <div className="tn-label-row">
                <label>Password</label>
                <button type="button" className="tn-forgot-link">Forgot password?</button>
              </div>
              <div className="tn-input-wrapper">
                <Lock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="tn-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="tn-remember-check">
              <input type="checkbox" />
              <span>Keep me signed in for 30 days</span>
            </label>

            <button type="submit" className="tn-login-submit" disabled={loading}>
              {loading ? (
                <span className="tn-login-spinner" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="tn-login-demo-hint">
            <div className="tn-demo-label">Demo Credentials</div>
            <code>
              {role === 'admin'
                ? 'admin@tamilnaducollege.edu / admin123'
                : 'meera.krishnan@tamilnaducollege.edu / employee123'}
            </code>
          </div>

          <div className="tn-login-footer-links">
            <span>PRIVACY</span>
            <span>·</span>
            <span>TERMS</span>
            <span>·</span>
            <span>SUPPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
