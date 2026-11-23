(() => {
  const data = document.getElementById("pricing-schedule");
  const amounts = [...document.querySelectorAll("#pricing-compare [data-scheduled-price]")];
  if (!data || !amounts.length) return;

  const schedule = JSON.parse(data.textContent);
  const targets = amounts.map((amount) => {
    const priceLine = amount.parentElement;
    const sibling = priceLine.nextElementSibling;
    const existing = sibling?.matches(".pc-original") ? sibling : null;
    const basePrice = amount.textContent;
    const baseOriginal = existing?.textContent ?? "";
    const currency = priceLine.querySelector(".pc-currency").textContent;
    const original = existing ?? document.createElement("div");
    const strike = original.querySelector("del") ?? original.appendChild(document.createElement("del"));
    original.className = "pc-original";
    return { amount, priceLine, basePrice, baseOriginal, currency, original, strike };
  });

  let timer;
  function refreshPrices() {
    clearTimeout(timer);
    const now = Date.now();
    const activePrices = {};
    let nextChange = Infinity;

    for (const [plan, slots] of Object.entries(schedule)) {
      for (const slot of slots) {
        if (now < slot.startsAt) {
          nextChange = Math.min(nextChange, slot.startsAt);
          break;
        }
        const end = slot.endsAt ?? Infinity;
        if (now < end) {
          activePrices[plan] = slot;
          nextChange = Math.min(nextChange, end);
          break;
        }
      }
    }

    for (const { amount, priceLine, basePrice, baseOriginal, currency, original, strike } of targets) {
      const active = activePrices[amount.dataset.scheduledPrice];
      amount.textContent = active?.price ?? basePrice;
      const originalPrice = active
        ? (active.originalPrice ? currency + active.originalPrice : "")
        : baseOriginal;
      if (originalPrice) {
        strike.textContent = originalPrice;
        if (!original.isConnected) priceLine.after(original);
      } else {
        original.remove();
      }
    }

    if (Number.isFinite(nextChange)) {
      // Browsers cap setTimeout at a signed 32-bit delay.
      timer = setTimeout(refreshPrices, Math.min(nextChange - now, 2_147_483_647));
    }
  }

  window.addEventListener("pageshow", refreshPrices);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshPrices();
  });
  refreshPrices();
})();
