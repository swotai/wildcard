export function ThanksFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-2xl border-t border-zinc-200 pt-8 pb-2 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-200">
        Special Thanks
      </h2>
      <p className="mt-3">
        This project was made possible by the great podcast by Rachel Martin —
        go check it out!
      </p>
      <p className="mt-2">
        <a
          href="https://www.npr.org/podcasts/510379/wild-card-with-rachel-martin"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          Wild Card with Rachel Martin
        </a>
      </p>
      <p className="mt-2">
        Also, special thanks to redditor @crazitalk for collecting and sharing
        the questions!
      </p>
      <p className="mt-2">
        If you really enjoy this, please support your local public radio
        stations!
      </p>
    </footer>
  );
}
