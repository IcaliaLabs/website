const { execFileSync } = require("child_process");
const markdownItAnchor = require("markdown-it-anchor");
const blogTopics = require("./_data/blogTopics.json");

const SITE_URL = "https://icalialabs.com";
const SITEMAP_EXCLUDE_PREFIXES = ["/cyberpunk/", "/monospace/", "/terminal/", "/mix/"];

// Drafts render only for local preview (`eleventy --serve`) or the CI
// preview build (INCLUDE_DRAFTS=1), never in the production build.
const includeDrafts = () =>
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.INCLUDE_DRAFTS === "1";

const topicBySlug = (slug) => blogTopics.find((t) => t.slug === slug);
const canonicalTopicSlug = (slug) => topicBySlug(slug)?.canonicalSlug || slug;

function slugifyHeading(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDate(value) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

// Last commit date for a source file, for sitemap <lastmod>. Falls back to
// null (caller uses the page date) for uncommitted files or shallow clones.
const gitDateCache = new Map();
function gitLastModified(inputPath) {
  if (!inputPath) return null;
  if (gitDateCache.has(inputPath)) return gitDateCache.get(inputPath);
  let result = null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", inputPath], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    result = out ? new Date(out) : null;
  } catch {
    result = null;
  }
  gitDateCache.set(inputPath, result);
  return result;
}

module.exports = async function (eleventyConfig) {
  const { feedPlugin } = await import("@11ty/eleventy-plugin-rss");

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.permalink || data.permalink === false) return data.permalink;
      if (data.page.inputPath.endsWith(".html")) {
        return `${data.page.filePathStem}.html`;
      }
      return undefined;
    },
  });

  eleventyConfig.addGlobalData("siteUrl", SITE_URL);
  eleventyConfig.addGlobalData("includeDrafts", includeDrafts());

  eleventyConfig.amendLibrary("md", (md) =>
    md.use(markdownItAnchor, { level: [2, 3], slugify: slugifyHeading, tabIndex: false })
  );

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("monospace");
  eleventyConfig.addPassthroughCopy("terminal");
  eleventyConfig.addPassthroughCopy("cyberpunk");
  eleventyConfig.addPassthroughCopy("mix");

  // --- Blog collections -------------------------------------------------
  // Oldest-first, Eleventy's convention; templates and the feed reverse it.
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByTag("post")
      .filter((p) => includeDrafts() || !p.data.draft)
      .sort((a, b) => a.date - b.date)
  );

  // One entry per topic that has at least one published post. Alias topics
  // (e.g. `fde`) fold into their canonical topic instead of getting a page.
  eleventyConfig.addCollection("topicPages", (api) => {
    const posts = api
      .getFilteredByTag("post")
      .filter((p) => includeDrafts() || !p.data.draft);
    return blogTopics
      .filter((t) => !t.canonicalSlug)
      .map((t) => ({
        ...t,
        posts: posts
          .filter((p) => (p.data.topics || []).map(canonicalTopicSlug).includes(t.slug))
          .sort((a, b) => b.date - a.date),
      }))
      .filter((t) => t.posts.length > 0);
  });

  eleventyConfig.addCollection("sitemap", (api) => {
    const hasPosts = api
      .getFilteredByTag("post")
      .some((p) => includeDrafts() || !p.data.draft);
    return api
      .getAll()
      .filter((item) => {
        const url = item.url;
        if (!url || !(url.endsWith(".html") || url.endsWith("/"))) return false;
        if (url === "/404.html") return false;
        if (item.data.sitemapExclude) return false;
        if (SITEMAP_EXCLUDE_PREFIXES.some((p) => url.startsWith(p))) return false;
        // The empty /blog/ listing is noindex until the first post publishes.
        if (!hasPosts && url.startsWith("/blog/")) return false;
        return true;
      })
      .sort((a, b) => a.url.localeCompare(b.url));
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/blog/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: "Icalia Labs Blog",
      subtitle:
        "Nearshore engineering, AI-augmented delivery, and building software teams that ship.",
      base: `${SITE_URL}/`,
      author: { name: "Icalia Labs", email: "sales@icalialabs.com" },
    },
  });

  // --- Filters -----------------------------------------------------------
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = toDate(value);
    if (!d) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const d = toDate(value);
    return d ? d.toISOString().slice(0, 10) : "";
  });

  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 225));
  });

  // Posts: `updated`, then publish date. Everything else: last git commit.
  eleventyConfig.addFilter("lastmod", (item) => {
    const isPost = (item.data.tags || []).includes("post");
    const d = isPost
      ? toDate(item.data.updated) || item.date
      : gitLastModified(item.inputPath) || item.date;
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("newestFirst", (arr) => [...(arr || [])].reverse());
  eleventyConfig.addFilter("topic", (slug) => topicBySlug(slug));
  eleventyConfig.addFilter("topicUrl", (slug) => `/blog/topics/${canonicalTopicSlug(slug)}.html`);

  eleventyConfig.addFilter("postsForTopic", (posts, slug, n) =>
    [...(posts || [])]
      .reverse()
      .filter((p) => (p.data.topics || []).map(canonicalTopicSlug).includes(slug))
      .slice(0, n || 3)
  );

  eleventyConfig.addFilter("relatedPosts", (posts, currentUrl, topics, n) => {
    const wanted = (topics || []).map(canonicalTopicSlug);
    return [...(posts || [])]
      .reverse()
      .filter((p) => p.url !== currentUrl)
      .map((p) => ({
        post: p,
        overlap: (p.data.topics || []).map(canonicalTopicSlug).filter((t) => wanted.includes(t))
          .length,
      }))
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, n || 3)
      .map((x) => x.post);
  });

  // Safe to drop into <script type="application/ld+json">.
  eleventyConfig.addFilter("jsonLd", (obj) => JSON.stringify(obj).replace(/</g, "\\u003c"));

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
