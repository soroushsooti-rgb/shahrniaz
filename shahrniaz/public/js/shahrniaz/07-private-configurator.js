/* مسئولیت این فایل: پیش‌نمایش دارای کد سمت مرورگر و طراحی میز بیلیارد. */
/**
 * SHN / shahrniaz / private-configurator
 * Extracted from the original inline script #7.
 * Load order is defined by pages/index.html. See docs/CODE_MAP.fa.md.
 */
(function () {
  "use strict";
  const ACCESS_CODE = "2026",
    KEY = "sn-private-config-access";
  const T = (en, fa) => (document.documentElement.lang === "fa" ? fa : en);
  const unlocked = () => sessionStorage.getItem(KEY) === "yes";
  async function digest(s) {
    let data = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim()));
    return [...new Uint8Array(data)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  /** page: private-configurator feature. Keep related handlers in this module. */
  function page(type, inner, previewImage) {
    let name = {
      table: ["Table", "میز"],
      chair: ["Chair", "صندلی"],
      sofa: ["Sofa", "مبل"],
      cabinet: ["Cabinet", "کمد"],
      kitchen: ["Kitchen", "آشپزخانه"],
      billiard: ["Billiard table", "میز بیلیارد"],
    }[type] || ["Object", "شیء"];
    return (
      '<div class="sn-gate"><div class="sn-gate-stage" inert aria-hidden="true">' +
      inner +
      '</div><div class="sn-gate-shade"></div>' +
      (previewImage
        ? '<img class="sn-gate-photo" src="' + previewImage + '" alt="" aria-hidden="true">'
        : "") +
      '<section class="sn-gate-card" aria-labelledby="sn-gate-title"><a href="#/products/item/' +
      type +
      '" class="sn-gate-back">← ' +
      T("Back to the collection", "بازگشت به مجموعه") +
      '</a><span class="sn-gate-kicker">SHAHR NIAZ / PRIVATE PREVIEW</span><h1 id="sn-gate-title">' +
      T("A closer look at what is possible.", "نگاهی نزدیک‌تر به امکان‌ها.") +
      "</h1><p>" +
      T(
        "The " +
          name[0].toLowerCase() +
          " design workspace is in private preview. Behind this screen you can explore form, scale and material choices. Enter your access code to open the editor.",
        "فضای طراحی " +
          name[1] +
          " در پیش‌نمایش خصوصی است. پشت این صفحه می‌توانید انتخاب‌های فرم، مقیاس و متریال را بررسی کنید. برای ورود به ویرایشگر کد دسترسی را وارد کنید.",
      ) +
      '</p><div class="sn-gate-hints"><span>01 / ' +
      T("Shape", "فرم") +
      "</span><span>02 / " +
      T("Proportion", "تناسبات") +
      "</span><span>03 / " +
      T("Material", "متریال") +
      '</span></div><form id="sn-gate-form"><label>' +
      T("Private access code", "کد دسترسی خصوصی") +
      '<input name="code" type="password" autocomplete="off" required placeholder="4-digit access code" inputmode="numeric"></label><button type="submit">' +
      T("Open configurator", "ورود به کانفیگوراتور") +
      ' ↗</button><p id="sn-gate-error" role="alert"></p></form><small>' +
      T(
        "Preview access is shared directly by the studio.",
        "دسترسی پیش‌نمایش را استودیو مستقیم در اختیار شما می‌گذارد.",
      ) +
      "</small></section></div>"
    );
  }
  /** billiardPage: private-configurator feature. Keep related handlers in this module. */
  function billiardPage() {
    let img = window.SN_BILLIARD_IMAGE || "";
    return (
      '<section class="sn-billiard-config wrap"><div class="sn-billiard-config-head"><a href="#/products/item/billiard">← ' +
      T("Billiard table", "میز بیلیارد") +
      window.SHN_TEMPLATES.render("shahrniaz/07-private-configurator/billiardPage-1", []) +
      img +
      '" alt="' +
      T(
        "Bespoke billiard table in a warm contemporary room",
        "میز بیلیارد سفارشی در فضای داخلی معاصر",
      ) +
      '"></div><div class="sn-billiard-plan"><span>TOP VIEW / PROPORTION STUDY</span><svg id="sn-billiard-plan" viewBox="0 0 640 340" role="img" aria-label="' +
      T("Top-view concept of the billiard table", "طرح دوبعدی میز بیلیارد") +
      window.SHN_TEMPLATES.render("shahrniaz/07-private-configurator/billiardPage-2", []) +
      T("Make the table yours.", "میز را به سلیقهٔ خودتان بسازید.") +
      "</h1><p>" +
      T(
        "This is an early proportion and finish study. The studio confirms playable dimensions, construction and price after reviewing your room.",
        "این یک مطالعهٔ اولیهٔ تناسبات و پرداخت است. ابعاد قابل‌بازی، ساخت و قیمت پس از بررسی فضای شما تأیید می‌شود.",
      ) +
      "</p><label>" +
      T("Playing size", "اندازهٔ بازی") +
      '<select name="size"><option value="7">7 ft / ' +
      T("compact", "جمع‌وجور") +
      '</option><option value="8" selected>8 ft / ' +
      T("classic", "کلاسیک") +
      '</option><option value="9">9 ft / ' +
      T("generous", "بزرگ") +
      "</option></select></label><label>" +
      T("Felt colour", "رنگ پارچهٔ بازی") +
      '<select name="felt"><option value="olive">' +
      T("Olive green", "سبز زیتونی") +
      '</option><option value="slate">' +
      T("Slate blue", "آبی سنگی") +
      '</option><option value="sand">' +
      T("Warm sand", "شن گرم") +
      "</option></select></label><label>" +
      T("Frame finish", "پرداخت بدنه") +
      '<select name="finish"><option value="walnut">' +
      T("Dark walnut & bronze", "گردوی تیره و برنز") +
      '</option><option value="oak">' +
      T("Natural oak", "بلوط طبیعی") +
      '</option><option value="ebonized">' +
      T("Ebonized timber", "چوب تیرهٔ آبنوسی") +
      "</option></select></label><label>" +
      T("Base direction", "فرم پایه") +
      '<select name="base"><option value="lattice">' +
      T("Sculptural metal lattice", "شبکهٔ فلزی مجسمه‌وار") +
      '</option><option value="solid">' +
      T("Quiet solid plinth", "پایهٔ یکپارچهٔ ساده") +
      '</option></select></label><div class="sn-billiard-config-actions"><button type="button" id="sn-billiard-download">' +
      T("Download concept brief", "دانلود شرح ایده") +
      ' ↓</button><a href="#/products?object=billiard">' +
      T("Discuss with the studio", "گفت‌وگو با استودیو") +
      ' ↗</a></div><p class="sn-billiard-note" id="sn-billiard-note"></p></form></div></section>'
    );
  }
  /** mount: private-configurator feature. Keep related handlers in this module. */
  function mount(type) {
    let f = document.getElementById("sn-gate-form");
    if (f) {
      f.onsubmit = async (e) => {
        e.preventDefault();
        let code = f.elements.code.value.trim();
        if (code !== ACCESS_CODE) {
          document.getElementById("sn-gate-error").textContent = T(
            "That code does not match. Please try again.",
            "این کد درست نیست. دوباره امتحان کنید.",
          );
          return;
        }
        sessionStorage.setItem(KEY, "yes");
        window.scrollTo(0, 0);
        window.SN_RENDER(false);
      };
      return;
    }
    let lock = document.getElementById("sn-config-relock");
    if (!lock) {
      lock = document.createElement("button");
      lock.id = "sn-config-relock";
      lock.type = "button";
      lock.textContent = T("Lock preview", "قفل‌کردن پیش‌نمایش");
      document.body.append(lock);
    }
    lock.onclick = () => {
      sessionStorage.removeItem(KEY);
      window.scrollTo(0, 0);
      window.SN_RENDER(false);
    };
    if (type === "billiard") mountBilliard();
  }
  /** mountBilliard: private-configurator feature. Keep related handlers in this module. */
  function mountBilliard() {
    let form = document.getElementById("sn-billiard-form");
    if (!form) return;
    let colors = { olive: "#545a32", slate: "#394f5c", sand: "#baae88" },
      frames = { walnut: "#4a3225", oak: "#9a7950", ebonized: "#1c201e" };
    let update = () => {
      let d = Object.fromEntries(new FormData(form)),
        w = { 7: 440, 8: 508, 9: 552 }[d.size] || 508,
        x = (640 - w) / 2;
      let rail = document.getElementById("sn-billiard-rail"),
        felt = document.getElementById("sn-billiard-felt");
      rail.setAttribute("x", x - 22);
      rail.setAttribute("width", w + 44);
      rail.setAttribute("fill", frames[d.finish] || frames.walnut);
      felt.setAttribute("x", x);
      felt.setAttribute("width", w);
      felt.setAttribute("fill", colors[d.felt] || colors.olive);
      document.getElementById("sn-billiard-dim").textContent =
        d.size + " ft / " + T("concept proportion", "تناسبات اولیه");
      document.getElementById("sn-billiard-note").textContent =
        T("Selected: ", "انتخاب شما: ") +
        d.size +
        " ft · " +
        d.felt +
        " · " +
        d.finish +
        " · " +
        d.base;
    };
    form.onchange = update;
    update();
    document.getElementById("sn-billiard-download").onclick = () => {
      let d = Object.fromEntries(new FormData(form)),
        body =
          "SHAHR NIAZ / BILLIARD CONCEPT\n\nPlaying size: " +
          d.size +
          " ft\nFelt: " +
          d.felt +
          "\nFrame finish: " +
          d.finish +
          "\nBase direction: " +
          d.base +
          "\n\nConcept only. Final dimensions, construction and price require studio review.";
      let u = URL.createObjectURL(new Blob([body], { type: "text/plain" })),
        a = document.createElement("a");
      a.href = u;
      a.download = "Shahr-Niaz-billiard-concept.txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 10000);
    };
  }
  window.SN_CONFIG_GATE = { unlocked, page, mount, billiardPage };
  if (location.hash.startsWith("#/products/configure/"))
    setTimeout(() => window.SN_RENDER?.(false), 0);
})();
