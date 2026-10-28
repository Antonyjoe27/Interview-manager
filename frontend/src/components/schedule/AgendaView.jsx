import React from 'react';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import Icon from '../Icon';
import {
  formatInterviewDateDisplay,
  formatTimeDisplay,
  isValidUrl,
  isDateToday,
  INTERVIEW_STATUS_CONFIG
} from '../../utils/scheduleData';

export function AgendaView({
  interviews,
  onViewDetails,
  onEditInterview,
  onDeleteInterview
}) {
  const getFormatIcon = (format) => {
    switch (format) {
      case 'Online':
        return 'video';
      case 'Phone':
        return 'phone';
      case 'In-person':
        return 'mapPin';
      default:
        return 'calendar';
    }
  };

  return (
    <div className="schedule-agenda-list" role="list" aria-label="Interview agenda list">
      {interviews.map((item) => {
        const isToday = isDateToday(item.date);
        const isCompleted = item.status === 'Completed';
        const isCancelled = item.status === 'Cancelled';
        const statusCfg = INTERVIEW_STATUS_CONFIG[item.status] || INTERVIEW_STATUS_CONFIG.Scheduled;
        const formatIcon = getFormatIcon(item.format);
        const hasValidUrl = item.locationOrLink && isValidUrl(item.locationOrLink);

        return (
          <article
            key={item.id}
            role="listitem"
            className={`schedule-interview-card ${isToday ? 'schedule-interview-card--today' : ''} ${
              isCompleted ? 'schedule-interview-card--completed' : ''
            } ${isCancelled ? 'schedule-interview-card--cancelled' : ''}`}
            aria-label={`${item.company} ${item.role}, ${item.status}`}
          >
            {/* Company Avatar Monogram */}
            <div className="schedule-interview-avatar" aria-hidden="true">
              {item.company.slice(0, 2).toUpperCase()}
            </div>

            {/* Main Body */}
            <div className="schedule-interview-body">
              <div className="schedule-interview-header-row">
                <span
                  className="schedule-interview-company-title"
                  onClick={() => onViewDetails(item)}
                  title="Click to view interview details"
                >
                  {item.company}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isToday && !isCompleted && !isCancelled && (
                    <Badge variant="primary" dot size="sm">
                      Today's Round
                    </Badge>
                  )}
                  <Badge variant={statusCfg.variant} size="sm">
                    {statusCfg.label}
                  </Badge>
                </div>
              </div>

              {/* Role & Stage */}
              <div className="schedule-interview-role-stage">
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  {item.role}
                </span>
                <span>•</span>
                <span style={{ color: 'var(--color-primary)' }}>{item.stage}</span>
              </div>

              {/* Metadata row: Date, Time, Duration, Format */}
              <div className="schedule-interview-meta-row">
                <span className="schedule-interview-meta-item">
                  <Icon name="calendar" size={13} />
                  <span>{formatInterviewDateDisplay(item.date)}</span>
                </span>

                <span className="schedule-interview-meta-item">
                  <Icon name="clock" size={13} />
                  <span>{formatTimeDisplay(item.time)} (~{item.durationMinutes}m)</span>
                </span>

                <span className="schedule-interview-meta-item">
                  <Icon name={formatIcon} size={13} />
                  <span>{item.format}</span>
                </span>

                {/* Optional Meeting link or location */}
                {hasValidUrl ? (
                  <a
                    href={item.locationOrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="schedule-interview-link"
                    title={item.locationOrLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="externalLink" size={12} />
                    <span>Join Meeting</span>
                  </a>
                ) : item.locationOrLink ? (
                  <span className="schedule-interview-meta-item" style={{ color: 'var(--color-text-subtle)' }}>
                    <span>{item.locationOrLink}</span>
                  </span>
                ) : null}
              </div>

              {/* Notes excerpt if present */}
              {item.notes && (
                <div className="schedule-interview-notes">
                  <span>{item.notes}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="schedule-interview-actions">
              <IconButton
                name="eye"
                aria-label={`View details for ${item.company}`}
                title="View details"
                variant="subtle"
                size="sm"
                onClick={() => onViewDetails(item)}
              />
              <IconButton
                name="edit"
                aria-label={`Edit or reschedule ${item.company}`}
                title="Edit / Reschedule"
                variant="subtle"
                size="sm"
                onClick={() => onEditInterview(item)}
              />
              <IconButton
                name="trash"
                aria-label={`Delete interview with ${item.company}`}
                title="Delete interview"
                variant="subtle"
                size="sm"
                onClick={() => onDeleteInterview(item)}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default AgendaView;
