import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// ─── Admin Layout & Pages ────────────────────────────────
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import Employees from './pages/admin/Employees/Employees';
import PayRuns from './pages/admin/PayRuns/PayRuns';
import LeaveAttendance from './pages/admin/LeaveAttendance/LeaveAttendance';
import Approvals from './pages/admin/Approvals/Approvals';
import TaxesForms from './pages/admin/TaxesForms/TaxesForms';
import Loans from './pages/admin/Loans/Loans';
import Reports from './pages/admin/Reports/Reports';
import SettingsPage from './pages/admin/Settings/Settings';
import AdminProfile from './pages/admin/Profile/Profile';

// ─── Employee Layout & Pages ─────────────────────────────
import EmployeeLayout from './components/layout/EmployeeLayout';
import EmpDashboard from './pages/employee/EmpDashboard/EmpDashboard';
import EmpPayslips from './pages/employee/EmpPayslips/EmpPayslips';
import EmpLeave from './pages/employee/EmpLeave/EmpLeave';
import EmpTaxDeclaration from './pages/employee/EmpTaxDeclaration/EmpTaxDeclaration';
import EmpReimbursements from './pages/employee/EmpReimbursements/EmpReimbursements';
import EmpLoans from './pages/employee/EmpLoans/EmpLoans';
import EmpProfile from './pages/employee/EmpProfile/EmpProfile';

// ─── Auth ────────────────────────────────────────────────
import Login from './pages/Auth/Login';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-content" style={{ textAlign: 'center', paddingTop: '40vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/' : '/emp'} />;
  }
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Redirect to correct portal after login
  const getHomeRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/emp" />;
  };

  return (
    <Routes>
      <Route path="/login" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/emp" />) : <Login />} />

      {/* ─── Admin Routes ─────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/pay-runs" element={<PayRuns />} />
        <Route path="/admin/leave" element={<LeaveAttendance />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/taxes" element={<TaxesForms />} />
        <Route path="/admin/loans" element={<Loans />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* ─── Employee Routes ──────────────────────────── */}
      <Route
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/emp" element={<EmpDashboard />} />
        <Route path="/emp/payslips" element={<EmpPayslips />} />
        <Route path="/emp/leave" element={<EmpLeave />} />
        <Route path="/emp/tax-declaration" element={<EmpTaxDeclaration />} />
        <Route path="/emp/it-declaration" element={<Navigate to="/emp/tax-declaration" replace />} />
        <Route path="/emp/reimbursements" element={<EmpReimbursements />} />
        <Route path="/emp/loans" element={<EmpLoans />} />
        <Route path="/emp/profile" element={<EmpProfile />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={getHomeRedirect()} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
