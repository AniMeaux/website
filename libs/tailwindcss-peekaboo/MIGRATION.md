# Migration map

This file maps previous animation utilities to the new CSS utilities in this
package.

## Core state classes

| Previous utility       | New utility            |
| ---------------------- | ---------------------- |
| `animation-enter`      | `animate-enter`        |
| `animation-exit`       | `animate-exit`         |
| `animation-duration-*` | `animation-duration-*` |

## Opacity

| Previous utility              | New utility     |
| ----------------------------- | --------------- |
| `animation-opacity-*`         | `out-opacity-*` |
| `animation-current-opacity-*` | `in-opacity-*`  |

## Translate

| Previous utility           | New utility          |
| -------------------------- | -------------------- |
| `animation-translate-x-*`  | `out-translate-x-*`  |
| `-animation-translate-x-*` | `-out-translate-x-*` |
| `animation-translate-y-*`  | `out-translate-y-*`  |
| `-animation-translate-y-*` | `-out-translate-y-*` |

## Height

| Previous utility        | New utility    |
| ----------------------- | -------------- |
| `animation-h-*`         | `out-height-*` |
| `animation-current-h-*` | `in-height-*`  |

## Overflow

| Previous utility               | New utility      |
| ------------------------------ | ---------------- |
| `animation-overflow-*`         | `out-overflow-*` |
| `animation-current-overflow-*` | `in-overflow-*`  |

## Keyframes

| Previous utility                    | New utility                             |
| ----------------------------------- | --------------------------------------- |
| `@keyframes enter` (plugin-defined) | `@keyframes enter` (CSS `@theme` block) |
| `@keyframes exit` (plugin-defined)  | `@keyframes exit` (CSS `@theme` block)  |

## Variant examples

- Previous:
  `data-[state=open]:animation-enter data-[state=closed]:animation-exit`
- New: `data-[state=open]:animate-enter data-[state=closed]:animate-exit`

- Previous: `data-opened:animation-enter data-closed:animation-exit`
- New: `data-opened:animate-enter data-closed:animate-exit`
