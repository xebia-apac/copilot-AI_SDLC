# Exercise 04 — Agents, Skills, Instructions, and Prompts

**Duration**: Approximately 10 minutes in a preconfigured environment
**Copilot Feature**: Custom Agents, Skills, Instructions, and Prompt Files
**Goal**: Understand the four Copilot artifact types and create a simple example of each.

Building great experiences with GitHub Copilot starts with understanding the core primitives that shape how Copilot behaves in different contexts. This article clarifies what each artifact does, how it is packaged inside this repository, and when to use it.

## Prerequisite

Complete Exercises 01–03 and confirm that Copilot Chat is available. Open this repository as a VS Code workspace. The directories and files created in this exercise do not exist in the starting repository; create them as part of the activities below.

## Agents

Agents are configuration files (`*.agent.md`) that describe:

- The tasks they specialize in (for example, "Terraform Expert" or "LaunchDarkly Flag Manager").
- Which tools or MCP servers they can invoke.
- Optional instructions that guide the conversation style or guardrails.

When you use a custom agent in Copilot Chat, its configuration lets you use a specialized assistant. Workspace custom agents for this lab live under `.github/agents/` and include metadata about the tools they depend on. An agent may also be available in other Copilot experiences, depending on your account and environment.

### When to reach for an agent

- You have a recurring workflow that benefits from deep tooling integrations.
- You want Copilot to proactively execute commands or fetch context via MCP.
- You need persona-level guardrails that persist throughout a coding session.

> **Try It: Create an Agent**
>
> **Action**
> 1. Open GitHub Copilot Chat.
> 2. Use the agent selector or agents menu, if available, and choose the option to configure or create a custom agent.
> 3. Save the agent as `.github/agents/my-first.agent.md`.
>
> **Expected result**
>
> A `.agent.md` file exists under `.github/agents/` and the agent is available in the agent selector after the workspace refreshes.
>
> **If unavailable**
>
> Create the directory and file manually, then add valid agent frontmatter and reopen or refresh the workspace so Copilot can discover it.

## Skills

Skills are self-contained folders that package reusable capabilities for GitHub Copilot. Each skill lives in its own directory and contains a `SKILL.md` file along with optional bundled assets such as reference documents, templates, and scripts.

A `SKILL.md` defines:

- A **name** and description used for skill discovery. Depending on the current Copilot version, a skill may be available through a slash command, agent selection, or automatic agent discovery.
- A **description** that tells agents and users when the skill is relevant.
- Detailed instructions for how the skill should be executed.

### When to reach for a skill

- You want to standardize how Copilot responds to a recurring task.
- You need bundled resources (templates, schemas, scripts) to complete the task.
- You want agents to discover and invoke the capability automatically.

> **Try It: Define a Skill**
>
> **Action**
> 1. Create the folder `.github/skills/code-reviewer/`.
> 2. Create `.github/skills/code-reviewer/SKILL.md`.
> 3. Add frontmatter with `name: review` and `description: Professional code review`.
>
> **Expected result**
>
> The workspace contains a skill folder with a `SKILL.md` file containing the requested frontmatter.

## Instructions

Instructions (`*.instructions.md` or `copilot-instructions.md`) provide background context that Copilot can apply to matching files or workspace conversations. They often contain:

- Coding standards or style guides (naming conventions, testing strategy).
- Framework-specific hints (Angular best practices, .NET analyzers to suppress).
- Repository-specific rules ("never commit secrets").

### When to reach for instructions

- You need persistent guidance that applies across many sessions.
- You are codifying architecture decisions or compliance requirements.
- You want Copilot to understand patterns without manually pasting context.

> **Try It: Set Global Standards**
>
> **Action**
> 1. Create `.github/copilot-instructions.md`.
> 2. Add: "Always use arrow functions for React components and include JSDoc comments."
> 3. Start a new Chat request that generates or edits code in this workspace.
>
> **Expected result**
>
> The instructions file exists and Copilot can use its guidance in subsequent workspace requests. The exact visibility of applied instructions depends on the current Copilot version and response context.

## Prompts

Prompts (`*.prompt.md`) are reusable snippets of text that you can inject into a Chat session. They may appear in the `/` command picker when prompt files are supported and enabled in the current Copilot version.

### When to reach for a prompt

- You have a long, specific prompt you find yourself typing often.
- You want to share a specific "recipe" with your team without a full skill structure.
- You need a quick way to trigger a specific behavior via a slash command.

> **Try It: Create a Prompt Shortcut**
>
> **Action**
> 1. Create `.github/prompts/refactor.prompt.md`.
> 2. Add: "Refactor this code for better readability and performance, ensuring no logic changes."
> 3. In Chat, type `/` and look for the prompt by its name.
>
> **Expected result**
>
> The prompt file exists and, when prompt files are supported in the current environment, appears in the command picker for reuse.
>
> **If unavailable**
>
> Use the prompt text directly in Chat and keep the file for future sessions. Command names and discovery behavior can vary by VS Code and Copilot version.

---

**Next**: [Exercise 05 — Setup & Create Custom Agents](exercise-05-setup-agents.md)

---