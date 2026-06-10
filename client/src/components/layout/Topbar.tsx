import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Plus, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

type TopbarProps = {
  portal?: 'admin' | 'employee';
};

export default function Topbar({ portal = 'admin' }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = portal === 'admin';
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleQuickAdd = () => navigate('/admin/employees');
  const handleNotifications = () => navigate('/admin/approvals');
  const handleSettings = () => navigate(isAdmin ? '/admin/settings' : '/emp/profile');
  const handleProfile = () => {
    navigate(isAdmin ? '/admin/profile' : '/emp/profile');
    setShowProfileMenu(false);
  };
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <header className={`topbar${isAdmin ? '' : ' employee-topbar'}`}>
      {isAdmin ? (
        <div></div>
      ) : (
        <div className="employee-topbar-left">
          <button type="button" className="employee-topbar-menu" aria-label="Open employee navigation">
            <Menu size={16} />
          </button>
          <h2 className="employee-topbar-title">Employee Portal</h2>
        </div>
      )}

      <div className="topbar-right">
        {!isAdmin && (
          <nav className="employee-topbar-nav" aria-label="Employee sections">
            <span className={`employee-topbar-nav-item${location.pathname === '/emp' ? ' active' : ''}`}>Dashboard</span>
            <span className="employee-topbar-nav-item">Directory</span>
            <span className="employee-topbar-nav-item">Resources</span>
          </nav>
        )}

        {isAdmin && (
          <button className="topbar-icon-btn" title="Quick Add" onClick={handleQuickAdd}>
            <Plus size={18} />
          </button>
        )}

        <button className="topbar-icon-btn" title="Notifications" onClick={handleNotifications}>
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>

        {isAdmin && (
          <button className="topbar-icon-btn" title="Settings" onClick={handleSettings}>
            <Settings size={18} />
          </button>
        )}

        <div className="topbar-menu-wrap" ref={profileMenuRef}>
          <button className="topbar-avatar" onClick={() => setShowProfileMenu(v => !v)} title="Profile">
            {getInitials(user?.name || 'A')}
          </button>
          {showProfileMenu && (
            <div className="topbar-dropdown topbar-dropdown-right">
              <button className="topbar-dropdown-item" onClick={handleProfile}>My Profile</button>
              <button className="topbar-dropdown-item" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
