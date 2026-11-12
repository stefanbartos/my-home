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

## About this repo

Personal notes published as a static site with [Astro](https://astro.build) 7 and MDX. GitHub Pages serves it at https://stefanbartos.github.io/my-home/. Every link and asset path goes under the `/my-home` base path. Build internal URLs with `url()` / `homeUrl()` from `src/i18n/ui.ts`, never hard-code them.

- **Node:** use the version in `.node-version` and install with `npm ci`. Dev server: `npm run dev`, at http://localhost:4321/my-home/.
- **Pages:** each page is one file in `src/pages/`: `.md`, or `.mdx` if it uses components. Any `.md`/`.mdx` page is listed on the home page automatically (`src/posts.ts`). Its front matter needs `layout: ../layouts/Default.astro`, `title`, `lang` (content language, e.g. `sk` or `cs`) and `summary.sk` / `summary.en`. Optionally add `toc: true`.
- **Languages:** the site UI is Slovak (default, no URL prefix) and English (`/en/`). UI strings are in `src/i18n/ui.ts`. Add every new key in both `sk` and `en`. Note content is written in Slovak or Czech. Keep each page in its existing language.
- **Images:** put them in `src/assets/images/` (kebab-case names) and render them with the `Img` component and a meaningful `alt`. Never put them in `public/`. Videos use the `YouTube` component.
- **Layout and components:** the shared layout is `src/layouts/Default.astro`, global styles are in `src/styles/global.css`, and components are in `src/components/`.
- **Code style:** run `npm run format` (oxfmt) before committing. Indentation is 4 spaces, or 2 in md/mdx/json/yaml. oxlint runs strict (pedantic, `--deny-warnings`): use `const`, `===`, curly braces, template literals, `import type`, no `forEach`, no `console`, no non-null assertions. fallow fails on unused files, exports or dependencies, so delete dead code instead of leaving it.
- **CI:** `.github/workflows/pages.yml` runs the format check, oxlint, fallow and the build on every PR, and deploys only from `main`. Trivy scans dependencies and secrets, and zizmor checks workflow security. Workflow actions are pinned to commit SHAs with a version comment, and checkout sets `persist-credentials: false`. Keep both when editing workflows.
- **Backlog:** `TASKS.md` lists the improvement tasks with IDs (e.g. `IMG-01`). When working on one, put its ID in the commit message and PR title, and update its status in `TASKS.md`.
