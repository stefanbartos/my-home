import type { Locale } from "./i18n/ui";
import { url } from "./i18n/ui";

interface PostFrontmatter {
    title: string;
    lang?: string;
    summary?: Partial<Record<Locale, string>>;
}

export interface Post {
    href: string;
    title: string;
    lang: string;
    summary: Partial<Record<Locale, string>>;
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
        }))
        .toSorted((a, b) => a.title.localeCompare(b.title));
}
