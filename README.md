# my-home

Personal notes published as a small static site, built with [Astro](https://astro.build):

- **SCI**: study notes for the _Instruktor lezení na skalách_ (rock climbing instructor) course
- **Prvni pomoc**: first-aid kit and procedure notes

## Run locally

Requires the Node.js version in `.node-version`.

```sh
npm ci
npm run dev       # dev server at http://localhost:4321/my-home/
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Project layout

| Path                        | What's there                                                     |
| --------------------------- | ---------------------------------------------------------------- |
| `src/pages/`                | One file per page (`.md`, or `.mdx` when a page uses components) |
| `src/layouts/Default.astro` | Shared page layout                                               |
| `src/components/`           | `Img` (optimized images) and `YouTube` (video embed)             |
| `src/assets/images/`        | Source images, processed by Astro at build time                  |
| `TASKS.md`                  | Improvement backlog                                              |

To add an image to an `.mdx` page, import it and use the `Img` component with an `alt` description:

```mdx
import Img from "../components/Img.astro";
import photo from "../assets/images/photo.jpg";

<Img src={photo} alt="What the photo shows" width={800} />
```

## Deployment

Every push to `main` builds the site with GitHub Actions (`.github/workflows/pages.yml`) and deploys `dist/` with the official GitHub Pages actions (repo Settings → Pages → Source: "GitHub Actions"). Pull requests only build. The site is served under the `/my-home` base path (see `astro.config.mjs`).
