/**
 * Notes and Resources Data Architecture & Utility Functions
 * 
 * NOTE: This module provides structured deterministic sample notes and learning
 * resources for Phase 7, compatible with the established subjects and design system.
 */

import { PREPARATION_SUBJECTS } from './dashboardData.js';

// Extend subjects with System Design and General for interview preparation
export const EXTENDED_SUBJECTS = [
  ...PREPARATION_SUBJECTS,
  {
    id: 'system-design',
    name: 'System Design & Distributed Systems',
    shortName: 'System Design',
    color: '#8b5cf6',
    icon: 'layers'
  },
  {
    id: 'general',
    name: 'General & Behavioral Frameworks',
    shortName: 'Behavioral',
    color: '#94a3b8',
    icon: 'user'
  }
];

export const SUBJECT_MAP = EXTENDED_SUBJECTS.reduce((acc, subj) => {
  acc[subj.id] = subj;
  return acc;
}, {});

// Resource Types & Associated Visual Badges
export const RESOURCE_TYPE_CONFIG = {
  'Documentation': {
    variant: 'primary',
    icon: 'fileText',
    color: '#6366f1'
  },
  'Article': {
    variant: 'info',
    icon: 'fileText',
    color: '#0ea5e9'
  },
  'Coding Practice': {
    variant: 'success',
    icon: 'code',
    color: '#10b981'
  },
  'Video': {
    variant: 'error',
    icon: 'video',
    color: '#ef4444'
  },
  'Course': {
    variant: 'warning',
    icon: 'layers',
    color: '#f59e0b'
  },
  'Cheat Sheet': {
    variant: 'neutral',
    icon: 'bookmark',
    color: '#94a3b8'
  },
  'Other': {
    variant: 'neutral',
    icon: 'link',
    color: '#64748b'
  }
};

export const RESOURCE_TYPES = Object.keys(RESOURCE_TYPE_CONFIG);

// View / Tab Types
export const CONTENT_VIEW_TABS = [
  { id: 'all', label: 'All Items', icon: 'layers' },
  { id: 'notes', label: 'Notes', icon: 'notes' },
  { id: 'resources', label: 'Resources', icon: 'link' },
  { id: 'favorites', label: 'Favorites', icon: 'star' }
];

// Helper: Validate HTTP/HTTPS URLs
export function isValidUrl(string) {
  if (!string || typeof string !== 'string') return false;
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper: Format tags array from comma-separated string or array
export function parseTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((t) => String(t).trim()).filter(Boolean);
  }
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

// Helper: Format readable date
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return dateStr;
  }
}

// Deterministic Initial Sample Data (16 realistic interview prep items)
export const INITIAL_ITEMS = [
  // 1. DSA Note (Pinned & Favorite)
  {
    id: 'note-1',
    type: 'note',
    title: 'LRU Cache: O(1) Get/Put with Doubly Linked List + Hash Map',
    content: `## LRU Cache Design (LeetCode #146)

### Key Concept
To achieve both \`get(key)\` and \`put(key, value)\` in O(1) time complexity:
1. **Hash Map (\`Map<key, Node>\`)**: Provides O(1) lookup to find pointer to node in the linked list.
2. **Doubly Linked List (DLL)**: Provides O(1) removal and insertion of nodes given a direct node reference.

### Invariants:
- Most recently used item is placed right after \`head\` sentinel node.
- Least recently used item sits right before \`tail\` sentinel node.
- On capacity overflow: evict \`tail.prev\` and delete key from Hash Map.

### Complexity:
- Time: **O(1)** amortized for all operations.
- Space: **O(capacity)** auxiliary storage.`,
    subjectId: 'dsa',
    topic: 'Linked Lists & Caching',
    tags: ['DSA', 'LeetCode-146', 'Hash Table', 'O(1) Design'],
    favorite: true,
    pinned: true,
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-26T14:30:00.000Z'
  },

  // 2. Resource - DSA
  {
    id: 'res-1',
    type: 'resource',
    title: 'NeetCode 150 — Comprehensive DSA Practice Roadmap',
    url: 'https://neetcode.io/practice',
    description: 'Structured roadmap of 150 essential LeetCode coding problems grouped by topic (Arrays, Two Pointers, Trees, Graphs, DP) with video explanations.',
    subjectId: 'dsa',
    topic: 'Coding Practice & Patterns',
    resourceType: 'Coding Practice',
    tags: ['LeetCode', 'DSA', 'Interview Patterns', 'Roadmap'],
    favorite: true,
    createdAt: '2026-10-10T08:00:00.000Z',
    updatedAt: '2026-10-20T12:00:00.000Z'
  },

  // 3. DBMS Note (Favorite)
  {
    id: 'note-2',
    type: 'note',
    title: 'ACID Properties & SQL Transaction Isolation Levels',
    content: `## ACID vs Transaction Isolation

### ACID Breakdown:
- **Atomicity**: All operations succeed, or transaction is fully rolled back (WAL - Write Ahead Logging).
- **Consistency**: Database transitions from one valid state to another satisfying all schema constraints.
- **Isolation**: Concurrent transactions execute as if sequential.
- **Durability**: Committed data survives system crashes or restarts.

### 4 Standard ANSI SQL Isolation Levels:
1. **Read Uncommitted**: Suffers from Dirty Read, Non-Repeatable Read, Phantom Read.
2. **Read Committed**: No dirty reads. Suffers from Non-Repeatable Read and Phantom Read. (Default in PostgreSQL).
3. **Repeatable Read**: Snapshot-based. Prevents non-repeatable reads. (Default in MySQL InnoDB with Next-Key Locks).
4. **Serializable**: Strict two-phase locking (2PL) or SSI. Eliminates all anomalies.`,
    subjectId: 'dbms',
    topic: 'Transactions & Concurrency',
    tags: ['DBMS', 'ACID', 'Isolation', 'Postgres', 'MySQL'],
    favorite: true,
    pinned: false,
    createdAt: '2026-10-14T11:00:00.000Z',
    updatedAt: '2026-10-24T16:00:00.000Z'
  },

  // 4. Resource - DBMS
  {
    id: 'res-2',
    type: 'resource',
    title: 'Use The Index, Luke! — SQL Indexing Internals',
    url: 'https://use-the-index-luke.com',
    description: 'In-depth free guide explaining how B-Tree indices work, index range scans, composite index column ordering, and query planner optimization.',
    subjectId: 'dbms',
    topic: 'Query Optimization & B-Tree',
    resourceType: 'Documentation',
    tags: ['DBMS', 'B-Tree', 'Indexing', 'SQL Performance'],
    favorite: false,
    createdAt: '2026-10-13T14:00:00.000Z',
    updatedAt: '2026-10-13T14:00:00.000Z'
  },

  // 5. OS Note (Pinned & Favorite)
  {
    id: 'note-3',
    type: 'note',
    title: 'Virtual Memory, Multi-Level Paging, and TLB Walk',
    content: `## Virtual Memory Mechanics

### Paging Architecture
- Virtual Address space is divided into fixed-size **Pages** (typically 4KB).
- Physical Memory (RAM) is partitioned into matching **Page Frames**.
- The Memory Management Unit (**MMU**) translates Virtual Addresses to Physical Addresses using the **Page Table**.

### Translation Lookaside Buffer (TLB):
- Hardware cache for fast address translation.
- **TLB Hit**: Address translation takes ~1 CPU cycle.
- **TLB Miss**: Requires page table walk in RAM (multiple memory lookups).

### Page Fault Sequence:
1. CPU accesses address with invalid bit in Page Table Entry (PTE).
2. Trap to OS kernel.
3. OS checks swap space / disk backing file.
4. OS finds free frame (or evicts victim via LRU / Clock replacement).
5. Disk I/O reads frame into RAM; updates PTE valid bit.
6. Instruction is restarted.`,
    subjectId: 'os',
    topic: 'Memory Management',
    tags: ['OS', 'Virtual Memory', 'TLB', 'Paging', 'Page Fault'],
    favorite: true,
    pinned: true,
    createdAt: '2026-10-15T15:00:00.000Z',
    updatedAt: '2026-10-25T17:00:00.000Z'
  },

  // 6. Resource - OS
  {
    id: 'res-3',
    type: 'resource',
    title: 'Operating Systems: Three Easy Pieces (OSTEP Free Chapters)',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    description: 'Renowned textbook covering virtualization (CPU & Memory), concurrency (threads, locks, condition variables, semaphores), and persistence (file systems).',
    subjectId: 'os',
    topic: 'Virtualization & Concurrency',
    resourceType: 'Article',
    tags: ['OS', 'Concurrency', 'Semaphores', 'Virtualization'],
    favorite: true,
    createdAt: '2026-10-11T09:00:00.000Z',
    updatedAt: '2026-10-11T09:00:00.000Z'
  },

  // 7. Computer Networks Note
  {
    id: 'note-4',
    type: 'note',
    title: 'TCP 3-Way Handshake, 4-Way Termination & TIME_WAIT',
    content: `## TCP Connection Lifecycle

### 3-Way Handshake (Establishment):
1. **Client -> Server**: SYN (seq = x)
2. **Server -> Client**: SYN-ACK (seq = y, ack = x + 1)
3. **Client -> Server**: ACK (seq = x + 1, ack = y + 1) -> Connection is ESTABLISHED.

### 4-Way Handshake (Teardown):
1. **Client -> Server**: FIN (seq = u)
2. **Server -> Client**: ACK (ack = u + 1) -> Client enters FIN_WAIT_2
3. **Server -> Client**: FIN (seq = v)
4. **Client -> Server**: ACK (ack = v + 1) -> Client enters **TIME_WAIT**

### Why TIME_WAIT state exists (2 * MSL):
- Guarantees final ACK reaches server (resending ACK if duplicate FIN arrives).
- Prevents old duplicate segments from lingering and corrupting a newly opened socket with the same IP:Port tuple.`,
    subjectId: 'cn',
    topic: 'Transport Layer Protocols',
    tags: ['Networks', 'TCP', 'Handshake', 'TIME_WAIT'],
    favorite: false,
    pinned: false,
    createdAt: '2026-10-16T12:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z'
  },

  // 8. Resource - Computer Networks
  {
    id: 'res-4',
    type: 'resource',
    title: "Beej's Guide to Network Programming (Using Internet Sockets)",
    url: 'https://beej.us/guide/bgnet/',
    description: 'The definitive hands-on manual for understanding TCP/IP sockets, select/epoll, struct sockaddr, getaddrinfo, and non-blocking I/O.',
    subjectId: 'cn',
    topic: 'Socket Programming',
    resourceType: 'Documentation',
    tags: ['Networks', 'Sockets', 'TCP/IP', 'Linux C/C++'],
    favorite: false,
    createdAt: '2026-10-16T13:00:00.000Z',
    updatedAt: '2026-10-16T13:00:00.000Z'
  },

  // 9. OOP & LLD Note (Favorite)
  {
    id: 'note-5',
    type: 'note',
    title: 'SOLID Principles Quick Reference with Interview Traps',
    content: `## SOLID Design Principles

1. **Single Responsibility Principle (SRP)**:
   - A class should have one, and only one, reason to change.
   - *Trap*: Don't bundle database persistence with business logic calculation.

2. **Open / Closed Principle (OCP)**:
   - Software entities should be open for extension, but closed for modification.
   - *Pattern*: Strategy or Factory pattern with polymorphism.

3. **Liskov Substitution Principle (LSP)**:
   - Subtypes must be substitutable for their base types without altering correctness.
   - *Classic Violation*: Square extending Rectangle (overriding setWidth/setHeight breaks geometry assumptions).

4. **Interface Segregation Principle (ISP)**:
   - Clients should not be forced to depend on methods they do not use.
   - *Fix*: Split fat interfaces into narrow, cohesive interfaces.

5. **Dependency Inversion Principle (DIP)**:
   - High-level modules should not depend on low-level modules. Both should depend on abstractions.`,
    subjectId: 'oop',
    topic: 'Software Architecture & LLD',
    tags: ['OOP', 'LLD', 'SOLID', 'Design Patterns'],
    favorite: true,
    pinned: false,
    createdAt: '2026-10-17T14:00:00.000Z',
    updatedAt: '2026-10-27T08:00:00.000Z'
  },

  // 10. Resource - OOP & LLD
  {
    id: 'res-5',
    type: 'resource',
    title: 'Refactoring.Guru — Interactive Design Patterns Catalog',
    url: 'https://refactoring.guru/design-patterns',
    description: 'Clean visual guides and code implementations for Creational, Structural, and Behavioral design patterns (Factory, Observer, Singleton, Decorator).',
    subjectId: 'oop',
    topic: 'Design Patterns',
    resourceType: 'Documentation',
    tags: ['Design Patterns', 'OOP', 'LLD', 'Refactoring'],
    favorite: true,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },

  // 11. System Design Note (Pinned & Favorite)
  {
    id: 'note-6',
    type: 'note',
    title: 'System Design Framework: CAP Theorem, Consistent Hashing & Caching',
    content: `## System Design Core Fundamentals

### 1. CAP Theorem:
- In the presence of a **Network Partition (P)**, a distributed system must choose between **Consistency (C)** or **Availability (A)**.
- **CP Systems** (e.g. MongoDB primary, HBase, Zookeeper): Returns error or blocks until sync to guarantee linearizability.
- **AP Systems** (e.g. Cassandra, DynamoDB, Couchbase): Always accepts writes/reads, guarantees eventual consistency.

### 2. Consistent Hashing:
- Distributes keys across a hash ring (\`0\` to \`2^32 - 1\`).
- Minimizes key remapping when adding or removing cache nodes: only \`K/N\` keys moved on average.
- **Virtual Nodes**: Solves data hotspotting / skew by mapping multiple ring tokens per physical server.

### 3. Caching Strategies:
- **Cache-Aside (Lazy Loading)**: App reads from cache; on miss, queries DB and populates cache.
- **Write-Through**: App writes to cache, which synchronously writes to DB.
- **Write-Back (Write-Behind)**: App writes to cache immediately; cache asynchronously writes to DB in batches.`,
    subjectId: 'system-design',
    topic: 'High Level Architecture',
    tags: ['System Design', 'CAP Theorem', 'Consistent Hashing', 'Caching'],
    favorite: true,
    pinned: true,
    createdAt: '2026-10-19T11:00:00.000Z',
    updatedAt: '2026-10-28T09:00:00.000Z'
  },

  // 12. Resource - System Design
  {
    id: 'res-6',
    type: 'resource',
    title: 'The System Design Primer (GitHub Reference)',
    url: 'https://github.com/donnemartin/system-design-primer',
    description: 'Immense open-source repository with visual diagrams, interview blueprints, scaling calculations, load balancing, and microservices trade-offs.',
    subjectId: 'system-design',
    topic: 'System Architecture',
    resourceType: 'Documentation',
    tags: ['System Design', 'Microservices', 'Distributed Systems', 'Scalability'],
    favorite: true,
    createdAt: '2026-10-09T08:00:00.000Z',
    updatedAt: '2026-10-23T11:00:00.000Z'
  },

  // 13. Resource - Video (DSA)
  {
    id: 'res-7',
    type: 'resource',
    title: 'Dynamic Programming Patterns & Memoization Blueprint',
    url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
    description: 'FreeCodeCamp in-depth video lecture analyzing 0/1 Knapsack, Longest Common Subsequence, and Matrix Chain Multiplication with recursion trees.',
    subjectId: 'dsa',
    topic: 'Dynamic Programming',
    resourceType: 'Video',
    tags: ['DP', 'DSA', 'Algorithms', 'Recursion'],
    favorite: false,
    createdAt: '2026-10-21T15:00:00.000Z',
    updatedAt: '2026-10-21T15:00:00.000Z'
  },

  // 14. Behavioral / General Note
  {
    id: 'note-7',
    type: 'note',
    title: 'STAR Method Framework for Behavioral & Leadership Interviews',
    content: `## Behavioral Interview Strategy (STAR Method)

### 1. Situation (15-20% of time)
- Set the context: What was the company, project, team size, and business challenge?
- Be specific: "During Q3, our checkout microservice latency spiked 400% during high-traffic sales."

### 2. Task (10-15% of time)
- Define your specific responsibility: What were you individually tasked with resolving under what constraints?

### 3. Action (50-60% of time)
- Detail the engineering steps you took. Use **"I"**, not just "we".
- Example: "I analyzed distributed Jaeger traces, identified an unindexed PostgreSQL query in the payment table, and coordinated a zero-downtime migration."

### 4. Result (15-20% of time)
- Quantify the business impact:
- Metrics: "Latency dropped from 1,200ms to 45ms (96% reduction), preventing an estimated $50k in abandoned cart losses."`,
    subjectId: 'general',
    topic: 'Behavioral Interviews',
    tags: ['Behavioral', 'STAR Method', 'Leadership', 'Storytelling'],
    favorite: false,
    pinned: false,
    createdAt: '2026-10-22T16:00:00.000Z',
    updatedAt: '2026-10-26T18:00:00.000Z'
  },

  // 15. Resource - Cheat Sheet
  {
    id: 'res-8',
    type: 'resource',
    title: 'Big-O Algorithm Complexity Cheat Sheet',
    url: 'https://www.bigocheatsheet.com',
    description: 'Summary chart of asymptotic time and space complexities for sorting algorithms (Quicksort, Mergesort, Heapsort) and fundamental data structures.',
    subjectId: 'dsa',
    topic: 'Complexity Analysis',
    resourceType: 'Cheat Sheet',
    tags: ['Big-O', 'Algorithms', 'Cheat Sheet', 'Time Complexity'],
    favorite: true,
    createdAt: '2026-10-14T10:00:00.000Z',
    updatedAt: '2026-10-14T10:00:00.000Z'
  },

  // 16. Resource - Course
  {
    id: 'res-9',
    type: 'resource',
    title: 'CMU 15-445/645: Database Systems Lecture Series',
    url: 'https://15445.courses.cs.cmu.edu',
    description: 'Carnegie Mellon University graduate-level database lecture series and project assignments covering buffer pools, concurrency control, and logging.',
    subjectId: 'dbms',
    topic: 'Storage Engines & Query Execution',
    resourceType: 'Course',
    tags: ['DBMS', 'CMU', 'Buffer Pool', 'B-Tree', 'Advanced'],
    favorite: false,
    createdAt: '2026-10-20T14:00:00.000Z',
    updatedAt: '2026-10-20T14:00:00.000Z'
  }
];

/**
 * Calculates derived summary statistics from current items.
 */
export function calculateNotesMetrics(items = []) {
  let notesCount = 0;
  let resourcesCount = 0;
  let favoriteCount = 0;
  let pinnedNotesCount = 0;

  const subjectCounts = {};
  EXTENDED_SUBJECTS.forEach((subj) => {
    subjectCounts[subj.id] = 0;
  });

  items.forEach((item) => {
    if (item.type === 'note') {
      notesCount++;
      if (item.pinned) pinnedNotesCount++;
    } else if (item.type === 'resource') {
      resourcesCount++;
    }

    if (item.favorite) {
      favoriteCount++;
    }

    if (item.subjectId && subjectCounts[item.subjectId] !== undefined) {
      subjectCounts[item.subjectId]++;
    }
  });

  return {
    totalItems: items.length,
    totalNotes: notesCount,
    totalResources: resourcesCount,
    favoriteItems: favoriteCount,
    pinnedNotes: pinnedNotesCount,
    subjectCounts
  };
}

/**
 * Filter and sort items across view tabs, search query, subject, resource type, tag, and sort order.
 */
export function filterAndSortItems(items = [], filters = {}) {
  const {
    search = '',
    viewTab = 'all', // 'all' | 'notes' | 'resources' | 'favorites'
    subject = 'all',
    resourceType = 'all',
    tag = 'all',
    sortBy = 'updatedAtDesc' // 'updatedAtDesc' | 'createdAtDesc' | 'titleAsc' | 'subjectAsc'
  } = filters;

  const searchTrimmed = search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    // 1. View Tab Filter
    if (viewTab === 'notes' && item.type !== 'note') return false;
    if (viewTab === 'resources' && item.type !== 'resource') return false;
    if (viewTab === 'favorites' && !item.favorite) return false;

    // 2. Subject Filter
    if (subject !== 'all' && item.subjectId !== subject) return false;

    // 3. Resource Type Filter
    if (resourceType !== 'all') {
      if (item.type !== 'resource' || item.resourceType !== resourceType) return false;
    }

    // 4. Tag Filter
    if (tag !== 'all') {
      if (!item.tags || !item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        return false;
      }
    }

    // 5. Text Search (title, content, description, URL, topic, tags)
    if (searchTrimmed) {
      const matchTitle = item.title?.toLowerCase().includes(searchTrimmed);
      const matchTopic = item.topic?.toLowerCase().includes(searchTrimmed);
      const matchContent = item.content?.toLowerCase().includes(searchTrimmed);
      const matchDescription = item.description?.toLowerCase().includes(searchTrimmed);
      const matchUrl = item.url?.toLowerCase().includes(searchTrimmed);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(searchTrimmed));

      if (!matchTitle && !matchTopic && !matchContent && !matchDescription && !matchUrl && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Sorting logic (with pinned notes prioritised on top for date-based sorts)
  return [...filtered].sort((a, b) => {
    // If sorting by date and viewing notes or all, preserve pinned notes at the top
    if (sortBy === 'updatedAtDesc' || sortBy === 'createdAtDesc') {
      const isPinnedA = a.type === 'note' && a.pinned ? 1 : 0;
      const isPinnedB = b.type === 'note' && b.pinned ? 1 : 0;
      if (isPinnedA !== isPinnedB) {
        return isPinnedB - isPinnedA;
      }
    }

    switch (sortBy) {
      case 'updatedAtDesc':
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      case 'createdAtDesc':
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      case 'titleAsc':
        return (a.title || '').localeCompare(b.title || '');
      case 'subjectAsc': {
        const nameA = SUBJECT_MAP[a.subjectId]?.name || 'zzz';
        const nameB = SUBJECT_MAP[b.subjectId]?.name || 'zzz';
        return nameA.localeCompare(nameB);
      }
      default:
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }
  });
}

/**
 * Extract all unique tags present across items.
 */
export function getAllUniqueTags(items = []) {
  const tagsSet = new Set();
  items.forEach((item) => {
    if (Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        if (tag.trim()) tagsSet.add(tag.trim());
      });
    }
  });
  return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
}
