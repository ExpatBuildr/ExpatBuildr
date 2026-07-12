# ExpatBuildr — Claude Rules

This file defines standing rules specific to this repo. See `~/.claude/CLAUDE.md` for workspace-wide rules, including the reminder about the pending draft batch release schedule.

---

## Article Publishing Cadence (Backdating Rule)

Every new article must slot into the publishing calendar at a natural 2–3 day cadence, alternating 2/3 articles per date. Never assign two articles the same date unless adjacent dates already make it look natural, and never more than 3 on the same date.

1. Find the last published (`draft: false`) article's `pubDate` that is on or before today's actual date — not a future-queued draft.
2. Continue the cadence forward from there.
3. New articles do not interact with the pending draft batch tracked in `~/.claude/CLAUDE.md` — they get the next open slot after all currently-scheduled dates (published or draft) are accounted for.
