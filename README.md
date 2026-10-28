# Notes-first recap

A redesign of Fellow's post-meeting recap, built as a design-engineer work sample.

**Live demo:** https://fellow-demo-humayun-khans-projects.vercel.app

## The problem

Open a completed meeting in Fellow today and the recap leads with a full-viewport video player. The AI Note, the summary, decisions, action items, and topic breakdown, is pushed below the fold. The hierarchy is inverted: the raw recording is primary, and the distilled note, the reason you opened a past meeting, is secondary.

But the dominant job of a meeting assistant is async catch-up: *what happened, what did we decide, what do I owe?* That job is answered by the notes, not the footage.

## The fix

Make the recap notes-first. The AI note leads; the recording demotes to a supporting role you summon on demand.

The recording's entire footprint at rest is a **topic-segmented timeline ribbon**: proportional segments for each topic, amber dots for decisions, hollow dots for action items. It is a table of contents, a scrubber, and a decision/action heatmap at once, and it proves "this document is wired to a recording" without a single frame of video on screen.

Everything is timestamp-linked. Click any summary line, decision, action item, or topic bullet and a compact player spawns at that moment. Two markers ride the ribbon at once: a solid playback head and a hollow reading-position marker, so where you're reading and where playback is are two separate truths.

### What's in it

- **Notes-first layout** — digest ("N owed by you") → summary → decisions → action items → topics
- **Timeline ribbon** — proportional topic segments, decision/action markers, dual playback + reading markers, hover-to-light, click-to-jump
- **Timestamp-linked everything** — every note line is a play button; inline context disclosure expands the surrounding transcript lines in place, so most verification never spawns the player
- **Interactive action items** — Mine/All, check-to-done with collapse and a live counter, "owed by you" filter, assignee + due, and an honest pushed-to-Jira vs local-only indicator
- **On-demand player** — draggable PiP with a live caption, scrubber, speed, and an opt-in "follow along" that syncs the notes to playback
- **Copy digest** — clean plain-text TL;DR + decisions + your action items, for pasting into Slack or email
- **Accessible** — keyboard throughout (Space, `[`/`]`, `j`/`k`/`x`, `?`), roving tabs, focus-managed dialog, AA contrast, reduced-motion, SR-friendly ribbon
- **Light + dark**, responsive to phone width

### Keyboard

`Space` play/pause · `[` / `]` previous/next timestamp · `j` / `k` move between action items · `x` toggle done · `?` shortcuts

## Design process

Direction was chosen via a judge-panel exploration: five layout approaches, scored by three independent judges (a design-systems lens, a hiring-manager lens, a design-engineer lens), then synthesized into one build spec. The build was then put through an adversarial review across accessibility, timeline correctness, visual craft, and code quality; every finding was independently verified, and 20 were applied.

## Stack

Vite + React 19 + TypeScript. No backend, no real video: playback is a simulated clock so the focus stays on the wiring. All state (triage, theme) is local, wrapped for private-mode safety.

```sh
pnpm install
pnpm dev      # local
pnpm build    # -> dist/
```

## Notes

This is an independent concept, not affiliated with or endorsed by Fellow. The meeting content is fabricated sample data. Built by [Humayun Khan](https://humayun.xyz).
