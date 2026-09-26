# Exercise 11 — Create an Implementation Prompt File

**Duration**: Approximately 7 minutes in a preconfigured environment
**Copilot Feature**: Prompt Files (`.prompt.md`)  
**Goal**: Package your implementation plan into a reusable prompt file that any team member can invoke.

---

## Background

A **Prompt File** (`.prompt.md`) in GitHub Copilot is a saved, reusable prompt. Unlike typing a prompt in chat, prompt files:
- Are stored in `.github/prompts/` and accessible to the whole team
- Can include instructions, context references, and parameterized inputs
- Can be invoked quickly from the Copilot Chat command palette

The **Implementation Plan prompt file** you create here captures the standard way to generate a development plan from the FRD for this project — and any future project following the same process.

## Prerequisite

Complete Exercises 09–10 and confirm that `doc/frd.md`, `doc/tsd.md`, `doc/implementation-plan.md`, and `.github/copilot-instructions.md` exist. Open this repository as a trusted VS Code workspace with Copilot Chat available.

---

## Step 1 — Understand the Prompt File Format

**Action**

A `.prompt.md` file looks like this:

```markdown
---
name: Prompt Name
description: "When to use this prompt"
---

# Prompt content here

Instructions for Copilot...
```

The `description` field may appear in the prompt picker when typing `/`, depending on the current VS Code/Copilot version.

**Expected result**

You can identify the YAML frontmatter and prompt body that a reusable prompt file requires. Prompt-picker labels and discovery behavior can vary by VS Code/Copilot version.

---

## Step 2 — Inspect the Pre-Built Prompt File

**Action**

Open and read the existing prompt file at `.github/prompts/implementation-plan.prompt.md`. Notice:
- The YAML frontmatter with `name` and `description`
- Instructions for structuring phases and task tables
- Rules about referencing FRD IDs and flagging Background Agent candidates

**Expected result**

The prebuilt prompt file exists and contains valid frontmatter plus implementation-plan instructions.

---

## Step 3 — Create a Custom Project-Specific Version

**Action**

Now create **your own** version tailored to your chosen tech stack. In Copilot Chat, use the prompt-file creation command if it is available, or create `.github/prompts/itms-implementation-plan.prompt.md` manually with the frontmatter and content below:

If the current Chat UI provides a prompt-file creation command, use it with the name `itms-implementation-plan` and paste the following content:

```
This prompt is specifically for the Intelligent Task Management System (ITMS) project.
When invoked, it should:
1. Read #readFile:doc/frd.md and #readFile:doc/tsd.md
2. Generate a phased implementation plan with our specific tech stack: [YOUR STACK e.g. TypeScript/Express/PostgreSQL]
3. Reference the correct folder structure: src/routes/, src/services/, src/repositories/, src/models/
4. Include database migration tasks using our tooling convention
5. Include tasks for OpenAPI spec generation
6. Flag tasks suitable for background agent execution

Format: phases as H2 headers, tasks as a table with columns: ID | Task | Effort | FRD Ref | Parallel? | Background Agent?
```

> Replace `[YOUR STACK]` with your choice from Exercise 09.

**Expected result**

`.github/prompts/itms-implementation-plan.prompt.md` exists with prompt-file frontmatter, the selected stack, the correct `doc/frd.md` and `doc/tsd.md` context references, and the requested output format.

**If unavailable**

If no prompt-file creation command is available, create the file manually using this structure:

```markdown
---
name: ITMS Implementation Plan
description: "Generate an ITMS implementation plan from the FRD and TSD."
---

[Paste the project-specific prompt content above here.]
```

---

## Step 4 — Use the Prompt File

**Action**

1. In Copilot Chat, type `/` and review the available prompt commands.
2. Search for `itms-implementation-plan` using the current prompt picker.
3. If it appears, select it and submit the prompt.
4. If it does not appear, refresh or reopen the workspace and verify the file location and frontmatter. You can also paste the prompt-file body into regular Chat.

**Expected result**

When prompt files are supported and discovered, `itms-implementation-plan` is available for selection and produces a fresh implementation plan when invoked. The exact picker label and invocation behavior depend on the current VS Code/Copilot version.

---

## Step 5 — Compare the Two Outputs

**Action**

Compare the intent and context of:
- The generic `.github/prompts/implementation-plan.prompt.md` (for any project)
- Your project-specific `itms-implementation-plan.prompt.md` (ITMS-specific folder conventions, stack, tools)

**Expected result**

The project-specific prompt references the ITMS stack and folders, while the generic prompt remains reusable across projects.

> This is why teams maintain both generic prompt libraries and project-specific ones.

---

---

**Next**: [Exercise 12 — Build APIs with Local Agent](exercise-12-api-local-agent.md)

> 🟡 **Optional stop available**: If your GitHub repository and Personal Access Token are configured, try [Exercise 17 — Create GitHub Issues via MCP](exercise-17-github-issues.md) before continuing to Exercise 12.
