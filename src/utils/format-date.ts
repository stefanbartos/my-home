import type { Locale } from "../i18n/ui";

/**
 * Long date in the UI locale, e.g. "19. novembra 2026" / "November 19, 2026".
 * Formats in UTC because front matter dates (`2026-11-19`) parse as UTC midnight.
 */
export function formatDate(locale: Locale, date: Date) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}
