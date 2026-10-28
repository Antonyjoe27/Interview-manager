import React, { useState } from 'react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Badge } from '../Badge';
import Icon from '../Icon';
import {
  generateCalendarMonthGrid,
  formatMonthYear,
  formatTimeDisplay,
  formatInterviewDateDisplay,
  getTodayDateString,
  INTERVIEW_STATUS_CONFIG
} from '../../utils/scheduleData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({
  interviews,
  onViewDetails,
  onEditInterview,
  onOpenCreateWithDate
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Generate month grid
  const monthCells = generateCalendarMonthGrid(currentYear, currentMonth, interviews);

  // Interviews on selected date
  const selectedDateInterviews = interviews.filter((item) => item.date === selectedDate);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(getTodayDateString());
  };

  return (
    <div className="schedule-calendar-container">
      {/* Calendar Card */}
      <div className="schedule-calendar-card">
        {/* Navigation & Title Header */}
        <div className="schedule-calendar-header">
          <h2 className="schedule-calendar-title">
            {formatMonthYear(currentYear, currentMonth)}
          </h2>

          <div className="schedule-calendar-nav">
            <IconButton
              name="chevronLeft"
              aria-label="Previous month"
              title="Previous month"
              variant="subtle"
              size="sm"
              onClick={handlePrevMonth}
            />
            <Button
              variant="subtle"
              size="sm"
              onClick={handleGoToToday}
            >
              Today
            </Button>
            <IconButton
              name="chevronRight"
              aria-label="Next month"
              title="Next month"
              variant="subtle"
              size="sm"
              onClick={handleNextMonth}
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="schedule-calendar-grid" role="grid" aria-label="Monthly interview calendar">
          {/* Weekday Column Headers */}
          {WEEKDAYS.map((day) => (
            <div key={day} className="schedule-calendar-weekday" role="columnheader">
              {day}
            </div>
          ))}

          {/* Month Day Cells */}
          {monthCells.map((cell) => {
            const isSelected = cell.dateStr === selectedDate;
            const maxVisibleEvents = 2;
            const visibleEvents = cell.interviews.slice(0, maxVisibleEvents);
            const hiddenCount = cell.interviews.length - maxVisibleEvents;

            return (
              <div
                key={cell.dateStr}
                role="gridcell"
                tabIndex={0}
                aria-selected={isSelected}
                className={`schedule-calendar-day-cell ${
                  !cell.isCurrentMonth ? 'schedule-calendar-day-cell--other-month' : ''
                } ${cell.isToday ? 'schedule-calendar-day-cell--today' : ''} ${
                  isSelected ? 'schedule-calendar-day-cell--selected' : ''
                }`}
                onClick={() => setSelectedDate(cell.dateStr)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setSelectedDate(cell.dateStr);
                  }
                }}
              >
                <span className="schedule-calendar-day-num">
                  {cell.dayNumber}
                </span>

                <div className="schedule-calendar-events">
                  {visibleEvents.map((evt) => {
                    const statusCfg = INTERVIEW_STATUS_CONFIG[evt.status] || INTERVIEW_STATUS_CONFIG.Scheduled;

                    return (
                      <div
                        key={evt.id}
                        className="schedule-calendar-event-pill"
                        title={`${evt.company} - ${evt.stage} at ${formatTimeDisplay(evt.time)} (${evt.status})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(cell.dateStr);
                          onViewDetails(evt);
                        }}
                      >
                        <span
                          className="schedule-calendar-event-dot"
                          style={{ backgroundColor: statusCfg.color }}
                        />
                        <span className="schedule-calendar-event-text">
                          {evt.company} ({formatTimeDisplay(evt.time)})
                        </span>
                      </div>
                    );
                  })}

                  {hiddenCount > 0 && (
                    <span className="schedule-calendar-more-pill">
                      +{hiddenCount} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Panel */}
      <div className="schedule-selected-date-card" aria-live="polite">
        <div className="schedule-selected-date-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="schedule-selected-date-title">
              {formatInterviewDateDisplay(selectedDate)}
            </span>
            <Badge variant="neutral" size="sm">
              {selectedDateInterviews.length} {selectedDateInterviews.length === 1 ? 'round' : 'rounds'}
            </Badge>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Icon name="plus" size={14} />}
            onClick={() => onOpenCreateWithDate(selectedDate)}
          >
            Add Interview on this date
          </Button>
        </div>

        {selectedDateInterviews.length === 0 ? (
          <div style={{ padding: 'var(--space-6) 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
              No interview rounds scheduled for {formatInterviewDateDisplay(selectedDate)}.
            </p>
            <Button
              variant="subtle"
              size="sm"
              leftIcon={<Icon name="plus" size={14} />}
              onClick={() => onOpenCreateWithDate(selectedDate)}
            >
              Schedule for {formatInterviewDateDisplay(selectedDate)}
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {selectedDateInterviews.map((item) => {
              const statusCfg = INTERVIEW_STATUS_CONFIG[item.status] || INTERVIEW_STATUS_CONFIG.Scheduled;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-bg-surface-raised)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    gap: 'var(--space-3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-bg-surface-elevated), var(--color-bg-hover))',
                        border: '1px solid var(--color-border-strong)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: '#ffffff',
                        flexShrink: 0
                      }}
                    >
                      {item.company.slice(0, 2).toUpperCase()}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer'
                        }}
                        onClick={() => onViewDetails(item)}
                      >
                        {item.company} • {item.role}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {item.stage} at {formatTimeDisplay(item.time)} (~{item.durationMinutes}m) • {item.format}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                    <Badge variant={statusCfg.variant} size="sm">
                      {statusCfg.label}
                    </Badge>

                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                    >
                      Details
                    </Button>
                    <IconButton
                      name="edit"
                      aria-label={`Edit ${item.company}`}
                      title="Edit interview"
                      variant="subtle"
                      size="sm"
                      onClick={() => onEditInterview(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
