# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

**Prerequisites:** Hugo >= 0.147.1

**Local preview** (uses the bundled example site):
```bash
hugo server --source exampleSite --themesDir ../..
```

There is no build step, transpiler, or package manager. This is a pure Hugo theme.

## Architecture

This is a Hugo theme for product marketing/landing pages. The key areas are:

### Templates (`layouts/`)
- `_default/baseof.html` — Master layout. Handles all SEO (hreflang, Open Graph, JSON-LD, canonical), theme preference detection, language auto-redirect logic, header/footer, and Google Analytics.
- `index.html` — Homepage template rendering all sections (hero, features, details, download, reviews, pricing, FAQ, trust logos).
- `partials/lang-meta.html` — Maps Hugo language codes to 8 supported languages (`en`, `zh`, `tw`, `hk`, `mo`, `sg`, `ja`, `ko`) with their HTML lang, OG locale, and JSON-LD variants.
- `partials/runtime-config.html` — Injects a JavaScript config object containing language routing maps used by `app.js`.
- `partials/icon.html` — SVG sprite library (20+ icons). Add new icons here.
- `partials/config-icon.html` — Resolves icon names from content frontmatter to SVG names.
- `partials/home-data.html` — Preprocesses homepage section data from frontmatter before rendering.

### Static Assets (`static/`)
- `app.js` — All client-side behavior: dark/light theme toggle (localStorage), language switching and auto-detection, mobile menu, hero fan card interactions, WeChat QR modal.
- `styles.css` — All styles using CSS custom properties. Dark mode via `.dark` class on `<html>`. No preprocessor.

### Content Model
Homepage content is defined entirely in frontmatter under `.Params.home` in `content/_index.md`. Multilingual variants (e.g., `_index.zh.md`) only need to override changed strings. Legal pages live under `content/privacy/` and `content/terms/`.

### i18n
Translation strings are in `exampleSite/i18n/{lang}.json` (13 UI keys). These are UI chrome only; page content comes from frontmatter.

### Configuration Parameters
Key `[params]` blocks in `hugo.toml`:
- `[params.assets]` — `brandName`, `logo`, `logoAlt`, `downloadQr`, `version` (for cache busting)
- `[params.social]` — `wechatQr`, `x`, `telegram`, `xiaohongshu`, `weibo`, `zhihu`
- `[params.pricing]` — `currency`, `yearly`, `lifetime`
- `[params.analytics]` — `googleTagID`
- `[params.seo]` — `siteURL`, `defaultSocialTitle`
- `[params.i18n]` — `defaultLang`

## Multilingual System
Language detection runs client-side in `app.js` using `navigator.language`. The `runtime-config.html` partial generates a JS map of language codes → URL prefixes, which `app.js` uses to redirect users on first visit. The `lang-meta.html` partial ensures correct `<html lang>`, `hreflang` links, and OG locale for all 8 supported variants.
