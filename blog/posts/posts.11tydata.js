const SITE_URL = "https://icalialabs.com";
const DEFAULT_IMAGE = "/assets/og-image.png";

const includeDrafts = () =>
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.INCLUDE_DRAFTS === "1";

const isHidden = (data) => Boolean(data.draft) && !includeDrafts();

function isoDate(value) {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function buildSchema(data) {
  const url = `${SITE_URL}${data.canonicalPath}`;
  const author = data.authors?.[data.author];
  const topicLabels = (data.topics || [])
    .map((slug) => data.blogTopics?.find((t) => t.slug === slug)?.label)
    .filter(Boolean);
  const primaryTopic = data.blogTopics?.find((t) => t.slug === (data.topics || [])[0]);

  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: isoDate(data.page.date),
    dateModified: isoDate(data.updated) || isoDate(data.page.date),
    image: `${SITE_URL}${data.image || DEFAULT_IMAGE}`,
    inLanguage: "en",
    keywords: topicLabels.join(", "),
    about: topicLabels.map((name) => ({ "@type": "Thing", name })),
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          image: `${SITE_URL}${author.photo}`,
          sameAs: author.sameAs || [],
          worksFor: { "@type": "Organization", name: "Icalia Labs", url: SITE_URL },
        }
      : { "@type": "Organization", name: "Icalia Labs", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Icalia Labs",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.svg` },
    },
  };

  const crumbs = [
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Blog", item: `${SITE_URL}/blog/` },
  ];
  if (primaryTopic) {
    const slug = primaryTopic.canonicalSlug || primaryTopic.slug;
    crumbs.push({ name: primaryTopic.label, item: `${SITE_URL}/blog/topics/${slug}.html` });
  }
  crumbs.push({ name: data.title, item: url });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };

  const schemas = [posting, breadcrumb];

  if (Array.isArray(data.faq) && data.faq.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return schemas;
}

module.exports = {
  tags: ["post"],
  layout: "layouts/post.njk",
  // Editors write plain Markdown; never run it through Nunjucks.
  templateEngineOverride: "md",
  navRoot: "../",
  footerRoot: "../",
  ogType: "article",
  eleventyComputed: {
    permalink: (data) => (isHidden(data) ? false : `/blog/${data.page.fileSlug}.html`),
    eleventyExcludeFromCollections: (data) => isHidden(data),
    canonicalPath: (data) => `/blog/${data.page.fileSlug}.html`,
    pageTitle: (data) => `${data.title} — Icalia Labs Blog`,
    summary: (data) => data.description,
    ogImage: (data) => data.image || DEFAULT_IMAGE,
    twitterCard: () => "summary_large_image",
    schema: (data) => buildSchema(data),
  },
};
