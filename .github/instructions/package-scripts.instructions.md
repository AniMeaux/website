---
description:
  "Use when creating or editing package.json scripts. Covers the script naming
  conventions shared by apps, libs, and workspace packages."
applyTo: "**/package.json"
---

# Package script guidelines

## Script naming

- Keep the existing script prefixes and meanings.
- Use `build` for the production build entry point.
- Use `build:*` for build subtasks.
- Use `prebuild` for cleanup or generation that must happen before `build`.
- Use `dev` for the long-running local workflow.
- Use `dev:*` for long-running subtasks started by `dev`.
- Use `generate` for one-off asset or code generation.
- Use `generate:*` for generation subtasks.
- Use `clean` to remove generated outputs.
- Use `lint` for read-only validation checks.
- Use `lint-fix` for safe automatic fixes.
- Use `start` for the production runtime entry point.
- Use `docker-build` and `docker-start` for local container workflows when
  needed.

## Script composition

- Prefer `run-s` for sequential orchestration and `run-p` for parallel
  orchestration.
- When a script runs multiple subtasks, keep `--print-label` so output stays
  readable.
- For long-running parallel `dev` or `generate` workflows, keep
  `--continue-on-error` unless a task must fail fast.

## Workspace injection hooks

- For libs that publish only `build/`, keep `postbuild` calling
  `pnpm sync-workspace`.
- For watch mode, use `dev:sync-workspace` to watch `build/` and trigger
  `sync-workspace`.
- Keep `sync-workspace` as the dedicated hook script used by
  `pnpm-workspace.yaml`.
