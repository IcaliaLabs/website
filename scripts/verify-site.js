#!/usr/bin/env node
/**
 * Post-build verification for the "Is Agentic" readiness fixes.
 *
 * Plain Node + assert — this repo has no existing test framework and is a
 * ~20-page static site, so a lightweight script that runs against the real
 * _site/ build output is more valuable here than introducing a full test
 * runner. Run with `npm test` (after `npm run build`), or it's called
 * automatically as part of `npm run build:verify`.
 *
 * Exits non-zero (and prints every failure, not just the first) so CI can
 * gate the deploy on it.
 */

const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "..", "_site");
const ROOT_DIR = path.join(__dirname, "..");
const SKIP_DIR_PREFIXES = ["cyberpunk", "monospace", "terminal", "mix"];

const failures = [];
let checks = 0;

function check(label, fn) {
  checks += 1;
  try {
    fn();
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
  }
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function readSite(relPath) {
  return fs.readFileSync(path.join(SITE_DIR, relPath), "utf-8");
}

function visibleTextLength(html) {
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&[a-z#0-9]+;/gi, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text.length;
}

function findHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(SITE_DIR, full);
    if (SKIP_DIR_PREFIXES.some((p) => rel === p || rel.startsWith(p + path.sep))) continue;
    if (entry.isDirectory()) {
      findHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

check("_site/ exists (run `npm run build` first)", () => {
  assert(fs.existsSync(SITE_DIR), "_site/ directory not found");
});

if (!fs.existsSync(SITE_DIR)) {
  console.error(`FAIL: ${failures[0]}`);
  process.exit(1);
}

const htmlFiles = findHtmlFiles(SITE_DIR);

// --- Fix #2: every real content page has exactly one <main> and one <h1> ---
for (const file of htmlFiles) {
  const rel = path.relative(SITE_DIR, file);
  const html = fs.readFileSync(file, "utf-8");

  check(`${rel}: has exactly one <main>`, () => {
    const count = (html.match(/<main[\s>]/gi) || []).length;
    assert(count === 1, `found ${count}`);
  });

  check(`${rel}: has exactly one <h1>`, () => {
    const count = (html.match(/<h1[\s>]/gi) || []).length;
    assert(count === 1, `found ${count}`);
  });
}

// --- Fix #6: trust-anchor pages exist with 500+ chars of real content ---
const TRUST_PAGES = ["about.html", "contact.html", "privacy.html"];
for (const page of TRUST_PAGES) {
  check(`${page}: exists with 500+ chars of visible text`, () => {
    const html = readSite(page);
    const len = visibleTextLength(html);
    assert(len >= 500, `only ${len} chars`);
  });
}

// --- Fix #1: 404 page points agents at sitemap and llms.txt ---
check("404.html: links to /sitemap.xml", () => {
  const html = readSite("404.html");
  assert(html.includes("sitemap.xml"), "no reference to sitemap.xml");
});
check("404.html: links to /llms.txt", () => {
  const html = readSite("404.html");
  assert(html.includes("llms.txt"), "no reference to llms.txt");
});
check("404.html: has a <main> landmark", () => {
  const html = readSite("404.html");
  assert(/<main[\s>]/i.test(html), "no <main>");
});

// --- Fix #3: every page has a Markdown sibling + alternate link ---
for (const file of htmlFiles) {
  const rel = path.relative(SITE_DIR, file);
  const mdRel = rel.replace(/\.html$/, ".md");

  check(`${rel}: has a Markdown sibling (${mdRel})`, () => {
    assert(fs.existsSync(path.join(SITE_DIR, mdRel)), "sibling .md not found");
  });

  check(`${rel}: <link rel="alternate" type="text/markdown"> present`, () => {
    const html = fs.readFileSync(file, "utf-8");
    assert(
      /<link[^>]+rel="alternate"[^>]+type="text\/markdown"/i.test(html),
      "no alternate markdown link tag"
    );
  });
}

check("generated Markdown files are non-empty and start with a heading", () => {
  const mdFiles = htmlFiles.map((f) => f.replace(/\.html$/, ".md"));
  for (const mdFile of mdFiles) {
    if (!fs.existsSync(mdFile)) continue; // reported above already
    const content = fs.readFileSync(mdFile, "utf-8").trim();
    assert(content.length > 0, `${path.relative(SITE_DIR, mdFile)} is empty`);
    assert(content.startsWith("#"), `${path.relative(SITE_DIR, mdFile)} doesn't start with a heading`);
  }
});

// --- Fix #4 & #5: llms.txt has the required sections and no dead-end links ---
check("llms.txt: has a 'When to Use' section", () => {
  const txt = readSite("llms.txt");
  assert(/##\s*When to Use/i.test(txt), "no 'When to Use' heading found");
});
check("llms.txt: has a Developer Resources section", () => {
  const txt = readSite("llms.txt");
  assert(/##\s*Developer Resources/i.test(txt), "no 'Developer Resources' heading found");
});
check("llms.txt: industries links use real paths (no /industries/healthcare or /industries/ecommerce)", () => {
  const txt = readSite("llms.txt");
  assert(!txt.includes("/industries/healthcare"), "stale /industries/healthcare link present");
  assert(!txt.includes("/industries/ecommerce"), "stale /industries/ecommerce link present");
});

// --- sitemap.xml: well-formed and every <loc> maps to a real built file ---
check("sitemap.xml: well-formed and every URL resolves to a built file", () => {
  const xml = readSite("sitemap.xml");
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert(locs.length > 0, "no <loc> entries found");
  for (const loc of locs) {
    const url = new URL(loc);
    let filePath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
    assert(
      fs.existsSync(path.join(SITE_DIR, filePath)),
      `${loc} has no matching file at _site/${filePath}`
    );
  }
});

// --- jobs.json: sitemap only lists active job slugs ---
check("sitemap.xml: career URLs match active jobs.json slugs", () => {
  const jobs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "_data", "jobs.json"), "utf-8"));
  const activeSlugs = new Set(jobs.filter((j) => j.active).map((j) => j.slug));
  const xml = readSite("sitemap.xml");
  const careerLocs = [...xml.matchAll(/<loc>https:\/\/icalialabs\.com\/careers\/([^<]+)\.html<\/loc>/g)].map(
    (m) => m[1]
  );
  for (const slug of careerLocs) {
    assert(activeSlugs.has(slug), `sitemap lists inactive/unknown job slug: ${slug}`);
  }
  for (const slug of activeSlugs) {
    assert(careerLocs.includes(slug), `sitemap is missing active job slug: ${slug}`);
  }
});

// --- cloudflare/ and scripts/ must never leak into the build output ---
check("build output excludes cloudflare/ and scripts/", () => {
  assert(!fs.existsSync(path.join(SITE_DIR, "cloudflare")), "_site/cloudflare/ should not exist");
  assert(!fs.existsSync(path.join(SITE_DIR, "scripts")), "_site/scripts/ should not exist");
});

check("build output excludes stray seo-audit-recommendations page", () => {
  assert(
    !fs.existsSync(path.join(SITE_DIR, "seo-audit-recommendations")),
    "_site/seo-audit-recommendations/ should not exist"
  );
});

console.log(`\n${checks} checks run, ${failures.length} failed.\n`);
if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log("All checks passed.");
