import type { APIRoute } from "astro";
import { url } from "../i18n/ui";
import { toChecklist } from "../utils/checklist";
import source from "./frontend-best-practices.mdx?raw";

/** Downloadable Markdown checklist built from the Frontend Best Practices page. */
export const GET: APIRoute = ({ site }) => {
    const pageUrl = new URL(url("/frontend-best-practices/"), site);
    const body = toChecklist("Frontend Best Practices – Checklist", pageUrl.href, source);
    return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
