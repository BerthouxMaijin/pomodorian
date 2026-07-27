/**
 * Pulls the FAQ block out of an article's markdown so a page can emit FAQPage
 * structured data built from the exact text the reader sees: Google requires
 * the two to match, which rules out keeping the questions in a side file.
 */

const FAQ_HEADING = /^##\s+(?:\d+[.)]\s*)?frequently asked questions\s*$/i;
const H2 = /^##\s+/;
const H3 = /^###\s+(.+?)\s*$/;

/** Unwraps the inline markdown that would otherwise leak into the JSON-LD. */
function stripInline(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFaq(markdown: string): { q: string; a: string }[] {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => FAQ_HEADING.test(line));
  if (start === -1) return [];

  const entries: { q: string; a: string }[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  function flush() {
    if (question && answer.length > 0) {
      entries.push({ q: question, a: stripInline(answer.join(" ")) });
    }
    question = null;
    answer = [];
  }

  for (const line of lines.slice(start + 1)) {
    if (H2.test(line)) break;

    const heading = line.match(H3);
    if (heading) {
      flush();
      const text = stripInline(heading[1]);
      // Anything that is not a question belongs to the prose, not the FAQ.
      question = text.endsWith("?") ? text : null;
      continue;
    }

    // Deeper headings are kept as prose, minus their markers.
    if (question && line.trim()) answer.push(line.replace(/^#{4,}\s*/, "").trim());
  }
  flush();

  // A single Q&A pair is not enough for Google to treat the page as an FAQ.
  return entries.length >= 2 ? entries : [];
}
