import React from 'react';
import Icon from '../Icon';

export function DashboardStats({ metrics }) {
  const {
    totalTasks,
    completedTasks,
    completionRate,
    upcomingInterviewsCount,
    activeApplicationsCount
  } = metrics;

  return (
    <div className="dashboard-stats-grid" aria-label="Dashboard Summary Metrics">
      {/* 1. Overall Completion Rate */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__header">
          <span className="dashboard-stat-card__label">Preparation Completion</span>
          <div
            className="dashboard-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          >
            <Icon name="trendingUp" size={20} />
          </div>
        </div>
        <div className="dashboard-stat-card__value-row">
          <span className="dashboard-stat-card__value">{completionRate}%</span>
        </div>
        <div className="dashboard-stat-card__subtext">
          <span>{completedTasks} of {totalTasks} tasks finished</span>
        </div>
      </div>

      {/* 2. Total Preparation Tasks */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__header">
          <span className="dashboard-stat-card__label">Total Tasks</span>
          <div
            className="dashboard-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
          >
            <Icon name="tracker" size={20} />
          </div>
        </div>
        <div className="dashboard-stat-card__value-row">
          <span className="dashboard-stat-card__value">{totalTasks}</span>
        </div>
        <div className="dashboard-stat-card__subtext">
          <span>Logged across 5 core subjects</span>
        </div>
      </div>

      {/* 3. Completed Tasks */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__header">
          <span className="dashboard-stat-card__label">Completed Tasks</span>
          <div
            className="dashboard-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
          >
            <Icon name="check" size={20} />
          </div>
        </div>
        <div className="dashboard-stat-card__value-row">
          <span className="dashboard-stat-card__value">{completedTasks}</span>
        </div>
        <div className="dashboard-stat-card__subtext">
          <span style={{ color: 'var(--color-success-text)' }}>
            {totalTasks - completedTasks} remaining in queue
          </span>
        </div>
      </div>

      {/* 4. Upcoming Interviews */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__header">
          <span className="dashboard-stat-card__label">Upcoming Interviews</span>
          <div
            className="dashboard-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
          >
            <Icon name="calendar" size={20} />
          </div>
        </div>
        <div className="dashboard-stat-card__value-row">
          <span className="dashboard-stat-card__value">{upcomingInterviewsCount}</span>
        </div>
        <div className="dashboard-stat-card__subtext">
          <span>Active rounds scheduled</span>
        </div>
      </div>

      {/* 5. Active Applications */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__header">
          <span className="dashboard-stat-card__label">Active Applications</span>
          <div
            className="dashboard-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}
          >
            <Icon name="briefcase" size={20} />
          </div>
        </div>
        <div className="dashboard-stat-card__value-row">
          <span className="dashboard-stat-card__value">{activeApplicationsCount}</span>
        </div>
        <div className="dashboard-stat-card__subtext">
          <span>In active recruiter pipeline</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
