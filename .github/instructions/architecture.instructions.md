---
description:
  "Use when editing app or lib source files. Covers the main workspace structure
  and package responsibilities."
applyTo: "apps/**, libs/**, scripts/**"
---

# Architecture guidelines

## Workspace structure

- `apps/*` contains deployable applications.
- `libs/*` contains shared workspace packages used by the apps.
- `scripts/` contains workspace-level tooling.

## Package responsibilities

- Keep app-specific entry points, routes, and composition inside `apps/*`.
- Keep reusable domain logic, UI primitives, and shared utilities inside
  `libs/*`.
- `libs/prisma` owns Prisma-related code and generated client integration for
  the workspace.

## Build model

- Shared libs are generally consumed from their built output.
- Changes to shared libs may require synchronisation into injected workspace
  packages.
- See: docs/decisions/002-workspace-package-injection.md
