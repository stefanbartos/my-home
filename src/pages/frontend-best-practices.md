---
layout: ../layouts/Default.astro
title: Frontend Best Practices
lang: en
---

# Frontend Best Practices

## Security

- **Set `strict-allow-scripts=true` in the project `.npmrc`.** npm then fails the install when a dependency has install scripts that `allowScripts` in `package.json` doesn't cover, so nothing you haven't reviewed runs on your machine or in CI. See the [npm docs](https://docs.npmjs.com/cli/using-npm/config#strict-allow-scripts).
- **Set `min-release-age=7` in the project `.npmrc`.** npm then only installs versions published at least 7 days ago, which gives the community time to spot and pull a compromised release before it reaches you. See the [npm docs](https://docs.npmjs.com/cli/using-npm/config#min-release-age).
