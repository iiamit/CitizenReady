# CitizenReady

US Naturalization Civics Test Prep — a mobile-first progressive web app (and native iOS/Android app via Capacitor) that helps applicants prepare for the USCIS civics interview using spaced repetition and structured lessons.

**Live app:** https://iiamit.github.io/CitizenReady/

## Features

- **128 official questions** from USCIS Form M-1778 (09/25), organized into 13 categories
- **Spaced repetition flashcards** (SM-2 algorithm) — cards surface at the right time, with weak-area priority so harder cards come first
- **Structured lessons** with context explanations, memory tips, and a knowledge check quiz after each category
- **Audio playback** — official USCIS pronunciation audio for each question
- **State-aware answers** — senator, governor, and capital questions personalized to your state
- **65/20 exemption mode** — filters to the 20 starred questions for applicants 65+ with 20+ years as a permanent resident
- **Readiness score** — weighted composite of lesson coverage, flashcard mastery, and quiz accuracy
- **Interview date pacing** — dashboard alert when your study pace won't cover material in time
- **Dark mode** — light / dark / system theme
- **Offline-capable PWA** — installs to home screen, works without internet
- **Native iOS & Android** — built with Capacitor; haptic feedback, local notifications, native share sheet
- **Spanish language support** — full i18n with English and Spanish locales
- **Cloud sync** (optional) — Supabase-backed progress sync across devices

## Tech stack

| Layer | Choice |
|---|---|
| Build | [Vite](https://vitejs.dev/) with vite-plugin-pwa (Workbox service worker) |
| Native | [Capacitor 6](https://capacitorjs.com/) for iOS and Android |
| Routing | Hash-based (`#dashboard`, `#lesson/category`, `#drill`, etc.) |
| Storage | IndexedDB via [idb](https://github.com/jakearchibald/idb) (npm) |
| Cloud sync | [Supabase](https://supabase.com/) (optional, env-var gated) |
| Fonts | Google Fonts — Playfair Display + Source Sans 3 |

## Project structure

```
CitizenReady/
├── index.html              # App shell + critical CSS
├── app.js                  # Router, nav, startup, Capacitor init
├── style.css               # Design system + component styles + safe area CSS
├── vite.config.js          # Vite + PWA plugin config
├── capacitor.config.json   # Capacitor native app config
├── data/
│   ├── questions-2025.js   # 128 USCIS civics questions
│   ├── state-data.js       # Governors, senators, capitals (all 50 states)
│   ├── visuals.js          # Inline SVG diagrams per lesson category
│   ├── content-manifest.js # Bundled content version numbers
│   └── audio-manifest.js   # USCIS MP3 audio URLs per question
├── i18n/
│   ├── en.js               # English strings (~160 keys)
│   └── es.js               # Spanish strings
├── utils/
│   ├── db.js               # IndexedDB CRUD (settings, questions, categories, sessions)
│   ├── storage.js          # Merged data access + state-specific answer resolution
│   ├── srs.js              # SM-2 spaced repetition
│   ├── scheduler.js        # Lesson queue, mastery, weighted card queue
│   ├── readiness.js        # Readiness score, streak, due card count
│   ├── updater.js          # Background content update checker
│   ├── platform.js         # isCapacitor / isIOS / isAndroid / isWeb helpers
│   ├── notifications.js    # Local notifications (Capacitor)
│   ├── scorecard.js        # Canvas score card generator + native share
│   ├── sync.js             # Supabase cloud sync (push/pull/merge)
│   └── i18n.js             # t() translation helper + locale loader
├── views/
│   ├── onboarding.js       # First-run setup flow
│   ├── dashboard.js        # Home screen — readiness gauge, category grid, PWA install banner
│   ├── lesson.js           # Lesson flow: intro → cards → visual → knowledge check → summary
│   ├── drill.js            # Flashcard drill with SRS rating and haptics
│   ├── progress.js         # Per-category mastery breakdown, weak card list, share score
│   ├── settings.js         # State, theme, reminders, language, account, export/import
│   └── auth.js             # Supabase sign in / sign up / sync UI
├── resources/
│   └── icon.svg            # Source app icon (used to generate all native icon sizes)
└── scripts/
    └── generate-icons.mjs  # Generates PNG icons for PWA and native apps via sharp
```

## Running locally

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# → open http://localhost:5173

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npx vite preview
```

## Native app builds

Requires [Xcode](https://developer.apple.com/xcode/) (iOS) and [Android Studio](https://developer.android.com/studio) (Android), plus [CocoaPods](https://cocoapods.org/) for iOS.

```bash
# Build web assets + sync to native projects
npm run cap:sync

# Open in Xcode (iOS)
npm run cap:ios

# Open in Android Studio (Android)
npm run cap:android
```

## Cloud sync (optional)

Create a Supabase project and apply `supabase/schema.sql`. Then add a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If these variables are not set, the app runs entirely offline with no change in behavior.

## Data freshness

State officials (governors and senators) are current as of **April 2026**. USCIS occasionally updates the official answer list — verify at [uscis.gov/citizenship/testupdates](https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates) before any interview.

## Disclaimer

CitizenReady is an independent study tool. It is not affiliated with or endorsed by USCIS or the US government.
