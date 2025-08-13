import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import UsersPage from './pages/users/UsersPage';
import ContentPage from './pages/content/ContentPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UploadPage from './pages/upload/UploadPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SystemPage from './pages/system/SystemPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users/*" element={<UsersPage />} />
            <Route path="/content/*" element={<ContentPage />} />
            <Route path="/upload/*" element={<UploadPage />} />
            <Route path="/analytics/*" element={<AnalyticsPage />} />
            <Route path="/system/*" element={<SystemPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
