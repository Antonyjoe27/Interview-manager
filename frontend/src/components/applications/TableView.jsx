import React from 'react';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import { EmptyState } from '../EmptyState';
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

export function TableView({
  applications = [],
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
  onResetFilters
}) {
  if (applications.length === 0) {
    return (
      <div className="applications-table-card">
        <EmptyState
          icon="briefcase"
          title="No job applications found"
          description="No applications match your active search and filter criteria."
          action={
            onResetFilters ? (
              <button
                type="button"
                className="applications-clear-filters-btn"
                onClick={onResetFilters}
              >
                Reset All Filters
              </button>
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div className="applications-table-card" role="region" aria-label="Job Applications List">
      <div style={{ overflowX: 'auto' }}>
        <table className="applications-table">
          <thead>
            <tr>
              <th scope="col">Company & Role</th>
              <th scope="col">Stage</th>
              <th scope="col">Applied Date</th>
              <th scope="col">Work Mode & Location</th>
              <th scope="col">Next Action / Deadline</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const statusCfg = APPLICATION_STATUS_CONFIG[app.status] || {
                label: app.status,
                variant: 'neutral'
              };
              const isTerminal = TERMINAL_STATUSES.includes(app.status);

              return (
                <tr
                  key={app.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onViewDetails(app)}
                >
                  {/* 1. Company & Role */}
                  <td>
                    <div className="applications-table-company-cell">
                      <div
                        className="applications-table-avatar"
                        style={{ background: getMonogramBackground(app.company) }}
                        aria-hidden="true"
                      >
                        {getCompanyInitials(app.company)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span
                          style={{
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {app.company}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)'
                          }}
                        >
                          {app.role}
                        </span>
                        {app.salaryRange && (
                          <span
                            style={{
                              fontSize: 'var(--font-size-2xs)',
                              color: 'var(--color-text-subtle)',
                              marginTop: '2px'
                            }}
                          >
                            {app.salaryRange}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Status & Quick Selector */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
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
                    </div>
                  </td>

                  {/* 3. Applied Date */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                        {formatDisplayDate(app.applicationDate)}
                      </span>
                      {app.source && (
                        <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-text-subtle)' }}>
                          via {app.source}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 4. Work Mode & Location */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>
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
                      </div>
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-muted)'
                        }}
                      >
                        {app.location || '—'}
                      </span>
                    </div>
                  </td>

                  {/* 5. Deadlines & Follow-ups */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {!isTerminal && app.followUpDate ? (
                        isDatePast(app.followUpDate) ? (
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
                        )
                      ) : null}

                      {!isTerminal && app.deadline ? (
                        isDatePast(app.deadline) ? (
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
                        )
                      ) : null}

                      {isTerminal && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
                          Pipeline closed ({statusCfg.label})
                        </span>
                      )}

                      {!isTerminal && !app.followUpDate && !app.deadline && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
                          No pending actions
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 6. Actions */}
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div className="applications-table-actions" style={{ justifyContent: 'flex-end' }}>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;
