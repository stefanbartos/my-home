import type { Locale } from "./i18n/ui";
import { url } from "./i18n/ui";

interface PostFrontmatter {
    title: string;
    lang?: string;
    summary?: Partial<Record<Locale, string>>;
    /** Date of the last content edit, e.g. `updated: 2026-11-19` (YAML parses it as a Date). */
    updated?: Date | string;
}

export interface Post {
    href: string;
    title: string;
    lang: string;
    summary: Partial<Record<Locale, string>>;
    updated: Date;
}

/** Every markdown page under src/pages is a post. */
export function getPosts(): Post[] {
    const modules = import.meta.glob<{ frontmatter: PostFrontmatter }>("./pages/**/*.{md,mdx}", {
        eager: true,
    });
    return Object.entries(modules)
        .map(([file, mod]) => ({
            href: url(file.replace(/^\.\/pages/u, "").replace(/\.mdx?$/u, "/")),
            title: mod.frontmatter.title,
            lang: mod.frontmatter.lang ?? "sk",
            summary: mod.frontmatter.summary ?? {},
            updated: parseUpdated(file, mod.frontmatter.updated),
        }))
        .toSorted((a, b) => a.title.localeCompare(b.title));
}

/** Fails the build when a page has no valid `updated` date in its front matter. */
function parseUpdated(file: string, value: Date | string | undefined): Date {
    const date = value === undefined ? undefined : new Date(value);
    if (date === undefined || Number.isNaN(date.getTime())) {
        throw new Error(`${file}: front matter needs a valid \`updated: YYYY-MM-DD\` date`);
    }
    return date;
}
