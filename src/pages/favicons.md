---
layout: ../layouts/Default.astro
title: Favicons
lang: en
summary:
  sk: Aké súbory favicon potrebuje web, v akých veľkostiach a ako ich prepojiť.
  en: Which favicon files a site needs, in which sizes, and how to link them.
---

# Favicons

## Files

| File                   | Size       | Used by                         |
| ---------------------- | ---------- | ------------------------------- |
| `favicon.svg`          | scalable   | Current browsers                |
| `favicon.ico`          | 16 + 32 px | Older browsers and feed readers |
| `apple-touch-icon.png` | 180×180 px | iOS home screen                 |

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## Tips

- No other sizes (48, 64…) are needed. The SVG scales to any size, and only older tools use the ICO.
- Keep `sizes="32x32"` on the ICO link, or Chrome picks it over the SVG.
- Under a subpath, prefix every `href` with the base path. Browsers only guess `/favicon.ico` at the domain root.
- Design for 16 px: one or two bold letters or a simple shape on a solid background.
- Put a `prefers-color-scheme` rule inside the SVG to switch colours in dark mode.
- Convert text to paths. Favicons can't load web fonts.
- Apple touch icon: solid background, square corners. iOS rounds them and fills transparency with black.
- Web app manifest (192 and 512 px icons) only if the site should install like an app.
- After changing the icon, change its URL (`?v=2`). Browsers cache favicons for a long time.
