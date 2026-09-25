# Exercise 09 — Create Custom Instructions for Your Language

**Duration**: Approximately 6 minutes in a preconfigured environment
**Copilot Feature**: Workspace Instructions (`copilot-instructions.md`)  
**Goal**: Set up workspace coding standards that Copilot can apply to matching requests.

---

## Background

A **`copilot-instructions.md`** file in `.github/` can be discovered as workspace instructions by Copilot. Unlike custom agents (which you manually select), instructions provide baseline context for matching workspace requests. Whether they are applied can depend on workspace trust, settings, file scope, and the current VS Code/Copilot version.

Think of it as your team's coding standards, available to Copilot without repeating them in every prompt.

## Prerequisite

Complete Exercises 05–08 and confirm that Copilot Chat is available. Open this repository as a trusted VS Code workspace. The generated documents from the earlier exercises are useful context, but this exercise only requires the workspace and a Copilot-enabled Chat session.

---

## Step 1 — Decide Your Language & Framework

**Action**

Choose the tech stack you want to build the ITMS application with:

| Option | Language | Framework | Database |
|--------|----------|-----------|----------|
| A | TypeScript / Node.js | Express or Fastify | PostgreSQL or SQL of your choice |
| B | Python | FastAPI or Django REST | PostgreSQL or SQL of your choice |
| C | Java | Spring Boot | PostgreSQL or Oracle or SQL of your choice |
| D | C# / .NET | ASP.NET Core | PostgreSQL or SQL Server or SQL of your choice |

> Choose **one** backend stack for this workshop and keep it consistent through the implementation exercises. Later code, commands, file paths, package/build commands, and examples must be adapted to that same choice; do not mix Node.js, Python, Java, or .NET conventions in one lab. **Option A (TypeScript/Node.js)** is the default reference if you're unsure.

**Expected result**

You have selected one language, framework, and database combination to use in the instruction file and later implementation prompts.

---

## Step 2 — Generate Your Instructions File

**Action**

Switch to the default/local Copilot agent, if an agent selector is available. If no selector is shown, continue in the current Chat session.

Copy and paste this prompt, **replacing `[YOUR CHOICE]`** with your selection:

```
I am building a REST API application using [YOUR CHOICE — e.g., TypeScript with Express and YOUR CHOICE DATABASE].

Create a .github/copilot-instructions.md file with workspace-wide coding standards for this project.

Include instructions covering:
1. Language & framework conventions (naming, file structure, module organization)
2. API design rules: versioning (/api/v1/), consistent response envelope { success, data, error, meta }
3. Error handling: custom error classes, centralized error middleware, proper HTTP status codes
4. Security: always validate input with a schema library, never trust user input, use parameterized queries only
5. Database: use migrations for schema changes, use a query builder or ORM — no raw string SQL queries
6. Testing: every new function must have a unit test, integration tests for all API endpoints
7. Logging: structured JSON logs with request ID, user ID, and operation name
8. Code style: no console.log in production code, no TODO comments without ticket numbers, functions under 30 lines
9. Documentation: JSDoc/docstring for all exported functions
10. Git: conventional commits (feat:, fix:, docs:, test:, chore:)
```

**Expected result**

Copilot proposes or creates `.github/copilot-instructions.md` containing standards for the selected stack and the requested API, error-handling, security, testing, logging, documentation, and Git conventions.

**If unavailable**

If the agent selector or file-creation action is unavailable, create the file manually with the same prompt content or ask regular Chat to generate the file content for you to save.

---

## Step 3 — Verify the File

**Action**

Open `.github/copilot-instructions.md` and check:

- [ ] File exists at `.github/copilot-instructions.md`
- [ ] Contains your chosen language/framework
- [ ] Includes rules about input validation and parameterized queries
- [ ] Has error handling conventions
- [ ] Mentions the `/api/v1/` URL convention

**Expected result**

The file exists at the workspace path `.github/copilot-instructions.md` and contains the selected stack plus the requested conventions.

---

## Step 4 — Test That Instructions Are Active

**Action**

Start a new Chat request, or close and reopen Chat if needed. Use the default/local agent if the current UI provides that choice, then send this test prompt:

```
Write a simple function that takes a user ID and returns user details from the database.
```

Observe that Copilot:
- Uses your chosen language and SQL database
- Uses parameterized queries (not string concatenation)
- Includes error handling
- Follows the response envelope format you defined

**Expected result**

The response follows the selected language/framework and reflects the instruction file where those instructions apply. Check the generated code rather than relying on a hidden instruction indicator; Copilot may not expose exactly how instructions were applied in the current UI.

**If unavailable**

If the response does not follow the selected conventions, verify that the workspace is trusted, the file is at `.github/copilot-instructions.md`, and the current Copilot version supports workspace instructions. Include the relevant standards explicitly in a follow-up prompt if needed.

---

## Key Takeaway

> Instructions set the **floor** for code quality. Once written, you can avoid repeating "use TypeScript", "use parameterized queries", or "follow REST conventions" when Copilot applies the workspace instructions to a matching request.

---

**Next**: [Exercise 10 — Plan Mode for Implementation](exercise-10-plan-mode.md)
