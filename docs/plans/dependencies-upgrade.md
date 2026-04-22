# Dependencies upgrade plan

Following the workspace package injection approach described in [002][002], we
can now upgrade dependencies incrementally, app by app. Many catalog entries are
behind their latest major release. Some upgrades can be applied workspace-wide
in a single step; others must be applied per app because they involve peer
dependencies that differ between consuming apps.

The upgrades are:

- **TypeScript** `~5.4.5` is several minor releases behind.
- **Vite** `^5.x` has been superseded by Vite 6.
- **Tailwind CSS** `^3.x` has been superseded by Tailwind CSS 4, which brings a
  fundamentally different configuration model.
- **Express** `^4.x` has been superseded by Express 5.
- **Zod** `^3.x` has been superseded by Zod 4.
- **React Email + Resend** have each had major releases.
- **Remix v2** (`@remix-run/*` `~2.9.2`) should first be upgraded to **v2.17.4**
  so it can work with both Vite 5 and Vite 6 (`@remix-run/dev 2.17.4` peers
  `vite ^5.1.0 || ^6.0.0`), then migrated to **React Router v7** (`react-router`
  `^7.0.0`). The dedicated Sentry package for React Router v7 is
  `@sentry/react-router`, which ships OpenTelemetry core v2 as a dependency, so
  the OpenTelemetry upgrade is folded into that phase.
- **React** `^18.x` has been superseded by React 19.
- Several standalone packages have also had major releases that can be applied
  at any time.

Because many of these upgrades declare peer dependencies on each other, the
order of upgrades matters.

ESLint `^9.x` has been superseded by ESLint 10, but three plugins used in the
workspace (`eslint-plugin-jsx-a11y`, `eslint-plugin-react`,
`eslint-plugin-react-hooks`) do not yet declare support for ESLint 10. The
ESLint upgrade is not included in this plan and should be reconsidered once
those plugins ship compatible releases.

## Progress

| Phase                                         | Status      |
| --------------------------------------------- | ----------- |
| [Phase 1: TypeScript][phase-1]                | Complete    |
| [Phase 2: Tailwind CSS 4][phase-2]            | In progress |
| [Phase 3: Remix v2.17.4][phase-3]             | Not started |
| [Phase 4: Vite 6][phase-4]                    | Not started |
| [Phase 5: Express v5][phase-5]                | Not started |
| [Phase 6: Zod v4][phase-6]                    | Not started |
| [Phase 7: React Email + Resend][phase-7]      | Not started |
| [Phase 8: React Router v7 migration][phase-8] | Not started |
| [Phase 9: React 19][phase-9]                  | Not started |
| [Standalone upgrades][standalone-upgrades]    | Complete    |

Update each status as work starts and completes. Keep implementation details in
the related phase section below.

## Dependencies to upgrade

| Package                          | Current          | Target                                | Note                                                                                                  |
| -------------------------------- | ---------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------- |
| `typescript`                     | `~5.4.5`         | `~5.7.0`                              | Several minor releases behind.                                                                        |
| `vite`                           | `^5.2.12`        | `^6.0.0`                              | Major release; requires Remix `@remix-run/dev` `~2.17.4` first.                                       |
| `vite-tsconfig-paths`            | `^4.3.2`         | `^6.0.0`                              | Upgrade together with Vite.                                                                           |
| `tailwindcss`                    | `^3.3.3`         | `^4.0.0`                              | Major release; breaking config changes.                                                               |
| `@tailwindcss/container-queries` | `^0.1.1`         | _(remove)_                            | Merged into Tailwind CSS 4 core.                                                                      |
| `autoprefixer`                   | `^10.4.27`       | _(remove)_                            | No longer required with Tailwind CSS 4.                                                               |
| `prettier-plugin-tailwindcss`    | `^0.7.2`         | Latest compatible with Tailwind CSS 4 | Upgrade together with Tailwind CSS.                                                                   |
| `express`                        | `^4.17.1`        | `^5.0.0`                              | Major release.                                                                                        |
| `zod`                            | `^3.22.2`        | `^4.0.0`                              | Major release; `@conform-to/zod` already supports v4.                                                 |
| `zod-form-data`                  | `^2.0.1`         | `^3.0.0`                              | Major release; upgrade together with Zod.                                                             |
| `react-markdown`                 | `^9.0.1`         | `^10.0.0`                             | Major release; requires `react@>=18`, already satisfied.                                              |
| `@react-email/components`        | `^0.0.28`        | `^1.0.0`                              | Major release; compatible with React 18.                                                              |
| `@react-email/render`            | `^1.0.2`         | `^2.0.0`                              | Major release; compatible with React 18.                                                              |
| `resend`                         | `^4.0.1-alpha.0` | `^6.0.0`                              | Major release; upgrade together with `@react-email/render`.                                           |
| `react-router`                   | `^6.23.1`        | `^7.0.0`                              | Major release; replaces `@remix-run/*`.                                                               |
| `@remix-run/dev`                 | `~2.9.2`         | `~2.17.4` (_then remove_)             | Interim upgrade to unlock Vite 6 (`^5.1.0                                                             |     | ^6.0.0`), then remove during React Router migration. |
| `@remix-run/express`             | `~2.9.2`         | `~2.17.4` (_then remove_)             | Interim upgrade first, then remove during React Router migration.                                     |
| `@remix-run/node`                | `~2.9.2`         | `~2.17.4` (_then remove_)             | Interim upgrade first, then remove during React Router migration.                                     |
| `@remix-run/react`               | `~2.9.2`         | `~2.17.4` (_then remove_)             | Interim upgrade first, then remove during React Router migration.                                     |
| `@remix-run/serve`               | `~2.9.2`         | `~2.17.4` (_then remove_)             | Interim upgrade first, then remove during React Router migration.                                     |
| `@sentry/remix`                  | `^8.37.1`        | `@sentry/react-router ^10.0.0`        | The dedicated Sentry package for React Router v7; upgrade together with `react-router`.               |
| `@opentelemetry/core`            | `^1.27.0`        | `^2.0.0`                              | Upgrade together with `@sentry/react-router`, which ships `@opentelemetry/core ^2.x` as a dependency. |
| `@opentelemetry/sdk-trace-base`  | `^1.27.0`        | `^2.0.0`                              | Upgrade together with `@sentry/react-router`; v2 is compatible with `@opentelemetry/api` v1.9.x.      |
| `@opentelemetry/instrumentation` | `^0.54.2`        | Latest `0.x`                          | Upgrade together with `@sentry/react-router`, which ships `@opentelemetry/instrumentation ^0.214.x`.  |
| `remix-utils`                    | `^7.5.0`         | `^9.0.0`                              | Major release; upgrade together with `react-router`.                                                  |
| `react`                          | `^18.2.0`        | `^19.0.0`                             | Major release.                                                                                        |
| `react-dom`                      | `^18.2.0`        | `^19.0.0`                             | Major release; upgrade together with `react`.                                                         |
| `@types/react`                   | `^18.2.21`       | `^19.0.0`                             | Upgrade together with `react`.                                                                        |
| `@types/react-dom`               | `^18.2.7`        | `^19.0.0`                             | Upgrade together with `react-dom`.                                                                    |

### Standalone upgrades

The following packages have major releases with no peer dependency constraints
on the packages above. They can be upgraded at any time, independently of the
phases below.

| Package            | Current   | Target    |
| ------------------ | --------- | --------- |
| `croner`           | `^8.0.0`  | `^10.0.0` |
| `focus-trap`       | `^7.5.2`  | `^8.0.0`  |
| `lru-cache`        | `^10.0.1` | `^11.0.0` |
| `node-html-parser` | `^6.1.12` | `^7.0.0`  |
| `pm2`              | `^5.3.0`  | `^6.0.0`  |
| `uuid`             | `^9.0.0`  | `^13.0.0` |
| `@faker-js/faker`  | `^8.0.2`  | `^10.0.0` |

## Peer dependencies

The table below maps each dependency being upgraded to the other catalog
packages that declare a peer dependency on it. This determines which packages
must be upgraded together or verified for compatibility.

| Dependency being upgraded | Packages with a peer dependency on it                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwindcss`             | `prettier-plugin-tailwindcss`                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@react-email/render`     | `resend`                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `zod`                     | `@conform-to/zod` (v1.x already supports Zod 3 and 4), `zod-form-data` (v3.x requires `zod>=3.25.0`, compatible with Zod 4)                                                                                                                                                                                                                                                                                                                       |
| `react-router`            | `@sentry/react-router`, `remix-utils`                                                                                                                                                                                                                                                                                                                                                                                                             |
| `react`                   | `@conform-to/react`, `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-slot`, `@radix-ui/react-visually-hidden`, `downshift`, `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`, `react-dom`, `react-markdown`, `react-transition-group`, `react-router`, `@react-email/components`, `@react-email/render` |
| `react-dom`               | `@conform-to/react`, `@radix-ui/react-*`, `react-dnd`, `react-transition-group`, `react-router`, `@react-email/render`                                                                                                                                                                                                                                                                                                                            |

## Upgrade order

The dependencies are grouped into nine phases plus a set of standalone upgrades
that can be applied at any time. Within each phase, dependencies have no
cross-constraints with each other. Phases 2, 8, and 9 must be applied per app to
leverage the workspace package injection approach from [002][002].

### Phase 1 — TypeScript (workspace-wide)

[phase-1]: #phase-1--typescript-workspace-wide

TypeScript has no peer dependency constraints with the other upgrades. It can be
upgraded once for the whole workspace without risk.

- `typescript`: `~5.4.5` → `~5.7.0`

### Phase 2 — Tailwind CSS 4 (per app)

[phase-2]: #phase-2--tailwind-css-4-per-app

Tailwind CSS v4 introduces a fundamentally different configuration model.
`prettier-plugin-tailwindcss` must be upgraded at the same time to match the new
Tailwind CSS version.

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
- `libs/tailwindcss-peekaboo`

### Phase 3 — Remix v2.17.4 (workspace-wide)

[phase-3]: #phase-3--remix-v2174-workspace-wide

Remix v2.9.2 blocks Vite 6 because `@remix-run/dev` peers `vite ^5.1.0`.
Upgrading to Remix v2.17.4 first removes that blocker because
`@remix-run/dev 2.17.4` peers `vite ^5.1.0 || ^6.0.0`.

- `@remix-run/dev`: `~2.9.2` → `~2.17.4`
- `@remix-run/express`: `~2.9.2` → `~2.17.4`
- `@remix-run/node`: `~2.9.2` → `~2.17.4`
- `@remix-run/react`: `~2.9.2` → `~2.17.4`
- `@remix-run/serve`: `~2.9.2` → `~2.17.4`

### Phase 4 — Vite 6 (workspace-wide)

[phase-4]: #phase-4--vite-6-workspace-wide

After Remix v2.17.4 is in place, Vite 6 can be upgraded once for the whole
workspace. `vite-tsconfig-paths` must be upgraded at the same time because its
current version range does not cover Vite 6.

- `vite`: `^5.2.12` → `^6.0.0`
- `vite-tsconfig-paths`: `^4.3.2` → `^6.0.0`

### Phase 5 — Express v5 (apps/show)

[phase-5]: #phase-5--express-v5-appsshow

Express v5 is used only in `apps/show` for the custom server. It is independent
of the Remix or React upgrades and can be applied on its own.

Affected apps:

- `apps/show`

### Phase 6 — Zod v4 (workspace-wide)

[phase-6]: #phase-6--zod-v4-workspace-wide

Zod v4 has breaking API changes. `zod-form-data` must be upgraded together to
its v3 release, which is the first version to officially support Zod 4.
`@conform-to/zod` v1.x already declares compatibility with both Zod 3 and Zod 4,
so no upgrade is needed for it.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/form-data`
- `libs/zod-utils`

### Phase 7 — React Email + Resend (apps/show)

[phase-7]: #phase-7--react-email--resend-appsshow

`@react-email/components` and `@react-email/render` have both had major
releases. `resend` declares a peer dependency on `@react-email/render` and must
be upgraded together. All three packages are compatible with React 18, so this
phase can land before the React 19 upgrade.

Affected apps:

- `apps/show`

### Phase 8 — React Router v7 / Remix migration (per app)

[phase-8]: #phase-8--react-router-v7--remix-migration-per-app

React Router v7 is the successor to Remix v2. The `@remix-run/*` packages are
replaced by a single `react-router` package. React Router v7 supports both React
18 and React 19, so this migration can happen independently of the React
upgrade.

`@sentry/remix` is replaced by `@sentry/react-router`, Sentry's dedicated
package for React Router v7. `@sentry/react-router` ships
`@opentelemetry/core ^2.x` as a regular dependency, so the OpenTelemetry catalog
entries must be updated alongside this migration to avoid a version conflict
with what Sentry expects:

- `@opentelemetry/core`: `^1.27.0` → `^2.0.0`
- `@opentelemetry/sdk-trace-base`: `^1.27.0` → `^2.0.0`
- `@opentelemetry/instrumentation`: `^0.54.2` → `^0.214.0`

`remix-utils` must be upgraded to v9 together with `react-router`.

Affected apps:

- `apps/admin`
- `apps/show`
- `apps/website`

Affected libs:

- `libs/core`
- `libs/file-storage`
- `libs/search-params-io`
- `libs/zod-utils`

### Phase 9 — React 19 (per app)

[phase-9]: #phase-9--react-19-per-app

React 19 should be the last upgrade because it has the widest ecosystem impact.
React Router v7 must already be in place before upgrading React, as
`@remix-run/react` v2 is not compatible with React 19.

`react-markdown` v10 requires `react@>=18`, so its upgrade can be batched here
alongside the React 19 upgrade for each app.

Before upgrading each app, verify that the following packages in the catalog are
compatible with React 19 (most already declare `react@>=16 || >=17 || >=18` as
their peer dependency range, so they should be fine):

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

### Standalone upgrades (any time)

[standalone-upgrades]: #standalone-upgrades-any-time

The following packages have no peer dependency constraints on any of the
packages above. They can be upgraded independently at any time, in any order.

- `croner`: `^8.0.0` → `^10.0.0`
- `focus-trap`: `^7.5.2` → `^8.0.0`
- `lru-cache`: `^10.0.1` → `^11.0.0`
- `node-html-parser`: `^6.1.12` → `^7.0.0`
- `pm2`: `^5.3.0` → `^6.0.0`
- `uuid`: `^9.0.0` → `^13.0.0`
- `@faker-js/faker`: `^8.0.2` → `^10.0.0`

[002]: decisions/002-workspace-package-injection.md
