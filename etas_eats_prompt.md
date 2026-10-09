# EtasEats - install flier (design brief for Claude Design)

## What I want
A single-page **portrait promo flier** for **EtasEats**, recreated in the visual
**style** of the classic Uber Eats "Crave it? Get it." promo poster (attached as
reference), but as an **original design** with EtasEats branding and copy. Recreate the
*look and layout*, not Uber's or Apple's actual logos/badge art - draw original
equivalents.

## Context (so the copy makes sense)
EtasEats is a personal, offline-first **food & symptom diary** - a birthday gift for my
girlfriend (nicknamed Eta/Greta), who has **GERD**. She logs what she eats, what she
does, and when she feels unwell, then reviews what happened just before a symptom to
spot likely **triggers**. It's an installable **PWA** (not a real App Store app):
installed from the browser via Share -> Add to Home Screen, runs full-screen and
offline. Its default theme is a deliberate **Uber-Eats-style look**: white / black /
green `#06C167`, font **Figtree**. Tone: clean and product-flier-like, with a small
warm/loving touch (it's a gift).

## Format
- Portrait flier, ~3:4 (A4-ish / poster). High-resolution, print-friendly.

## Layout (match the reference's structure)
**Top ~40% - illustrated food scene on warm orange**
- A flat, geometric **vector illustration**, overhead/top-down, of a cozy home meal
  spread (e.g. a plate of pasta, a couple of small side dishes, scattered herbs, a
  drink) on a warm **orange** background (around `#F2662F`). Same flat, bold,
  minimal-shading illustration style as the reference. Make it original artwork.

**Bottom ~60% - green panel (`#06C167`)**, black text (Figtree):
- **Headline**, very large and bold, two lines:
  > Eat it?
  > Track it.
- **Subheadline** (1-2 lines, regular weight):
  > That's right - log every meal, snack and symptom in your own private diary, and
  > finally spot what's been setting off your tummy. 💚
- **"How to install:"** (bold label) followed by a numbered list:
  1. Scan the QR code (or open the link) in **Safari** on your iPhone.
  2. Tap the **Share** button, then **"Add to Home Screen."**
  3. Open **EtasEats** from your home screen - it runs full-screen and offline.
  4. Enter your voucher code **`GRETAS-BDAY`** to unlock the app. 💜
  (Make step 4 - the voucher code - clearly the final, celebratory step.)

**Footer row**
- Bottom-left: an **App-Store-style "download" badge** (original black rounded-rectangle
  badge, generic version - not Apple's actual artwork), and **immediately to its right a
  scannable QR code** that encodes the install URL **`https://proflocrian.github.io/etas_eats`**,
  with a tiny caption like "Scan to install". The QR is the real way to install, since
  it's a PWA. (A Google-Play-style badge can sit alongside to balance the row like the
  reference, but it's optional.)
- Bottom-right: the **"Etas Eats" wordmark**, stacked on two lines like the reference's
  corner mark:
  > Etas
  > Eats
  in black, bold Figtree. (Optionally tint "Eats" the green `#06C167` if it still reads
  well on the green panel; otherwise keep it black.)

## Palette & type
- Green `#06C167` (panel), warm orange ~`#F2662F` (top), black `#111`, white.
- Typeface: **Figtree** (bold for the headline and wordmark, regular for body).

## Do / Don't
- Do: original illustration, original badge artwork, EtasEats name and wordmark.
- Don't: reproduce the Uber Eats logo/wordmark or Apple's official App Store badge -
  create original equivalents in a similar spirit.

---
**Note for me (Dyllan):** the live PWA URL is `https://proflocrian.github.io/etas_eats`
(GitHub Pages - no `www`), so that's what the QR should encode so it actually resolves.
