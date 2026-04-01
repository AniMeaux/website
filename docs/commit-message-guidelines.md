# Commit message guidelines

The rules below are inspired by the [Angular convention][convention-angular].

## Overall structure

Each commit message is structured in three sections, separated by a blank line:

```
<header>

<body>

<footer>
```

- `header` is required.
- `body` is recommended to provide additional details. Agents must always
  include it.
- `footer` is optional.

**General writing rules** (unless otherwise specified):

- **Start with a capital letter**: Improves readability.
- **Use the imperative mood**: For example, `Change` instead of `Changed` or
  `Changes`.
- **End punctuation**: Write complete sentences.
- **Maximum 72 characters per line**: For [optimal
  readability][improving-your-commit-message].

## `header` format

```
<type>(<package>): <summary>
```

- `type` and `summary` are required.
- `package` is optional.
- Keep the `header` under 50 characters for [optimal
  readability][improving-your-commit-message]. This counts every character in
  the full line, including `type`, parentheses, `package`, colon, and space.

### Allowed `type` values

`type` must be one of the following:

- `feat`: Adds a new feature to production code.
- `fix`: Fixes a bug in production code.
- `refac`: Changes in production code that are neither `feat` nor `fix`.
- `docs`: Documentation updates or improvements.
- `test`: Test-related changes.
- `chore`: Other changes (build system, CI, etc.).

### Allowed `package` values

`package` is the package name for the changed app or lib.

Use the folder name under `apps/` or `libs/` (for example: `admin`, `show`,
`website`, `core`).

Set `package` if and only if every changed file belongs to the same package
folder. Omit it otherwise (multiple packages touched, or repository-wide changes
such as CI configuration, root tooling, or documentation).

### `summary`

`summary` must be a concise description of the change:

- **Start with a capital letter**: Improves readability.
- **Use the imperative mood**: For example, `Change` instead of `Changed` or
  `Changes`.
- **No final period**: `summary` is not a complete sentence.

## `body` format

`body` explains the motivation behind the change. It should clarify why the
change was made and may include a comparison between previous and new behavior.

## `footer` format

`footer` contains additional details for deprecations.

Deprecations must start with `DEPRECATED: ` followed by a summary, a blank line,
and deprecation details including the recommended migration path.

```
DEPRECATED: <summary>

<description and recommended update path>
```

## Revert commits

If a commit reverts a previous commit, it must start with `revert: ` followed by
the original commit `header`.

The commit `body` must start with `This reverts commit <SHORT-SHA>` followed by
a blank line and a clear explanation of the reason for the revert.

```
revert: <original-header>

This reverts commit <short-hash>

<description>
```

## Examples

```
feat(admin): Update minimum chair count

Allow users to set exhibitors chair count to `0`.
```

```
chore: Update ESLint configuration

Apply new shared rules across all packages.
```

```
feat: Get timezone from route loaders

DEPRECATED: `useTimezone` is deprecated and will be removed.

Return the timezone from loaders using `getHints(request).timezone`
and access it in components using `useLoaderData()`.
```

```
revert: feat(admin): Update minimum chair count

This reverts commit 1234567

It introduced a bug in the exhibitor dashboard.
```

[convention-angular]:
  https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md
[improving-your-commit-message]:
  https://dev.to/noelworden/improving-your-commit-message-with-the-50-72-rule-3g79
