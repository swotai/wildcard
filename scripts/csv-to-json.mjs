// Converts the Wildcard question bank CSV into a typed JSON module consumed
// by the app. Runs automatically before `dev` and `build` (see package.json),
// so the only thing a maintainer ever edits is wild_card_question_bank.csv.
//
// Usage: node scripts/csv-to-json.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const CSV_PATH = resolve(root, "wild_card_question_bank.csv");
const OUT_PATH = resolve(root, "src/data/questions.json");

/** Minimal RFC-4180-ish CSV parser (handles quoted fields, commas, "" escapes). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // consume escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore CR (handles CRLF)
    } else {
      field += ch;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

const raw = readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(raw).filter((r) => r.some((cell) => cell.trim() !== ""));

const [header, ...dataRows] = rows;
const col = {
  id: header.indexOf("Number"),
  category: header.indexOf("Category"),
  question: header.indexOf("Question"),
};

if (col.id === -1 || col.category === -1 || col.question === -1) {
  throw new Error(
    `Unexpected CSV header. Found: ${JSON.stringify(header)}. ` +
      `Expected columns: Number, Category Number, Category, Question.`,
  );
}

const seenIds = new Set();
const questions = [];

for (const row of dataRows) {
  const id = Number.parseInt(row[col.id], 10);
  const category = (row[col.category] ?? "").trim();
  const question = (row[col.question] ?? "").trim();

  if (!Number.isInteger(id) || !category || !question) continue;
  if (seenIds.has(id)) {
    console.warn(`[csv-to-json] duplicate Number ${id}, skipping.`);
    continue;
  }
  seenIds.add(id);
  questions.push({ id, category, question });
}

// Preserve the order categories first appear in the source for a stable UI.
const categories = [...new Set(questions.map((q) => q.category))];

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(
  OUT_PATH,
  JSON.stringify({ categories, questions }, null, 2) + "\n",
);

console.log(
  `[csv-to-json] wrote ${questions.length} questions across ${categories.length} categories (${categories.join(
    ", ",
  )}) -> ${OUT_PATH.replace(root + "/", "")}`,
);
