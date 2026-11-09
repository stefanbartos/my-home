---
layout: ../layouts/Default.astro
title: Frontend Best Practices
lang: en
---

# Frontend Best Practices

## Security

- **Set `strict-allow-scripts=true` in the project `.npmrc`.** npm then fails the install when a dependency has install scripts that `allowScripts` in `package.json` doesn't cover, so nothing you haven't reviewed runs on your machine or in CI. See the [npm docs](https://docs.npmjs.com/cli/using-npm/config#strict-allow-scripts).
