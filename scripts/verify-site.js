#!/usr/bin/env node
/**
 * Post-build verification: agent-readiness, blog/SEO structure, CMS config, and links.
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
const matter = require("gray-matter");

const ROOT_DIR = path.join(__dirname, "..");
const SITE_DIR = path.resolve(ROOT_DIR, process.env.SITE_DIR || "_site");
// INCLUDE_DRAFTS=1 verifies the preview build, where drafts are rendered.
const INCLUDE_DRAFTS = process.env.INCLUDE_DRAFTS === "1";
const SKIP_DIR_PREFIXES = ["cyberpunk", "monospace", "terminal", "mix", "admin"];

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
const redirects = require(path.join(ROOT_DIR, "_data", "redirects.js"));
// Site-relative output files of redirect pages (e.g. "ai-agent.html").
const redirectFiles = new Set(redirects.map((r) => r.output.replace(/^\//, "")));

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

// --- 404 page: served at every missing URL, so it must not create more 404s ---
check("404.html: every link and asset is root-relative or absolute", () => {
  const html = readSite("404.html");
  const refs = [...html.matchAll(/<(?:a|img|link|script)\s[^>]*(?:href|src)="([^"]*)"/gi)].map((m) => m[1]);
  const relative = refs.filter((r) => r && !/^(\/|#|[a-z][a-z0-9+.-]*:)/i.test(r));
  assert(relative.length === 0, `relative: ${[...new Set(relative)].join(", ")}`);
});
check("404.html: noindex, and no canonical or og:url of its own", () => {
  const html = readSite("404.html");
  assert(/<meta name="robots" content="noindex/.test(html), "missing noindex");
  assert(!/rel="canonical"/.test(html), "has a canonical link");
  assert(!/property="og:url"/.test(html), "has og:url");
});
check("404.html: logs the broken path to analytics", () => {
  assert(readSite("404.html").includes("'page_not_found'"), "no page_not_found event");
});

// --- Analytics: one page_view per page load, and only from the live site ---
check("head: GA is disabled outside icalialabs.com", () => {
  assert(readSite("index.html").includes("window['ga-disable-G-MSFD00QMYY'] = true"), "no hostname guard");
});
check("js/ga-events.js: doesn't send a second page_view", () => {
  const js = readSite("js/ga-events.js");
  assert(!/gtag\(\s*'event'\s*,\s*'page_view'/.test(js), "manual page_view found");
});

// --- Redirect pages for old URLs (_data/redirects.js) ---
const sitemapForRedirects = readSite("sitemap.xml");
const llmsForRedirects = readSite("llms.txt");
for (const r of redirects) {
  const rel = r.output.replace(/^\//, "");
  check(`redirect ${r.from} -> ${r.to}`, () => {
    assert(fs.existsSync(path.join(SITE_DIR, rel)), `${rel} not built`);
    const html = readSite(rel);
    assert(html.includes(`<meta http-equiv="refresh" content="0; url=${r.to}">`), "no instant meta refresh to target");
    assert(html.includes(`<link rel="canonical" href="https://icalialabs.com${r.to}">`), "canonical isn't the target");
    assert(html.includes('<meta name="robots" content="noindex">'), "missing noindex");
    const target = r.to.endsWith("/") ? `${r.to}index.html` : r.to;
    assert(fs.existsSync(path.join(SITE_DIR, target)), `target ${r.to} doesn't exist`);
    assert(!redirectFiles.has(target.replace(/^\//, "")), `target ${r.to} is itself a redirect`);
    assert(!/http-equiv="refresh"/.test(readSite(target)), `target ${r.to} is itself a redirect`);
    assert(!sitemapForRedirects.includes(`icalialabs.com${r.from}`), "old URL listed in sitemap.xml");
    assert(!llmsForRedirects.includes(`icalialabs.com${r.from}`), "old URL listed in llms.txt");
    assert(!fs.existsSync(path.join(SITE_DIR, rel.replace(/\.html$/, ".md"))), "has a Markdown sibling");
  });
}
check("redirects: no duplicate old URLs", () => {
  const seen = redirects.map((r) => r.output);
  assert(new Set(seen).size === seen.length, "duplicate entries in _data/redirects.js");
});
check("redirects: every closed role in jobs.json keeps its URL alive", () => {
  const jobs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "_data", "jobs.json"), "utf-8"));
  for (const job of jobs) {
    const has = redirectFiles.has(`careers/${job.slug}.html`);
    assert(job.active ? !has : has, `${job.slug}: ${job.active ? "active role is redirected" : "closed role has no redirect"}`);
  }
});

// --- Fix #3: every page has a Markdown sibling + alternate link ---
for (const file of htmlFiles) {
  const rel = path.relative(SITE_DIR, file);
  const mdRel = rel.replace(/\.html$/, ".md");
  // Redirect pages aren't content, and the 404 page has no URL of its own.
  if (redirectFiles.has(rel)) continue;

  check(`${rel}: has a Markdown sibling (${mdRel})`, () => {
    assert(fs.existsSync(path.join(SITE_DIR, mdRel)), "sibling .md not found");
  });

  if (rel === "404.html") continue;
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
    let filePath = url.pathname.replace(/^\//, "");
    if (filePath === "" || filePath.endsWith("/")) filePath += "index.html";
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

// --- Blog -------------------------------------------------------------------
const POSTS_DIR = path.join(ROOT_DIR, "blog", "posts");
const blogTopics = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "_data", "blogTopics.json"), "utf-8"));
const topicSlugs = new Set(blogTopics.map((t) => t.slug));
const authorSlugs = new Set(
  fs
    .readdirSync(path.join(ROOT_DIR, "_data", "authors"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
);
const sourcePosts = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ slug: f.replace(/\.md$/, ""), ...matter.read(path.join(POSTS_DIR, f)) }));
const renderedPosts = sourcePosts.filter((p) => INCLUDE_DRAFTS || !p.data.draft);

const sitemapXml = readSite("sitemap.xml");
const feedXml = readSite("blog/feed.xml");
const llmsTxt = readSite("llms.txt");

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
}

// Front matter contract (mirrors the limits enforced in admin/config.yml).
for (const post of sourcePosts) {
  const d = post.data;
  const label = `blog/posts/${post.slug}.md`;
  // Posts republished from Medium (originalUrl set) keep their original titles and have no takeaways.
  const archived = Boolean(d.originalUrl);
  if (archived) {
    check(`${label}: archived post has an https originalUrl and a title of 10–100 chars`, () => {
      assert(/^https:\/\//.test(d.originalUrl), `bad originalUrl ${d.originalUrl}`);
      assert(typeof d.title === "string" && d.title.length >= 10 && d.title.length <= 100, `got ${d.title?.length}`);
    });
  } else {
    check(`${label}: title is 30–60 chars`, () => {
      assert(typeof d.title === "string" && d.title.length >= 30 && d.title.length <= 60, `got ${d.title?.length}`);
    });
  }
  check(`${label}: no TODO- placeholders (alt text, descriptions)`, () => {
    const hits = (matter.stringify(post.content, d).match(/TODO-[A-Z]+/g) || []).length;
    assert(hits === 0, `${hits} TODO- marker(s) left`);
  });
  check(`${label}: description is 70–160 chars`, () => {
    assert(
      typeof d.description === "string" && d.description.length >= 70 && d.description.length <= 160,
      `got ${d.description?.length}`
    );
  });
  check(`${label}: has a valid publish date`, () => {
    assert(d.date && !Number.isNaN(new Date(d.date).getTime()), `invalid date ${d.date}`);
  });
  check(`${label}: author exists in _data/authors/`, () => {
    assert(authorSlugs.has(d.author), `unknown author "${d.author}"`);
  });
  check(`${label}: 1–3 topics, all in blogTopics.json`, () => {
    assert(Array.isArray(d.topics) && d.topics.length >= 1 && d.topics.length <= 3, "needs 1–3 topics");
    for (const t of d.topics) assert(topicSlugs.has(t), `unknown topic "${t}"`);
  });
  if (!archived) {
    check(`${label}: has 3–5 key takeaways`, () => {
      assert(Array.isArray(d.takeaways) && d.takeaways.length >= 3 && d.takeaways.length <= 5, "needs 3–5");
    });
  }
  check(`${label}: body has no H1 (the title is the H1)`, () => {
    assert(!/^#\s/m.test(post.content), "found a '# ' heading in the body");
  });
}

// Drafts must never reach the production build.
if (!INCLUDE_DRAFTS) {
  for (const post of sourcePosts.filter((p) => p.data.draft)) {
    const url = `https://icalialabs.com/blog/${post.slug}.html`;
    // Match listing entries only; a published post may legitimately mention the URL in its body.
    check(`draft ${post.slug}: not built, not listed anywhere`, () => {
      assert(!fs.existsSync(path.join(SITE_DIR, "blog", `${post.slug}.html`)), "HTML was built");
      assert(!sitemapXml.includes(`<loc>${url}</loc>`), "listed in sitemap.xml");
      assert(!feedXml.includes(`<id>${url}</id>`), "listed in feed.xml");
      assert(!llmsTxt.includes(`](${url})`), "listed in llms.txt");
    });
  }
}

for (const post of renderedPosts) {
  const rel = `blog/${post.slug}.html`;
  const url = `https://icalialabs.com/${rel}`;

  check(`${rel}: built`, () => {
    assert(fs.existsSync(path.join(SITE_DIR, rel)), "missing output");
  });
  if (!fs.existsSync(path.join(SITE_DIR, rel))) continue;
  const html = readSite(rel);
  const schemas = jsonLdBlocks(html);

  check(`${rel}: BlogPosting JSON-LD with required fields`, () => {
    const bp = schemas.find((s) => s["@type"] === "BlogPosting");
    assert(bp, "no BlogPosting");
    assert(bp.headline === post.data.title, "headline != title");
    for (const k of ["description", "datePublished", "dateModified", "author", "publisher", "image", "mainEntityOfPage"]) {
      assert(bp[k], `missing ${k}`);
    }
    assert(bp.mainEntityOfPage["@id"] === url, "mainEntityOfPage != canonical URL");
  });
  check(`${rel}: BreadcrumbList JSON-LD`, () => {
    assert(schemas.some((s) => s["@type"] === "BreadcrumbList"), "no BreadcrumbList");
  });
  check(`${rel}: FAQPage JSON-LD matches front matter`, () => {
    const faq = schemas.find((s) => s["@type"] === "FAQPage");
    const expected = (post.data.faq || []).length;
    if (expected === 0) assert(!faq, "FAQPage present without FAQs");
    else assert(faq && faq.mainEntity.length === expected, `expected ${expected} questions`);
  });
  check(`${rel}: canonical, og:type=article, H2 anchors`, () => {
    assert(html.includes(`<link rel="canonical" href="${url}">`), "wrong canonical");
    assert(html.includes('og:type" content="article"'), "og:type not article");
    assert(/<h2 id="[^"]+"/.test(html), "no anchored H2s");
  });
  check(`${rel}: listed in sitemap.xml, feed.xml, and llms.txt`, () => {
    assert(sitemapXml.includes(`<loc>${url}</loc>`), "not in sitemap.xml");
    assert(feedXml.includes(`<id>${url}</id>`), "not in feed.xml");
    assert(llmsTxt.includes(`](${url})`), "not in llms.txt");
  });
}

// Published posts must not ship review placeholders.
if (!INCLUDE_DRAFTS) {
  for (const post of sourcePosts.filter((p) => !p.data.draft)) {
    check(`blog/posts/${post.slug}.md: no [VERIFY] placeholders in a published post`, () => {
      const hits = (post.content.match(/\[VERIFY[^\]]*\]/g) || []).length;
      assert(hits === 0, `${hits} [VERIFY] marker(s) left — resolve them or set draft: true`);
    });
  }
}

// Cover images: file exists, used as cover, card image, and og:image.
for (const post of renderedPosts.filter((p) => p.data.image)) {
  const rel = `blog/${post.slug}.html`;
  check(`${rel}: cover image exists and is used on the post, the /blog/ card, and og:image`, () => {
    const img = post.data.image;
    assert(fs.existsSync(path.join(SITE_DIR, img.replace(/^\//, ""))), `${img} not in build`);
    assert(readSite(rel).includes(`<img src="${img}"`), "no cover <img> on post page");
    assert(readSite(rel).includes(`og:image" content="https://icalialabs.com${img}"`), "og:image not the cover");
    assert(readSite("blog/index.html").includes(`<img src="${img}"`), "no card image on /blog/");
  });
}

// Timeline: one anchored section + nav link per publish year; pre-AI divider only when needed.
check("blog index: timeline has a section and nav link for every publish year", () => {
  const html = readSite("blog/index.html");
  const years = [...new Set(renderedPosts.map((p) => new Date(p.data.date).getUTCFullYear()))];
  for (const y of years) {
    assert(html.includes(`id="y${y}"`), `no section for ${y}`);
    assert(html.includes(`href="#y${y}"`), `no nav link for ${y}`);
  }
});
check("blog index + posts: pre-AI era labels appear exactly for pre-AI posts", () => {
  const settings = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "_data", "blog.json"), "utf-8"));
  const html = readSite("blog/index.html");
  const preAi = renderedPosts.filter((p) => new Date(p.data.date).getUTCFullYear() < settings.aiEraStartYear);
  assert(html.includes("Written before AI was part of how we build") === preAi.length > 0, "divider mismatch");
  for (const p of renderedPosts) {
    const isOld = preAi.includes(p);
    const post = readSite(`blog/${p.slug}.html`);
    assert(post.includes('role="note"') === isOld, `${p.slug}: pre-AI notice should be ${isOld}`);
  }
});

// Topic pages: exactly the topics with rendered posts; aliases fold into their canonical page.
check("blog topic pages match topics that have posts", () => {
  const canonical = (slug) => blogTopics.find((t) => t.slug === slug)?.canonicalSlug || slug;
  const expected = new Set(renderedPosts.flatMap((p) => p.data.topics || []).map(canonical));
  const topicsDir = path.join(SITE_DIR, "blog", "topics");
  const actual = new Set(
    fs.existsSync(topicsDir)
      ? fs.readdirSync(topicsDir).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""))
      : []
  );
  for (const t of expected) assert(actual.has(t), `missing topic page ${t}`);
  for (const t of actual) assert(expected.has(t), `topic page ${t} has no posts`);
  for (const t of blogTopics.filter((t) => t.canonicalSlug)) {
    assert(!actual.has(t.slug), `alias topic ${t.slug} should not get its own page`);
  }
});

check("blog index: exists; noindex, unlisted, and out of nav while empty", () => {
  const html = readSite("blog/index.html");
  const home = readSite("index.html");
  const isEmpty = renderedPosts.length === 0;
  assert(html.includes('content="noindex') === isEmpty, `noindex should be ${isEmpty}`);
  assert(sitemapXml.includes("<loc>https://icalialabs.com/blog/</loc>") === !isEmpty, "sitemap listing mismatch");
  assert(/>\s*Blog\s*</.test(home) === !isEmpty, "nav Blog link mismatch");
});

check("sitemap.xml and feed.xml start with an XML declaration", () => {
  assert(sitemapXml.startsWith("<?xml"), "sitemap.xml has leading content");
  assert(feedXml.startsWith("<?xml") && feedXml.includes("<feed"), "feed.xml malformed");
});

// --- CMS --------------------------------------------------------------------
check("admin/: Sveltia CMS app and config are published", () => {
  const html = readSite("admin/index.html");
  assert(/@sveltia\/cms@\d+\.\d+\.\d+\//.test(html), "CMS script not pinned to an exact version");
  assert(/integrity="sha384-/.test(html), "CMS script missing SRI hash");
  assert(fs.existsSync(path.join(SITE_DIR, "admin", "config.yml")), "config.yml not copied");
});

check("admin/config.yml topic options match blogTopics.json", () => {
  const config = matter.engines.yaml.parse(fs.readFileSync(path.join(ROOT_DIR, "admin", "config.yml"), "utf-8"));
  const posts = config.collections.find((c) => c.name === "posts");
  const topicsField = posts.fields.find((f) => f.name === "topics");
  const options = new Set(topicsField.options.map((o) => o.value));
  for (const t of topicSlugs) assert(options.has(t), `CMS is missing topic ${t}`);
  for (const t of options) assert(topicSlugs.has(t), `CMS offers unknown topic ${t}`);
  assert(config.publish_mode === "editorial_workflow", "editorial workflow disabled");
  const methods = config.backend.auth_methods || ["oauth", "token"];
  assert(
    !methods.includes("oauth") || config.backend.base_url,
    "OAuth sign-in enabled without an OAuth client (backend.base_url) — the button would fail"
  );
  assert(posts.folder === "blog/posts", "posts folder mismatch");
});

// --- Internal links ---------------------------------------------------------
// Every same-site <a href> on every page must resolve to a built file. This
// catches navRoot/footerRoot mistakes on nested pages like /blog/topics/*.
function resolveHref(fromFile, href) {
  let target = href.split("#")[0].split("?")[0];
  if (!target) return null; // pure fragment
  if (/^https?:\/\/(www\.)?icalialabs\.com/i.test(target)) {
    target = new URL(target).pathname;
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) {
    return null; // external, mailto:, tel:, javascript:
  }
  const abs = target.startsWith("/")
    ? path.join(SITE_DIR, target)
    : path.resolve(path.dirname(fromFile), target);
  return decodeURIComponent(abs);
}

function existsAsPage(abs) {
  if (abs.endsWith(path.sep) || (fs.existsSync(abs) && fs.statSync(abs).isDirectory())) {
    return fs.existsSync(path.join(abs, "index.html"));
  }
  // GitHub Pages also serves /page as /page.html.
  return fs.existsSync(abs) || fs.existsSync(`${abs}.html`);
}

for (const file of htmlFiles) {
  const rel = path.relative(SITE_DIR, file);
  const html = fs.readFileSync(file, "utf-8");
  const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/gi)].map((m) => m[1]);
  check(`${rel}: all internal links resolve`, () => {
    const broken = [];
    for (const href of new Set(hrefs)) {
      const abs = resolveHref(file, href);
      if (abs && !existsAsPage(abs)) broken.push(href);
    }
    assert(broken.length === 0, `broken: ${broken.join(", ")}`);
  });
  const srcs = [...html.matchAll(/<img\s[^>]*src="([^"]*)"/gi)].map((m) => m[1]);
  check(`${rel}: all local images resolve`, () => {
    const missing = [];
    for (const src of new Set(srcs)) {
      const abs = resolveHref(file, src);
      if (abs && !fs.existsSync(abs)) missing.push(src);
    }
    assert(missing.length === 0, `missing: ${missing.join(", ")}`);
  });
}

console.log(`\n${checks} checks run, ${failures.length} failed.\n`);
if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log("All checks passed.");
