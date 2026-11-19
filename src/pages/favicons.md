---
layout: ../layouts/Default.astro
title: Favicony
lang: sk
summary:
  sk: Aké súbory favicon potrebuje web, v akých veľkostiach a ako ich prepojiť.
  en: Which favicon files a site needs, in which sizes, and how to link them.
---

# Favicony

## Súbory

| Súbor                  | Veľkosť    | Kto ho používa                    |
| ---------------------- | ---------- | --------------------------------- |
| `favicon.svg`          | ľubovoľná  | Aktuálne prehliadače              |
| `favicon.ico`          | 16 + 32 px | Staršie prehliadače a RSS čítačky |
| `apple-touch-icon.png` | 180×180 px | Plocha iPhonu a iPadu             |

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## Tipy

- Iné veľkosti (48, 64…) nie sú potrebné. SVG sa prispôsobí akejkoľvek veľkosti a ICO používajú len staršie nástroje.
- Pri ICO nechajte `sizes="32x32"`, inak ho Chrome uprednostní pred SVG.
- Ak web beží v podadresári, pridajte pred každý `href` základnú cestu. Prehliadače samy skúšajú len `/favicon.ico` v koreni domény.
- Navrhujte pre 16 px: jedno či dve výrazné písmená alebo jednoduchý tvar na plnom pozadí.
- Do SVG vložte pravidlo `prefers-color-scheme`, aby v tmavom režime zmenilo farby.
- Text preveďte na krivky. Favicon nevie načítať webové fonty.
- Apple touch icon: plné pozadie, ostré rohy. iOS ich zaoblí sám a priehľadné miesta vyplní čiernou.
- Web app manifest (ikony 192 a 512 px) pridajte len vtedy, ak sa má web inštalovať ako aplikácia.
- Po zmene ikony zmeňte aj jej URL (`?v=2`). Prehliadače si favicony dlho pamätajú.
