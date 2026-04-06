---
description:
  "Use when creating or editing source code files. Covers common-sense editing
  constraints, safe defaults, and refactor expectations for this workspace."
applyTo: "**/*.{js,ts,tsx}, **/Dockerfile, **/*.yml"
---

# Source editing guidelines

## General approach

- Prefer small, focused changes that solve the root cause.
- Preserve existing behaviour unless the task explicitly asks for a behaviour
  change.
- Preserve public APIs and script names unless the task requires changing them.

## Opportunistic cleanups

- Opportunistic cleanups are allowed.
- Keep them small, local, and low risk.
- Limit them to the code you are already touching or to directly related dead
  code.
- Do not mix broad refactors with functional changes unless the task asks for
  both.

## Generated outputs

- Do not edit generated outputs by hand.
- Treat `build/`, `public/build/`, and `src/generated/` as generated unless the
  task is specifically about generation.
- Prefer changing the source, generator, or script that produces generated
  files.

## Shared code

- When a change affects multiple apps, prefer fixing the shared lib instead of
  duplicating changes in each app.
- Keep app-specific composition inside `apps/*` and reusable logic inside
  `libs/*`.
