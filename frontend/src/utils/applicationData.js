/**
 * Job Applications Data Architecture & Calculation Utilities
 * 
 * NOTE: This module provides structured deterministic sample data,
 * pipeline status models, and pure calculation functions for Phase 6.
 */

// Supported Application Pipeline Statuses
export const APPLICATION_STATUS_CONFIG = {
  Wishlist: {
    key: 'Wishlist',
    label: 'Wishlist',
    variant: 'neutral',
    color: '#94a3b8',
    description: 'Target roles identified for application'
  },
  Applied: {
    key: 'Applied',
    label: 'Applied',
    variant: 'info',
    color: '#0ea5e9',
    description: 'Application submitted, awaiting review'
  },
  Assessment: {
    key: 'Assessment',
    label: 'Assessment',
    variant: 'warning',
    color: '#f59e0b',
    description: 'Technical test or take-home in progress'
  },
  Interview: {
    key: 'Interview',
    label: 'Interviewing',
    variant: 'primary',
    color: '#6366f1',
    description: 'Active interview rounds in progress'
  },
  Offer: {
    key: 'Offer',
    label: 'Offer',
    variant: 'success',
    color: '#10b981',
    description: 'Job offer extended'
  },
  Rejected: {
    key: 'Rejected',
    label: 'Rejected',
    variant: 'error',
    color: '#ef4444',
    description: 'Application was not selected'
  },
  Withdrawn: {
    key: 'Withdrawn',
    label: 'Withdrawn',
    variant: 'neutral',
    color: '#64748b',
    description: 'Application withdrawn by candidate'
  }
};

export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS_CONFIG);
export const ACTIVE_PIPELINE_STATUSES = ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer'];
export const TERMINAL_STATUSES = ['Rejected', 'Withdrawn'];

// Work Modes
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

// Job Types
export const JOB_TYPES = ['Full-time', 'Internship', 'Contract', 'Other'];

// Application Sources
export const APPLICATION_SOURCES = [
  'Company Website',
  'Referral',
  'LinkedIn',
  'Job Board',
  'Recruiter Outreach',
  'Other'
];

// Local Timezone Safe Date Helpers
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

export function isDatePast(dateStr) {
  if (!dateStr) return false;
  return dateStr < getTodayDateString();
}

export function isDateFuture(dateStr) {
  if (!dateStr) return false;
  return dateStr > getTodayDateString();
}

export function formatDisplayDate(dateStr) {
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

export function isValidUrl(string) {
  if (!string) return false;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidEmail(string) {
  if (!string) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string.trim());
}

// Initial Deterministic Sample Applications
export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Senior Software Engineer',
    location: 'San Francisco, CA (Remote)',
    workMode: 'Remote',
    jobType: 'Full-time',
    jobUrl: 'https://stripe.com/jobs/senior-backend',
    applicationDate: getOffsetDateString(-14),
    deadline: getOffsetDateString(20),
    status: 'Interview',
    source: 'Referral',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.j@stripe.com',
    salaryRange: '$180,000 - $210,000 + Equity',
    followUpDate: getOffsetDateString(2),
    notes: 'System design round scheduled. Great feedback from technical screen.',
    createdAt: '2026-10-14T10:00:00.000Z',
    updatedAt: '2026-10-26T14:30:00.000Z'
  },
  {
    id: 'app-2',
    company: 'Google',
    role: 'Software Engineer III (L5)',
    location: 'Mountain View, CA',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    jobUrl: 'https://careers.google.com/jobs/results/123',
    applicationDate: getOffsetDateString(-20),
    deadline: '',
    status: 'Interview',
    source: 'Recruiter Outreach',
    contactName: 'David Chen',
    contactEmail: 'dchen@google.com',
    salaryRange: '$190,000 - $230,000 + GSU',
    followUpDate: getOffsetDateString(4),
    notes: 'Preparing for distributed data structures and algorithm discussions.',
    createdAt: '2026-10-08T11:00:00.000Z',
    updatedAt: '2026-10-25T11:00:00.000Z'
  },
  {
    id: 'app-3',
    company: 'Datadog',
    role: 'Backend Platform Engineer',
    location: 'New York, NY',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    jobUrl: 'https://www.datadoghq.com/careers/detail/?id=456',
    applicationDate: getOffsetDateString(-10),
    deadline: '',
    status: 'Interview',
    source: 'Company Website',
    contactName: 'Michael Scott',
    contactEmail: 'm.scott@datadoghq.com',
    salaryRange: '$165,000 - $185,000',
    followUpDate: getTodayDateString(),
    notes: 'Technical round 1 scheduled today on Concurrency and OS memory.',
    createdAt: '2026-10-18T09:00:00.000Z',
    updatedAt: '2026-10-27T09:00:00.000Z'
  },
  {
    id: 'app-4',
    company: 'Vercel',
    role: 'Staff Frontend Infrastructure Engineer',
    location: 'San Francisco, CA (Remote)',
    workMode: 'Remote',
    jobType: 'Full-time',
    jobUrl: 'https://vercel.com/careers/staff-frontend',
    applicationDate: getOffsetDateString(-35),
    deadline: '',
    status: 'Offer',
    source: 'Referral',
    contactName: 'Guillermo Rauch',
    contactEmail: 'recruiting@vercel.com',
    salaryRange: '$210,000 + High Equity',
    followUpDate: getOffsetDateString(3),
    notes: 'Received formal offer letter. Negotiating start date and signing bonus.',
    createdAt: '2026-09-23T08:00:00.000Z',
    updatedAt: '2026-10-28T12:00:00.000Z'
  },
  {
    id: 'app-5',
    company: 'Meta',
    role: 'Production Engineer',
    location: 'Menlo Park, CA',
    workMode: 'On-site',
    jobType: 'Full-time',
    jobUrl: 'https://www.metacareers.com/v2/jobs/789',
    applicationDate: getOffsetDateString(-6),
    deadline: getOffsetDateString(2),
    status: 'Assessment',
    source: 'LinkedIn',
    contactName: 'Amanda Waller',
    contactEmail: 'awaller@meta.com',
    salaryRange: '$175,000 - $205,000',
    followUpDate: getOffsetDateString(1),
    notes: 'Complete coding assessment on Hackerrank/LeetCode before deadline.',
    createdAt: '2026-10-22T08:00:00.000Z',
    updatedAt: '2026-10-24T16:00:00.000Z'
  },
  {
    id: 'app-6',
    company: 'Netflix',
    role: 'Senior Distributed Systems Engineer',
    location: 'Los Gatos, CA',
    workMode: 'Remote',
    jobType: 'Full-time',
    jobUrl: 'https://jobs.netflix.com/jobs/999',
    applicationDate: getOffsetDateString(-25),
    deadline: '',
    status: 'Rejected',
    source: 'LinkedIn',
    contactName: 'Jessica Pearson',
    contactEmail: 'jpearson@netflix.com',
    salaryRange: '$250,000 All-Cash',
    followUpDate: '',
    notes: 'Position closed internally. Friendly rejection, encouraged to re-apply in 6 months.',
    createdAt: '2026-10-03T12:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z'
  },
  {
    id: 'app-7',
    company: 'Airbnb',
    role: 'Staff Core Platform Engineer',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    jobUrl: 'https://careers.airbnb.com/positions/3321',
    applicationDate: getOffsetDateString(-3),
    deadline: getOffsetDateString(15),
    status: 'Applied',
    source: 'Referral',
    contactName: 'Alex Vance',
    contactEmail: 'alex.v@airbnb.com',
    salaryRange: '$195,000 - $225,000',
    followUpDate: getOffsetDateString(7),
    notes: 'Internal referral submitted via former colleague.',
    createdAt: '2026-10-25T14:00:00.000Z',
    updatedAt: '2026-10-25T14:00:00.000Z'
  },
  {
    id: 'app-8',
    company: 'Cloudflare',
    role: 'Systems & Network Engineer',
    location: 'Austin, TX (Remote)',
    workMode: 'Remote',
    jobType: 'Full-time',
    jobUrl: 'https://www.cloudflare.com/careers/jobs/881',
    applicationDate: getOffsetDateString(-5),
    deadline: getOffsetDateString(10),
    status: 'Applied',
    source: 'Company Website',
    contactName: '',
    contactEmail: '',
    salaryRange: '$160,000 - $185,000',
    followUpDate: getOffsetDateString(5),
    notes: 'Applied via careers portal. TCP/IP and Rust focus.',
    createdAt: '2026-10-23T10:00:00.000Z',
    updatedAt: '2026-10-23T10:00:00.000Z'
  },
  {
    id: 'app-9',
    company: 'Figma',
    role: 'Senior Product Engineer',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    jobUrl: 'https://www.figma.com/careers/442',
    applicationDate: getTodayDateString(),
    deadline: getOffsetDateString(25),
    status: 'Wishlist',
    source: 'Company Website',
    contactName: '',
    contactEmail: '',
    salaryRange: '$180,000 - $210,000',
    followUpDate: getOffsetDateString(3),
    notes: 'Polishing portfolio before submitting. Connect with engineering manager on LinkedIn.',
    createdAt: '2026-10-28T09:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z'
  },
  {
    id: 'app-10',
    company: 'OpenAI',
    role: 'Research Engineer - Infra',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    jobType: 'Full-time',
    jobUrl: 'https://openai.com/careers/infra',
    applicationDate: getTodayDateString(),
    deadline: getOffsetDateString(30),
    status: 'Wishlist',
    source: 'Company Website',
    contactName: '',
    contactEmail: '',
    salaryRange: '$240,000 - $320,000 + Equity',
    followUpDate: getOffsetDateString(4),
    notes: 'Large-scale GPU cluster orchestration and distributed checkpointing.',
    createdAt: '2026-10-28T10:30:00.000Z',
    updatedAt: '2026-10-28T10:30:00.000Z'
  },
  {
    id: 'app-11',
    company: 'Spotify',
    role: 'Senior Backend Engineer',
    location: 'Stockholm, Sweden (Remote)',
    workMode: 'Remote',
    jobType: 'Contract',
    jobUrl: '',
    applicationDate: getOffsetDateString(-40),
    deadline: '',
    status: 'Withdrawn',
    source: 'LinkedIn',
    contactName: 'Lars Ulrich',
    contactEmail: 'lars@spotify.com',
    salaryRange: '€110,000',
    followUpDate: '',
    notes: 'Withdrew after receiving other local offers.',
    createdAt: '2026-09-18T11:00:00.000Z',
    updatedAt: '2026-10-15T15:00:00.000Z'
  },
  {
    id: 'app-12',
    company: 'Uber',
    role: 'Staff Infrastructure Engineer',
    location: 'Sunnyvale, CA',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    jobUrl: 'https://uber.com/careers/554',
    applicationDate: getOffsetDateString(-7),
    deadline: getOffsetDateString(14),
    status: 'Applied',
    source: 'Recruiter Outreach',
    contactName: 'Erica Kane',
    contactEmail: 'erica.k@uber.com',
    salaryRange: '$200,000 - $240,000',
    followUpDate: getOffsetDateString(-1), // Overdue follow up!
    notes: 'Overdue follow-up check-in with recruiter.',
    createdAt: '2026-10-21T14:00:00.000Z',
    updatedAt: '2026-10-21T14:00:00.000Z'
  }
];

/**
 * Calculates application summary metrics derived from the active dataset.
 * - Total applications: all records.
 * - In-progress: status is in ACTIVE_PIPELINE_STATUSES (Wishlist, Applied, Assessment, Interview, Offer).
 * - Interviews in progress: status === 'Interview'.
 * - Offers received: status === 'Offer'.
 * - Actionable Follow-ups: active applications where followUpDate is set.
 * - Overdue Follow-ups: active applications where followUpDate < today.
 */
export function calculateApplicationMetrics(applications = []) {
  const today = getTodayDateString();

  let inProgressCount = 0;
  let interviewCount = 0;
  let offerCount = 0;
  let pendingFollowUpCount = 0;
  let overdueFollowUpCount = 0;
  let upcomingDeadlineCount = 0;

  applications.forEach((app) => {
    const isTerminal = TERMINAL_STATUSES.includes(app.status);

    if (!isTerminal) {
      inProgressCount++;

      // Follow-up tracking
      if (app.followUpDate) {
        if (app.followUpDate < today) {
          overdueFollowUpCount++;
        } else {
          pendingFollowUpCount++;
        }
      }

      // Deadline tracking
      if (app.deadline && app.deadline >= today) {
        upcomingDeadlineCount++;
      }
    }

    if (app.status === 'Interview') {
      interviewCount++;
    }
    if (app.status === 'Offer') {
      offerCount++;
    }
  });

  return {
    totalApplications: applications.length,
    inProgressApplications: inProgressCount,
    interviewingApplications: interviewCount,
    offersCount: offerCount,
    pendingFollowUps: pendingFollowUpCount,
    overdueFollowUps: overdueFollowUpCount,
    upcomingDeadlines: upcomingDeadlineCount
  };
}

/**
 * Filter and sort applications
 */
export function filterAndSortApplications(applications = [], filters = {}) {
  const {
    search = '',
    status = 'all',
    workMode = 'all',
    jobType = 'all',
    timeframe = 'all',
    sortBy = 'applicationDateDesc'
  } = filters;

  const today = getTodayDateString();
  const searchTrimmed = search.trim().toLowerCase();

  const filtered = applications.filter((app) => {
    // 1. Search filter: company, role, location, notes, recruiter name
    if (searchTrimmed) {
      const matchCompany = app.company?.toLowerCase().includes(searchTrimmed);
      const matchRole = app.role?.toLowerCase().includes(searchTrimmed);
      const matchLocation = app.location?.toLowerCase().includes(searchTrimmed);
      const matchNotes = app.notes?.toLowerCase().includes(searchTrimmed);
      const matchRecruiter = app.contactName?.toLowerCase().includes(searchTrimmed);
      if (!matchCompany && !matchRole && !matchLocation && !matchNotes && !matchRecruiter) {
        return false;
      }
    }

    // 2. Status filter
    if (status !== 'all' && app.status !== status) {
      return false;
    }

    // 3. Work mode filter
    if (workMode !== 'all' && app.workMode !== workMode) {
      return false;
    }

    // 4. Job type filter
    if (jobType !== 'all' && app.jobType !== jobType) {
      return false;
    }

    // 5. Timeframe / actionable filter
    const isTerminal = TERMINAL_STATUSES.includes(app.status);

    if (timeframe === 'inProgress') {
      if (isTerminal) return false;
    } else if (timeframe === 'hasFollowUp') {
      if (!app.followUpDate || isTerminal) return false;
    } else if (timeframe === 'upcomingFollowUp') {
      if (!app.followUpDate || isTerminal || app.followUpDate < today) return false;
    } else if (timeframe === 'overdueFollowUp') {
      if (!app.followUpDate || isTerminal || app.followUpDate >= today) return false;
    } else if (timeframe === 'hasDeadline') {
      if (!app.deadline || isTerminal || app.deadline < today) return false;
    } else if (timeframe === 'offers') {
      if (app.status !== 'Offer') return false;
    } else if (timeframe === 'terminal') {
      if (!isTerminal) return false;
    }

    return true;
  });

  // Sorting
  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'applicationDateDesc':
        return (b.applicationDate || '').localeCompare(a.applicationDate || '');
      case 'applicationDateAsc':
        return (a.applicationDate || '').localeCompare(b.applicationDate || '');
      case 'companyAsc':
        return (a.company || '').localeCompare(b.company || '');
      case 'statusAsc':
        return (a.status || '').localeCompare(b.status || '');
      case 'deadlineAsc': {
        const dA = a.deadline || '9999-99-99';
        const dB = b.deadline || '9999-99-99';
        return dA.localeCompare(dB);
      }
      case 'followUpAsc': {
        const fA = a.followUpDate || '9999-99-99';
        const fB = b.followUpDate || '9999-99-99';
        return fA.localeCompare(fB);
      }
      default:
        return (b.applicationDate || '').localeCompare(a.applicationDate || '');
    }
  });
}
