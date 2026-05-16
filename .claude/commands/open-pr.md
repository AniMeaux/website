Open a pull request from the current branch changes.

$ARGUMENTS is an optional mode. Use `draft` to open a draft pull request.

Workflow:

1. Collect context from git:
   - Branch name.
   - Commits ahead of `dev`.
   - Changed files.
2. Set base branch to `dev`.
3. Summarise what changed, why, context, risks, and manual testing evidence.
4. Produce a pull request body using this exact template and section order:
   `.claude/commands/assets/pull-request-template.md`
5. If any section details are unknown, write "N/A".
6. Do not remove sections.
7. Ensure the branch is pushed to origin.
8. Decide draft mode from $ARGUMENTS:
   - If `draft`, create a draft pull request.
   - Otherwise, create a ready-for-review pull request.
9. Verify `gh` is installed and authenticated.
10. Open the pull request using `gh pr create` with explicit title and body,
    always with `--base dev`. Use `--draft` only when mode is `draft`.
11. Return only the created pull request URL.
