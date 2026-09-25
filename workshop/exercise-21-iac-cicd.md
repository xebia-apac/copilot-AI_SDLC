# Exercise 21 — Infrastructure as Code & CI/CD Pipelines

**Duration**: Approximately 30–60 minutes in a fully preconfigured environment
**Copilot Feature**: DevOps Custom Agent + Prompt Files  
**Goal**: Use the DevOps agent to generate and review Docker, Bicep, and GitHub Actions configuration for the ITMS application. Terraform is an optional alternative, not a second required path. Live deployment and other side effects are separate approved execution steps, not required workshop outcomes.

---

> ---
> 🟡 **OPTIONAL EXERCISE**
>
> This exercise is **not required** for the mandatory track. It is the infrastructure and deployment capstone — ideal if you have extra time after Exercise 14 or want to explore IaC and CI/CD automation with Copilot after the workshop.
>
**Best after**: Exercise 16 &nbsp;|&nbsp; This is the final exercise in the workshop.
> ---

## Prerequisites

Complete Exercise 16 and confirm that the generated `src/`, `.env.example` (or its selected-stack equivalent), and application build/run instructions exist. Also confirm `doc/tsd.md` and a GitHub repository are available.

For this infrastructure path, Docker and Docker Compose, Azure CLI, and the Bicep CLI support local validation and review. An Azure subscription, approved resource-group and deployment permissions, GitHub Actions, GitHub Environments, and an approved GitHub OIDC/federated-credential setup are required only for separately approved live execution. Terraform is an optional alternative, not a second required path. Configure ACR, Azure resource identifiers, Key Vault access, and any required non-secret environment values before an approved deployment. Install Trivy and Semgrep only if the generated workflow uses them. Teams and SendGrid are optional integrations.

Exercise 20 is optional. Use its database artifacts only when they exist and the approved TSD requires database persistence; do not make `db/migrations/` a prerequisite for the default JSON-backed application.

Use the architecture documented in `doc/tsd.md`. If the TSD does not define a resource, treat it as an optional infrastructure assumption and do not provision it automatically.

Expected generated outputs, when their corresponding architecture path is approved, are:

- `infra/docker/Dockerfile`
- `infra/docker/docker-compose.yml`
- `.dockerignore`
- `infra/bicep/main.bicep`
- `infra/bicep/modules/`
- `infra/bicep/parameters/`
- `infra/bicep/README.md`
- `infra/README.md`
- `.github/workflows/ci.yml`
- `.github/workflows/cd-staging.yml`
- `.github/workflows/cd-production.yml`


## Background

The final phase of SDLC is deployment infrastructure. The **DevOps Agent** (`devops.agent.md`) created in Exercise 05's setup is a specialized agent that reads the TSD's deployment architecture and generates infrastructure and CI/CD configurations for review. The default workshop outcome is generated, reviewed configuration; Azure deployment, resource creation, image pushes, migration execution, and other production-like side effects require a separate explicit approval. Generated files are not evidence that infrastructure or deployments succeeded.

---

## Step 1 — Switch to the DevOps Agent

**Action**

In Copilot Chat, open the agent selector or agents menu if available and select **DevOps & IaC Agent**. Selector names and locations vary by VS Code/Copilot version and account.

**Expected result**

The DevOps agent is selected and can read workspace files and generate infrastructure/configuration files.

**If unavailable**

Use direct Chat prompts or create the files manually with the same reviewed content. If Agent mode or file-edit permissions are unavailable, generate a plan only and do not claim that infrastructure was created.

---

## Step 2 — Create Docker Configuration

**Action**

Send this prompt in the selected Agent or direct Chat workflow:

```
Read doc/tsd.md (Infrastructure & Deployment section when present), `.env.example` when present, and the actual application code in `src/`.

Create the Docker configuration:

1. infra/docker/Dockerfile
   - Multi-stage build: builder stage (compile/install deps) and final stage (minimal runtime image)
   - Run as non-root user (security best practice)
   - Only copy the production artifacts to the final stage
   - Expose the application port from the actual configuration/TSD; do not invent a port
   - Include a HEALTHCHECK using the documented `/api/v1/health` endpoint with interval, timeout, retries, and start period derived from the application/TSD

2. infra/docker/docker-compose.yml, only for services confirmed by the TSD
   - Service: api (our application)
   - Service: db (only when approved database persistence and `db/migrations/` exist)
   - Service: redis (optional; include only if required by the TSD)
   - Mount `db/migrations/` only when that directory exists and the approved TSD requires it; otherwise preserve the JSON-backed application flow
   - Use .env file for environment variables
   - Include a depends_on with health checks

3. .dockerignore
   - Exclude: node_modules, .env, .git, tests/, coverage/, *.log, doc/

Build and verify the Docker image can be built successfully.
```

Before building or running services, review the generated Dockerfile and Compose configuration. Use placeholders and environment variables for image names, registry names, ports, and runtime values; never hard-code secrets.

**Expected result**

The workspace contains the requested Docker artifacts at `infra/docker/Dockerfile`, `infra/docker/docker-compose.yml` when applicable, and `.dockerignore`, with a stack-appropriate build context and no embedded secrets.

**If unavailable**

If Docker, Compose, the application source, or the TSD is unavailable, generate a reviewed Docker design only and do not claim that an image was built or services started.

---

## Step 3 — Create Infrastructure as Code (Azure)

**Action**

Use Bicep as the primary documented IaC path and send this prompt after reviewing the TSD:

```
Create Azure Bicep templates in `infra/bicep/` for the approved non-production environment. Use only resources and dependencies confirmed by `doc/tsd.md`.

The infrastructure should match the TSD deployment architecture.

1. `infra/bicep/main.bicep` — entry point that deploys approved modules
2. `infra/bicep/modules/` — modules only for resources confirmed by the TSD
3. `infra/bicep/parameters/dev.json` — parameter file using placeholders for approved dev values
4. Include a Bicep README with prerequisites, review steps, and safe deployment commands

Security requirements when those resources are approved by the TSD:
- Container App uses managed identity to access Key Vault; do not put secret values in environment variables
- PostgreSQL uses the approved network boundary; do not invent a VNet or public/private topology
- Container Registry uses the approved identity/access model
- All resources use parameterized names, locations, and tags

Include in the generated Bicep README:
- Prerequisites (Azure CLI, Bicep CLI, subscription, tenant, resource group, region, and permissions)
- Review-only validation and deployment commands for the approved dev environment
- How to update secrets in Key Vault
```

> **Optional Terraform alternative:** If Terraform is the approved project tool, create the equivalent `infra/terraform/` structure and documentation instead of mixing Bicep and Terraform in the same path.

Before any deployment, confirm the approved subscription, tenant, resource group, region, and environment. Review the generated Bicep and do not deploy to production during the workshop unless explicitly approved.

**Expected result**

The workspace contains parameterized, reviewed Bicep files under `infra/bicep/` for only the TSD-approved resources, with documented identity, Key Vault, validation, and safe deployment boundaries. No live Azure deployment or resource creation is required for this exercise.

**If unavailable**

If Azure CLI, Bicep, the subscription, permissions, or the TSD is unavailable, generate and review templates only. Do not run Azure deployment commands or provision resources.

---

## Step 4 — Create CI/CD Pipelines

**Action**

Send this prompt after reviewing the generated application, Docker, and IaC artifacts:

```
Create GitHub Actions workflow files in .github/workflows/:

1. .github/workflows/ci.yml — Continuous Integration (triggers on: pull_request to main)
   Steps:
   a. Checkout code
   b. Setup language runtime (cache dependencies)
   c. Install dependencies
   d. Run linter (fail on warnings)
   e. Run unit tests (fail if coverage < 80%)
   f. Build Docker image (fail if build fails)
   g. Run Trivy container security scan (fail on CRITICAL vulnerabilities)
   h. Run Semgrep static analysis (fail on HIGH findings)
   i. Comment results on the PR

2. .github/workflows/cd-staging.yml — Deploy to Staging (triggers on: push to main)
   Steps:
   a. Build and push Docker image to ACR with tag: main-{commit-sha}
   b. Run database migrations against staging DB only when the database-enabled path is approved and configured
   c. Deploy to the approved Azure Container App staging environment or revision using GitHub OIDC (no client secret/password stored in GitHub)
   d. Run smoke tests: GET /api/v1/health must return the documented response with data.status="ok"
   e. Run integration tests against staging environment
   f. Notify Teams channel on success/failure

3. .github/workflows/cd-production.yml — Deploy to Production (triggers on: push tag v*.*.*)
   Steps:
   a. Require manual approval gate (environment: production)
   b. Build and push Docker image with tag: {version}
   c. Run database migrations against production DB only when the approved database-enabled path is configured
   d. Blue-green deploy: deploy to an approved Container App revision and shift traffic gradually when supported by the TSD
   e. Health check: poll /api/v1/health for 2 minutes
   f. On failure: automatic rollback to previous revision
   g. Create GitHub Release with changelog

Use GitHub OIDC as the primary Azure authentication path: GitHub Actions authenticates through an Azure app registration/service principal with a federated identity credential. Do not store an Azure client secret/password in GitHub, workflow YAML, `.env`, or the repository. Use Container App managed identity for runtime access to Key Vault where applicable. Keep runtime secrets in Key Vault; GitHub Environments should contain only required non-secret identifiers where possible.
```

Before enabling workflow triggers, configure the GitHub Environment, OIDC/federated credential, ACR access, Azure resource identifiers, and any database/scanner/Teams settings required by the generated workflow. Review the workflow files first.

**Expected result**

The workspace contains reviewed CI/CD workflow files whose triggers, authentication, build/test gates, deployment targets, smoke tests, and failure handling match the approved TSD and configured environments. Enabling workflows, pushing images, running migrations, or deploying requires separate approval; generated YAML is not evidence that deployment succeeded.

**If unavailable**

If GitHub Actions, OIDC, Azure permissions, ACR, scanners, database connectivity, or optional Teams configuration is unavailable, generate and review the workflows only. Do not enable production triggers or claim a deployment succeeded.

---

## Step 5 — Create the infra/README.md

**Action**

Send this prompt:

```
Create infra/README.md with complete deployment documentation:

1. Architecture overview (text description of what was created)
2. Prerequisites list (tools, CLI versions, Azure permissions needed)
3. First-time setup steps for GitHub OIDC federated credentials, GitHub Environment identifiers, Key Vault secrets, and reviewed Bicep validation/deployment
4. Day-to-day deployment guide (how CI/CD works, how to trigger a release)
5. How to roll back to a previous version
6. Environment variables reference (what each secret in Key Vault is for)
7. Monitoring: where to find logs, how to set up alerts for error rate spikes
8. Cost estimation for the Azure resources at 500 concurrent users
```

Document secrets, non-secret identifiers, Azure resource names, Key Vault secret names, GitHub Environment values, and local development variables separately. Never place real secrets in Dockerfiles, IaC, workflow YAML, `.env.example`, or README files. Label any cost estimate as an estimate and state assumptions for region, runtime hours, container count, database tier, storage, log volume, network egress, Redis tier if used, and monitoring retention.

Require explicit approval before provisioning resources or enabling deployment workflows. Do not run destructive commands or production migrations by default.

**Expected result**

`infra/README.md` documents the approved architecture, prerequisites, OIDC and Key Vault setup, validation/deployment boundaries, rollback approach, environment values, monitoring, and clearly labeled cost assumptions.

**If unavailable**

If Azure, GitHub OIDC, resource permissions, or approved architecture details are unavailable, generate documentation and a review checklist only; do not deploy or claim runtime success.

---

## Verify

**Action**

Open the generated files and review them before building, pushing, provisioning, running migrations, enabling workflows, or deploying:

- [ ] Dockerfile uses multi-stage build and non-root user
- [ ] `docker-compose.yml` starts the approved services; database starts only when the database-enabled path is configured
- [ ] Bicep/Terraform templates are parameterized (no hardcoded values)
- [ ] CI workflow has test + security scan gates
- [ ] CD staging runs integration tests before marking deploy as success
- [ ] CD production requires manual approval
- [ ] No secrets hardcoded in any YAML, Dockerfile, or IaC file

Also verify:
- [ ] Image naming, local/commit/release tags, build context, runtime port, and environment values use placeholders or approved configuration
- [ ] CI/CD authentication uses GitHub OIDC and no client secret/password is stored in the repository
- [ ] Deployment health checks verify the established `/api/v1/health` response contract
- [ ] Migrations run only when the database path is enabled and approved
- [ ] Workflow files are reviewed before triggers are enabled
- [ ] Failed health checks stop deployment; rollback identifies the failed revision before acting
- [ ] Teams notifications are skipped when no approved webhook configuration exists

**Expected result**

Generated infrastructure and workflows are parameterized, reviewable, and safe to validate. A successful file-generation step is not reported as a successful build, deployment, migration, or health check.

**If unavailable**

If required files, tools, permissions, or configuration are unavailable, record the exact gap and complete static review only. Do not create Azure resources, push images, run migrations, or enable production workflows.

---

## Workshop Complete! 🎉

You have completed the full E2E SDLC using GitHub Copilot:

| Phase | Output |
|-------|--------|
| Planning | `doc/brd.md`, `doc/tsd.md`, `doc/frd.md` |
| Project Management | GitHub Issues via MCP |
| Development | `src/` — REST APIs with task management and dependencies; authentication is included only if implemented by the approved TSD/FRD |
| Database | `db/migrations/`, `db/procedures/`, PostgreSQL/PL/pgSQL procedures when the optional database path is enabled |
| Testing | `tests/` — unit + integration tests from FRD acceptance criteria |
| Security | OWASP review report, vulnerability fixes |
| Infrastructure | `infra/` — Docker, Bicep/Terraform, GitHub Actions CI/CD |

---

## What to Explore Next

| Topic | How |
|-------|-----|
| Claude or GPT-4o as base model | Change model in Copilot Chat settings |
| Custom skill for API docs | Create `.github/skills/api-docs/SKILL.md` |
| Automated PR review agent | Create `.github/agents/code-review.agent.md` |
| Prompt for performance profiling | Add `.github/prompts/performance-review.prompt.md` |
| Pre-commit security hook | Create `.github/hooks/pre-commit.json` |

---

**Return to**: [Workshop Overview (README.md)](../README.md)
