# Exercise 07 — Generate the Technical Specification Document

**Duration**: Approximately 8 minutes in a preconfigured environment
**Copilot Feature**: TSD Custom Agent  
**Goal**: Use the TSD agent to design the system architecture from the BRD.

---

## Background

The TSD bridges business requirements and engineering. Your **TSD Author** agent acts as a Solutions Architect — it reads the BRD, proposes technology choices, designs the data model and API contracts, and produces a document the development team can build from.

## Prerequisite

Complete Exercise 06 and confirm that `.github/agents/tsd.agent.md`, `.github/agents/brd.agent.md`, and `doc/brd.md` exist. Open this repository as a VS Code workspace and confirm that `requirement.md` is present.

---

## Step 1 — Switch to the TSD Agent

**Action**

1. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette.
2. Open the agent selector or agents menu, if available.
3. Select **TSD Author**.

**Expected result**

The `TSD Author` agent is selected in the current Chat or agent context.

**If unavailable**

Refresh or reopen the workspace and confirm that `.github/agents/tsd.agent.md` has valid frontmatter. Agent selector labels and locations vary by VS Code and Copilot version.

---

## Step 2 — Send the TSD Generation Prompt

**Action**

Copy and paste this prompt into Chat:

```
Read #file:doc/brd.md and #file:requirement.md, then create a complete Technical Specification Document saved as doc/tsd.md.

Requirements:
- Include a Mermaid system architecture diagram showing all major components
- Include a Mermaid ER diagram for the database schema (include all tables needed for task management)
- Design REST API endpoints for the required task management, task assignment, task dependency, filtering, and progress-summary capabilities. If authentication or user-management endpoints are recommended, label them as assumptions or future scope because they are not specified in `requirement.md`
- Recommend a technology stack with justifications based on the stated requirements and NFRs; do not assume a cloud provider that is not specified
- Include security architecture addressing relevant OWASP Top 10 risks, and label security or deployment assumptions clearly
- Define a CI/CD pipeline architecture
- Trace every technical decision back to a BRD requirement ID
```

If either `#file` reference is not recognized, attach `doc/brd.md` and `requirement.md` using the current Chat context control and send the same request referring to the attached files.

**Expected result**

The selected TSD agent accepts the request and prepares to create `doc/tsd.md` from `doc/brd.md` and `requirement.md`.

---

## Step 3 — Monitor the Plan

**Action**

If Copilot presents a plan or review step before writing, check:
- It plans to read BOTH `doc/brd.md` AND `requirement.md`
- It mentions Mermaid diagrams
- It is NOT writing application code

Approve the plan using the available confirmation action. If no plan is shown, confirm that the selected agent and prompt are correct, then allow the current Chat flow to continue.

**Expected result**

Copilot proceeds with TSD generation without implementing application code.

---

## Step 4 — Ask for a Specific Architecture Decision (Optional)

After `doc/tsd.md` has been generated, optionally send this follow-up to see how the agent reasons about an integration assumption:

```
The system needs to handle email notifications and Teams webhook alerts. 
Update the Integration Points section in doc/tsd.md to cover:
- SendGrid for email (async via a message queue)
- Microsoft Teams webhook for manager alerts
- Include a sequence diagram showing the task status update notification flow
```

**Expected result**

The Integration Points section is updated with the requested SendGrid, Teams, message-queue, and sequence-diagram details. These integrations are optional assumptions and are not present in `requirement.md`.

---

## Key Takeaway

> The architecture designed here becomes the **source of truth** for the next exercises. Every API you build, every table you create, and every test you write will trace back to `doc/tsd.md`. This is how Copilot becomes a true SDLC co-pilot — not just a code generator, but an architectural collaborator.

---

**Next**: [Exercise 08 — Generate FRD](exercise-08-frd.md)
