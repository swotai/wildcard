// Smoke tests for the pure question-bank logic. The npm `test` script bundles
// src/lib/questions.ts with esbuild first, then runs this against the output.
//
// Usage: npm test

const m = await import("../node_modules/.tmp/questions.mjs");

let pass = 0;
let fail = 0;
const check = (name, cond) => {
  if (cond) {
    pass++;
    console.log("  PASS", name);
  } else {
    fail++;
    console.log("  FAIL", name);
  }
};

// window is referenced at call time by the URL helpers, so stub it up front.
globalThis.window = {
  location: {
    search: "?q=12,45,60",
    href: "https://wildcard.taidennis.us/?q=12,45,60",
  },
  history: {
    replaceState: (_a, _b, url) => {
      globalThis.__replaced = String(url);
    },
  },
};

console.log("question bank");
check("loads 76 questions", m.QUESTIONS.length === 76);
check(
  "categories are All + the three source categories",
  JSON.stringify(m.CATEGORIES) ===
    JSON.stringify(["All", "Memories", "Insights", "Beliefs"]),
);

console.log("drawHand");
const hand = m.drawHand("All");
check("returns 3", hand.length === 3);
check("ids are distinct", new Set(hand.map((q) => q.id)).size === 3);
check(
  "filters by category",
  m.drawHand("Beliefs", 50).every((q) => q.category === "Beliefs"),
);

console.log("URL hand");
const fromUrl = m.handFromUrl();
check("resolves 3 ids from ?q=", fromUrl?.length === 3);
check(
  "preserves id order",
  fromUrl?.map((q) => q.id).join(",") === "12,45,60",
);
globalThis.window.location.search = "?q=999,998,997";
check("rejects unknown ids", m.handFromUrl() === null);
globalThis.window.location.search = "?q=1,2";
check("rejects wrong id count", m.handFromUrl() === null);
globalThis.window.location.search = "?q=12,45,60";

m.writeHandToUrl([{ id: 7 }, { id: 8 }, { id: 9 }]);
check("writeHandToUrl writes ?q=", globalThis.__replaced?.includes("q=7"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
