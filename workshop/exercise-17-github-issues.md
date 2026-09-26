# Exercise 17 — Create GitHub Issues via MCP

**Duration**: Approximately 15–25 minutes in a preconfigured environment
**Copilot Feature**: GitHub MCP Server + Prompt File  
**Goal**: Convert the implementation plan into GitHub Issues using the GitHub MCP and the pre-built issues prompt file.

---

> ---
> 🟡 **OPTIONAL EXERCISE**
>
> This exercise is **not required** to complete the mandatory track. It requires an active GitHub repository and an authentication method with sufficient least-privilege permissions for the requested operations. Complete it here if your environment is configured, or revisit it independently after the workshop.
>
> **Best after**: Exercise 11 &nbsp;|&nbsp; **Return to mandatory track**: [Exercise 12 — Build APIs with Local Agent](exercise-12-api-local-agent.md)
> ---

## Prerequisites

Before Part C, confirm that the following are available:

- `doc/implementation-plan.md`, generated and saved during Exercises 10–11
- `.github/prompts/github-issues.prompt.md`
- GitHub authentication through the supported VS Code/MCP flow
- An existing GitHub repository, or permission to create one

The implementation plan must exist before issues can be generated.


## Background

The **Model Context Protocol (MCP)** lets Copilot interact with external systems. The configured GitHub MCP server may provide tools for issues, pull requests, branches, and other GitHub operations, depending on its version, configuration, permissions, and account policy.

In this exercise, you'll connect the GitHub MCP and use the `github-issues.prompt.md` file to prepare and, after review, create work items from your implementation plan.

---

## Part A — Install the GitHub MCP Server (One-Time Setup)

### Step 1 — Install or Configure the GitHub MCP

> **If GitHub MCP is already configured in your workspace, skip to Part B.**

**Action**

If GitHub MCP is not already configured, open the VS Code Command Palette (`Ctrl+Shift+P`) and search for:
```
MCP: Add Server
```

Select **GitHub MCP** from the registry:

1. In the search dialog, search for `github`.
2. Select the official [**GitHub MCP Server**](https://github.com/mcp/github/github-mcp-server) from the registry
3. When prompted, authenticate through the secure credential flow provided by VS Code/MCP. Create a least-privilege token only if the selected authentication method requires one.
4. Confirm the installation and complete any configuration steps required by the installed VS Code/Copilot version.
5. Reload or refresh the workspace if the installed version requires it.

For reference, see the [GitHub MCP Server repository](https://github.com/mcp/github/github-mcp-server).

Never paste a PAT into Copilot Chat. Never commit or store a token in workspace files. Revoke a temporary workshop token after use when appropriate.

**Expected result**

The configured GitHub MCP server is available in the current Copilot environment, or the participant has a supported manual configuration path for the installed VS Code/Copilot version.

**If unavailable**

If **MCP: Add Server** or the registry entry is unavailable, use the supported manual MCP configuration path for the installed VS Code/Copilot version. If organization policy blocks MCP, document that the MCP path cannot be used and continue with the manual GitHub.com fallback where practical.

---

## Part B — Create a GitHub Repository (if not already done)

**Action**

If you don't have a repository yet, use the GitHub MCP to create one when the configured tools and permissions support repository creation:

```
Using the GitHub MCP, create a new repository named "itms-app" with:
- Description: "Intelligent Task Management System — Workshop App"
- Private repository
- Initialize with a README
```

Note your repository as `[YOUR-USERNAME]/itms-app`, replacing `[YOUR-USERNAME]` with the GitHub username or owner. If MCP cannot create the repository, create it manually on GitHub.com and then continue with the exercise.

**Expected result**

An accessible repository is available as `[YOUR-USERNAME]/itms-app` for issue and milestone creation.

**If unavailable**

If repository creation is unavailable through MCP or GitHub.com, stop before Part C and report the missing permission or repository dependency.

---

## Part C — Generate Issues from the Implementation Plan

### Step 1 — Prepare and Run the Issues Prompt File

**Action**

In Copilot Chat, type `/` and search the current prompt picker for **GitHub Issues Generator** from `.github/prompts/github-issues.prompt.md`.

If prompt-file invocation is unavailable, open or attach `.github/prompts/github-issues.prompt.md`, or paste the prompt below directly into Chat:

```
Read doc/implementation-plan.md and convert it into GitHub Issues for the repository [YOUR-USERNAME]/itms-app.

For each task in the implementation plan, create a GitHub issue with:
- A clear title
- A description explaining what needs to be done
- Acceptance criteria as checkboxes
- Appropriate labels: backend, database, testing, infrastructure, security
- Milestone matching the Phase (Phase 0, Phase 1, etc.)

Create milestones for all phases present in the implementation plan. During this workshop exercise, create GitHub Issues only for Phase 0 and Phase 1 tasks. Remaining phase issues can be created later if desired.
Use the GitHub MCP to create them directly.
```

> Replace `[YOUR-USERNAME]` with your actual GitHub username or repository owner.

Before allowing MCP to create issues, review the proposed issue list and confirm the titles, descriptions, labels, milestones, and Phase 0/Phase 1 scope.

Ensure the required labels exist before issue creation: `backend`, `database`, `testing`, `infrastructure`, and `security`. Ensure milestones exist for every phase in the implementation plan. Create missing labels or milestones manually if MCP cannot create them.

If issue creation partially succeeds, check which issues already exist, do not recreate them, and resume with the remaining tasks to avoid duplicates.

**Expected result**

Milestones exist for every phase in the implementation plan, and reviewed GitHub Issues are created only for Phase 0 and Phase 1 tasks with the expected labels and milestone assignments.

**If unavailable**

If the prompt picker, MCP tools, or file context are unavailable, use the direct prompt with the configured GitHub MCP tools if possible. If MCP is blocked, generate the issue list for manual creation on GitHub.com instead of claiming that issues were created.

---

## Step 2 — Verify on GitHub

**Action**

Open your repository on GitHub (https://github.com/[YOUR-USERNAME]/itms-app/issues) and verify:

- [ ] Milestones exist for every phase present in the implementation plan
- [ ] Phase 0 and Phase 1 issues were created successfully
- [ ] Issues have the expected labels (backend, database, testing, infrastructure, security)
- [ ] Issues have acceptance criteria as checkboxes
- [ ] Issues have the correct milestone

**Expected result**

All phase milestones exist, and the reviewed Phase 0 and Phase 1 issues have the expected labels, acceptance criteria, and milestone assignments.

**If unavailable**

If the repository or issue page is unavailable, preserve the exact GitHub/MCP error and verify the repository owner, authentication, permissions, and created issue state before retrying.

---

## Step 3 — Create a Project Board (Optional)

**Action**

```
Using the configured GitHub MCP, add the Phase 1 issues to a new GitHub Project named "ITMS Sprint 1" if project-board tools are available. Configure workflow columns or statuses such as To Do, In Progress, and Done according to the current GitHub Projects UI.
```

This project-board step is optional and version-dependent.

**Expected result**

If supported and approved, the Phase 1 issues are added to the project with the configured workflow statuses.

**If unavailable**

Skip this optional step when project-board tools or the current GitHub Projects UI do not support it.

---

---

**Return to Mandatory Track →**: [Exercise 12 — Build APIs with Local Agent](exercise-12-api-local-agent.md)
