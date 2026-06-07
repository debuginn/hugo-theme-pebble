const THEME_KEY = "ia_theme_pref";
const USER_LANG_KEY = "ia_lang_user";
const THEME_PREFS = ["auto", "dark", "light"];
const DEFAULT_LANG = document.documentElement.getAttribute("data-default-lang") || "en";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function runtimeConfig() {
  return window.__IA_RUNTIME__ || {};
}

function pathLangMap() {
  return runtimeConfig().pathLangMap || {};
}

function supportedLangs() {
  const langs = runtimeConfig().supportedLangs;
  return Array.isArray(langs) && langs.length ? langs : [DEFAULT_LANG];
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

function normalizeLang(input) {
  if (!input) return null;
  const value = input.trim().toLowerCase().replace("_", "-");
  return pathLangMap()[value] || null;
}

function currentPageLang() {
  const explicit = document.documentElement.getAttribute("data-current-lang");
  if (supportedLangs().includes(explicit)) return explicit;
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  const byPath = normalizeLang(seg);
  return supportedLangs().includes(byPath) ? byPath : DEFAULT_LANG;
}

function setActiveOption(options, attrName, activeLang, fallbackLabel) {
  let activeText = fallbackLabel;
  options.forEach((option) => {
    const on = option.getAttribute(attrName) === activeLang;
    option.classList.toggle("active", on);
    if (on) activeText = (option.textContent || "").trim();
  });
  return activeText;
}

function isReducedMotion() {
  return window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function closeLangDropdown(dropdown) {
  dropdown.classList.remove("open");
  const trigger = dropdown.querySelector("button[aria-expanded]");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}

function closeLangDropdowns(exceptTarget) {
  document.querySelectorAll(".header-lang-dropdown.open, .footer-lang-dropdown.open").forEach((dropdown) => {
    if (exceptTarget && dropdown.contains(exceptTarget)) return;
    closeLangDropdown(dropdown);
  });
}

function bindLangDropdownGlobals() {
  document.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest(".header-lang-dropdown, .footer-lang-dropdown")) {
      return;
    }
    closeLangDropdowns();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLangDropdowns();
  });
}

function applyLang(lang) {
  const htmlLang =
    lang === "zh-Hans"
      ? "zh-CN"
      : lang === "zh-Hant-TW"
        ? "zh-TW"
        : lang === "zh-Hant-HK"
          ? "zh-HK"
          : lang === "zh-Hant-MO"
            ? "zh-MO"
            : lang === "zh-Hans-SG"
              ? "zh-SG"
            : lang;
  document.documentElement.lang = htmlLang;
  document.documentElement.setAttribute("data-lang", lang);
  if (document.body) document.body.setAttribute("data-lang", lang);
  updateHeaderLangDropdown(lang);
  updateFooterLangDropdown(lang);
}

function updateFooterLangDropdown(activeLang) {
  document.querySelectorAll(".footer-lang-dropdown").forEach((dropdown) => {
    const current = dropdown.querySelector(".footer-lang-current");
    const options = dropdown.querySelectorAll("[data-footer-lang-option]");
    const activeText = setActiveOption(options, "data-footer-lang-option", activeLang, "EN");
    if (current) current.textContent = activeText;
  });
}

function updateHeaderLangDropdown(activeLang) {
  const dropdown = document.querySelector(".header-lang-dropdown");
  if (!dropdown) return;
  const current = dropdown.querySelector(".header-lang-current");
  const options = dropdown.querySelectorAll("[data-lang-option]");
  const activeText = setActiveOption(options, "data-lang-option", activeLang, "EN");
  if (current) current.textContent = activeText;
}

function bindDropdown(dropdownSelector, triggerSelector, optionSelector, attrName) {
  document.querySelectorAll(dropdownSelector).forEach((dropdown) => {
    const trigger = dropdown.querySelector(triggerSelector);
    const options = dropdown.querySelectorAll(optionSelector);
    if (!trigger || !options.length) return;

    const close = () => {
      closeLangDropdown(dropdown);
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLangDropdowns(e.target instanceof Element ? e.target : null);
      const nextOpen = !dropdown.classList.contains("open");
      dropdown.classList.toggle("open", nextOpen);
      trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const next = option.getAttribute(attrName);
        if (!supportedLangs().includes(next)) return;
        safeStorageSet(USER_LANG_KEY, next);
        close();
      });
    });
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

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menuBtn.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
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
  const qrSrc = (document.body && document.body.getAttribute("data-wechat-qr")) || "https://webp.debuginn.com/20260607OpjNs1.jpg?v=20260303d";
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
    if (e.target instanceof Element && e.target.closest('.social-link[data-social="wechat"]')) return;
    closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function fillTrack(selector) {
  if (isReducedMotion()) return;
  const tracks = document.querySelectorAll(selector);
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
    if (quote.scrollHeight > lineHeight * 1.35) return;
    const textLen = (quote.textContent || "").trim().length;
    const baseCh = Math.min(26, Math.max(14, Math.ceil(textLen * 0.58)));
    quote.style.maxWidth = `${baseCh}ch`;
    if (quote.scrollHeight <= lineHeight * 1.35) {
      quote.style.maxWidth = `${Math.max(12, baseCh - 4)}ch`;
    }
  });
}

function bindHeroFan() {
  const stage = document.querySelector("[data-hero-fan]");
  if (!stage) return;
  const cards = Array.from(stage.querySelectorAll("[data-hero-card]"));
  if (!cards.length) return;
  let swapTimer = null;

  const slotCenters = {
    0: 0.5,
    1: 0.34,
    2: 0.66,
    3: 0.18,
    4: 0.82
  };

  const syncPressedState = () => {
    cards.forEach((card) => {
      const on = card.classList.contains("is-active");
      card.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

  const assignInitialPositions = () => {
    cards.forEach((card, index) => {
      card.setAttribute("data-pos", String(index));
    });
    if (!cards.some((card) => card.classList.contains("is-active"))) {
      cards[0].classList.add("is-active");
    }
    syncPressedState();
  };

  const activateCard = (nextCard) => {
    if (!nextCard) return;
    if (stage.classList.contains("is-swapping")) return;
    const activeCard = cards.find((card) => card.classList.contains("is-active")) || cards[0];
    if (activeCard === nextCard) return;

    const nextPos = Number.parseInt(nextCard.getAttribute("data-pos") || "0", 10);
    const leftPath = [3, 1, 0];
    const rightPath = [4, 2, 0];
    const travelPath = nextPos === 3 ? leftPath : nextPos === 4 ? rightPath : null;
    const bridgeCard = travelPath ? cardForPos(travelPath[1]) : null;

    stage.classList.add("is-swapping");
    activeCard.classList.add("is-demoting");
    nextCard.classList.add("is-promoting");
    if (bridgeCard && bridgeCard !== activeCard && bridgeCard !== nextCard) {
      bridgeCard.classList.add("is-bridging");
    }

    if (travelPath && bridgeCard) {
      bridgeCard.setAttribute("data-pos", String(travelPath[0]));
      activeCard.setAttribute("data-pos", String(travelPath[1]));
      nextCard.setAttribute("data-pos", "0");
    } else {
      activeCard.setAttribute("data-pos", String(nextPos));
      nextCard.setAttribute("data-pos", "0");
    }

    activeCard.classList.remove("is-active");
    nextCard.classList.add("is-active");
    stage.setAttribute("data-active", nextCard.getAttribute("data-card-index") || "1");
    syncPressedState();

    if (swapTimer) window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      activeCard.classList.remove("is-demoting");
      nextCard.classList.remove("is-promoting");
      if (bridgeCard) bridgeCard.classList.remove("is-bridging");
      stage.classList.remove("is-swapping");
      swapTimer = null;
    }, 620);
  };

  const cardForPos = (pos) =>
    cards.find((card) => (card.getAttribute("data-pos") || "0") === String(pos)) || null;

  const pickCardFromPoint = (clientX) => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return null;
    const x = (clientX - rect.left) / rect.width;
    const candidates = cards.filter((card) => !card.classList.contains("is-active"));
    if (!candidates.length) return null;

    let bestCard = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    candidates.forEach((card) => {
      const pos = Number.parseInt(card.getAttribute("data-pos") || "0", 10);
      const center = slotCenters[pos];
      if (!Number.isFinite(center)) return;
      const distance = Math.abs(x - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCard = card;
      }
    });

    return bestCard;
  };

  assignInitialPositions();
  stage.setAttribute("data-active", cards.find((card) => card.classList.contains("is-active"))?.getAttribute("data-card-index") || "1");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      stage.classList.add("is-ready");
    });
  });

  stage.addEventListener("click", (e) => {
    const slotTarget = e.target instanceof Element ? e.target.closest("[data-hero-slot]") : null;
    if (slotTarget) {
      const slotCard = cardForPos(slotTarget.getAttribute("data-hero-slot"));
      if (slotCard && !slotCard.classList.contains("is-active")) {
        activateCard(slotCard);
      }
      return;
    }
    const targetCard = e.target instanceof Element ? e.target.closest("[data-hero-card]") : null;
    if (targetCard && !targetCard.classList.contains("is-active")) {
      activateCard(targetCard);
      return;
    }
    const inferredCard = pickCardFromPoint(e.clientX);
    if (inferredCard) activateCard(inferredCard);
  });

  cards.forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateCard(card);
      }
    });
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
  const value = safeStorageGet(THEME_KEY);
  return THEME_PREFS.includes(value) ? value : "auto";
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
  const lang = currentPageLang();
  const themeBtn = document.querySelector(".mode-btn");
  const menuBtn = document.querySelector(".menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const darkMedia = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  let themePref = readThemePref();

  applyLang(lang);
  safeStorageSet(USER_LANG_KEY, lang);

  applyThemePref(themePref);
  updateThemeButton(themePref, themeBtn);

  bindDropdown(".header-lang-dropdown", ".header-lang-trigger", "[data-lang-option]", "data-lang-option");
  bindDropdown(".footer-lang-dropdown", ".footer-lang-trigger", "[data-footer-lang-option]", "data-footer-lang-option");
  bindLangDropdownGlobals();
  bindMobileMenu(menuBtn, mobileMenu);
  bindWechatPreview();
  bindHeroFan();

  if (!isReducedMotion()) {
    fillTrack(".trust-track");
    fillTrack(".review-track");
  }
  window.requestAnimationFrame(ensureReviewTwoLines);

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

  let trackTimer = null;
  window.addEventListener("resize", () => {
    if (isReducedMotion()) return;
    if (trackTimer) window.clearTimeout(trackTimer);
    trackTimer = window.setTimeout(() => {
      fillTrack(".trust-track");
      fillTrack(".review-track");
      window.requestAnimationFrame(ensureReviewTwoLines);
    }, 120);
  });
})();
