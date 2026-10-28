import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import IconButton from '../components/IconButton';

const routeTitles = {
  '/': 'Dashboard Overview',
  '/tracker': 'Preparation Tracker',
  '/schedule': 'Interview Schedule',
  '/applications': 'Job Applications',
  '/notes': 'Notes & Resources',
  '/settings': 'Application Settings',
  '/ui-components': 'Design System Showcase'
};

export function TopNav({ onOpenMobileNav }) {
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || 'Interview Preparation Tracker';

  return (
    <header className="app-top-nav">
      <div className="app-top-nav__left">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          className="app-top-nav__mobile-toggle"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Breadcrumb / Page Title */}
        <div className="app-top-nav__breadcrumb">
          <span className="app-top-nav__breadcrumb-root">Portal</span>
          <span className="app-top-nav__breadcrumb-sep">/</span>
          <span className="app-top-nav__breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      <div className="app-top-nav__right">
        {/* Search Field Placeholder */}
        <div className="app-top-nav__search">
          <span className="app-top-nav__search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            placeholder="Search questions, topics, interviews..."
            className="app-top-nav__search-input"
            aria-label="Search interviews and topics"
            readOnly
          />
          <kbd className="app-top-nav__search-kbd">Ctrl K</kbd>
        </div>

        {/* Notifications Placeholder */}
        <div className="app-top-nav__actions">
          <IconButton
            name="bell"
            aria-label="View notifications (placeholder)"
            variant="subtle"
            size="md"
            badge={true}
          />

          {/* User Profile / Avatar Placeholder */}
          <div className="app-top-nav__user-chip" title="Alex Morgan (Senior Engineer Candidate)">
            <div className="app-top-nav__avatar">
              <span className="app-top-nav__avatar-monogram">AM</span>
              <span className="app-top-nav__avatar-status" aria-hidden="true" />
            </div>
            <div className="app-top-nav__user-details">
              <span className="app-top-nav__user-name">Alex Morgan</span>
              <span className="app-top-nav__user-role">Candidate</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
