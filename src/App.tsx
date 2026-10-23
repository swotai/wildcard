import { useCallback, useEffect, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { FlipCard } from "./components/FlipCard";
import { ThanksFooter } from "./components/ThanksFooter";
import { MoonIcon, SplitCircleIcon, SunIcon } from "./components/icons";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useTheme } from "./hooks/useTheme";
import {
  CATEGORIES,
  LABELS,
  drawHand,
  handFromUrl,
  writeHandToUrl,
  type Question,
} from "./lib/questions";

export default function App() {
  const [category, setCategory] = useState("All");
  const [hand, setHand] = useState<Question[]>(
    () => handFromUrl() ?? drawHand("All"),
  );
  const [allUp, setAllUp] = useState(false);
  const [openIds, setOpenIds] = useState<Set<number>>(() => new Set());

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const layout: "row" | "accordion" = isDesktop ? "row" : "accordion";
  const { mode, cycle } = useTheme();

  const themeLabel =
    mode === "auto" ? "Auto (system)" : mode === "dark" ? "Dark" : "Light";
  const nextThemeLabel =
    mode === "auto" ? "Light" : mode === "light" ? "Dark" : "Auto";

  // Keep the URL in sync so the browser's native Share button shares this hand.
  useEffect(() => {
    writeHandToUrl(hand);
  }, [hand]);

  const applyHand = useCallback(
    (next: Question[], revealAll: boolean) => {
      setHand(next);
      setOpenIds(revealAll ? new Set(next.map((q) => q.id)) : new Set());
    },
    [],
  );

  const handleRefresh = () => applyHand(drawHand(category), allUp);

  const handleCategoryChange = (next: string) => {
    setCategory(next);
    applyHand(drawHand(next), allUp);
  };

  const handleToggleAll = (checked: boolean) => {
    setAllUp(checked);
    setOpenIds(checked ? new Set(hand.map((q) => q.id)) : new Set());
  };

  const handleCardToggle = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // In face-down mode only one card may be open at a time (accordion).
        if (!allUp) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const hint =
    layout === "accordion"
      ? "Tap a card to reveal it. Only one opens at a time."
      : "Click a card to reveal it, or use the toggle to show all three.";

  return (
    <div className="min-h-[100svh] bg-zinc-100 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Wildcard
              <span className="ml-2 hidden font-normal text-zinc-500 sm:inline dark:text-zinc-400">
                Conversation Starters
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Pick one of three. Share your story.
            </p>
          </div>
          <button
            type="button"
            onClick={cycle}
            aria-label={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}.`}
            title={`Theme: ${themeLabel} — click for ${nextThemeLabel}`}
            className="rounded-full p-2.5 text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
          >
            {mode === "auto" ? (
              <SplitCircleIcon className="h-5 w-5" />
            ) : mode === "dark" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>
        </header>

        <FilterBar
          category={category}
          categories={CATEGORIES}
          onCategoryChange={handleCategoryChange}
          allUp={allUp}
          onToggleAll={handleToggleAll}
          onRefresh={handleRefresh}
        />

        <main className="flex flex-1 flex-col">
          <div
            className={
              layout === "row"
                ? "grid grid-cols-3 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {hand.map((q, i) => (
              <FlipCard
                key={q.id}
                label={LABELS[i] ?? String(i + 1)}
                question={q}
                open={openIds.has(q.id)}
                layout={layout}
                onToggle={() => handleCardToggle(q.id)}
              />
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            {hint}
          </p>
        </main>

        <ThanksFooter />
      </div>
    </div>
  );
}
