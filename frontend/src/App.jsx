import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import TrackerPage from './pages/TrackerPage';
import SchedulePage from './pages/SchedulePage';
import ApplicationsPage from './pages/ApplicationsPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import ComponentShowcasePage from './pages/ComponentShowcasePage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="ui-components" element={<ComponentShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
