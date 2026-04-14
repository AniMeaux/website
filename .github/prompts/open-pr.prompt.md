---
name: open-pr
description: Open a pull request using the stable agent template
agent: agent
model: GPT-5.3-Codex
tools:
  - execute/runInTerminal
argument-hint: Optional mode, use `draft` to open a draft pull request
---

Open a pull request from the current branch changes.

Input:

- ${input:mode:Optional mode. Use `draft` for a draft pull request}

Workflow:

1. Collect context from git:
   - Branch name.
   - Commits ahead of `dev`.
   - Changed files.
2. Set base branch to `dev`.
3. Summarise what changed, why, context, risks, and manual testing evidence.
4. Produce a pull request body using this exact template and section order:
   `.github/prompts/assets/pull-request-template.md`
5. If any section details are unknown, write "N/A".
6. Do not remove sections.
7. Ensure the branch is pushed to origin.
8. Decide draft mode from input:
   - If `mode` is `draft`, create a draft pull request.
   - If `mode` is missing or any other value, create a ready-for-review pull
     request.
9. Open the pull request with GitHub CLI using the generated title and body.
10. Return only the created pull request URL.

Command requirements:

1. Verify `gh` is installed and authenticated before creating the pull request.
2. Create the pull request using `gh pr create` with explicit title and body.
3. Always use `--base dev`.
4. Use `--draft` only when `mode` is `draft`.

Output format:

```md
PR URL: <created pull request URL>
```
