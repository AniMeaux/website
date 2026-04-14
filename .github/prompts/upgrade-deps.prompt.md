---
name: upgrade-deps
description:
  Upgrade selected dependencies after changelog review and confirmation
agent: agent
model: GPT-5.3-Codex
tools:
  - web/fetch
  - execute/runInTerminal
  - edit/editFiles
argument-hint: List packages to upgrade
---

Upgrade the provided dependencies.

Input:

- ${input:packagesToUpgrade:Package names, one per line or comma-separated}

Workflow:

1. Read [`pnpm-workspace.yaml`][pnpm-workspace].
2. Run `pnpm -r outdated` and keep only selected packages.
3. For each selected package, fetch changelog or release notes with
   #tool:web/fetch and extract only relevant changes between current and target
   versions.
4. Present the changelog summary in this exact format for every package:

   ```md
   Package: <name> (<current> -> <target>)

   - Changelog: <changelog or release-notes URL>
   - Relevant fixes:
     - <fix 1>
     - <fix 2>
   - Relevant features:
     - <feature 1>
     - <feature 2>
   - Breaking changes:
     - <none> | <breaking change details>
   - Risk level: <low|medium|high> - <one-line rationale>
   - Recommendation: <upgrade now|upgrade with caution|defer>
   ```

   If an item has no fixes or features, write `- <none>`.

5. Ask for explicit confirmation before any file edit, for example: "Proceed
   with these version bumps?"
6. Only if confirmed, update [`pnpm-workspace.yaml`][pnpm-workspace] for the
   selected packages and run `pnpm i`.
7. Report bumped packages, changed files, and install warnings.

Reference:

- [Dependency upgrade guidelines][dependency-upgrade-guidelines]

[dependency-upgrade-guidelines]:
  ../instructions/dependency-upgrades.instructions.md
[pnpm-workspace]: ../../pnpm-workspace.yaml
