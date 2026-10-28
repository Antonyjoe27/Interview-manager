import React from 'react';
import Icon from '../Icon';

export function ScheduleStats({ metrics }) {
  const {
    totalInterviews,
    upcomingInterviews,
    todayInterviews,
    completedInterviews,
    pendingPrepInterviews
  } = metrics;

  return (
    <div className="schedule-stats-grid" aria-label="Schedule Summary Metrics">
      {/* 1. Total Interviews */}
      <div className="schedule-stat-card">
        <div className="schedule-stat-card__header">
          <span className="schedule-stat-card__label">Total Interviews</span>
          <div
            className="schedule-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
          >
            <Icon name="calendar" size={18} />
          </div>
        </div>
        <span className="schedule-stat-card__value">{totalInterviews}</span>
        <span className="schedule-stat-card__subtext">All logged interview rounds</span>
      </div>

      {/* 2. Upcoming Interviews */}
      <div className="schedule-stat-card">
        <div className="schedule-stat-card__header">
          <span className="schedule-stat-card__label">Upcoming</span>
          <div
            className="schedule-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
          >
            <Icon name="calendarCheck" size={18} />
          </div>
        </div>
        <span className="schedule-stat-card__value" style={{ color: '#22d3ee' }}>
          {upcomingInterviews}
        </span>
        <span className="schedule-stat-card__subtext">Scheduled future rounds</span>
      </div>

      {/* 3. Today's Interviews */}
      <div
        className="schedule-stat-card"
        style={todayInterviews > 0 ? { borderColor: 'var(--color-primary-border)', backgroundColor: 'rgba(99, 102, 241, 0.05)' } : {}}
      >
        <div className="schedule-stat-card__header">
          <span className="schedule-stat-card__label">Today's Rounds</span>
          <div
            className="schedule-stat-card__icon-wrap"
            style={{
              backgroundColor: todayInterviews > 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: todayInterviews > 0 ? 'var(--color-primary)' : 'var(--color-text-subtle)'
            }}
          >
            <Icon name="clock" size={18} />
          </div>
        </div>
        <span
          className="schedule-stat-card__value"
          style={{ color: todayInterviews > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
        >
          {todayInterviews}
        </span>
        <span className="schedule-stat-card__subtext">
          {todayInterviews > 0 ? 'Scheduled for today' : 'No interviews today'}
        </span>
      </div>

      {/* 4. Completed Rounds */}
      <div className="schedule-stat-card">
        <div className="schedule-stat-card__header">
          <span className="schedule-stat-card__label">Completed</span>
          <div
            className="schedule-stat-card__icon-wrap"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
          >
            <Icon name="check" size={18} />
          </div>
        </div>
        <span className="schedule-stat-card__value" style={{ color: 'var(--color-success-text)' }}>
          {completedInterviews}
        </span>
        <span className="schedule-stat-card__subtext">Interview rounds finished</span>
      </div>

      {/* 5. Pending Preparation */}
      <div
        className="schedule-stat-card"
        style={pendingPrepInterviews > 0 ? { borderColor: 'var(--color-warning-border)', backgroundColor: 'rgba(245, 158, 11, 0.04)' } : {}}
      >
        <div className="schedule-stat-card__header">
          <span className="schedule-stat-card__label">Pending Prep</span>
          <div
            className="schedule-stat-card__icon-wrap"
            style={{
              backgroundColor: pendingPrepInterviews > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: pendingPrepInterviews > 0 ? 'var(--color-warning)' : 'var(--color-text-subtle)'
            }}
          >
            <Icon name="alert" size={18} />
          </div>
        </div>
        <span
          className="schedule-stat-card__value"
          style={{ color: pendingPrepInterviews > 0 ? 'var(--color-warning)' : 'var(--color-text-primary)' }}
        >
          {pendingPrepInterviews}
        </span>
        <span className="schedule-stat-card__subtext">
          {pendingPrepInterviews > 0 ? 'Requires study attention' : 'All prepped'}
        </span>
      </div>
    </div>
  );
}

export default ScheduleStats;
