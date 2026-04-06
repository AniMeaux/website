# Force workspace package injection

Date: **2026-04-03**

Status: **Accepted**

## Context

We need to upgrade some dependencies (e.g. React, Remix / React Router, and
Tailwind CSS) but we can't update them in the entire workspace at once. The plan
is to upgrade them app by app. This means different apps can temporarily require
different versions of the same dependencies, and libs should work with different
versions of their peer dependencies.

To support this, we already moved to [pnpm][pnpm], because it has the features
needed to manage app-specific dependency versions in a monorepo.

By default, workspace packages are symlinked to consumers' `node_modules/`
folder and this works fine when they all share the same versions of
dependencies. But once we start staggered upgrades, this setup becomes risky.

For example, even when `app-2` depends on React 18, `lib-1` may resolve React 19
because `lib-1` is symlinked to its workspace location:

```
.
├─ apps
│  ├─ app-1
│  │  ├─ package.json
│  │  │  └─ deps: lib-1, react@19
│  │  └─ node_modules/
│  │     ├─ lib-1/ -> ../../libs/lib-1/
│  │     └─ react/ -> ../../../node_modules/.pnpm/react@19/node_modules/react/
│  ├─ app-2/
│  │  ├─ package.json
│  │  │  └─ deps: lib-1, react@18
│  │  └─ node_modules/
│  │     ├─ lib-1/ -> ../../libs/lib-1/
│  │     └─ react/ -> ../../../node_modules/.pnpm/react@18/node_modules/react/
├─ libs/
│  └─ lib-1/
│     ├─ package.json
│     │  └─ peer deps: react@18|19
│     └─ node_modules/
│        └─ react/ -> ../../../node_modules/.pnpm/react@19/node_modules/react/
└─ node_modules/
   └─ .pnpm/
      ├─ react@18/
      └─ react@19/
```

Because module resolution starts from the real location of `lib-1` (in `libs/`),
the peer dependency seen by the library can differ from the one installed in the
consumer app.

## Decision

We will use pnpm's workspace package injection feature to install workspace
libraries in the virtual store, treating them like regular dependencies. This
means a copy of each lib is created in the virtual store for each distinct peer
dependency context.

This allows each lib to resolve its peer dependencies as defined by the app.

For example, `lib-1` uses React 19 when imported in `app-1`, and React 18 when
imported in `app-2`.

```
.
├─ apps
│  ├─ app-1
│  │  ├─ package.json
│  │  │  └─ deps: lib-1, react@19
│  │  └─ node_modules/
│  │     ├─ lib-1/ -> ../../../node_modules/.pnpm/lib-1@_react@19/node_modules/lib-1/
│  │     └─ react/ -> ../../../node_modules/.pnpm/react@19/node_modules/react/
│  ├─ app-2/
│  │  ├─ package.json
│  │  │  └─ deps: lib-1, react@18
│  │  └─ node_modules/
│  │     ├─ lib-1/ -> ../../../node_modules/.pnpm/lib-1@_react@18/node_modules/lib-1/
│  │     └─ react/ -> ../../../node_modules/.pnpm/react@18/node_modules/react/
├─ libs/
│  └─ lib-1/
│     └─ package.json
│        └─ peer deps: react@18|19
└─ node_modules/
   └─ .pnpm/
      ├─ lib-1@_react@18/
      │  └─ node_modules/
      │     ├─ lib-1/
      │     └─ react/ -> ../../react@18/node_modules/react/
      ├─ lib-1@_react@19/
      │  └─ node_modules/
      │     ├─ lib-1/
      │     └─ react/ -> ../../react@19/node_modules/react/
      ├─ react@18/
      └─ react@19/
```

### How to inject packages

We'll set [`injectWorkspacePackages`][inject-workspace-packages] to `true` in
`pnpm-workspace.yaml` so workspace packages are installed as injected copies in
the virtual store instead of simple symlinks.

Also, we'll set [`dedupeInjectedDeps`][dedupe-injected-deps] to `false`. This
prevents pnpm from collapsing multiple injected copies back into a single
symlink when peer dependencies are compatible across different apps, which would
defeat the purpose of isolation.

In each `package.json`, set the `files` field to list which files and folders
pnpm should synchronise into injected copies. This tells pnpm exactly which
contents from the source directory should be included when creating a copy.
Without the `files` field, pnpm will not include the `build/` folder in injected
copies, which means consumers will use stale or missing built artifacts.

### How to synchronise injected packages

The [`syncInjectedDepsAfterScripts`][sync-injected-deps-after-scripts] setting
in `pnpm-workspace.yaml` ensures pnpm automatically synchronises an injected
package with its source each time specified scripts finish. One-off scripts like
`build` are straightforward to track, but `dev` scripts are more complex: they
run once and keep tools in watch mode, so subsequent rebuilds by those tools are
not detected by pnpm and the synchronisation does not happen automatically.

To solve this, we'll add a `dev:sync-workspace` script that watches the `build/`
folder and invokes a `sync-workspace` script each time the folder changes. The
`sync-workspace` script itself is a no-op, its only purpose is to trigger pnpm's
synchronisation mechanism. For consistency, configure
`syncInjectedDepsAfterScripts` to track only `sync-workspace`, and use
post-scripts (such as `postbuild`) for one-off builds, allowing each package to
control when synchronisation occurs.

In app `Dockerfile`s, the virtual store and dependencies are copied before the
source code or `build/` folders to optimize layer caching. However, pnpm can
only synchronise packages when running configured scripts. Libraries without a
build script will not be synchronised during the build, and when the final image
is constructed with only the `build/` folders copied, injected packages will
have stale contents. To ensure injected packages stay synchronised with
workspace sources, we'll add extra `pnpm install` calls at the points where
source code or build outputs change.

**Advantages**:

- 👍 Enables app-by-app dependency upgrades.
- 👍 Reduces cross-app peer dependency interference.
- 👍 Improves reproducibility between local, CI, and Docker installs.

**Drawbacks**:

- 👎 Slightly larger install footprint compared to pure symlinks.
- 👎 Slightly more complex synchronisation configuration.

## Consequences

With workspace package injection enabled, we can safely upgrade dependencies app
by app without coordinating a single workspace-wide migration. Each app's
dependency graph is isolated in the virtual store, so different apps can use
different versions of the same peer dependencies without conflicts.

The setup requires careful configuration: settings in `pnpm-workspace.yaml`, the
`files` field in each `package.json`, and explicit `pnpm install` calls in
`Dockerfile`s to ensure injected packages stay synchronised. Development scripts
must preserve synchronisation between the source and injected copies, which is
handled by the `sync-workspace` hook pattern described above.

The positive consequence is that we can now upgrade dependencies incrementally,
reducing risk and allowing teams to work independently on different apps.

## Considered options

1. **Upgrade all apps and libraries in one global dependency migration**
   - 👍 Avoids temporary mixed peer dependency states.
   - 👎 High coordination cost and larger blast radius.

[dedupe-injected-deps]: https://pnpm.io/workspaces#dedupeinjecteddeps
[inject-workspace-packages]: https://pnpm.io/workspaces#injectworkspacepackages
[pnpm]: https://pnpm.io/
[sync-injected-deps-after-scripts]:
  https://pnpm.io/workspaces#syncinjecteddepsafterscripts
