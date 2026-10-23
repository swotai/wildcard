import { RefreshIcon } from "./icons";

interface FilterBarProps {
  category: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  allUp: boolean;
  onToggleAll: (checked: boolean) => void;
  onRefresh: () => void;
}

export function FilterBar({
  category,
  categories,
  onCategoryChange,
  allUp,
  onToggleAll,
  onRefresh,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-zinc-200/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:bg-zinc-900/70 dark:ring-zinc-800">
      <div className="flex items-center gap-3">
        <label
          htmlFor="category"
          className="shrink-0 text-sm font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border-0 bg-zinc-100 py-2.5 pr-9 pl-3 text-base font-medium text-zinc-800 ring-1 ring-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500 sm:w-44 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <span
            className={`text-sm font-medium transition-colors ${
              allUp
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            Face down
          </span>
          <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={allUp}
              onChange={(e) => onToggleAll(e.target.checked)}
              aria-label="Reveal all cards"
            />
            <span className="absolute inset-0 rounded-full bg-zinc-300 transition-colors peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:bg-zinc-600 dark:peer-focus-visible:ring-offset-zinc-900" />
            <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </span>
          <span
            className={`text-sm font-medium transition-colors ${
              allUp
                ? "text-zinc-800 dark:text-zinc-100"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            Face up
          </span>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:bg-indigo-700 dark:focus-visible:ring-offset-zinc-900"
        >
          <RefreshIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}
