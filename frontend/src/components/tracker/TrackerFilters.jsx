import React from 'react';
import Icon from '../Icon';
import { PREPARATION_SUBJECTS } from '../../utils/trackerData';

export function TrackerFilters({
  filters,
  onFilterChange,
  onClearFilters,
  taskCountsBySubject,
  totalTasksCount
}) {
  const { search, subject, status, priority, difficulty, sortBy } = filters;

  const isFiltered = Boolean(
    search.trim() ||
    subject !== 'all' ||
    status !== 'all' ||
    priority !== 'all' ||
    difficulty !== 'all' ||
    sortBy !== 'dueDateAsc'
  );

  return (
    <div className="tracker-filter-card" role="search" aria-label="Task search and filters">
      {/* Top Row: Search Input */}
      <div className="tracker-filter-top-row">
        <div className="tracker-search-wrap">
          <span className="tracker-search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            placeholder="Search problems by title, topic, or keyword..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="tracker-search-input"
            aria-label="Search preparation tasks"
          />
          {search && (
            <button
              type="button"
              className="tracker-search-clear"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
              title="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Subject Filter Pills */}
      <div className="tracker-subject-pills" role="tablist" aria-label="Filter by subject track">
        <button
          type="button"
          role="tab"
          aria-selected={subject === 'all'}
          className={`tracker-subject-pill ${subject === 'all' ? 'tracker-subject-pill--active' : ''}`}
          onClick={() => onFilterChange('subject', 'all')}
        >
          <span>All Tracks</span>
          <span className="tracker-subject-pill__count">{totalTasksCount}</span>
        </button>

        {PREPARATION_SUBJECTS.map((subj) => {
          const count = taskCountsBySubject[subj.id] || 0;
          const isActive = subject === subj.id;

          return (
            <button
              key={subj.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tracker-subject-pill ${isActive ? 'tracker-subject-pill--active' : ''}`}
              onClick={() => onFilterChange('subject', subj.id)}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: subj.color
                }}
              />
              <span>{subj.shortName}</span>
              <span className="tracker-subject-pill__count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Secondary Dropdowns (Status, Priority, Difficulty, Sort) */}
      <div className="tracker-filter-dropdowns-row">
        {/* Status Dropdown */}
        <div className="tracker-filter-select-group">
          <label htmlFor="filter-status-select" className="tracker-filter-select-label">
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue Only</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Priority Dropdown */}
        <div className="tracker-filter-select-group">
          <label htmlFor="filter-priority-select" className="tracker-filter-select-label">
            Priority
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-priority-select"
              value={priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Difficulty Dropdown */}
        <div className="tracker-filter-select-group">
          <label htmlFor="filter-diff-select" className="tracker-filter-select-label">
            Difficulty
          </label>
          <div className="app-select-wrapper">
            <select
              id="filter-diff-select"
              value={difficulty}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              className="app-select"
              style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="tracker-filter-select-group">
          <label htmlFor="filter-sort-select" className="tracker-filter-select-label">
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
              <option value="dueDateAsc">Due Date (Earliest First)</option>
              <option value="dueDateDesc">Due Date (Latest First)</option>
              <option value="priorityDesc">Priority (High to Low)</option>
              <option value="difficultyDesc">Difficulty (Hard to Easy)</option>
              <option value="difficultyAsc">Difficulty (Easy to Hard)</option>
              <option value="recentlyCreated">Recently Added</option>
              <option value="titleAsc">Title (A to Z)</option>
            </select>
            <span className="app-select-arrow" aria-hidden="true">
              <Icon name="arrowUpDown" size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {isFiltered && (
        <div className="tracker-active-filters-bar">
          <div className="tracker-active-tags">
            <span style={{ color: 'var(--color-text-subtle)' }}>Active Filters:</span>
            {search.trim() && (
              <span className="tracker-active-tag">
                Query: "{search.trim()}"
              </span>
            )}
            {subject !== 'all' && (
              <span className="tracker-active-tag">
                Track: {PREPARATION_SUBJECTS.find((s) => s.id === subject)?.shortName || subject}
              </span>
            )}
            {status !== 'all' && (
              <span className="tracker-active-tag">
                Status: {status}
              </span>
            )}
            {priority !== 'all' && (
              <span className="tracker-active-tag">
                Priority: {priority}
              </span>
            )}
            {difficulty !== 'all' && (
              <span className="tracker-active-tag">
                Difficulty: {difficulty}
              </span>
            )}
            {sortBy !== 'dueDateAsc' && (
              <span className="tracker-active-tag">
                Sorted
              </span>
            )}
          </div>

          <button
            type="button"
            className="tracker-clear-filters-btn"
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

export default TrackerFilters;
