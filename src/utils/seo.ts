import type { Locale } from "../i18n/ui";

/**
 * Meta description for a post from its front matter `summary`. Prefers the
 * summary in the content language (an English post gets `summary.en`), then
 * the UI locale's (a Czech post gets `summary.sk`). Undefined if neither exists.
 */
export function summaryDescription(
    summary: Partial<Record<Locale, string>> | undefined,
    lang: string,
    locale: Locale,
) {
    const inContentLang = Object.entries(summary ?? {}).find(([key]) => key === lang)?.[1];
    return inContentLang ?? summary?.[locale];
}
