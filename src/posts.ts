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
    /** Site locale the page belongs to: "en" under src/pages/en/, otherwise "sk". */
    locale: Locale;
    /** Path without the locale prefix. A translation has the same slug. */
    slug: string;
}

const enPrefix = /^\/en\//u;

/** Every markdown page under src/pages is a post. */
function allPosts(): Post[] {
    const modules = import.meta.glob<{ frontmatter: PostFrontmatter }>("./pages/**/*.{md,mdx}", {
        eager: true,
    });
    return Object.entries(modules).map(([file, mod]) => {
        const path = file.replace(/^\.\/pages/u, "").replace(/\.mdx?$/u, "/");
        return {
            href: url(path),
            title: mod.frontmatter.title,
            lang: mod.frontmatter.lang ?? "sk",
            summary: mod.frontmatter.summary ?? {},
            locale: enPrefix.test(path) ? "en" : "sk",
            slug: path.replace(enPrefix, "/"),
        };
    });
}

/** Posts for a locale's home page. A translated post is listed once, in that locale. */
export function getPosts(locale: Locale): Post[] {
    const bySlug = new Map<string, Post>();
    for (const post of allPosts()) {
        if (!bySlug.has(post.slug) || post.locale === locale) {
            bySlug.set(post.slug, post);
        }
    }
    return [...bySlug.values()].toSorted((a, b) => a.title.localeCompare(b.title));
}

const withoutSlash = (path: string) => path.replace(/\/$/u, "");

/** The post served at a URL path, and its translation if one exists. */
export function findPost(pathname: string) {
    const posts = allPosts();
    const post = posts.find((p) => withoutSlash(p.href) === withoutSlash(pathname));
    const translation = post && posts.find((p) => p.slug === post.slug && p.locale !== post.locale);
    return { post, translation };
}
