import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../components/Icon';
import IconButton from '../components/IconButton';

const navItems = [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'dashboard',
    badge: null
  },
  {
    label: 'Preparation Tracker',
    to: '/tracker',
    icon: 'tracker',
    badge: null
  },
  {
    label: 'Interview Schedule',
    to: '/schedule',
    icon: 'calendar',
    badge: null
  },
  {
    label: 'Job Applications',
    to: '/applications',
    icon: 'briefcase',
    badge: null
  },
  {
    label: 'Notes & Resources',
    to: '/notes',
    icon: 'notes',
    badge: null
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'settings',
    badge: null
  },
  {
    label: 'UI Components',
    to: '/ui-components',
    icon: 'sparkles',
    badge: 'Showcase'
  }
];

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="app-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isCollapsed ? 'app-sidebar--collapsed' : ''} ${isMobileOpen ? 'app-sidebar--mobile-open' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Brand / Logo */}
        <div className="app-sidebar__header">
          <div className="app-sidebar__brand">
            <div className="app-sidebar__logo">
              <Icon name="tracker" size={20} color="#ffffff" />
            </div>
            {!isCollapsed && (
              <div className="app-sidebar__brand-text">
                <span className="app-sidebar__brand-title">PrepTracker</span>
                <span className="app-sidebar__brand-badge">SaaS v0.2</span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <div className="app-sidebar__mobile-close">
            <IconButton
              name="x"
              aria-label="Close navigation"
              variant="subtle"
              size="sm"
              onClick={onCloseMobile}
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="app-sidebar__nav">
          <ul className="app-sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.to} className="app-sidebar__nav-item">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `app-sidebar__link ${isActive ? 'app-sidebar__link--active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="app-sidebar__link-icon">
                    <Icon name={item.icon} size={20} />
                  </span>

                  {!isCollapsed && (
                    <span className="app-sidebar__link-label">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="app-sidebar__link-badge">{item.badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer / Collapse Toggle */}
        <div className="app-sidebar__footer">
          <button
            type="button"
            className="app-sidebar__collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
              size={18}
            />
            {!isCollapsed && (
              <span className="app-sidebar__collapse-text">Collapse Menu</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
