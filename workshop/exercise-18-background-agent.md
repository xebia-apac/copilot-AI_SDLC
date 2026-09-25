# Exercise 18 — Assign an Independent Task to the Background Agent

**Duration**: Approximately 15–25 minutes in a preconfigured environment
**Copilot Feature**: Background Agent  
**Goal**: Delegate a long, self-contained coding task to the Background Agent and continue working while it runs.

---

> ---
> 🟡 **OPTIONAL EXERCISE**
>
> This exercise is **not required** to complete the mandatory track. The Background Agent runs tasks asynchronously in a sandboxed environment — it is self-contained and does not block any later exercise. Try it after Exercise 12 if time permits.
>
> **Best after**: Exercise 12 &nbsp;|&nbsp; **Return to mandatory track**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
> ---

## Prerequisites

Before starting, confirm:

- Exercise 12's API implementation is complete.
- `doc/tsd.md`, `doc/frd.md`, `.github/copilot-instructions.md`, and the existing `src/` implementation exist.
- The project is in a GitHub-hosted repository with a clean working tree or safe working branch.
- You have push, branch, and pull-request permissions for the repository.
- Background Agent is available for your Copilot account/plan and is allowed by organization policy.
- GitHub authentication is configured, and the Background Agent is permitted to access the repository.


## Background

The **Background Agent** runs Copilot tasks in the background — inside a sandboxed environment, asynchronously — while you keep working in your main VS Code session. It's perfect for:
- Long-running code generation tasks (generate all CRUD endpoints, write all tests)
- Tasks that don't need your immediate attention
- Parallel workstreams (you write one feature while Copilot writes another)

When the Background Agent finishes, it may provide a branch, changes, or a pull request for review. The exact workflow depends on the current VS Code/Copilot version, account, repository permissions, branch protection, and organization policy.
---

## Step 1 — Launch the Background Agent

**Action**

In Copilot Chat, open the agent menu and select the available Background Agent option. The label may differ by VS Code/Copilot version, account, or organization policy.

Background Agent is a hosted/asynchronous workflow and is distinct from GitHub Copilot CLI; Copilot CLI installation is not required for this VS Code exercise.

**Expected result**

A Background Agent session is available and can access the target GitHub repository.

**If unavailable**

Skip this optional exercise. If you intentionally want local changes instead, use the local Agent workflow, but do not treat it as an equivalent asynchronous Background Agent session or PR workflow.

---

## Step 2 — Assign the Task Assignment API Task

**Action**

This task is a good background candidate because it's:
- Self-contained (doesn't depend on your current work)
- Well-defined (we have the FRD and TSD to guide it)
- Time-consuming (multiple controllers, services, repositories)

Copy and paste this prompt into the Background Agent:

```
You are working in the ITMS (Intelligent Task Management System) project.

Read:
- doc/tsd.md (API design section — Task Assignment and Dependency endpoints)
- doc/frd.md (Use Cases UC-002 Task Assignment, UC-003 Task Dependency Management)
- .github/copilot-instructions.md (coding standards)
- The existing code in src/ to understand the folder structure and patterns

Before changing anything, inspect the actual TSD/FRD and existing route files. Implement only endpoints and behavior explicitly defined in those documents and the existing API implementation. Do not invent routes just to make this task work. If assignment or dependency endpoints are not defined by the TSD/FRD, skip those capabilities or implement only the parts supported by the existing contract. Do not invent authentication or login endpoints: authentication is not part of the default Exercise 12 implementation.

When assignment functionality is explicitly defined by the TSD/FRD and existing routes, implement the documented assignment endpoint and behavior:
   - Accepts the documented assignment payload
   - Reassigns the task to the specified user
   - Records previous assignee in task history if the existing history model supports it
   - Adds a logging-only notification stub for the reassignment event; do not add email, Teams, or external notification integrations

When dependency functionality is explicitly defined by the TSD/FRD and existing routes, implement the documented dependency behavior:
   - Accepts the documented dependency payload
   - Creates a dependency link between tasks
   - If a referenced dependency task is not Completed, applies the documented blocking behavior

Do not add assignment or dependency routes if the TSD/FRD and existing API do not define them.

For the existing task API, preserve these routes and contracts exactly:
1. GET /api/v1/health
2. POST /api/v1/tasks
3. GET /api/v1/tasks
4. GET /api/v1/tasks/:id
5. PATCH /api/v1/tasks/:id/status
   - Accepts: { status } (To Do / In Progress / Blocked / Completed)
   - Preserves the existing Exercise 12 status-transition rules from the TSD/FRD
   - Records status change in task history

Preserve the existing `{ success, data, error, meta }` response envelope, `TaskBlockedError`/`TASK_BLOCKED` behavior, and embedded `dependencies[]` and `statusHistory[]` structures. Assignment history and notification logging are extensions to the existing implementation, not assumed pre-existing behavior.

Create or update only the service, repository, model, route, and test files needed for these changes. Use exact API paths from the existing TSD/FRD; if a path is not defined there, stop and ask for a decision rather than inventing one. Add tests for each new or changed endpoint.

Do not include secrets or tokens in generated code. Before allowing external changes, review the proposed plan and confirm the target repository, branch, and feature scope. A pull request may be created only if the current Background Agent environment and repository permissions support it.
```

**Expected result**

The Background Agent proposes the requested assignment, dependency, and status work against the existing code and contracts, including tests, without adding authentication or external notification integrations by assumption.

**If unavailable**

If the Background Agent cannot access the repository or required artifacts, stop and report the missing dependency. Do not switch silently to a local edit workflow.

---

## Step 3 — Continue Working

**Action**

While the background agent runs:
- **Continue in your local session** — optionally move to Exercise 19 (Context Map) only if you choose to complete that separate optional exercise.
- The background agent works independently and won't interrupt you

**Expected result**

You can continue local work while the Background Agent runs, without assuming that Exercise 19 is required.

**If unavailable**

If no Background Agent session starts, skip this optional exercise and do not proceed as though an asynchronous task is running.

---

## Step 4 — Review the Pull Request

**Action**

When the background agent finishes (typically 5–15 minutes for this task), it may:
1. Provide whatever branch, changes, or pull-request review workflow the current environment supports.
2. Review the proposed changes before applying or merging anything.

Review the changes:
- [ ] All 4 endpoints are implemented
- [ ] Dependency blocking logic works correctly (task becomes Blocked when dependency is incomplete)
- [ ] Task history records all assignment and status changes
- [ ] Code follows the same patterns as the existing `src/` files
- [ ] Tests for new or changed endpoints pass
- [ ] No secrets or tokens were added
- [ ] No unrelated files changed
- [ ] The response envelope and `TaskBlockedError`/`TASK_BLOCKED` contract are preserved
- [ ] The target repository and branch are correct

Apply local changes only after reviewing the proposed work. If a pull request exists, inspect its full diff and checks separately; applying local changes and merging a pull request are not the same operation. Merge only after the diff, tests, target repository, and branch are acceptable.

**Expected result**

The changes are reviewed and either safely applied locally or reviewed through a pull request. No merge or external change occurs without participant approval.

**If unavailable**

If no branch, changes, or pull request is provided, preserve the Background Agent output and report the unsupported workflow rather than claiming completion.

---

## Key Takeaway

> Background Agent is a **parallel workstream**. On a real project, you might assign 4–5 long tasks to background agents (e.g., write all CRUD for users, write all CRUD for task priorities, write all notifications, generate all tests) while you focus on the complex business logic. Each session may provide a branch or PR for review, depending on the environment; review and merge only when supported and appropriate. This can compress long-running work into parallel review cycles.

---

**Next optional**: [Exercise 19 — Context Map Skill](exercise-19-context-map.md)

**Return to Mandatory Track →**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
