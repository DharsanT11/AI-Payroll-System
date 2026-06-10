import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, CalendarDays,
  Receipt, Shield, Landmark, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const navItems = [
  { to: '/emp',               icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/emp/payslips',      icon: FileText,        label: 'Payslips' },
  { to: '/emp/leave',         icon: CalendarDays,    label: 'Leave' },
  { to: '/emp/tax-declaration', icon: Shield,        label: 'Tax' },
  { to: '/emp/reimbursements', icon: Receipt,        label: 'Reimbursements' },
  { to: '/emp/loans',         icon: Landmark,        label: 'Loans' },
  { to: '/emp/profile',       icon: User,            label: 'My Profile' },
];

export default function EmployeeSidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar employee-sidebar">
      <div className="sidebar-logo employee-sidebar-logo">
        <div className="sidebar-logo-icon emp">P</div>
        <div className="sidebar-logo-text">
          Campus Payroll
          <span>Employee Portal</span>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="sidebar-profile-card">
        <div className="sidebar-profile-avatar" style={{ background: getAvatarColor(user?.name || 'E') }}>
          {getInitials(user?.name || 'Employee')}
        </div>
        <div className="sidebar-profile-info">
          <strong>{user?.name}</strong>
          <small>Employee Access</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/emp'}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="employee-sidebar-status">
        <p>System Status</p>
        <div className="employee-sidebar-status-row">
          <span className="employee-sidebar-status-dot" />
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
