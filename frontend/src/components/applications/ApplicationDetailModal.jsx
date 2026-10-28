import React from 'react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  APPLICATION_STATUS_CONFIG,
  APPLICATION_STATUSES,
  TERMINAL_STATUSES,
  formatDisplayDate,
  isDatePast,
  isDateToday
} from '../../utils/applicationData';
import { getCompanyInitials, getMonogramBackground } from './KanbanView';

export function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onStatusChange
}) {
  if (!application) return null;

  const currentStatusConfig = APPLICATION_STATUS_CONFIG[application.status] || {
    label: application.status,
    variant: 'neutral',
    color: '#94a3b8'
  };

  const isTerminal = TERMINAL_STATUSES.includes(application.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            className="applications-kanban-card-avatar"
            style={{ background: getMonogramBackground(application.company) }}
            aria-hidden="true"
          >
            {getCompanyInitials(application.company)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                {application.company}
              </span>
              <Badge variant={currentStatusConfig.variant} size="sm" dot>
                {currentStatusConfig.label}
              </Badge>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              {application.role}
            </p>
          </div>
        </div>
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Icon name="trash" size={14} />}
            onClick={() => {
              onClose();
              onDelete(application);
            }}
          >
            Delete
          </Button>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Icon name="edit" size={14} />}
              onClick={() => {
                onClose();
                onEdit(application);
              }}
            >
              Edit Application
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* 1-Click Pipeline Stage Switcher */}
        <div>
          <span
            style={{
              display: 'block',
              fontSize: 'var(--font-size-2xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}
          >
            Recruitment Stage (Click to update)
          </span>

          <div className="applications-stage-pills" role="radiogroup" aria-label="Pipeline stage options">
            {APPLICATION_STATUSES.map((st) => {
              const cfg = APPLICATION_STATUS_CONFIG[st];
              const isActive = application.status === st;

              return (
                <button
                  key={st}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`applications-stage-pill ${isActive ? 'applications-stage-pill--active' : ''}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${cfg.color}22`,
                          borderColor: cfg.color,
                          color: cfg.color
                        }
                      : {}
                  }
                  onClick={() => onStatusChange(application.id, st)}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: cfg.color
                    }}
                    aria-hidden="true"
                  />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="applications-detail-grid">
          {/* Application Date */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Application Date</span>
            <span className="applications-detail-value">{formatDisplayDate(application.applicationDate)}</span>
          </div>

          {/* Work Mode & Type */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Work Mode & Type</span>
            <span className="applications-detail-value">
              {application.workMode} • {application.jobType}
            </span>
          </div>

          {/* Location */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Location</span>
            <span className="applications-detail-value">{application.location || 'Not specified'}</span>
          </div>

          {/* Compensation */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Salary / Compensation</span>
            <span className="applications-detail-value">{application.salaryRange || 'Not disclosed'}</span>
          </div>

          {/* Application Source */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Source</span>
            <span className="applications-detail-value">{application.source || 'Direct application'}</span>
          </div>

          {/* Follow-up Date */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Follow-up Date</span>
            <div style={{ marginTop: '2px' }}>
              {application.followUpDate ? (
                !isTerminal && isDatePast(application.followUpDate) ? (
                  <Badge variant="error" size="sm" dot>
                    Overdue: {formatDisplayDate(application.followUpDate)}
                  </Badge>
                ) : !isTerminal && isDateToday(application.followUpDate) ? (
                  <Badge variant="warning" size="sm" dot>
                    Today ({formatDisplayDate(application.followUpDate)})
                  </Badge>
                ) : (
                  <span className="applications-detail-value">{formatDisplayDate(application.followUpDate)}</span>
                )
              ) : (
                <span className="applications-detail-value" style={{ color: 'var(--color-text-subtle)' }}>
                  None scheduled
                </span>
              )}
            </div>
          </div>

          {/* Application / Offer Deadline */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Deadline</span>
            <div style={{ marginTop: '2px' }}>
              {application.deadline ? (
                !isTerminal && isDatePast(application.deadline) ? (
                  <Badge variant="error" size="sm">
                    Passed: {formatDisplayDate(application.deadline)}
                  </Badge>
                ) : !isTerminal && isDateToday(application.deadline) ? (
                  <Badge variant="warning" size="sm" dot>
                    Today ({formatDisplayDate(application.deadline)})
                  </Badge>
                ) : (
                  <span className="applications-detail-value">{formatDisplayDate(application.deadline)}</span>
                )
              ) : (
                <span className="applications-detail-value" style={{ color: 'var(--color-text-subtle)' }}>
                  None set
                </span>
              )}
            </div>
          </div>

          {/* Recruiter / Contact */}
          <div className="applications-detail-field">
            <span className="applications-detail-label">Recruiter / Contact</span>
            {application.contactName || application.contactEmail ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {application.contactName && (
                  <span className="applications-detail-value">{application.contactName}</span>
                )}
                {application.contactEmail && (
                  <a
                    href={`mailto:${application.contactEmail}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-primary)',
                      fontSize: 'var(--font-size-xs)',
                      textDecoration: 'none'
                    }}
                  >
                    <Icon name="mail" size={13} />
                    {application.contactEmail}
                  </a>
                )}
              </div>
            ) : (
              <span className="applications-detail-value" style={{ color: 'var(--color-text-subtle)' }}>
                Not specified
              </span>
            )}
          </div>
        </div>

        {/* Job Posting URL */}
        {application.jobUrl && (
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
              <Icon name="externalLink" size={16} />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {application.jobUrl}
              </span>
            </div>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn app-btn--subtle app-btn--sm"
              style={{ flexShrink: 0, textDecoration: 'none' }}
            >
              Open Posting ↗
            </a>
          </div>
        )}

        {/* Notes & Progress Log */}
        <div>
          <span
            style={{
              display: 'block',
              fontSize: 'var(--font-size-2xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}
          >
            Interview Notes & Activity Log
          </span>
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-bg-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              color: application.notes ? 'var(--color-text-secondary)' : 'var(--color-text-subtle)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}
          >
            {application.notes || 'No notes or interview logs added for this role yet.'}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ApplicationDetailModal;
