# Exercise 14 — Write Unit & Functional Tests

**Duration**: Approximately 20 minutes in a preconfigured environment
**Copilot Feature**: Local Agent + Prompt Files  
**Goal**: Generate comprehensive unit and integration/functional tests for the ITMS API.

---

## Background

Tests are where the FRD's acceptance criteria become code. Each **Given/When/Then** scenario in `doc/frd.md` maps to an automated test. Copilot can read those acceptance criteria and write tests that verify them — turning the FRD into a living test suite.

## Prerequisites

Complete Exercises 05–13 as far as your environment requires and confirm that `doc/frd.md`, `.github/copilot-instructions.md`, the Exercise 12 API source, and the Exercise 13 UI exist. Confirm the selected test framework and package manager for your stack. The Context Map from optional Exercise 19 is not required; if it exists, you may reference it as additional context.

---

## Step 1 — Generate the Test Configuration

**Action**

Send this prompt in Copilot Chat (local Agent mode if available):

> **Note**: Adjust the prompt based on your selected stack (Node.js, Python, Java, or .NET). The optional Context Map from Exercise 19 is not required for this exercise.

```
Reference `.github/copilot-instructions.md` when it exists. Read `doc/frd.md` and the source files under `src/` and `ui/` when they exist.

Set up the testing infrastructure for the ITMS project:
1. Install and configure the appropriate test framework for the selected stack (for example, Jest/Vitest for Node.js, pytest for Python, JUnit for Java, or the equivalent .NET framework)
2. Create tests/unit/ and tests/integration/ directory structure
3. Set up test data configuration using the JSON seed files from src/data/ — no database required.
   Copy the JSON files to a tests/fixtures/ folder so tests work with isolated, known data.
4. Create a tests/helpers/ folder with:
   - A factory function to create test task objects and test user objects using roles defined by the FRD/TSD; label any added role assumptions
   - A helper that resets the in-memory JSON store to the fixture state before each test
     (so tests are isolated and repeatable without a database)
5. Add test scripts to package.json / pyproject.toml:
   - "test:unit" — runs unit tests only
   - "test:integration" — runs integration tests
   - "test:all" — runs everything with coverage report
```

**Expected result**

The selected test framework is installed or configured, `tests/unit/`, `tests/integration/`, `tests/fixtures/`, and `tests/helpers/` exist, and the documented test scripts are available for the selected package manager.

**If unavailable**

If Agent mode or the package manager is unavailable, ask Copilot to report the missing tool and provide setup commands without modifying files. Do not assume a Node-specific command for another stack.

---

## Step 2 — Generate Unit Tests for the Service Layer

**Action**

Send this prompt:

```
Read #readFile:doc/frd.md (focus on FR-IDs for task management) and the service files in `src/services/`.

Generate unit tests in tests/unit/ for the Task Service:

Test Suite: TaskService.createTask()
- Test: Should create a task with status `TO_DO` when all required fields are provided
  (maps to: Given a user provides title, priority, and estimated completion date When they submit the task Then a `TO_DO` task is created)
- Test: Should throw ValidationError when title is missing
- Test: Should throw ValidationError when priority is not Low/Medium/High
- Test: Should throw NotFoundError when assignedUserId does not exist
- Test: Should correctly record the creator in createdBy field

Test Suite: TaskService.updateTaskStatus()
- Test: Should update status from "To Do" to "In Progress" successfully
- Test: Should reject a transition with `TaskBlockedError` and `TASK_BLOCKED` when a dependency task is not Completed
- Test: Should allow status change to "Completed" when all dependencies are Completed
- Test: Should throw `TaskBlockedError` when trying to start a blocked task
- Test: Should record status change in task history

Use mocks for the repository layer in all unit tests.
Each test must include Arrange / Act / Assert structure as comments.
```

**Expected result**

Unit tests exist under `tests/unit/`, mock repository dependencies, and cover validation, task creation, status transitions, dependency blocking, and status history using the Exercise 12 error names and status values.

**If unavailable**

If the service paths or FRD are unavailable, stop and report the upstream dependency rather than generating tests against invented files or symbols.

---

## Step 3 — Generate Integration Tests for the API

**Action**

Send this prompt:

```
Read #readFile:doc/frd.md (focus on the Gherkin acceptance criteria in user stories US-001 to US-006) and the actual API routes in `src/routes/`.

Generate integration tests in tests/integration/ for the Task Management API:

Test Suite: POST /api/v1/tasks
- Scenario: "Developer creates a valid task"
  Given: A valid assignedUserId exists in the users fixture data
  When: POST /api/v1/tasks with { title, description, priority: "HIGH", assignedUserId, estimatedCompletionDate }
  Then: 201 Created, response has { success: true, data: { id, status: "TO_DO", priority: "HIGH" } }

- Scenario: "Task creation rejected when title is missing"
  When: POST /api/v1/tasks with missing title
  Then: 400 Bad Request, { success: false, error: { code: "VALIDATION_ERROR" } }

- Scenario: "Task creation rejected when assignedUserId does not exist"
  When: POST /api/v1/tasks with a random unknown assignedUserId
  Then: 400 Bad Request, { success: false, error: { code: "VALIDATION_ERROR" } }

Test Suite: PATCH /api/v1/tasks/:id/status
- Scenario: "User updates task from TO_DO to IN_PROGRESS"
  Given: A task with no blocking dependencies (use fixture task with no dependencies)
  When: PATCH /api/v1/tasks/:id/status with { status: "IN_PROGRESS" }
  Then: 200 OK, task status updated, history entry appended

- Scenario: "Task transitions to BLOCKED when dependency is incomplete"
  Given: A task whose dependency task is NOT COMPLETED (use fixture dependency data)
  When: PATCH /api/v1/tasks/:id/status with { status: "IN_PROGRESS" }
  Then: 422 Unprocessable Entity, { success: false, error: { code: "TASK_BLOCKED" } }

Test Suite: GET /api/v1/tasks
- Scenario: "List all tasks returns paginated results"
  When: GET /api/v1/tasks
  Then: 200 OK, { success: true, data: [...], error: null, meta: { total, page, limit } }

- Scenario: "Filter by status returns only matching tasks"
  When: GET /api/v1/tasks?status=TO_DO
  Then: All returned tasks have status TO_DO

Test Suite: GET /api/v1/tasks/:id
- Scenario: "Get task details includes history and dependencies"
  Given: A task exists in the fixture data
  When: GET /api/v1/tasks/:id
  Then: 200 OK, the response includes the task, `statusHistory[]`, and `dependencies[]`

Each integration test should reset the in-memory JSON store to fixture state before running using the test helper from Step 1.
```

**Expected result**

Integration tests exist under `tests/integration/` for the actual Exercise 12 routes, use fixture data and reset helpers, and assert the documented response envelope, `estimatedCompletionDate`, `TASK_BLOCKED`, and status-history behavior.

**If unavailable**

If the API source or test server setup is unavailable, generate only test cases or report the contract gap. Do not invent routes, authentication, or a running database requirement.

---

## Step 4 — Run Tests and Check Coverage

**Action**

> **(Optional) Database stored procedure tests**: If you have completed [Exercise 20](exercise-20-database-sql.md) and are running a real database, ask Copilot to also generate tests in `tests/unit/database/` for the `update_task_status()`, `add_task_dependency()`, and `resolve_task_dependency()` PL/pgSQL functions.

Send this prompt using the configured test command from Step 1, such as `npm run test:unit`, `pytest`, `mvn test`, or the equivalent command for the selected stack:

```
Run the unit tests using the terminal and show me the coverage report.
Identify any files in src/ that have less than 80% test coverage and list them.
```

**Expected result**

The selected test command runs and reports coverage. Database procedure tests are generated only when the optional database path is actually available.

**If unavailable**

If tests cannot run, preserve the exact command output and report whether the failure is setup, test, or implementation related. Do not create database tests without a configured database.

---

## Step 5 — Generate Functional Test Cases (Browser Execution Optional)

**Action**

Send this prompt in Copilot Chat (Agent mode if available):
```
Read #readFile:doc/frd.md and generate functional test cases for the ITMS application using Selenium WebDriver.

Requirements:
Use Page Object Model: create a TaskPage class in `tests/functional/pages/TaskPage` with the correct extension for the selected language
Use WebDriverWait + expected_conditions — no time.sleep()
Each test must have # Arrange / # Act / # Assert comments
```

**Expected result**

Functional test cases use a Page Object Model and explicit waits, and are placed under `tests/functional/` with the selected language's correct file names.

**If unavailable**

Actual browser execution is optional and requires the Exercise 13 UI, the Exercise 12 API, a compatible browser driver, and a configured test environment. If those are not available, complete and review the generated test cases against the FRD/TSD without claiming runtime browser coverage. Playwright or another browser MCP is an alternative only when explicitly configured.

**Note**: This step uses Selenium WebDriver to generate functional tests via Copilot Agent mode.
> If you have the **Playwright MCP** or any other browser automation MCP configured in your VS Code MCP settings, you can send the same prompt and Copilot will use that MCP to interact with the live application, discover real selectors, and generate tests automatically.


## Verify

**Action**

- [ ] Unit tests exist for `TaskService` with at least 8 test cases
- [ ] Integration tests cover the 4 main API endpoints
- [ ] Tests use the factory helper and JSON store reset helper
- [ ] Each test follows Arrange/Act/Assert structure
- [ ] Coverage report is generated
- [ ] Unit and API integration tests do not require a database; functional browser tests require the Exercise 13 UI and running API only when executed
- [ ] Functional test cases generated for the ITMS application.
- [ ] Browser execution is optional and was performed only if the UI, API, browser driver, and test environment were available.

**Expected result**

The generated tests match the available API/UI contracts, use the selected framework and commands, and clearly separate generated test cases from tests that have actually run.

---

---

**Next**: [Exercise 15 — Security Review](exercise-15-security.md)
