# Bookie Beats Companion

A lightweight, cross‑browser extension that enhances user experience on prediction‑market websites — starting with **Kalshi.com**.

- ✅ Adds small, helpful interface improvements
- ✅ Runs fully in the browser — no server required
- ✅ **Cross-browser compatible** — works in Chrome, Firefox, Edge, Safari, and more

> **Not affiliated with Kalshi or any platform.** This project is **source‑available, not OSI "open source."** See [License](#license).

---

## 🚀 Installation

### Quick Download & Install

**Latest Version**: [📦 Download from Releases](../../releases/latest)

**Chrome, Edge, Brave, Opera:**

1. Download `chrome-extension-build.zip` from the latest release
2. Unzip the file on your computer
3. Go to `chrome://extensions/` and enable **Developer mode**
4. Click **Load unpacked** and select the unzipped folder
5. Visit kalshi.com - you should see the BB Companion badge!

**Firefox:**

1. Download `firefox-extension-build.zip` from the latest release
2. Unzip the file on your computer
3. Go to `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on...** and select `manifest.json` from the unzipped folder
5. Visit kalshi.com - you should see the BB Companion badge!

> **Note**: Firefox temporary add-ons are removed when you close the browser.

**Alternative**: You can also download from the [dist branch](../../tree/dist) for the latest build.

---

## 🧩 Supported Sites

| Site       | Status       |
| ---------- | ------------ |
| Kalshi     | ✅ Supported |
| Polymarket | 🚧 Planned   |

---

## 🌐 Cross-Browser Support

This extension is designed to work across all major browsers:

| Browser | Status          | Notes                                |
| ------- | --------------- | ------------------------------------ |
| Chrome  | ✅ Full Support | Manifest V3                          |
| Firefox | ✅ Full Support | Uses Mozilla's webextension-polyfill |
| Edge    | ✅ Full Support | Chromium-based                       |
| Brave   | ✅ Full Support | Chromium-based                       |
| Opera   | ✅ Full Support | Chromium-based                       |
| Safari  | 🚧 Planned      | Requires additional manifest         |

---

# 🧑‍💻 Build From Source (optional)

Only needed if you want to change the code.

### Requirements

- Node 24+
- npm

### Commands

```bash
npm install
npm run build     # one-time build to dist/
# or
npm run watch     # rebuild automatically on save
npm run dev       # same as watch mode
```

Then load the folder again as "unpacked" in your browser (see Quick Install).

---

## 🔐 License

This project is **source‑available** under a custom license that allows:

- ✅ Personal use
- ✅ Professional (self‑directed) use, including profit from trading/wagering
- ✅ Local modification and noncommercial sharing

It prohibits:

- ❌ Commercial redistribution or hosting
- ❌ Embedding into competing products/services
- ❌ Rebranding by competitors

**Commercial use is possible only with prior written permission.**  
See full terms in [LICENSE](./LICENSE).

---

## 🤝 Contributing

We welcome improvements and site adapters. See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for how to run the project and open PRs.

---

## 🔒 Security & Privacy

- 🔐 **[Security Policy](./SECURITY.md)** - How to report vulnerabilities
- 🛡️ **[Privacy Policy](./PRIVACY.md)** - What data we collect (spoiler: none!)
- ✅ **No external servers** - Everything runs locally in your browser
- ✅ **Open source** - Fully auditable code
