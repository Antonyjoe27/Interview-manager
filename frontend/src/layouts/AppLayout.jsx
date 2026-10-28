import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('preptracker_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const toggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('preptracker_sidebar_collapsed', String(next));
      } catch {
        // Ignore storage exceptions
      }
      return next;
    });
  };

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'app-shell--sidebar-collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="app-shell__body">
        <TopNav onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="app-main" id="main-content" tabIndex={-1}>
          <div className="app-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
