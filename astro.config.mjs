// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://stefanbartos.github.io",
    base: "/my-home",
    integrations: [mdx(), sitemap()],
    image: {
        // Scale images down to fit narrow screens (never above their set size)
        // and generate a srcset with several widths.
        layout: "constrained",
        responsiveStyles: true,
        // AVIF encoding dominates the build. Effort 3 (sharp's default is 4) is
        // about 3x faster and, for these photos, produces slightly smaller files.
        service: sharpImageService({ avif: { effort: 3 } }),
    },
    i18n: {
        defaultLocale: "sk",
        locales: ["sk", "en"],
        routing: { prefixDefaultLocale: false },
    },
});
