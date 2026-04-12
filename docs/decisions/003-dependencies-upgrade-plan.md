# Dependencies upgrade plan

Date: **2026-04-12**

Status: **Accepted**

## Context

Following the workspace package injection approach described in [002][002], we
can now upgrade dependencies incrementally, app by app. Many catalog entries are
behind their latest major release. Some upgrades can be applied workspace-wide
in a single step; others must be applied per app because they involve peer
dependencies that differ between consuming apps.

The upgrades are:

- **TypeScript** `~5.4.5` is several minor releases behind.
- **Vite** `^5.x` has been superseded by Vite 6.
- **ESLint** `^9.x` has been superseded by ESLint 10.
- **Tailwind CSS** `^3.x` has been superseded by Tailwind CSS 4, which brings a
  fundamentally different configuration model.
- **OpenTelemetry** core and SDK packages have moved from v1 to v2.
- **Express** `^4.x` has been superseded by Express 5.
- **Zod** `^3.x` has been superseded by Zod 4.
- **React Email + Resend** have each had major releases.
- **Remix v2** (`@remix-run/*` `~2.9.2`) has been rebranded and merged into
  **React Router v7** (`react-router` `^7.0.0`).
- **React** `^18.x` has been superseded by React 19.
- Several standalone packages have also had major releases that can be applied
  at any time.

Because many of these upgrades declare peer dependencies on each other, the
order of upgrades matters.

## Decision

### Dependencies to upgrade

| Package | Current | Target | Note |
| --- | --- | --- | --- |
| `typescript` | `~5.4.5` | `~5.7.0` | Several minor releases behind. |
| `vite` | `^5.2.12` | `^6.0.0` | Major release. |
| `vite-tsconfig-paths` | `^4.3.2` | `^6.0.0` | Upgrade together with Vite. |
| `eslint` | `^9.22.0` | `^10.0.0` | Major release; `typescript-eslint` v8 is already compatible. |
| `tailwindcss` | `^3.3.3` | `^4.0.0` | Major release; breaking config changes. |
| `@tailwindcss/container-queries` | `^0.1.1` | *(remove)* | Merged into Tailwind CSS 4 core. |
| `autoprefixer` | `^10.4.27` | *(remove)* | No longer required with Tailwind CSS 4. |
| `prettier-plugin-tailwindcss` | `^0.7.2` | Latest compatible with Tailwind CSS 4 | Upgrade together with Tailwind CSS. |
| `@opentelemetry/core` | `^1.27.0` | `^2.0.0` | Major release; compatible with existing `@opentelemetry/api` v1.9.x. |
| `@opentelemetry/sdk-trace-base` | `^1.27.0` | `^2.0.0` | Major release; compatible with existing `@opentelemetry/api` v1.9.x. |
| `@opentelemetry/instrumentation` | `^0.54.2` | Latest `0.x` | Minor-level breaking change within the `0.x` range; compatible with existing `@opentelemetry/api` v1.9.x. |
| `express` | `^4.17.1` | `^5.0.0` | Major release. |
| `zod` | `^3.22.2` | `^4.0.0` | Major release; `@conform-to/zod` already supports v4. |
| `zod-form-data` | `^2.0.1` | `^3.0.0` | Major release; upgrade together with Zod. |
| `react-markdown` | `^9.0.1` | `^10.0.0` | Major release; requires `react@>=18`, already satisfied. |
| `@react-email/components` | `^0.0.28` | `^1.0.0` | Major release; compatible with React 18. |
| `@react-email/render` | `^1.0.2` | `^2.0.0` | Major release; compatible with React 18. |
| `resend` | `^4.0.1-alpha.0` | `^6.0.0` | Major release; upgrade together with `@react-email/render`. |
| `react-router` | `^6.23.1` | `^7.0.0` | Major release; replaces `@remix-run/*`. |
| `@remix-run/dev` | `~2.9.2` | *(remove)* | Replaced by `react-router` v7 tooling. |
| `@remix-run/express` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/node` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/react` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/serve` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@sentry/remix` | `^8.37.1` | Latest compatible with React Router v7 | Latest v10.x still peer-depends on `@remix-run/*` v2; check for a dedicated React Router v7 package from Sentry before this phase. |
| `remix-utils` | `^7.5.0` | `^9.0.0` | Major release; upgrade together with `react-router`. |
| `react` | `^18.2.0` | `^19.0.0` | Major release. |
| `react-dom` | `^18.2.0` | `^19.0.0` | Major release; upgrade together with `react`. |
| `@types/react` | `^18.2.21` | `^19.0.0` | Upgrade together with `react`. |
| `@types/react-dom` | `^18.2.7` | `^19.0.0` | Upgrade together with `react-dom`. |

#### Standalone upgrades

The following packages have major releases with no peer dependency constraints
on the packages above. They can be upgraded at any time, independently of the
phases below.

| Package | Current | Target |
| --- | --- | --- |
| `croner` | `^8.0.0` | `^10.0.0` |
| `focus-trap` | `^7.5.2` | `^8.0.0` |
| `lru-cache` | `^10.0.1` | `^11.0.0` |
| `node-html-parser` | `^6.1.12` | `^7.0.0` |
| `pm2` | `^5.3.0` | `^6.0.0` |
| `uuid` | `^9.0.0` | `^13.0.0` |
| `@faker-js/faker` | `^8.0.2` | `^10.0.0` |

### Peer dependencies

The table below maps each dependency being upgraded to the other catalog
packages that declare a peer dependency on it. This determines which packages
must be upgraded together or verified for compatibility.

| Dependency being upgraded | Packages with a peer dependency on it |
| --- | --- |
| `eslint` | `typescript-eslint` (already compatible with ESLint 10 at v8.x, no upgrade needed) |
| `tailwindcss` | `prettier-plugin-tailwindcss` |
| `@react-email/render` | `resend` |
| `zod` | `@conform-to/zod` (v1.x already supports Zod 3 and 4), `zod-form-data` (v3.x requires `zod>=3.25.0`, compatible with Zod 4) |
| `react-router` | `@sentry/remix`, `remix-utils` |
| `react` | `@conform-to/react`, `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-slot`, `@radix-ui/react-visually-hidden`, `downshift`, `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`, `react-dom`, `react-markdown`, `react-transition-group`, `react-router`, `@react-email/components`, `@react-email/render` |
| `react-dom` | `@conform-to/react`, `@radix-ui/react-*`, `react-dnd`, `react-transition-group`, `react-router`, `@react-email/render` |

### Upgrade order

The dependencies are grouped into ten phases plus a set of standalone upgrades
that can be applied at any time. Within each phase, dependencies have no
cross-constraints with each other. Phases 4, 9, and 10 must be applied per app
to leverage the workspace package injection approach from [002][002].

#### Phase 1 — TypeScript (workspace-wide)

TypeScript has no peer dependency constraints with the other upgrades. It can be
upgraded once for the whole workspace without risk.

- `typescript`: `~5.4.5` → `~5.7.0`

#### Phase 2 — Vite (workspace-wide)

Vite has no peer dependency constraints with the other upgrades. It can be
upgraded once for the whole workspace. `vite-tsconfig-paths` must be upgraded at
the same time because its current version range does not cover Vite 6.

- `vite`: `^5.2.12` → `^6.0.0`
- `vite-tsconfig-paths`: `^4.3.2` → `^6.0.0`

#### Phase 3 — ESLint v10 (workspace-wide)

ESLint v10 is a workspace-wide dev tooling upgrade. `typescript-eslint` v8
already declares compatibility with ESLint 10, so it does not need to be
upgraded at the same time.

Affected libs:

- `libs/dev-tools`

#### Phase 4 — Tailwind CSS 4 (per app)

Tailwind CSS v4 introduces a fundamentally different configuration model.
`prettier-plugin-tailwindcss` must be upgraded at the same time to match the
new Tailwind CSS version.

`@tailwindcss/container-queries` and `autoprefixer` can be removed: container
queries are now built into Tailwind CSS 4 core, and Tailwind CSS 4 no longer
relies on PostCSS/autoprefixer.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/dev-tools` (`prettier-plugin-tailwindcss` and its `createConfig` helper
  use a Tailwind CSS v3-specific option that must be updated for v4)
- `libs/tailwind-animation`

#### Phase 5 — OpenTelemetry v2 (workspace-wide)

`@opentelemetry/core` and `@opentelemetry/sdk-trace-base` have moved from v1 to
v2. Both v2 packages remain compatible with `@opentelemetry/api` v1.9.x, which
is not changing. `@opentelemetry/instrumentation` has a significant minor-level
change within the `0.x` range that should be applied at the same time.

Affected libs:

- `libs/file-storage`
- `libs/zod-utils`

#### Phase 6 — Express v5 (apps/show)

Express v5 is used only in `apps/show` for the custom server. It is independent
of the Remix or React upgrades and can be applied on its own.

Affected apps:

- `apps/show`

#### Phase 7 — Zod v4 (workspace-wide)

Zod v4 has breaking API changes. `zod-form-data` must be upgraded together to
its v3 release, which is the first version to officially support Zod 4.
`@conform-to/zod` v1.x already declares compatibility with both Zod 3 and Zod
4, so no upgrade is needed for it.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/form-data`
- `libs/zod-utils`

#### Phase 8 — React Email + Resend (apps/show)

`@react-email/components` and `@react-email/render` have both had major
releases. `resend` declares a peer dependency on `@react-email/render` and must
be upgraded together. All three packages are compatible with React 18, so this
phase can land before the React 19 upgrade.

Affected apps:

- `apps/show`

#### Phase 9 — React Router v7 / Remix migration (per app)

React Router v7 is the successor to Remix v2. The `@remix-run/*` packages are
replaced by a single `react-router` package. React Router v7 supports both
React 18 and React 19, so this migration can happen independently of the React
upgrade.

`remix-utils` must be upgraded to v9 together with `react-router`. Before
starting this phase, verify that a Sentry package compatible with React Router
v7 is available; the current `@sentry/remix` v10.x still peer-depends on
`@remix-run/*` v2.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/core`
- `libs/file-storage`
- `libs/search-params-io`
- `libs/zod-utils`

#### Phase 10 — React 19 (per app)

React 19 should be the last upgrade because it has the widest ecosystem impact.
React Router v7 must already be in place before upgrading React, as
`@remix-run/react` v2 is not compatible with React 19.

`react-markdown` v10 requires `react@>=18`, so its upgrade can be batched here
alongside the React 19 upgrade for each app.

Before upgrading each app, verify that the following packages in the catalog
are compatible with React 19 (most already declare `react@>=16 || >=17 || >=18`
as their peer dependency range, so they should be fine):

- `@conform-to/react`
- `@radix-ui/react-*`
- `downshift`
- `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`
- `react-transition-group`
- `remix-utils`

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/core`
- `libs/file-storage`
- `libs/react-primitives`
- `libs/search-params-io`
- `libs/zod-utils`

#### Standalone upgrades (any time)

The following packages have no peer dependency constraints on any of the packages
above. They can be upgraded independently at any time, in any order.

- `croner`: `^8.0.0` → `^10.0.0`
- `focus-trap`: `^7.5.2` → `^8.0.0`
- `lru-cache`: `^10.0.1` → `^11.0.0`
- `node-html-parser`: `^6.1.12` → `^7.0.0`
- `pm2`: `^5.3.0` → `^6.0.0`
- `uuid`: `^9.0.0` → `^13.0.0`
- `@faker-js/faker`: `^8.0.2` → `^10.0.0`

**Advantages**:

- 👍 Each phase has a clearly bounded scope, reducing the blast radius of each
  change.
- 👍 Phases 1, 2, 3, 5, and 7 are workspace-wide and do not require per-app
  coordination.
- 👍 React Router v7 can be adopted before React 19, allowing the two largest
  migrations to be staged independently.
- 👍 Standalone upgrades can be picked up in parallel with any phase.

**Drawbacks**:

- 👎 The Tailwind CSS v4 migration (Phase 4) must be repeated for each app
  individually.
- 👎 The React Router v7 migration (Phase 9) touches many shared libs, requiring
  careful coordination across consuming apps.
- 👎 Ten sequenced phases represent significant ongoing migration effort.

## Consequences

With this plan in place, each team can pick up an upgrade phase for a specific
app without waiting for others. The sequencing ensures that no intermediate
state introduces an incompatible peer dependency combination.

Phases 4, 9, and 10 follow the same per-app pattern enabled by workspace package
injection: upgrade the catalog entry for a given app, verify it works, then
repeat for the next app.

The standalone upgrades can be distributed across teams and applied as
opportunistic improvements alongside any of the ten phases.

## Considered options

1. **Upgrade all dependencies in one pass across the whole workspace**
   - 👍 Single migration effort with no intermediate mixed-version state.
   - 👎 Very large blast radius; high risk of blocking all apps at once.

2. **Upgrade React before React Router v7**
   - 👍 Fewer combined changes per step.
   - 👎 `@remix-run/react` v2 is not compatible with React 19, meaning both must
     be upgraded at the same time anyway; splitting them offers no real benefit.

[002]: 002-workspace-package-injection.md
