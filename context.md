# Current Instructions:

Awesome - good job, everything seems to work very well! There's just a few tweaks, and I wanna do theme in batches like this; 

A couple tiny tweaks; 

- The glimmer animation on the cunty slected theme swatch, lets make it faster (not more frequent just faster)
- 

So the gernal UI changes; 

1. 
# Food Diary PWA — EtasEats

## Overview
We are making a personal food-diary web app (installable PWA) for a single user - my girlfriend, Greta, and this is a small birthday gift. 

It lets her record what she eats, when, and how much, review past entries on a calendar, and perform simple CRUD on each entry. There will be other features, but we'll get there later. 

Single known user. No multi-user, no auth, no accounts.

## Core Requirements
- **Free.** No paid hosting, no Apple Developer account, no paid services.
- **Offline-first.** All CRUD works with no network. Data lives on-device.
- **Target device:** iPhone 15, iOS Safari (comfortably past the 16.4 floor).
- **CRUD entries:** create / read / update / delete food entries.
- **Calendar UI:** calendar-style widget for entering and reviewing entries.
- **Nice UI:** polished, touch-friendly, respects iOS safe areas.
- **CSV export:** an export button produces a .csv of entries and opens the
  native iOS share sheet (Gmail, WhatsApp, etc.) to send it.
- **Notifications (phase 2):** twice-daily reminders (lunch, dinner). Deferred,
  see Notifications section.

## Constraints & Decisions
- **No native app.** Native iOS requires macOS + Xcode for build/sign, and free-provisioning installs expire after 7 days. Rejected. A PWA avoids Xcode, signing, the 7-day expiry, and lets development happen on Windows.
- **Install method:** host over HTTPS (GitHub Pages), open the URL in **Safari** (not Chrome on iOS — it can't create a standalone PWA), Share → Add to Home Screen. Installs as a full-screen home-screen app with offline support.
- **Updates:** after the first install she only relaunches the installed icon; she never reopens the Safari URL. Use `registerType: 'autoUpdate'`. Note a possible one-launch lag before a new build becomes active.
- **Storage eviction:** iOS may evict PWA storage after ~7 weeks of non-use. Daily use resets this, so it is a non-issue here. CSV export still serves as an occasional manual backup.

## Dev Environment & Workflow
- **Primary dev machine:** _This_ Windows PC (preferred — better specs). All coding and most testing happen here.
- **Secondary:** I do have a MacBook, which we can use for WebKit/Safari validation after big milestones.
- **Deploy:** push to GitHub, build, publish to GitHub Pages.

## Suggested Stack
- **Framework:** React + TypeScript, built with **Vite**.
- **PWA:** `vite-plugin-pwa` (service worker + web app manifest), configured `registerType: 'autoUpdate'`.
- **Local storage:** **IndexedDB** via **Dexie.js** (async wrapper, clean CRUD).
- **Calendar/date input:** `react-day-picker` for date selection; FullCalendar only if a full month-grid view is wanted (heavier).
- **CSV export:** generate a CSV Blob in-app, then **Web Share API** (`navigator.share` with a file) to trigger the native iOS share sheet.
- **Styling:** Tailwind CSS (v4, via `@tailwindcss/vite`). Keep it touch-first and mind iOS safe-area insets.
- **Hosting:** GitHub Pages (Cloudflare Pages / Netlify are equivalent fallbacks).

## Required Software based on Suggested Stack
- **Node.js** (current LTS) — runtime + npm.
- **A package manager** — pnpm (enabled via corepack).
- **Google Chrome** — primary dev/debug browser (DevTools device mode).
No Android Studio, no Xcode, no emulators needed. The MacBook only needs Safari.

## High-Level Architecture
- **Single-page app**, offline-first, no backend in phase 1.
- **Layers:**
  - *UI components* (calendar view, entry form, entry list, export button).
  - *Data access layer* — a Dexie wrapper exposing typed CRUD functions
    (`addEntry`, `getEntriesByDate`, `updateEntry`, `deleteEntry`, `getAllEntries`).
  - *Service worker* (via vite-plugin-pwa) — caches the app shell for offline
    launch and handles update lifecycle.
- **Data model — `Entry`:**
  - `id` (auto-increment number)
  - `date` (`DD-MM-YYYY`, calendar grouping key)
  - `entryType` (enum: breakfast/lunch/dinner/snack/drink)
  - `time` (required, `HH:MM`)
  - `food` (description)
  - `quantity` (optional, free text, e.g. "1 bowl", "200g")
  - optional: `notes`, `calories`
  - managed automatically: `createdAt`, `updatedAt`
- **Views:**
  - *Calendar view* — pick a day, see that day's entries.
  - *Entry editor* — create/edit a single entry (the CRUD form).
  - *Export* — serialise all entries to CSV, share via share sheet.

## Notifications (Phase 2 — deferred)
- iOS Web Push (16.4+) is **server-triggered**, not locally scheduled. There is no reliable browser API to fire a local notification at a fixed time while the PWA is closed.
- **Plan:** she grants notification permission once; capture her push subscription. A **GitHub Actions scheduled workflow** (cron) runs twice daily and sends pushes via the `web-push` library, subscription stored as a repo secret. Stays free; only a push token leaves the device, all diary data stays local.
- Reliability on iOS is decent but not guaranteed. Build and ship the app offline-first first; add this afterwards without architectural changes.

## Ground Rules

- **Plan first.** Produce a numbered step-by-step plan and present it before touching any file. Do not proceed until explicitly approved.
- **Ask questions upfront.** If anything about a feature or the codebase is unclear, ask before starting. Do not make assumptions on ambiguous points.
- **Permission before changes.** State what you intend to do and wait for explicit approval — even for small edits — unless inside an already-approved plan.
- **Small steps.** Implement and verify one step at a time. Do not make sweeping changes across multiple files at once.
- **No git operations.** Never commit, push, `git mv`, create branches, or do anything git-related. The user handles all of this.
- **No em-dashes in UI text.** Use a regular hyphen-dash (`-`) not an em-dash (`—`).
- **Token efficiency.** Read relevant files, and keep your output simple. 