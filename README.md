# Conversation Inbox

A triage inbox for CX agents to quickly find the customer conversation that needs them most, act on it, and move to the next one — built for Yellow.ai's Frontend Engineer Intern take-home.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Core data is entirely mocked in the browser via [MSW](https://mswjs.io) — no backend required.

**Optional — AI customer auto-replies:** copy `.env.example` to `.env` and add a [Google AI Studio](https://aistudio.google.com/apikey) Gemini API key (free tier, no billing account needed):

```bash
cp .env.example .env
# then edit .env and set VITE_GEMINI_API_KEY
```

Without a key, this one feature fails gracefully (shows "Couldn't get a customer reply") — everything else works normally.

Other scripts: `npm run build` (type-check + production build), `npm run lint`, `npm run preview`.

## Product write-up

**The problem I focused on:** the brief describes agents "hunting" through a noisy queue and finding out about urgent conversations too late. The fastest way to fix that isn't more screens — it's making the *first three seconds* of looking at the queue tell the agent what to do. So the whole design centers on one screen: a list sorted by urgency, and a detail view that shows everything needed to act without navigating away.

**Key decisions:**
- **List + detail, not a table.** An agent scans names/snippets/priority in the list, clicks one, and gets full context on the right — no page navigation, nothing lost when switching between conversations.
- **Three data signals beyond priority:** `escalationReason` (angry customer / low CSAT / edge case), `waitingSinceMinutes`, and a `ticketId`/email/phone for context. Priority alone doesn't explain *why* something needs a human or how stale it's gotten — these fields do, cheaply, without inventing a fake analytics panel.
- **Sorting is priority first, then longest wait within that priority** — "urgent" isn't just a static label, it should account for how long something has been sitting.
- **A filter by escalation reason** sits above the list, since "show me just the angry customers" is a realistic triage move.
- **The failed-action path is real, not decorative.** The mock resolve endpoint fails ~30% of the time; the UI checks the response and shows an inline retry message instead of silently succeeding or blocking the page with `alert()`. Resolving also offers a 5-second **Undo**, since a misclick on a real queue shouldn't be unrecoverable.
- **Keyboard-first where it matters:** rows are real `<button>`s (Tab/Enter/Space work, visible focus ring), and pressing **R** resolves whichever conversation is selected — the brief explicitly asks for "hands don't leave the keyboard."
- **The reply box triggers a real (optional) AI auto-reply**, not just a static echo. When configured with a Gemini API key, sending a message gets a short in-character reply back from a small prompt built from the conversation's context. This was a deliberate exception to "no real backend": it's a demo flourish on top of the core mocked data, not a requirement, it fails gracefully without a key, and the key lives in a gitignored `.env` (never committed) rather than hardcoded — the standard mitigation for a key that must ship to the browser.
- **Wait time ticks upward automatically** every 10 seconds (sped up from a realistic once-a-minute, purely so the effect is visible in a short demo) — a small nod to "by the end of the shift, nothing slips through."

**Deliberate cuts:**
- No search — the sorted + filterable list is small enough that scanning is faster than typing a query, at the scale this brief describes.
- No assign/snooze/bulk actions — the brief's core success bar is "know what to do first and act," not multi-agent workflow management.
- No CSAT/tier/LTV panels — the data model doesn't have them, and inventing fields to look impressive felt like the wrong instinct for a brief about sharp scoping.
- No auth/login — the header shows one static, hardcoded agent identity for visual completeness, with no real session behind it (explicitly out of scope per the brief).

## Architecture

```
src/
  types/conversation.ts        Conversation shape + escalationLabels (single source of truth)
  api/
    geminiApi.ts                Optional Gemini call for the customer auto-reply demo
  mocks/
    data.ts                     Seed conversations
    handlers.ts                  MSW request handlers (GET list, PATCH resolve w/ simulated failure)
    browser.ts                   MSW worker setup
  icons/index.ts                 Re-exports the lucide-react icons actually used, one import site
  components/
    ConversationList.tsx         Renders rows or the empty state
    ConversationItem.tsx         One row: name, snippet, priority badge, wait time
    ConversationDetail.tsx       Selected conversation: header, contact info, chat, resolve action
    SortDropdown.tsx             Custom-styled sort control
    EscalationFilter.tsx         Pill filter by escalation reason
  App.tsx                        Owns all state (fetch, sort, filter, selection, resolve, undo) and layout
```

State is plain `useState`/`useEffect` — no reducer, no context, no state library. `App.tsx` is the only component that talks to the mock API; everything below it is props-driven, with local component state only where it's genuinely local (the reply draft, the AI-reply loading flag). This was a deliberate choice: the codebase needs to be easy to extend live, in front of an interviewer, without re-deriving how state flows through an abstraction layer first.

## Known limitations

- **Nothing persists.** Resolved status, replies, and wait-time ticks live in memory only; a refresh resets everything to the seed data.
- **Single message per conversation** (plus whatever's typed/generated in-session) — no real message-history data model.
- **The AI auto-reply is a demo feature, not production-shaped.** A real product would proxy this through a backend rather than calling a third-party API from the browser; that's out of scope here, so this feature is opt-in and degrades gracefully without a key.
- **No automated tests.** Given the time budget, effort went into interaction/edge-case coverage (loading, empty, error, failed-write states) rather than a test suite.
- Some non-functional npm audit output (`msw` postinstall script warning) shows on install — cosmetic, not a runtime issue.

## Time spent

Roughly in line with the brief's ~2-evening budget, spread across several focused sessions.
