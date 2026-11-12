# Improvement tasks

Backlog from a project review (2026-11-03). Each task has a unique ID; reference it in commits and PRs (e.g. `BUG-01: add front matter to prvni-pomoc`).

**Priority:** P1 = visible to visitors / broken, P2 = should do, P3 = nice to have.
**Size:** S = under 30 min, M = about 1–2 h, L = half a day or more.

**Status** (updated 2026-11-10): Done, Open, or Obsolete. The site moved from Eleventy to Astro in #4, so some tasks below describe Eleventy files that no longer exist.

## Summary

| ID                | Task                                                          | Priority | Size | Status   | PRs      |
| ----------------- | ------------------------------------------------------------- | -------- | ---- | -------- | -------- |
| [BUG-01](#bug-01) | Add front matter to `prvni-pomoc.md`                          | P1       | S    | Done     | #4       |
| [BUG-02](#bug-02) | Link all pages from the home page                             | P1       | S    | Done     | #6       |
| [BUG-03](#bug-03) | Make bare URLs clickable                                      | P1       | S    | Done     | #4       |
| [BUG-04](#bug-04) | Constrain image size (SCI outline image + overflow on mobile) | P1       | S    | Done     | #7       |
| [BUG-05](#bug-05) | Set the page language to Czech                                | P1       | S    | Done     | #8       |
| [IMG-01](#img-01) | Downsize oversized source photos                              | P2       | S    | Open     | #13      |
| [IMG-02](#img-02) | Generate responsive image widths                              | P2       | S    | Done     | #7       |
| [IMG-03](#img-03) | Add meaningful `alt` text to images                           | P2       | M    | Done     | #14      |
| [CI-01](#ci-01)   | Remove Hugo leftovers from the workflow                       | P2       | S    | Done     | #4       |
| [CI-02](#ci-02)   | Migrate to the official GitHub Pages actions                  | P2       | M    | Done     | #33      |
| [CI-03](#ci-03)   | Cancel superseded deploys                                     | P3       | S    | Done     | #17      |
| [CI-04](#ci-04)   | Build on pull requests                                        | P2       | S    | Done     | #16      |
| [HK-01](#hk-01)   | Clean up `package.json` metadata                              | P3       | S    | Open     | #18      |
| [HK-02](#hk-02)   | Update dependencies and fix `npm audit` findings              | P2       | S    | Obsolete | #4       |
| [HK-03](#hk-03)   | Trim `.gitignore`                                             | P3       | S    | Done     | #19      |
| [HK-04](#hk-04)   | Remove Astro leftovers locally                                | P3       | S    | Obsolete | #4       |
| [HK-05](#hk-05)   | Write a README                                                | P3       | S    | Done     | #20      |
| [UX-01](#ux-01)   | Add a minimal stylesheet                                      | P1       | S    | Done     | #9       |
| [UX-02](#ux-02)   | Add site navigation to the layout                             | P2       | S    | Done     | #10      |
| [UX-03](#ux-03)   | Add a table of contents to `sci.md`                           | P3       | M    | Done     | #11      |
| [UX-04](#ux-04)   | Harden the YouTube shortcode                                  | P3       | S    | Done     | #12      |
| [CNT-01](#cnt-01) | Fix heading hierarchy and deprecated markup in `sci.md`       | P2       | S    | Done     | #21      |
| [CNT-02](#cnt-02) | Fix typos                                                     | P2       | S    | Done     | #22, #23 |
| [CNT-03](#cnt-03) | Add diacritics to `prvni-pomoc.md`                            | P3       | M    | Done     | #23      |
| [CNT-04](#cnt-04) | Resolve open question on the double bowline backup knot       | P2       | S    | Open     |          |

---

## Bugs

### BUG-01

**Add front matter to `prvni-pomoc.md`** · P1 · S

**Status:** Done in #4: every Astro page sets `layout` and `title` in its front matter.

The file has no front matter, so it renders without the layout. The output starts directly at `<h1>`, with no `<html>`, `<head>`, `<meta charset>` or `<title>`. Diacritics may display garbled, and the browser tab shows no title.

- [x] Add `layout: default` and a `title` to `src/prvni-pomoc.md`
- Optional: set the layout for all pages at once with `src/src.json` (`{ "layout": "default" }`)

### BUG-02

**Link all pages from the home page** · P1 · S

**Status:** Done in #6.

`src/index.md` only contains `# My home`, so the other pages can't be found without knowing their URLs.

- [x] Add links to SCI and Prvni pomoc (or generate the list from a collection)

### BUG-03

**Make bare URLs clickable** · P1 · S

**Status:** Done in #4: Astro's Markdown/MDX has GFM enabled, which links bare URLs automatically.

Eleventy's markdown-it doesn't auto-link URLs. In `sci.md` → "Guidelines" (partner-check PDF, YouTube video) and "Vybudování štandu s preferencí jednoho bodu" (Metodická karta), the URLs render as plain text.

- [x] Either wrap them as `[text](url)`, or enable `linkify` via `eleventyConfig.amendLibrary("md", md => md.set({ linkify: true }))`

### BUG-04

**Constrain image size** · P1 · S

**Status:** Done in #7 (Astro responsive images, `img { max-width: 100% }` in the layout).

eleventy-img drops the `height="500"` on `osnova_sci.jpg`, so it renders at 1259×1781. The site has no CSS, so wide images overflow on phones.

- [x] Add `img { max-width: 100%; height: auto; }` (see [UX-01](#ux-01))
- [x] Set an explicit `width` on `osnova_sci.jpg` instead of `height`

### BUG-05

**Set the page language to Czech** · P1 · S

**Status:** Done in #8: `lang="cs"` by default, `lang: sk` on `prvni-pomoc.md`.

`src/_includes/default.html` has `<html lang="en">`, but the content is Czech/Slovak. This affects screen readers, hyphenation and browser translate prompts.

- [x] Change to `lang="cs"`, and optionally allow a per-page override (`lang="{{ lang | default: 'cs' }}"`, with `lang: sk` on `prvni-pomoc.md`)

## Images

### IMG-01

**Downsize oversized source photos** · P2 · S

**Status:** Open: PR #13 is waiting for review. The two `stand_z_docasnych_pomucek` photos are still 7–8 MB on `main`.

`.git` is about 33 MB, mostly photos. `stand_z_docasnych_pomucek_1/2.jpg` are 7–8 MB each, and `slaneni_pres_uzel_1/2/3.jpeg` are about 2.5 MB each.

- [ ] Resize the originals to about 2000px on the long edge before committing (e.g. `sips -Z 2000 file.jpg`)
- Note: this doesn't shrink history; rewriting history isn't worth it for this repo

### IMG-02

**Generate responsive image widths** · P2 · S

**Status:** Done in #7: `image.layout: "constrained"` in `astro.config.mjs` generates a `srcset`.

`widths: ["auto"]` in `eleventy.config.js` outputs one size per image.

- [x] Use e.g. `widths: [400, 800, 1600]` and add `sizes="100vw"` (or a tighter value) to `htmlOptions.imgAttributes`

### IMG-03

**Add meaningful `alt` text to images** · P2 · M

**Status:** Done in #14: the `Img` component requires `alt`.

All images in `sci.md` have `alt=""`. These are instructional photos, so a short description helps accessibility and makes the content searchable.

- [x] Write an `alt` for each image in `src/sci.md`

## CI/CD

### CI-01

**Remove Hugo leftovers from the workflow** · P2 · S

**Status:** Done in #4: the rewritten workflow (now `pages.yml`) has neither option.

`.github/workflows/gh-pages.yml` checks out with `submodules: true` and `fetch-depth: 0` ("Fetch Hugo themes…"). Neither is needed.

- [x] Remove both options and the related comments

### CI-02

**Migrate to the official GitHub Pages actions** · P2 · M

**Status:** Done: deployed with the official actions since #33 (Pages source is "GitHub Actions"), and the unused `gh-pages` branch was deleted on 2026-11-12.

`peaceiris/actions-gh-pages` pushes to a `gh-pages` branch and needs `contents: write`.

- [x] Replace it with `actions/upload-pages-artifact` + `actions/deploy-pages`
- [x] Narrow permissions to `pages: write`, `id-token: write`, `contents: read`
- [x] Switch repo Settings → Pages → Source to "GitHub Actions"
- [x] Delete the `gh-pages` branch after the first successful deploy

### CI-03

**Cancel superseded deploys** · P3 · S

**Status:** Done in #17: PR builds cancel superseded runs, and deploys use `group: pages` without cancelling.

- [x] Add `cancel-in-progress: true` to the `concurrency` block (or follow the Pages-recommended `group: pages` setup from [CI-02](#ci-02))

### CI-04

**Build on pull requests** · P2 · S

**Status:** Done in #16.

Today the workflow only runs on pushes to `main`, so a broken build is only discovered after merging.

- [x] Add a `pull_request` trigger that runs the build but skips the deploy step

## Housekeeping

### HK-01

**Clean up `package.json` metadata** · P3 · S

**Status:** Open: #18 removed `main`, filled in `description` and `author` and set `"private": true`. `license` is still `ISC`.

- [x] Remove the template default `"main": "index.js"`
- [x] Fill in `description` and `author`
- [ ] Choose a license deliberately (or set `"private": true` and drop `license`)

### HK-02

**Update dependencies and fix `npm audit` findings** · P2 · S

**Status:** Obsolete: Eleventy was removed in #4. `npm audit` reports 0 vulnerabilities (2026-11-10), and Dependabot handles updates.

- [x] `@11ty/eleventy` 3.1.2 → 3.1.7 (patch)
- [x] `npm audit fix`: high-severity issues in `brace-expansion` and `flatted` (build-time only)
- [x] Evaluate `@11ty/eleventy-img` 6 → 7 (major; check the changelog)

### HK-03

**Trim `.gitignore`** · P3 · S

**Status:** Done in #19.

It was copied from the Eleventy repo itself (`packages/*/visualize`, `api-docs/`, `test/stubs-layout-cache`, …).

- [x] Reduce it to `node_modules/`, `public/`, `_site/`, `.cache/`, `.DS_Store` and editor folders

### HK-04

**Remove Astro leftovers locally** · P3 · S

**Status:** Obsolete: the site uses Astro since #4, so the Astro packages and `.astro/` (ignored) are expected.

The local `node_modules` contains Astro packages, and there's an empty `.astro/` directory. Nothing is committed, but the stale install can mask problems.

- [x] `rm -rf node_modules .astro && npm ci`

### HK-05

**Write a README** · P3 · S

**Status:** Done in #20.

- [x] Describe what the site is, how to run it (`npm start`), and how and where it deploys

## UX

### UX-01

**Add a minimal stylesheet** · P1 · S

**Status:** Done in #9: styles live in `src/layouts/Default.astro`.

The site has no CSS at all. Long pages like `sci.md` are hard to read.

- [x] Add a small stylesheet (readable `max-width`, system font, line-height, `img { max-width: 100%; height: auto }`, dark mode via `prefers-color-scheme`)
- [x] Copy it to the output with `addPassthroughCopy` and link it in the layout

### UX-02

**Add site navigation to the layout** · P2 · S

**Status:** Done in the site redesign (`feat-improve-ui`): `Default.astro` now has a site header with a home link, a nav, a language switch and a theme toggle. PR #10 was closed as superseded.

- [x] Add a `<nav>` to `default.html` with links to all pages (use the `url` filter so `pathPrefix` works)

### UX-03

**Add a table of contents to `sci.md`** · P3 · M

**Status:** Done in #11: `toc: true` in front matter renders the `Toc` component.

`sci.md` is about 20 KB with about 40 sections.

- [x] Add heading anchors (`markdown-it-anchor`) and a TOC (e.g. `eleventy-plugin-toc` or a manual list)

### UX-04

**Harden the YouTube shortcode** · P3 · S

**Status:** Done in #12: replaced by the `YouTube` Astro component.

In `eleventy.config.js`:

- [x] HTML-escape `title` before putting it into the attribute
- [x] Support `youtu.be/<id>` URLs, not just `?v=`
- [x] Replace the deprecated `frameborder` and the padding-bottom trick with CSS `aspect-ratio: 16 / 9`

## Content

### CNT-01

**Fix heading hierarchy and deprecated markup in `sci.md`** · P2 · S

**Status:** Done in #21.

- [x] Replace `# <center>SCI</center>` with a plain heading (center with CSS if wanted)
- [x] Fix heading levels, which jump h1 → h3 → h2 (sections should be h2, subsections h3)

### CNT-02

**Fix typos** · P2 · S

**Status:** Done: `sci.md` typos in #22, `prvni-pomoc.md` typos as part of the rewrite in #23.

- [x] `sci.md`: "0značení" → "Označení", "určt" → "Určit", "vhodny" → "vhodný", "význarnné" → "významné", "druhủ" → "druhů", "obtžnosti" → "obtížnosti", "dloušťka" → "tloušťka", "smyce" → "smyčky", "Použivané" → "Používané", "zraněni" → "zranění"
- [x] `prvni-pomoc.md`: "Napriklda" → "Napríklad", "som v sam v bezpeci" → "som sám v bezpečí", "prestrinut" → "prestrihnúť"

### CNT-03

**Add diacritics to `prvni-pomoc.md`** · P3 · M

**Status:** Done in #23.

Most of the page is written without diacritics, unlike the other pages.

- [x] Rewrite with full diacritics

### CNT-04

**Resolve open question on the double bowline backup knot** · P2 · S

**Status:** Open: `sci.mdx` still says "(dvojitý?)".

`sci.md` → "Dvojitá dračí smyčka" says: "Vhodnější je navázat … pojišťovací uzel (dvojitý?)". This is safety material that may be shared with students, so it shouldn't contain open questions.

- [ ] Confirm against the ČHS methodology and replace the question with a definite statement
