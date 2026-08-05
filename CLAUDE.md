# ExpatBuildr — Claude Rules

This file defines standing rules specific to this repo. See `~/.claude/CLAUDE.md` for workspace-wide rules, including the reminder about the pending draft batch release schedule.

---

## Video Embed Matching

See `VIDEO-LIBRARY.md` — the registry of the user's YouTube videos and their blog article matches.

- **When writing or refreshing any blog article:** check `VIDEO-LIBRARY.md` for a topically-matching video before finishing. If one fits (Strong or Moderate), embed it or suggest it — don't skip this silently.
- **When the user shares a new video (title + link):** add it to `VIDEO-LIBRARY.md` under "Unmatched / needs review," then check it against the full blog for a fit, same as any other article-matching pass.
- Follow the matching rules and embed pattern documented at the bottom of `VIDEO-LIBRARY.md` — specificity over generality, one video per article, never force a sub-"Moderate" fit without flagging it, and flag any video whose title names a different brand/property before embedding it here.
- This is a permanent reference doc — do not delete it as the "current batch" gets embedded; keep adding to it as the channel grows.

---

## Article Publishing Cadence (Backdating Rule)

Every new article must slot into the publishing calendar at a natural 2–3 day cadence, alternating 2/3 articles per date. Never assign two articles the same date unless adjacent dates already make it look natural, and never more than 3 on the same date.

1. Find the last published (`draft: false`) article's `pubDate` that is on or before today's actual date — not a future-queued draft.
2. Continue the cadence forward from there.
3. New articles do not interact with the pending draft batch tracked in `~/.claude/CLAUDE.md` — they get the next open slot after all currently-scheduled dates (published or draft) are accounted for.
