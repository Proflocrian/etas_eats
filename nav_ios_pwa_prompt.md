# Research request: bottom nav "floats" above the home indicator in an iOS standalone PWA

I'm debugging a layout bug in a React PWA running on an **iPhone 15 simulator, iOS 27.0**.
I need you to research the root cause and the correct fix. You have web access - please
look up current (iOS 26/27-era) behaviour, since a lot of older StackOverflow advice is
stale. Give me a concrete, minimal fix and explain *why* it works.

---

## What I want

A full-bleed app: the background graphic should fill the entire screen (including behind
the status bar at the top and behind the home indicator at the bottom), and the **bottom
navigation bar's dark background should extend all the way to the very bottom edge of the
screen**, filling the home-indicator safe area. A reference mockup shows the nav flush with
the bottom edge.

## The bug

When added to the Home Screen and launched, the bottom nav bar does **not** reach the
bottom edge. There's a ~34px strip (the home-indicator safe area) **below** the nav bar.

Key observation that should narrow this down a lot:
- The app has a **fixed, full-screen background layer** (`position: fixed; inset: 0`) that
  paints the themed graphic. **This background layer DOES reach the true bottom edge** - the
  graphic is visible in that ~34px strip below the nav.
- But the **app's flex column (and therefore the nav, its last child) stops ~34px short of
  the bottom** - i.e. it only fills the "safe" viewport, not the full screen.
- So: `position: fixed; inset: 0` fills the real full screen here, but CSS height units
  (`height: 100%`, `100vh`, `100dvh`) all seem to resolve to the *safe* viewport (screen
  minus the home-indicator inset). The nav's `padding-bottom: env(safe-area-inset-bottom)`
  therefore just adds space *inside* the safe viewport instead of extending the nav into the
  home-indicator strip.

The top (status bar) side works: the graphic fills behind the status bar correctly. The
problem is specifically the bottom / home-indicator strip under the nav.

(Screenshots in the repo for reference: `screenshots/floating_nav.jpeg` and
`screenshots/cunty_calendar_view_installed_on_iphone.jpeg` show the cream/leopard strip
under the dark nav.)

## Possibly important clue: it may be a "bookmark", not an installed web app

When I long-press the Home Screen icon, the menu only shows **"Edit Home Screen",
"Share Bookmark", "Delete Bookmark"** - it says **Bookmark**, not App, and there's no
"uninstall"/"Delete App". This makes me suspect iOS did **not** register it as a true
standalone web app, and is treating it as a Safari bookmark/web-clip. I suspect this is
because the dev server is plain **HTTP** (see environment below), i.e. a non-secure context.

Please confirm/deny: on current iOS, does serving over plain HTTP (non-secure origin)
prevent "Add to Home Screen" from creating a real standalone web app, and instead create a
bookmark? And if so, does a bookmark/non-standalone web-clip handle `viewport-fit=cover`,
the safe-area `env()` insets, and `apple-mobile-web-app-status-bar-style=black-translucent`
**differently** from a true installed PWA - which would explain why the background fills the
screen but the height-based layout only gets the safe viewport?

(Note: despite the "bookmark" wording, the launched app shows **no Safari address bar** and
the graphic DOES go behind the status bar - so it IS displaying in some standalone-ish mode.
That's part of what's confusing.)

---

## Environment

- **Device:** iPhone 15 **simulator** (on a MacBook), **iOS 27.0** (very new / beta-era -
  please account for recent changes and possible simulator-specific bugs).
- **Hosting:** dev server via `npx vite --host` on a **Windows** PC, reached from the
  simulator over the LAN at **`http://192.168.2.101:5173/`** (plain HTTP, LAN IP, not
  localhost, not HTTPS).
- The Windows dev PC and the MacBook running the simulator are on the same network.
- Because it's HTTP on a LAN IP (non-secure context), the **service worker almost certainly
  does not register** (secure-context requirement), so there's no SW cache - changes reflect
  on relaunch.
- Intended production host: **GitHub Pages (HTTPS)**.

## Stack

- React 19 + TypeScript, **Vite** (v8-era), **Tailwind CSS v4**, **vite-plugin-pwa**.
- Single-page app, no router (navigation is React state).

---

## Relevant code / config (current state)

### `index.html` (head)

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
<meta name="theme-color" content="#e5556e" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Etas Eats" />
```

(Note: there is NO plain `<meta name="mobile-web-app-capable" content="yes">` - only the
`apple-` prefixed one. Does current iOS need/prefer the un-prefixed standard name now?)

### PWA manifest (generated by vite-plugin-pwa, `vite.config.ts`)

```js
manifest: {
  name: "Eta's Eats",
  short_name: "Eta's Eats",
  description: 'A personal food diary',
  theme_color: '#e5556e',
  background_color: '#fff8f3',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
}
// registerType: 'autoUpdate', devOptions: { enabled: true }
```

(Only a single **SVG** icon. Could the lack of a proper 192/512 PNG icon be why iOS treats
it as a bookmark rather than an installable app? Please check iOS's current requirements for
"Add to Home Screen" to create a real web app vs a bookmark.)

### `src/index.css` (the height-related rules)

```css
html,
body,
#root {
  height: 100%;
}
#root {
  height: 100dvh;
}

html,
body {
  overscroll-behavior: none;
}

body {
  margin: 0;
  background-color: var(--color-app-bg, #fff8f3);
}
```

### App shell (`src/App.tsx`, simplified)

```tsx
function App() {
  return (
    // Currently pinned with fixed/inset-0 (see "what I've tried").
    <div className="fixed inset-0 flex flex-col">
      {/* Fixed full-screen background layer - THIS reaches the true bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: -1, background: 'var(--app-bg-layer, transparent)' }}
      />
      <main className="min-h-0 flex-1 overflow-hidden">{/* active view */}</main>
      <BottomNav /> {/* last flex child - should sit at the bottom */}
    </div>
  )
}
```

### Bottom nav (`src/components/BottomNav.tsx`, simplified)

```tsx
<nav
  className="relative flex shrink-0"
  style={{
    background: 'var(--leopard-dark)', // themed; a dark print on this theme
    paddingBottom: 'env(safe-area-inset-bottom)', // meant to fill the home-indicator strip
  }}
>
  {/* 4 tab buttons, each min-h-[56px], flex-1, column layout */}
</nav>
```

Each view (e.g. the calendar) uses `paddingTop: env(safe-area-inset-top)` so content clears
the notch, and that part works.

---

## What I've already tried (none fixed the bottom strip)

1. `html, body, #root { height: 100% }` (original).
2. Added `#root { height: 100dvh }`.
3. Set the app container to `height: 100dvh` (`h-dvh`).
4. Set the app container to `position: fixed; inset: 0` (current) - reasoning: the fixed
   background layer already fills the full screen, so pinning the app the same way should
   make the nav reach the bottom. **It did not change anything.**

After each change I fully closed and relaunched the installed app (and reinstalled). No
change at all in the bottom strip.

---

## Questions I need answered

1. **Is the "bookmark vs app" distinction the real cause?** Does plain-HTTP / non-secure
   origin (or the single SVG icon, or a missing manifest requirement) make iOS create a
   *bookmark* instead of a standalone web app on "Add to Home Screen" - and does a bookmark
   handle the bottom safe-area / viewport height differently, such that `position:fixed`
   fills the screen but height units don't, leaving the nav short?
2. If so, **will hosting over HTTPS (e.g. GitHub Pages) fix it** by producing a true
   standalone install? Is there any way to reproduce/verify the "real app" behaviour without
   HTTPS (e.g. does the iOS simulator allow a secure-context exception, or can I serve HTTPS
   locally)?
3. Is this possibly an **iOS 27.0 simulator bug** specifically? Any known regressions with
   `env(safe-area-inset-bottom)`, `dvh`, or standalone home-indicator handling in iOS 26/27?
4. **What is the correct, current way** to make a full-screen PWA whose bottom bar fills the
   home-indicator safe area on modern iOS? Please give the canonical recipe (meta tags,
   manifest fields, CSS height strategy, safe-area usage) and a minimal nav/layout example
   that is known to work in 2025/2026-era iOS. Should the nav itself be `position: fixed;
   bottom: 0` with the content padded, rather than the last child of a flex column?
5. Do I need the un-prefixed `<meta name="mobile-web-app-capable" content="yes">` and/or
   proper 192×192 and 512×512 PNG icons in the manifest for iOS to install it as a real app?

Please research with web sources, then give me: (a) the most likely root cause, (b) the
concrete minimal change(s) to make, and (c) how to verify it (including whether I must deploy
to HTTPS to see the real behaviour). Thanks!
