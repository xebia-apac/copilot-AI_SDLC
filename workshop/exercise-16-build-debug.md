# Exercise 16 — Build & Debug with the Local Agent

**Duration**: Approximately 20 minutes in a preconfigured environment
**Copilot Feature**: Local Agent + Terminal Tool  
**Goal**: Use Copilot to build the application in the terminal, interpret errors, and iteratively fix them until all tests pass.

---

## Background

The local agent can run terminal commands, read their output, diagnose errors, and make code changes — all in one conversation. This creates a tight **build → error → fix → build** loop that compresses debugging time significantly.

## Prerequisites

Complete Exercises 05–15 as far as your environment requires and confirm that the selected API/UI/test stack, generated source, configuration, and security-review inputs exist. Confirm the selected package manager, an available terminal, and the API/UI ports from the generated `.env.example` and frontend configuration. The examples below use the Exercise 12 API contract and should be adapted to the selected stack.

---

## Step 1 — Start a Build-and-Fix Session

**Action**

In Copilot Chat, select the local/workspace Agent mode if available and send:

```
Let's build and run the ITMS application. 

1. First, install all dependencies using the package manager for the selected stack
2. Then run the build/compile step if applicable (TypeScript tsc, Maven compile, etc.)
3. Then start the application
4. Report any errors you encounter, including the command, exit code, and affected file

For each error:
- Show me the exact error message
- Identify the root cause
- Apply the fix directly to the source file
- Re-run the build to confirm the fix worked

Continue until the application starts successfully and `GET /api/v1/health` returns the documented success/data/error/meta response with `data.status` equal to `"ok"`.
```

**Expected result**

The selected project builds or compiles, the application starts on its configured port, and the health request succeeds. Every fix is followed by the relevant build or health check.

**If unavailable**

If Agent mode or terminal access is unavailable, ask Copilot to analyze the build instructions and error output without editing files. Use the package manager and build command defined by the selected stack rather than assuming npm.

The agent will run commands in the terminal, read the output, and iterate on fixes. You'll see it:
1. Run the selected dependency-install command
2. Run the selected build/compile command
3. Fix any TypeScript errors or import issues
4. Start the server
5. Test the health endpoint

---

## Step 2 — Run Unit Tests

**Action**

Once the app builds, send:

```
Run the unit tests using the configured command from Exercise 14, such as `npm run test:unit`, `pytest`, `mvn test`, or the equivalent command for the selected stack.

For any failing tests:
1. Show the test name and failure message
2. Determine if it's a code bug or a test bug
3. Fix the root cause, not just the test
4. Re-run until all unit tests pass

Show me the final coverage report.
```

**Expected result**

The unit-test command runs, failures are classified as test or implementation defects, fixes are followed by a rerun, and a coverage report is shown when configured.

**If unavailable**

If the test command or test artifacts are missing, report the setup dependency and do not invent a command or claim that tests passed.

---

## Step 3 — Debug a Specific Scenario

**Action**

Try a deliberate debugging exercise. Send:

```
Make a POST request to /api/v1/tasks using curl with:
- A valid assignedUserId from src/data/users.json
- A task with `estimatedCompletionDate` set to next Friday
- priority: HIGH, title: "Implement Payment API"

Then immediately call GET /api/v1/tasks/:id using the returned task ID.

Show me the curl commands, the responses, and the server logs.
If the POST response is not a 201 with status "TO_DO", or the GET returns 404, diagnose and fix the issue.
```

If the request fails, Copilot will:
1. Look at the server logs
2. Trace the request through the controller → service → repository
3. Identify the bug (e.g., date validation blocking valid future dates, or missing FK constraint handling)
4. Apply the fix and re-test

**Expected result**

The task creation response is `201` with status `TO_DO`, and the follow-up task retrieval succeeds with the created task. Any error is diagnosed from the actual response/log before a fix is proposed.

**If unavailable**

If the API is not running or the selected stack does not use curl, preserve the error and use the configured HTTP client/port after starting the application through the Step 1 flow. For frontend-to-backend connectivity errors, check the API base URL, frontend and backend ports, CORS configuration, and environment/configuration values together.

---

## Step 4 — Run Integration Tests

**Action**

Send:

```
Run the integration tests using the configured command from Exercise 14, such as `npm run test:integration`, `pytest`, `mvn test`, or the equivalent command for the selected stack.

If the integration framework requires a live server, start the API once using the configured port and keep it in a separate terminal. If it uses an in-process app, do not start a second server.

For any failing integration tests, diagnose and fix, referencing the original Gherkin acceptance criteria in doc/frd.md to understand what the expected behavior should be.
```

**Expected result**

Integration tests run against the intended API setup, failures are traced to actual logs/responses and FRD criteria, and each fix is followed by a rerun.

**If unavailable**

If the API, FRD, or integration command is unavailable, report the missing dependency rather than starting an unverified server or changing unrelated files.

---

## Step 5 — Verify End-to-End Flow

**Action**

Send a final validation prompt:

```
Do an end-to-end manual test of the core task management flow using curl:

1. GET  /api/v1/tasks — confirm the seeded tasks are returned
2. POST /api/v1/tasks — create a new HIGH priority task with a valid
   assignedUserId from src/data/users.json, estimatedCompletionDate set to next Friday
3. GET  /api/v1/tasks/:id — fetch the newly created task and confirm status is TO_DO
4. PATCH /api/v1/tasks/:id/status — update status to IN_PROGRESS
5. GET  /api/v1/tasks/:id — confirm status is IN_PROGRESS and statusHistory
   has an entry recording the TO_DO → IN_PROGRESS transition
6. PATCH /api/v1/tasks/:id/status — update status to COMPLETED
7. GET  /api/v1/tasks?status=COMPLETED — confirm the task appears in the filtered list

Show me each curl command and response. The complete flow must work without errors.
```

**Expected result**

The seeded tasks are listed, a new task is created and retrieved, status changes to `IN_PROGRESS` and `COMPLETED` succeed when allowed, status history records both transitions, and the completed-task filter returns the task using the documented response envelope.

**If unavailable**

If either server, the API contract, or the selected HTTP client is unavailable, preserve the exact failure and report the blocked end-to-end dependency without modifying files.

---

## Debugging Tips for Attendees

If Copilot gets stuck in a loop on a specific error:

```
Stop trying to fix [specific error]. Let's approach this differently.
What is the root cause of this error based on the stack trace? 
What are the 3 most likely causes? Eliminate them one by one.
```

If a test keeps failing after fixes:

```
Read the original acceptance criteria in doc/frd.md for [FR-ID or US-ID].
Is the test testing the right thing? Is the implementation correct per the FRD?
Tell me which is wrong — the test or the implementation — before making any changes.
```

---

## Key Takeaway

> The local agent's superpower is the **terminal + code edit + reasoning** combination. A human debugger reads an error, opens the file, makes a change, saves, rebuilds, checks the output. The local agent does this loop autonomously, maintaining context across multiple iterations. The key practice is to give it a **goal** ("all tests pass") rather than micro-managing each step.

---

**Next**: [Exercise 21 — IaC & CI/CD (Optional)](exercise-21-iac-cicd.md)
