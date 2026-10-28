/**
 * Preparation Tracker Data Architecture & Calculation Utilities
 * 
 * NOTE: This module provides structured temporary sample data and pure calculation
 * functions for Phase 4. It maintains compatibility with the Phase 3 dashboard
 * subjects and data models, preparing for MongoDB persistence in later phases.
 */

import { PREPARATION_SUBJECTS } from './dashboardData.js';

export { PREPARATION_SUBJECTS };

export const DIFFICULTY_CONFIG = {
  easy: {
    key: 'easy',
    label: 'Easy',
    variant: 'success',
    color: '#10b981'
  },
  medium: {
    key: 'medium',
    label: 'Medium',
    variant: 'warning',
    color: '#f59e0b'
  },
  hard: {
    key: 'hard',
    label: 'Hard',
    variant: 'error',
    color: '#ef4444'
  }
};

export const PRIORITY_CONFIG = {
  high: {
    key: 'high',
    label: 'High Priority',
    shortLabel: 'High',
    variant: 'error',
    color: '#ef4444'
  },
  medium: {
    key: 'medium',
    label: 'Medium Priority',
    shortLabel: 'Medium',
    variant: 'warning',
    color: '#f59e0b'
  },
  low: {
    key: 'low',
    label: 'Low Priority',
    shortLabel: 'Low',
    variant: 'neutral',
    color: '#94a3b8'
  }
};

// Helper: Get today's ISO date string (YYYY-MM-DD)
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Get relative date string offset by days
export function getOffsetDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Determine if a due date is past today
export function isTaskOverdue(dueDate) {
  if (!dueDate) return false;
  const today = getTodayDateString();
  // String comparison YYYY-MM-DD works cleanly lexicographically
  return dueDate < today;
}

// Format date for display (e.g., "Oct 28, 2026", "Today", "Tomorrow", "Overdue")
export function formatDueDate(dueDate) {
  if (!dueDate) return 'No deadline';
  const today = getTodayDateString();
  const tomorrow = getOffsetDateString(1);
  const yesterday = getOffsetDateString(-1);

  if (dueDate === today) return 'Today';
  if (dueDate === tomorrow) return 'Tomorrow';
  if (dueDate === yesterday) return 'Yesterday';

  try {
    const parts = dueDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: year !== new Date().getFullYear() ? 'numeric' : undefined
      });
    }
  } catch {
    // Fall back to original string
  }
  return dueDate;
}

// Seed Preparation Tasks for Phase 4
export const INITIAL_TRACKER_TASKS = [
  {
    id: 'task-1',
    title: 'Implement LRU Cache & analyze O(1) eviction policy',
    subjectId: 'dsa',
    topic: 'Doubly Linked List & Hash Map',
    description: 'Design and build a data structure adhering to the Least Recently Used (LRU) cache constraint with get and put in O(1) time complexity.',
    difficulty: 'medium',
    priority: 'high',
    dueDate: getTodayDateString(),
    estimatedMinutes: 45,
    completed: true,
    status: 'completed',
    createdAt: '2026-10-25T10:00:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Review ACID transactions vs BASE & 2-Phase Locking',
    subjectId: 'dbms',
    topic: 'Transactions & Concurrency',
    description: 'Deep dive into Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and anomalous reads (Dirty, Non-repeatable, Phantom).',
    difficulty: 'medium',
    priority: 'high',
    dueDate: getTodayDateString(),
    estimatedMinutes: 60,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-25T11:30:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Analyze Process Scheduling algorithms & Virtual Memory paging',
    subjectId: 'os',
    topic: 'Memory Management & CPU Scheduling',
    description: 'Understand TLB hit/miss penalties, multi-level page tables, and demand paging page fault handling routine.',
    difficulty: 'hard',
    priority: 'medium',
    dueDate: getOffsetDateString(-1), // Intentionally overdue for testing
    estimatedMinutes: 50,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-24T09:00:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Explain TCP 3-Way Handshake vs UDP connectionless flow',
    subjectId: 'cn',
    topic: 'Transport Layer Protocols',
    description: 'Compare SYN, SYN-ACK, ACK sequence, sliding window flow control, congestion collapse avoidance, and TLS 1.3 resumption.',
    difficulty: 'easy',
    priority: 'medium',
    dueDate: getOffsetDateString(1),
    estimatedMinutes: 30,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-26T14:00:00.000Z'
  },
  {
    id: 'task-5',
    title: 'Design Parking Lot using SOLID principles & Factory pattern',
    subjectId: 'oop',
    topic: 'Low-Level System Design (LLD)',
    description: 'Structure classes for Vehicle, Spot, ParkingFloor, Ticket, and Payment. Implement Strategy pattern for fee calculation.',
    difficulty: 'medium',
    priority: 'high',
    dueDate: getOffsetDateString(1),
    estimatedMinutes: 90,
    completed: true,
    status: 'completed',
    createdAt: '2026-10-26T16:30:00.000Z'
  },
  {
    id: 'task-6',
    title: 'Solve Binary Tree Maximum Path Sum (LeetCode #124)',
    subjectId: 'dsa',
    topic: 'Binary Trees & Post-order DFS',
    description: 'Calculate max gain per subtree, tracking global diameter variable across both left and right splits.',
    difficulty: 'hard',
    priority: 'high',
    dueDate: getOffsetDateString(2),
    estimatedMinutes: 60,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-27T08:15:00.000Z'
  },
  {
    id: 'task-7',
    title: 'Review Database Indexing: B+ Trees vs Hash Index trade-offs',
    subjectId: 'dbms',
    topic: 'Storage Engines & Indexing',
    description: 'Explain why B+ Trees are preferred for range queries and scan performance over pure Hash tables and LSM Trees.',
    difficulty: 'medium',
    priority: 'low',
    dueDate: getOffsetDateString(3),
    estimatedMinutes: 35,
    completed: true,
    status: 'completed',
    createdAt: '2026-10-27T10:00:00.000Z'
  },
  {
    id: 'task-8',
    title: 'Compare Thread synchronization primitives: Mutex vs Semaphore',
    subjectId: 'os',
    topic: 'Concurrency & Deadlocks',
    description: 'Explore counting vs binary semaphores, priority inversion with priority inheritance protocols, and Coffman deadlock conditions.',
    difficulty: 'medium',
    priority: 'medium',
    dueDate: getOffsetDateString(4),
    estimatedMinutes: 45,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-27T12:00:00.000Z'
  },
  {
    id: 'task-9',
    title: 'Solve Word Break II with Memoized DFS & Trie',
    subjectId: 'dsa',
    topic: 'Dynamic Programming & Strings',
    description: 'Return all possible valid sentence combinations given a string s and a dictionary of strings wordDict.',
    difficulty: 'hard',
    priority: 'high',
    dueDate: getOffsetDateString(5),
    estimatedMinutes: 75,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-28T11:00:00.000Z'
  },
  {
    id: 'task-10',
    title: 'Examine DNS Resolution Flow: Root, TLD & Authoritative servers',
    subjectId: 'cn',
    topic: 'Application Layer & DNS',
    description: 'Trace recursive vs iterative resolver queries, DNS caching TTLs, Anycast routing, and DNS over HTTPS (DoH).',
    difficulty: 'easy',
    priority: 'low',
    dueDate: getOffsetDateString(6),
    estimatedMinutes: 30,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-28T13:00:00.000Z'
  },
  {
    id: 'task-11',
    title: 'Design Rate Limiter with Sliding Window Counter',
    subjectId: 'oop',
    topic: 'Low-Level System Design (LLD)',
    description: 'Implement Token Bucket and Sliding Window algorithms in code, accounting for multithreaded synchronization locks.',
    difficulty: 'hard',
    priority: 'high',
    dueDate: getOffsetDateString(7),
    estimatedMinutes: 80,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-28T14:30:00.000Z'
  },
  {
    id: 'task-12',
    title: 'Analyze Database Sharding: Consistent Hashing & Rebalancing',
    subjectId: 'dbms',
    topic: 'Distributed Data Systems',
    description: 'Virtual nodes in consistent hashing rings, write amplification during resharding, and cross-shard join limitations.',
    difficulty: 'hard',
    priority: 'medium',
    dueDate: getOffsetDateString(8),
    estimatedMinutes: 60,
    completed: false,
    status: 'pending',
    createdAt: '2026-10-28T15:00:00.000Z'
  }
];

/**
 * Calculates preparation tracker summary metrics derived from the active task list.
 * Safe for zero tasks.
 */
export function calculateTrackerMetrics(tasks = []) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter((t) => !t.completed && isTaskOverdue(t.dueDate)).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionPercentage
  };
}

/**
 * Filter and sort preparation tasks based on active user query criteria.
 */
export function filterAndSortTasks(tasks = [], filters = {}) {
  const {
    search = '',
    subject = 'all',
    status = 'all',
    priority = 'all',
    difficulty = 'all',
    sortBy = 'dueDateAsc'
  } = filters;

  const searchTrimmed = search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    // 1. Search filter across title, topic, and description
    if (searchTrimmed) {
      const matchTitle = task.title?.toLowerCase().includes(searchTrimmed);
      const matchTopic = task.topic?.toLowerCase().includes(searchTrimmed);
      const matchDesc = task.description?.toLowerCase().includes(searchTrimmed);
      if (!matchTitle && !matchTopic && !matchDesc) {
        return false;
      }
    }

    // 2. Subject filter
    if (subject !== 'all' && task.subjectId !== subject) {
      return false;
    }

    // 3. Status filter ('all', 'pending', 'completed', 'overdue')
    if (status === 'completed' && !task.completed) {
      return false;
    }
    if (status === 'pending' && task.completed) {
      return false;
    }
    if (status === 'overdue') {
      if (task.completed || !isTaskOverdue(task.dueDate)) {
        return false;
      }
    }

    // 4. Priority filter ('all', 'high', 'medium', 'low')
    if (priority !== 'all' && task.priority !== priority) {
      return false;
    }

    // 5. Difficulty filter ('all', 'easy', 'medium', 'hard')
    if (difficulty !== 'all' && task.difficulty !== difficulty) {
      return false;
    }

    return true;
  });

  // Sorting
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const difficultyWeight = { hard: 3, medium: 2, easy: 1 };

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'dueDateAsc': {
        const dateA = a.dueDate || '9999-99-99';
        const dateB = b.dueDate || '9999-99-99';
        return dateA.localeCompare(dateB);
      }
      case 'dueDateDesc': {
        const dateA = a.dueDate || '0000-00-00';
        const dateB = b.dueDate || '0000-00-00';
        return dateB.localeCompare(dateA);
      }
      case 'priorityDesc': {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      }
      case 'difficultyDesc': {
        const diffA = difficultyWeight[a.difficulty] || 0;
        const diffB = difficultyWeight[b.difficulty] || 0;
        return diffB - diffA;
      }
      case 'difficultyAsc': {
        const diffA = difficultyWeight[a.difficulty] || 0;
        const diffB = difficultyWeight[b.difficulty] || 0;
        return diffA - diffB;
      }
      case 'recentlyCreated': {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      case 'titleAsc': {
        return (a.title || '').localeCompare(b.title || '');
      }
      default:
        return 0;
    }
  });
}
