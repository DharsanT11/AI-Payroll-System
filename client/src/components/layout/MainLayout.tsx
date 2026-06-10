import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AIChatbot from '../AIChatbot/AIChatbot';

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar portal="admin" />
        <div className="page-content animate-fade-in">
          <Outlet />
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
