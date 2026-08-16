import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminLayout } from './routes/AdminLayout';
import { EmployeeLayout } from './routes/EmployeeLayout';

import { MarketingHome } from './pages/marketing/MarketingHome';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { KioskPage } from './pages/kiosk/KioskPage';
import { CheckoutPage } from './pages/billing/CheckoutPage';
import { AboutPage } from './pages/marketing/AboutPage';
import { ContactPage } from './pages/marketing/ContactPage';
import { PrivacyPage } from './pages/marketing/PrivacyPage';
import { TermsPage } from './pages/marketing/TermsPage';

import { Dashboard } from './pages/admin/Dashboard';
import { Attendance } from './pages/admin/Attendance';
import { LeaveManagement } from './pages/admin/LeaveManagement';
import { Reimbursements } from './pages/admin/Reimbursements';
import { Reports } from './pages/admin/Reports';
import { AdminSettings } from './pages/admin/Settings';
import { AdminSettingsDetail } from './pages/admin/SettingsDetail';

import { EmployeeHome } from './pages/employee/Home';
import { RequestPage } from './pages/employee/Request';
import { History } from './pages/employee/History';
import { EmployeeSettings } from './pages/employee/Settings';
import { EmployeeSettingsDetail } from './pages/employee/SettingsDetail';

import { NanaBananoMascot } from './components/common/NanaBananoMascot';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/employee/change-password" element={<ChangePasswordPage />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/billing/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute view="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="reimbursements" element={<Reimbursements />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="settings/:sectionId" element={<AdminSettingsDetail />} />
        </Route>

        <Route
          path="/employee"
          element={
            <ProtectedRoute view="employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<EmployeeHome />} />
          <Route path="request" element={<RequestPage />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<EmployeeSettings />} />
          <Route path="settings/:sectionId" element={<EmployeeSettingsDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NanaBananoMascot />
    </>
  );
}

export default App;
