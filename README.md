# Interview Preparation Tracker

**Interview Preparation Tracker** is a full-stack web application engineered with **React, Vite, Node.js, Express, Mongoose, and MongoDB**. It provides a single-pane dashboard and specialized operational modules to help aspiring engineers systematically plan, track, and conquer technical and behavioral interviews.

---

## Architecture Overview

```text
                  ┌────────────────────────────────────────────────────────┐
                  │                    React Frontend                      │
                  │   (Vite, React Router, Design Tokens, Dark UI System)  │
                  └───────────────────────────┬────────────────────────────┘
                                              │ HTTP / JSON (REST APIs)
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 Express.js REST APIs                   │
                  │   (Routing, Controllers, Validation, Error Handling)   │
                  └───────────────────────────┬────────────────────────────┘
                                              │ Mongoose ODM
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 MongoDB Database                       │
                  │ (Tasks, Interviews, Applications, Notes, Resources)   │
                  └────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, Vite, React Router 7, Modern CSS Design System (Dark SaaS theme, custom variables, WCAG-compliant contrast, responsive 1440px / 900px / 390px layouts, `prefers-reduced-motion`).
- **Backend:** Node.js (v24), Express 4 (ES Modules), CORS, Mongoose 8.
- **Database:** Local MongoDB Community Server (`mongodb://127.0.0.1:27017/interview_preparation_tracker`).

---

## Application Modules & Features

1. **Dashboard (`/`)**
   - Live aggregated summary metrics directly synced with MongoDB (`GET /api/dashboard/summary`).
   - "Today's Preparation Plan" with inline completion toggling and task creation.
   - Core CS Subject Mastery breakdown (DSA, System Design, DBMS, OS, Networks, OOP).
   - "Upcoming Interviews" displaying scheduled rounds (filters out completed/cancelled rounds) with modal scheduling.
   - Weekly activity timeline and recent event stream.

2. **Preparation Tracker (`/tracker`)**
   - Full CRUD task management (title, subject, difficulty, priority, estimated duration, due date).
   - Filter by subject, difficulty level, priority, and completion status.
   - Real-time search and multi-criteria sorting (by due date, priority, title, duration).
   - Modal inspection with rich task details and confirmation dialog for deletion.

3. **Interview Schedule (`/schedule`)**
   - Dual-view interface: **Interactive Monthly Calendar** and **Chronological Agenda**.
   - Round management (company, target role, stage, date, time, duration, meeting format, status, notes).
   - Filter by timeframe (Upcoming, This Week, This Month, Past), status, format, and stage.
   - Quick status transition buttons (`Scheduled`, `Confirmed`, `Completed`, `Cancelled`).

4. **Job Applications Management (`/applications`)**
   - Dual-view interface: **Kanban Pipeline Board** and **Sortable Data Table**.
   - 7-stage pipeline: `Wishlist`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
   - Comprehensive metadata tracking (company, role, work mode, salary range, contact person, email, job URL, notes).
   - Filter by status and work mode with inline status advancement.

5. **Notes & Resources Library (`/notes`)**
   - Unified repository supporting both **Markdown Revision Notes** and **External Learning Resources**.
   - Categorization by CS subject, topics, and searchable tags.
   - Favorite pinning and quick clipboard copy.
   - Filtering by content type (`All`, `Notes`, `Resources`, `Favorites`) and subject tracks.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | System and MongoDB connection health status |
| `/api/dashboard/summary` | GET | Aggregated counts for tasks, interviews, applications, and library |
| `/api/tasks` | GET, POST | List tasks (with filters & search) / Create a new task |
| `/api/tasks/:id` | GET, PATCH, DELETE | Retrieve / update / delete task by ID |
| `/api/interviews` | GET, POST | List interviews / Create new interview round |
| `/api/interviews/:id` | GET, PATCH, DELETE | Retrieve / update / delete interview by ID |
| `/api/applications` | GET, POST | List job applications / Create new application |
| `/api/applications/:id` | GET, PATCH, DELETE | Retrieve / update / delete application by ID |
| `/api/notes` | GET, POST | List revision notes / Create new note |
| `/api/notes/:id` | GET, PATCH, DELETE | Retrieve / update / delete note by ID |
| `/api/resources` | GET, POST | List learning resources / Create new resource |
| `/api/resources/:id` | GET, PATCH, DELETE | Retrieve / update / delete resource by ID |

---

## Quickstart & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port 27017

### 1. Backend Setup
```bash
# In terminal 1:
cd backend
npm install
npm run dev
```
The Express backend starts at `http://127.0.0.1:5000` and automatically connects to MongoDB. Verify health:
```bash
curl http://127.0.0.1:5000/api/health
```

### 2. Frontend Setup
```bash
# In terminal 2:
cd frontend
npm install
npm run dev
```
The React + Vite application will be running at `http://localhost:5173`.

---

## Academic Demonstration Walkthrough

When presenting this project for an evaluation or demo, follow this sequence:

1. **Architecture & Health (1 Minute)**
   - Open browser to `http://localhost:5000/api/health`.
   - Show `{ "status": "ok", "database": { "status": "connected" } }` proving live database connectivity.

2. **Dashboard Overview (2 Minutes)**
   - Open `http://localhost:5173`.
   - Highlight the dark SaaS visual identity, responsive typography, and navigation sidebar.
   - Point out the 4 summary metrics cards reflecting live counts from MongoDB.
   - Toggle a task checkbox in "Today's Preparation Plan" — observe the dynamic recalculation of completion rate and activity stream.
   - Click "Add Preparation Task" or "Schedule Interview" directly from the dashboard header and demonstrate instant persistence.

3. **Preparation Tracker (`/tracker`) (2 Minutes)**
   - Filter tasks by Subject (`dsa`, `system-design`) and toggle priority filters.
   - Create a new practice task, click on it to open the Task Detail Modal, edit the details, and mark it complete.
   - Search across tasks in real-time.

4. **Interview Schedule (`/schedule`) (2 Minutes)**
   - Toggle between **Calendar View** and **Agenda View**.
   - Show how scheduled rounds are rendered on their specific calendar date cells.
   - Advance an interview round from `Scheduled` to `Confirmed` or `Completed`.
   - Return to the Dashboard and show that `Completed` interviews are cleanly excluded from the "Upcoming Interviews" card while remaining in the schedule history.

5. **Job Applications Pipeline (`/applications`) (2 Minutes)**
   - Showcase the **Kanban Board** with applications distributed across 7 pipeline stages.
   - Switch to **Table View** to show detailed columns (Salary, Work Mode, Application Date).
   - Move an application stage or add a new job lead.

6. **Notes & Resources Library (`/notes`) (1 Minute)**
   - Filter by "Favorites" or "Notes".
   - Open a technical note, edit content, and copy a snippet to the clipboard with one click.
   - Add a new reference resource with tag support.
