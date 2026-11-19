// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://stefanbartos.github.io",
    base: "/my-home",
    integrations: [
        mdx(),
        // Keep the 404 pages out of the sitemap (/404.html is skipped already).
        sitemap({ filter: (page) => !page.endsWith("/404/") }),
    ],
    image: {
        // Scale images down to fit narrow screens (never above their set size)
        // and generate a srcset with several widths.
        layout: "constrained",
        responsiveStyles: true,
        // AVIF encoding dominates the build. Effort 3 (sharp's default is 4) is
        // about 3x faster and, for these photos, produces slightly smaller files.
        service: sharpImageService({ avif: { effort: 3 } }),
    },
    security: {
        // Emits a Content-Security-Policy <meta> tag on every page, with hashes
        // for the scripts Astro renders. GitHub Pages can't set CSP headers.
        csp: {
            directives: [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                "img-src 'self' data: https://stefanbartos.goatcounter.com",
                "font-src https://fonts.gstatic.com",
                "connect-src 'self' https://api.web3forms.com https://stefanbartos.goatcounter.com",
                "frame-src https://www.youtube-nocookie.com",
                "form-action https://api.web3forms.com",
            ],
            scriptDirective: {
                resources: ["'self'", "https://gc.zgo.at"],
            },
            // Code highlighting (Shiki) and responsive images use inline style
            // attributes, which hashes can't cover.
            styleDirective: {
                resources: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            },
        },
    },
    i18n: {
        defaultLocale: "sk",
        locales: ["sk", "en"],
        routing: { prefixDefaultLocale: false },
    },
});
