# CLAUDE.md

## Workflow: always work in a worktree and open a PR

For every task that changes files in this repo, work on your own without asking for confirmation at each step:

1. **Create a worktree.** Never edit or commit on `main` in the main checkout. Start each task in a new git worktree on a new branch off up-to-date `origin/main`. Use the `EnterWorktree` tool if you have it, or else run:
   ```sh
   git fetch origin
   git worktree add ../my-home-<short-task-name> -b <type>/<short-task-name> origin/main
   ```
   Then do all work inside that worktree. Run `npm install` there if `node_modules` is missing.
2. **Implement and verify.** Before committing, run `npm run format:check`, `npm run lint`, `npm run lint:fallow` and `npm run build` in the worktree, and fix any failures.
3. **Commit** with a clear message. Commits must use the GitHub noreply email `18068307+stefanbartos@users.noreply.github.com` as both author and committer. Otherwise GitHub rejects the push because of email privacy settings.
4. **Push and open the PR yourself.** Push the branch to `origin` and open a pull request against `main` with `gh pr create`. Give it a descriptive title and a body that summarizes the changes and how you verified them. Don't wait for approval before pushing or opening the PR.
5. **Report back** with the PR URL. Leave the worktree in place until the PR is merged. Don't merge the PR unless asked.
