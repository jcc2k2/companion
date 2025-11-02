# Contributing to Bookie Beats Companion

Thanks for your interest in improving BookTo add another site in the future:

1. Create `src/sites/<site>/index.ts` and `src/sites/<site>/<site>.css`
2. Add a new `content_scripts` block in `manifest.json` with the correct `matches`
3. Update `vite.config.ts`:
   - Add the new site's `index.ts` to the `input` object
   - Copy the site's CSS in the `viteStaticCopy` targets

## 🌐 Cross-Browser Compatibility

The extension uses Mozilla's official [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) to handle differences between:

- Chrome's `chrome.*` APIs
- Firefox's `browser.*` APIs (which return promises)

When adding new browser API usage, always import from `./lib/browser.js` which wraps the polyfill for consistent usage across browsers.s Companion! This guide explains how to run the project locally, make changes, and open pull requests.

---

## 🛠 Requirements

- Node 24+
- npm
- A Chromium browser (Chrome, Edge, Brave) or Firefox Developer Edition

No backend is required.

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Build once:

```bash
npm run build
```

Or build on every save:

```bash
npm run watch
```

The compiled output goes to `dist/`.

---

## ▶️ Load the Extension for Local Dev

### Chrome / Edge / Brave / Opera

1. In one terminal, run `npm run watch` (optional, but recommended).
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the repo folder.
5. Visit `https://kalshi.com/` and confirm the badge is visible.

When files rebuild, refreshing the tab is usually enough. If you add new manifest entries, remove and re-add the unpacked extension.

### Firefox (Dev Edition)

1. Run `npm run build` (or `watch`).
2. Visit `about:debugging#/runtime/this-firefox`
3. **Load Temporary Add-on…** → pick `manifest.json`
4. Navigate to `https://kalshi.com/`

> The extension now includes cross-browser compatibility, so the same build works for both Chrome and Firefox.

---

## 🗂 Code Organization

```
src/
  background.ts
  lib/
    browser.ts                  # Mozilla webextension-polyfill wrapper
    messaging.ts
    utils.ts
  sites/
    kalshi/
      index.ts
      kalshi.css
  popup/
    popup.html
    popup.ts
    popup.css
  options/
    options.html
    options.ts
    options.css
dist/
```

To add another site in the future:

1. Create `src/sites/<site>/index.ts` and `src/sites/<site>/<site>.css`
2. Add a new `content_scripts` block in `manifest.json` with the correct `matches`
3. Update `esbuild.config.mjs`:
   - Add the new site’s `index.ts` to `entryPoints`
   - Copy the site’s CSS in `copyStatic()`

---

## ✅ Coding Conventions

- TypeScript only
- Content scripts are **read‑only** (no automated trading; no outbound data collection)
- Prefer Shadow DOM for injected UI to avoid CSS collisions
- Keep per‑site logic in `src/sites/<site>`
- Keep utilities reusable in `src/lib`

---

## 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feat/<short-description>
   ```
3. Commit with clear messages and small, focused changes
4. Push your branch and open a PR against `main`
5. In the PR description, include:
   - What changed and why
   - Screenshots/GIFs if UI‑related
   - Any risks or assumptions

PRs will be reviewed for safety, correctness, scope, and UX quality.

---

## 🔐 License Reminder

This project is **source‑available** (not OSI open source). Personal and professional (self‑directed) use is permitted, but **commercial redistribution or embedding in competing products/services is prohibited** unless you obtain explicit written permission from Bookie Beats.

By contributing, you agree your contributions are licensed under the project’s license.

---

## 💬 Help

Open an Issue or Discussion in GitHub if you have questions.
