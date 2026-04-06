---
description:
  "Use when editing dependencies, pnpm-workspace.yaml, package.json dependency
  fields. Covers workspace package injection and safe step-by-step dependency
  changes."
applyTo: "pnpm-workspace.yaml, **/package.json"
---

# Dependency upgrade guidelines

## Workspace dependency model

- Workspace packages are injected, not symlinked.
- Keep `injectWorkspacePackages: true`.
- Keep `dedupeInjectedDeps: false`.
- Keep `syncInjectedDepsAfterScripts` pointing to `sync-workspace`.
- See: docs/decisions/002-workspace-package-injection.md

## Package manifest rules

- Use `workspace:*` for internal dependencies.
- Use `catalog:` for third-party dependencies managed at workspace level.
- For libs that are consumed from `build/`, keep the `files` field aligned with
  the published build output.
- For injected libs, keep the `sync-workspace` hook and the scripts that trigger
  it.

## Upgrade strategy

- Prefer step-by-step dependency changes over broad workspace-wide upgrades,
  unless the upgrade is a patch release or a clearly simple minor release.
- Keep peer dependency changes scoped and explicit.
- When changing shared lib dependencies, consider the consuming apps before
  aligning versions.
