# Wildcard · Conversation Starters

A small, mobile-first card-picking game inspired by NPR's
_[Wild Card with Rachel Martin](https://www.npr.org/podcasts/510379/wild-card-with-rachel-martin)_.
Draw three cards, pick one, flip it to reveal a conversation starter.

This is a **static site** (React + Vite + Tailwind) that deploys to **Cloudflare
Pages**. It replaced an earlier Google Apps Script + Google Sheets version — see
[`legacy/`](./legacy) for the original.

## Features

- Draws **3 random questions** from the built-in question bank
- **Category filter** (All / Memories / Insights / Beliefs) — changing it redraws
- **Face down / face up** toggle: reveal or hide all three at once
- **Tap/click a card** to flip it individually
  - On phones the cards behave as an **accordion**: one opens at a time and the
    others squeeze down
  - On desktop the three cards sit side by side
- **Shareable hands**: the current three questions are always encoded in the URL
  (`?q=12,45,60`), so the browser's native **Share** button (Safari/Chrome) shares
  the exact hand — no custom share button needed
- **Auto / light / dark theme** — cycles from the header button, follows the OS
  live while on Auto, and remembers your choice
- Keyboard-accessible, reduced-motion aware, instant load (data is bundled)

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build -> dist/
npm run preview    # serve dist/ locally
npm test           # smoke-test the question-bank logic
```

## Editing the questions

The single source of truth is **`wild_card_question_bank.csv`**
(columns: `Number, Category Number, Category, Question`).

A prebuild step converts it to `src/data/questions.json`, so you only ever edit
the CSV:

```bash
npm run data       # regenerate src/data/questions.json (also runs on dev/build)
```

The CSV is produced offline by the scraping/LLM notebook in
[`data_extract/`](./data_extract); you can also edit it by hand.

## Deploy

See [`DEPLOY.md`](./DEPLOY.md). Short version: connect this repo to a Cloudflare
Pages project, build command `npm run build`, output directory `dist`.
