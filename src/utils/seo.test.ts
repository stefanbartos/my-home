import { describe, expect, test } from "vitest";
import { summaryDescription } from "./seo";

const summary = { sk: "Slovenský popis", en: "English summary" };

describe("summaryDescription", () => {
    test("prefers the summary in the content language", () => {
        expect(summaryDescription(summary, "en", "sk")).toBe("English summary");
    });

    test("falls back to the UI locale when the content language has no summary", () => {
        expect(summaryDescription(summary, "cs", "sk")).toBe("Slovenský popis");
    });

    test("returns undefined without a matching summary", () => {
        expect(summaryDescription(undefined, "sk", "sk")).toBeUndefined();
        expect(summaryDescription({ en: "Only English" }, "cs", "sk")).toBeUndefined();
    });
});
