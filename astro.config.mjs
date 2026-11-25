// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Astro hashes only the scripts it bundles, not is:inline ones. The theme
// script must run inline before first paint, so hash its exact source here.
const themeInit = readFileSync(new URL("src/scripts/theme-init.js", import.meta.url), "utf8");
/** @type {`sha256-${string}`} */
const themeInitHash = `sha256-${createHash("sha256").update(themeInit).digest("base64")}`;

export default defineConfig({
    site: "https://stefanbartos.github.io",
    base: "/my-home",
    integrations: [
        mdx(),
        // Keep the 404 pages out of the sitemap (/404.html is skipped already).
        sitemap({ filter: (page) => !page.endsWith("/404/") }),
    ],
    markdown: {
        // The default github-dark theme greys out comments below 4.5:1 contrast.
        shikiConfig: { theme: "github-dark-default" },
    },
    image: {
        // Scale images down to fit narrow screens (never above their set size)
        // and generate a srcset with several widths.
        layout: "constrained",
        responsiveStyles: true,
        // AVIF encoding dominates the build. Effort 3 (sharp's default is 4) is
        // about 3x faster and, for these photos, produces slightly smaller files.
        service: sharpImageService({ avif: { effort: 3 } }),
    },
    vite: {
        build: {
            // Emit every font as a file. Vite would inline small subsets as data:
            // URIs, which the CSP's font-src 'self' blocks.
            assetsInlineLimit: (filePath) => (filePath.endsWith(".woff2") ? false : undefined),
        },
    },
    security: {
        // Emits a Content-Security-Policy <meta> tag on every page, with hashes
        // for the scripts Astro renders. GitHub Pages can't set CSP headers.
        csp: {
            directives: [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                // GpxMap loads OpenTopoMap tiles.
                "img-src 'self' data: https://stefanbartos.goatcounter.com https://*.tile.opentopomap.org",
                "font-src 'self'",
                "connect-src 'self' https://api.web3forms.com https://stefanbartos.goatcounter.com",
                // The mapy.com embed redirects through Seznam hosts (login, cookie sync) before it loads.
                "frame-src https://www.youtube-nocookie.com https://mapy.com https://*.seznam.cz https://www.openstreetmap.org",
                "form-action https://api.web3forms.com",
            ],
            scriptDirective: {
                // Only the pinned GoatCounter script, not the whole host.
                resources: ["'self'", "https://gc.zgo.at/count.v4.js"],
                hashes: [themeInitHash],
            },
            // Code highlighting (Shiki) and responsive images use inline style
            // attributes, which hashes can't cover.
            styleDirective: {
                resources: ["'self'", "'unsafe-inline'"],
            },
        },
    },
    i18n: {
        defaultLocale: "sk",
        locales: ["sk", "en"],
        routing: { prefixDefaultLocale: false },
    },
});
