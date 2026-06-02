# Getting FocusFlow onto your Android phone

This folder is an **install-ready web app**. Because of an Android security rule,
the "Add to Home screen / Install" option only appears when the app is opened from a
real web address (`https://…`), not when opened as a local file. So the one required
step is to put this folder online first — it's free and takes a few minutes.

You have two goals to choose from:
- **A) Install it like an app** (recommended for testing) — no APK needed.
- **B) Generate a real .apk file** — for sideloading or a future Play Store listing.

---

## Step 1 (required for both): Put the folder online

The easiest option is **Netlify Drop** — no account needed, no build step.

1. On a computer, go to **https://app.netlify.com/drop**
2. Drag this **entire folder** (the one containing `index.html`, `manifest.webmanifest`,
   `sw.js`, and the three icon files) onto the page.
3. Netlify gives you a live link like `https://your-app-name.netlify.app`.
   That link is your app.

(Other free hosts work too: GitHub Pages, Cloudflare Pages, Vercel. Any of them is fine —
the only requirement is that the files end up at an `https://` address.)

> Keep all the files together in one folder. The app needs `index.html`,
> `manifest.webmanifest`, `sw.js`, and the icons side by side.

---

## Option A: Install it like an app (easiest)

1. On your Android phone, open **Chrome** and go to your new `https://…` link.
2. Tap the **⋮ menu** (top-right) → **Add to Home screen** (it may say **Install**).
   - This option now appears because the app is served over `https`, has an icon,
     a web manifest, and a service worker — everything Chrome needs to treat it as
     an installable app.
3. Confirm. FocusFlow lands on your home screen and in your app drawer, launches
   full-screen with its own icon, and works offline after the first load.

That's it — no APK required, and updates are as simple as re-uploading the folder.

---

## Option B: Generate a real .apk with PWABuilder

1. On a computer, go to **https://www.pwabuilder.com**
2. Paste your `https://…` link and click **Start**.
3. It analyzes the app (manifest + service worker are already included here).
4. Choose **Android** → **Generate Package**.
5. Download the package. It contains a signed **.apk / .aab** plus instructions.
6. Transfer the `.apk` to your phone and open it to sideload
   (you may need to allow "Install unknown apps" for your file manager or Chrome).

This is also the starting point if you later want to publish to the Google Play Store.

---

## What's in this folder

| File | Purpose |
|------|---------|
| `index.html` | The whole app (single file, works offline) |
| `manifest.webmanifest` | App name, colors, icons — makes it installable |
| `sw.js` | Service worker — offline caching + installability |
| `icon-192.png`, `icon-512.png` | App icons |
| `icon-maskable-512.png` | Adaptive icon for Android |

## Language
The app opens in **English** by default. To switch to **Korean (한국어)**:
**Menu (☰) → Settings → Language → 한국어.** You can switch back any time.

## A note on data
This is a front-end prototype: accounts, posts, and progress live in the phone's
memory for the session and are **not yet saved to a server**. Closing the app resets
demo data. Real accounts, saved history, and notifications come with the backend later.
