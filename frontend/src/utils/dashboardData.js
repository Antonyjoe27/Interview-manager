/**
 * Dashboard Data Architecture & Calculation Utilities
 * 
 * NOTE: This module provides temporary sample data and pure calculation functions
 * for Phase 3. It will be replaced by backend API endpoints and MongoDB persistence
 * in subsequent phases.
 */

// Core Preparation Subjects
export const PREPARATION_SUBJECTS = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    color: '#6366f1',
    icon: 'cpu'
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    color: '#06b6d4',
    icon: 'database'
  },
  {
    id: 'os',
    name: 'Operating Systems',
    shortName: 'OS',
    color: '#10b981',
    icon: 'layers'
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    shortName: 'Networks',
    color: '#f59e0b',
    icon: 'network'
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming & LLD',
    shortName: 'OOP / LLD',
    color: '#ec4899',
    icon: 'code'
  }
];

// Initial Preparation Tasks (Dynamic state source for Dashboard)
export const INITIAL_PREPARATION_TASKS = [
  {
    id: 'task-1',
    title: 'Implement LRU Cache & analyze O(1) eviction policy',
    subjectId: 'dsa',
    priority: 'high',
    dueTime: 'Today, 4:00 PM',
    completed: true,
    estimatedMinutes: 45
  },
  {
    id: 'task-2',
    title: 'Review ACID transactions vs BASE & 2-Phase Locking',
    subjectId: 'dbms',
    priority: 'high',
    dueTime: 'Today, 6:30 PM',
    completed: false,
    estimatedMinutes: 60
  },
  {
    id: 'task-3',
    title: 'Analyze Process Scheduling algorithms & Virtual Memory paging',
    subjectId: 'os',
    priority: 'medium',
    dueTime: 'Today, 8:00 PM',
    completed: false,
    estimatedMinutes: 40
  },
  {
    id: 'task-4',
    title: 'Explain TCP 3-Way Handshake vs UDP connectionless flow',
    subjectId: 'cn',
    priority: 'medium',
    dueTime: 'Tomorrow, 10:00 AM',
    completed: false,
    estimatedMinutes: 30
  },
  {
    id: 'task-5',
    title: 'Design Parking Lot using SOLID principles & Factory pattern',
    subjectId: 'oop',
    priority: 'high',
    dueTime: 'Tomorrow, 2:00 PM',
    completed: true,
    estimatedMinutes: 90
  },
  {
    id: 'task-6',
    title: 'Solve Binary Tree Maximum Path Sum (LeetCode #124)',
    subjectId: 'dsa',
    priority: 'high',
    dueTime: 'Tomorrow, 5:00 PM',
    completed: false,
    estimatedMinutes: 45
  },
  {
    id: 'task-7',
    title: 'Review Database Indexing: B+ Trees vs Hash Index trade-offs',
    subjectId: 'dbms',
    priority: 'low',
    dueTime: 'In 2 days',
    completed: true,
    estimatedMinutes: 35
  },
  {
    id: 'task-8',
    title: 'Compare Thread synchronization primitives: Mutex vs Semaphore',
    subjectId: 'os',
    priority: 'medium',
    dueTime: 'In 3 days',
    completed: false,
    estimatedMinutes: 50
  }
];

// Initial Upcoming Interviews
export const INITIAL_UPCOMING_INTERVIEWS = [
  {
    id: 'int-1',
    company: 'Stripe',
    role: 'Senior Software Engineer',
    stage: 'Round 3: System Design',
    date: 'Tomorrow',
    time: '2:30 PM EST',
    format: 'Virtual (Google Meet)',
    status: 'Confirmed',
    badgeVariant: 'success'
  },
  {
    id: 'int-2',
    company: 'Google',
    role: 'Software Engineer III (L5)',
    stage: 'Round 2: Distributed Data Structures',
    date: 'Friday, Nov 3',
    time: '11:00 AM EST',
    format: 'Virtual (Google Meet)',
    status: 'Scheduled',
    badgeVariant: 'primary'
  },
  {
    id: 'int-3',
    company: 'Datadog',
    role: 'Backend Platform Engineer',
    stage: 'Technical Screen: Concurrency & OS',
    date: 'Monday, Nov 6',
    time: '4:00 PM EST',
    format: 'CoderPad',
    status: 'Pending Prep',
    badgeVariant: 'warning'
  }
];

// Active Job Applications Pipeline Summary
export const INITIAL_APPLICATION_STATS = {
  activeCount: 14,
  inReview: 6,
  interviewsActive: 4,
  offers: 1
};

// Recent Preparation Activities
export const INITIAL_RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Solved "LRU Cache" in O(1) time complexity',
    category: 'DSA Practice',
    timestamp: '1 hour ago',
    type: 'solved',
    icon: 'check'
  },
  {
    id: 'act-2',
    title: 'Completed mock interview on Distributed Cache Design',
    category: 'Mock Interview',
    timestamp: '3 hours ago',
    type: 'interview',
    icon: 'calendar'
  },
  {
    id: 'act-3',
    title: 'Scheduled System Design round with Stripe',
    category: 'Schedule',
    timestamp: '5 hours ago',
    type: 'schedule',
    icon: 'briefcase'
  },
  {
    id: 'act-4',
    title: 'Reviewed B+ Tree vs LSM Trees in DBMS notes',
    category: 'Revision',
    timestamp: 'Yesterday',
    type: 'study',
    icon: 'notes'
  }
];

// Weekly Study Activity Distribution
export const WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 3.5, problemsSolved: 4 },
  { day: 'Tue', hours: 4.2, problemsSolved: 5 },
  { day: 'Wed', hours: 2.8, problemsSolved: 3 },
  { day: 'Thu', hours: 5.0, problemsSolved: 6 },
  { day: 'Fri', hours: 4.5, problemsSolved: 5 },
  { day: 'Sat', hours: 6.0, problemsSolved: 8 },
  { day: 'Sun', hours: 3.2, problemsSolved: 3 }
];

/**
 * Calculates top-level summary metrics derived from the task and interview lists.
 * Avoids division by zero and ensures consistency across the dashboard.
 */
export function calculateDashboardMetrics(tasks = [], interviews = [], applicationStats = INITIAL_APPLICATION_STATS) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const upcomingInterviewsCount = interviews.length;
  const activeApplicationsCount = applicationStats?.activeCount ?? 0;

  return {
    totalTasks,
    completedTasks,
    completionRate,
    upcomingInterviewsCount,
    activeApplicationsCount
  };
}

/**
 * Calculates subject-level completion progress derived from current tasks.
 * Safe for subjects with 0 tasks.
 */
export function calculateSubjectBreakdown(tasks = [], subjects = PREPARATION_SUBJECTS) {
  return subjects.map((subj) => {
    const subjectTasks = tasks.filter((t) => t.subjectId === subj.id);
    const total = subjectTasks.length;
    const completed = subjectTasks.filter((t) => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...subj,
      total,
      completed,
      percentage
    };
  });
}
