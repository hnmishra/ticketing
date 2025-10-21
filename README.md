Full Fledged Microservices Based Application.
# Ticketing — Microservices Project

Short, focused documentation for the Ticketing microservices system (Node.js + TypeScript + Next.js).

## Project overview

This repository implements a sample ticketing platform built as a set of small, focused microservices:
- Auth — user authentication & JWT
- Tickets — create/list/update tickets
- Orders — create/manage orders for tickets
- Payments — process payments (Stripe)
- Expiration — background worker to expire unpaid orders
- Client — Next.js frontend
- Common — shared interfaces, event types, and utilities

Primary goals:
- Event-driven communication (NATS JetStream)
- Independent services: each service has its own datastore and process
- Containerized for local dev and k8s deployment
- CI pipelines and tests per service

## Architecture

- Each service exposes a small HTTP API and publishes/subscribes to domain events using NATS.
- Services are loosely coupled via events (e.g., TicketCreated, OrderCreated, PaymentCreated).
- Payments integrate with Stripe for payment processing.
- Workers (expiration service) handle time-based logic.
- Kubernetes manifests in `infra/k8s*` enable production/dev deployments.
- Skaffold support or local Docker compose patterns are used for iterative development.

Diagram (conceptual):
- Client (Next.js) -> Auth / Tickets / Orders / Payments (HTTP)
- Services -> NATS (events)
- Payments -> Stripe (external)
- All services run in k8s pods for production

## Technologies & Tools

- Node.js (TypeScript)
- Next.js (client)
- NATS JetStream (or NATS Streaming) for event bus
- MongoDB (per-service or shared depending on service)
- Stripe for payment processing
- Docker for containerization
- Kubernetes manifests under `infra/` for deployment
- Skaffold (optional) for iterative k8s development
- GitHub Actions for CI (see `.github/workflows`, e.g., `tests-auth.yaml`)

## Service list & responsibilities

- auth/
  - Manages users, sessions, JWT issuance and validation.
- tickets/
  - CRUD for tickets. Emits TicketCreated and TicketUpdated events.
- orders/
  - Creates orders (reserves tickets), listens for ticket updates and expirations.
- payments/
  - Records payments, calls Stripe API, emits PaymentCreated.
- expiration/
  - Watches orders and publishes expiration events when unpaid.
- client/
  - Next.js app used by end users.
- common/
  - Shared TypeScript types (events, errors), NATS wrapper, and helper utilities.

## Events (example)

Common event flow examples:
- TicketCreated -> other services update read models
- OrderCreated -> Payments service reserves and charges
- OrderExpired -> Orders service cancels order, restores ticket availability
- PaymentCreated -> Order service marks order as complete

Event transport: NATS subjects and durable subscriptions. Use idempotent handlers.

## Getting started — prerequisites

- Node.js (LTS)
- npm / yarn
- Docker Desktop (Windows)
- kubectl (if using k8s)
- Skaffold (optional)
- A NATS server (local or container). For development you can run a NATS container:
  docker run -p 4222:4222 -p 8222:8222 --name nats nats

- Stripe: a test API key (for payments) — configure in payments service env.

## Environment variables (per service)

Each service uses env vars. Example (auth):
- JWT_KEY=your_jwt_secret
- MONGO_URI=mongodb://localhost:27017/auth
- NATS_CLIENT_ID=auth-service
- NATS_URL=nats://localhost:4222

Payments (example):
- STRIPE_KEY=sk_test_...
- NATS_CLIENT_ID=payments-service
- NATS_URL=nats://localhost:4222

Check each service package.json / src for exact expected names.

## Run locally (recommended flow)

1. Start supporting infra:
   - MongoDB (for each service or a local instance)
   - NATS server
2. Start services individually for iterative development:
   - cd tickets
   - npm install
   - npm run dev
   - Repeat for auth, orders, payments, expiration
3. Start client:
   - cd client
   - npm install
   - npm run dev
4. Use the Next.js client to interact with APIs. Services will publish and subscribe to events via NATS.

Notes:
- Some services expect TypeScript-built output (check `package.json` scripts). Use `npm run build` when required.
- For CI-style test runs use `npm run test:ci` (non-interactive).

## Run with Docker (quick)

Each service contains a Dockerfile. Example:
- cd auth
- docker build -t ticketing-auth .
- docker run -e JWT_KEY=secret -e NATS_URL=nats://host.docker.internal:4222 -p 3000:3000 ticketing-auth

Prefer using docker-compose or Skaffold for multi-service local runs so networking is configured.

## Kubernetes

- k8s manifests in `infra/k8s*`. Typical objects: Deployment, Service, ConfigMap/Secret, Ingress.
- Secrets: store JWT_KEY, STRIPE_KEY, and DB credentials in k8s Secret resources.
- NATS and MongoDB can run in-cluster or be managed services.
- Use Skaffold for rapid dev loops: `skaffold dev` (ensure Skaffold config exists and is configured).

## CI / GitHub Actions

- Per-service workflows in `.github/workflows/`, e.g., `tests-auth.yaml` triggers on changes to `auth/**`.
- Workflows typically checkout code, install deps, and run `npm run test:ci`.
- Keep CI non-interactive and deterministic.

## Debugging

- A sample `launch.json` is recommended for VS Code (see `.vscode/launch.json`) to attach to or launch service processes.
- For Node Attach: start service with `--inspect` or `--inspect-brk` and attach from VS Code.

## Testing

- Each service contains unit and integration tests (check `package.json` scripts).
- Use `npm test` for local runs, and `npm run test:ci` for CI-compatible runs.

## Development tips & best practices

- Keep events small and versionable (add new event types rather than changing existing schemas).
- Implement idempotency and retries for event handlers.
- Separate command side (HTTP) from event side (NATS) in code for clarity.
- Use centralized, typed event definitions in `common` to avoid drift.
- Secure secrets (JWT, Stripe) via environment variables / k8s secrets.

## Troubleshooting

- NATS connection issues: verify NATS URL and client IDs. Check NATS server logs.
- Mongo errors: ensure proper connection string and that the DB is reachable.
- Stripe errors: use test keys and check Stripe dashboard for logs.

## Contributing

- Open issues / PRs against appropriate services.
- Run unit tests and linter before submitting a PR.
- Update `common` types when adding or changing events and coordinate across services.

## Useful commands

- Install deps for a service:
  cd <service> && npm install
- Run a service in dev (typical):
  npm run dev
- Build TypeScript:
  npm run build
- Run CI tests:
  npm run test:ci

## File structure (high level)

See repository root for folders: `auth/`, `tickets/`, `orders/`, `payments/`, `expiration/`, `client/`, `common/`, `infra/`, `.github/workflows/`.

---

For implementation-specific details (endpoints, event subjects, model fields), consult each service's README or `src/` code.  

````// filepath: c:\Users\mishr\OneDrive\LearningProject\Microservices with node and react\ticketing\README.md
# Ticketing — Microservices Project

Short, focused documentation for the Ticketing microservices system (Node.js + TypeScript + Next.js).

## Project overview

This repository implements a sample ticketing platform built as a set of small, focused microservices:
- Auth — user authentication & JWT
- Tickets — create/list/update tickets
- Orders — create/manage orders for tickets
- Payments — process payments (Stripe)
- Expiration — background worker to expire unpaid orders
- Client — Next.js frontend
- Common — shared interfaces, event types, and utilities

Primary goals:
- Event-driven communication (NATS JetStream)
- Independent services: each service has its own datastore and process
- Containerized for local dev and k8s deployment
- CI pipelines and tests per service

## Architecture

- Each service exposes a small HTTP API and publishes/subscribes to domain events using NATS.
- Services are loosely coupled via events (e.g., TicketCreated, OrderCreated, PaymentCreated).
- Payments integrate with Stripe for payment processing.
- Workers (expiration service) handle time-based logic.
- Kubernetes manifests in `infra/k8s*` enable production/dev deployments.
- Skaffold support or local Docker compose patterns are used for iterative development.

Diagram (conceptual):
- Client (Next.js) -> Auth / Tickets / Orders / Payments (HTTP)
- Services -> NATS (events)
- Payments -> Stripe (external)
- All services run in k8s pods for production

## Technologies & Tools

- Node.js (TypeScript)
- Next.js (client)
- NATS JetStream (or NATS Streaming) for event bus
- MongoDB (per-service or shared depending on service)
- Stripe for payment processing
- Docker for containerization
- Kubernetes manifests under `infra/` for deployment
- Skaffold (optional) for iterative k8s development
- GitHub Actions for CI (see `.github/workflows`, e.g., `tests-auth.yaml`)

## Service list & responsibilities

- auth/
  - Manages users, sessions, JWT issuance and validation.
- tickets/
  - CRUD for tickets. Emits TicketCreated and TicketUpdated events.
- orders/
  - Creates orders (reserves tickets), listens for ticket updates and expirations.
- payments/
  - Records payments, calls Stripe API, emits PaymentCreated.
- expiration/
  - Watches orders and publishes expiration events when unpaid.
- client/
  - Next.js app used by end users.
- common/
  - Shared TypeScript types (events, errors), NATS wrapper, and helper utilities.

## Events (example)

Common event flow examples:
- TicketCreated -> other services update read models
- OrderCreated -> Payments service reserves and charges
- OrderExpired -> Orders service cancels order, restores ticket availability
- PaymentCreated -> Order service marks order as complete

Event transport: NATS subjects and durable subscriptions. Use idempotent handlers.

## Getting started — prerequisites

- Node.js (LTS)
- npm / yarn
- Docker Desktop (Windows)
- kubectl (if using k8s)
- Skaffold (optional)
- A NATS server (local or container). For development you can run a NATS container:
  docker run -p 4222:4222 -p 8222:8222 --name nats nats

- Stripe: a test API key (for payments) — configure in payments service env.

## Environment variables (per service)

Each service uses env vars. Example (auth):
- JWT_KEY=your_jwt_secret
- MONGO_URI=mongodb://localhost:27017/auth
- NATS_CLIENT_ID=auth-service
- NATS_URL=nats://localhost:4222

Payments (example):
- STRIPE_KEY=sk_test_...
- NATS_CLIENT_ID=payments-service
- NATS_URL=nats://localhost:4222

Check each service package.json / src for exact expected names.

## Run locally (recommended flow)

1. Start supporting infra:
   - MongoDB (for each service or a local instance)
   - NATS server
2. Start services individually for iterative development:
   - cd tickets
   - npm install
   - npm run dev
   - Repeat for auth, orders, payments, expiration
3. Start client:
   - cd client
   - npm install
   - npm run dev
4. Use the Next.js client to interact with APIs. Services will publish and subscribe to events via NATS.

Notes:
- Some services expect TypeScript-built output (check `package.json` scripts). Use `npm run build` when required.
- For CI-style test runs use `npm run test:ci` (non-interactive).

## Run with Docker (quick)

Each service contains a Dockerfile. Example:
- cd auth
- docker build -t ticketing-auth .
- docker run -e JWT_KEY=secret -e NATS_URL=nats://host.docker.internal:4222 -p 3000:3000 ticketing-auth

Prefer using docker-compose or Skaffold for multi-service local runs so networking is configured.

## Kubernetes

- k8s manifests in `infra/k8s*`. Typical objects: Deployment, Service, ConfigMap/Secret, Ingress.
- Secrets: store JWT_KEY, STRIPE_KEY, and DB credentials in k8s Secret resources.
- NATS and MongoDB can run in-cluster or be managed services.
- Use Skaffold for rapid dev loops: `skaffold dev` (ensure Skaffold config exists and is configured).

## CI / GitHub Actions

- Per-service workflows in `.github/workflows/`, e.g., `tests-auth.yaml` triggers on changes to `auth/**`.
- Workflows typically checkout code, install deps, and run `npm run test:ci`.
- Keep CI non-interactive and deterministic.

## Debugging

- A sample `launch.json` is recommended for VS Code (see `.vscode/launch.json`) to attach to or launch service processes.
- For Node Attach: start service with `--inspect` or `--inspect-brk` and attach from VS Code.

## Testing

- Each service contains unit and integration tests (check `package.json` scripts).
- Use `npm test` for local runs, and `npm run test:ci` for CI-compatible runs.

## Development tips & best practices

- Keep events small and versionable (add new event types rather than changing existing schemas).
- Implement idempotency and retries for event handlers.
- Separate command side (HTTP) from event side (NATS) in code for clarity.
- Use centralized, typed event definitions in `common` to avoid drift.
- Secure secrets (JWT, Stripe) via environment variables / k8s secrets.

## Troubleshooting

- NATS connection issues: verify NATS URL and client IDs. Check NATS server logs.
- Mongo errors: ensure proper connection string and that the DB is reachable.
- Stripe errors: use test keys and check Stripe dashboard for logs.

## Contributing

- Open issues / PRs against appropriate services.
- Run unit tests and linter before submitting a PR.
- Update `common` types when adding or changing events and coordinate across services.

## Useful commands

- Install deps for a service:
  cd <service> && npm install
- Run a service in dev (typical):
  npm run dev
- Build TypeScript:
  npm run build
- Run CI tests:
  npm run test:ci

## File structure (high level)

See repository root for folders: `auth/`, `tickets/`, `orders/`, `payments/`, `expiration/`, `client/`, `common/`, `infra/`, `.github/workflows/`.

---

For implementation-specific details (endpoints, event subjects, model fields), consult each service's README or `src/` code.  
