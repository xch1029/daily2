import type { DiaryEntry, PreparedDiaryEntry } from "../types/diary";

/** Normalize typo like 08:o5 → 08:05 for parsing. */
function normalizeTimeString(raw: string): string {
  return raw.trim().replace(/o/gi, "0");
}

function parseTimeToParts(timeStr: string): { hour: number; minute: number } {
  const normalized = normalizeTimeString(timeStr);
  const match = /^(\d{1,2}):(\d{2})$/.exec(normalized);
  if (!match) {
    return { hour: 0, minute: 0 };
  }
  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 0, minute: 0 };
  }
  return { hour, minute };
}

/**
 * Parse diary date strings like 2026.02.25, 2023-01-03, 2017-6-15.
 * Returns NaN if parsing fails.
 */
export function parseDiaryTimestamp(dateStr: string, timeStr: string): number {
  const trimmed = dateStr.trim();
  const normalized = trimmed.replace(/\./g, "-");
  const parts = normalized.split("-").map((p) => Number.parseInt(p.trim(), 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return Number.NaN;
  }
  const [year, month, day] = parts;
  const { hour, minute } = parseTimeToParts(timeStr);
  const d = new Date(year, month - 1, day, hour, minute, 0, 0);
  return d.getTime();
}

export function isLikelyHtmlContent(content: string): boolean {
  return /^\s*</.test(content);
}

/** Prefix relative media paths for GitHub Pages `base` (videos/, images/, and <source>). */
export function rewriteRelativeMediaUrls(html: string, baseUrl: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return html
    .replaceAll(`src="videos/`, `src="${base}videos/`)
    .replaceAll(`src='videos/`, `src='${base}videos/`)
    .replaceAll(`src="images/`, `src="${base}images/`)
    .replaceAll(`src='images/`, `src='${base}images/`)
    .replaceAll(`<source src="videos/`, `<source src="${base}videos/`)
    .replaceAll(`<source src='videos/`, `<source src='${base}videos/`)
    .replaceAll(`<source src="images/`, `<source src="${base}images/`)
    .replaceAll(`<source src='images/`, `<source src='${base}images/`);
}

export function plainTextToParagraphs(content: string): string[] {
  return content
    .trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function prepareDiaryEntry(entry: DiaryEntry, baseUrl: string): PreparedDiaryEntry {
  const sortTimestamp = parseDiaryTimestamp(entry.date, entry.time);
  if (Number.isNaN(sortTimestamp) && import.meta.env.DEV) {
    console.warn("[diary] Unparseable date/time:", entry.date, entry.time, entry.title);
  }
  const display = isLikelyHtmlContent(entry.content)
    ? { kind: "html" as const, html: rewriteRelativeMediaUrls(entry.content, baseUrl) }
    : { kind: "plain" as const, paragraphs: plainTextToParagraphs(entry.content) };
  return {
    ...entry,
    sortTimestamp: Number.isNaN(sortTimestamp) ? Number.NEGATIVE_INFINITY : sortTimestamp,
    display,
  };
}

export function prepareAndSortDiary(
  entries: readonly DiaryEntry[],
  baseUrl: string,
): PreparedDiaryEntry[] {
  const prepared = entries.map((e) => prepareDiaryEntry(e, baseUrl));
  return [...prepared].sort((a, b) => b.sortTimestamp - a.sortTimestamp);
}
