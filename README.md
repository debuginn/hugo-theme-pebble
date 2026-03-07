# Pebble

Pebble is a multilingual Hugo theme for product showcase and marketing sites.

- Responsive landing page layout
- Multilingual routing
- Configurable header and footer menus
- Legal pages
- Built-in example site

## Demo

- Theme repo: [debuginn/hugo-theme-pebble](https://github.com/debuginn/hugo-theme-pebble)
- Example site source: [`exampleSite/`](./exampleSite)

## Features

- Product-focused homepage sections driven by content front matter
- Language-aware navigation and legal pages
- Config-driven menu items with custom labels and links
- Footer QR/download area
- Simple theme toggle and language switcher
- Example content for multiple locales

## Installation

Add the theme to your Hugo site:

```bash
git submodule add git@github.com:debuginn/hugo-theme-pebble.git themes/pebble
```

Then enable it in your Hugo config:

```toml
theme = "pebble"
```

## Quick Start

1. Copy the pieces you need from [`exampleSite/`](./exampleSite):
   - `config/_default/`
   - `content/`
   - `static/assets/`
2. Adjust your site branding and social links.
3. Edit language-specific menu and footer copy in `languages.toml`.
4. Run Hugo locally.

```bash
hugo server
```

## Menu Configuration

Pebble reads menu items from each language config instead of fixed theme labels.

```toml
[[en.params.menu.header]]
    name = "Features"
    url = "#features"

[[en.params.menu.footer]]
    name = "Download"
    url = "#download"
    id = "download"
```

Notes:

- `header` items render in the top navigation
- `footer` items render in the footer navigation
- `id = "download"` is reused by the header CTA, mobile CTA, and footer QR area

## Legal Pages

Legal pages are regular content files with `layout = "legal"`.

```yaml
---
title: "Privacy Policy"
layout: "legal"
updated: 2026-03-03
---
```

Pebble formats the `updated` date per language in the template.

## Example Site

Run the included example site from the theme repository root:

```bash
hugo server --source exampleSite
```

Or from inside the example site:

```bash
cd exampleSite
hugo server
```

## Configuration

Typical config areas:

- `params.assets`: logo, QR image, brand assets
- `params.social`: social links and QR assets
- `params.pricing`: language-specific pricing
- `params.menu.header`: header navigation items
- `params.menu.footer`: footer navigation items
- `params.footer`: footer copy

## Support

If you find a bug or want to improve the theme, open an issue or pull request on [GitHub](https://github.com/debuginn/hugo-theme-pebble).

## License

Licensed under [Apache-2.0](./LICENSE).
