import React from 'react';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import Icon from '../Icon';
import {
  APPLICATION_STATUS_CONFIG,
  APPLICATION_STATUSES,
  TERMINAL_STATUSES,
  formatDisplayDate,
  isDatePast,
  isDateToday
} from '../../utils/applicationData';

const MONOGRAM_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #0ea5e9, #0284c7)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #14b8a6, #0d9488)'
];

export function getCompanyInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || '??';
}

export function getMonogramBackground(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MONOGRAM_GRADIENTS.length;
  return MONOGRAM_GRADIENTS[index];
}

export function KanbanView({
  applications = [],
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange
}) {
  return (
    <div className="applications-kanban-board" role="region" aria-label="Recruitment Pipeline Kanban Board">
      {APPLICATION_STATUSES.map((statusKey) => {
        const config = APPLICATION_STATUS_CONFIG[statusKey];
        const columnApps = applications.filter((app) => app.status === statusKey);

        return (
          <div key={statusKey} className="applications-kanban-column" data-status={statusKey}>
            {/* Column Header */}
            <div className="applications-kanban-column-header">
              <div className="applications-kanban-column-title">
                <span
                  className="applications-kanban-column-dot"
                  style={{ backgroundColor: config.color }}
                  aria-hidden="true"
                />
                <span>{config.label}</span>
              </div>
              <span className="applications-kanban-column-count">{columnApps.length}</span>
            </div>

            {/* Column Body */}
            <div className="applications-kanban-column-body">
              {columnApps.length === 0 ? (
                <div className="applications-kanban-empty">
                  <span>No applications</span>
                </div>
              ) : (
                columnApps.map((app) => {
                  const isTerminal = TERMINAL_STATUSES.includes(app.status);

                  return (
                    <div
                      key={app.id}
                      className="applications-kanban-card"
                      onClick={() => onViewDetails(app)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onViewDetails(app);
                        }
                      }}
                      aria-label={`${app.company} - ${app.role}`}
                    >
                      {/* Card Header */}
                      <div className="applications-kanban-card-header">
                        <div
                          className="applications-kanban-card-avatar"
                          style={{ background: getMonogramBackground(app.company) }}
                          aria-hidden="true"
                        >
                          {getCompanyInitials(app.company)}
                        </div>

                        <div className="applications-kanban-card-titles">
                          <h4 className="applications-kanban-card-company" title={app.company}>
                            {app.company}
                          </h4>
                          <span className="applications-kanban-card-role" title={app.role}>
                            {app.role}
                          </span>
                        </div>
                      </div>

                      {/* Card Meta & Badges */}
                      <div className="applications-kanban-card-meta">
                        <div className="applications-kanban-card-meta-row">
                          <Badge
                            variant={
                              app.workMode === 'Remote'
                                ? 'info'
                                : app.workMode === 'Hybrid'
                                ? 'primary'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {app.workMode}
                          </Badge>

                          {app.location && (
                            <span title={app.location} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {app.location}
                            </span>
                          )}
                        </div>

                        {app.salaryRange && (
                          <div className="applications-kanban-card-meta-row" style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="dollarSign" size={12} />
                              {app.salaryRange}
                            </span>
                          </div>
                        )}

                        <div className="applications-kanban-card-meta-row">
                          <span>Applied: {formatDisplayDate(app.applicationDate)}</span>
                          {app.source && <span>via {app.source}</span>}
                        </div>

                        {/* Actionable alerts for active items */}
                        {!isTerminal && app.followUpDate && (
                          <div style={{ marginTop: '2px' }}>
                            {isDatePast(app.followUpDate) ? (
                              <Badge variant="error" size="sm" dot>
                                Follow-up overdue: {formatDisplayDate(app.followUpDate)}
                              </Badge>
                            ) : isDateToday(app.followUpDate) ? (
                              <Badge variant="warning" size="sm" dot>
                                Follow-up today
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                Follow-up: {formatDisplayDate(app.followUpDate)}
                              </Badge>
                            )}
                          </div>
                        )}

                        {!isTerminal && app.deadline && (
                          <div style={{ marginTop: '2px' }}>
                            {isDatePast(app.deadline) ? (
                              <Badge variant="error" size="sm">
                                Deadline passed: {formatDisplayDate(app.deadline)}
                              </Badge>
                            ) : isDateToday(app.deadline) ? (
                              <Badge variant="warning" size="sm" dot>
                                Deadline today
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                Deadline: {formatDisplayDate(app.deadline)}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Quick Status Switcher & Action Icons */}
                      <div className="applications-kanban-card-footer" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={app.status}
                          onChange={(e) => onStatusChange(app.id, e.target.value)}
                          className="applications-kanban-status-select"
                          aria-label={`Change stage for ${app.company}`}
                        >
                          {APPLICATION_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {APPLICATION_STATUS_CONFIG[st].label}
                            </option>
                          ))}
                        </select>

                        <div className="applications-kanban-actions">
                          <IconButton
                            name="eye"
                            size="sm"
                            aria-label={`View details for ${app.company}`}
                            onClick={() => onViewDetails(app)}
                          />
                          <IconButton
                            name="edit"
                            size="sm"
                            aria-label={`Edit ${app.company}`}
                            onClick={() => onEdit(app)}
                          />
                          <IconButton
                            name="trash"
                            size="sm"
                            aria-label={`Delete ${app.company}`}
                            onClick={() => onDelete(app)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanView;
