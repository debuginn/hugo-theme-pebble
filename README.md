<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="images/logo/pebble-dark.svg"><img src="images/logo/pebble-light.svg" alt="Pebble logo" width="120"></picture></p>

# hugo-theme-pebble

[![Minimum Hugo Version](https://img.shields.io/static/v1?label=min-HUGO-version&message=%3E%3Dv0.147.1&color=blue&logo=hugo)](https://github.com/gohugoio/hugo/releases/tag/v0.147.1)
[![License](https://img.shields.io/github/license/debuginn/hugo-theme-pebble)](https://github.com/debuginn/hugo-theme-pebble/blob/main/LICENSE)
[![ExampleSite](https://img.shields.io/badge/exampleSite-included-2b7bff)](exampleSite)
[![Multilingual](https://img.shields.io/badge/i18n-supported-1f9d55)](#i18n)

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
brandName = "Your App"
logo = "/assets/logo.png"
logoAlt = "Your app logo"
downloadQr = "/assets/qr-download.png"
version = "example-1"

[params.contact]
email = "hello@example.com"

[params.analytics]
googleTagID = "G-XXXXXXXXXX"

[params.seo]
siteURL = "https://example.com"
defaultSocialTitle = "Pebble"
# noindex = false
# appleAppID = "1234567890"

[params.fonts]
# provider = "google" # google (default), custom, or none
# cssURL = "https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"

# [params.colors.light]
# primary = "#1f4f86"
# secondary = "#237380"
# onPrimary = "#ffffff"
# [params.colors.dark]
# primary = "#5bb5c4"
# secondary = "#7cc8d4"
# onPrimary = "#0a1220"

[params.pricing]
currency = "$"
currencyCode = "USD"
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
    title: "People build better financial habits with your app."
    description: "From recording one item to understanding full trends."
  pricing:
    eyebrow: "Pricing"
    title: "Simple pricing"
    disclaimer: "* Prices vary by region and promotions. The actual price shown in the app download flow applies."
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
- `logoDark`: optional logo used when the theme is dark. When unset, `logo` is used in both modes.
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

Use `params.social.icons` to override footer icon URLs without changing the links.
Supported keys are `wechat`, `x`, `telegram`, `xiaohongshu`, `weibo`, and `zhihu`.
Local paths such as `/assets/social/wechat.svg` are supported; omitted keys retain
the theme's existing default icons.

### `params.analytics`

- `googleTagID`: optional Google tag ID. No analytics script is emitted when unset.

### `params.seo`

- `siteURL`: absolute origin used to prefix root-relative social and JSON-LD image URLs. Falls back to `baseURL` when unset. Canonical, `og:url`, hreflang, and the robots.txt sitemap URL use the page permalink, so they include the `baseURL` host. The 404 page omits canonical, `og:url`, and hreflang.
- `defaultSocialTitle`: fallback Open Graph / Twitter title
- `noindex`: optional, default `false`. When `true`, every page emits `<meta name="robots" content="noindex,nofollow" />`. When `false` or unset, pages keep `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`. The 404 page always emits `noindex,follow`.
- `appleAppID`: optional Apple App Store ID. When set, every page emits `<meta name="apple-itunes-app" content="app-id=...">`. Nothing is emitted when it is unset.

### `params.fonts`

- `provider`: `google` (default), `custom`, or `none`. `google` keeps the current Google Fonts tags. `custom` loads `cssURL` instead, for a mirror or self-hosted stylesheet. `none` uses the system font stack and makes no font request. Preconnect tags are emitted only for an external provider.
- `cssURL`: stylesheet URL used when `provider` is `custom`. Ignored otherwise. A relative URL is loaded without a preconnect.

### `params.colors`

Optional. When unset, the theme keeps its built-in colors and does not emit an override stylesheet. Body copy stays on the built-in text colors.

Each mode (`light`, `dark`) accepts:

- `primary`: button fills, the start of the hero and button gradient, and the source of tinted backgrounds, borders, and shadows
- `secondary`: links, accent text, icons, and the end of that gradient. Tinted surfaces are mixed from these two colors
- `onPrimary`: text color on primary buttons. Omit it to keep white.

```toml
[params.colors.light]
primary = "#1f4f86"
secondary = "#237380"
onPrimary = "#ffffff"

[params.colors.dark]
primary = "#5bb5c4"
secondary = "#7cc8d4"
onPrimary = "#0a1220"
```

Meta tags are omitted when their content is empty. That includes description, keywords, and Open Graph / Twitter fields. Homepage `keywords` may be a string or a list. A list is joined with `, `; a comma-separated string is emitted as written. The tag is omitted when the value is empty.

The homepage emits one `MobileApplication` JSON-LD object (`operatingSystem` `iOS`, `applicationCategory` `FinanceApplication`). These fields are added only when the site has a value for them:

- `offers`: included only when `currencyCode` is an ISO 4217 code and at least one of `yearly` or `lifetime` is set. `priceCurrency` is that code. The display symbol `currency` is not used. If `currencyCode` is unset, `offers` is omitted.
- `image`: `[params.assets].logo`
- `screenshot`: homepage `home.hero.fanImages`, or `home.features.showcase.images` when the hero has none
- `installUrl`: homepage `home.download.ctaHref` when it is an `http` or `https` URL

Name, description, canonical URL, and language are included when present. Empty values are left out.

### `params.pricing`

- `currency`: display symbol used in the pricing UI
- `currencyCode`: optional ISO 4217 code, such as `USD`, used as JSON-LD `priceCurrency`. Offers are omitted when this is unset.
- `yearly`
- `lifetime`
- `lifetimeOriginal`: optional crossed-out lifetime price, shown only when it differs from `lifetime`

These values are referenced by homepage pricing plans through `priceKey`.

`home.pricingCompare` still uses `columns` and `rows`. Column fields are `title`, `priceKey`, `price`, `suffix`, `description`, `badge`, `featured`, and `cta` (`label`, `href`, `style`, `highlight`). `priceKey` of `yearly` or `lifetime` reads `params.pricing`; any other key uses the column `price`. Row `values` is a positional list aligned with `columns`. Booleans render as a check or a dash. Other values render as text. A row with no `values` is a group header. `note` is an optional line under the row label. The featured column is an elevated card. On a desktop pointer, hovering another plan column moves that elevation with CSS; it returns to the featured column when the pointer leaves.

## Activity pages

Use `type = "activities"` in Markdown front matter to render an activity detail
page. The theme provides the poster/body layout, a return button, a hierarchical
sidebar directory, Markdown typography and optional channel buttons. Content,
contact addresses, platform names and brand assets belong to the consuming site.

```toml
+++
title = "Community activity"
type = "activities"
poster = "/assets/my-poster.png"
posterAlt = "Activity poster"
backHref = "/#activities"
backLabel = "Back to activities"
hideOverview = true
tocBelowPoster = true
channelButtons = true

[redemption]
label = "Contact us"
subject = "Activity enquiry"
+++
```

- `hideOverview`: hides the title/metadata/action panel; defaults to `false`.
- `tocBelowPoster`: places the directory in the poster column; defaults to `false`.
- `channelButtons`: turns recognized Markdown links into logo/name buttons;
  defaults to `false`. Unrecognized links keep their Markdown label and format.
- `redemption`: optional footer contact button, using `params.contact.email`.
  Its subject defaults to the page title. No button is rendered without an email.
- `posterHint`, `summary` and `note`: optional panels or captions; omit these
  fields when the page should only show the poster and Markdown body.

Markdown supports heading levels, emphasis, nested lists, task lists, quotes,
tables, code blocks, images, definition lists and footnotes through Hugo's
Markdown renderer. Wide tables and code blocks scroll within the article.
The activity stylesheet is loaded only on activity detail pages, fingerprinted
for caching, and follows the site's light/dark theme.

### Configuring channel buttons

Create `data/channel_links.json` in your site:

```json
{
  "platforms": {
    "community": {
      "name": "Our community",
      "icon": "/assets/community-logo.svg"
    }
  },
  "hosts": {
    "community.example.com": "community"
  }
}
```

The theme matches the link's hostname case-insensitively, removing a leading
`www.`. Each recognized button preserves its original destination and displays
the configured logo in its original colors. Buttons use three flexible columns
on wide screens and one column on narrow phones. Missing configuration or an
incomplete platform entry falls back to a regular link.

## Menus

Pebble reads:

- `menu.main`
- `menu.footer`

For in-page homepage links, use fragment URLs like `#features` or `#download`. The theme expands them to the current language root automatically.

## Notes

- This theme does not ship content, images, or translation files beyond the theme code itself.
- A runnable demo lives in `exampleSite/`, and the current demo uses iAssets sample branding and assets.
- Fonts default to Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). Set `params.fonts.provider` to `custom` or `none` to avoid that request. The `google` provider still skips those tags on Simplified Chinese pages, matching the previous behavior.
- Homepage copy is rendered at build time. The client-side script handles theme preference, menu toggles, language preference storage, and marquee behavior.

## Included

- `layouts/`
- `assets/css/` for activity Markdown and navigation styles
- `static/app.js`
- `static/styles.css`
