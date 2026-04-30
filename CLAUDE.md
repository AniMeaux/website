# Project guidelines

## General writing style

- Prefer British English spelling in prose (for example: "synchronise",
  "synchronisation").
- Keep language simple, direct, and concise.

## Commit messages

Follow `docs/commit-message-guidelines.md` for all commits.

Agents must always include a `body`.

## Pull requests

When asked to open, prepare, or draft a pull request, use `/open-pr`.

## Workspace structure

- `apps/*` — deployable applications.
- `libs/*` — shared workspace packages used by the apps.
- `scripts/` — workspace-level tooling.

Keep app-specific entry points, routes, and composition inside `apps/*`. Keep
reusable domain logic, UI primitives, and shared utilities inside `libs/*`.
`libs/prisma` owns Prisma-related code and generated client integration for the
workspace.

Shared libs are consumed from their built output. Changes to shared libs may
require synchronisation into injected workspace packages.

See: docs/decisions/002-workspace-package-injection.md

## Source editing

- Prefer small, focused changes that solve the root cause.
- Preserve existing behaviour unless the task explicitly asks for a behaviour
  change.
- Preserve public APIs and script names unless the task requires changing them.
- Do not edit generated outputs by hand. Treat `build/`, `public/build/`, and
  `src/generated/` as generated unless the task is specifically about
  generation.
- When a change affects multiple apps, prefer fixing the shared lib instead of
  duplicating changes in each app.
- Opportunistic cleanups are allowed. Keep them small, local, and low risk.
  Limit them to the code you are already touching or to directly related dead
  code. Do not mix broad refactors with functional changes unless the task asks
  for both.

## Code comments

For "See" reference lines in code comments, use this style:

- `See: path/to/file`

Do not wrap the path in backticks.

## Package scripts

- Use `build` for the production build entry point, `build:*` for subtasks,
  `prebuild` for pre-build cleanup or generation.
- Use `dev` for the long-running local workflow, `dev:*` for subtasks.
- Use `generate` / `generate:*` for one-off asset or code generation.
- Use `clean` to remove generated outputs.
- Use `lint` for read-only validation, `lint-fix` for safe automatic fixes.
- Use `start` for the production runtime entry point.
- Prefer `run-s` for sequential orchestration and `run-p` for parallel
  orchestration. Keep `--print-label` when running multiple subtasks.
- For libs that publish only `build/`, keep `postbuild` calling
  `pnpm sync-workspace`. For watch mode, use `dev:sync-workspace`.

## Dependency upgrades

- Use `workspace:*` for internal dependencies.
- Use `catalog:` for third-party dependencies managed at workspace level.
- Keep `injectWorkspacePackages: true`, `dedupeInjectedDeps: false`, and
  `syncInjectedDepsAfterScripts` pointing to `sync-workspace`.
- Prefer step-by-step dependency changes over broad workspace-wide upgrades,
  unless the upgrade is a patch or a clearly simple minor release.
- When changing shared lib dependencies, consider the consuming apps before
  aligning versions.

See: docs/decisions/002-workspace-package-injection.md

## Documentation

- Use sentence case for document and section headings.
- Avoid shortened words in prose when a clear full word is available. Allowed
  shorthand: "apps" and "libs".
- Wrap file paths and script names in backticks in prose and markdown text.
- Prefer reference-style markdown links. Define link references at the bottom of
  the file, sorted alphabetically by reference name.
- For internal section links in long planning documents, define each reference
  directly below the target heading.
- When updating ADRs or docs, preserve existing meaning and improve clarity.
- Prefer fluid paragraphs over fragmented bullet points unless a list improves
  readability.
