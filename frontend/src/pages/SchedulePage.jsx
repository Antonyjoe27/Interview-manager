import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import Icon from '../components/Icon';

// Schedule Modular Components
import ScheduleStats from '../components/schedule/ScheduleStats';
import ScheduleToolbar from '../components/schedule/ScheduleToolbar';
import CalendarView from '../components/schedule/CalendarView';
import AgendaView from '../components/schedule/AgendaView';
import InterviewFormModal from '../components/schedule/InterviewFormModal';
import InterviewDetailModal from '../components/schedule/InterviewDetailModal';
import DeleteInterviewConfirmModal from '../components/schedule/DeleteInterviewConfirmModal';

// Utilities & Calculations
import {
  calculateScheduleMetrics,
  filterAndSortInterviews,
  getTodayDateString
} from '../utils/scheduleData';

// API Service
import interviewService from '../services/interviewService';

export function SchedulePage() {
  // Live MongoDB state for interviews
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // View mode: 'calendar' | 'agenda'
  const [viewMode, setViewMode] = useState('calendar');

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    stage: 'all',
    format: 'all',
    timeframe: 'all',
    sortBy: 'dateAsc'
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState(null);
  const [initialDateForCreate, setInitialDateForCreate] = useState('');

  const [selectedInterviewForDetail, setSelectedInterviewForDetail] = useState(null);
  const [interviewToDelete, setInterviewToDelete] = useState(null);

  // Transient feedback toast
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Fetch interviews from MongoDB
  const fetchInterviews = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await interviewService.getInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || 'Failed to load interviews from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Derived calculation: Summary Metrics
  const metrics = useMemo(() => {
    return calculateScheduleMetrics(interviews);
  }, [interviews]);

  // Derived calculation: Filtered & Sorted Interviews
  const displayedInterviews = useMemo(() => {
    return filterAndSortInterviews(interviews, filters);
  }, [interviews, filters]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      stage: 'all',
      format: 'all',
      timeframe: 'all',
      sortBy: 'dateAsc'
    });
  };

  // Interview Operations with backend persistence
  const handleSaveInterview = async (interviewPayload) => {
    try {
      if (interviewPayload.id) {
        // Update existing interview in MongoDB
        const updated = await interviewService.updateInterview(interviewPayload.id, interviewPayload);
        setInterviews((prev) =>
          prev.map((item) => (item.id === interviewPayload.id ? updated : item))
        );
        setSelectedInterviewForDetail((current) =>
          current && current.id === interviewPayload.id ? updated : current
        );
        showFeedback(`Updated interview: ${updated.company} (${updated.stage})`);
      } else {
        // Schedule new interview in MongoDB
        const created = await interviewService.createInterview(interviewPayload);
        setInterviews((prev) => [created, ...prev]);
        showFeedback(`Scheduled new interview with ${created.company}`);
      }
      setInterviewToEdit(null);
      setInitialDateForCreate('');
      setIsFormOpen(false);
    } catch (err) {
      showFeedback(`Failed to save interview: ${err.message}`, 'error');
    }
  };

  const handleDeleteConfirm = async (interviewId) => {
    const itemToRemove = interviews.find((i) => i.id === interviewId);
    try {
      await interviewService.deleteInterview(interviewId);
      setInterviews((prev) => prev.filter((i) => i.id !== interviewId));
      if (selectedInterviewForDetail?.id === interviewId) {
        setSelectedInterviewForDetail(null);
      }
      setInterviewToDelete(null);
      showFeedback(
        itemToRemove
          ? `Removed interview with ${itemToRemove.company}`
          : 'Interview deleted successfully.'
      );
    } catch (err) {
      showFeedback(`Failed to delete interview: ${err.message}`, 'error');
    }
  };

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      const updated = await interviewService.updateInterview(interviewId, { status: newStatus });
      setInterviews((prev) =>
        prev.map((item) => (item.id === interviewId ? updated : item))
      );
      setSelectedInterviewForDetail((current) =>
        current && current.id === interviewId ? updated : current
      );
      showFeedback(`Status updated to "${newStatus}" for ${updated.company}`);
    } catch (err) {
      showFeedback(`Failed to update status: ${err.message}`, 'error');
    }
  };

  const handleOpenCreateModal = (targetDate = '') => {
    setInterviewToEdit(null);
    setInitialDateForCreate(targetDate || getTodayDateString());
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (interview) => {
    setInterviewToEdit(interview);
    setInitialDateForCreate('');
    setIsFormOpen(true);
  };

  const isFiltersActive = Boolean(
    filters.search.trim() ||
    filters.status !== 'all' ||
    filters.stage !== 'all' ||
    filters.format !== 'all' ||
    filters.timeframe !== 'all' ||
    filters.sortBy !== 'dateAsc'
  );

  return (
    <div className="schedule-container">
      {/* Transient Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: feedback.type === 'error' ? '1px solid var(--color-error)' : '1px solid var(--color-primary-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-sm)',
            boxShadow: 'var(--shadow-md)',
            animation: 'app-fade-in var(--transition-fast) ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: feedback.type === 'error' ? 'var(--color-error)' : 'var(--color-primary)' }}>
              <Icon name={feedback.type === 'error' ? 'alert' : 'check'} size={16} />
            </span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{
              color: 'var(--color-text-subtle)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex'
            }}
            aria-label="Dismiss feedback"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <SectionHeading
        title="Interview Schedule"
        subtitle="Manage and synchronize your upcoming technical rounds, coding screens, system design interviews, and hiring manager discussions."
        badge={
          <Badge variant="primary" dot>
            Live Database
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            leftIcon={<Icon name="plus" size={16} />}
            onClick={() => handleOpenCreateModal()}
          >
            Schedule Interview
          </Button>
        }
      />

      {/* Summary Statistics */}
      <ScheduleStats metrics={metrics} />

      {/* Toolbar: View Switcher, Search, and Filters */}
      <ScheduleToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* Main View Area with Loading, Error, and Empty States */}
      <section aria-label="Interview Schedule Views">
        {isLoading ? (
          <div style={{ padding: 'var(--space-12) 0' }}>
            <LoadingIndicator size="lg" text="Loading interviews from MongoDB..." />
          </div>
        ) : loadError ? (
          <div
            className="app-card"
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}
          >
            <Icon name="alert" size={32} color="var(--color-error)" />
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Unable to Load Interview Schedule</h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '460px' }}>
              {loadError}
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Icon name="spinner" size={14} />}
              onClick={fetchInterviews}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Retry Connection
            </Button>
          </div>
        ) : displayedInterviews.length === 0 && viewMode === 'agenda' ? (
          interviews.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No interviews scheduled in database"
              description="Your MongoDB interviews collection is currently empty. Record your first recruiter screen or technical round."
              action={
                <Button
                  variant="primary"
                  leftIcon={<Icon name="plus" size={16} />}
                  onClick={() => handleOpenCreateModal()}
                >
                  Schedule Your First Interview
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon="search"
              title="No interviews match your filters"
              description="Try adjusting your search criteria, interview stage, or timeframe to see scheduled rounds."
              action={
                isFiltersActive && (
                  <Button
                    variant="secondary"
                    leftIcon={<Icon name="x" size={14} />}
                    onClick={handleClearFilters}
                  >
                    Reset All Filters
                  </Button>
                )
              }
            />
          )
        ) : (
          <>
            {viewMode === 'calendar' ? (
              <CalendarView
                interviews={interviews}
                onSelectInterview={(item) => setSelectedInterviewForDetail(item)}
                onAddInterviewOnDate={(dateStr) => handleOpenCreateModal(dateStr)}
              />
            ) : (
              <AgendaView
                interviews={displayedInterviews}
                onViewDetails={(item) => setSelectedInterviewForDetail(item)}
                onEdit={(item) => handleOpenEditModal(item)}
                onDelete={(item) => setInterviewToDelete(item)}
                onStatusChange={handleStatusChange}
              />
            )}
          </>
        )}
      </section>

      {/* Interview Scheduling / Edit Modal */}
      <InterviewFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setInterviewToEdit(null);
          setInitialDateForCreate('');
        }}
        onSaveInterview={handleSaveInterview}
        interviewToEdit={interviewToEdit}
        initialDate={initialDateForCreate}
      />

      {/* Interview Detail Modal */}
      <InterviewDetailModal
        isOpen={Boolean(selectedInterviewForDetail)}
        onClose={() => setSelectedInterviewForDetail(null)}
        interview={selectedInterviewForDetail}
        onEdit={(item) => {
          setSelectedInterviewForDetail(null);
          handleOpenEditModal(item);
        }}
        onDelete={(item) => {
          setSelectedInterviewForDetail(null);
          setInterviewToDelete(item);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteInterviewConfirmModal
        isOpen={Boolean(interviewToDelete)}
        onClose={() => setInterviewToDelete(null)}
        interview={interviewToDelete}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
}

export default SchedulePage;
