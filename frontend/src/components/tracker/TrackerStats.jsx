import React from 'react';
import Icon from '../Icon';

export function TrackerStats({ metrics }) {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionPercentage
  } = metrics;

  return (
    <div className="tracker-stats-grid" aria-label="Tracker Summary Metrics">
      {/* 1. Overall Completion Rate */}
      <div className="tracker-stat-card">
        <div className="tracker-stat-card__header">
          <span className="tracker-stat-card__label">Completion</span>
          <div
            className="tracker-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          >
            <Icon name="trendingUp" size={18} />
          </div>
        </div>
        <span className="tracker-stat-card__value">{completionPercentage}%</span>
        <span className="tracker-stat-card__subtext">Overall preparation velocity</span>
      </div>

      {/* 2. Total Tasks */}
      <div className="tracker-stat-card">
        <div className="tracker-stat-card__header">
          <span className="tracker-stat-card__label">Total Tasks</span>
          <div
            className="tracker-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
          >
            <Icon name="tracker" size={18} />
          </div>
        </div>
        <span className="tracker-stat-card__value">{totalTasks}</span>
        <span className="tracker-stat-card__subtext">Across 5 technical tracks</span>
      </div>

      {/* 3. Completed Tasks */}
      <div className="tracker-stat-card">
        <div className="tracker-stat-card__header">
          <span className="tracker-stat-card__label">Completed</span>
          <div
            className="tracker-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
          >
            <Icon name="check" size={18} />
          </div>
        </div>
        <span className="tracker-stat-card__value" style={{ color: 'var(--color-success-text)' }}>
          {completedTasks}
        </span>
        <span className="tracker-stat-card__subtext">Mastered & solved</span>
      </div>

      {/* 4. Pending Tasks */}
      <div className="tracker-stat-card">
        <div className="tracker-stat-card__header">
          <span className="tracker-stat-card__label">Pending</span>
          <div
            className="tracker-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
          >
            <Icon name="clock" size={18} />
          </div>
        </div>
        <span className="tracker-stat-card__value">{pendingTasks}</span>
        <span className="tracker-stat-card__subtext">Scheduled for practice</span>
      </div>

      {/* 5. Overdue Tasks */}
      <div className={`tracker-stat-card ${overdueTasks > 0 ? 'tracker-stat-card--overdue-alert' : ''}`}>
        <div className="tracker-stat-card__header">
          <span className="tracker-stat-card__label">Overdue</span>
          <div
            className="tracker-stat-card__icon-wrap"
            style={{
              backgroundColor: overdueTasks > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: overdueTasks > 0 ? 'var(--color-danger)' : 'var(--color-text-subtle)'
            }}
          >
            <Icon name="alert" size={18} />
          </div>
        </div>
        <span
          className="tracker-stat-card__value"
          style={{ color: overdueTasks > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
        >
          {overdueTasks}
        </span>
        <span className="tracker-stat-card__subtext">
          {overdueTasks > 0 ? 'Requires immediate focus' : 'No overdue items'}
        </span>
      </div>
    </div>
  );
}

export default TrackerStats;
