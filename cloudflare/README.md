# Markdown content negotiation for icalialabs.com

Why this directory exists: GitHub Pages serves static files only — it cannot
inspect a request's `Accept` header and return different bytes for the same
URL. True per-request content negotiation (`Accept: text/markdown` -> a
`text/markdown` response, same URL, with `Vary: Accept`) requires an edge
layer in front of GitHub Pages. `icalialabs.com`'s nameservers are already
Cloudflare's (`lou.ns.cloudflare.com`, `cheryl.ns.cloudflare.com`), but the
DNS record is currently **unproxied** ("DNS only" / grey cloud) — traffic
goes straight to GitHub Pages, which is why `curl -H "Accept: text/markdown"`
against production still returns `text/html` with no `Vary: Accept`.

Both options below need Cloudflare dashboard/API access this task does not
have. Nothing here has been deployed.

## Option A — zero code (recommended first step)

Cloudflare has a managed **"Markdown for Agents"** feature: once the domain
is proxied through Cloudflare, it detects `Accept: text/markdown` at the
edge, fetches the existing HTML from the origin unchanged, converts it to
Markdown on the fly, and returns it with the correct `Content-Type` and
`Vary: Accept` — no Worker, no origin changes.

1. Cloudflare dashboard -> `icalialabs.com`.
2. Flip the DNS record for `icalialabs.com` (and `www`, if used) from
   **DNS only** to **Proxied** (orange cloud).
3. Rules -> Settings (or search "Markdown for Agents") -> toggle **On**.
4. Verify: `curl -sI -H "Accept: text/markdown" https://icalialabs.com/` should
   show `Content-Type: text/markdown` and `Vary: Accept`.

Trade-off: Cloudflare's own HTML→Markdown converter runs on the live HTML,
not the curated `.md` files this repo already builds (see below), so the
Markdown quality/formatting is out of our control.

## Option B — this Worker (explicit control)

`markdown-negotiation-worker.js` is a ready-to-deploy Cloudflare Worker that
implements the same protocol by hand — RFC 9110 §12.5.1 `Accept` parsing
with q-values and specificity, `Vary: Accept`, `406` when a client's
`Accept` header explicitly rejects both `text/html` and `text/markdown`, and
a `Link: rel="alternate"` header pointing HTML responses at their Markdown
sibling. It serves the `.md` files this repo's build already generates
(`scripts/generate-markdown.js`, wired into `npm run build`) rather than an
auto-converted copy, so formatting stays under our control.

It fronts the **existing GitHub Pages origin** — it does not require moving
the site onto Cloudflare Workers Assets or changing the GitHub Actions
deploy workflow.

Deploy steps (needs a Cloudflare account with API/dashboard access):

```bash
cd cloudflare
npx wrangler login
npx wrangler deploy
```

Then proxy the DNS record (Option A, step 2) and attach a Route in the
dashboard: Workers & Pages -> `icalialabs-markdown-negotiation` -> Triggers
-> Routes -> `icalialabs.com/*` (or uncomment the `[[routes]]` block in
`wrangler.toml` before deploying, with the right `zone_name`).

Verify:

```bash
curl -sI -H "Accept: text/markdown" https://icalialabs.com/ | grep -i "content-type\|vary"
curl -s  -H "Accept: text/markdown" https://icalialabs.com/about.html
curl -sI -H "Accept: text/markdown;q=0, text/html" https://icalialabs.com/   # should stay text/html
curl -sI -H "Accept: application/pdf" https://icalialabs.com/                # should 406
```

## Keeping the two in sync

If both the static `.md` siblings and Cloudflare's managed feature are ever
enabled together, the Worker in Option B takes precedence for any zone it's
routed on (Workers run before the managed feature). Pick one; Option A is
simpler to turn on today, Option B is the migration path once someone wants
authored-quality Markdown and stricter protocol behavior.
