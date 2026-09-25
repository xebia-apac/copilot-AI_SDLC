# Exercise 19 — Create a Context Map Skill

**Duration**: Approximately 10–15 minutes in a preconfigured environment
**Copilot Feature**: Skills (`SKILL.md`)  
**Goal**: Install the Context Map skill from the awesome-copilot repository and use it to generate a codebase map that improves all subsequent Copilot interactions.

---

> ---
> 🟡 **OPTIONAL EXERCISE**
>
> This exercise is **not required** to complete the mandatory track. The context map it produces gives Copilot richer codebase awareness, but Exercises 13–15 work without it. If you run this exercise, reference `context-map.md` in your prompts for Exercises 12 and 13.
>
> **Best after**: Exercise 12 &nbsp;|&nbsp; **Return to mandatory track**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
> ---

## Prerequisites

This optional exercise is best completed after Exercise 12 and requires:

- A generated `src/` codebase, plus generated `ui/` and `tests/` directories when those exercises were completed
- Copilot Agent mode or an equivalent file-reading workflow
- A trusted VS Code workspace
- Permission to create `.github/skills/context-map/`
- Network access to fetch the skill, or a supplied/pinned local copy of the skill


## Background

A **Skill** is an on-demand workflow bundled in a `SKILL.md` file. Unlike instructions (always active) or agents (persona-driven), a skill is a **specific multi-step process** you invoke when you need it.

The **Context Map** skill generates a structured map of your entire codebase — all files, their purposes, relationships, and key patterns. When you attach this map to a Copilot prompt, Copilot gets instant, accurate context about your project without having to re-read every file.

---

## Step 1 — Install the Context Map Skill

**Action**

1. Create the folder `.github/skills/context-map/` if it does not exist.
2. Do not create an empty `SKILL.md`. Let Copilot create and write the file with the fetched skill content.

**In Copilot Chat**, send this prompt to fetch and save the skill:

```
Fetch the Context Map skill from this URL and save it to .github/skills/context-map/SKILL.md:
https://raw.githubusercontent.com/github/awesome-copilot/main/skills/context-map/SKILL.md

Then confirm the file was saved correctly by showing me its first 20 lines.
```

The URL, network access, and repository structure may change. Before allowing the file to be saved, review the fetched content, verify that it is the expected Context Map skill, and do not blindly trust or execute remote instructions.

**Expected result**

`.github/skills/context-map/SKILL.md` exists, contains the fetched Context Map skill content, and its first 20 lines can be reviewed.

**If unavailable**

If network access or the URL is unavailable, use a supplied or pinned local copy if one is available. Otherwise skip this optional exercise.

---

## Step 2 — Read the Skill

**Action**

Open `.github/skills/context-map/SKILL.md` and read how the skill works. Verify that it contains expected frontmatter, if present, and meaningful instructions for systematically exploring the codebase and generating a structured context document.

**Expected result**

The file contains recognizable Context Map instructions and any frontmatter required by the current Copilot skill format.

**If unavailable**

If the file is missing, empty, or does not describe a Context Map workflow, stop and report the skill setup problem rather than invoking it.

---

## Step 3 — Run the Skill

**Action**

In Copilot Chat, use Agent mode if available. Depending on the VS Code/Copilot version, the skill may appear in the slash picker, an Agent may load it from `SKILL.md`, or you may need to provide the skill instructions directly in Chat/Agent. Do not assume that `context-map` will appear in the slash picker.

If the skill is available through one of those mechanisms, use it or send:

```
Follow the instructions in .github/skills/context-map/SKILL.md to generate a context map for this project.

Save the output as .github/skills/context-map/context-map.md

The context map should cover:
- All directories and their purpose
- Key source files and what they do
- Main data models and their relationships
- API endpoints and their handlers
- Configuration patterns
- Test structure
```

Before allowing Copilot to save the output, review the intended output path `.github/skills/context-map/context-map.md`.

**Expected result**

Copilot generates `.github/skills/context-map/context-map.md` from the actual current workspace/codebase, covering the requested directories, files, models, routes, configuration, and tests.

**If unavailable**

If skill discovery or Agent file-reading is unavailable, provide the reviewed `SKILL.md` instructions directly in Chat/Agent. If the workflow still cannot run, skip this optional exercise and do not claim the map was generated.

---

## Step 4 — Verify the Context Map

**Action**

Open `.github/skills/context-map/context-map.md` and review the generated content. Check that it contains:

- [ ] Directory tree with descriptions for each folder
- [ ] Key files listed with their purpose
- [ ] Main entities/models described
- [ ] API routes listed with handler locations
- [ ] Dependencies and their usage noted

**Expected result**

The context map describes the actual current workspace and its codebase rather than assumed ITMS files or architecture.

**If unavailable**

If the output file is missing or inaccurate, do not rely on it in later prompts. Ask Copilot to regenerate it from the current workspace after reviewing the cause.

---

## Step 5 — Use the Context Map in a Prompt

**Action**

Now test how the context map improves Copilot's responses. Send this prompt:

```
Using the context map in .github/skills/context-map/context-map.md, answer:
1. Which file handles task dependency blocking?
2. Where is the JWT authentication middleware? If it does not exist, answer "not present."
3. What database tables are currently defined? If JSON storage is used and no database tables exist, answer that no database tables are currently defined.
4. What's the response format for all API endpoints?
```

Compare the quality and accuracy of the answer versus asking without the context map, focusing on:
- File and path accuracy
- Identification of actual handlers and models
- Distinguishing implemented from missing features
- Avoiding invented JWT, database, or infrastructure artifacts

**Expected result**

The context-aware response is grounded in the current workspace and clearly distinguishes implemented features from missing or not-applicable capabilities.

**If unavailable**

If the context map or Chat context is unavailable, ask the questions using the actual workspace files directly and record that the skill-assisted comparison could not be completed.

---

## Why This Matters

In future prompts, prefix complex requests with:

```
Reference the context map at .github/skills/context-map/context-map.md for codebase context, then...
```

This single addition significantly reduces hallucinations (Copilot inventing file paths or function names) because it has accurate, up-to-date codebase knowledge.

---

## Key Takeaway

> Skills are **reusable processes**, not instructions or conversation. The Context Map skill is a good first skill for every project — it creates a shared mental model between you and Copilot about your codebase. You run it once (and re-run it as the codebase grows), and it pays dividends across every subsequent interaction.

---

**Next optional**: [Exercise 20 — Database & SQL / PL/SQL](exercise-20-database-sql.md)

**Return to Mandatory Track →**: [Exercise 16 — Build & Debug with the Local Agent](exercise-16-build-debug.md)
