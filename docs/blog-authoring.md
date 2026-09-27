# Writing and publishing blog posts

The blog lives in this repository as Markdown files (`blog/posts/*.md`). You don't need to touch the files directly: the content manager at **https://icalialabs.com/admin/** gives you a visual editor. It's [Sveltia CMS](https://sveltiacms.app), which is free and open source. There's no subscription and no server.

## How publishing works

1. You write or edit a post in `/admin/` and click **Save**.
2. The CMS opens a pull request on `IcaliaLabs/website` for that post (this is the *Editorial Workflow*).
3. GitHub Actions builds the site and runs the checks on that pull request. Broken fields, missing takeaways, or bad links show up here, before anything goes live.
4. When the post is ready, turn **Draft** off, save, and click **Publish**. The CMS merges the pull request, and the normal deploy puts the post on icalialabs.com within a couple of minutes.

A post with **Draft** on stays hidden from the live site even after it's merged. You can safely merge work in progress.

## One-time setup: your access token

Each editor needs a GitHub account with write access to `IcaliaLabs/website` and a personal access token.

1. Go to **https://icalialabs.com/admin/** and click **Sign In with Token**. The dialog links straight to GitHub's token page with the right permissions pre-selected.
2. If you create the token manually, use a **fine-grained token** under GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens:
   - **Resource owner:** IcaliaLabs
   - **Repository access:** Only select repositories → `IcaliaLabs/website`
   - **Permissions:** *Contents*: Read and write. *Pull requests*: Read and write.
   - **Expiration:** 90 days is a sensible default. Make a new one when it expires.
3. Paste the token into the dialog. It's stored only in your browser.

If the IcaliaLabs organization requires approval for fine-grained tokens, an org owner has to approve yours once (GitHub → IcaliaLabs → Settings → Personal access tokens → Pending requests).

## Writing a post

Fill in every field. Each one feeds search engines and AI answer engines:

| Field | What it's for | Rules |
|---|---|---|
| Title | The page H1 and the search-result title | 30–60 characters; main search phrase near the start |
| Meta description | Text under the title in Google and AI answers | 70–160 characters; say what the reader will learn |
| Draft | Hides the post from the live site | Turn off only when it's ready |
| Publish date / Last updated | Shown on the post and in structured data | Update "Last updated" when you materially revise |
| Author | Byline, author bio, and author structured data | Pick from Authors |
| Topics | Topic pages, breadcrumb, related posts | 1–3; the first is the primary topic |
| Cover image + alt text | Link previews and the post header | 1200×630 works best |
| Key takeaways | The answer-first summary at the top | 3–5 one-sentence answers that each stand alone |
| FAQ | Visible FAQ section + FAQ rich results | Real questions buyers ask |
| Body | The article | `##` for sections, `###` for subsections, never `#` |

### SEO and AI-search checklist

- **Answer first.** The first paragraph and the takeaways should directly answer the question in the title. AI answer engines quote these.
- **One idea per `##` section**, with a heading that reads like a question or a claim.
- **Cite a source for every number.** Link to it. Prefer your own data: case studies, Clutch rating, acceptance rate.
- **Use tables for comparisons.** Search engines and AI engines extract tables reliably.
- **Link internally**: to a related post, the matching industry page, and `/case-studies.html` or `/contact.html#book`.
- **Be specific.** Name stacks, roles, and numbers. Generic copy doesn't rank or get cited.
- **Refresh** posts that matter and set *Last updated*.

## Previewing before you publish

- **In the CMS:** the right-hand pane previews your text as you type.
- **On a developer's machine:** `npm run dev`, then open `http://localhost:8080/blog/`. Drafts are visible locally with a red "Draft preview" banner.
- **Without a token:** on a local checkout, run `npm run dev`, open `http://localhost:8080/admin/` in Chrome or Edge, and choose **Work with Local Repository**. Edits are written straight to your local files.

## Authors and topics

- **Authors** can be added and edited in the CMS under *Authors*. The file name is the author's ID.
- **Topics** are a fixed list, so topic pages stay focused. Adding one takes a developer: add it to `_data/blogTopics.json` **and** to the `topics` options in `admin/config.yml`. `npm test` fails if the two get out of sync.
- A topic page (`/blog/topics/<topic>.html`) only exists once at least one published post uses that topic. `fde` posts are listed on the Forward-Deployed Engineering page, so the two don't compete in search.

## What's generated automatically

You never edit these by hand. They're rebuilt from the posts on every deploy:

- `/blog/`: the listing (hidden from search and the nav until the first post is published)
- `/blog/topics/*.html`: topic pages
- `/blog/feed.xml`: the Atom feed
- `/sitemap.xml` and `/llms.txt`: search engines and AI crawlers see new posts immediately
- `/blog/<post>.md`: a plain-Markdown copy of each post for AI agents
- BlogPosting, BreadcrumbList, and FAQPage structured data on each post

## Troubleshooting

- **"Resource not accessible by personal access token"** when saving: your token is missing the *Pull requests* permission. Edit the token and add it.
- **The pull request check failed:** open the failed check on GitHub. The `Verify site` step lists exactly which field or link is wrong.
- **The post merged but isn't on the site:** check that *Draft* is off.

## Upgrading the CMS

`admin/index.html` pins an exact Sveltia CMS version with an integrity hash. To upgrade, change the version in the script URL and replace the hash:

```bash
curl -sL https://unpkg.com/@sveltia/cms@NEW_VERSION/dist/sveltia-cms.js | openssl dgst -sha384 -binary | openssl base64 -A
```
