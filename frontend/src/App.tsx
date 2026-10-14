import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { SearchPage } from './pages/public/SearchPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { RecommendationsPage } from './pages/student/RecommendationsPage';
import { SavedInternshipsPage } from './pages/student/SavedInternshipsPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { ApplicationDetailsPage } from './pages/student/ApplicationDetailsPage';
import { StudentInternshipDetailPage } from './pages/student/StudentInternshipDetailPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { ResumePage } from './pages/student/ResumePage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { SettingsPage } from './pages/student/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { InternshipManagementPage } from './pages/admin/InternshipManagementPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { ApplicationManagementPage } from './pages/admin/ApplicationManagementPage';
import { CompanyManagementPage } from './pages/admin/CompanyManagementPage';
import { RecommendationAnalyticsPage } from './pages/admin/RecommendationAnalyticsPage';
import { EligibilityRulesPage } from './pages/admin/EligibilityRulesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { DataImportExportPage } from './pages/admin/DataImportExportPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/internships" element={<SearchPage />} />
        <Route path="/internships/:id" element={<StudentInternshipDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Student Portal Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="saved" element={<SavedInternshipsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailsPage />} />
        <Route path="internships/:id" element={<StudentInternshipDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="internships" element={<InternshipManagementPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="applications" element={<ApplicationManagementPage />} />
        <Route path="organizations" element={<CompanyManagementPage />} />
        <Route path="analytics" element={<RecommendationAnalyticsPage />} />
        <Route path="eligibility-rules" element={<EligibilityRulesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="import-export" element={<DataImportExportPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;
