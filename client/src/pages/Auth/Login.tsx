import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@payroll.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setEmail('admin@payroll.com');
      setPassword('admin123');
    } else {
      setEmail('meera.krishnan@zylker.com');
      setPassword('employee123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">P</div>
        </div>
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to Zoho Payroll</p>

        {/* Role Toggle */}
        <div className="login-role-toggle">
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin')}
            type="button"
          >
            Admin
          </button>
          <button
            className={`role-btn ${role === 'employee' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('employee')}
            type="button"
          >
            Employee
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@payroll.com' : 'employee@zylker.com'}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Employee'}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9a9ab0' }}>
          {role === 'admin'
            ? 'Demo: admin@payroll.com / admin123'
            : 'Demo: meera.krishnan@zylker.com / employee123'}
        </p>
      </div>
    </div>
  );
}
