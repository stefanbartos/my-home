import { afterEach, describe, expect, test, vi } from "vitest";
import { currentYear, formatDate, isoDate, parseFrontmatterDate } from "./date";

const date = new Date("2026-11-19T00:00:00.000Z");

describe("parseFrontmatterDate", () => {
    test("returns a Date as the same point in time", () => {
        expect(parseFrontmatterDate(date)).toStrictEqual(date);
    });

    test("parses an ISO string", () => {
        expect(parseFrontmatterDate("2026-11-19")).toStrictEqual(date);
        expect(parseFrontmatterDate("2026-11-19T00:00:00.000Z")).toStrictEqual(date);
    });

    test("throws a RangeError for an invalid date", () => {
        expect(() => parseFrontmatterDate("not a date")).toThrow(RangeError);
        expect(() => parseFrontmatterDate("2026-13-45")).toThrow("Invalid date: 2026-13-45");
    });
});

describe("formatDate", () => {
    test("formats a long date in the UI locale", () => {
        expect(formatDate("sk", date)).toBe("19. novembra 2026");
        expect(formatDate("en", date)).toBe("November 19, 2026");
    });

    test("formats in UTC, so UTC midnight stays on the same day", () => {
        expect(formatDate("en", new Date("2026-01-01T00:00:00.000Z"))).toBe("January 1, 2026");
    });
});

describe("isoDate", () => {
    test("returns the date part of the ISO string", () => {
        expect(isoDate(date)).toBe("2026-11-19");
    });
});

describe("currentYear", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns the year of the current date", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2031-06-15T12:00:00.000Z"));
        expect(currentYear()).toBe(2031);
    });
});
