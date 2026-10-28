import React from 'react';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  INTERVIEW_STAGES,
  INTERVIEW_FORMATS,
  INTERVIEW_STATUSES
} from '../../utils/scheduleData';

export function ScheduleToolbar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onClearFilters,
  onOpenCreateModal
}) {
  const { search, status, stage, format, timeframe, sortBy } = filters;

  const isFiltered = Boolean(
    search.trim() ||
    status !== 'all' ||
    stage !== 'all' ||
    format !== 'all' ||
    timeframe !== 'all' ||
    sortBy !== 'dateAsc'
  );

  return (
    <div className="schedule-toolbar-card" role="region" aria-label="Schedule controls and filters">
      {/* Top Row: View Switcher, Search, and Action Button */}
      <div className="schedule-toolbar-top">
        {/* View Switcher Pills */}
        <div className="schedule-view-switcher" role="tablist" aria-label="View mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'calendar'}
            className={`schedule-view-btn ${viewMode === 'calendar' ? 'schedule-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
          >
            <Icon name="calendar" size={15} />
            <span>Calendar View</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'agenda'}
            className={`schedule-view-btn ${viewMode === 'agenda' ? 'schedule-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('agenda')}
          >
            <Icon name="list" size={15} />
            <span>Agenda View</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="schedule-search-wrap">
          <span className="schedule-search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            placeholder="Search by company, role, stage, or notes..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="schedule-search-input"
            aria-label="Search interviews"
          />
          {search && (
            <button
              type="button"
              className="schedule-search-clear"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
              title="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Primary Schedule Interview Button */}
        <Button
          variant="primary"
          leftIcon={<Icon name="plus" size={16} />}
          onClick={onOpenCreateModal}
        >
          Schedule Interview
        </Button>
      </div>

      {/* Middle Row: Filter Dropdowns */}
      <div className="schedule-filter-dropdowns-row">
        {/* Timeframe Filter */}
        <div className="schedule-filter-group">
          <label htmlFor="filter-timeframe-select" className="schedule-filter-label">
            Timeframe
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-timeframe-select"
              value={timeframe}
              onChange={(e) => onFilterChange('timeframe', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Timeframes</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today's Rounds</option>
              <option value="past">Past Rounds</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="schedule-filter-group">
          <label htmlFor="filter-status-select" className="schedule-filter-label">
            Status
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-status-select"
              value={status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Statuses</option>
              {INTERVIEW_STATUSES.map((st) => (
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

        {/* Stage Filter */}
        <div className="schedule-filter-group">
          <label htmlFor="filter-stage-select" className="schedule-filter-label">
            Stage
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-stage-select"
              value={stage}
              onChange={(e) => onFilterChange('stage', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Stages</option>
              {INTERVIEW_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Format Filter */}
        <div className="schedule-filter-group">
          <label htmlFor="filter-format-select" className="schedule-filter-label">
            Format
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-format-select"
              value={format}
              onChange={(e) => onFilterChange('format', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Formats</option>
              {INTERVIEW_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Sort Order */}
        <div className="schedule-filter-group">
          <label htmlFor="filter-sort-select" className="schedule-filter-label">
            Sort Order
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-sort-select"
              value={sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="dateAsc">Date & Time (Earliest First)</option>
              <option value="dateDesc">Date & Time (Latest First)</option>
              <option value="companyAsc">Company (A to Z)</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="arrowUpDown" size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary Bar */}
      {isFiltered && (
        <div className="schedule-active-filters-bar">
          <div className="schedule-active-tags">
            <span style={{ color: 'var(--color-text-subtle)' }}>Active Filters:</span>
            {search.trim() && (
              <span className="schedule-active-tag">
                Query: "{search.trim()}"
              </span>
            )}
            {timeframe !== 'all' && (
              <span className="schedule-active-tag">
                Timeframe: {timeframe}
              </span>
            )}
            {status !== 'all' && (
              <span className="schedule-active-tag">
                Status: {status}
              </span>
            )}
            {stage !== 'all' && (
              <span className="schedule-active-tag">
                Stage: {stage}
              </span>
            )}
            {format !== 'all' && (
              <span className="schedule-active-tag">
                Format: {format}
              </span>
            )}
            {sortBy !== 'dateAsc' && (
              <span className="schedule-active-tag">
                Sorted
              </span>
            )}
          </div>

          <button
            type="button"
            className="schedule-clear-filters-btn"
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

export default ScheduleToolbar;
