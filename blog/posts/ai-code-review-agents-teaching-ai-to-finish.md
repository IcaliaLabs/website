---
title: "AI Code Review Agents: Teaching AI to Finish Its Work"
description: "Why AI coding agents ship code that only looks ready, and how a seven-step review loop led by senior engineers gets work to finished."
draft: false
date: 2026-10-20
author: abraham-kuri
topics:
  - agentic-engineering
  - ai-engineering
  - forward-deployed-engineer
image: /assets/blog/dev-loop-seven-step-loop.jpg
imageAlt: "Diagram of the dev-loop review cycle: plan, challenge the plan, human approval, parallel build, basic review, outside challenge, fix and review again, then ship only when no serious issue remains."
takeaways:
  - "AI coding agents write code in seconds, but code that looks ready is not the same as code that is finished."
  - "An AI that grades its own work can pass changes it has already flagged, so a single serious finding must be able to stop delivery on its own."
  - "In the dev-loop benchmark, the full review loop cost 1.84x more per task than a loop without its guarantees ($11.44 vs $6.22), and its severity gate caught 23 of 25 seeded defects without blocking any correct change."
  - "The senior engineer's job in an agent team is to plan, approve and own the definition of done; agents build, and an outside model audits the work."
  - "A full review loop is worth its cost wherever mistakes are expensive: regulated industries such as fintech, healthtech, logistics, aviation, airspace and mobility."
faq:
  - q: "What is an AI code review agent?"
    a: "An AI code review agent is a model that inspects code written by another agent or a person, looking for incorrect behavior, missing tests, security problems or style issues before the change ships."
  - q: "Why can't a coding agent review its own work?"
    a: "A model grading its own output tends to rate it favorably. In the dev-loop benchmark, a gate that shipped any change scoring 8.5 or more out of 10 passed work that its own rater had flagged as needing action before shipping."
  - q: "What is dev-loop?"
    a: "dev-loop is a free, open-source workflow I created as CTO of Icalia Labs. It makes AI agents plan, challenge, build, review and fix code in a loop, and ships only when no serious issue is left. It is published under the MIT license at github.com/kurenn/dev-loop."
  - q: "How much more does a guarded review loop cost?"
    a: "In the dev-loop benchmark I presented at Monterrey Startup Week on September 29, 2026, the full loop cost $11.44 per task against $6.22 for an earlier version without its guarantees, about 1.84x more. The extra cost buys process guarantees, such as a test gate before review and a stop rule for serious errors, not better-looking code."
  - q: "How was dev-loop tested?"
    a: "Like an audit. The benchmark seeded known defects into changes, replayed the gate decisions, hid the acceptance tests from the agents and had graders score the code blind. It ran 17 loop runs, 60 gate replays and 24 blind gradings on one Rails repository with two tasks."
  - q: "When is a multi-agent review loop worth it?"
    a: "It is worth it when a mistake is expensive: incorrect behavior, data loss or a security hole in production, especially in regulated industries such as fintech, healthtech, logistics, aviation and mobility. For throwaway prototypes, a single agent is usually enough."
---

AI coding agents now write working-looking code in seconds. The hard part is no longer starting the work; it is finishing it. A review loop that separates planning, building and adversarial review, with a senior engineer approving the plan and owning the definition of done, closes most of that gap at roughly 1.84x the cost of a loop without those guarantees. That is what I presented on September 29, 2026, at Monterrey Startup Week, at Expedition FEMSA, Tecnológico de Monterrey, in my session "dev-loop: Teaching AI to Finish Its Work, Not Just Start It."

## The short answer

Teams that want AI agents to ship production code, not just drafts, need three things: a reviewer that is not the author, a test gate that runs before any review, and a stop rule that lets one serious error block delivery. I packaged those three ideas into dev-loop, a free and open-source workflow I published at [github.com/kurenn/dev-loop](https://github.com/kurenn/dev-loop). Its README sums up the rule in one line: a development loop "that won't ship while anything is blocking."

## Why "looks ready" is not ready

My talk opened on a simple question: AI already writes code in seconds, but who reviews it? Three problems show up when the answer is "the same AI":

- **"Looks ready" is not ready.** Agent output usually compiles, reads cleanly and passes a quick glance.
- **AI tends to grade its own work.** Self-review favors the author.
- **A good grade can hide a serious error.** A change rated 8.5 out of 10 can still ship the bug that breaks everything.

This matches what other practitioners are reporting. Simon Willison wrote on [September 24, 2026](https://simonwillison.net/2026/Sep/24/harder/) that "the more time I spend working with coding agents, the more convinced I am that they make software engineering even harder," and that getting the most from them "requires extraordinary discipline and knowledge." Google's [2025 DORA report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) reached a similar conclusion at scale: "AI doesn't fix a team; it amplifies what's already there."

## The surgical team, revisited

In *The Mythical Man-Month* (1975), Fred Brooks described Harlan Mills' proposal for a "surgical team": one chief programmer does the critical design and coding, surrounded by specialists who support, test and document. The team moves at the speed of one mind, with the throughput of several people.

Agents make that structure practical again. The specialists are now agents that build, test and challenge in parallel. The chief programmer is a senior engineer who:

- plans the change, or approves an agent's plan after it has been challenged,
- decides what counts as a serious problem,
- owns the decision to ship.

At Icalia Labs, we call that role a nearshore forward deployed engineer: a senior engineer embedded in a client's team, time-zone aligned, who directs agents instead of competing with them on typing speed.

## The seven-step loop

dev-loop turns the surgical team into a repeatable process. In the version I presented, each change runs through seven steps:

1. **Someone plans.** One agent writes the implementation plan.
2. **Someone else challenges the plan.** A second agent, blind to the planner, reviews it from scratch.
3. **A human approves.** The engineer signs off before any code is written.
4. **It gets built in parallel.** Several agents work on separate files.
5. **Agents review the basics.** Does it build, do the tests pass, does it follow the style rules?
6. **An outside auditor tries to break it.** A model from a different family looks for serious failures.
7. **It gets fixed, and reviewed again.** The loop repeats until nothing serious is left.

![Diagram of the seven-step dev-loop cycle: plan, challenge the plan, human approval, parallel build, basic review, outside challenge, fix and re-review, ending in ship only when zero serious issues remain.](/assets/blog/dev-loop-seven-step-loop.jpg)

The example on my slides was a request to add a login. A Claude Opus agent planned it, and a second Opus agent challenged the plan from scratch. A human approved. Three agents built it in separate files, and the basic review passed. OpenAI's Codex then audited the change, tried to break it and found one serious issue. After one round of fixes, a second audit found zero serious issues, and the change shipped.

The public repository describes a more granular version of the same cycle: plan, critique, approve, implement, gate (build, test, lint, typecheck, coverage), adversarial review, a blind rating, fix and ship. Findings go back to the gate, not to the reviewer. The seven steps above are the version I presented in the talk.

## The rule: ship only when nothing serious is left

The loop's stop rule is deliberately strict. A change ships only when no serious issue remains, and "serious" has a fixed definition:

- incorrect behavior,
- data loss,
- a security hole,
- an unmet acceptance criterion.

If the loop cannot get there within its capped fix rounds, it stops and tells the engineer rather than lowering the bar. It does not ship a "mostly good" change. This is the part that turns a fast agent into a finished deliverable: one serious finding is enough to block delivery, no matter how good the average score looks.

## How dev-loop was tested: an auditor's approach

I built the benchmark behind the talk the way an auditor tests a control, not the way a vendor runs a demo. Instead of asking whether the code looked good, it asked whether the process caught what it was supposed to catch:

- **Known defects were seeded on purpose.** Frozen changes were salted with defects such as a nil dereference, a missing authorization check and removed test coverage, and the gate decisions were replayed against them.
- **The acceptance tests were hidden.** They were written from the task description, and the agents never saw them.
- **Grading was blind.** Graders scored the code with the loop's own artifacts stripped out and the order of the versions alternated.
- **The auditor is a different model.** Codex reviews code written by Claude agents, and an Opus rater scores it without knowing the shipping threshold.

In total: 17 loop runs, 60 gate replays and 24 blind gradings, on one Rails repository with two tasks. The full method and raw numbers are published in the repository's [benchmark results](https://github.com/kurenn/dev-loop/blob/main/bench/RESULTS.md).

## Does it work, and what does it cost?

I was direct about the price in the talk.

| Measure | Loop without the guarantees | dev-loop |
| :---- | :---- | :---- |
| Cost per task | $6.22 | $11.44 (1.84x) |
| Reviewer checking code that fails its own tests | 2 of 5 runs | Never: no review starts until build and tests pass (8 of 8 mechanical assertions met) |
| Seeded defects caught before shipping | A score gate (8.5 out of 10 or higher) passed work its own rater had flagged | 23 of 25, with 0 correct changes blocked |
| Blind-graded code quality | Baseline | Parity, not superiority |

![Bar chart comparing a loop without guarantees at $6.22 per task with dev-loop at $11.44 per task (1.84x), alongside outcomes: an unguarded loop reviewed failing code in 2 of 5 runs while dev-loop runs tests before any review, and dev-loop's severity gate caught 23 of 25 seeded defects with 0 correct changes blocked.](/assets/blog/dev-loop-cost-vs-outcome.jpg)

Two reviewer failures account for most of the gain:

- **Reviewing code that does not even run.** An unguarded loop reviewed failing code in 2 of 5 runs. dev-loop runs the build and tests first; if they fail, there is no review.
- **Giving a good grade to work that should not ship.** A gate that shipped anything rated 8.5 or more out of 10 passed work its own rater had flagged as needing action. dev-loop replaces the average score with a severity gate: any single blocking finding stops delivery. That gate caught 23 of 25 seeded defects and did not block a single correct change.

The benchmark is also candid about what the extra cost does not buy. On blind-graded code quality, the loop reaches "parity, not superiority." As I wrote in the repository: "You are buying process guarantees, not better code." Or, as one of my slides put it: "Reviewing has a price."

The scope is narrow by design: one Rails application, two tasks, and I built both the tool and the benchmark. The repository states that its stack-agnostic claim is designed for but not yet measured, and I welcome outside review. Teams that adopt a loop like this should run the same kind of audit on their own codebase.

## When the extra cost is worth it

My answer in the talk was short: when mistakes are expensive. That describes regulated industries, where an error is not just a bug but a compliance, safety or financial event. It also describes most of the systems we work on at Icalia Labs:

- **[Fintech](/industries/fintech.html):** a ledger or payment change with incorrect behavior is a financial and compliance event.
- **[Healthtech](/industries/healthtech.html):** data loss or a privacy hole in a clinical workflow is a regulatory problem.
- **[Logistics and supply chain](/industries/logistics.html):** a wrong integration can stop dispatch or misroute freight.

The same logic applies in other regulated spaces where software touches safety, people and physical assets:

- **Aviation:** maintenance, scheduling and crew systems operate under strict certification and audit requirements.
- **Airspace:** drone, air traffic and flight-data systems have no tolerance for silent failures.
- **Mobility:** fleet, ride and vehicle software moves people and must hold up under safety and data rules.
- **Energy, insurance and other regulated sectors:** anywhere an auditor, a regulator or a safety review will read the change history.

For prototypes and internal tools, a single agent is often enough. For production systems with real users and real constraints, paying 1.84x per task to stop serious errors before they ship is cheaper than finding them in production. It also moves the bottleneck where it belongs: from typing code to senior review of what the code should do.

## What engineering leaders should take from it

The question for a CTO is no longer whether a team uses agents. It is who decides when the agents' work is done, and what rule they use. Teams that answer with a named senior engineer, a test gate, an outside auditor and a stop rule for serious errors get the speed without the surprise.

I closed the talk with a line that sums up the loop: "Fast is easy. Finished is what matters."

To see how we embed senior engineers who run agent workflows like this inside client teams, [see our case studies](/case-studies.html) or [book a 30-minute call](/contact.html#book).
