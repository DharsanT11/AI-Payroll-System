import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import Topbar from './Topbar';
import AIChatbot from '../AIChatbot/AIChatbot';

export default function EmployeeLayout() {
  return (
    <div className="app-layout">
      <EmployeeSidebar />
      <div className="main-content">
        <Topbar portal="employee" />
        <div className="page-content employee-page-content animate-fade-in">
          <Outlet />
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
