---
layout: ../layouts/Default.astro
title: Frontend Best Practices
lang: en
summary:
  sk: Čo nastaviť v každom frontend projekte – bezpečnosť závislostí, CI a zdravie kódu.
  en: What to set up in every frontend project – dependency security, CI and code health.
---

# Frontend Best Practices

## Security

- **Set `strict-allow-scripts=true` in the project `.npmrc`.** npm then fails the install when a dependency has install scripts that `allowScripts` in `package.json` doesn't cover, so nothing you haven't reviewed runs on your machine or in CI. See the [npm docs](https://docs.npmjs.com/cli/using-npm/config#strict-allow-scripts).

  ```ini
  strict-allow-scripts=true
  ```

- **Set `min-release-age=7` in the project `.npmrc`.** npm then only installs versions published at least 7 days ago, which gives the community time to spot and pull a compromised release before it reaches you. See the [npm docs](https://docs.npmjs.com/cli/using-npm/config#min-release-age).

  ```ini
  min-release-age=7
  min-release-age-exclude[]=@myorg/*
  ```

  Note: this also delays urgent security fixes. To let a package (or your own packages) through right away, add it to `min-release-age-exclude`, as in the second line above. Only that package skips the delay. Its dependencies still wait.

## Container images

- **Pin container images by digest in pipelines and Dockerfiles.** A tag like `node:22-alpine` can be re-pushed to point at different content, so a compromised or changed image reaches your build without any change on your side. A digest always resolves to the same image. Keep the tag in front of it so people can still read which version it is.

  The same form works in GitLab CI, GitHub Actions and Dockerfiles:

  ```yaml
  # GitLab CI (.gitlab-ci.yml)
  image: node:22-alpine@sha256:<digest>
  ```

  ```yaml
  # GitHub Actions: job container, services and Docker actions
  jobs:
    build:
      container:
        image: node:22-alpine@sha256:<digest>
      services:
        db:
          image: postgres:17@sha256:<digest>
      steps:
        - uses: docker://node:22-alpine@sha256:<digest>
  ```

  ```dockerfile
  # Dockerfile
  FROM node:22-alpine@sha256:<digest>
  ```

  Pin the multi-arch index digest (shown by `docker buildx imagetools inspect node:22-alpine`), not a single-platform one. Automate the updates: Renovate updates digests in all of the files above. Dependabot only covers Dockerfiles and Compose files, not images referenced in GitHub Actions or GitLab CI YAML. Pinning without automated updates leaves you on an old image that stops getting security patches.

## Code health

- **Run [fallow](https://fallow.tools/docs) in CI.** Unused files, exports and dependencies pile up quietly as code changes, and nothing in a normal build fails because of them. fallow finds them, along with copy-pasted code and overly complex functions, in one fast pass with no config for most frameworks. Pass `--fail-on-issues` so findings fail the build. Without it, fallow always exits 0.

  ```json
  "scripts": {
    "lint:fallow": "fallow --fail-on-issues"
  }
  ```

## Git hooks

- **Run the formatter and linter in a pre-commit hook.** Problems are caught on your machine in seconds, before they reach a commit, a review or a CI run. Use [husky](https://typicode.github.io/husky/) to install the hook (its `prepare` script sets it up on every `npm install`) and [lint-staged](https://github.com/lint-staged/lint-staged) to check only the staged files, so the hook stays fast.

  ```json
  "scripts": {
    "prepare": "husky"
  }
  ```

  ```js
  // lint-staged.config.js
  export default {
    "*.{js,ts,vue}": ["oxfmt --no-error-on-unmatched-pattern", "oxlint"],
    "*.{json,css,scss,yml,md}": ["oxfmt --no-error-on-unmatched-pattern"],
  };
  ```

  A hook can be skipped with `git commit --no-verify`, so keep the same checks in CI too.

- **Call tools from `node_modules/.bin`, not through `npx`.** When the package isn't installed locally (a fresh clone before `npm install`, a missing dependency or a typo in the name), `npx` downloads it from the registry and runs it. In a Git hook or in CI there is no terminal to ask you, so it does that without a prompt. You end up running code that isn't pinned by your lockfile and skips `min-release-age` and `allowScripts`. Calling the binary by path runs only what is installed and fails loudly when it's missing.

  ```sh
  # .husky/pre-commit
  # Don't: downloads and runs lint-staged if it isn't installed
  npx lint-staged --allow-empty

  # Do: runs only the locally installed version
  ./node_modules/.bin/lint-staged --allow-empty
  ```

  Git runs hooks from the repository root, so the relative path works. Commands in `package.json` scripts and in the lint-staged config already resolve from `node_modules/.bin`, so there you can call `oxfmt` or `oxlint` by name.
