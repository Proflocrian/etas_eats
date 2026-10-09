# Current Instructions:

Awesome - good job, everything seems to work very well then assuming it'll look good on her iPhone! 

One final tweak on the cunty theme first; the glimmer animation on the cunty selected theme swatch, lets make it faster (not more frequent just faster) - then I think we're done for individual themes!

So the general UI changes; 

1. On the triggers page, I want to be able to swipe between the tabs (like the calendar view). Ofc, this time you'll only be able to swipe one way (and only once), ie if youre on the Last Symptoms page you can only swipe "left" to the Triggers List and vv. 
2. An important one! When a EntryForm / EntryDetailsSheet is open, currently the back button goes to the previous page - it should actually close the EntryForm / EntryDetailsSheet. 
3. On the CalendarView, when there are two months in the current period eg `Sep - Oct 26`, lets condense this to `Sep-Oct 26`; also lets make that font size just a _bit_ smaller; literally by 1-2 units. 
4. Also for the CalendarView, lets make the day font style be the same as the numbers, eg `MON` should look the same as the `8` or whatever. 

---

Fantastic - all great changes, good job.

Now I hope this is possible, it'll ruin a lot of the aesthetic if not. 

But how do I get the app to be "full page" and have the background graphics properly integrate into the top of the phone. Eg see `screenshots/current_cunty_calendar_view` (this is from my simulated iphone) vs `screenshots/mu_cunty_calendar_view.png` - do you see how the top of the app fully integrates into the phone's view (ie the leopard print takes up the top of the screen too)?

Is this something that will only happen when we actually "install" the PWA onto the iphone?

---

Okay cool, thanks for the details. Can we also do the same for Android if we havent already. 

I installed the app on the iPhone simulator (Share → Add to Home Screen), however there's a few weird quirks going on, see `screenshots\cunty_calendar_view_installed_on_iphone.jpeg`. 

- It seems the top of our app gets blurry
- The bottom nav is kind of floating

Any idea how to fix this?

Also if we do make changes (and I'm hosting the app through the command `npx vite --host` on my dev PC, a windows), then installed the app on the iPhone simulator (on a MacBook on the same network as my dev PC), where the iPhone installed from `http://192.168.2.101:5173/ `. So if we make changes to codebase here, will those changes reflected on the "installed" app on the phone?

---

Next thing is, a few small changes at once, for the BottomNav; 

- Lets remove the text from the icons (lets just keep the emoji)
- Slightly bigger change lets rename the `TriggersView` -> `AnalysisView`, updating any variable /file names where appropriate, likewise, lets swap out the emoji for this one `🔬`
- Lets add a new page, called `TrackerView`, with the emoji `📋`
- Let's make the whole NavBar slightly smaller (in terms of height)

---

The 11:11 theme has a "highlighted" column in the CalendarGrid for today, none of the other themes do - can you make it across all themes and make this a themePalette colour (eg `todayCalendarHighlightColour` or whatever) that gets used generically - hence, you might even need to rewrite a little bit of the 11:11 theme to make that work like the rest too. For the other themes, come up with the colour yourself using common sense. 

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