---
title: "How to Evaluate an Engineer's AI Skills Before Hiring"
description: "Place candidates on an AI skill ladder, ask where AI was wrong and what runs in production, then watch them build live with their own agents."
draft: false
date: 2026-10-28
author: eduardo-lopez
topics:
  - ai-engineering
  - nearshore-hiring
image: "/assets/blog/how-to-evaluate-an-engineers-ai-skills-cover.webp"
imageAlt: "The AI skill ladder for software engineers, five levels from bottom to top: 1 copy-paste or autocomplete, 2 vibe coding, 3 AI-assisted, 4 AI-augmented, 5 agentic loops running in production across testing, QA, PRs and CI/CD with guardrails."
takeaways:
  - "Evaluating an engineer's AI skills means placing them on a ladder, from copy-paste and autocomplete through vibe coding, AI-assisted and AI-augmented work, up to agentic loops."
  - "The most revealing AI interview question is when the AI was wrong and how the engineer caught and fixed it."
  - "Senior AI skill shows in production: which agents or loops an engineer runs across testing, QA, pull requests and CI/CD, and what guardrails keep errors from repeating."
  - "Vibe coding on its own is not a positive signal unless the engineer is senior enough to catch what the model gets wrong."
  - "As of 2026 there is no settled industry standard for testing AI skill, so structured questions and a short live build work best as one gate alongside identity and depth checks."
faq:
  - q: "What questions should you ask to assess an engineer's AI skills?"
    a: "Ask how they use AI day to day (terminal, IDE or copy-paste), a time the AI was wrong and how they fixed it, how they use AI in testing and code review, which automations or agents they run, and whether they have built AI into a product beyond a chatbot."
  - q: "What are the levels of AI skill for software engineers?"
    a: "A practical ladder runs from copy-paste and autocomplete, to vibe coding, to AI-assisted and AI-augmented development, up to agentic loops that run in production across testing, review and deployment."
  - q: "Is vibe coding a good sign in a candidate?"
    a: "Not on its own. Vibe coding is only a positive signal when the engineer is senior enough to review the output and catch mistakes, such as a generated query that would delete data."
  - q: "What is a live build interview?"
    a: "A live build interview is a timeboxed session, typically under 45 minutes, where a candidate builds a small working system with their own models, agents and skills while the interviewer watches."
  - q: "Why does production AI experience matter in regulated industries?"
    a: "In fintech, healthtech and other regulated spaces, engineers handle sensitive data from day one. An engineer using AI on that data for the first time is a compliance risk, so production experience with guardrails matters more there than anywhere else."
---

Evaluating an engineer's AI skills takes three moves: place them on a skill ladder, ask where the AI was wrong and what they run in production, and watch them build. Icalia Labs treats AI skill as a core part of vetting, not an extra. As of 2026 it does not hire engineers who don't use AI in their daily work.

## The short answer

1. **Place the candidate on a ladder.** Copy-paste and autocomplete, vibe coding, AI-assisted, AI-augmented, agentic loops.
2. **Ask where the AI was wrong.** How they noticed, and how they fixed it.
3. **Ask what runs in production.** Which agents or loops cover testing, QA, pull requests or CI/CD, and what guardrails keep mistakes from repeating.
4. **Watch them build.** A live session of under 45 minutes with their own models, agents and skills.
5. **Keep it one gate among several.** Identity, history and depth checks still come first.

## The AI skill ladder

Most interviews ask "do you use AI?" The useful question is how far up the ladder the candidate works:

| Level | What it looks like |
|---|---|
| Copy-paste / autocomplete | Pastes into a chat window or accepts inline suggestions |
| Vibe coding | Prompts until something runs, with little review |
| AI-assisted | Uses AI inside the IDE or terminal, reviews and tests the output |
| AI-augmented | Uses AI across the cycle: tests, code review, documentation |
| Agentic loops | Runs agents or loops in production across testing, QA, PRs and CI/CD, with guardrails |

Icalia Labs' recruiting team groups candidates as beginner, intermediate, advanced or differential along this ladder. The framework is deliberately exploratory: it changes as the tools do.

## Five questions that separate the levels

1. **Daily use.** Terminal, IDE or copy-paste?
2. **When the AI was wrong.** What happened, how they caught it, what they changed.
3. **Testing and code review.** Where AI sits in their quality loop.
4. **Automations and agents.** What they have built to take repeat work off their plate.
5. **AI inside a product.** Have they shipped AI features beyond a chatbot?

The second question does the most work. In one recent Icalia Labs interview, the candidate who stood out described catching AI-generated database queries that would have deleted columns. That is the skill: knowing when the output is wrong. In the same interviews, most candidates had not yet put AI into a product beyond a chatbot, which is why the fifth question is a strong differentiator.

Two follow-ups matter for senior roles: which agents or loops the engineer runs in production, and how they set guardrails so the same error doesn't happen twice.

## Vibe coding is not a skill on its own

Vibe coding, prompting until something runs, can look fast in an interview. It is only a positive signal when the engineer is senior enough to review what the model produced. Without that judgment, speed turns into risk.

The risk is highest in regulated spaces. In [fintech](/industries/fintech.html), [healthtech](/industries/healthtech.html) and similar industries, an engineer touches sensitive data from the first week. Someone using AI on that data for the first time, without guardrails, is a compliance problem waiting to happen.

## Watch them build

Questions show how a candidate thinks about AI. A live build shows whether they can use it. JG, a YC founder, describes the format: a live interview where the candidate uses models and their own agents and skills to build a system in under 45 minutes, "that way I can see if they can really solve and build something."

Evaluators watch three things: whether it works, how the candidate plans, prompts and checks the output, and what they throw away.

## Fundamentals over years in a stack

With AI in the loop, engineering fundamentals may predict success better than years in one framework. A strong engineer with agents can pick up an unfamiliar stack quickly. This is still a judgment call, and some roles do need deep, version-specific experience, so Icalia Labs adjusts the weighting per engagement.

## Why it's still early

There is no settled industry standard for testing AI skill yet. Abraham Kuri, Icalia Labs' co-founder, says it is too early to name one. That is why AI evaluation sits inside a broader set of gates: fraud-aware screening against public work, a formal ID check before any client interview, a technical evaluation where AI-native ability is tested rather than assumed, a recorded English assessment, and a final hire-bar question. Fewer than 0.4% of applicants are accepted, as described in the [Talent Engine playbook](https://icalialabs.github.io/icalia-labs-services-deck/collateral/talent-engine.html).

## What to do next

If your engineers will work with agents every day, add the ladder, the "when was the AI wrong" question and a short live build to your loop. To see how vetted teams performed in production, read the [case studies](/case-studies.html), or [book a 30-minute call](/contact.html#book).
