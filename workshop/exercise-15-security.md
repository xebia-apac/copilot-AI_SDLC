# Exercise 15 — Security Review

**Duration**: Approximately 12 minutes in a preconfigured environment
**Copilot Feature**: Security Prompt File  
**Goal**: Run a structured OWASP Top 10 security review of the codebase and fix critical findings.

---

## Background

Security is not an afterthought in modern SDLC — it's a gate before deployment. GitHub Copilot can audit code against the **OWASP Top 10** and propose fixes. By encoding the review checklist in a prompt file, the entire team runs the same consistent security audit every sprint.

This exercise uses the pre-built `.github/prompts/security-review.prompt.md` to drive the review.

Treat the security prompt as a checklist and review framework, not proof that every listed capability exists. Review only capabilities and code present in the current workspace. Base findings on actual files, configuration, and code where possible; classify missing or irrelevant areas as `NOT APPLICABLE`, and do not invent missing authentication, database, notification, infrastructure, or other capabilities. Keep using the classifications `CONFIRMED`, `NOT APPLICABLE`, `ASSUMPTION`, and `RECOMMENDATION`.

## Prerequisites

Complete Exercises 05–14 as far as your environment requires and confirm that the generated API source, UI source, tests, and `.github/prompts/security-review.prompt.md` exist. Open this repository as a trusted VS Code workspace with Copilot Chat available in Agent mode. The default Exercise 12 implementation uses a JSON file store, so database-specific checks should be reported as not applicable unless database support was explicitly added.

---

## Step 1 — Open the Security Review Prompt

**Action**

Open `.github/prompts/security-review.prompt.md` and read the OWASP checklist it contains. This file is provided in the repository.

Notice it covers:
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection attacks
- A04: Insecure Design
- And remaining OWASP categories through A10: SSRF

**Expected result**

You can identify the OWASP categories and distinguish checks that apply to the generated API/UI code from checks for capabilities that are not implemented.

**If unavailable**

If the prompt file is unavailable, stop and report the missing prerequisite rather than using an unverified checklist.

---

## Step 2 — Run the Security Review

**Action**

In Copilot Chat, use the local/default Agent mode if available. Type `/` and select **Security Review** when the prompt picker exposes it, or send:

```
Run the security review defined in .github/prompts/security-review.prompt.md against the generated API source, UI source, tests, and configuration files that actually exist in the workspace.

For each OWASP category:
1. List every file and line that has a potential vulnerability
2. Explain the risk in plain language
3. Provide the exact fix

Start with A01 (Broken Access Control) and A03 (Injection) as they are highest priority for API applications.
Give me a severity rating (CRITICAL / HIGH / MEDIUM / LOW) for each finding.
For every result, label it as CONFIRMED, NOT APPLICABLE, ASSUMPTION, or RECOMMENDATION. Do not report missing authentication, database, cloud, or infrastructure features as confirmed vulnerabilities.
```

**Expected result**

Copilot reports file- and line-specific findings from the actual generated code, distinguishes confirmed issues from unavailable capabilities and recommendations, and includes API, UI, dependency, CORS, error-handling, logging, secrets, validation, and injection checks where applicable.

**If unavailable**

If the prompt picker, Agent mode, or codebase context is unavailable, attach the prompt file and relevant generated source files using the current Chat context controls, or ask Copilot to produce a review plan without editing files.

---

## Step 3 — Apply Critical Fixes

**Action**

After the review, send this prompt to apply the most important fixes:

```
Apply all CRITICAL and HIGH severity findings from that security review.

For each fix:
1. Show the vulnerable code (before)
2. Show the fixed code (after)
3. Explain why the fix closes the vulnerability

Don't apply MEDIUM or LOW findings yet — add a comment with // SECURITY-TODO: [finding summary] instead.
```

Watch Copilot work through the findings and edit only the actual affected API, UI, test, or configuration files identified in the review.

**Expected result**

Only confirmed CRITICAL and HIGH findings are changed, and each change is explained. Findings labeled NOT APPLICABLE, ASSUMPTION, or RECOMMENDATION are not treated as vulnerabilities or silently implemented.

**If unavailable**

If no confirmed CRITICAL or HIGH findings exist, do not make speculative security edits. If Agent edit access is unavailable, request patch suggestions without applying them.

---

## Step 4 — Verify Common Patterns

**Action**

Send this targeted prompt to check the most common injection vectors:

```
Audit every data-access operation in the generated repositories for injection risks. The default Exercise 12 implementation uses JSON storage; if no database queries exist, report database-query checks as NOT APPLICABLE and review file paths, filters, shell calls, serialization, and user-controlled input instead.
Specifically check:
1. Are user-controlled values used safely in file paths, filters, commands, templates, or queries?
2. Are user-supplied IDs and pagination values validated before use?
3. If SQL repositories exist, are queries parameterized and IDs/bounds validated?

For each relevant repository/data-access file, report: SAFE, VULNERABLE, or NOT APPLICABLE with the specific line and reason.
Fix any VULNERABLE patterns immediately.
```

**Expected result**

Each relevant repository/data-access file is reported as SAFE, VULNERABLE, or NOT APPLICABLE with a specific reason and location.

**If unavailable**

If the generated repositories do not exist, report the missing implementation dependency rather than inventing database queries.

---

## Step 5 — Generate a Security Findings Report

**Action**

Send:

```
Create a doc/security-review-report.md summarizing:
- Date of review: today
- Reviewer: GitHub Copilot
- Files reviewed: list the actual API, UI, test, and configuration files reviewed
- Findings summary table: Severity | OWASP Category | File | Status (Fixed/Open)
- Fixed issues: description of each fix applied
- Open issues: remaining MEDIUM/LOW items with recommended fix
- Overall security posture assessment
```

**Expected result**

`doc/security-review-report.md` summarizes the review date, actual files reviewed, findings and statuses, confirmed fixes, open assumptions/recommendations, and the overall posture.

**If unavailable**

If no generated code exists, create a review plan or report template only; do not claim that a code review was completed.

---

## Key Takeaway

> Security built into the workflow — not bolted on after — is what OWASP recommends as "Shift Left Security." By encoding the OWASP checklist in a reusable prompt file, your team runs the same security review every sprint, every PR. The prompt captures institutional knowledge about *what to look for* so no security engineer knowledge needs to be in every developer's head.

---

**Next**: [Exercise 16 — Build & Debug](exercise-16-build-debug.md)
