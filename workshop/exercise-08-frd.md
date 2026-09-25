# Exercise 08 — Generate the Functional Requirements Document

**Duration**: Approximately 8 minutes in a preconfigured environment
**Copilot Feature**: FRD Custom Agent  
**Goal**: Use the FRD agent to create testable user stories and use cases from the BRD and TSD.

---

## Background

The FRD is the document development teams and QA engineers work from directly. It breaks down business requirements into **use cases**, **user stories with Gherkin acceptance criteria**, and a **permissions matrix**. The FRD Author agent synthesizes the BRD and TSD into this developer-ready document.

## Prerequisite

Complete Exercises 05–07 and confirm that `.github/agents/frd.agent.md`, `.github/agents/tsd.agent.md`, `.github/agents/brd.agent.md`, `doc/brd.md`, and `doc/tsd.md` exist. Open this repository as a VS Code workspace and confirm that `requirement.md` is present.

---

## Step 1 — Switch to the FRD Agent

**Action**

1. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette.
2. Open the agent selector or agents menu, if available.
3. Select **FRD Author**.

**Expected result**

The `FRD Author` agent is selected in the current Chat or agent context.

**If unavailable**

Refresh or reopen the workspace and confirm that `.github/agents/frd.agent.md` has valid frontmatter. Agent selector labels and locations vary by VS Code and Copilot version.

---

## Step 2 — Send the FRD Generation Prompt

**Action**

Copy and paste this prompt into Chat:

```
Read #file:doc/brd.md, #file:doc/tsd.md, and #file:requirement.md. Create a comprehensive Functional Requirements Document and save it as doc/frd.md.

Include:
- A User Roles & Permissions Matrix using relevant ITMS roles. If Developer, Team Lead, Project Manager, and QA Engineer are used, identify them as role assumptions because they are not defined in requirement.md
- Detailed use cases for: Task Creation (UC-001), Task Assignment (UC-002), Task Dependency Management (UC-003), Task Status Tracking (UC-004), Task Listing and Filtering (UC-005), Project Progress Summary (UC-006)
- User stories for each use case with Given/When/Then acceptance criteria in Gherkin format
- A complete Functional Requirements Catalogue with FR-IDs linked to requirement sections
- Data validation rules for all input fields (Task ID, title, priority, status, dates)
- Notification triggers for task reassignment, dependency blocking, and status changes only where supported by the BRD/TSD; label any additional notification behavior as an assumption
- Error scenarios and user-facing error messages
```

If any `#file` reference is not recognized, attach `doc/brd.md`, `doc/tsd.md`, and `requirement.md` using the current Chat context control and send the same request referring to the attached files.

**Expected result**

The selected FRD agent accepts the request and prepares to create `doc/frd.md` using the BRD, TSD, and original requirement.

**If unavailable**

If the FRD agent or file context is unavailable, do not proceed as though the document-driven flow is active. Verify the prerequisite files and agent profile, then use the current Copilot documentation for the available agent and context controls.

## Checkpoint — Docs Complete

**Action**

After Copilot finishes, inspect the generated files and confirm the FRD was created alongside the BRD and TSD:

You should now have:

```
doc/
├── brd.md    ← Business requirements (from Exercise 06)
├── tsd.md    ← Technical architecture (from Exercise 07)
└── frd.md    ← Functional requirements + user stories (this exercise)
```

These three documents form the **specification foundation** for all remaining exercises. Every piece of code, database schema, test, and deployment script will trace back to one of these files.

**Expected result**

`doc/frd.md` exists and contains use cases UC-001 through UC-006, traceable FR-IDs, Gherkin acceptance criteria, validation rules, and clearly labeled role or notification assumptions.

---

## Key Takeaway

> Notice how each agent built on the previous output. BRD → TSD → FRD is the natural SDLC chain, and each agent was pre-wired to read the prior document. This is the power of **document-driven agentic workflows** — Copilot maintains context across the entire specification phase without you having to copy-paste content.

---

**Next**: [Exercise 09 — Create Custom Instructions](exercise-09-custom-instructions.md)
