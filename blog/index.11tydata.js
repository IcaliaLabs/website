const pageDepthRoot = (pageNumber) => (pageNumber > 0 ? "../../../" : "../");

module.exports = {
  pagination: {
    data: "collections.posts",
    size: 12,
    reverse: true,
    alias: "pagePosts",
    // Keep /blog/ live even before the first post is published.
    generatePageOnEmptyData: true,
    addAllPagesToCollections: true,
  },
  permalink: (data) =>
    data.pagination.pageNumber > 0
      ? `/blog/page/${data.pagination.pageNumber + 1}/index.html`
      : "/blog/index.html",
  eleventyComputed: {
    navRoot: (data) => pageDepthRoot(data.pagination.pageNumber),
    footerRoot: (data) => pageDepthRoot(data.pagination.pageNumber),
    canonicalPath: (data) =>
      data.pagination.pageNumber > 0 ? `/blog/page/${data.pagination.pageNumber + 1}/` : "/blog/",
    title: (data) =>
      data.pagination.pageNumber > 0
        ? `Blog — Page ${data.pagination.pageNumber + 1} — Icalia Labs`
        : "Icalia Labs Blog — Nearshore Engineering, AI & Agentic Delivery",
    description: () =>
      "The Icalia Labs blog: practical guides on nearshore hiring, engineering costs, AI-augmented and agentic engineering, and forward-deployed engineering teams.",
    // An empty listing is thin content; keep it out of search until posts exist.
    noindex: (data) => (data.collections.posts || []).length === 0,
  },
};
