import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingIndicator } from '../components/LoadingIndicator';
import Icon from '../components/Icon';

// Dashboard Modular Components
import DashboardStats from '../components/dashboard/DashboardStats';
import PreparationProgress from '../components/dashboard/PreparationProgress';
import TodayPlan from '../components/dashboard/TodayPlan';
import UpcomingInterviewsCard from '../components/dashboard/UpcomingInterviewsCard';
import WeeklyActivityCard from '../components/dashboard/WeeklyActivityCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import AddTaskModal from '../components/dashboard/AddTaskModal';
import ScheduleInterviewModal from '../components/dashboard/ScheduleInterviewModal';

// Utilities & Calculations
import {
  calculateSubjectBreakdown
} from '../utils/dashboardData';

// API Services
import dashboardService from '../services/dashboardService';
import taskService from '../services/taskService';
import interviewService from '../services/interviewService';

export function DashboardPage() {
  // Live MongoDB data states
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Modal visibility states
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Temporary feedback toast state
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Fetch live dashboard metrics, tasks, and upcoming interviews from MongoDB
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [summaryData, tasksData, interviewsData] = await Promise.all([
        dashboardService.getSummary(),
        taskService.getTasks(),
        interviewService.getInterviews()
      ]);

      setSummary(summaryData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setInterviews(Array.isArray(interviewsData) ? interviewsData : []);

      // Build recent activity stream based on recent records
      const initialActivities = [];
      if (Array.isArray(interviewsData) && interviewsData.length > 0) {
        const latestInt = interviewsData[0];
        initialActivities.push({
          id: `act-int-${latestInt.id}`,
          title: `Interview scheduled with ${latestInt.company}`,
          category: latestInt.stage || 'Interview Scheduled',
          timestamp: 'Scheduled',
          type: 'schedule',
          icon: 'calendar'
        });
      }
      if (Array.isArray(tasksData) && tasksData.length > 0) {
        const completedTask = tasksData.find((t) => t.completed);
        if (completedTask) {
          initialActivities.push({
            id: `act-task-${completedTask.id}`,
            title: `Completed "${completedTask.title}"`,
            category: 'Task Completed',
            timestamp: 'Recently',
            type: 'solved',
            icon: 'check'
          });
        }
      }
      setActivities(initialActivities);

    } catch (err) {
      setLoadError(err.message || 'Failed to connect to backend API server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derive active upcoming interviews (excluding Completed & Cancelled)
  const activeUpcomingInterviews = useMemo(() => {
    return interviews.filter(
      (interview) => interview.status !== 'Completed' && interview.status !== 'Cancelled'
    );
  }, [interviews]);

  // Derive top-level summary metrics directly from database responses
  const metrics = useMemo(() => {
    const totalTasks = summary?.tasks?.total ?? tasks.length;
    const completedTasks = summary?.tasks?.completed ?? tasks.filter((t) => t.completed).length;
    const completionRate = summary?.tasks?.completionPercentage ?? (
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    );
    const upcomingInterviewsCount = summary?.interviews?.upcoming ?? activeUpcomingInterviews.length;
    const activeApplicationsCount = summary?.applications?.active ?? 0;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      upcomingInterviewsCount,
      activeApplicationsCount
    };
  }, [summary, tasks, activeUpcomingInterviews]);

  // Derive subject breakdown dynamically from live tasks
  const subjectsProgress = useMemo(() => {
    return calculateSubjectBreakdown(tasks);
  }, [tasks]);

  // Handle toggling task completion status with MongoDB persistence
  const handleToggleTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextCompleted = !task.completed;

    try {
      const updated = await taskService.toggleComplete(taskId, nextCompleted);

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? updated : t))
      );

      // Refresh summary metrics to update completion rates
      dashboardService.getSummary().then(setSummary).catch(() => {});

      if (updated.completed) {
        showFeedback(`Task completed: "${updated.title}"`);
        setActivities((prevActs) => [
          {
            id: `act-${Date.now()}`,
            title: `Completed "${updated.title}"`,
            category: 'Task Completed',
            timestamp: 'Just now',
            type: 'solved',
            icon: 'check'
          },
          ...prevActs.slice(0, 5)
        ]);
      } else {
        showFeedback(`Task marked pending: "${updated.title}"`);
      }
    } catch (err) {
      showFeedback(`Failed to update task: ${err.message}`);
    }
  };

  // Handle adding a new preparation task with MongoDB persistence
  const handleAddTask = async (newTaskData) => {
    try {
      const created = await taskService.createTask({
        title: newTaskData.title,
        subjectId: newTaskData.subjectId || 'dsa',
        priority: newTaskData.priority || 'medium',
        dueDate: newTaskData.dueTime || '',
        estimatedMinutes: newTaskData.estimatedMinutes || 45,
        completed: false
      });

      setTasks((prevTasks) => [created, ...prevTasks]);
      dashboardService.getSummary().then(setSummary).catch(() => {});

      showFeedback(`Task added: "${created.title}"`);
      setActivities((prevActs) => [
        {
          id: `act-${Date.now()}`,
          title: `Added preparation task "${created.title}"`,
          category: 'Task Created',
          timestamp: 'Just now',
          type: 'study',
          icon: 'plus'
        },
        ...prevActs.slice(0, 5)
      ]);
    } catch (err) {
      showFeedback(`Failed to create task: ${err.message}`);
    }
  };

  // Handle scheduling a new interview with MongoDB persistence
  const handleAddInterview = async (newInterviewData) => {
    try {
      const created = await interviewService.createInterview({
        company: newInterviewData.company,
        role: newInterviewData.role,
        stage: newInterviewData.stage || 'Technical Round 1',
        date: newInterviewData.date || new Date().toISOString().split('T')[0],
        time: newInterviewData.time || '14:00',
        format: ['Online', 'Phone', 'In-person'].includes(newInterviewData.format)
          ? newInterviewData.format
          : 'Online',
        status: newInterviewData.status || 'Scheduled'
      });

      setInterviews((prevInterviews) => [created, ...prevInterviews]);
      dashboardService.getSummary().then(setSummary).catch(() => {});

      showFeedback(`Interview scheduled with ${created.company}`);
      setActivities((prevActs) => [
        {
          id: `act-${Date.now()}`,
          title: `Scheduled ${created.stage} with ${created.company}`,
          category: 'Interview Scheduled',
          timestamp: 'Just now',
          type: 'schedule',
          icon: 'calendar'
        },
        ...prevActs.slice(0, 5)
      ]);
    } catch (err) {
      showFeedback(`Failed to schedule interview: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Feedback Notification Banner */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: '1px solid var(--color-primary-border)',
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
            <span style={{ color: 'var(--color-primary)' }}>
              <Icon name="check" size={16} />
            </span>
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
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

      {/* A. Page Header */}
      <SectionHeading
        title="Welcome back, Alex"
        subtitle="You are preparing for Senior Software Engineer interviews. Track technical problem velocity, core CS subject mastery, and upcoming interview rounds."
        badge={
          <Badge variant="primary" dot>
            Live Database
          </Badge>
        }
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<Icon name="calendar" size={16} />}
              onClick={() => setIsScheduleOpen(true)}
            >
              Schedule Interview
            </Button>
            <Button
              variant="primary"
              leftIcon={<Icon name="plus" size={16} />}
              onClick={() => setIsAddTaskOpen(true)}
            >
              Add Preparation Task
            </Button>
          </>
        }
      />

      {/* Loading & Error States */}
      {isLoading ? (
        <div style={{ padding: 'var(--space-12) 0' }}>
          <LoadingIndicator size="lg" text="Loading dashboard metrics and active schedule from MongoDB..." />
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
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Unable to Load Dashboard Data</h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '460px' }}>
            {loadError}
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Icon name="spinner" size={14} />}
            onClick={fetchDashboardData}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Retry Connection
          </Button>
        </div>
      ) : (
        <>
          {/* B. Summary Statistics Grid (Derived from Live Database) */}
          <DashboardStats metrics={metrics} />

          {/* Main 2-Column Content Grid */}
          <div className="dashboard-main-grid">
            {/* Left Column (Primary Focus: Tasks, Subjects, Weekly Activity) */}
            <div className="dashboard-col-main">
              {/* 1. Today's Preparation Plan */}
              <TodayPlan
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onOpenAddTask={() => setIsAddTaskOpen(true)}
              />

              {/* 2. Preparation Progress by Subject */}
              <PreparationProgress subjectsProgress={subjectsProgress} />

              {/* 3. Weekly Activity & Study Velocity */}
              <WeeklyActivityCard />
            </div>

            {/* Right Column (Secondary Focus: Interviews & Timeline) */}
            <div className="dashboard-col-side">
              {/* 4. Upcoming Interviews */}
              <UpcomingInterviewsCard
                interviews={activeUpcomingInterviews}
                onOpenScheduleModal={() => setIsScheduleOpen(true)}
              />

              {/* 5. Recent Activity Feed */}
              <RecentActivityCard activities={activities} />
            </div>
          </div>
        </>
      )}

      {/* Task Creation Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Interview Scheduling Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onScheduleInterview={handleAddInterview}
      />
    </div>
  );
}

export default DashboardPage;
