/**
 * Accessibility check of the built site with axe-core.
 *
 * Serves dist/ with `astro preview`, opens every built page in headless
 * Chromium in light and dark mode, and fails when axe finds any WCAG 2.2 A/AA
 * or best-practice violation. Run `npm run build` first.
 *
 * Usage: npm run check:a11y
 */
import { readdir } from "node:fs/promises";
import { sep } from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { preview } from "astro";
import type { BrowserContext } from "playwright";
import { chromium } from "playwright";

const DIST = new URL("../dist/", import.meta.url);
const BASE = "/my-home/";
const SCHEMES = ["light", "dark"] as const;
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
// Third-party content we can't fix (and that would need the network).
const EXCLUDE = [".youtube iframe", ".osm iframe"];

async function htmlPages(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { recursive: true });
    return entries
        .filter((file) => file.endsWith(".html"))
        .map((file) => file.split(sep).join("/"))
        .map((file) => file.replace(/(^|\/)index\.html$/u, "$1"))
        .toSorted();
}

type Violation = Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"][number];

/** One line per failing element: its selector and why it fails. */
function formatNode(node: Violation["nodes"][number]) {
    // The first line of the summary is a heading ("Fix any of the following:").
    const reasons = (node.failureSummary ?? "")
        .split("\n")
        .slice(1)
        .map((line) => line.trim());
    return `    - ${node.target.join(" ")}\n      ${reasons.join("; ")}\n`;
}

function report(violations: Violation[]) {
    return violations
        .map(
            (v) =>
                `  ${v.id} (${v.impact ?? "n/a"}): ${v.help}\n    ${v.helpUrl}\n${v.nodes.map(formatNode).join("")}`,
        )
        .join("");
}

const pages = await htmlPages(DIST.pathname);
if (pages.length === 0) {
    process.stderr.write("No HTML files in dist/. Run `npm run build` first.\n");
    process.exit(1);
}

const server = await preview({ logLevel: "error", server: { port: 4329 } });
const origin = `http://localhost:${server.port}`;
const browser = await chromium.launch();

/** Checks one page in one colour scheme; returns its violation count and report. */
async function checkPage(context: BrowserContext, colorScheme: string, path: string) {
    const page = await context.newPage();
    try {
        await page.goto(`${origin}${BASE}${path}`, { waitUntil: "load" });
        const builder = EXCLUDE.reduce(
            (b, selector) => b.exclude(selector),
            new AxeBuilder({ page }).withTags(TAGS),
        );
        const { violations } = await builder.analyze();
        const label = `[${colorScheme}] ${BASE}${path}`;
        return {
            count: violations.length,
            text:
                violations.length === 0
                    ? `ok    ${label}\n`
                    : `FAIL  ${label}\n${report(violations)}`,
        };
    } finally {
        await page.close();
    }
}

let failures = 0;
try {
    // axe needs a page from an explicit context: one per colour scheme.
    const contexts = await Promise.all(
        SCHEMES.map(async (scheme) => ({
            scheme,
            context: await browser.newContext({ colorScheme: scheme }),
        })),
    );
    const results = await Promise.all(
        contexts.flatMap(({ scheme, context }) =>
            pages.map((path) => checkPage(context, scheme, path)),
        ),
    );
    for (const { count, text } of results) {
        failures += count;
        process.stdout.write(text);
    }
} finally {
    await browser.close();
    await server.stop();
}

process.stdout.write(
    failures === 0
        ? `\nNo accessibility violations on ${pages.length} pages.\n`
        : `\n${failures} accessibility violation(s) found.\n`,
);
process.exitCode = failures === 0 ? 0 : 1;
