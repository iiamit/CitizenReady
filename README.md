# CitizenReady

US Naturalization Civics Test Prep — a mobile-first progressive web app that helps applicants prepare for the USCIS civics interview using spaced repetition and structured lessons.

## Features

- **128 official questions** from USCIS Form M-1778 (09/25), organized into 13 categories
- **Spaced repetition flashcards** (SM-2 algorithm) — cards surface at the right time so you review what you need, not what you already know
- **Structured lessons** with context explanations, memory tips, and a knowledge check quiz after each category
- **State-aware answers** — senator, governor, and capital questions are personalized to your state
- **65/20 exemption mode** — filters to the 20 starred questions for applicants 65+ with 20+ years as a permanent resident
- **Readiness score** — weighted composite of lesson coverage, flashcard mastery, and quiz accuracy
- **Interview date pacing** — dashboard alert when your study pace won't cover the material in time
- **Dark mode** — light / dark / system theme
- **Offline-capable** — all data stored locally in IndexedDB; no account required
- **Live content updates** — checks a hosted endpoint for updated officials and question answers (configurable)

## Tech stack

Pure vanilla HTML/CSS/JavaScript — no build step, no framework, no bundler.

| Layer | Choice |
|---|---|
| Routing | Hash-based (`#dashboard`, `#lesson/category`, `#drill`, etc.) |
| Storage | IndexedDB via [idb](https://github.com/jakearchibald/idb) (CDN) |
| Fonts | Google Fonts (Playfair Display + Source Sans 3) |
| Confetti | canvas-confetti (lazy-loaded on session completion) |

## Project structure

```
CitizenReady/
├── index.html              # App shell + critical CSS
├── app.js                  # Router, nav, startup
├── style.css               # Full design system + component styles
├── data/
│   ├── questions-2025.js   # 128 USCIS civics questions
│   ├── state-data.js       # Governors, senators, capitals (all 50 states + territories)
│   ├── visuals.js          # Inline SVG diagrams for each lesson category
│   └── content-manifest.js # Bundled content version numbers
├── utils/
│   ├── db.js               # IndexedDB CRUD (settings, questions, categories, sessions)
│   ├── storage.js          # Merged data access + state-specific answer resolution
│   ├── srs.js              # SM-2 spaced repetition (gotit / almost / missed)
│   ├── scheduler.js        # Lesson category queue + mastery computation
│   ├── readiness.js        # Readiness score, streak, due card count
│   └── updater.js          # Background content update checker
└── views/
    ├── onboarding.js       # First-run setup flow
    ├── dashboard.js        # Home screen with readiness gauge and category grid
    ├── lesson.js           # Lesson flow: intro → cards → visual → knowledge check → summary
    ├── drill.js            # Flashcard drill with swipe gestures and SRS rating
    ├── progress.js         # Per-category mastery breakdown and weak card list
    └── settings.js         # State, exemption mode, theme, updates, data export/import/reset
```

## Running locally

The app uses ES modules and must be served over HTTP (not opened as a `file://` URL).

```bash
# Python (built-in)
python -m http.server 8080
# then open http://localhost:8080

# Node.js
npx serve .

# VS Code
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

## Data freshness

State officials (governors and senators) are current as of **April 2026**. USCIS occasionally updates the official answer list — verify at [uscis.gov/citizenship/testupdates](https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates) before any interview.

The live-update system (`utils/updater.js`) polls a configurable JSON endpoint (`UPDATE_ENDPOINT`) for newer question or officials data. Update that constant before deploying if you want to push refreshed content to users without a code deploy.

## Disclaimer

CitizenReady is an independent study tool. It is not affiliated with or endorsed by USCIS or the US government.
