# Icalia Labs Developer Resources — Open Source, SDKs & MCP Servers

> Icalia Labs developer resources: Sepomex (open REST + MCP API), the official Ruby SDK, our engineering guides, and open-source Claude agent skills.

Icalia Labs Developer Resources

# We ship code.  
Some of it is  
public.

Icalia Labs engineers maintain open-source APIs, SDKs, agent skills, and the engineering guides we use internally. Everything below is real, versioned, and linked to its source.

[View github.com/IcaliaLabs →](https://github.com/IcaliaLabs) [Read llms.txt](/llms.txt)

Flagship · REST + MCP API

## Sepomex

The open REST and MCP API for Mexico's postal codes. Every zip code, state, municipality, city, and settlement — one bundled SQLite database, no API key, no rate limit.

As of v1.0.0, Sepomex also exposes its data to AI agents directly through the **Model Context Protocol** — over Streamable HTTP (`/mcp`) and stdio (`bin/mcp`).

[Source on GitHub →](https://github.com/IcaliaLabs/sepomex)

REST endpoint

GET /api/v1/zip\_codes?zip\_code=64000

MCP server

Streamable HTTP at `/mcp`, or stdio via `bin/mcp`.

Hosted instance

sepomex.kurenn.dev

License

MIT · ~154k settlements bundled, zero external dependencies.

More from Icalia Labs

## SDKs, skills,  
and how we build.

[

Official SDK

### icalia-sdk-ruby

The official Icalia SDK for Ruby, with event and webhook primitives. Apache-2.0.

](https://github.com/IcaliaLabs/icalia-sdk-ruby)[

Claude Agent Skill

### identity-verification-skill

Open-source, Claude-powered identity verification for remote hiring across the US and LatAm. MIT licensed.

](https://github.com/IcaliaLabs/identity-verification-skill)[

Engineering guides

### guides

The set of rules we use internally at Icalia Labs to build better software.

](https://github.com/IcaliaLabs/guides)

68+ repositories total, 5,000+ cumulative GitHub stars. See the full list at [github.com/IcaliaLabs](https://github.com/IcaliaLabs).

For agents & crawlers

## Machine-readable resources.

[

/llms.txt

Structured summary of Icalia Labs for AI agents, including when-to-use guidance.

](/llms.txt)[

/sitemap.xml

Full index of every page on icalialabs.com.

](/sitemap.xml)[

/robots.txt

Crawler rules and sitemap pointer.

](/robots.txt)[

Sepomex /mcp

Live MCP server for Mexican postal-code data.

](https://github.com/IcaliaLabs/sepomex)

## Want engineers who ship code like this?

The same engineers who maintain these repos are available to embed directly into your team.

[Find engineers for your team →](contact.html#book) [See open roles](careers.html)
