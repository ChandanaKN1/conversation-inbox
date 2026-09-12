# Conversation Inbox

A triage inbox for CX agents to quickly find the customer conversation that needs them most, act on it, and move to the next one — built for Yellow.ai's Frontend Engineer Intern take-home.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Data is entirely mocked in the browser via [MSW](https://mswjs.io) — no backend required.

Other scripts: `npm run build` (type-check + production build), `npm run lint`, `npm run preview`.

## Product write-up

**The problem I focused on:** the brief describes agents "hunting" through a noisy queue and finding out about urgent conversations too late. The fastest way to fix that isn't more screens — it's making the *first three seconds* of looking at the queue tell the agent what to do. So the whole design centers on one screen: a list sorted by urgency, and a detail view that shows everything needed to act without navigating away.

**Key decisions:**
- **List + detail, not a table.** An agent scans names/snippets/priority in the list, clicks one, and gets full context on the right — no page navigation, nothing lost when switching between conversations.
- **Two data signals beyond priority:** `escalationReason` (angry customer / low CSAT / edge case) and `waitingSinceMinutes`. Priority alone doesn't explain *why* something needs a human or how stale it's gotten — these two fields do, cheaply.
- **The failed-action path is real, not decorative.** The mock resolve endpoint fails ~30% of the time; the UI checks the response and shows an inline retry message instead of silently succeeding or blocking the page with `alert()`.
- **Reply box is a visual affordance, not a feature.** Typed replies live in local component state only — there's no message-history data model to back a real thread, and building one wasn't worth the scope for this brief.

**Deliberate cuts:**
- No search/filtering — the sorted list is small enough that scanning it is faster than typing a query, for the scale this brief describes.
- No call button — these are async bot-escalated text conversations; a call action would have no data behind it and nothing for it to do, so it was left out entirely.
- No assign/snooze/bulk actions — the brief's core success bar is "know what to do first and act," not multi-agent workflow management.
- No AI-summary or CSAT/tier panels — the data model doesn't have them, and inventing fields to look impressive felt like the wrong instinct for a brief about sharp scoping.

## Architecture

```
src/
  types/conversation.ts       Conversation shape (single source of truth for the domain model)
  mocks/
    data.ts                   Seed conversations
    handlers.ts                MSW request handlers (GET list, PATCH resolve w/ simulated failure)
    browser.ts                 MSW worker setup
  icons/index.ts               Re-exports the lucide-react icons actually used, one import site
  components/
    ConversationList.tsx       Renders rows or the empty state
    ConversationItem.tsx       One row: name, snippet, priority badge, wait time
    ConversationDetail.tsx     Selected conversation: header, message bubble, resolve action, reply box
    SortDropdown.tsx           Custom-styled sort control
  App.tsx                      Owns all state (fetch, sort, selection, resolve, failure) and layout
```

State is plain `useState`/`useEffect` — no reducer, no context, no state library. `App.tsx` is the only component that talks to the mock API; everything below it is props-driven and stateless except for the reply box's own local draft text. This was a deliberate choice: the codebase needs to be easy to extend live, in front of an interviewer, without re-deriving how state flows through an abstraction layer first.

## Known limitations

- **Nothing persists.** Resolved status and typed replies live in memory only; a refresh resets everything to the seed data.
- **Single message per conversation.** The detail view is styled like a chat, but there's no message-history model — only one inbound message plus whatever the agent types in-session.
- **Sorting is priority + wait time only.** No manual drag-reordering, no saved views, no filtering by escalation reason.
- **No automated tests.** Given the time budget, effort went into interaction/edge-case coverage (loading, empty, error, failed-write states) rather than a test suite.
- Some non-functional npm audit output (`msw` postinstall script warning) shows on install — cosmetic, not a runtime issue.

## Time spent

Approximately _[fill in — e.g. "6-7 hours across two sessions"]_.
