import type { Locale } from "../i18n/ui";

/**
 * Front matter date → Date. YAML parses `updated: 2026-11-19` as a Date at UTC
 * midnight, and Astro passes it on either as that Date or as its ISO string.
 * Throws a RangeError for an invalid value.
 */
export function parseFrontmatterDate(value: Date | string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new RangeError(`Invalid date: ${String(value)}`);
    }
    return date;
}

/**
 * Long date in the UI locale, e.g. "19. novembra 2026" / "November 19, 2026".
 * Formats in UTC because front matter dates are UTC midnight.
 */
export function formatDate(locale: Locale, date: Date) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** ISO date for `<time datetime>`, e.g. "2026-11-19". */
export function isoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

/** Current year, e.g. 2026 (the build date's year on the static site). */
export function currentYear() {
    return new Date().getFullYear();
}
