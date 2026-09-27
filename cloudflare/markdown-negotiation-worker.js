/**
 * Markdown content negotiation for icalialabs.com, sitting in front of the
 * existing GitHub Pages origin (no origin changes required).
 *
 * Implements the acceptmarkdown.com protocol: parses Accept with q-values
 * and specificity per RFC 9110 §12.5.1, serves the pre-built .md sibling
 * (generated at build time by scripts/generate-markdown.js) when a client
 * prefers text/markdown, sets Vary: Accept on every response so CDNs and
 * caches key on it correctly, and returns 406 only when the client's Accept
 * header explicitly rejects everything this site produces.
 *
 * Deployment (requires Cloudflare dashboard/API access this task does not
 * have — see cloudflare/README.md):
 *   1. Proxy the icalialabs.com DNS record through Cloudflare (orange cloud).
 *   2. Attach this Worker to a Route: icalialabs.com/*
 *   3. `fetch(request)` below reaches the zone's configured origin
 *      (GitHub Pages) — this Worker does not need Workers Assets and does
 *      not require moving the site off GitHub Pages.
 */

const STATIC_EXT =
  /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|xml|txt|json|pdf)$/i;

function parseAccept(header) {
  return header
    .split(",")
    .map((raw) => {
      const parts = raw.trim().split(";").map((s) => s.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;
      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split("=").map((s) => s.trim());
        if (name === "q") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
      return { type, q, specificity };
    })
    .filter((e) => e !== null);
}

function matches(entry, candidate) {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

function preferredType(header, produces) {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue; // explicit rejection (q=0)

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

// Ensures "Accept" is present in Vary, preserving any existing tokens
// (e.g. the origin's own "Accept-Encoding") without duplicating any.
function appendVaryAccept(headers) {
  const existing = headers.get("vary");
  const tokens = existing
    ? existing.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  if (!tokens.some((t) => t.toLowerCase() === "accept")) {
    tokens.unshift("Accept");
  }
  headers.set("Vary", tokens.join(", "));
}

// /              -> /index.md
// /about.html    -> /about.md
// /careers/x.html -> /careers/x.md
function markdownPath(pathname) {
  if (pathname === "/" || pathname === "") return "/index.md";
  return pathname.replace(/\.html$/i, ".md");
}

function notAcceptable() {
  const res = new Response(
    "Not Acceptable\n\nThis resource is available as: text/html, text/markdown\n",
    { status: 406, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
  appendVaryAccept(res.headers);
  return res;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (STATIC_EXT.test(url.pathname)) {
      return fetch(request);
    }

    const acceptHeader = request.headers.get("accept");
    const chosen = preferredType(acceptHeader, ["text/html", "text/markdown"]);

    if (chosen === null && acceptHeader) {
      return notAcceptable();
    }

    if (chosen === "text/markdown") {
      const mdUrl = new URL(url);
      mdUrl.pathname = markdownPath(url.pathname);
      const mdRes = await fetch(new Request(mdUrl.toString(), request));

      if (mdRes.status === 200) {
        const res = new Response(mdRes.body, mdRes);
        res.headers.set("Content-Type", "text/markdown; charset=utf-8");
        appendVaryAccept(res.headers);
        return res;
      }

      // No .md sibling for this path. Only fall through to HTML if the
      // client's Accept header actually still allows it.
      if (!preferredType(acceptHeader, ["text/html"])) {
        return notAcceptable();
      }
    }

    const htmlRes = await fetch(request);
    const res = new Response(htmlRes.body, htmlRes);
    appendVaryAccept(res.headers);

    if (res.headers.get("content-type")?.includes("text/html")) {
      const mdUrl = new URL(url);
      mdUrl.pathname = markdownPath(url.pathname);
      res.headers.append(
        "Link",
        `<${mdUrl.pathname}>; rel="alternate"; type="text/markdown"`
      );
    }

    return res;
  },
};
