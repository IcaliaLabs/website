// Old URLs that still get traffic or are known to Google, and where they live now.
// Each entry becomes a small redirect page (see redirects.njk): GitHub Pages
// can't send 301s, so the page uses an instant meta refresh plus a canonical
// link, which Google treats as a permanent redirect, and shows a visible link
// for crawlers and AI agents that don't follow refreshes.
//
// `from` is the old path as people and crawlers request it. Use `dir: true`
// when the old URL was also linked with a trailing slash: the page is then
// written to <from>/index.html, which serves both forms.
//
// Only map a URL to a page that answers the same question. Redirecting
// unrelated URLs to the homepage gets them treated as soft 404s, so old
// Webflow fragments (/main-footer, /topnav, /old-home, /new-navbar,
// /dark-footer, /menu-red) are left as clean 404s on purpose.
//
// Sources: Search Console "Not found (404)" report and GA4 404 paths,
// 2026-09-30.

const jobs = require("./jobs.json");

const AI_POST = "/blog/ai-augmented-engineering-teams.html";
const NEARSHORE_TOPIC = "/blog/topics/nearshore-hiring.html";

const moved = [
  // Old Webflow service pages
  { from: "/build/staff-augmentation", to: "/" },
  { from: "/build/new-new-staff-augmentation", to: "/" },
  { from: "/build/custom-development", to: "/" },
  { from: "/build/build", to: "/" },
  { from: "/build/design-services", to: "/case-studies.html" },
  { from: "/build/ai-development", to: AI_POST },
  { from: "/ai-agent", to: AI_POST }, // cited by ChatGPT

  // Workshops and past projects
  { from: "/innovate/innovate", to: "/case-studies.html" },
  { from: "/innovate/ai-workshop", to: "/case-studies.html" },
  { from: "/innovate/product-launchpad", to: "/case-studies.html" },
  { from: "/innovate/design-sprint", to: "/blog/design-sprint-in-a-software-development-team.html" },
  { from: "/innovate/ux-ui-workshops", to: "/case-studies.html" },
  { from: "/love/case-studies", to: "/case-studies.html" },
  { from: "/projects/golfin", to: "/case-studies.html" },
  { from: "/projects/okufarma", to: "/case-studies.html" },
  { from: "/projects/potentia", to: "/case-studies.html" },
  { from: "/projects/vamonos", to: "/case-studies.html" },
  { from: "/projects/venture-capital", to: "/case-studies.html" },
  { from: "/projects/yourney", to: "/case-studies.html" },

  // About, contact, legal
  { from: "/love/about", to: "/about.html" },
  { from: "/love/about-copy-2", to: "/about.html" },
  { from: "/about-us", to: "/about.html" },
  { from: "/team", to: "/about.html" },
  { from: "/about-icalia-labs-software-development-company", to: "/about.html" },
  { from: "/contact-icalia-custom-software-development", to: "/contact.html" },
  { from: "/legal/terms-and-conditions", to: "/terms.html" }, // linked from a CRM record
  { from: "/legal/privacy-polices", to: "/privacy.html" },
  { from: "/icalia-software-development-privacy-policies", to: "/privacy.html" },

  // Clutch listing links (the profile still points at /landing/clutch)
  { from: "/landing/clutch", to: "/", dir: true },
  { from: "/landing/clutch-landing", to: "/" },

  // Old blog
  { from: "/blog/icalia-blog", to: "/blog/" },
  { from: "/blogs/the-real-power-of-design-sprints", to: "/blog/design-sprint-in-a-software-development-team.html" },
  { from: "/post/transformation-of-corporate-culture-new-normality-new-challenge", to: "/blog/organizational-debt.html" },
  { from: "/post/advantages-of-nearshore-software-development", to: NEARSHORE_TOPIC },
  { from: "/post/the-benefits-of-working-with-an-it-staff-augmentation-company", to: NEARSHORE_TOPIC },
  { from: "/post/software-services-companies-latin-america", to: NEARSHORE_TOPIC },
  { from: "/blogs/ai-transformed-financial-decision-making", to: "/industries/fintech.html" },
  { from: "/blogs/transforming-fintechs-future", to: "/industries/fintech.html" },
  { from: "/post/emotion-recognition-technology-in-the-financial-sector", to: "/industries/fintech.html" },
];

// Closed roles keep their URL alive: it points at a successor role when the
// job names one (`redirectTo`), otherwise at the careers page.
const closedRoles = jobs
  .filter((job) => !job.active)
  .map((job) => ({
    from: `/careers/${job.slug}.html`,
    to: job.redirectTo || "/careers.html",
    reason: "role closed",
  }));

// Output file for each old path, so the redirect page is served at that URL.
function outputPath({ from, dir }) {
  if (dir) return `${from}/index.html`;
  return from.endsWith(".html") ? from : `${from}.html`;
}

module.exports = [...moved, ...closedRoles].map((r) => ({
  ...r,
  output: outputPath(r),
}));
