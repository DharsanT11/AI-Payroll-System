import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, CalendarDays,
  CheckSquare, FileText, Landmark, BarChart3, Settings
} from 'lucide-react';

const navItems = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employees',    icon: Users,           label: 'Employees' },
  { to: '/admin/pay-runs',     icon: DollarSign,      label: 'Pay Runs' },
  { to: '/admin/leave',        icon: CalendarDays,    label: 'Leave & Attendance' },
  { to: '/admin/approvals',    icon: CheckSquare,     label: 'Approvals' },
  { to: '/admin/taxes',        icon: FileText,        label: 'Taxes & Forms' },
  { to: '/admin/loans',        icon: Landmark,        label: 'Loans' },
  { to: '/admin/reports',      icon: BarChart3,       label: 'Reports' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">P</div>
        <div className="sidebar-logo-text">
          Payroll
          <span>Admin Portal</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
