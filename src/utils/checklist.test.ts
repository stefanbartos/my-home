import { describe, expect, test } from "vitest";
import { toChecklist } from "./checklist";

const sourceUrl = "https://example.com/page/";
const header = `# Checklist\n\nDetails and examples for every item: ${sourceUrl}\n`;

function checklistOf(...lines: string[]) {
    return toChecklist("Checklist", sourceUrl, lines.join("\n"));
}

describe("toChecklist", () => {
    test("adds the title and the source link", () => {
        expect(checklistOf()).toBe(header);
    });

    test("keeps section headings and turns bold lead sentences into tasks", () => {
        expect(
            checklistOf(
                "# Page title",
                "## Security",
                "- **Set `a=1` in `.npmrc`.** Because reasons. See [docs](https://example.com).",
                "  ```ini",
                "  a=1",
                "  ```",
                "## Code health",
                "- **Run [fallow](https://fallow.tools) in CI.** More text with **bold**.",
            ),
        ).toBe(
            `${header}\n## Security\n\n- [ ] Set \`a=1\` in \`.npmrc\`.\n\n## Code health\n\n- [ ] Run [fallow](https://fallow.tools) in CI.\n`,
        );
    });

    test("skips bullets without a bold lead, nested bullets and deeper headings", () => {
        expect(
            checklistOf("### Detail", "- Plain bullet", "  - **Nested bold.** Text", "## Kept"),
        ).toBe(`${header}\n## Kept\n\n`);
    });
});
