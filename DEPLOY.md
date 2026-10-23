# Deploying Wildcard to Cloudflare

This app is a **static build** — there is no server, database, or secret. The
questions are compiled into the JavaScript bundle. That means the simplest and
cheapest host is **Cloudflare Pages**, and there is **no GitHub Actions file
needed**: Cloudflare itself watches the repo and rebuilds on every push (this is
almost certainly how your Hugo site is set up).

---

## Option A — Cloudflare Pages via Git (recommended)

1. Push this repo to GitHub (e.g. `taidennis/wildcard`).
2. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages →
   Connect to Git** and pick the repo.
3. Configure the build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
   - **Node version:** any modern LTS (the repo uses Vite 7 / Node 20+)
4. Click **Save and Deploy**. First build takes ~1 minute.
5. From now on: **every `git push` automatically rebuilds and redeploys.** No
   Actions, no manual step.

> The `npm run build` script runs `tsc -b` (type-check) and, beforehand, the
> `prebuild` hook regenerates `src/data/questions.json` from the CSV — so the
> deployed questions always match the committed CSV.

### Preview deployments

Every pull request gets its own preview URL automatically, so you can test
changes on a real phone before merging.

---

## Custom domain: `wildcard.taidennis.us`

1. In the Pages project → **Custom domains → Set up a custom domain**.
2. Enter `wildcard.taidennis.us`.
3. If `taidennis.us` uses **Cloudflare nameservers**, Cloudflare adds the `CNAME`
   automatically — accept it. If DNS is hosted elsewhere, add the `CNAME` record
   Cloudflare shows you (`wildcard` → `<project>.pages.dev`).
4. Wait for the certificate to be issued (usually minutes). HTTPS is automatic.

Once live, retire the old Google Sites page so the subdomain points at Pages
instead of the embedded Apps Script.

---

## Option B — Direct upload with Wrangler (no Git integration)

Useful for a one-off deploy or CI you control. Requires a Cloudflare API token
with the `Cloudflare Pages: Edit` permission.

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name wildcard
```

Or just run the bundled script, which does both:

```bash
npm run deploy
```

Set `CLOUDFLARE_API_TOKEN` (and `CLOUDFLARE_ACCOUNT_ID`) in the environment first.

---

## Do we need a "Worker"?

No — and that's a feature. The old Apps Script version needed a server to read
Google Sheets; now the data is static, so a CDN-hosted static site is faster,
free, and has nothing to maintain.

If you later want server-side behaviour (for example an authenticated admin page
to add questions, or usage analytics), Cloudflare makes it easy to **add**
computation without moving hosts:

- Add a `functions/` directory to the Pages project (Pages Functions), or
- Migrate the repo to a Worker with static assets (`wrangler.jsonc` with an
  `assets` binding). Vite output stays the same.

Until then, keep it static.

---

## Updating questions in production

1. Edit `wild_card_question_bank.csv` (by hand, or regenerate it with the
   notebook in `data_extract/`).
2. Commit and push.
3. Cloudflare rebuilds and the new questions go live — no redeploy buttons.

---

## Checklist

- [ ] Repo on GitHub
- [ ] Pages project connected (build `npm run build`, output `dist`)
- [ ] First deploy green
- [ ] `wildcard.taidennis.us` added as a custom domain
- [ ] `wildcard` URL serves over HTTPS and shows the app
- [ ] Old Google Sites wrap-up removed / pointed at Pages
