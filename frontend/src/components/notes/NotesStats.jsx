import React from 'react';
import Icon from '../Icon';

export function NotesStats({ metrics }) {
  const {
    totalItems,
    totalNotes,
    totalResources,
    favoriteItems,
    pinnedNotes
  } = metrics;

  return (
    <div className="notes-stats-grid" aria-label="Notes and resources library summary metrics">
      {/* 1. Total Content Items */}
      <div className="notes-stat-card">
        <div className="notes-stat-card__header">
          <span className="notes-stat-card__label">Total Library</span>
          <div
            className="notes-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          >
            <Icon name="layers" size={18} />
          </div>
        </div>
        <span className="notes-stat-card__value">{totalItems}</span>
        <span className="notes-stat-card__subtext">Revision notes & reference links</span>
      </div>

      {/* 2. Revision Notes */}
      <div className="notes-stat-card">
        <div className="notes-stat-card__header">
          <span className="notes-stat-card__label">Revision Notes</span>
          <div
            className="notes-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}
          >
            <Icon name="fileText" size={18} />
          </div>
        </div>
        <span className="notes-stat-card__value" style={{ color: '#38bdf8' }}>
          {totalNotes}
        </span>
        <span className="notes-stat-card__subtext">
          {pinnedNotes} pinned for priority revision
        </span>
      </div>

      {/* 3. Learning Resources */}
      <div className="notes-stat-card">
        <div className="notes-stat-card__header">
          <span className="notes-stat-card__label">Resources</span>
          <div
            className="notes-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
          >
            <Icon name="link" size={18} />
          </div>
        </div>
        <span className="notes-stat-card__value" style={{ color: '#34d399' }}>
          {totalResources}
        </span>
        <span className="notes-stat-card__subtext">Docs, roadmaps, videos & sheets</span>
      </div>

      {/* 4. Starred Favorites */}
      <div className="notes-stat-card">
        <div className="notes-stat-card__header">
          <span className="notes-stat-card__label">Favorites</span>
          <div
            className="notes-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
          >
            <Icon name="starFilled" size={18} />
          </div>
        </div>
        <span className="notes-stat-card__value" style={{ color: '#fbbf24' }}>
          {favoriteItems}
        </span>
        <span className="notes-stat-card__subtext">High-priority interview material</span>
      </div>
    </div>
  );
}

export default NotesStats;
