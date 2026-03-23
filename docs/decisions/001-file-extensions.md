# File Extensions in Imports

Date: **2026-03-22**

Status: **Accepted**

## Context

- Node.js (version 20 and later) requires file extensions in imports and no
  longer resolves folders to an _index.ts_ file.
- Bundlers do not require file extensions.
- Node.js code in web apps is bundled into a single file.
- Scripts must use file extensions unless they are compiled with a bundler.
- VS Code automatically adds file extensions to imports, which then need to be
  removed manually when they are not necessary.

## Decisions

To ensure consistency, we will enforce the use of file extensions in imports.

For folder imports, we will adopt the [Rust file hierarchy model][rust-modules].

**Before**

```
parent/
└─ feature/
   ├─ index.ts            - Public exports only (feature entry point)
   ├─ feature.ts          - Main part
   ├─ internal-file-1.ts  - Internal part
   └─ internal-file-2.ts  - Internal part
```

```ts
import { feature } from "./feature"
//                      "./feature/index.ts"
```

**After**

```
parent/
├─ feature.ts             - Main part and public exports (feature entry point)
└─ _feature/
   ├─ internal-file-1.ts  - Internal part
   └─ internal-file-2.ts  - Internal part
```

```ts
import { feature } from "./feature.js"
```

We prefix the folder with "_" to avoid any confusion with feature grouping
folders (for example, `animal/`, `core/layouts/`). Using "_" makes it explicit
that the folder is an implementation detail and not a feature group, which
improves code clarity and maintainability.

**Advantages**:

- 👍 Consistency across the entire workspace.
- 👍 Compatibility with import resolution starting with Node.js 22.
- 👍 Clearer folder and file structure.

**Drawbacks**:

- 👎 Requires updating all existing imports.
- 👎 May require some developers to adapt their habits.

## Consequences

- All import paths must be updated to include file extensions.
- All folder imports must be updated to use the new model.
- The change should be transparent for developers, because IDEs and tools handle
  imports automatically.

## Considered options

1. **Compile code with a bundler (for example, [Vite][vite], [webpack][webpack])
   instead of TypeScript**
   - 👍 Makes it possible to avoid file extensions.
   - 👎 Adds complexity and extra tooling.
2. **Use a third-party tool (for example, [tsc-alias][tsc-alias],
   [tsc-module-loader][tsc-module-loader]) to insert extensions**
   - 👍 Possible automation.
   - 👎 Additional complexity and maintenance.
3. **Keep the current structure and explicitly add `index.js` in imports**
   - 👍 Apparent simplicity.
   - 👎 Breaks abstraction and makes refactoring harder.
4. **Use other naming conventions for internal folders**
   - `feature_/`: The underscore may go unnoticed.
   - `internal-feature/`: Longer and may conflict with a feature named
     "internal".

[rust-modules]: https://doc.rust-lang.org/stable/rust-by-example/mod/split.html
[tsc-alias]: https://www.npmjs.com/package/tsc-alias
[tsc-module-loader]: https://www.npmjs.com/package/tsc-module-loader
[vite]: https://vite.dev
[webpack]: https://webpack.js.org
