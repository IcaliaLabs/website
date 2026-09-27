module.exports = {
  permalink: "/blog/index.html",
  navRoot: "../",
  footerRoot: "../",
  canonicalPath: "/blog/",
  title: "Icalia Labs Blog — Nearshore Engineering, AI & Agentic Delivery",
  description:
    "The Icalia Labs blog: engineers, founders, and operators on nearshore hiring, engineering costs, AI-augmented and agentic engineering, and forward-deployed teams.",
  eleventyComputed: {
    // An empty listing is thin content; keep it out of search until posts exist.
    noindex: (data) => (data.collections.posts || []).length === 0,
  },
};
