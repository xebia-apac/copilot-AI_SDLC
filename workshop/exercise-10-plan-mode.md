# Exercise 10 — Plan Mode: Generate Implementation Plan

**Duration**: Approximately 8 minutes in a preconfigured environment
**Copilot Feature**: Plan Mode (Copilot Edits)  
**Goal**: Use Plan Mode to let Copilot reason through the full implementation strategy before writing any code.

---

## Background

**Plan Mode** in GitHub Copilot is a planning workflow where Copilot analyzes the task, identifies affected files and components, and may present an execution plan before taking action. You review and approve — or modify — the plan before switching to an implementation mode.

This is especially valuable for large tasks (like "implement the entire task module") where you want to verify the approach first.

## Prerequisite

Complete Exercises 05–09 and confirm that `doc/brd.md`, `doc/tsd.md`, `doc/frd.md`, and `.github/copilot-instructions.md` exist. Open this repository as a trusted VS Code workspace with Copilot Chat available.

---

## Step 1 — Switch to Plan Mode

**Action**

In Copilot Chat:
1. Open the mode selector or agent/mode menu, if available.
2. Select **Plan**. Depending on the current VS Code/Copilot version, it may appear as **Plan Mode**, a plan icon, or another planning option.

**Expected result**

The current Chat session indicates that planning mode is active, or Copilot accepts the planning request without entering an implementation mode.

**If unavailable**

If Plan mode is not shown, send the planning prompt in regular Chat and explicitly ask Copilot to return a plan only and make no file changes.

---

## Step 2 — Send the Implementation Planning Prompt

**Action**

Copy and paste this prompt into Chat:

```
Read #file:doc/frd.md and #file:doc/tsd.md carefully.

Generate a complete, phased implementation plan for the Intelligent Task Management System (ITMS).

Use the current BRD/TSD/FRD and confirmed requirements as the source of truth. Include implementation work as mandatory only when it is required by those artifacts. Mark authentication, notifications, monthly reporting, exports, or any other unsupported capability as Optional or Future Scope; do not present it as mandatory work or a required dependency.

Structure the plan as:
- Phase 0: Project setup, folder structure, database migration tooling, CI skeleton
- Phase 1: Authentication & User Management (registration, login, JWT, RBAC) — label as future scope or an assumption unless supported by the FRD/TSD
- Phase 2: Task Management (task creation, assignment, dependencies, status tracking)
- Phase 3: Task Reporting & Progress Summary (project progress, task filters, export)
- Phase 4: Notifications (email via SendGrid, Teams webhooks) — label as optional integrations unless supported by the FRD/TSD
- Phase 5: Reporting (monthly reports, CSV/PDF export) — label as future scope unless supported by the FRD/TSD
- Phase 6: Testing, security hardening, and documentation

For each phase, list tasks with:
- Task ID (T-001, T-002...)
- Title
- Effort (S/M/L where S=<4h, M=4-8h, L=8-16h)
- FRD reference (FR-ID or US-ID)
- Whether it can run in parallel or must be sequential
- Whether it's a good candidate for Background Agent (long, self-contained tasks)

Do NOT create any files yet. Show me the plan first.
```

If either `#file` reference is not recognized, attach `doc/frd.md` and `doc/tsd.md` using the current Chat context control and send the same request referring to the attached files.

**Expected result**

Copilot returns a phased plan in Chat without creating or modifying files. It should contain seven phases, numbered Phase 0 through Phase 6.

---

## Step 3 — Review the Plan

**Action**

If Copilot returns a plan, check:

- [ ] All 7 phases are covered (Phase 0 through Phase 6)
- [ ] Phase 0 includes project scaffolding tasks
- [ ] Tasks reference FRD IDs
- [ ] Some tasks are flagged as Background Agent candidates
- [ ] Effort estimates seem reasonable (Phase 1 ≈ 3–5 days total)

**Expected result**

The plan covers the requested phases, references FRD IDs, identifies parallel and Background Agent candidates, and does not modify files.

If no plan is shown, confirm that the correct files were attached or referenced and that the planning request explicitly asked for a response without file changes.

---

## Step 4 — Refine the Plan

**Action**

Ask Copilot to adjust if needed. Example refinements:

```
Move the JWT middleware task to Phase 0 since all phases depend on it.
Also add a task for setting up the OpenAPI/Swagger documentation scaffold in Phase 0.
```

After refinement, approve or accept the plan using the available Chat action. Then switch back to the default/local Agent mode, if available, and send:

```
Save the approved implementation plan exactly as reviewed to doc/implementation-plan.md. Do not create or modify any other files.
```

**Expected result**

Copilot saves the approved plan to `doc/implementation-plan.md` and does not change unrelated files. If you are only reviewing the plan, do not run this save request.

---

## Verify

**Action**

If you saved the plan in Step 4, open `doc/implementation-plan.md` and confirm:

- [ ] All phases are present
- [ ] Tasks have IDs, effort estimates, and FRD references
- [ ] Background Agent candidates are flagged
- [ ] Total effort per phase is summarized

**Expected result**

The saved implementation plan matches the approved Chat plan and contains all seven phases, task metadata, and phase effort summaries.

---

## Key Takeaway

> Plan Mode prevents "tunnel vision" — where Copilot dives into implementation and creates a solution that doesn't fit the full picture. By reviewing the plan first, you catch architectural gaps and poor task ordering **before** they become code debt. On real projects, this 5-minute review often saves hours of rework.

---

**Next**: [Exercise 11 — Create Implementation Prompt File](exercise-11-implementation-prompt.md)
