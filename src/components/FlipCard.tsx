import type { KeyboardEvent } from "react";
import type { Question } from "../lib/questions";

interface FlipCardProps {
  label: string;
  question: Question;
  open: boolean;
  layout: "row" | "accordion";
  onToggle: () => void;
}

export function FlipCard({
  label,
  question,
  open,
  layout,
  onToggle,
}: FlipCardProps) {
  // Accordion cards animate their own height; row cards keep a fixed height.
  const heightClasses =
    layout === "accordion"
      ? open
        ? "h-[48svh] min-h-[13rem]"
        : "h-16"
      : "h-64 md:h-72";

  const labelSize = layout === "accordion" && !open ? "text-2xl" : "text-5xl";

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={
        open
          ? `Hide card ${label}`
          : `Reveal card ${label} (${question.category})`
      }
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`flip-scene group relative w-full cursor-pointer rounded-2xl transition-[height] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-950 ${
        layout === "row" ? "flex-1" : ""
      } ${heightClasses}`}
    >
      <div className={`flip-inner ${open ? "is-open" : ""}`}>
        <div className="flip-face flip-front bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700/60">
          <div className="flex h-full w-full flex-col justify-center gap-2 p-5 sm:p-6">
            <span className="text-xs font-semibold tracking-[0.18em] text-indigo-500 uppercase dark:text-indigo-400">
              {label} · {question.category}
            </span>
            <p className="min-h-0 overflow-y-auto text-lg leading-snug font-medium text-zinc-800 sm:text-xl dark:text-zinc-100">
              {question.question}
            </p>
          </div>
        </div>

        <div className="flip-face flip-back items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm ring-1 ring-indigo-400/30">
          <span className={`font-bold ${labelSize}`}>{label}</span>
        </div>
      </div>
    </div>
  );
}
