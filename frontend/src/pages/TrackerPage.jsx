import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import Icon from '../components/Icon';

// Tracker Modular Components
import TrackerStats from '../components/tracker/TrackerStats';
import TrackerFilters from '../components/tracker/TrackerFilters';
import TaskCard from '../components/tracker/TaskCard';
import TaskFormModal from '../components/tracker/TaskFormModal';
import TaskDetailModal from '../components/tracker/TaskDetailModal';
import DeleteConfirmModal from '../components/tracker/DeleteConfirmModal';

// Data Architecture & Calculation Utilities
import {
  PREPARATION_SUBJECTS,
  calculateTrackerMetrics,
  filterAndSortTasks
} from '../utils/trackerData';

// API Service
import taskService from '../services/taskService';

export function TrackerPage() {
  // Live MongoDB state for preparation tasks
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    status: 'all',
    priority: 'all',
    difficulty: 'all',
    sortBy: 'dueDateAsc'
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Transient feedback banner
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Fetch preparation tasks from MongoDB
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || 'Failed to load preparation tasks from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Derived calculation: Summary Metrics
  const metrics = useMemo(() => {
    return calculateTrackerMetrics(tasks);
  }, [tasks]);

  // Derived calculation: Task counts by subject for filter pills
  const taskCountsBySubject = useMemo(() => {
    const counts = {};
    PREPARATION_SUBJECTS.forEach((subj) => {
      counts[subj.id] = tasks.filter((t) => t.subjectId === subj.id).length;
    });
    return counts;
  }, [tasks]);

  // Derived calculation: Filtered and Sorted Tasks
  const displayedTasks = useMemo(() => {
    return filterAndSortTasks(tasks, filters);
  }, [tasks, filters]);

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
      subject: 'all',
      status: 'all',
      priority: 'all',
      difficulty: 'all',
      sortBy: 'dueDateAsc'
    });
  };

  // Task operations with backend persistence
  const handleToggleComplete = async (taskId) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    const targetCompleted = !currentTask.completed;

    try {
      const updated = await taskService.toggleComplete(taskId, targetCompleted);

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? updated : t))
      );

      setSelectedTaskForDetail((current) =>
        current && current.id === taskId ? updated : current
      );

      showFeedback(
        targetCompleted
          ? `Completed: "${updated.title}"`
          : `Marked pending: "${updated.title}"`
      );
    } catch (err) {
      showFeedback(`Failed to update status: ${err.message}`, 'error');
    }
  };

  const handleSaveTask = async (taskPayload) => {
    try {
      if (taskPayload.id) {
        // Update existing task in MongoDB
        const updated = await taskService.updateTask(taskPayload.id, taskPayload);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskPayload.id ? updated : t))
        );
        setSelectedTaskForDetail((current) =>
          current && current.id === taskPayload.id ? updated : current
        );
        showFeedback(`Updated: "${updated.title}"`);
      } else {
        // Create new task in MongoDB
        const created = await taskService.createTask(taskPayload);
        setTasks((prevTasks) => [created, ...prevTasks]);
        showFeedback(`Added new task: "${created.title}"`);
      }
      setTaskToEdit(null);
      setIsFormOpen(false);
    } catch (err) {
      showFeedback(`Failed to save task: ${err.message}`, 'error');
    }
  };

  const handleDeleteTaskConfirm = async (taskId) => {
    const taskToRemove = tasks.find((t) => t.id === taskId);
    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
      if (selectedTaskForDetail?.id === taskId) {
        setSelectedTaskForDetail(null);
      }
      setTaskToDelete(null);
      showFeedback(
        taskToRemove ? `Deleted task: "${taskToRemove.title}"` : 'Task deleted successfully.'
      );
    } catch (err) {
      showFeedback(`Failed to delete task: ${err.message}`, 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const isFiltersActive = Boolean(
    filters.search.trim() ||
    filters.subject !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.sortBy !== 'dueDateAsc'
  );

  return (
    <div className="tracker-container">
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
            aria-label="Dismiss message"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* A. Page Header */}
      <SectionHeading
        title="Preparation Tracker"
        subtitle="Manage and organize your technical interview topics, LeetCode algorithms, core CS subjects, and system design problems."
        badge={
          <Badge variant="primary" dot>
            Live Database
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            leftIcon={<Icon name="plus" size={16} />}
            onClick={handleOpenCreateModal}
          >
            Add Preparation Task
          </Button>
        }
      />

      {/* B. Overview Statistics */}
      <TrackerStats metrics={metrics} />

      {/* C & D. Search, Filter, and Sort Toolbar */}
      <TrackerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        taskCountsBySubject={taskCountsBySubject}
        totalTasksCount={tasks.length}
      />

      {/* E. Task List Section with Loading and Error Handling */}
      <section aria-label="Preparation Tasks">
        {isLoading ? (
          <div style={{ padding: 'var(--space-12) 0' }}>
            <LoadingIndicator size="lg" text="Loading preparation tasks from MongoDB..." />
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
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Unable to Load Preparation Tasks</h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '460px' }}>
              {loadError}
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Icon name="spinner" size={14} />}
              onClick={fetchTasks}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Retry Connection
            </Button>
          </div>
        ) : displayedTasks.length === 0 ? (
          tasks.length === 0 ? (
            <EmptyState
              icon="tracker"
              title="No preparation tasks in database"
              description="Your MongoDB preparationtasks collection is currently empty. Get started by creating your first technical interview task."
              action={
                <Button
                  variant="primary"
                  leftIcon={<Icon name="plus" size={16} />}
                  onClick={handleOpenCreateModal}
                >
                  Create First Task
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon="search"
              title="No tasks match your filters"
              description="Try adjusting your search query, subject filter, or status criteria to see more tasks."
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
          <div className="tracker-task-list" role="list">
            {displayedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onViewDetails={(t) => setSelectedTaskForDetail(t)}
                onEditTask={(t) => handleOpenEditModal(t)}
                onDeleteTask={(t) => setTaskToDelete(t)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Task Creation & Editing Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTaskToEdit(null);
        }}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        task={selectedTaskForDetail}
        onToggleComplete={handleToggleComplete}
        onOpenEdit={(t) => {
          setSelectedTaskForDetail(null);
          handleOpenEditModal(t);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
        onConfirmDelete={handleDeleteTaskConfirm}
      />
    </div>
  );
}

export default TrackerPage;
