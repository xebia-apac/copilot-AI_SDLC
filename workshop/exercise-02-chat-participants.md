# Exercise 02 — Chat Participants Workshop Demo

**Duration**: Approximately 8 minutes in a preconfigured environment
**Copilot Feature**: Copilot Chat participants (`@vscode`, `@terminal`, `@github`), chat context, and slash commands
**Goal**: Build on Exercise 01 by practicing requirement-focused prompts with chat participants, chat context, and slash commands.

---

## Background

**Chat participants** help you route a question to the right context so answers are faster and more accurate.

- `@vscode` explains editor actions and commands.
- `@terminal` explains command output and shell usage.
- `@github` helps with issues, pull requests, and collaboration workflows.

## Prerequisite

Complete Exercise 01 first and confirm that Copilot Chat opens and responds. Open this repository as a VS Code workspace so `requirement.md` is available.

## What You Will Learn

1. How to understand `requirement.md` using `#selection`.
2. How to move from simple explanation to structured requirement extraction.
3. How chat context and available slash commands speed up and focus responses.

### Step 0 — Open Copilot Chat in Ask Mode

**Action**

1. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette. Keyboard shortcuts can vary by platform and VS Code version.
2. Select **Ask** mode if a mode selector is available.

**Expected result**

Copilot Chat is open and ready for the prompts in this exercise. Keep Ask mode active for the participant and context prompts.

**If unavailable**

If Ask mode is not shown, continue in the default conversational Chat mode and note which mode is available in your VS Code version.

### Step 1 — `@github` for GitHub Workflow Guidance

**Action**

Send:

```text
@github Explain issues, pull requests, and when to use each in a workshop project.
```

**Expected result**

Copilot explains the purpose of issues and pull requests and when to use each in a workshop project.

**If unavailable**

If `@github` is not available, send the same question in regular Chat and continue. The goal is to understand the GitHub workflow, not to require a specific participant name.

### Step 2 — Add `requirement.md` to Chat Context

Chat context lets you reference a file without copying its contents into the prompt.

**Action**

1. Use the current Chat UI's file/context control, such as **Add Context**, **Attach**, or **Add file**, and select `requirement.md`.
2. If the UI supports it, drag `requirement.md` into the Chat input area instead.
3. Send:

```text
From the attached requirement.md, create a table with columns: Requirement, Priority, Reason.
```

**Expected result**

Copilot returns a table based on the contents of `requirement.md` with the requested columns.

**If unavailable**

If the file/context control is unavailable, open `requirement.md`, select the relevant text, and use `#selection` in the next step.

### Step 3 — Use `#selection`

**Action**

1. Open `requirement.md` and select only the **Functional Requirements** section.
2. In the existing Chat session, send:

```text
Summarize #selection in 6 short bullets for product stakeholders.
```

**Expected result**

Copilot summarizes only the selected Functional Requirements section in six short bullets.

**If unavailable**

If `#selection` is not recognized, attach or select the same section using the current Chat context control and ask Copilot to summarize only that content.

### Step 4 — Discover Available Slash Commands (Optional)

Slash commands and their names depend on the current VS Code and Copilot version. This discovery step is optional and does not require running every command.

**Action**

1. In the existing Chat input, type `/`.
2. Review the commands offered by the current environment.

**Expected result**

The command picker displays the slash commands currently available. Do not assume that `/fix`, `/tests`, or `/doc` are available or usable in Ask mode; they are only examples of commands that may appear.

**If unavailable**

If no command picker appears, continue with Step 5 using a regular Chat prompt.

### Step 5 — Explain the Attached Requirement File

**Action**

1. Keep `requirement.md` attached from Step 2. If it is no longer attached, add it again using the current Chat context control.
2. If `/explain` appears in the available command list, select it while the file is attached. Do not pass `requirement.md` as a filename argument.
3. If `/explain` is unavailable, send:

```text
Explain the attached requirement.md in plain language.
```

**Expected result**

Copilot explains the contents of the attached `requirement.md` in plain language.

**If unavailable**

If file context is unavailable, open `requirement.md`, select the relevant content, and ask regular Chat to explain the selection.

## Key Takeaways

- Use file context and `#selection` to control exactly what Copilot reads.
- `#selection` is focused on the highlighted text only.
- Slash commands can trigger specific Copilot actions, but the available commands depend on the current environment.
- Build prompts progressively: explain first, then extract, then structure.

---

**Next**: [Exercise 03 — Prompt Engineering Workshop](exercise-03-prompt-engineering-and-agents.md)

