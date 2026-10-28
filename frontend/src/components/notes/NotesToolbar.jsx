import React from 'react';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  CONTENT_VIEW_TABS,
  EXTENDED_SUBJECTS,
  RESOURCE_TYPES
} from '../../utils/notesData';

export function NotesToolbar({
  viewTab,
  onViewTabChange,
  filters,
  onFilterChange,
  onClearFilters,
  onOpenCreateNote,
  onOpenCreateResource,
  metrics,
  uniqueTags = []
}) {
  const { search, subject, resourceType, tag, sortBy } = filters;

  const isFiltered = Boolean(
    search.trim() ||
    subject !== 'all' ||
    resourceType !== 'all' ||
    tag !== 'all' ||
    sortBy !== 'updatedAtDesc'
  );

  const getTabCount = (tabId) => {
    if (!metrics) return 0;
    if (tabId === 'all') return metrics.totalItems;
    if (tabId === 'notes') return metrics.totalNotes;
    if (tabId === 'resources') return metrics.totalResources;
    if (tabId === 'favorites') return metrics.favoriteItems;
    return 0;
  };

  return (
    <div className="notes-toolbar-card" role="region" aria-label="Notes and resources controls">
      {/* Top Row: View Tabs, Search, and Action Buttons */}
      <div className="notes-toolbar-top">
        {/* View Switcher Tabs */}
        <div className="notes-view-tabs" role="tablist" aria-label="Filter content type">
          {CONTENT_VIEW_TABS.map((tab) => {
            const isActive = viewTab === tab.id;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`notes-view-tab ${isActive ? 'notes-view-tab--active' : ''}`}
                onClick={() => onViewTabChange(tab.id)}
              >
                <Icon name={tab.icon} size={15} />
                <span>{tab.label}</span>
                <span className="notes-view-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="notes-search-wrap">
          <span className="notes-search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </span>
          <input
            type="text"
            className="notes-search-input"
            placeholder="Search notes, topics, code snippets, tags, URLs..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Search notes and resources"
          />
          {search && (
            <button
              type="button"
              className="notes-search-clear"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search text"
            >
              <Icon name="x" size={15} />
            </button>
          )}
        </div>

        {/* Action Buttons: New Note & Add Resource */}
        <div className="notes-toolbar-actions">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Icon name="link" size={15} />}
            onClick={onOpenCreateResource}
          >
            Add Resource
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Icon name="plus" size={15} />}
            onClick={onOpenCreateNote}
          >
            New Note
          </Button>
        </div>
      </div>

      {/* Secondary Row: Dropdown Filters */}
      <div className="notes-filters-row">
        {/* Subject Filter */}
        <div className="notes-filter-group">
          <label htmlFor="notes-subject-filter" className="notes-filter-label">
            Subject
          </label>
          <select
            id="notes-subject-filter"
            className="app-select"
            value={subject}
            onChange={(e) => onFilterChange('subject', e.target.value)}
          >
            <option value="all">All Subjects</option>
            {EXTENDED_SUBJECTS.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter (Only active when not strictly viewing notes) */}
        {viewTab !== 'notes' && (
          <div className="notes-filter-group">
            <label htmlFor="notes-resourcetype-filter" className="notes-filter-label">
              Resource Type
            </label>
            <select
              id="notes-resourcetype-filter"
              className="app-select"
              value={resourceType}
              onChange={(e) => onFilterChange('resourceType', e.target.value)}
            >
              <option value="all">All Types</option>
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tag Filter */}
        <div className="notes-filter-group">
          <label htmlFor="notes-tag-filter" className="notes-filter-label">
            Tag
          </label>
          <select
            id="notes-tag-filter"
            className="app-select"
            value={tag}
            onChange={(e) => onFilterChange('tag', e.target.value)}
          >
            <option value="all">All Tags</option>
            {uniqueTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="notes-filter-group">
          <label htmlFor="notes-sort-filter" className="notes-filter-label">
            Sort Order
          </label>
          <select
            id="notes-sort-filter"
            className="app-select"
            value={sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="updatedAtDesc">Recently Updated</option>
            <option value="createdAtDesc">Newest Created</option>
            <option value="titleAsc">Title (A – Z)</option>
            <option value="subjectAsc">By Subject</option>
          </select>
        </div>
      </div>

      {/* Active Filters Summary Bar */}
      {isFiltered && (
        <div className="notes-active-filters-bar">
          <div className="notes-active-tags">
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-text-subtle)' }}>
              Active Filters:
            </span>
            {search.trim() && (
              <span className="notes-active-tag">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => onFilterChange('search', '')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  aria-label="Remove search filter"
                >
                  ×
                </button>
              </span>
            )}
            {subject !== 'all' && (
              <span className="notes-active-tag">
                Subject: {EXTENDED_SUBJECTS.find((s) => s.id === subject)?.shortName || subject}
                <button
                  type="button"
                  onClick={() => onFilterChange('subject', 'all')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  aria-label="Remove subject filter"
                >
                  ×
                </button>
              </span>
            )}
            {resourceType !== 'all' && (
              <span className="notes-active-tag">
                Type: {resourceType}
                <button
                  type="button"
                  onClick={() => onFilterChange('resourceType', 'all')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  aria-label="Remove resource type filter"
                >
                  ×
                </button>
              </span>
            )}
            {tag !== 'all' && (
              <span className="notes-active-tag">
                Tag: #{tag}
                <button
                  type="button"
                  onClick={() => onFilterChange('tag', 'all')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  aria-label="Remove tag filter"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'updatedAtDesc' && (
              <span className="notes-active-tag">
                Sorted: {sortBy === 'titleAsc' ? 'A-Z' : sortBy === 'createdAtDesc' ? 'Newest' : 'Subject'}
              </span>
            )}
          </div>

          <button
            type="button"
            className="notes-clear-filters-btn"
            onClick={onClearFilters}
          >
            <Icon name="x" size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default NotesToolbar;
