// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
    site: "https://stefanbartos.github.io",
    base: "/my-home",
    integrations: [mdx()],
    image: {
        // Scale images down to fit narrow screens (never above their set size)
        // and generate a srcset with several widths.
        layout: "constrained",
        responsiveStyles: true,
    },
    i18n: {
        defaultLocale: "sk",
        locales: ["sk", "en"],
        routing: { prefixDefaultLocale: false },
    },
});
