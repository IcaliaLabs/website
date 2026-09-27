#!/usr/bin/env node
/**
 * Build-time Markdown generation for agent content negotiation.
 *
 * Eleventy renders one HTML page per route. This script walks the compiled
 * _site/ output and emits a sibling .md file next to every .html page,
 * converted from that page's <main> content. It never touches source .html
 * files and runs after `eleventy` in the `build` script.
 *
 * Why build-time (not a runtime Accept-header check): GitHub Pages serves
 * static files only and cannot inspect request headers, so true per-request
 * content negotiation (Accept: text/markdown -> different bytes, same URL)
 * has to happen at an edge layer in front of GitHub Pages (see
 * cloudflare/README.md). These sibling .md files are the static fallback:
 * discoverable at a predictable URL and referenced via
 * <link rel="alternate" type="text/markdown"> in <head>, so agents that
 * don't send Accept headers (or hit an edge that isn't configured yet) can
 * still fetch a clean Markdown copy of any page.
 */

const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");

const SITE_DIR = path.resolve(__dirname, "..", process.env.SITE_DIR || "_site");

// Novelty/theme sub-sites and the CMS app are not content — skip them.
const SKIP_DIR_PREFIXES = ["cyberpunk", "monospace", "terminal", "mix", "admin"];

const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

// Decorative-only elements that add no reading value to an agent.
turndown.remove(["script", "style", "svg", "noscript"]);

function findHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(SITE_DIR, full);
    if (SKIP_DIR_PREFIXES.some((p) => rel === p || rel.startsWith(p + path.sep))) {
      continue;
    }
    if (entry.isDirectory()) {
      findHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

// Named entities Nunjucks' autoescaping and this site's copy actually emit.
const NAMED_ENTITIES = {
  amp: "&",
  copy: "©",
  darr: "↓",
  hellip: "…",
  ldquo: "“",
  lt: "<",
  gt: ">",
  mdash: "—",
  middot: "·",
  ndash: "–",
  rarr: "→",
  rdquo: "”",
  rsquo: "’",
  quot: '"',
  apos: "'",
};

function decodeEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1].trim()) : null;
}

function extractMeta(html, name) {
  const match = html.match(
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, "i")
  );
  return match ? decodeEntities(match[1]) : null;
}

function extractMain(html) {
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : null;
}

function toMarkdown(filePath) {
  const html = fs.readFileSync(filePath, "utf-8");
  const mainHtml = extractMain(html);
  if (!mainHtml) return null;

  const title = extractTag(html, "title") || "Icalia Labs";
  const description = extractMeta(html, "description");

  let body = turndown.turndown(mainHtml);
  body = body.replace(/\n{3,}/g, "\n\n").trim();

  const frontMatter = [`# ${title}`, description ? `\n> ${description}\n` : ""]
    .filter(Boolean)
    .join("\n");

  return `${frontMatter}\n${body}\n`;
}

function run() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error("generate-markdown: _site/ not found — run `eleventy` first.");
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(SITE_DIR);
  let written = 0;
  let skipped = 0;

  for (const file of htmlFiles) {
    const markdown = toMarkdown(file);
    if (markdown === null) {
      skipped += 1;
      continue;
    }
    const mdPath = file.replace(/\.html$/, ".md");
    fs.writeFileSync(mdPath, markdown, "utf-8");
    written += 1;
  }

  console.log(
    `generate-markdown: wrote ${written} .md file(s), skipped ${skipped} (no <main> found)`
  );
}

run();
