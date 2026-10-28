import React from 'react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  formatInterviewDateDisplay,
  formatTimeDisplay,
  isValidUrl,
  isDateToday,
  INTERVIEW_STATUS_CONFIG,
  INTERVIEW_STATUSES
} from '../../utils/scheduleData';

export function InterviewDetailModal({
  isOpen,
  onClose,
  interview,
  onOpenEdit,
  onDeleteInterview,
  onStatusChange
}) {
  if (!interview) return null;

  const statusCfg = INTERVIEW_STATUS_CONFIG[interview.status] || INTERVIEW_STATUS_CONFIG.Scheduled;
  const isToday = isDateToday(interview.date);
  const hasValidUrl = interview.locationOrLink && isValidUrl(interview.locationOrLink);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${interview.company} • ${interview.role}`}
      description={`${interview.stage} (${interview.format})`}
      size="md"
      footer={
        <>
          <Button
            variant="subtle"
            leftIcon={<Icon name="trash" size={14} />}
            onClick={() => {
              onClose();
              onDeleteInterview(interview);
            }}
          >
            Delete
          </Button>

          <Button
            variant="secondary"
            leftIcon={<Icon name="edit" size={14} />}
            onClick={() => {
              onClose();
              onOpenEdit(interview);
            }}
          >
            Edit / Reschedule
          </Button>

          {interview.status !== 'Completed' ? (
            <Button
              variant="primary"
              leftIcon={<Icon name="check" size={14} />}
              onClick={() => {
                onStatusChange(interview.id, 'Completed');
                onClose();
              }}
            >
              Mark Completed
            </Button>
          ) : (
            <Button
              variant="subtle"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Detail Grid */}
        <div className="schedule-detail-grid">
          <div className="schedule-detail-field">
            <span className="schedule-detail-label">Interview Stage</span>
            <span className="schedule-detail-value">{interview.stage}</span>
          </div>

          <div className="schedule-detail-field">
            <span className="schedule-detail-label">Current Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Badge variant={statusCfg.variant} size="sm">
                {statusCfg.label}
              </Badge>
              {isToday && interview.status !== 'Completed' && interview.status !== 'Cancelled' && (
                <Badge variant="primary" dot size="sm">
                  Today
                </Badge>
              )}
            </div>
          </div>

          <div className="schedule-detail-field">
            <span className="schedule-detail-label">Date & Time</span>
            <div className="schedule-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="calendar" size={14} />
              <span>{formatInterviewDateDisplay(interview.date)} at {formatTimeDisplay(interview.time)}</span>
            </div>
          </div>

          <div className="schedule-detail-field">
            <span className="schedule-detail-label">Duration & Format</span>
            <div className="schedule-detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="clock" size={14} />
              <span>~{interview.durationMinutes} mins • {interview.format}</span>
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="schedule-detail-field" style={{ gridColumn: 'span 2' }}>
            <span className="schedule-detail-label">Update Status</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {INTERVIEW_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(interview.id, st)}
                  className={`schedule-view-btn ${interview.status === st ? 'schedule-view-btn--active' : ''}`}
                  style={{ fontSize: 'var(--font-size-2xs)', padding: '4px 8px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meeting Location or Link */}
        {interview.locationOrLink && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-bg-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{ color: 'var(--color-primary)', display: 'flex' }}>
                <Icon name={interview.format === 'Online' ? 'video' : interview.format === 'Phone' ? 'phone' : 'mapPin'} size={18} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  {interview.format === 'Online' ? 'Virtual Meeting Room' : interview.format === 'Phone' ? 'Phone Number' : 'Interview Location'}
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {interview.locationOrLink}
                </span>
              </div>
            </div>

            {hasValidUrl && (
              <a
                href={interview.locationOrLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                <span>Launch Link</span>
                <Icon name="externalLink" size={13} />
              </a>
            )}
          </div>
        )}

        {/* Preparation Notes */}
        {interview.notes ? (
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span className="schedule-detail-label">Preparation Focus & Recruiter Notes</span>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {interview.notes}
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              color: 'var(--color-text-subtle)',
              fontSize: 'var(--font-size-xs)'
            }}
          >
            No preparation notes added yet. Click Edit / Reschedule to add specific question topics.
          </div>
        )}
      </div>
    </Modal>
  );
}

export default InterviewDetailModal;
