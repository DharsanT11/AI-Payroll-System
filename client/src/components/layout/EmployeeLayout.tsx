import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import Topbar from './Topbar';

export default function EmployeeLayout() {
  return (
    <div className="app-layout">
      <EmployeeSidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
