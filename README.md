# hugo-theme-pebble

[![Minimum Hugo Version](https://img.shields.io/static/v1?label=min-HUGO-version&message=%3E%3Dv0.147.1&color=blue&logo=hugo)](https://github.com/gohugoio/hugo/releases/tag/v0.147.1)
[![License](https://img.shields.io/github/license/debuginn/hugo-theme-pebble)](https://github.com/debuginn/hugo-theme-pebble/blob/main/LICENSE)
[![ExampleSite](https://img.shields.io/badge/exampleSite-included-2b7bff)](/Users/debuginn/Code/src/github.com/debuginn/hugo-theme-pebble/exampleSite)
[![Multilingual](https://img.shields.io/badge/i18n-supported-1f9d55)](/Users/debuginn/Code/src/github.com/debuginn/hugo-theme-pebble/README.md#i18n)

Pebble is a Hugo theme for product showcase sites with:

- a landing page homepage
- multilingual routing
- legal pages
- lightweight list/taxonomy templates

## Requirements

- Hugo `>= 0.147.1`
- A Hugo site that provides its own content, `i18n/`, assets, and configuration

## Install

Add the theme to your site:

```bash
git submodule add https://github.com/debuginn/hugo-theme-pebble themes/hugo-theme-pebble
```

Then enable it in your site config:

```toml
theme = "hugo-theme-pebble"
```

Run the bundled example site locally from the theme repository:

```bash
hugo server --source exampleSite --themesDir ../..
```

The bundled `exampleSite/` does not use a directory-per-language content layout such as `content/zh/_index.md`.
It keeps the sample setup smaller by using Hugo translation files like `content/_index.zh.md` and `content/privacy/_index.zh.md`.
Homepage `home` data is merged deeply across languages: the default language acts as the fallback, and a language-specific file only needs to override the fields or cards it wants to change.

Example:

- Put the full homepage config in `content/_index.md`
- Add `content/_index.zh.md`
- In `content/_index.zh.md`, you can override only:
  - `home.hero.title`
  - `home.hero.description`
  - `home.hero.cards`

If `home.hero.cards` is omitted in the translated file, the default-language cards are reused.
If `home.hero.cards` is present in the translated file, that language renders its own card list.

## Quick Start

Minimum working structure in the consuming site:

```text
content/
  _index.md
  _index.zh.md
  privacy/_index.md
  privacy/_index.zh.md
  terms/_index.md
  terms/_index.zh.md
i18n/
  en.json
  zh.json
static/
  assets/
    logo.png
    qr-download.png
    hero-fan/
      hero-1.png
      hero-2.png
      hero-3.png
      hero-4.png
      hero-5.png
hugo.toml
```

Example `hugo.toml`:

```toml
baseURL = "https://example.com/"
languageCode = "en-us"
title = "Pebble"
theme = "hugo-theme-pebble"
defaultContentLanguage = "en"

[params.i18n]
defaultLang = "en"

[params.assets]
brandName = "iAssets"
logo = "/assets/logo.png"
logoAlt = "iAssets logo"
downloadQr = "/assets/qr-download.png"
version = "example-1"

[params.contact]
email = "hello@example.com"

[params.analytics]
googleTagID = "G-XXXXXXXXXX"

[params.seo]
siteURL = "https://example.com"
defaultSocialTitle = "Pebble"

[params.pricing]
currency = "$"
yearly = "29"
lifetime = "99"

[params.copyright]
year = "2026"

[[languages.en.menu.main]]
identifier = "navFeatures"
url = "#features"
weight = 1

[[languages.en.menu.main]]
identifier = "navPricing"
url = "#pricing"
weight = 2

[[languages.en.menu.main]]
identifier = "navFaq"
url = "#faqs"
weight = 3

[[languages.en.menu.footer]]
identifier = "navTerms"
url = "/terms/"
weight = 1

[[languages.en.menu.footer]]
identifier = "navPrivacy"
url = "/privacy/"
weight = 2
```

Example `content/_index.md`:

```yaml
---
title: "Pebble"
description: "A demo site for the Pebble Hugo theme."
keywords: "hugo theme, landing page, multilingual"
home:
  hero:
    eyebrow: "Pebble"
    title: "A polished Hugo theme for product websites"
    description: "Pebble gives you a fast starting point for shipping a multilingual landing page with pricing, FAQ, legal pages, and lightweight content lists."
    fanImages:
      - src: "/assets/hero-fan/hero-1.png"
        alt: "Pebble screenshot 1"
      - src: "/assets/hero-fan/hero-2.png"
        alt: "Pebble screenshot 2"
    cards:
      - number: "01"
        title: "Fast setup"
        description: "Drop the theme into your site and drive the homepage from front matter."
        icon: "sparkles"
      - number: "02"
        title: "Multilingual"
        description: "Language-aware routes, menus, and legal pages are already wired."
        icon: "globe"
      - number: "03"
        title: "Low overhead"
        description: "Static assets stay cacheable and homepage copy renders at build time."
        icon: "bolt"
  features:
    eyebrow: "Features"
    title: "Built for app and product marketing pages"
    description: "The example stays small, but the content model is enough to exercise the main theme sections."
    items:
      - number: "01"
        title: "Homepage sections"
        description: "Hero, pricing, FAQ, and detail sections are controlled from a single file."
        icon: "layers"
    showcase:
      images:
        - src: "/assets/features-showcase-main.png"
          alt: "Pebble feature showcase main screenshot"
        - src: "/assets/hero-fan/hero-1.png"
          alt: "Pebble feature showcase secondary screenshot"
        - src: "/assets/hero-fan/hero-5.png"
          alt: "Pebble feature showcase supporting screenshot"
  details:
    eyebrow: "Details"
    title: "Small enough to understand, complete enough to ship"
    description: "This example intentionally uses a compact dataset while covering the theme's core UI paths."
    items:
      - title: "Flexible"
        description: "Mix and match sections."
        icon: "layers"
      - title: "Legal pages"
        description: "Privacy and terms pages share the same layout and translation keys."
        icon: "doc"
  download:
    eyebrow: "Download"
    title: "Use Pebble as your starting point"
    description: "Swap the placeholder copy and assets for your product and you are close to a production landing page."
    ctaHref: "https://apps.apple.com/"
    ctaOverline: "Get it on the"
    ctaTitle: "App Store"
    backdrop:
      columns: 4
      rotation: "-16deg"
      reverseEven: true
      durations: ["68s", "76s", "72s", "80s"]
      delays: ["0s", "-3s", "-8s", "-6s"]
      images:
        - src: "/assets/hero-fan/hero-1.png"
          alt: "Pebble download backdrop 1"
        - src: "/assets/hero-fan/hero-2.png"
          alt: "Pebble download backdrop 2"
  reviews:
    eyebrow: "Reviews"
    title: "People build better financial habits with iAssets."
    description: "From recording one item to understanding full trends."
  pricing:
    eyebrow: "Pricing"
    title: "Simple pricing"
    plans:
      - title: "Yearly"
        priceKey: "yearly"
        badge: "Popular"
        suffix: "/year"
        description: "Best for most users."
        cta:
          label: "Choose yearly"
          href: "#download"
      - title: "Lifetime"
        priceKey: "lifetime"
        featured: true
        description: "A one-time purchase for users who prefer permanent access."
        cta:
          highlight: true
          label: "Buy lifetime"
          href: "#download"
  trust:
    eyebrow: "TRUST"
    title: "Trusted by leading banks and finance platforms"
    description: "Partnering with well-known banks and securities platforms to build affordable software that is easy to understand and use."
  faq:
    eyebrow: "FAQ"
    title: "FAQ"
    items:
      - question: "Can I customize the content?"
        answer: "Yes. The homepage is driven by front matter."
---
```

Example translated homepage file:

```yaml
---
title: "Pebble"
description: "Pebble Hugo 主题的演示站点。"
keywords: "hugo 主题, 落地页, 多语言"
home:
  hero:
    eyebrow: "Pebble"
    title: "为产品官网准备的 Hugo 主题"
---
```

## Content Types

### Homepage

The homepage uses `content/_index.md` and reads section data from `.Params.home`.

### Legal Pages

Pebble expects these pages if you link them from the footer:

- `content/privacy/_index.md`
- `content/privacy/_index.zh.md`
- `content/terms/_index.md`
- `content/terms/_index.zh.md`

Example:

```yaml
---
title: "Privacy Policy"
pageKey: "privacy"
---
Your privacy content here.
```

`pageKey` is used with the translation keys `privacyEyebrow` and `termsEyebrow`.

### Section and Taxonomy Pages

The theme includes minimal templates for:

- section list pages
- taxonomy list pages
- taxonomy term pages

These are intentionally simple and reuse the theme's card styling.

## i18n

Pebble expects translation files in `i18n/<lang>.json`.

Use `i18n/` for UI copy and labels, and use Hugo translation content files for page-specific body content.
The example site intentionally does not use a directory-per-language content structure such as `content/zh/_index.md`.

Homepage data under `Params.home` is deep-merged per language, so translated files can override only the fields they need.

- If a translated file omits `home.hero.cards`, the default-language cards are reused.
- If a translated file provides `home.hero.cards`, that language renders its own card list.
- The same fallback behavior applies to nested sections such as `home.download.backdrop`.
- `home.features.showcase.images` follows the same rule: omit it to reuse the default-language screenshots, or define it per language to show different feature screenshots.
- Older content that still uses `home.features.showcase: true` remains supported and falls back to the built-in default screenshots.

Minimum English example:

```json
{
  "brand": { "other": "Pebble" },
  "footerTag": { "other": "Product showcase theme" },
  "navFeatures": { "other": "Features" },
  "navPricing": { "other": "Pricing" },
  "navFaq": { "other": "FAQ" },
  "navDownload": { "other": "Download" },
  "navTerms": { "other": "Terms" },
  "navPrivacy": { "other": "Privacy" },
  "downloadHint": { "other": "Scan to preview the install flow" },
  "legalUpdated": { "other": "Last updated" },
  "privacyEyebrow": { "other": "Privacy" },
  "termsEyebrow": { "other": "Terms" }
}
```

Supported language route keys in the theme:

- `en`
- `zh`
- `tw`
- `hk`
- `mo`
- `sg`
- `ja`
- `ko`

`params.i18n.defaultLang` controls which language maps to `/`.

## Parameters

### `params.assets`

- `brandName`: brand name used in metadata and UI
- `logo`: logo URL
- `logoAlt`: logo alt text
- `downloadQr`: QR image shown in the footer
- `version`: optional static asset version string appended to `/styles.css` and `/app.js`

### `params.contact`

- `email`: used by trust section mailto buttons when `type = "mailto"`

### `params.social`

Optional social/contact links for the footer and profile area. Unset values are not rendered.

- `wechatQr`
- `x`
- `telegram`
- `xiaohongshu`
- `weibo`
- `zhihu`

### `params.analytics`

- `googleTagID`: optional Google tag ID. No analytics script is emitted when unset.

### `params.seo`

- `siteURL`: absolute site URL used for canonical and hreflang URLs
- `defaultSocialTitle`: fallback Open Graph / Twitter title

### `params.pricing`

- `currency`
- `yearly`
- `lifetime`

These values are referenced by homepage pricing plans through `priceKey`.

## Menus

Pebble reads:

- `menu.main`
- `menu.footer`

For in-page homepage links, use fragment URLs like `#features` or `#download`. The theme expands them to the current language root automatically.

## Notes

- This theme does not ship content, images, or translation files beyond the theme code itself.
- A runnable demo lives in `exampleSite/`, and the current demo uses iAssets sample branding and assets.
- Google Fonts are loaded from `fonts.googleapis.com` and `fonts.gstatic.com`.
- Homepage copy is rendered at build time. The client-side script handles theme preference, menu toggles, language preference storage, and marquee behavior.

## Included

- `layouts/`
- `static/app.js`
- `static/styles.css`
