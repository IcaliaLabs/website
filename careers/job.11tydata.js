module.exports = {
  pagination: {
    data: "jobs",
    size: 1,
    alias: "job",
    before: (data) => data.filter((j) => j.active),
  },
  permalink: "/careers/{{ job.slug }}.html",
  navRoot: "../",
  footerRoot: "../",
  eleventyComputed: {
    title: (data) => `${data.job.title} — Careers at Icalia Labs`,
    description: (data) => data.job.summary,
    canonicalPath: (data) => `/careers/${data.job.slug}.html`,
  },
};
