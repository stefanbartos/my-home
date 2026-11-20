// A `## Section` heading, or the bold lead sentence of a top-level bullet.
const entryPattern = /^## (?<heading>.+)$|^- \*\*(?<item>.+?)\*\*/gmu;

function toChecklistLine({ groups }: RegExpExecArray) {
    return groups?.heading ? `\n## ${groups.heading}\n` : `- [ ] ${groups?.item}`;
}

/**
 * Markdown page → Markdown checklist. Every `## Section` heading is kept and
 * every top-level bullet that starts with a bold sentence (`- **…**`) becomes
 * a `- [ ]` task with that sentence. Everything else is dropped.
 */
export function toChecklist(title: string, sourceUrl: string, markdown: string) {
    const entries = [...markdown.matchAll(entryPattern)].map((match) => toChecklistLine(match));
    const lines = [
        `# ${title}`,
        "",
        `Details and examples for every item: ${sourceUrl}`,
        ...entries,
    ];
    return `${lines.join("\n")}\n`;
}
