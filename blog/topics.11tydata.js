module.exports = {
  pagination: {
    data: "collections.topicPages",
    size: 1,
    alias: "topic",
    addAllPagesToCollections: true,
  },
  permalink: (data) => `/blog/topics/${data.topic.slug}.html`,
  navRoot: "../../",
  footerRoot: "../../",
  eleventyComputed: {
    canonicalPath: (data) => `/blog/topics/${data.topic.slug}.html`,
    title: (data) => `${data.topic.label} — Icalia Labs Blog`,
    description: (data) => data.topic.description,
  },
};
