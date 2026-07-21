---
title: "How to Use Clay for Personalized Outreach at Scale"
description: "Clay is the most powerful personalization tool in cold outreach. Here's how to build lead lists, enrich data, and write emails that feel 1-to-1 at scale."
pubDate: 2026-05-26
author: "ExpatBuildr"
pillarId: "lead-generation"
category: "Automation"
gated: true
tags: ["Lead Generation", "Cold Outreach", "Automation"]
ogImage: "/images/lead-gen.jpg"
heroImage: "/images/lead-gen.jpg"
canonicalUrl: "https://expatbuildr.com/blog/lead-generation/how-to-use-clay-personalized-outreach-at-scale"
primaryKeyword: "how to use Clay for personalized outreach at scale"
secondaryKeywords: ["Clay.com outreach", "Clay lead enrichment", "personalized cold email at scale", "Clay AI email writing", "Clay outreach automation"]
searchIntent: "informational"
draft: false
archived: false
noindex: false
---

Clay is the tool that changed how serious outbound teams approach personalization. Before Clay, personalized cold outreach at scale meant either hiring researchers to manually write custom openers or using mail merge tokens that fooled nobody. Clay makes it possible to build a list of 500 prospects, enrich each one with real research signals, and generate a genuinely personalized first line for every single email — automatically, in under an hour.

This guide covers how Clay actually works, how to set up your first table, and how to integrate it into a complete outreach system.

---

## What Clay Does That Nothing Else Does

Clay is a spreadsheet-like tool that connects to over 75 data sources — LinkedIn, Apollo, Hunter, Clearbit, Google, company websites, news APIs, and more — and lets you query them all from a single table. Each row is a prospect. Each column pulls a different piece of data about that prospect from whichever source has it.

The power is in the combination. Instead of choosing between LinkedIn data or Apollo data or your own scraped data, Clay waterfalls across all of them — trying each source in sequence until it finds a value, then moving on. This dramatically improves data coverage and reduces the cost of enrichment compared to running every source simultaneously.

On top of the enrichment layer, Clay has a built-in AI column that lets you write a prompt once and run it across every row. That prompt can use any of the enriched data points as variables — company name, recent news, LinkedIn headline, job posting language, website copy — to generate a personalized email opener, a custom pain point hypothesis, or a tailored value proposition for every prospect in your list.

---

## Setting Up Your First Clay Table

Getting started in Clay requires a few decisions upfront that will determine how useful your table is.

**Step 1: Define your data inputs**

Start with a seed list. Clay can ingest:
- A CSV of company names or domains
- A LinkedIn Sales Navigator export
- An Apollo search export
- A manual list you build inside Clay using its search tools

For most outreach use cases, start with a LinkedIn Sales Navigator search exported to CSV. This gives you company name, contact name, role, and LinkedIn URL — enough to kick off enrichment.

**Step 2: Enrich contact email addresses**

LinkedIn data does not include email addresses. You need to waterfall across email finding tools to get them. A standard Clay waterfall for email enrichment runs in this order:
1. Hunter.io — best for domain-based email patterns
2. Apollo.io — large database, strong for US companies
3. Prospeo or Dropcontact — good backup sources
4. LinkedIn email finder integrations

Set the column to stop when it finds a valid email and move to the next row. This keeps costs down by not running every source for every prospect.

**Step 3: Pull research signals for personalization**

This is where Clay earns its reputation. Columns you can pull automatically per prospect:

- **LinkedIn headline and summary:** What they say about themselves and their role
- **Recent LinkedIn posts:** What topics they are publicly engaged with
- **Company news:** Recent press, funding announcements, product launches, hiring sprees
- **Job postings:** What roles the company is actively hiring for — a strong buying signal
- **Website copy:** Specific language from their homepage or about page
- **Tech stack:** What tools they are already using (via BuiltWith or Clearbit)

Each of these becomes a variable available to your AI column.

**Step 4: Write your AI prompt**

The AI column in Clay takes a prompt and runs it for every row using that row's data. A well-written prompt produces a personalized opener that would be impossible to distinguish from a manually researched email.

Example prompt structure:

"You are a cold email expert writing a personalized opening line for a B2B outreach email. The recipient is {{contact_name}}, {{role}} at {{company_name}}. Here is their LinkedIn headline: {{linkedin_headline}}. Here is a recent company development: {{company_news}}. Write a single sentence (maximum 20 words) that references something specific about them or their company and opens a natural conversation about [your specific value proposition]. Do not mention [your company name]. Do not use generic phrases like 'I came across your profile.' Be direct and human."

Run this across 500 rows and you have 500 genuinely different opening lines in under five minutes.

---

## Integrating Clay With Your Sending Tool

Clay does not send emails. It builds the enriched, personalized list that feeds into your sending tool. The integration workflow:

1. Build and enrich your Clay table
2. Export to CSV once the personalization column is complete
3. Import into Instantly, Smartlead, or your sending tool of choice
4. Map the personalized opener column to the first-line variable in your email template
5. The sending tool fires the sequence, inserting the custom opener for each prospect

This gives you the deliverability infrastructure of your sending tool with the personalization depth of Clay — the combination that produces reply rates significantly above the industry average.

---

## Clay Pricing and When It Makes Sense

Clay operates on a credit system. Every data lookup costs credits. The free tier gives you 100 credits per month — enough to experiment but not enough to run real volume. Paid plans start at around $149 per month for the Starter tier, which covers meaningful enrichment volume for a solo outreach operation.

Clay makes financial sense when:
- You are sending more than 200 personalized emails per month
- Your current reply rate is under 5 percent and you believe personalization is the bottleneck
- You have a clear, defined ICP and a research signal that maps to a genuine pain point

It does not make sense when:
- You have not validated your messaging with manual personalization first
- Your lead list quality is low — enriching a bad list produces a well-enriched bad list
- Your sending infrastructure is not set up correctly — deliverability problems kill Clay's impact before personalization matters

---

## What Clay Cannot Fix

Clay is a personalization tool. It is not a messaging tool, a positioning tool, or a delivery tool. Common mistakes:

**Using Clay to scale a bad offer.**

Before running Clay at scale, make sure your email copy is already working. [LinkedIn Outreach Sequences That Actually Get Replies](/blog/lead-generation/linkedin-outreach-sequences-that-get-replies) covers how to test and validate your messaging across a lower-stakes channel before committing Clay credits to it. If your value proposition does not resonate in a manually personalized email, it will not resonate at scale. Test your messaging with 20 to 30 hand-crafted emails before automating.

**Treating AI openers as finished copy.** Clay's AI output is a first draft. Review a sample of your generated openers before sending. AI occasionally produces openers that are technically correct but tonally off, factually wrong, or awkwardly constructed.

**Skipping deliverability setup.** A Clay-enriched list sent from a cold, unwarmed domain lands in spam. The sequence is: deliverability infrastructure first, list quality second, personalization third.

If you want a complete outreach system built around Clay, Instantly, and a structured pipeline — not just the tool knowledge but the full working infrastructure — that is exactly what the automation systems at ExpatBuildr deliver. [See how it works](/automation-systems/automate).

---

## Summary

Clay is the most powerful personalization layer available for cold outreach right now. It connects to 75 plus data sources, lets you waterfall enrichment to maximize coverage and minimize cost, and runs AI-generated personalized openers across your entire prospect list automatically. Integrated with a sending tool like Instantly or Smartlead, it produces the personalization depth of manual research at the speed of automation.

The prerequisite is a validated offer, a clean lead list, and proper deliverability infrastructure. Clay multiplies what is already working — it does not create something out of nothing.

For the full lead generation system, visit the [Lead Generation hub](/blog/lead-generation).

[Get the weekly intel — join the free newsletter](/newsletter)

---

## References

- Clay. (2025). *Platform Documentation and Use Cases*. Clay.com.
- Instantly.ai. (2025). *Integration Guide: Clay and Instantly*. Instantly.ai.
- Apollo.io. (2025). *Data Enrichment API Documentation*. Apollo.io.
- Smartlead. (2025). *Cold Email Deliverability and Personalization Guide*. Smartlead.ai.
