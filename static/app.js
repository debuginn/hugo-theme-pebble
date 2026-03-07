const THEME_KEY = "ia_theme_pref";
const USER_LANG_KEY = "ia_lang_user";
const THEME_PREFS = ["auto", "dark", "light"];
const DEFAULT_LANG = document.documentElement.getAttribute("data-default-lang") || "en";

function runtimeConfig() {
  return window.__IA_RUNTIME__ || {};
}

function langRouteMap() {
  return runtimeConfig().routeMap || {};
}

function pathLangMap() {
  return runtimeConfig().pathLangMap || {};
}

function supportedLangs() {
  const langs = runtimeConfig().supportedLangs;
  return Array.isArray(langs) && langs.length ? langs : ["en"];
}

function copyMap() {
  return runtimeConfig().copy || {};
}

function safeStorageGet(key) {
  try {
    return window.localStorage ? window.localStorage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    if (window.localStorage) window.localStorage.setItem(key, value);
  } catch (_) {
    // Ignore storage errors in sandboxed previews/private contexts.
  }
}

function safeStorageRemove(key) {
  try {
    if (window.localStorage) window.localStorage.removeItem(key);
  } catch (_) {
    // Ignore storage errors in sandboxed previews/private contexts.
  }
}

function normalizeLang(input) {
  if (!input) return null;
  const v = input.trim().toLowerCase().replace("_", "-");
  return pathLangMap()[v] || null;
}

function langFromPath() {
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  return normalizeLang(seg);
}

function langFromQuery() {
  const v = new URLSearchParams(window.location.search).get("lang");
  if (!v) return null;
  if (supportedLangs().includes(v)) return v;
  return normalizeLang(v);
}

function langFromBrowser() {
  const langs = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || "en"];
  for (const raw of langs) {
    const v = (raw || "").toLowerCase();
    const byMap = normalizeLang(v);
    if (byMap) return byMap;
    if (v.startsWith("zh-tw")) return "zh-Hant-TW";
    if (v.startsWith("zh-hk")) return "zh-Hant-HK";
    if (v.startsWith("zh-mo")) return "zh-Hant-MO";
    if (v.startsWith("zh-sg")) return "zh-Hant-SG";
    if (v.includes("hant")) return "zh-Hant-TW";
    if (v.startsWith("zh")) return "zh-Hans";
    if (v.startsWith("ja")) return "ja";
    if (v.startsWith("ko")) return "ko";
    if (v.startsWith("en")) return "en";
  }
  return null;
}

function detectLang() {
  const fromPath = langFromPath();
  if (supportedLangs().includes(fromPath)) return fromPath;
  const fromQuery = langFromQuery();
  if (supportedLangs().includes(fromQuery)) return fromQuery;
  const fromUser = safeStorageGet(USER_LANG_KEY);
  if (supportedLangs().includes(fromUser)) return fromUser;
  const fromBrowser = langFromBrowser();
  if (supportedLangs().includes(fromBrowser)) return fromBrowser;
  return DEFAULT_LANG;
}

function currentPageLang() {
  const explicit = document.documentElement.getAttribute("data-current-lang");
  if (supportedLangs().includes(explicit)) return explicit;
  const fromPath = langFromPath();
  if (supportedLangs().includes(fromPath)) return fromPath;
  return DEFAULT_LANG;
}

function applyLang(lang) {
  const messages = copyMap();
  const dict = messages[lang] || messages.en || {};
  const htmlLang =
    lang === "zh-Hans"
      ? "zh-CN"
      : lang === "zh-Hant-TW"
        ? "zh-TW"
      : lang === "zh-Hant-HK"
        ? "zh-HK"
        : lang === "zh-Hant-MO"
          ? "zh-MO"
          : lang === "zh-Hant-SG"
            ? "zh-SG"
            : lang === "zh-Hant"
              ? "zh-Hant"
              : lang;
  document.documentElement.lang = htmlLang;
  document.documentElement.setAttribute("data-lang", lang);
  if (document.body) document.body.setAttribute("data-lang", lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (dict[k] !== undefined) el.textContent = dict[k];
  });
  updateHeaderLangDropdown(lang);
  updateFooterLangDropdown(lang);
}

function updateUrl(lang) {
  try {
    const url = new URL(window.location.href);
    const pathMatch = url.pathname.match(/^\/(?:(zh|tw|hk|mo|sg|ja|ko|en)\/)?(privacy|terms)\/?$/);
    const isLegalPath = !!pathMatch;
    let targetPath = langRouteMap()[lang] || "/";
    if (isLegalPath) {
      const slug = pathMatch[2];
      targetPath = `${targetPath.replace(/\/$/, "")}/${slug}/`;
    }
    url.searchParams.delete("lang");
    const nextUrl = `${targetPath}${url.search}${url.hash}`;
    const currentUrl = `${url.pathname}${url.search}${url.hash}`;
    if (nextUrl !== currentUrl) {
      document.documentElement.setAttribute("data-lang-pending", "1");
      window.location.assign(nextUrl);
    }
  } catch (_) {
    // Ignore URL update failures in restricted preview environments.
  }
}

function syncInternalLangLinks(lang) {
  // Keep clean URLs without language query params.
}

function updateLangPills(activeLang) {
  document.querySelectorAll(".lang-pill").forEach((el) => {
    const on = el.getAttribute("data-lang") === activeLang;
    el.classList.toggle("active", on);
    el.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function updateFooterLangDropdown(activeLang) {
  document.querySelectorAll(".footer-lang-dropdown").forEach((dropdown) => {
    const current = dropdown.querySelector(".footer-lang-current");
    const options = dropdown.querySelectorAll("[data-footer-lang-option]");
    let activeText = "EN";
    options.forEach((btn) => {
      const on = btn.getAttribute("data-footer-lang-option") === activeLang;
      btn.classList.toggle("active", on);
      if (on) activeText = (btn.textContent || "").trim();
    });
    if (current) current.textContent = activeText;
  });
}

function bindLangPills() {
  document.querySelectorAll(".lang-pill").forEach((el) => {
    el.addEventListener("click", () => {
      const next = el.getAttribute("data-lang");
      if (!supportedLangs().includes(next)) return;
      applyLang(next);
      safeStorageSet(USER_LANG_KEY, next);
      updateLangPills(next);
      updateUrl(next);
      syncInternalLangLinks(next);
    });
  });
}

function bindFooterLangDropdown() {
  document.querySelectorAll(".footer-lang-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".footer-lang-trigger");
    const options = dropdown.querySelectorAll("[data-footer-lang-option]");
    if (!trigger || !options.length) return;

    const close = () => {
      dropdown.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const nextOpen = !dropdown.classList.contains("open");
      dropdown.classList.toggle("open", nextOpen);
      trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
    });

    options.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-footer-lang-option");
        if (!supportedLangs().includes(next)) return;
        safeStorageSet(USER_LANG_KEY, next);
        updateUrl(next);
        close();
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target instanceof Element && e.target.closest(".footer-lang-dropdown")) return;
      close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  });
}

function updateHeaderLangDropdown(activeLang) {
  const dropdown = document.querySelector(".header-lang-dropdown");
  if (!dropdown) return;
  const current = dropdown.querySelector(".header-lang-current");
  const options = dropdown.querySelectorAll("[data-lang-option]");
  let activeText = "EN";
  options.forEach((btn) => {
    const on = btn.getAttribute("data-lang-option") === activeLang;
    btn.classList.toggle("active", on);
    if (on) activeText = (btn.textContent || "").trim();
  });
  if (current) current.textContent = activeText;
}

function bindHeaderLangDropdown() {
  const dropdown = document.querySelector(".header-lang-dropdown");
  if (!dropdown) return;
  const trigger = dropdown.querySelector(".header-lang-trigger");
  const options = dropdown.querySelectorAll("[data-lang-option]");
  if (!trigger || !options.length) return;

  const close = () => {
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const nextOpen = !dropdown.classList.contains("open");
    dropdown.classList.toggle("open", nextOpen);
    trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
  });

  options.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-lang-option");
      if (!supportedLangs().includes(next)) return;
      safeStorageSet(USER_LANG_KEY, next);
      updateUrl(next);
      close();
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest(".header-lang-dropdown")) return;
    close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function bindMobileMenu(menuBtn, mobileMenu) {
  if (!menuBtn || !mobileMenu) return;
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
  };
  const toggleMenu = () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  };
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("click", (e) => {
    if (menuBtn.getAttribute("aria-expanded") !== "true") return;
    if (mobileMenu.contains(e.target) || menuBtn.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
  });
}

function bindWechatPreview() {
  const wechatLinks = document.querySelectorAll('.social-link[data-social="wechat"]');
  if (!wechatLinks.length) return;
  const qrSrc = (document.body && document.body.getAttribute("data-wechat-qr")) || "/assets/wechat-qr.jpg?v=20260303d";
  const closeAll = () => {
    document.querySelectorAll(".wechat-popover.open").forEach((el) => el.classList.remove("open"));
  };

  wechatLinks.forEach((link) => {
    const pop = document.createElement("span");
    pop.className = "wechat-popover";
    pop.setAttribute("aria-hidden", "true");
    pop.innerHTML = `<img src="${qrSrc}" alt="WeChat QR code" />`;
    link.appendChild(pop);

    const open = () => {
      closeAll();
      pop.classList.add("open");
      pop.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      pop.classList.remove("open");
      pop.setAttribute("aria-hidden", "true");
    };

    link.addEventListener("mouseenter", open);
    link.addEventListener("focus", open);
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (pop.classList.contains("open")) close();
      else open();
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof Element && target.closest('.social-link[data-social="wechat"]')) return;
    closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function fillTrustTrack() {
  const tracks = document.querySelectorAll(".trust-track");
  if (!tracks.length) return;
  tracks.forEach((track) => {
    if (!track.dataset.baseHtml) track.dataset.baseHtml = track.innerHTML;
    track.innerHTML = track.dataset.baseHtml;
    const minWidth = window.innerWidth * 2;
    let guard = 0;
    while (track.scrollWidth < minWidth && guard < 20) {
      track.insertAdjacentHTML("beforeend", track.dataset.baseHtml);
      guard += 1;
    }
  });
}

function fillReviewTrack() {
  const tracks = document.querySelectorAll(".review-track");
  if (!tracks.length) return;
  tracks.forEach((track) => {
    if (!track.dataset.baseHtml) track.dataset.baseHtml = track.innerHTML;
    track.innerHTML = track.dataset.baseHtml;
    const minWidth = window.innerWidth * 2;
    let guard = 0;
    while (track.scrollWidth < minWidth && guard < 20) {
      track.insertAdjacentHTML("beforeend", track.dataset.baseHtml);
      guard += 1;
    }
  });
}

function ensureReviewTwoLines() {
  const quotes = document.querySelectorAll(".review blockquote");
  if (!quotes.length) return;
  quotes.forEach((quote) => {
    quote.style.maxWidth = "";
    const style = window.getComputedStyle(quote);
    const lineHeight = Number.parseFloat(style.lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;
    const isSingleLine = quote.scrollHeight <= lineHeight * 1.35;
    if (!isSingleLine) return;
    const textLen = (quote.textContent || "").trim().length;
    const baseCh = Math.min(26, Math.max(14, Math.ceil(textLen * 0.58)));
    quote.style.maxWidth = `${baseCh}ch`;
    if (quote.scrollHeight <= lineHeight * 1.35) {
      quote.style.maxWidth = `${Math.max(12, baseCh - 4)}ch`;
    }
  });
}

function detectTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function readThemePref() {
  const v = safeStorageGet(THEME_KEY);
  return THEME_PREFS.includes(v) ? v : "auto";
}

function nextThemePref(pref) {
  const idx = THEME_PREFS.indexOf(pref);
  return THEME_PREFS[(idx + 1) % THEME_PREFS.length];
}

function applyThemePref(pref) {
  applyTheme(pref === "auto" ? detectTheme() : pref);
}

function updateThemeButton(pref, btn) {
  if (!btn) return;
  const labels = {
    auto: "Theme: Auto",
    dark: "Theme: Dark",
    light: "Theme: Light"
  };
  btn.textContent = pref === "auto" ? "◐" : pref === "dark" ? "☾" : "☀";
  btn.setAttribute("aria-label", labels[pref]);
  btn.setAttribute("title", labels[pref]);
}

(function init() {
  safeStorageRemove("ia_lang");
  const lang = currentPageLang();
  const switcher = document.getElementById("lang-switcher");
  const themeBtn = document.querySelector(".mode-btn");
  const menuBtn = document.querySelector(".menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const darkMedia = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  let themePref = readThemePref();
  applyLang(lang);
  applyThemePref(themePref);
  updateThemeButton(themePref, themeBtn);
  safeStorageSet(USER_LANG_KEY, lang);
  updateLangPills(lang);
  updateFooterLangDropdown(lang);
  bindLangPills();
  bindFooterLangDropdown();
  bindHeaderLangDropdown();
  bindMobileMenu(menuBtn, mobileMenu);
  bindWechatPreview();
  fillTrustTrack();
  fillReviewTrack();
  window.requestAnimationFrame(ensureReviewTwoLines);
  updateUrl(lang);
  syncInternalLangLinks(lang);
  if (darkMedia) {
    const onChange = (e) => {
      if (themePref !== "auto") return;
      applyTheme(e.matches ? "dark" : "light");
      updateThemeButton(themePref, themeBtn);
    };
    if (typeof darkMedia.addEventListener === "function") {
      darkMedia.addEventListener("change", onChange);
    } else if (typeof darkMedia.addListener === "function") {
      darkMedia.addListener(onChange);
    }
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      themePref = nextThemePref(themePref);
      safeStorageSet(THEME_KEY, themePref);
      applyThemePref(themePref);
      updateThemeButton(themePref, themeBtn);
    });
  }
  if (switcher) {
    switcher.value = lang;
    switcher.addEventListener("change", (e) => {
      const next = e.target.value;
      if (!supportedLangs().includes(next)) return;
      applyLang(next);
      safeStorageSet(USER_LANG_KEY, next);
      updateUrl(next);
      syncInternalLangLinks(next);
    });
  }

  let trustTimer = null;
  window.addEventListener("resize", () => {
    if (trustTimer) window.clearTimeout(trustTimer);
    trustTimer = window.setTimeout(() => {
      fillTrustTrack();
      fillReviewTrack();
      window.requestAnimationFrame(ensureReviewTwoLines);
    }, 120);
  });
  document.documentElement.setAttribute("data-lang-pending", "0");
})();
