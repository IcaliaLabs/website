---
title: 'Rails World 2026: From Software Writers to Makers'
description: 'Notes from Rails World 2026 in Austin: what DHH, Matz and Rails engineers said about AI, and why software writers are becoming software makers.'
draft: false
date: 2026-09-29
updated: ''
author: eduardo-lopez
topics:
  - ai-engineering
  - software-maker
  - agentic-engineering
image: /assets/blog/img_4661.webp
imageAlt: Main Stage of the Palmer Events Center at Austin during Rails World 2026
takeaways:
  - At Rails World 2026, Ruby creator Yukihiro Matsumoto said programming language courses will most likely disappear as English becomes the next layer of abstraction.
  - "DHH described AI as software's camera moment: writing code by hand is ending, and small teams can now maintain several codebases at once."
  - 'Speakers from Fin, GitHub, thoughtbot and Planet Argon agreed that the highest-leverage engineering work in 2026 is improving the system around the code: tests, review guardrails, conventions and feedback loops.'
  - Regulated industries will adopt agent-written software more slowly because compliance must catch up, so teams that prepare now will move first when the rules change.
  - 'Software engineers are splitting into two poles: specialists who work close to models and languages, and builders who work close to the client, the product and the business.'
faq:
  - q: When and where was Rails World 2026?
    a: Rails World 2026 took place September 22–24, 2026, at The Palmer Events Center in Austin, Texas. It is the annual conference of the Ruby on Rails community.
  - q: What did Matz say about the future of programming at Rails World 2026?
    a: Yukihiro Matsumoto, the creator of Ruby, said he had been building with Claude Code 100% of the time since November 2025. He expects programming language courses to largely disappear, because each layer of abstraction, from punch cards to machine code to high-level languages and now English, removes the need to know the machine's technicalities.
  - q: Will AI replace Ruby on Rails developers?
    a: 'The Rails World 2026 speakers described a shift in the role rather than a replacement. Engineers move from writing every line to making software: defining the problem, owning review and maintenance, and improving the system agents work inside.'
  - q: What is harness engineering?
    a: Harness engineering is the practice of wrapping an AI coding agent in automated feedback, such as RSpec tests, RuboCop and self-review, so the agent reacts to signals instead of relying on a perfect prompt. When the output is mediocre, the team fixes the harness rather than the individual mistake.
  - q: How should engineering leaders prepare a codebase for AI agents?
    a: Treat the codebase as the agent's prompt. Consistent conventions, documented knowledge that no longer lives only in people's heads, and automated checks that verify how the work was done make agents produce better code, and they help human engineers too.
  - q: Why will regulated industries adopt AI-written software more slowly?
    a: Healthcare, finance and other regulated sectors depend on traceability, humans in the loop and careful handling of sensitive data, and their compliance frameworks have not caught up with agent-written code. At Rails World 2026, DHH compared it to the roughly ten years it took for cloud data storage to become insurable.
---

I asked Matz, the creator of Ruby, what will happen to programming language courses for the next wave of computer scientists. His answer, in essence: they will most likely disappear. That exchange sums up [Rails World 2026](https://rubyonrails.org/world/2026/agenda) in Austin. AI is turning software writers into software makers, and the work that matters is moving closer to the business and to the system around the code.

## The short answer

For two days in September 2026, almost every session at Rails World pointed at the same shift from a different angle:

1. **The abstraction layer moved again.** English is now how people instruct machines, and code by hand is on its way out.
2. **The craft is moving, not disappearing.** The most valuable engineers are the ones improving tests, review guardrails, conventions and feedback loops, not the ones typing fastest.
3. **Adoption will be uneven.** Regulated industries will lag while compliance catches up. The teams that prepare now will be ready when it does.

## Programming is moving up another layer of abstraction

Matz walked through the ladder. First punch cards, then machine code, then high-level programming languages. Now, English. Each layer made it less necessary to understand the machine underneath.

From here, he expects two poles. One group will go deep into research: large language models, programming languages and low-level code, to understand how models are trained. The other group will move close to the client and the business side.

![Diagram: punch cards, machine code, high-level languages and English as successive layers of abstraction, branching into a research pole (LLMs, languages, low-level code) and a business pole (close to the client, product and experience)](/assets/blog/rails-world-2026-abstraction-ladder.webp)

The Ruby community has always pushed for abstraction and a more human conversation with machines. English is that conversation, arriving all at once. Even the new framework work reflects it. In [Active Search](https://rubyonrails.org/world/2026/sessions/active-search), Donal McBreen of 37signals presented a single Active Record-style interface for searching across engines like Elasticsearch, Meilisearch and PostgreSQL full-text search: one more layer that hides the machinery.

## Software is living its camera moment

David Heinemeier Hansson opened the [keynote](https://rubyonrails.org/world/2026/sessions/opening-keynote) with a story about painting.

In the 18th century, a portrait was an exclusive asset. It took years to finish, and a mistake meant starting over. Then the camera arrived, and the craft as people knew it was gone. The painters who stayed pivoted toward technique, toward what a camera couldn't do. Much later, the iPhone removed the last bit of friction from taking a picture.

DHH's argument was that software is living through the same change. He pointed to November 2025, with the release of Claude Opus 4.5, as a pivotal moment for the industry, followed quickly by open models like Kimi 2.5. In his view, small teams can now maintain several codebases at once, 2026 is the year handwritten code ends, and architecture and abstractions are what evolve next.

He also made a few bets that will be debated for a while: native apps as the future of the front end, Rust as a strong option on the backend, and apps that ship a command-line interface so users can bring their own agent.

## From software writer to software maker

On the second day, Matz and DHH sat down for a [conversation on AI and the future of Ruby and Rails](https://rubyonrails.org/world/2026/sessions/matz-dhh).

![Panel between Matz and DHH during Rails World 2026](/assets/blog/img_4687.webp "Panel between Matz and DHH during Rails World 2026")

Matz shared that since November 2025, he has been building with Claude Code 100% of the time. Then he asked the question many engineers in the room were carrying: where is my identity if I'm no longer the person writing every line of code?

The answer the two kept returning to was letting go of ego. Don't get attached to a language, framework or tool because of who you think you are. The tool should serve the outcome. Engineers are moving from software writers to software makers, and accepting that transition may be the most important work of this phase.

A few other ideas from that hour are worth keeping:

- **AI deals in probability, not prediction.** Treating its output as certain is how teams get hurt.
- **The innovator's dilemma applies.** Established companies that dismiss this as toys or slop are repeating a familiar mistake.
- **More people will make software.** Fewer people may be needed to maintain older systems, but many more will be able and required to create new ones.
- **Generated code still needs owners.** Rails components carry years of maintenance behind them. Generated components will need the same ownership and care.
- **Ruby's values still apply:** joy, agency, motivation and freedom for the people who create.

## The most valuable work happens around the code

The technical sessions told the same story from inside real codebases.

**Fin: shipping as a heartbeat.** Ryan Sherlock showed how Fin keeps [shipping as its heartbeat](https://rubyonrails.org/world/2026/sessions/shipping-heartbeat) in a Rails monolith with more than 3 million lines of code, over 100,000 tests and merge-to-customers in under 10 minutes, according to the session description.

- As agents pushed more code through the pipeline, the team ran a retrospective with its best engineers and wrote their review practices down as guardrails for automated pull-request reviews.
- The system approves what a usual human review would approve and escalates what needs a deeper look. The rules apply regardless of who, or what, wrote the code.

![Shrek: A system to review automatically what agents ship](/assets/blog/img_4678.webp)

**Planet Argon: build the environment.** Robby Russell argued that [the most valuable engineer isn't shipping features](https://rubyonrails.org/world/2026/sessions/most-valuable-engineer). As the session puts it, AI shows that the bottlenecks "were never about typing speed". They were slow feedback loops, fragile deploys and overlapping architectural patterns. His image: sometimes a team doesn't need another James Bond. It needs a Q, the person who builds what everyone else relies on, with less heroism.

![Humans and their reviews became the bottleneck](/assets/blog/img_4677.webp)

**GitHub: your codebase is the prompt.** Kinsey Durham Grace made the case that [your codebase is the prompt](https://rubyonrails.org/world/2026/sessions/agent-proof). Messy conventions and knowledge that lives only in people's heads are "the reason the agent writes bad code." Trust comes from verifying how the work was performed.

**thoughtbot: harness engineering.** Joël Quenneville's [Harness Engineering on Rails](https://rubyonrails.org/world/2026/sessions/harness-engineering) described the practice: hook the agent into signals from RSpec, RuboCop or a self-review, and "fix the harness rather than the mistake." A harness, in this context, is the set of automated checks an agent's output has to pass. His short version from the stage: don't fix the mistake, fix the system.

![Questions to improve your harness every Engineer should be asking](/assets/blog/img_4710.webp)

**Shopify: AI as the next compiler.** Aaron Patterson closed the event by describing [AI as the next compiler](https://rubyonrails.org/world/2026/sessions/closing-keynote). He pointed to the "as-if" rule: a compiler may transform code however it wants, as long as the program behaves as if it ran what was written. His own position: "I'll keep reading the code."

## Will regulated industries keep up?

I asked DHH a question too. If humans step out of the loop, what happens to software in regulated industries?

He answered with sympathy. Some areas, like legal work, could benefit quickly. Compliance and regulation will need to catch up. He compared it to storing sensitive data in the cloud, which took about ten years to become something insurers were comfortable covering. His advice for people in those industries: find a hobby or side project that touches the frontier, so you're ready when the rules change.

I think he's right. In healthcare, finance and other regulated sectors, humans in the loop, traceability and sensitive information are part of the job, and that caution is legitimate. But the teams that prepare while the rules are still being written will be the ones ready to move when they change.

![DHH answering questions from the audience during Rails World 2026](/assets/blog/img_4700.webp)

## What this means for engineering leaders

**The engineer's job is getting wider.** Building software now means being closer to the customer, the business and the experience, not only the code.

When Icalia Labs started in 2012, its founders imagined engineers sitting with a client, shaping the product alongside them. For years that was a luxury. AI is making it the normal shape of the work, and it is why Icalia Labs embeds senior engineers inside its clients' teams. The Icalia Labs [manifesto](/manifesto.html) puts the balance in one line: humans own judgment, taste and strategy; machines carry the weight of execution.

**Specialization is splitting in two.** Engineers who want to be at the frontier will go deeper into models, languages and low-level code. Everyone else will move toward the problem. Both paths need people who understand what they are building and why.

**There will be much more software.** Across the event, the most repeated sentiment was some version of "I've done more in the last year than in the previous ten combined", attributed to the number of Tests, PRs and Lines of Code people have pushed into repositories.

![Tests, 2012 to 2026 from an engineering team](/assets/blog/img_4673.webp)

The painters who stayed after the camera didn't lose their craft. They found out what it was for. That is the work in front of every software team right now.

If you're rethinking how your team builds in this new layer, see how we've embedded engineers with teams like our former clients in our [case studies](/case-studies.html), or [book a 30-minute call](/contact.html#book) to compare notes.
