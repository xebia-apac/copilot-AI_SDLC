# Workspace-wide Coding Standards

This repository follows a REST API architecture using TypeScript, Express, and a database access layer built with a query builder or ORM. The goal is consistent, secure, maintainable code across the entire workspace.

## 1. Language & Framework Conventions

- Use TypeScript for all application code and type-safe definitions.
- Keep files small and focused: one exported class or related group of functions per file.
- Use `camelCase` for variables and functions, `PascalCase` for classes, interfaces, types, and enums.
- Organize modules by feature domain, not by technical layer only.
  - Example: `src/users/user.controller.ts`, `src/users/user.service.ts`, `src/users/user.routes.ts`, `src/users/user.schema.ts`
- Keep module imports explicit and avoid deep relative paths when possible. Prefer aliases configured in `tsconfig.json`.
- Export only what is intended for reuse; keep implementation helpers private within the module.

## 2. API Design Rules

- Version all public API endpoints under `/api/v1/`.
- Use consistent response envelopes for every API response:
  - `success`: boolean
  - `data`: payload or `null`
  - `error`: error object or `null`
  - `meta`: optional metadata (pagination, debug info, etc.)
- Example response format:
  ```json
  {
    "success": true,
    "data": {...},
    "error": null,
    "meta": {...}
  }
  ```
- Do not return raw errors or stack traces to API consumers.
- Use HTTP verbs and resource-based routes consistently.
- Keep route handlers thin: delegate business logic to services.

## 3. Error Handling

- Implement custom error classes for domain errors, validation errors, authentication errors, and not-found conditions.
- Use centralized error middleware in Express to normalize all errors into the standard response envelope.
- Map errors to the correct HTTP status codes:
  - `400` for validation and bad request
  - `401` for authentication
  - `403` for authorization
  - `404` for not found
  - `409` for conflict
  - `422` for semantic or validation failures
  - `500` for unexpected server errors
- Avoid throwing plain strings; always throw instances of custom error classes.
- Include a stable error code or error type in the response body for clients.

## 4. Security

- Always validate input with a schema library such as Zod, Joi, or Yup.
- Never trust user input. Validate and sanitize request bodies, query params, headers, and route params.
- Use only parameterized queries through the chosen query builder or ORM.
- Do not build SQL strings by concatenation or template interpolation.
- Protect all sensitive configuration through environment variables and never commit secrets.
- Apply authentication and authorization checks at every entry point that touches protected resources.

## 5. Database Practices

- Use migrations for every schema change and keep migration files in source control.
- Use a query builder or ORM (`Prisma`, `TypeORM`, `Knex`, `Objection`, etc.).
- Avoid raw string SQL queries except for controlled, audited cases behind a helper function.
- Encapsulate all database access in repository or data access layers.
- Prefer typed database models and DTOs rather than untyped `any` records.

## 6. Testing

- Every new function must have a unit test.
- Write integration tests for all API endpoints.
- Use automated test runners such as Jest, Vitest, or similar.
- Keep tests deterministic and independent of external systems when possible.
- Mock external dependencies in unit tests and use a test database or in-memory fixtures for integration tests.
- Ensure test coverage includes success cases, validation failures, authorization failures, and error paths.

## 7. Logging

- Use structured JSON logs rather than freeform text.
- Include request ID, user ID, operation name, and relevant context in every log entry.
- Do not log sensitive data such as passwords, secrets, or personal identifiers.
- Use a shared logger utility across the app.
- Log at appropriate levels: `info`, `warn`, `error`, `debug`.

## 8. Code Style

- Do not leave `console.log` in production code.
- Do not leave `TODO` comments without a ticket number or clear action item reference.
- Keep functions under 30 lines whenever it improves readability.
- Prefer descriptive names and avoid abbreviations unless well-known.
- Keep code consistent with repository linting rules and formatter configuration.

## 9. Documentation

- Provide JSDoc or docstring comments for all exported functions, classes, and public modules.
- Document inputs, outputs, thrown errors, and side effects.
- Keep documentation up to date with implementation changes.

## 10. Git Commit Standards

- Use Conventional Commits for all changes:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation only
  - `test:` for tests and test infrastructure
  - `chore:` for maintenance tasks and tooling
- Keep commit messages concise and descriptive.
- Reference issue or ticket numbers in commit messages when available.
