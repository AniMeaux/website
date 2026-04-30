Upgrade the provided dependencies.

$ARGUMENTS is a list of package names to upgrade, one per line or
comma-separated.

Workflow:

1. Read `pnpm-workspace.yaml`.
2. Run `pnpm -r outdated` and keep only selected packages.
3. For each selected package, fetch the changelog or release notes and extract
   only relevant changes between current and target versions.
4. Present the changelog summary in this exact format for every package:

   ```
   Package: <name> (<current> -> <target>)

   - Changelog: <changelog or release-notes URL>
   - Relevant fixes:
     - <fix 1>
   - Relevant features:
     - <feature 1>
   - Breaking changes:
     - <none> | <breaking change details>
   - Risk level: <low|medium|high> - <one-line rationale>
   - Recommendation: <upgrade now|upgrade with caution|defer>
   ```

   If an item has no fixes or features, write `- <none>`.

5. Ask for explicit confirmation before any file edit.
6. Only if confirmed, update `pnpm-workspace.yaml` for the selected packages and
   run `pnpm i`.
7. Report bumped packages, changed files, and install warnings.

Follow the dependency upgrade guidelines in
`.github/instructions/dependency-upgrades.instructions.md`.
