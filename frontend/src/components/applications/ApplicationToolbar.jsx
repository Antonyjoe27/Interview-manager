import React from 'react';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  APPLICATION_STATUSES,
  WORK_MODES,
  JOB_TYPES
} from '../../utils/applicationData';

export function ApplicationToolbar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onClearFilters,
  onOpenCreateModal
}) {
  const { search, status, workMode, jobType, timeframe, sortBy } = filters;

  const isFiltered = Boolean(
    search.trim() ||
    status !== 'all' ||
    workMode !== 'all' ||
    jobType !== 'all' ||
    timeframe !== 'all' ||
    sortBy !== 'applicationDateDesc'
  );

  return (
    <div className="applications-toolbar-card" role="region" aria-label="Job applications controls and filters">
      {/* Top Row: View Switcher, Search, and Action Button */}
      <div className="applications-toolbar-top">
        {/* View Switcher Pills */}
        <div className="applications-view-switcher" role="tablist" aria-label="View mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'kanban'}
            className={`applications-view-btn ${viewMode === 'kanban' ? 'applications-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('kanban')}
          >
            <Icon name="kanban" size={15} />
            <span>Pipeline Board</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            className={`applications-view-btn ${viewMode === 'table' ? 'applications-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            <Icon name="list" size={15} />
            <span>Table View</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="applications-search-wrap">
          <span className="applications-search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            placeholder="Search by company, role, location, or recruiter..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="applications-search-input"
            aria-label="Search job applications"
          />
          {search && (
            <button
              type="button"
              className="applications-search-clear"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
              title="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Primary Add Application Button */}
        <Button
          variant="primary"
          leftIcon={<Icon name="plus" size={16} />}
          onClick={onOpenCreateModal}
        >
          Add Application
        </Button>
      </div>

      {/* Middle Row: Filter Dropdowns */}
      <div className="applications-filter-dropdowns-row">
        {/* Focus / Timeframe Filter */}
        <div className="applications-filter-group">
          <label htmlFor="filter-app-timeframe" className="applications-filter-label">
            Pipeline Scope
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-app-timeframe"
              value={timeframe}
              onChange={(e) => onFilterChange('timeframe', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Applications</option>
              <option value="inProgress">Active Pipeline Only</option>
              <option value="hasFollowUp">Has Follow-up Date</option>
              <option value="upcomingFollowUp">Upcoming Follow-ups</option>
              <option value="overdueFollowUp">Overdue Follow-ups</option>
              <option value="hasDeadline">Active Deadlines</option>
              <option value="offers">Offers Received</option>
              <option value="terminal">Closed (Rejected / Withdrawn)</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="applications-filter-group">
          <label htmlFor="filter-app-status" className="applications-filter-label">
            Stage / Status
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-app-status"
              value={status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Statuses</option>
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Work Mode Filter */}
        <div className="applications-filter-group">
          <label htmlFor="filter-app-workmode" className="applications-filter-label">
            Work Mode
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-app-workmode"
              value={workMode}
              onChange={(e) => onFilterChange('workMode', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Modes</option>
              {WORK_MODES.map((wm) => (
                <option key={wm} value={wm}>
                  {wm}
                </option>
              ))}
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="applications-filter-group">
          <label htmlFor="filter-app-jobtype" className="applications-filter-label">
            Job Type
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-app-jobtype"
              value={jobType}
              onChange={(e) => onFilterChange('jobType', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Types</option>
              {JOB_TYPES.map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Sort Order */}
        <div className="applications-filter-group">
          <label htmlFor="filter-app-sort" className="applications-filter-label">
            Sort Order
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-app-sort"
              value={sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="applicationDateDesc">Applied Date (Newest First)</option>
              <option value="applicationDateAsc">Applied Date (Oldest First)</option>
              <option value="companyAsc">Company (A to Z)</option>
              <option value="statusAsc">Status / Pipeline Stage</option>
              <option value="deadlineAsc">Deadline (Earliest First)</option>
              <option value="followUpAsc">Follow-up (Earliest First)</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="arrowUpDown" size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary Bar */}
      {isFiltered && (
        <div className="applications-active-filters-bar">
          <div className="applications-active-tags">
            <span style={{ color: 'var(--color-text-subtle)' }}>Active Filters:</span>
            {search.trim() && (
              <span className="applications-active-tag">
                Query: "{search.trim()}"
              </span>
            )}
            {timeframe !== 'all' && (
              <span className="applications-active-tag">
                Scope: {timeframe}
              </span>
            )}
            {status !== 'all' && (
              <span className="applications-active-tag">
                Status: {status}
              </span>
            )}
            {workMode !== 'all' && (
              <span className="applications-active-tag">
                Mode: {workMode}
              </span>
            )}
            {jobType !== 'all' && (
              <span className="applications-active-tag">
                Type: {jobType}
              </span>
            )}
            {sortBy !== 'applicationDateDesc' && (
              <span className="applications-active-tag">
                Sorted
              </span>
            )}
          </div>

          <button
            type="button"
            className="applications-clear-filters-btn"
            onClick={onClearFilters}
          >
            <Icon name="x" size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplicationToolbar;
