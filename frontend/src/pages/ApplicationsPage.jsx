import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import Icon from '../components/Icon';

// Modular Applications Components
import ApplicationStats from '../components/applications/ApplicationStats';
import ApplicationToolbar from '../components/applications/ApplicationToolbar';
import KanbanView from '../components/applications/KanbanView';
import TableView from '../components/applications/TableView';
import ApplicationFormModal from '../components/applications/ApplicationFormModal';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import DeleteApplicationConfirmModal from '../components/applications/DeleteApplicationConfirmModal';

// Utilities & Calculations
import {
  calculateApplicationMetrics,
  filterAndSortApplications
} from '../utils/applicationData';

// API Service
import applicationService from '../services/applicationService';

export function ApplicationsPage() {
  // Live MongoDB applications dataset state
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Active view: 'kanban' | 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    workMode: 'all',
    jobType: 'all',
    timeframe: 'all',
    sortBy: 'applicationDateDesc'
  });

  // Modal interaction states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [applicationToEdit, setApplicationToEdit] = useState(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState(null);
  const [appToDelete, setAppToDelete] = useState(null);

  // Transient feedback banner
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Fetch applications from MongoDB
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await applicationService.getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || 'Failed to load job applications from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Derived metrics calculation
  const metrics = useMemo(() => {
    return calculateApplicationMetrics(applications);
  }, [applications]);

  // Derived filtered & sorted applications
  const displayedApplications = useMemo(() => {
    return filterAndSortApplications(applications, filters);
  }, [applications, filters]);

  // Filter actions
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
      workMode: 'all',
      jobType: 'all',
      timeframe: 'all',
      sortBy: 'applicationDateDesc'
    });
  };

  // CRUD Operations with backend persistence
  const handleOpenCreateModal = () => {
    setApplicationToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setApplicationToEdit(app);
    setIsFormOpen(true);
  };

  const handleSaveApplication = async (formData) => {
    try {
      if (formData.id) {
        // Edit existing application in MongoDB
        const updated = await applicationService.updateApplication(formData.id, formData);
        setApplications((prev) =>
          prev.map((app) => (app.id === formData.id ? updated : app))
        );
        setSelectedAppForDetail((prev) =>
          prev && prev.id === formData.id ? updated : prev
        );
        showFeedback(`Updated application for ${updated.company}.`);
      } else {
        // Create new application in MongoDB
        const created = await applicationService.createApplication(formData);
        setApplications((prev) => [created, ...prev]);
        showFeedback(`Added ${created.company} (${created.role}) to your pipeline.`);
      }
      setIsFormOpen(false);
      setApplicationToEdit(null);
    } catch (err) {
      showFeedback(`Failed to save application: ${err.message}`, 'error');
    }
  };

  const handleDeleteApplication = async (appId) => {
    const target = applications.find((a) => a.id === appId);
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      if (selectedAppForDetail?.id === appId) {
        setSelectedAppForDetail(null);
      }
      setAppToDelete(null);
      showFeedback(
        target ? `Removed ${target.company} from applications.` : 'Application deleted.'
      );
    } catch (err) {
      showFeedback(`Failed to delete application: ${err.message}`, 'error');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const target = applications.find((a) => a.id === appId);
    try {
      const updated = await applicationService.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? updated : app))
      );
      setSelectedAppForDetail((prev) =>
        prev && prev.id === appId ? updated : prev
      );
      showFeedback(`Updated ${updated.company} status to ${newStatus}.`);
    } catch (err) {
      showFeedback(
        `Failed to move ${target?.company || 'application'} to ${newStatus}: ${err.message}`,
        'error'
      );
    }
  };

  const isFiltersActive = Boolean(
    filters.search.trim() ||
    filters.status !== 'all' ||
    filters.workMode !== 'all' ||
    filters.jobType !== 'all' ||
    filters.timeframe !== 'all' ||
    filters.sortBy !== 'applicationDateDesc'
  );

  return (
    <div className="page-wrapper applications-container">
      {/* Transient Action Feedback Toast */}
      {feedback && (
        <div
          className="applications-feedback-toast"
          role="status"
          aria-live="polite"
          style={{
            border: feedback.type === 'error' ? '1px solid var(--color-error)' : '1px solid var(--color-border-strong)'
          }}
        >
          <Icon
            name={feedback.type === 'error' ? 'alert' : 'checkCircle'}
            size={16}
            color={feedback.type === 'error' ? 'var(--color-error)' : 'var(--color-primary)'}
          />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Page Header */}
      <SectionHeading
        title="Job Applications"
        subtitle="Manage recruitment pipelines, monitor interview progression, schedule recruiter follow-ups, and track offers."
        badge={
          <Badge variant="primary" size="sm">
            Live Database: {metrics.inProgressApplications} Active
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            leftIcon={<Icon name="plus" size={16} />}
            onClick={handleOpenCreateModal}
          >
            New Application
          </Button>
        }
      />

      {/* Summary Statistics Cards */}
      <ApplicationStats metrics={metrics} />

      {/* Toolbar: Views, Search, Filter Dropdowns, Active Filter Tags */}
      <ApplicationToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Active Pipeline View: Kanban Board or Table with Loading and Error */}
      {isLoading ? (
        <div style={{ padding: 'var(--space-12) 0' }}>
          <LoadingIndicator size="lg" text="Loading applications pipeline from MongoDB..." />
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
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Unable to Load Job Applications</h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '460px' }}>
            {loadError}
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Icon name="spinner" size={14} />}
            onClick={fetchApplications}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Retry Connection
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon="briefcase"
          title="No job applications in database"
          description="Your MongoDB jobapplications collection is currently empty. Start tracking your target companies and roles."
          action={
            <Button
              variant="primary"
              leftIcon={<Icon name="plus" size={16} />}
              onClick={handleOpenCreateModal}
            >
              Add First Application
            </Button>
          }
        />
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <KanbanView
              applications={displayedApplications}
              onViewDetails={setSelectedAppForDetail}
              onEdit={handleOpenEditModal}
              onDelete={setAppToDelete}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TableView
              applications={displayedApplications}
              onViewDetails={setSelectedAppForDetail}
              onEdit={handleOpenEditModal}
              onDelete={setAppToDelete}
              onStatusChange={handleStatusChange}
              onResetFilters={isFiltersActive ? handleClearFilters : null}
            />
          )}
        </>
      )}

      {/* Modal: Create or Edit Application */}
      <ApplicationFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setApplicationToEdit(null);
        }}
        onSaveApplication={handleSaveApplication}
        applicationToEdit={applicationToEdit}
      />

      {/* Modal: View Full Details */}
      <ApplicationDetailModal
        isOpen={Boolean(selectedAppForDetail)}
        onClose={() => setSelectedAppForDetail(null)}
        application={selectedAppForDetail}
        onEdit={(app) => {
          setSelectedAppForDetail(null);
          handleOpenEditModal(app);
        }}
        onDelete={(app) => {
          setSelectedAppForDetail(null);
          setAppToDelete(app);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Modal: Delete Confirmation */}
      <DeleteApplicationConfirmModal
        isOpen={Boolean(appToDelete)}
        onClose={() => setAppToDelete(null)}
        onConfirm={handleDeleteApplication}
        application={appToDelete}
      />
    </div>
  );
}

export default ApplicationsPage;
