import type { APIRoute } from "astro";
import { url } from "../i18n/ui";
import source from "./frontend-best-practices.mdx?raw";

// A `## Section` heading, or the bold lead sentence of a top-level bullet.
const entryPattern = /^## (?<heading>.+)$|^- \*\*(?<item>.+?)\*\*/gmu;

function toChecklistLine({ groups }: RegExpExecArray) {
    return groups?.heading ? `\n## ${groups.heading}\n` : `- [ ] ${groups?.item}`;
}

/**
 * Builds a downloadable Markdown checklist from the Frontend Best Practices page:
 * every `## Section` heading is kept and every bullet's bold lead sentence
 * becomes a `- [ ]` task, so the checklist always matches the page.
 */
export const GET: APIRoute = ({ site }) => {
    const pageUrl = new URL(url("/frontend-best-practices/"), site);
    const entries = [...source.matchAll(entryPattern)].map(toChecklistLine);
    const body = [
        "# Frontend Best Practices – Checklist",
        "",
        `Details and examples for every item: ${pageUrl.href}`,
        ...entries,
    ].join("\n");

    return new Response(`${body}\n`, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
