// Auto-discovers collateral in /resources/.
// To publish a new collateral: drop a self-contained .html file into /resources/.
// It appears on /resources/ automatically on the next build — no code changes needed.
//
// Card display is driven by optional <meta> tags in each file's <head>
// (all fall back sensibly if omitted):
//   <meta name="resource-title"       content="Short card title">
//   <meta name="resource-description" content="One-line summary for the card">
//   <meta name="resource-category"    content="Playbook | Deck | One-pager | ...">
//   <meta name="resource-date"        content="2026-07-17">   (YYYY-MM-DD, used for ordering)
//
// External collateral (hosted elsewhere) is listed in EXTERNAL below.

const fs = require("fs");
const path = require("path");

const RESOURCES_DIR = path.join(__dirname, "..", "resources");

// Collateral hosted outside this repo. Add an entry to link it from /resources/.
const EXTERNAL = [
  {
    title: "Services Deck",
    description:
      "Icalia Labs services overview — who we are, what we build, and how we partner with product teams.",
    category: "Deck",
    date: "2026-01-01",
    url: "https://icalialabs.github.io/icalia-labs-services-deck/",
    external: true,
  },
];

function meta(html, name) {
  const re = new RegExp(
    `<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,
    "i"
  );
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

function title(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return "";
  // Strip a leading/trailing "Icalia Labs —" brand prefix/suffix.
  return m[1]
    .replace(/^\s*icalia labs\s*[—\-|:]\s*/i, "")
    .replace(/\s*[—\-|]\s*icalia labs\s*$/i, "")
    .trim();
}

function readLocal() {
  let files = [];
  try {
    files = fs.readdirSync(RESOURCES_DIR);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((file) => {
      const html = fs.readFileSync(path.join(RESOURCES_DIR, file), "utf8");
      return {
        title: meta(html, "resource-title") || title(html) || file,
        description:
          meta(html, "resource-description") || meta(html, "description") || "",
        category: meta(html, "resource-category") || "Collateral",
        date: meta(html, "resource-date") || "",
        url: `/resources/${file}`,
        external: false,
      };
    });
}

function byDateDescThenTitle(a, b) {
  if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date);
  if (a.date && !b.date) return -1;
  if (!a.date && b.date) return 1;
  return a.title.localeCompare(b.title);
}

const items = [...readLocal(), ...EXTERNAL].sort(byDateDescThenTitle);

module.exports = {
  items,
  count: items.length,
};
