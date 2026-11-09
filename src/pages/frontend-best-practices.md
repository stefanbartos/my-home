---
layout: ../layouts/Default.astro
title: Frontend Best Practices
lang: en
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

## Code health

- **Run [fallow](https://fallow.tools/docs) in CI.** Unused files, exports and dependencies pile up quietly as code changes, and nothing in a normal build fails because of them. fallow finds them, along with copy-pasted code and overly complex functions, in one fast pass with no config for most frameworks. Pass `--fail-on-issues` so findings fail the build. Without it, fallow always exits 0.

  ```json
  "scripts": {
    "lint:fallow": "fallow --fail-on-issues"
  }
  ```
