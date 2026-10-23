import data from "../data/questions.json";

export interface Question {
  id: number;
  category: string;
  question: string;
}

export const QUESTIONS: Question[] = data.questions;
export const CATEGORIES: string[] = ["All", ...data.categories];
export const LABELS = ["A", "B", "C"] as const;

const byId = new Map<number, Question>(QUESTIONS.map((q) => [q.id, q]));

/** Fisher–Yates shuffle (non-mutating on the source pool). */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick `count` random questions, optionally filtered by category. */
export function drawHand(category: string, count = 3): Question[] {
  const pool =
    category === "All"
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.category === category);
  return shuffle(pool).slice(0, count);
}

/**
 * Read a hand encoded in the URL as `?q=1,2,3`. Returns null when absent or
 * invalid, so callers can fall back to a fresh random draw.
 */
export function handFromUrl(): Question[] | null {
  const raw = new URLSearchParams(window.location.search).get("q");
  if (!raw) return null;

  const ids = [
    ...new Set(
      raw
        .split(",")
        .map((s) => Number.parseInt(s.trim(), 10))
        .filter((n) => Number.isInteger(n)),
    ),
  ];

  if (ids.length !== 3) return null;
  const resolved = ids.map((id) => byId.get(id));
  if (resolved.some((q) => q === undefined)) return null;
  return resolved as Question[];
}

/** Persist the current hand into the URL (no reload, no history spam). */
export function writeHandToUrl(hand: Question[]): void {
  const url = new URL(window.location.href);
  url.searchParams.set("q", hand.map((q) => q.id).join(","));
  window.history.replaceState(null, "", url);
}
