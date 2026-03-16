import { Search, Bell, Plus, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search />
        <input type="text" placeholder="Search employees, modules..." />
      </div>

      <div className="topbar-right">
        <div className="topbar-org">
          Zylker Corp <ChevronDown size={14} />
        </div>

        <button className="topbar-icon-btn" title="Quick Add">
          <Plus size={18} />
        </button>

        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>

        <button className="topbar-icon-btn" title="Settings">
          <Settings size={18} />
        </button>

        <div className="topbar-avatar" onClick={logout} title="Logout">
          {getInitials(user?.name || 'A')}
        </div>
      </div>
    </header>
  );
}
