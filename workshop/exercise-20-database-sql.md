# Exercise 20 — PostgreSQL Database Design, SQL Scripts & PL/pgSQL

**Duration**: Approximately 20–30 minutes in a preconfigured environment
**Copilot Feature**: Local Agent + Instructions  
**Goal**: Generate the PostgreSQL database schema, migration scripts, and seed data for the ITMS application, with optional advanced PL/pgSQL procedures and audit triggers.

---

> ---
> 🟡 **OPTIONAL EXERCISE**
>
> This exercise is **not required** to complete the mandatory track. It generates the core SQL schema, migrations, and seed data, with optional advanced procedures and triggers. Complete it if database-layer code generation is relevant to your role, or revisit it after the workshop.
>
> **Best after**: Exercise 12; use the optional Context Map from Exercise 19 if it exists &nbsp;|&nbsp; **Return to mandatory track**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
> ---

## Prerequisites

PostgreSQL is the primary database path for this exercise. Use a supported PostgreSQL version for your environment, a disposable development database, database/user/schema credentials, and a migration runner or documented SQL execution method. UUID, JSONB, foreign-key, and trigger capabilities are required where used by the generated schema. Docker may be used if it is available in your environment.

Never run generated migrations against production. Do not commit passwords or connection strings; keep secrets in environment variables or secure configuration. If PostgreSQL is unavailable, use the mock-data path and static SQL review instead.


## Background

Most business applications have critical business logic in the database layer — task dependency validation, transactional status updates, and audit triggers. This exercise generates a PostgreSQL schema, migrations, and seed data for ITMS, with optional advanced PL/pgSQL functions and PostgreSQL triggers.

> **If you don't have a database available**, follow the Mock Data path at the end of this exercise — Copilot will create JSON mock data with the same schema structure so your API can run without a real DB.

---

## Step 1 — Generate the Database Schema

**Action**

In Copilot Chat, use Agent mode if available. If Agent mode is unavailable, send the prompt in direct Chat or create the SQL files manually. Reference `doc/tsd.md` and `doc/frd.md` as the required architecture sources. Use `.github/skills/context-map/context-map.md` only if it exists; otherwise continue with the TSD, FRD, `requirement.md`, and the actual repository.

```
Reference the ER diagram in doc/tsd.md and the functional rules in doc/frd.md. If .github/skills/context-map/context-map.md exists, use it as additional context.

Create the database schema migration files in db/migrations/:

1. db/migrations/001_create_users.sql — Users / Team Members table
   Columns: id (UUID), email, first_name, last_name, department,
   role (ENUM: DEVELOPER/TEAM_LEAD/PROJECT_MANAGER/QA_ENGINEER),
   is_active, created_at, updated_at

2. db/migrations/002_create_tasks.sql — Tasks table
   Columns: id (UUID), title, description, priority (ENUM: LOW/MEDIUM/HIGH),
   status (ENUM: TO_DO/IN_PROGRESS/BLOCKED/COMPLETED),
   assigned_user_id (FK to users), estimated_completion_date,
   created_by (FK to users), created_at, updated_at, completed_at

3. db/migrations/003_create_task_dependencies.sql — Task Dependencies table
   Columns: id (UUID), task_id (FK), depends_on_task_id (FK),
   created_by (FK to users), created_at
   Constraint: UNIQUE(task_id, depends_on_task_id), no self-referencing

4. db/migrations/004_create_task_status_history.sql — Status History table
   Columns: id (UUID), task_id (FK), previous_status, new_status,
   changed_by (FK to users), changed_at, note

5. db/migrations/005_create_audit_log.sql — Audit trail
   Columns: id, table_name, record_id, operation (INSERT/UPDATE/DELETE),
   old_values (JSONB), new_values (JSONB), performed_by, performed_at

Add appropriate indexes on: assigned_user_id + status, task_id (dependencies), status + priority.
Add foreign key constraints with ON DELETE RESTRICT.
Use PostgreSQL syntax. Use roles only when confirmed by the TSD/FRD; otherwise label them as sample/assumption data. Do not add password storage or authentication behavior unless the TSD/FRD explicitly requires it.
```

**Expected result**

The workspace contains ordered PostgreSQL migration files under `db/migrations/` with the required task-domain tables, keys, constraints, and indexes, without assuming authentication or production infrastructure.

**If unavailable**

If the generated TSD/FRD or Agent/file-writing workflow is unavailable, generate a reviewed SQL design or file plan only. If PostgreSQL is unavailable, continue with static SQL review or the mock-data path; do not claim migrations were executed.

---

## Optional/Advanced Step 2 — Create Stored Procedures / Functions

**Action**

Send this prompt:

```
Create db/procedures/ with the following PL/pgSQL functions:

1. db/procedures/create_task.sql
   Function: create_task(p_title TEXT, p_description TEXT, p_priority TEXT, p_assigned_user_id UUID, p_estimated_completion_date DATE, p_created_by UUID) RETURNS UUID
   - Validates priority is one of LOW/MEDIUM/HIGH
   - Validates assigned_user_id exists in users table
   - Inserts task with initial status TO_DO
   - Inserts a status history record for the initial creation
   - Returns the new task ID
   - The caller should execute this operation within a transaction when atomicity is required

2. db/procedures/update_task_status.sql
   Function: update_task_status(p_task_id UUID, p_new_status TEXT, p_changed_by UUID, p_note TEXT) RETURNS VOID
   - Validates the new status is a valid enum value
   - If transitioning to IN_PROGRESS or COMPLETED: checks no unresolved dependency (i.e., no depends_on_task that is not COMPLETED)
   - Raises exception if task is BLOCKED due to incomplete dependencies
   - Updates task status
   - Inserts a status history record
   - Ensure the operation is atomic when invoked within a transaction

3. db/procedures/add_task_dependency.sql
   Function: add_task_dependency(p_task_id UUID, p_depends_on_task_id UUID, p_created_by UUID) RETURNS VOID
   - Checks for circular dependency before inserting
   - Inserts the dependency record
   - If depends_on_task is not COMPLETED, sets p_task_id status to BLOCKED and records in history
   - Ensure the operation is atomic when invoked within a transaction

4. db/procedures/resolve_task_dependency.sql
   Function: resolve_task_dependency(p_task_id UUID) RETURNS VOID
   - Called when a dependency task is marked COMPLETED
   - Checks all dependencies of tasks that depend on p_task_id
   - If all dependencies are now COMPLETED, unblocks those tasks (sets status back to TO_DO)
   - Ensure the operation is atomic when invoked within a transaction

5. db/triggers/audit_trigger.sql
   Trigger: Create a generic PostgreSQL audit trigger function that logs all INSERT/UPDATE/DELETE
   operations on tasks and task_dependencies to the audit_log table.
   Apply the trigger to both tables. Capture old/new values for relevant updates/deletes, serialize JSON/JSONB as appropriate, and derive `performed_by` only from available database/application context. Add status-history auditing only if required by the TSD/FRD or this exercise's scope.
```

Database-specific additions such as circular-dependency detection, automatic unblocking, audit triggers, and initial status history are database-layer extensions. Treat them as assumptions unless the TSD/FRD explicitly requires them.

**Expected result**

The workspace contains PostgreSQL/PL/pgSQL procedure and trigger definitions under `db/procedures/` and `db/triggers/`, with transaction-safe invocation wording and no internal COMMIT/ROLLBACK requirement for ordinary functions.

**If unavailable**

If SQL files cannot be generated or PostgreSQL is unavailable, skip this optional advanced step or produce a reviewed procedure/trigger design. Do not run generated SQL against production. The core schema/migration outcome remains complete without these procedures or triggers.

---

## Step 3 — Create Seed Data

**Action**

Send this prompt:

```
Create db/seeds/001_seed_data.sql with realistic test data:
- 10 users: 1 Project Manager, 2 Team Leads, 7 Developers/QA Engineers
- 20 sample tasks covering all priority levels (Low/Medium/High) and statuses (To Do/In Progress/Blocked/Completed)
- 5 task dependency relationships (some blocking, some resolved)
- Status history records showing a realistic progression of tasks

Use realistic names and UUIDs. Treat role assignments as sample/assumption data unless the TSD/FRD confirms those roles. Make sure the data is self-consistent (users exist before tasks reference them, dependencies reference valid task IDs).
```

The SQL seed dataset may be larger than the Exercise 12 JSON fixtures and does not automatically replace those fixtures.

**Expected result**

`db/seeds/001_seed_data.sql` contains self-consistent PostgreSQL seed data with valid users, tasks, dependencies, and status history.

**If unavailable**

If SQL generation or database execution is unavailable, review the seed file statically and do not claim that the seed was loaded.

---

## Step 4 — Mock JSON Path (No Database Available)

> Skip this step if you have a working database.

**Action**

If you don't have PostgreSQL available, send this prompt instead:

```
I don't have a database available. Create mock JSON data files in db/mock/ that replicate the database schema so the API can run with an in-memory data store.

Create:
- db/mock/users.json — 10 team members matching the users table schema
- db/mock/tasks.json — 20 sample tasks in different statuses and priorities
- db/mock/task_dependencies.json — 5 task dependency relationships
- db/mock/task_status_history.json — history records for task status changes
- db/mock/README.md — explains how to switch between real DB and mock data mode

Also create src/repositories/mock/ implementations of the repositories that read from these JSON files instead of querying the database.
```

Creating `db/mock/` and `src/repositories/mock/` does not automatically make the existing API use those repositories. Follow the application's existing repository/configuration abstraction and select the mock repositories only if the current application supports such a switch. If no switch exists, treat these files as reference/test artifacts rather than a replacement for Exercise 12's JSON repository. Do not invent an environment variable or configuration mechanism.

**Expected result**

The mock schema files and, where supported by the current application, mock repositories exist and are clearly documented as a separate data-source path.

**If unavailable**

If Copilot cannot create the mock files or the application has no repository-switch mechanism, review the mock design only and keep Exercise 12's JSON repository unchanged.

---

## Verify

**Action**

Check `db/` folder:

- [ ] Migration files are numbered and sequential (001_, 002_…)
- [ ] Each migration creates a table with all required columns
- [ ] Indexes are defined
- [ ] Optional/advanced stored procedures include transaction handling and exception raising
- [ ] Optional/advanced dependency blocking logic correctly sets task status to BLOCKED
- [ ] Optional/advanced audit trigger is created for the correct tables
- [ ] Seed data is self-consistent

Without a live database, verify file structure, naming, foreign-key definitions, indexes, trigger/function definitions, and seed validity by static review only. With a disposable development database, execute migrations in order, verify tables/keys/indexes/triggers/functions, and reset or roll back safely according to the chosen migration method before rerunning seeds.

**Expected result**

The generated SQL/mock artifacts match the TSD/FRD and the selected database path. Do not claim database execution passed without a live database.

**If unavailable**

If PostgreSQL, the migration runner, or database credentials are unavailable, complete the static verification checklist and report execution as not performed. Never use production credentials or run generated migrations against production.

---

---

**Return to Mandatory Track →**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
