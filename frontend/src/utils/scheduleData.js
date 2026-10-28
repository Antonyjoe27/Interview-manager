/**
 * Interview Schedule Data Architecture & Calculation Utilities
 * 
 * NOTE: This module provides structured deterministic sample data, calendar
 * calculation helpers, and pure calculation functions for Phase 5.
 */

// Supported Interview Stages
export const INTERVIEW_STAGES = [
  'Online Assessment',
  'Technical Round 1',
  'Technical Round 2',
  'System Design',
  'HR Interview',
  'Final Round',
  'Other'
];

// Supported Interview Formats
export const INTERVIEW_FORMATS = [
  'Online',
  'Phone',
  'In-person'
];

// Supported Interview Statuses and their visual design system configurations
export const INTERVIEW_STATUS_CONFIG = {
  Scheduled: {
    key: 'Scheduled',
    label: 'Scheduled',
    variant: 'primary',
    color: '#6366f1'
  },
  Confirmed: {
    key: 'Confirmed',
    label: 'Confirmed',
    variant: 'success',
    color: '#10b981'
  },
  'Pending Preparation': {
    key: 'Pending Preparation',
    label: 'Pending Prep',
    variant: 'warning',
    color: '#f59e0b'
  },
  Completed: {
    key: 'Completed',
    label: 'Completed',
    variant: 'neutral',
    color: '#94a3b8'
  },
  Cancelled: {
    key: 'Cancelled',
    label: 'Cancelled',
    variant: 'error',
    color: '#ef4444'
  },
  Rescheduled: {
    key: 'Rescheduled',
    label: 'Rescheduled',
    variant: 'info',
    color: '#0ea5e9'
  }
};

export const INTERVIEW_STATUSES = Object.keys(INTERVIEW_STATUS_CONFIG);

// Date Helpers (Pure, Local Timezone Safe)
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateToday(dateStr) {
  return dateStr === getTodayDateString();
}

export function isDateFuture(dateStr) {
  return dateStr > getTodayDateString();
}

export function isDatePast(dateStr) {
  return dateStr < getTodayDateString();
}

// Convert "14:30" -> "2:30 PM", or pass through if already formatted
export function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].slice(0, 2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

// Human-friendly date display
export function formatInterviewDateDisplay(dateStr) {
  if (!dateStr) return '';
  const today = getTodayDateString();
  const tomorrow = getOffsetDateString(1);
  const yesterday = getOffsetDateString(-1);

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  if (dateStr === yesterday) return 'Yesterday';

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: year !== new Date().getFullYear() ? 'numeric' : undefined
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

// Format full Month & Year (e.g., "October 2026")
export function formatMonthYear(year, month) {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Validate URL syntax
export function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Initial Sample Interviews
export const INITIAL_INTERVIEWS = [
  {
    id: 'int-1',
    company: 'Stripe',
    role: 'Senior Software Engineer',
    stage: 'System Design',
    date: getOffsetDateString(1), // Tomorrow
    time: '14:30',
    durationMinutes: 60,
    format: 'Online',
    locationOrLink: 'https://meet.google.com/str-prep-eng',
    status: 'Confirmed',
    notes: 'Focus on distributed cache architecture, high availability, and idempotency guarantees.',
    createdAt: '2026-10-25T10:00:00.000Z'
  },
  {
    id: 'int-2',
    company: 'Google',
    role: 'Software Engineer III (L5)',
    stage: 'Technical Round 2',
    date: getOffsetDateString(3),
    time: '11:00',
    durationMinutes: 45,
    format: 'Online',
    locationOrLink: 'https://meet.google.com/goog-tech-l5',
    status: 'Scheduled',
    notes: 'Advanced graph traversals, topological sort, and LeetCode hard problem discussions.',
    createdAt: '2026-10-25T11:00:00.000Z'
  },
  {
    id: 'int-3',
    company: 'Datadog',
    role: 'Backend Platform Engineer',
    stage: 'Technical Round 1',
    date: getTodayDateString(), // Today!
    time: '16:00',
    durationMinutes: 60,
    format: 'Online',
    locationOrLink: 'https://app.coderpad.io/p/datadog-backend',
    status: 'Pending Preparation',
    notes: 'Deep dive into concurrency primitives, multi-threading, and operating systems memory paging.',
    createdAt: '2026-10-26T09:00:00.000Z'
  },
  {
    id: 'int-4',
    company: 'Meta',
    role: 'Production Engineer',
    stage: 'Online Assessment',
    date: getOffsetDateString(-4), // Past completed
    time: '10:00',
    durationMinutes: 90,
    format: 'Online',
    locationOrLink: 'https://leetcode.com/assessment',
    status: 'Completed',
    notes: 'Completed 3 medium/hard questions with optimal Big-O complexity.',
    createdAt: '2026-10-22T08:00:00.000Z'
  },
  {
    id: 'int-5',
    company: 'Uber',
    role: 'Staff Infrastructure Engineer',
    stage: 'HR Interview',
    date: getOffsetDateString(5),
    time: '15:00',
    durationMinutes: 30,
    format: 'Phone',
    locationOrLink: '+1 (555) 321-4567',
    status: 'Scheduled',
    notes: 'Discussion of past engineering leadership, project management, and compensation bands.',
    createdAt: '2026-10-26T14:00:00.000Z'
  },
  {
    id: 'int-6',
    company: 'Amazon',
    role: 'Software Development Engineer II',
    stage: 'Final Round',
    date: getOffsetDateString(8),
    time: '13:00',
    durationMinutes: 180,
    format: 'In-person',
    locationOrLink: 'Amazon HQ2, 510 14th St S, Arlington, VA',
    status: 'Confirmed',
    notes: 'Full virtual loop: 2 Leadership Principles rounds, 1 Low-Level Design, 1 Coding.',
    createdAt: '2026-10-27T10:00:00.000Z'
  },
  {
    id: 'int-7',
    company: 'Netflix',
    role: 'Senior Distributed Systems Engineer',
    stage: 'System Design',
    date: getOffsetDateString(-2),
    time: '17:30',
    durationMinutes: 60,
    format: 'Online',
    locationOrLink: 'https://meet.google.com/nflx-systems',
    status: 'Cancelled',
    notes: 'Position filled internally before technical loop took place.',
    createdAt: '2026-10-24T12:00:00.000Z'
  },
  {
    id: 'int-8',
    company: 'Microsoft',
    role: 'Principal Cloud Architect',
    stage: 'Technical Round 1',
    date: getOffsetDateString(4),
    time: '10:30',
    durationMinutes: 60,
    format: 'Online',
    locationOrLink: 'https://teams.microsoft.com/l/meetup-join/msft-arch',
    status: 'Rescheduled',
    notes: 'Interviewer requested moving from Monday morning to Thursday morning.',
    createdAt: '2026-10-26T16:00:00.000Z'
  }
];

/**
 * Calculates interview summary metrics derived from the active dataset.
 * Follows exact requirements:
 * - Upcoming: future dates (date > today) that are not completed or cancelled.
 * - Today's: date === today and not completed or cancelled.
 * - Completed: status === 'Completed'
 * - Pending Preparation: status === 'Pending Preparation'
 * - Total: total interviews.
 */
export function calculateScheduleMetrics(interviews = []) {
  const today = getTodayDateString();

  let upcomingCount = 0;
  let todayCount = 0;
  let completedCount = 0;
  let pendingPrepCount = 0;

  interviews.forEach((item) => {
    const isCompleted = item.status === 'Completed';
    const isCancelled = item.status === 'Cancelled';

    if (item.status === 'Completed') {
      completedCount++;
    }
    if (item.status === 'Pending Preparation') {
      pendingPrepCount++;
    }

    if (!isCompleted && !isCancelled) {
      if (item.date === today) {
        todayCount++;
      } else if (item.date > today) {
        upcomingCount++;
      }
    }
  });

  return {
    totalInterviews: interviews.length,
    upcomingInterviews: upcomingCount,
    todayInterviews: todayCount,
    completedInterviews: completedCount,
    pendingPrepInterviews: pendingPrepCount
  };
}

/**
 * Filter and sort interview items
 */
export function filterAndSortInterviews(interviews = [], filters = {}) {
  const {
    search = '',
    status = 'all',
    stage = 'all',
    format = 'all',
    timeframe = 'all',
    startDate = '',
    endDate = '',
    sortBy = 'dateAsc'
  } = filters;

  const today = getTodayDateString();
  const searchTrimmed = search.trim().toLowerCase();

  const filtered = interviews.filter((item) => {
    // 1. Search filter: company, role, stage, notes
    if (searchTrimmed) {
      const matchCompany = item.company?.toLowerCase().includes(searchTrimmed);
      const matchRole = item.role?.toLowerCase().includes(searchTrimmed);
      const matchStage = item.stage?.toLowerCase().includes(searchTrimmed);
      const matchNotes = item.notes?.toLowerCase().includes(searchTrimmed);
      if (!matchCompany && !matchRole && !matchStage && !matchNotes) {
        return false;
      }
    }

    // 2. Status filter
    if (status !== 'all' && item.status !== status) {
      return false;
    }

    // 3. Stage filter
    if (stage !== 'all' && item.stage !== stage) {
      return false;
    }

    // 4. Format filter
    if (format !== 'all' && item.format !== format) {
      return false;
    }

    // 5. Timeframe category filter
    if (timeframe === 'upcoming') {
      if (item.date <= today || item.status === 'Completed' || item.status === 'Cancelled') {
        return false;
      }
    } else if (timeframe === 'today') {
      if (item.date !== today || item.status === 'Completed' || item.status === 'Cancelled') {
        return false;
      }
    } else if (timeframe === 'past') {
      if (item.date >= today) {
        return false;
      }
    } else if (timeframe === 'completed') {
      if (item.status !== 'Completed') {
        return false;
      }
    } else if (timeframe === 'cancelled') {
      if (item.status !== 'Cancelled') {
        return false;
      }
    }

    // 6. Date Range filter
    if (startDate && item.date < startDate) {
      return false;
    }
    if (endDate && item.date > endDate) {
      return false;
    }

    return true;
  });

  // Sorting
  return [...filtered].sort((a, b) => {
    const dateTimeA = `${a.date || '0000-00-00'} ${a.time || '00:00'}`;
    const dateTimeB = `${b.date || '0000-00-00'} ${b.time || '00:00'}`;

    switch (sortBy) {
      case 'dateAsc':
        return dateTimeA.localeCompare(dateTimeB);
      case 'dateDesc':
        return dateTimeB.localeCompare(dateTimeA);
      case 'companyAsc':
        return (a.company || '').localeCompare(b.company || '');
      case 'statusAsc':
        return (a.status || '').localeCompare(b.status || '');
      default:
        return dateTimeA.localeCompare(dateTimeB);
    }
  });
}

/**
 * Calendar Grid Generation:
 * Generates an array of day objects for the given month view,
 * including padding days from the preceding and succeeding months.
 */
export function generateCalendarMonthGrid(year, month, interviews = []) {
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = getTodayDateString();
  const cells = [];

  // Map of interviews by YYYY-MM-DD
  const interviewMap = {};
  interviews.forEach((item) => {
    if (!interviewMap[item.date]) {
      interviewMap[item.date] = [];
    }
    interviewMap[item.date].push(item);
  });

  // Leading days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      interviews: interviewMap[dateStr] || []
    });
  }

  // Days in current month
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      interviews: interviewMap[dateStr] || []
    });
  }

  // Trailing days to complete 35 or 42 grid cells (6 rows * 7 days)
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const trailingDays = totalCellsNeeded - cells.length;
  for (let dayNum = 1; dayNum <= trailingDays; dayNum++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      interviews: interviewMap[dateStr] || []
    });
  }

  return cells;
}
