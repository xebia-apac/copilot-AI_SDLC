# Exercise 06 — Generate the Business Requirements Document

**Duration**: Approximately 6 minutes in a preconfigured environment
**Copilot Feature**: BRD Custom Agent  
**Goal**: Use the BRD agent to generate a professional BRD from `requirement.md`.

---

## Background

Now that your `BRD Author` agent is set up, you'll use it to produce a formal Business Requirements Document. The agent will read `requirement.md`, apply BA best practices, structure the document properly, and save it to `doc/brd.md` — without you writing a single line.

## Prerequisite

Complete Exercise 05 and confirm that `.github/agents/brd.agent.md` exists and the `BRD Author` agent is discoverable. Open this repository as a VS Code workspace and confirm that `requirement.md` is present.

---

## Step 1 — Open Copilot Chat and Select the BRD Agent

**Action**

1. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette.
2. Open the agent selector or agents menu, if available.
3. Select **BRD Author**.
4. Use Agent mode if a mode selector is available.

**Expected result**

The `BRD Author` agent is selected and its name appears in the current Chat or agent context.

**If unavailable**

Refresh or reopen the workspace and confirm that `.github/agents/brd.agent.md` has valid frontmatter. Agent selector labels and locations vary by VS Code and Copilot version.

---

## Step 2 — Send the BRD Generation Prompt

**Action**

Copy and paste the following prompt into Chat:

```
Read the project requirements from #file:requirement.md and create a comprehensive Business Requirements Document. Save it as doc/brd.md.

Make sure to:
- Number all requirements uniquely (BR-F-001, BR-NF-001, BR-R-001...)
- Include a stakeholder table with interests and influence levels
- Include a risks and mitigations table
- Add a glossary of domain terms
- Keep it suitable for business and non-technical stakeholders
```

If `#file:requirement.md` is not recognized, attach `requirement.md` using the current Chat context control and send the same prompt referring to the attached file.

**Expected result**

The selected BRD agent accepts the request and prepares to create `doc/brd.md` using `requirement.md`.

---

## Step 3 — Review Copilot's Plan

**Action**

If Copilot presents a plan or review step before writing, inspect it to ensure:
- It understood the domain (task management)
- It plans to create `doc/brd.md`
- It isn't proposing any code

Approve the plan using the available confirmation action, such as **Continue** or **Keep**.

**Expected result**

Copilot proceeds with the approved BRD generation. If no plan is shown, confirm the prompt and agent selection, then allow the agent to continue according to the current Chat flow.

---

## Step 4 — Inspect the Output

**Action**

Once Copilot finishes, open `doc/brd.md` and check:

- [ ] Executive Summary captures the business problem
- [ ] Functional requirements present with numbers
- [ ] Non-functional requirements have measurable criteria where appropriate, with assumptions clearly identified
- [ ] All task features from `requirement.md` are captured
- [ ] A stakeholder table exists with relevant project roles, such as Developer, Team Lead, Project Manager, and QA Engineer

**Expected result**

`doc/brd.md` exists and contains a structured BRD grounded in `requirement.md`, with uniquely numbered requirements, stakeholder and risk tables, and a glossary.

---

## Key Takeaway

> The BRD agent gives Copilot a **persistent, reusable role**. Compare this to asking the default agent "write a BRD" — you'd need to re-explain the structure every time. Agents encode your standards once and apply them consistently.

---

**Next**: [Exercise 07 — Generate TSD](exercise-07-tsd.md)
