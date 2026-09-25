# Exercise 13 — Design & Scaffold the Task Management UI

| | |
|---|---|
| **Duration** | Approximately 20 minutes in a preconfigured environment |
| **Feature** | Local Agent — UI Scaffolding from API Spec |
| **Goal** | Use Copilot to scaffold a functional frontend for the ITMS that connects directly to the API you built |

---

## Background

Your ITMS API is now running and tested. The final step in this SDLC journey is a UI that the end user actually touches. Rather than designing screens from scratch, Copilot reads the **FRD user stories** and the **running API routes** to scaffold components that are already wired to real endpoints — no guesswork.

This exercise shows how the same document-driven approach you applied to backend code scales directly to frontend work. Every component maps to a `FR-ID` from `doc/frd.md`, and every API call uses the exact routes from `src/routes/` that you verified in Exercise 12.

> **Frontend choice:** The default UI stack is **React + TypeScript + Vite**. If your team chose a different backend language in Exercise 09, the frontend is still a separate choice; use React/Vite or explicitly select an equivalent framework. The API contract remains `/api/v1/` with the response envelope defined in Exercise 12.

## Prerequisites

Complete Exercises 05–12 as far as your environment requires and confirm that the relevant agent profiles, `doc/brd.md`, `doc/tsd.md`, `doc/frd.md`, `.github/copilot-instructions.md`, `doc/implementation-plan.md`, the shared prompt files under `.github/prompts/`, and the Exercise 12 API source exist. The API must be runnable on port 3000. Authentication and login are not required for this UI exercise because Exercise 12 does not implement them; if the TSD/FRD adds authentication, treat it as a separate integration concern.

---

## Step 1 — Scaffold the UI Project

**Action**

In Copilot Chat, select the local/workspace Agent mode if available and send:

```
Read #readFile:doc/frd.md (sections: User Roles & Permissions, UC-001 through UC-006)
and the actual API route files under src/routes/ to understand the available API endpoints.

Scaffold a frontend project for the ITMS inside a new ui/ folder at the workspace root.

Requirements:
- Framework: React + TypeScript + Vite (or the frontend framework of my choice)
- Folder structure:
    ui/src/components/    ← reusable UI components
    ui/src/pages/         ← full-page views
    ui/src/services/      ← API client functions (one file per resource)
    ui/src/types/         ← TypeScript types mirroring the API response shapes
- Create ui/src/services/api.ts as a shared Axios (or Fetch) client that:
    - Points to http://localhost:3000/api/v1 by default
    - Reads base URL from VITE_API_BASE_URL environment variable
    - Uses the { success, data, error, meta } envelope documented by the API
- Create ui/.env.example:
    VITE_API_BASE_URL=http://localhost:3000/api/v1
- Configure the API for browser access from the UI origin, including CORS or an equivalent development proxy.
- Add a README note that the API (Exercise 12) must be running before starting the UI

Do NOT implement any page content yet — scaffolding and API client only.
```

**Expected result**

The workspace contains a `ui/` scaffold, API client, environment example, shared response types, and browser connectivity configuration, but no page content.

**If unavailable**

If Agent mode or a `#readFile` reference is unavailable, attach the FRD and route files using the current Chat context control or provide the selected paths explicitly. Do not assume routes that are not present in the API source.

---

## Step 2 — Generate the Dashboard Page

**Action**

The Dashboard maps directly to **UC-006 (Project Progress Summary)** in `doc/frd.md`. Send:

```
Read the GET /api/v1/tasks endpoint in the actual route files and response types before generating the page.

Generate ui/src/pages/DashboardPage.tsx:
- Call GET /api/v1/tasks on load and derive summary counts from the response:
    Total tasks | Completed | In Progress | Blocked | To Do
- Display each count in a summary card (a simple styled div is fine — no external component library required)
- Show a task table below the summary cards with columns:
    Task ID | Title | Priority | Status | Assigned To | Estimated Completion Date
- Add a status badge: colour-code Completed (green), In Progress (blue), Blocked (red), To Do (grey)
- Wire the page into the router as the default route /

Keep each component under 50 lines. Extract the summary card into
ui/src/components/SummaryCard.tsx and the status badge into
ui/src/components/StatusBadge.tsx.
```

**Expected result**

The dashboard uses the real task-list response, derives the required progress counts, renders the task table and status badges, and provides navigation to create a task.

**If unavailable**

If the FRD or task route is unavailable, use `requirement.md` and the Exercise 12 endpoint contract, and mark any additional UI fields as assumptions.

---

## Step 3 — Generate the Create Task Form

**Action**

The Create Task form maps to **UC-001 (Task Creation)** and **UC-002 (Task Assignment)**.

```
Read #readFile:doc/frd.md UC-001 and UC-002, the POST /api/v1/tasks request body schema, and `src/data/users.json` to understand the seeded user shape.

Generate ui/src/pages/CreateTaskPage.tsx with a controlled form that:
- Copies or imports `src/data/users.json` into the UI application, for example as `ui/src/data/users.json`, and uses that bundled fixture for the Assigned To dropdown. Do not fetch users from an API: Exercise 12 does not define `GET /api/v1/users`.
- Collects: Title (required), Description, Priority (Low/Medium/High dropdown), Assigned To (user dropdown), Estimated Completion Date (date input)
- Validates required fields on the client before submitting — show inline error messages
- On submit, calls POST /api/v1/tasks with the correct request body
- On success (201), redirects to /tasks/:id of the newly created task
- On API error, displays the error.message from the response envelope
- Sends `estimatedCompletionDate` to match the Exercise 12 API contract

Wire the page into the router at /tasks/new.
Add a "Create Task" button on the DashboardPage that navigates to /tasks/new.
```

**Expected result**

The form validates and submits the documented task payload, populates assigned users from a bundled copy/import of `src/data/users.json`, handles the response envelope, and navigates to the created task.

**If unavailable**

If the selected frontend cannot copy or import the fixture cleanly, make assignment optional/manual and explain that no users endpoint or database-backed user lookup is available in Exercise 12. Do not invent an API route or silently require authentication.

---

## Step 4 — Generate the Task Detail & Status Update View

**Action**

Task Detail maps to **UC-003 (Dependencies)**, **UC-004 (Status Tracking)**, and the status history requirement from `doc/frd.md`.

```
Read UC-003, UC-004, and the endpoints:
  GET  /api/v1/tasks/:id (includes `dependencies[]` and `statusHistory[]` in Exercise 12)
  PATCH /api/v1/tasks/:id/status

Generate ui/src/pages/TaskDetailPage.tsx:
- Fetch and display all task fields (title, description, priority, status, assignee, estimated completion date)
- Display a "Dependencies" section using the task detail `dependencies[]` data: list each dependency task by title and status;
  if a dependency is not Completed, show a "Blocked by" warning
- Display a "Status History" section: a timeline list of status changes with changedBy and timestamp
- Add an "Update Status" dropdown with statuses supported by the API (`TO_DO`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`). Do not assume transitions that are not defined by the FRD/TSD. Add a "Save" button that calls PATCH /api/v1/tasks/:id/status
- After a successful status update, refresh the page data

Wire the page into the router at /tasks/:id.
Each section (Dependencies, StatusHistory, UpdateStatus) should be its own component
in ui/src/components/.
```

**Expected result**

The detail page reads the single documented task-detail response, displays dependency and history arrays, handles `TASK_BLOCKED` errors from the API, and refreshes after a successful status update.

**If unavailable**

If the API does not expose the embedded dependency/history arrays, stop and report the backend contract gap rather than calling undocumented `/dependencies` or `/history` routes.

---

## Step 5 — Run the UI

**Action**

Once all pages are scaffolded, send:

```
Install UI dependencies and start the development server:
1. cd ui && npm install (or the equivalent for the chosen framework)
2. Start the Vite dev server: npm run dev
3. Open http://localhost:5173 in the browser

Verify:
- Dashboard loads and shows task counts from the live API
- "Create Task" form submits successfully and redirects correctly
- Task Detail page shows dependencies and status history
- Status update persists after page refresh (the API writes to src/data/tasks.json)

If any step fails, diagnose the error and apply the fix before moving on.
```

> **Both servers must be running**: the API on port 3000 (Exercise 12) and the UI dev server on port 5173.

**Expected result**

The UI development server starts on its configured port, the browser can reach the API through the configured base URL and CORS/proxy, and the documented dashboard, create-task, detail, history, dependency, and status-update flows can be exercised.

**If unavailable**

If either server fails, preserve the exact error, verify the API is running before debugging the UI, and check the base URL, CORS/proxy configuration, and port availability before changing code.

---

## Checkpoint — End-to-End SDLC Complete

**Action**

Inspect the generated `ui/` files and compare them with the expected structure below.

At the end of this exercise you should have:

```
ui/
├── src/
│   ├── components/
│   │   ├── SummaryCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Dependencies.tsx
│   │   ├── StatusHistory.tsx
│   │   └── UpdateStatus.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── CreateTaskPage.tsx
│   │   └── TaskDetailPage.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── task.types.ts
└── .env.example
```

Every component traces back to a `UC-ID` in `doc/frd.md` — the same document that drove the API, the tests, and the security review.

**Expected result**

The expected UI structure exists, its components map to FRD/UC references, and its API calls match the routes and response shapes actually exposed by Exercise 12.

---

## Key Takeaway

> The same document-driven workflow — **FRD → architecture → prompt → Copilot generates** — works equally well for UI as it did for the API. You did not write a single component from scratch; you directed Copilot by referencing the FRD use cases and the exact API routes already in your workspace. This is how Copilot accelerates the *full* SDLC, not just backend code.

---

**Next**: [Exercise 14 — Unit & Functional Tests](exercise-14-testing.md)
