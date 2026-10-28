import React from 'react';
import Icon from '../Icon';

export function ApplicationStats({ metrics }) {
  const {
    totalApplications,
    inProgressApplications,
    interviewingApplications,
    offersCount,
    pendingFollowUps,
    overdueFollowUps,
    upcomingDeadlines
  } = metrics;

  return (
    <div className="applications-stats-grid" aria-label="Job Applications Summary Metrics">
      {/* 1. Total Applications */}
      <div className="applications-stat-card">
        <div className="applications-stat-card__header">
          <span className="applications-stat-card__label">Total Applications</span>
          <div
            className="applications-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          >
            <Icon name="briefcase" size={18} />
          </div>
        </div>
        <span className="applications-stat-card__value">{totalApplications}</span>
        <span className="applications-stat-card__subtext">Across all job pipeline stages</span>
      </div>

      {/* 2. In-Progress Pipeline */}
      <div className="applications-stat-card">
        <div className="applications-stat-card__header">
          <span className="applications-stat-card__label">Active Pipeline</span>
          <div
            className="applications-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
          >
            <Icon name="trendingUp" size={18} />
          </div>
        </div>
        <span className="applications-stat-card__value" style={{ color: '#22d3ee' }}>
          {inProgressApplications}
        </span>
        <span className="applications-stat-card__subtext">Excludes rejected and withdrawn</span>
      </div>

      {/* 3. Interviewing */}
      <div className="applications-stat-card">
        <div className="applications-stat-card__header">
          <span className="applications-stat-card__label">Interviewing</span>
          <div
            className="applications-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}
          >
            <Icon name="calendarCheck" size={18} />
          </div>
        </div>
        <span className="applications-stat-card__value" style={{ color: '#a5b4fc' }}>
          {interviewingApplications}
        </span>
        <span className="applications-stat-card__subtext">Active interview loops</span>
      </div>

      {/* 4. Offers Received */}
      <div
        className="applications-stat-card"
        style={offersCount > 0 ? { borderColor: 'var(--color-success-border)', backgroundColor: 'rgba(16, 185, 129, 0.04)' } : {}}
      >
        <div className="applications-stat-card__header">
          <span className="applications-stat-card__label">Offers Received</span>
          <div
            className="applications-stat-card__icon-wrap"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399'
            }}
          >
            <Icon name="check" size={18} />
          </div>
        </div>
        <span className="applications-stat-card__value" style={{ color: 'var(--color-success-text)' }}>
          {offersCount}
        </span>
        <span className="applications-stat-card__subtext">
          {offersCount > 0 ? 'Offer negotiation in progress' : 'No active offers'}
        </span>
      </div>

      {/* 5. Follow-ups & Deadlines */}
      <div
        className="applications-stat-card"
        style={overdueFollowUps > 0 ? { borderColor: 'var(--color-danger-border)', backgroundColor: 'rgba(239, 68, 68, 0.04)' } : {}}
      >
        <div className="applications-stat-card__header">
          <span className="applications-stat-card__label">Actionable Items</span>
          <div
            className="applications-stat-card__icon-wrap"
            style={{
              backgroundColor: overdueFollowUps > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: overdueFollowUps > 0 ? 'var(--color-danger)' : '#fbbf24'
            }}
          >
            <Icon name={overdueFollowUps > 0 ? 'alert' : 'clock'} size={18} />
          </div>
        </div>
        <span
          className="applications-stat-card__value"
          style={{ color: overdueFollowUps > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
        >
          {pendingFollowUps + overdueFollowUps}
        </span>
        <span className="applications-stat-card__subtext">
          {overdueFollowUps > 0
            ? `${overdueFollowUps} overdue follow-up${overdueFollowUps > 1 ? 's' : ''}`
            : `${upcomingDeadlines} upcoming deadline${upcomingDeadlines === 1 ? '' : 's'}`}
        </span>
      </div>
    </div>
  );
}

export default ApplicationStats;
