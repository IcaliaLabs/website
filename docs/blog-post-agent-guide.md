# Icalia Labs blog: post-drafting guide for agents

This guide is for AI agents (and people) drafting posts for the Icalia Labs blog at https://icalialabs.com/blog/. If you follow it, the draft can be pasted straight into the CMS at `/admin/`, or dropped into `blog/posts/`, and it will pass the site's build checks.

The rules below mirror what the site actually enforces (`admin/config.yml` and `scripts/verify-site.js`). If a rule here conflicts with those files, the files win.

---

## 1. What to deliver

Deliver exactly two things:

1. **One Markdown file** named `<slug>.md`: YAML front matter followed by the article body. Always set `draft: true`. A human publishes.
2. **A short handoff note** (in your reply, not in the file) listing:
   - every `[VERIFY: …]` marker and what source would resolve it
   - the image you recommend and its alt text, if you didn't supply one
   - any suggested internal links you left out because the target isn't published yet

Never set `draft: false`, and never invent facts to avoid a `[VERIFY]` marker.

---

## 2. Template

Copy this and fill in every field. Keys and value formats must match exactly.

```markdown
---
title: "Primary Keyword Phrase: A Specific, Useful Promise"
description: "One or two sentences, 70–160 characters, saying exactly what the reader will learn and for whom."
draft: true
date: 2026-10-01
author: eduardo-lopez
topics:
  - nearshore-hiring
  - software-development
image: ""
imageAlt: ""
takeaways:
  - "First standalone answer to the title's question, in one sentence."
  - "Second standalone point a reader could quote without context."
  - "Third standalone point; 3 to 5 takeaways total."
faq:
  - q: "A real question a CTO or VP of Engineering would type into Google?"
    a: "A direct 1–3 sentence answer that makes sense on its own."
  - q: "Another real buyer question?"
    a: "Another direct answer."
---

Opening paragraph: answer the title's question in 2–4 sentences. No throat-clearing.

## The short answer

## First main section (one idea per H2)

### Optional subsection

## How to decide / what to do next

Closing paragraph with 1–2 internal links, e.g. [see our case studies](/case-studies.html) or [book a 30-minute call](/contact.html#book).
```

---

## 3. Field reference

| CMS label | YAML key | Required | Rules (enforced) |
|---|---|---|---|
| Title | `title` | Yes | **30–60 characters**, counting spaces. Becomes the H1 and the Google title. Put the main search phrase near the start. |
| Meta description | `description` | Yes | **70–160 characters.** Shown under the title in Google and AI answers. |
| Draft | `draft` | Yes | **Always `true`** in agent drafts. |
| Publish date | `date` | Yes | `YYYY-MM-DD`, the intended publish date. For archive posts, use the original publish date (see §8). |
| Last updated | `updated` | No | `YYYY-MM-DD`. Leave it out for new posts. Only set it when revising a published post. |
| Author | `author` | Yes | Must be an author ID from §5. |
| Topics | `topics` | Yes | **1–3** slugs from §4. The **first one is the primary topic**: it drives the breadcrumb, the CTA, and the card label. |
| Cover image | `image` | No | Root-relative path like `/assets/blog/your-image.jpg`. The file must exist. Use `""` if you have no image (see §9). |
| Cover image alt text | `imageAlt` | No | Required if `image` is set. Describe what's in the photo. |
| Key takeaways | `takeaways` | Yes | **3–5** strings, one sentence each. |
| FAQ | `faq` | No (strongly recommended) | List of `{ q, a }`. Aim for 4–6. Each becomes FAQ structured data. |
| Body | *(after the front matter)* | Yes | Markdown. **Never use `#` (H1)**; the title is the H1. Use `##` and `###`. |

The file name (slug) comes from the title: lowercase, hyphenated, no dates, no stop-word padding. For example, "How to Hire Software Engineers in Mexico: A US Guide" becomes `how-to-hire-software-engineers-in-mexico.md`. Keep it under ~60 characters. The URL will be `/blog/<slug>.html`.

---

## 4. Topics (use slugs exactly)

| Slug | Label | Use for |
|---|---|---|
| `nearshore-hiring` | Nearshore Hiring | Finding, vetting, and embedding engineers from Mexico/LatAm |
| `engineering-costs` | Engineering Costs | Rates, total cost, ROI, onshore vs. nearshore vs. offshore |
| `software-development` | Software Development | Architecture, delivery, code quality, practices |
| `software-maker` | Software Makers | Founders and builders making software products |
| `ai-engineering` | AI Engineering | AI-augmented engineers and workflows |
| `agentic-engineering` | Agentic Engineering | Agents, MCP servers, agent skills, automation |
| `forward-deployed-engineer` | Forward-Deployed Engineering (FDE) | Engineers embedded in the customer's team |
| `fde` | FDE | Alias of the above. **Prefer `forward-deployed-engineer`.** |
| `fintech` | Fintech | Payments, ledgers, compliance |
| `healthtech` | Healthtech | HIPAA, EHR, clinical workflows |
| `logistics` | Logistics | Freight, fleet, dispatch, supply chain |
| `retail` | eCommerce & Retail | Storefronts, inventory, conversion |

Don't invent new topics. If none fits, say so in the handoff note. Adding a topic takes a developer.

---

## 5. Authors (use IDs exactly)

| `author` ID | Name | Role | Best for |
|---|---|---|---|
| `eduardo-lopez` | Eduardo Lopez De Leon | Co-Founder & CEO | Strategy, hiring models, partnerships, company perspective |
| `abraham-kuri` | Abraham Kuri | Co-Founder & CTO | AI and agentic engineering, technical depth, engineering practice |
| `carlos-medellin` | Carlos Medellin | Board Member | Governance, fintech, financial sustainability |

Pick the author whose expertise matches the topic, and flag the choice in the handoff note. Write in a voice that person could credibly sign. New authors get added in the CMS under *Authors*; don't reference an ID that isn't in this table.

---

## 6. How to write it

### Audience and voice

- **Reader:** CTOs, VPs of Engineering, founders, and engineering managers at US product companies, especially in fintech, healthtech, logistics, and eCommerce.
- **Voice:** a hacker ethos. Direct, confident, technically credible, specific. Write like a senior engineer explaining something to a peer.
- **Avoid:** hype ("revolutionary", "cutting-edge", "game-changer"), filler intros ("In today's fast-paced world…"), and vague claims with no number or example behind them.
- Say **"Icalia Labs"** on first mention, then "Icalia Labs" or "we". Don't abbreviate the name.
- Use US English and sentence-case headings.

### Structure (SEO)

1. **Title:** the main phrase plus a specific promise. Keep it within 30–60 characters.
2. **Opening paragraph:** answer the title's question directly in the first 2–4 sentences.
3. **`## The short answer`** (or an equivalent) near the top for anything with a recommendation.
4. **One idea per `##`.** Phrase headings as a claim or a question a reader would search for.
5. **Tables for comparisons**, and numbered lists for steps.
6. **Length:** about 900–1,800 words. Depth beats length.
7. **Internal links:** 2–4 links to live pages (§7), including at least one to `/case-studies.html` or `/contact.html#book`.

### Structure (GEO: AI answer engines)

- **Takeaways must stand alone.** Each one should be quotable with no context: a complete claim, not a teaser.
- **FAQ answers must stand alone too:** direct, 1–3 sentences, no "as mentioned above".
- **Define terms in one sentence** the first time you use them (e.g. "An Employer of Record (EOR) is a company that employs staff on your behalf.").
- **Put a date on time-sensitive claims** ("as of 2026", "the 2021 reform").
- **Attribute every number,** either to Icalia Labs data (§8) or to a linked external source.

---

## 7. Links

**Internal links:** use root-relative paths, and only pages that are live:

| Path | Page |
|---|---|
| `/` | Homepage |
| `/about.html` | About Icalia Labs |
| `/case-studies.html` | Case studies |
| `/contact.html` | Contact |
| `/contact.html#book` | Book a discovery call |
| `/manifesto.html` | Manifesto |
| `/careers.html` | Open roles |
| `/developers.html` | Open source, SDKs, MCP server |
| `/industries/fintech.html` | Fintech |
| `/industries/healthtech.html` | Healthtech |
| `/industries/logistics.html` | Logistics |
| `/industries/retail.html` | eCommerce & Retail |
| `/blog/how-to-hire-software-engineers-in-mexico.html` | Blog: How to hire software engineers in Mexico |

- **Never link to a draft post.** The build blocks any published post that links to an unpublished one. Check https://icalialabs.com/blog/ for what's live, and list wanted-but-unpublished links in the handoff note instead.
- **External links:** primary or reputable sources only (government sites, official docs, recognized research). Don't link to competitors.

---

## 8. Facts: what you may claim

### Verified Icalia Labs facts (safe to use as written)

- Founded in **2012**; offices in **Austin, TX** and **Monterrey, Mexico**. Write "since 2012" rather than computing a number of years.
- **4.6/5 on Clutch**; **>90 NPS**, based on client surveys across **210+ platforms delivered since 2012**.
- Fewer than **0.4%** of applicants are accepted; engineers average **5+ years** of tenure; experience level is Senior+.
- **YC alum co-founders**; the **first Docker-certified consultancy in Latin America**; **GitHub Partner** in LatAm; **5,000+** cumulative GitHub stars on public repos.
- Monterrey runs on **Central Standard Time year-round**.
- Open source: **Sepomex**, an open REST API and MCP server for Mexican postal codes (see `/developers.html`).

### Case-study facts (link to `/case-studies.html` when you use them)

| Client | What you can say |
|---|---|
| RTS (acquired) | Six-person senior squad plus design bench in Monterrey; 5+ years; oil-and-gas operations; **3x ROE** on technology investment; **5/5 NPS** |
| Point B | Six senior engineers plus two front-end specialists; 5+ years; helped launch software services generating **40%+ value-add revenue** |
| Apply Digital | Canadian consultancy's first LatAm footprint; **15-person** team across Mexico and Colombia; Build/Operate/Transfer; **6–12 months** to stand up the team |
| Everlance (acquired) | San Francisco consumer startup; **eight senior engineers** (backend and native mobile); same-quality hires at **60% cost savings**; every engineer stayed through the acquisition |
| EMR Bear (acquired) | New Mexico healthcare company; **four** specialized Rails engineers; first critical features in production within **four weeks**; kept shipping through the acquisition |

### Rules

- **Don't invent** statistics, client names, quotes, testimonials, rates, salaries, or timelines.
- **Market data** (salary bands, hourly rates, hiring times, legal thresholds) needs a linked source. If you don't have one, write the claim and add `[VERIFY: what's needed and a likely source]` right after it. Drafts may contain these markers; the build refuses to publish a post that still has any.
- **Legal and tax content** (labor law, contracts, taxes) must include a "general information, not legal advice" line and a `[VERIFY]` marker for counsel review.
- Don't quote a person unless the quote already appears on icalialabs.com.

---

## 9. Images

- Agents usually can't upload files. Leave `image: ""` and `imageAlt: ""`, and describe the recommended image in the handoff note (subject, orientation, and why it fits).
- If you do add one: place a JPG or WebP (**~1920px wide, landscape, under ~500 KB**) in `assets/blog/`, and set `image: /assets/blog/<file>`. Posts without an image get a branded placeholder automatically.
- Inline images in the body use `![alt text](/assets/blog/<file>)`, placed on their own line after the paragraph they illustrate.
- Prefer real Icalia photos: the team, the offices, whiteboards. Avoid generic stock images of handshakes or glowing brains.

---

## 10. Dates and the timeline

- The blog page groups posts **by publish year**. Posts dated **before 2023** are automatically labeled **"Pre-AI era"**, with a notice at the top of the post. Posts from 2023 onward are the "AI era".
- For **new posts**, set `date` to the intended publish date.
- For **archive or republished posts**, keep the **original** date so the timeline stays honest. Don't redate old content to make it look new; set `updated` if you revise it.

---

## 11. YAML pitfalls

- **Quote any string containing `:`, `#`, a leading `-`, or a leading `'`/`"`**, e.g. `title: "Nearshore vs. Offshore: What Changes"`.
- Use two-space indentation and never tabs. List items start with `- `.
- In `faq`, `q:` and `a:` must line up under each item:
  ```yaml
  faq:
    - q: "Question?"
      a: "Answer."
  ```
- Dates stay unquoted: `date: 2026-10-01`.
- Don't use `{{` or `{%` anywhere. They're template syntax.

---

## 12. Getting the draft into the CMS

**Option A: CMS (no repo access).** Open https://icalialabs.com/admin/ → *Blog posts* → **New Blog post**, then copy each front-matter value into the field with the matching label (§3). Paste everything after the closing `---` into **Body**. Leave **Draft** on and save. The CMS opens a pull request for review.

**Option B: repository.** Save the file as `blog/posts/<slug>.md`, then run:

```bash
npm run build:preview && npm run test:preview
```

Fix every `FAIL` it prints. Drafts render in the preview build, so this validates your post before a human publishes it.

---

## 13. Self-check before handing off

- [ ] `draft: true`
- [ ] Title is 30–60 characters; description is 70–160 characters
- [ ] `date` is `YYYY-MM-DD`; `author` is an ID from §5
- [ ] 1–3 topics from §4, with the most relevant one first
- [ ] 3–5 standalone takeaways; 4–6 FAQs with standalone answers
- [ ] No `#` H1 in the body; one idea per `##`
- [ ] The opening paragraph answers the title's question
- [ ] Every number is either an Icalia Labs fact (§8) or sourced, and everything else is marked `[VERIFY: …]`
- [ ] Internal links point only to live pages (§7) and include `/case-studies.html` or `/contact.html#book`
- [ ] No invented clients, quotes, or statistics
- [ ] Strings with colons are quoted, and there are no tabs in the YAML
- [ ] Handoff note lists the `[VERIFY]` items, the image suggestion, and any skipped links
