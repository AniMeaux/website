# Dependencies upgrade plan

Date: **2026-04-12**

Status: **Accepted**

## Context

Following the workspace package injection approach described in [002][002], we
can now upgrade dependencies incrementally, app by app. Several major version
upgrades are overdue:

- **TypeScript** `~5.4.5` is several minor releases behind.
- **Vite** `^5.x` has been superseded by Vite 6.
- **Tailwind CSS** `^3.x` has been superseded by Tailwind CSS 4, which brings a
  fundamentally different configuration model.
- **Remix v2** (`@remix-run/*` `~2.9.2`) has been rebranded and merged into
  **React Router v7** (`react-router` `^7.0.0`).
- **React** `^18.x` has been superseded by React 19.

Because many packages in the workspace declare peer dependencies on these
technologies, the upgrades must be sequenced carefully to avoid incompatible
combinations during the migration period.

## Decision

### Dependencies to upgrade

| Package | Current | Target | Note |
| --- | --- | --- | --- |
| `typescript` | `~5.4.5` | `~5.7.0` | Several minor releases behind. |
| `vite` | `^5.2.12` | `^6.0.0` | Major release. |
| `vite-tsconfig-paths` | `^4.3.2` | Latest compatible with Vite 6 | Verify compatibility. |
| `tailwindcss` | `^3.3.3` | `^4.0.0` | Major release; breaking config changes. |
| `@tailwindcss/container-queries` | `^0.1.1` | *(remove)* | Merged into Tailwind CSS 4 core. |
| `autoprefixer` | `^10.4.27` | *(remove)* | No longer required with Tailwind CSS 4. |
| `prettier-plugin-tailwindcss` | `^0.7.2` | Latest compatible with Tailwind CSS 4 | Must be upgraded together with Tailwind CSS. |
| `react-router` | `^6.23.1` | `^7.0.0` | Major release; replaces `@remix-run/*`. |
| `@remix-run/dev` | `~2.9.2` | *(remove)* | Replaced by `react-router` v7 tooling. |
| `@remix-run/express` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/node` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/react` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@remix-run/serve` | `~2.9.2` | *(remove)* | Replaced by `react-router`. |
| `@sentry/remix` | `^8.37.1` | Latest compatible with React Router v7 | Must be upgraded together with `react-router`. |
| `remix-utils` | `^7.5.0` | Latest compatible with React Router v7 | Must be upgraded together with `react-router`. |
| `react` | `^18.2.0` | `^19.0.0` | Major release. |
| `react-dom` | `^18.2.0` | `^19.0.0` | Major release; upgrade together with `react`. |
| `@types/react` | `^18.2.21` | `^19.0.0` | Upgrade together with `react`. |
| `@types/react-dom` | `^18.2.7` | `^19.0.0` | Upgrade together with `react-dom`. |

### Peer dependencies

The table below maps each dependency being upgraded to the other catalog
packages that declare a peer dependency on it. This determines which packages
must be upgraded together or verified for compatibility.

| Dependency being upgraded | Packages with a peer dependency on it |
| --- | --- |
| `tailwindcss` | `prettier-plugin-tailwindcss` |
| `react` | `@conform-to/react`, `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-slot`, `@radix-ui/react-visually-hidden`, `downshift`, `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`, `react-dom`, `react-markdown`, `react-transition-group`, `react-router` |
| `react-dom` | `@conform-to/react`, `@radix-ui/react-*`, `react-dnd`, `react-transition-group`, `react-router` |
| `react-router` | `@sentry/remix`, `remix-utils` |

### Upgrade order

The dependencies can be grouped into phases. Within a phase, dependencies have
no cross-constraints with each other. Phases 3, 4, and 5 should be applied
app by app to leverage the workspace package injection approach from [002][002].

#### Phase 1 — TypeScript (workspace-wide)

TypeScript has no peer dependency constraints with the other upgrades. It can be
upgraded once for the whole workspace without risk.

- `typescript`: `~5.4.5` → `~5.7.0`

#### Phase 2 — Vite (workspace-wide)

Vite has no peer dependency constraints with the other upgrades. It can be
upgraded once for the whole workspace. `vite-tsconfig-paths` compatibility
should be verified after the upgrade.

- `vite`: `^5.2.12` → `^6.0.0`
- `vite-tsconfig-paths`: verify and update as needed

#### Phase 3 — Tailwind CSS (per app)

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

#### Phase 4 — React Router v7 / Remix migration (per app)

React Router v7 is the successor to Remix v2. The `@remix-run/*` packages are
replaced by a single `react-router` package. React Router v7 supports both
React 18 and React 19, so this migration can happen independently of the React
upgrade.

`@sentry/remix` and `remix-utils` must be upgraded together with `react-router`
because they declare peer dependencies on the Remix or React Router packages.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/core`
- `libs/file-storage`
- `libs/search-params-io`
- `libs/zod-utils`

#### Phase 5 — React 19 (per app)

React 19 should be the last upgrade because it has the widest ecosystem impact.
React Router v7 must already be in place before upgrading React, as `@remix-run/react`
v2 is not compatible with React 19.

Before upgrading each app, verify that the following packages in the catalog
are compatible with React 19 (most already declare `react@>=16 || >=17 || >=18`
as their peer dependency range, so they should be fine):

- `@conform-to/react`
- `@radix-ui/react-*`
- `downshift`
- `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`
- `react-markdown`
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

**Advantages**:

- 👍 Each phase has a clearly bounded scope, reducing the blast radius of each
  change.
- 👍 Phases 1 and 2 are workspace-wide and do not require app-by-app
  coordination.
- 👍 React Router v7 can be adopted before React 19, allowing the two largest
  migrations to be staged independently.

**Drawbacks**:

- 👎 The Tailwind CSS v4 migration (Phase 3) must be repeated for each app
  individually.
- 👎 The React Router v7 migration (Phase 4) touches many shared libs, requiring
  careful coordination across consuming apps.

## Consequences

With this plan in place, each team can pick up an upgrade phase for a specific
app without waiting for others. The sequencing ensures that no intermediate
state introduces an incompatible peer dependency combination.

Phases 3–5 follow the same per-app pattern enabled by workspace package
injection: upgrade the catalog entry for a given app, verify it works, then
repeat for the next app.

## Considered options

1. **Upgrade all dependencies in one pass across the whole workspace**
   - 👍 Single migration effort with no intermediate mixed-version state.
   - 👎 Very large blast radius; high risk of blocking all apps at once.

2. **Upgrade React before React Router v7**
   - 👍 Fewer combined changes per step.
   - 👎 `@remix-run/react` v2 is not compatible with React 19, meaning both must
     be upgraded at the same time anyway; splitting them offers no real benefit.

[002]: 002-workspace-package-injection.md
