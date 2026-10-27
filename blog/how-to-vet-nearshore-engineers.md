# How to Vet Nearshore Engineers in the AI Era — Icalia Labs Blog

> How AI-amplified hiring fraud works, and the layered checks US engineering leaders can use to confirm a remote engineer is real, senior and a fit.

1.  [Home](/)
2.  /
3.  [Blog](/blog/)
4.  /
5.  [Nearshore Hiring](/blog/topics/nearshore-hiring.html)

[Nearshore Hiring](/blog/topics/nearshore-hiring.html) [Forward-Deployed Engineering (FDE)](/blog/topics/forward-deployed-engineer.html) [AI Engineering](/blog/topics/ai-engineering.html)

# How to Vet Nearshore Engineers in the AI Era

How AI-amplified hiring fraud works, and the layered checks US engineering leaders can use to confirm a remote engineer is real, senior and a fit.

![Eduardo Lopez De Leon](/assets/eduardo-lopez.webp)

Eduardo Lopez De Leon · Co-Founder & CEO

October 27, 2026 · 8 min read

![Diagram of five vetting layers for remote engineers: identity, history, technical depth, AI skill in a live build, and in-person contact for critical roles.](/assets/blog/vet-nearshore-engineers-cover.webp)

## Key takeaways

-   Vetting a remote engineer in 2026 starts with proving the person is real and did the work they claim, because AI makes a polished fake profile cheap to produce.
-   Fintech know-your-customer (KYC) practice gives hiring teams a ready model: layered checks on documents, face match, history consistency and payment details, where no single check is trusted alone.
-   Fabricated profiles fail structured technical conversations because depth collapses when an interviewer takes one project three levels down.
-   AI skill is best tested by watching a candidate build a small working system with their own models and agents, not by asking which tools they use.
-   In-person interviews are returning for critical roles because they confirm identity, presence and team fit in a way video cannot.

Vetting a nearshore engineer in 2026 means proving two things before anything else: the person is who they say they are, and they did the work they claim. AI has made both cheaper to fake. The fix is layered, and most of the layers already exist in fintech: identity checks borrowed from know-your-customer programs, a structured technical conversation that tests depth, a live build with the candidate's own AI tooling, and in-person contact for critical roles.

## The short answer

1.  **Verify identity before any client interview.** A formal ID check plus a face match on video.
2.  **Cross-check history.** The résumé, LinkedIn, GitHub and public work should tell the same story.
3.  **Take one project three levels deep.** Real engineers get more specific under follow-up questions; fabricated ones get vaguer.
4.  **Watch them build with AI.** A short live build with their own models and agents shows judgment that a tools questionnaire cannot.
5.  **Meet critical hires in person.** Identity, presence and team fit are easier to read in the same room.

## Why remote hiring fraud got cheaper

Remote hiring fraud is not new. In June 2022 the FBI's Internet Crime Complaint Center [warned](https://www.ic3.gov/PSA/2022/PSA220628) that deepfakes and stolen personal data were being used to apply for remote roles in "information technology and computer programming, database, and software related job functions," noting that some positions "include access to customer PII, financial data, corporate IT databases and/or proprietary information."

What changed is the cost. Generative AI writes a convincing résumé in seconds, fills a matching LinkedIn profile and coaches a candidate through a first call. In July 2025, [Gartner predicted](https://www.gartner.com/en/newsroom/press-releases/2025-07-31-gartner-survey-shows-just-26-percent-of-job-applicants-trust-ai-will-fairly-evaluate-them) that by 2028 one in four candidate profiles worldwide will be fake. In the same release, 6% of 3,000 surveyed candidates admitted to interview fraud, either impersonating someone else or having someone impersonate them.

The tools now work live, on camera. Real-time face swaps can put a different face on a candidate during a video interview, and Jennifer Jackman, D.C. managing partner at the law firm Ice Miller, told [Federal News Network](https://federalnewsnetwork.com/workforce/2026/07/organizations-are-discovering-the-remote-worker-they-hired-might-not-be-the-one-doing-the-work/) in July 2026 that some candidates are "actually getting everything from AI in real time" during interviews.

Simple checks still catch some of it. In a recording shared widely in February 2025, Dawid Moczadło, co-founder of Vidoc Security Lab, asked a job candidate to wave a hand in front of his face, a move that makes many real-time face filters glitch. The candidate refused, and Moczadło ended the call, as [The Register reported](https://www.theregister.com/2025/02/11/it_worker_scam).

Icalia Labs sees the same pattern in its own queue. A single engineering job post draws 600 to 700 applications. Since May 2026, the recruiting team has blocked or reported more than 100 fake profiles, including accounts only a few months old claiming up to 14 years of experience.

![Three figures from Icalia Labs recruiting in 2026: 600 to 700 applications per engineering job post, more than 100 fake profiles blocked or reported since May, and fewer than 0.4% of applicants accepted at the senior+ bar.](/assets/blog/vet-nearshore-engineers-screening-numbers.webp)

The stakes are higher in regulated spaces. In [fintech](/industries/fintech.html), [healthtech](/industries/healthtech.html) and [logistics](/industries/logistics.html), as well as aviation, airspace and mobility, an engineer often touches customer data, payment flows or safety-relevant systems in the first weeks. As Jackman put it, "It stops from being a workplace productivity issue to more of who's gotten access to your data." Gartner's Jamie Kohn makes the same point: "Candidate fraud creates cybersecurity risks that can be far more serious than making a bad hire."

## Know your workforce: borrow the KYC playbook

Know your customer (KYC) is the identity-verification practice banks and fintechs run before they open an account. Its central idea transfers directly to hiring: no single check is trusted on its own, and each layer catches what the previous one misses.

Layer

What it checks

What it catches

Document

Government ID format and check digits (for example RFC and CURP in Mexico, NIT in Colombia, CUIT/CUIL in Argentina)

Invented or mistyped identities

Face match

The person on video matches the ID

Proxies and stand-ins on calls

History consistency

Profile age, public work and GitHub commit timezones line up with the résumé

Recently created or borrowed profiles

Payment details

Account holder name matches the ID; payment destination country matches the stated location

Identities used by someone else

Behavior over time

Interview notes match the document packet; first-week video and equipment delivery

Swaps after the offer

Icalia Labs published this approach as an open-source, MIT-licensed [identity-verification skill](https://github.com/IcaliaLabs/identity-verification-skill) for teams hiring remote engineers across the US and Latin America. It splits the work between AI review stages and human stages, and it is explicit about its limits: "A well-forged document will pass." It does not replace a dedicated ID-verification vendor, Form I-9 or E-Verify, or an interviewer's judgment. That honesty is the point. Layers exist because each one fails sometimes.

Layers also keep the process fair to real candidates. A single red flag is a reason to check the next layer, not a verdict. Jackman's advice to employers is the same: "you don't want to just make the assumption that there's fraud."

In Icalia Labs' own process, 100% of candidates pass a formal ID check through an international verification vendor before any client-facing interview, as described in the [Talent Engine playbook](https://icalialabs.github.io/icalia-labs-services-deck/collateral/talent-engine.html).

## What a real vetting conversation looks like

Identity checks confirm the person exists. A structured conversation confirms the experience is theirs. Eduardo Lopez De Leon, Icalia Labs' co-founder and CEO, uses a seven-step structure for screening calls:

1.  **Set the frame.** Who is on the call, what will be confirmed and what happens next. He opens with "I'm not a recruiter, I'm a software engineer," which sets up an honest technical conversation.
2.  **Confirm the profile against reality.** Current role, languages and frameworks, and how time is really split between full-time and freelance work.
3.  **Go deep on one project.** What the software does, who uses it, then architecture, integrations, authentication and what was hard.
4.  **Probe practices by name.** Unit and integration tests, deployment, how the candidate understands a problem before writing code.
5.  **Check ownership.** US companies hiring in the region often need engineers who can take a project and develop it with little hand-holding, which is why most ask for at least 3 to 4 years of end-to-end experience.
6.  **Ask about direction.** What the candidate wants to get better at.
7.  **Close honestly.** Specific feedback, a request for evidence such as an updated résumé, and a dated next step.

The structure does two jobs. It catches fabricated profiles, because depth collapses under the third follow-up question. And it rewards honesty: a candidate who says "I haven't worked with that" is easier to trust than one who claims everything. As Lopez De Leon puts it, "the programming language is just a tool"; the fundamentals underneath are what get tested.

**A five-line checklist for any screening call**

-   One project, three levels deep.
-   Ask about practices (tests, deploys) by name.
-   Confirm every claim with a document or artifact.
-   Treat an admitted gap as signal, not a disqualifier.
-   Close with specific feedback and a dated next step.

## Testing AI skill: watch them build

Most AI questions in interviews ask about tools. That tests vocabulary. The more useful test is a live build. JG, a YC founder, runs a live session where the candidate uses models plus their own agents and skills to build a small system in under 45 minutes, "that way I can see if they can really solve and build something."

Evaluators watch three things: whether the result works, how the candidate plans, prompts and checks the output, and what they reject. The last one matters most. Agents are fast at writing code and just as fast at writing the wrong code, so the senior signal is knowing when to stop and fix the system around the agent.

Before the build, Icalia Labs places each candidate on an AI skill ladder, from copy-paste and autocomplete through vibe coding, AI-assisted and AI-augmented work, up to agentic loops running in production with guardrails. The question that separates the levels fastest is when the AI was wrong and how the candidate caught it.

This is still an open field. Abraham Kuri, Icalia Labs' co-founder, says it is too early to name a settled standard for evaluating AI skill. A live build is one gate among several, not a replacement for the identity and depth checks above.

## In-person interviews are back for critical roles

Video made remote hiring fast. It also made it easier to fake. Icalia Labs has brought in-person interviews back in specific cases, to corroborate identity, read body language, and check the energy and fit between the engineer and the team. It encourages the same for critical roles, both in client engagements and in its own hiring. Icalia Labs is not alone: after two AI-generated candidates reached its interviews, Vidoc Security now flies candidates in for a paid, one-day in-person interview, [CBS News reported](https://www.cbsnews.com/news/fake-job-seekers-flooding-market-artificial-intelligence/).

For a US company, this is where nearshore has a structural edge. An engineer in Monterrey is a short flight from Austin and works in the same time zone, so meeting in person before a critical hire is a trip, not an expedition.

## Vet for the hire who stays

Fraud is the loudest risk, but the more common one is a real, skilled engineer who leaves in six months. In conversations Lopez De Leon has had with engineers across Latin America hired remotely by US and Canadian companies, including a North American digital agency and a large US tech company, the same retention factors came up again and again:

-   **Core work.** Building the product with real users, not maintenance on the side.
-   **Equal treatment.** The same kind of work and the same standards as the home-country team.
-   **Remote-first, not remote-tolerated.** Strong written documentation and decisions that do not happen in a hallway the remote engineer is not in.
-   **An environment that makes shipping safe.** Layered tests and validation give engineers the confidence to change production systems, the same principle behind [review loops that make agents finish their work](/blog/ai-code-review-agents-teaching-ai-to-finish.html).
-   **Visible growth.** Growth plans with an objective reviewer outside the team.

What pushes engineers out is just as consistent: sustained overload with no sign anyone cares about burnout, and return-to-office mandates. Vetting for fit means asking whether the team on the other side offers these conditions, not only whether the engineer meets the bar.

This is also why forward deployed engineering changes the vetting question. Nearshore forward deployed engineers are senior engineers in Latin America, time-zone aligned with US teams, embedded in the client's team and accountable for production outcomes. When the engineer is embedded, fit with that specific team carries as much weight as the résumé.

## Five questions to ask any nearshore partner

1.  **When is identity verified?** Before or after the candidate reaches your interview?
2.  **How is work history cross-checked?** Against which public sources, and with what tooling?
3.  **How is AI skill tested?** A live build, or a questionnaire?
4.  **What share of applicants is accepted?** At Icalia Labs it is fewer than 0.4%, at a senior+ bar.
5.  **Can you meet the engineer in person for a critical role?** And how fast?

A partner that answers all five with specifics has done the work. One that answers with adjectives has not.

For the US side of the process, from hiring models to benefits that are law in Mexico, see [how to hire software engineers in Mexico](/blog/how-to-hire-software-engineers-in-mexico.html). To see how vetted teams performed in production, read the [case studies](/case-studies.html), or [book a 30-minute call](/contact.html#book) to talk through a critical role.

## Frequently asked questions

### How common is fake candidate fraud in remote engineering hiring?

Gartner predicted in July 2025 that by 2028 one in four candidate profiles worldwide will be fake, and 6% of 3,000 candidates it surveyed admitted to interview fraud. Icalia Labs' recruiting team has blocked or reported more than 100 fake profiles since May 2026, out of 600 to 700 applications per engineering job post.

### What is KYC, and how does it apply to hiring engineers?

Know your customer (KYC) is the identity-verification practice banks and fintechs use before opening an account. Applied to hiring, it means layered checks on government ID, a live face match, consistency of work history and payment details before a candidate reaches a client.

### How do you test a nearshore engineer's AI skills?

Ask the candidate to build a small working system live, in under 45 minutes, using their own models, agents and skills. Evaluators watch whether it works, how the candidate plans and checks the output, and what they reject.

### Are in-person interviews necessary for nearshore engineers?

Not for every role, but they are back for critical ones. Meeting in person confirms identity, shows body language and tests the energy and fit between the engineer and the team.

### What should a US company ask a nearshore partner about vetting?

Ask when identity is verified (before or after the client interview), how work history is cross-checked, how AI skill is tested, what share of applicants is accepted, and whether in-person contact is available for critical roles.

![Eduardo Lopez De Leon](/assets/eduardo-lopez.webp)

Written by

Eduardo Lopez De Leon · Co-Founder & CEO

Strategy, brand presence, and partnership development at Icalia Labs. Startup and corporate experience. YC Founder.

[LinkedIn](https://www.linkedin.com/in/elopezdeleon/) [X](https://x.com/edolopez) [GitHub](https://github.com/edolopez)

## Related reading

[

![](/assets/blog/dev-loop-seven-step-loop.jpg)

October 20, 2026

### AI Code Review Agents: Teaching AI to Finish Its Work

Why AI coding agents ship code that only looks ready, and how a seven-step review loop led by senior engineers gets work to finished.

Agentic Engineering

](/blog/ai-code-review-agents-teaching-ai-to-finish.html)[

![](/assets/blog/blur-1853305.webp)

September 15, 2026

### AI-Augmented Engineering Teams: What Buyers Pay For

Every engineering partner says it uses AI. Three metrics, five questions and the review standard that separate delivery outcomes from AI hype.

AI Engineering

](/blog/ai-augmented-engineering-teams.html)[

![](/assets/blog/img_4661.webp)

September 29, 2026

### Rails World 2026: From Software Writers to Makers

Notes from Rails World 2026 in Austin: what DHH, Matz and Rails engineers said about AI, and why software writers are becoming software makers.

AI Engineering

](/blog/rails-world-2026-software-writers-to-makers.html)

## Need engineers who already ship like this?

We embed senior nearshore engineers directly into your team — same time zone, same standards, no ramp-up theater.

[Book a discovery call →](/contact.html#book) [See our case studies](/case-studies.html)
