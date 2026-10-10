/* مسئولیت این فایل: مدیریت نمایشی محلی، تنظیمات و خروجی؛ مستقل از مدیریت Frappe. */
/**
 * SHN / shahrniaz / admin-preview
 * Extracted from the original inline script #4.
 * Load order is defined by pages/index.html. See docs/CODE_MAP.fa.md.
 */
(function () {
  "use strict";
  const defaults = [
    { id: "building", en: "Projects", fa: "پروژه‌ها", href: "#/building" },
    { id: "products", en: "Objects", fa: "اشیا", href: "#/products" },
    { id: "ai", en: "AI tools", fa: "ابزارهای AI", href: "#/ai" },
    { id: "studio", en: "Studio", fa: "استودیو", href: "#/studio" },
    { id: "contact", en: "Contact", fa: "تماس", href: "#/contact" },
    { id: "estimate", en: "Start Project", fa: "شروع پروژه", href: "#/estimate" },
  ];
  const labels = {
    "/": "Home",
    "/building": "Projects",
    "/products": "Objects",
    "/ai": "AI tools",
    "/studio": "Studio",
    "/contact": "Contact",
    "/estimate": "Start Project",
    "/painting": "Painting",
  };
  const fa = () => document.documentElement.lang === "fa";
  const tr = (en, pr) => (fa() ? pr : en);
  const esc = (s) =>
    String(s == null ? "" : s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const stateDefault = () => ({
    version: 1,
    menus: defaults.map((x) => ({ ...x })),
    theme: { paper: "#f3f1eb", ink: "#292b26", accent: "#63713b" },
    logo: "",
    pages: {},
  });
  let state = stateDefault(),
    db = null,
    owner = false,
    editor = false,
    selected = null,
    route = "/",
    busy = false;
  const seed = document.getElementById("sn-admin-seed");
  /** notice: admin-preview feature. Keep related handlers in this module. */
  function notice(msg) {
    let n = document.getElementById("sn-admin-notice");
    if (!n) {
      n = document.createElement("div");
      n.id = "sn-admin-notice";
      document.body.append(n);
    }
    n.textContent = msg;
    n.classList.add("show");
    clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove("show"), 3200);
  }
  /** save: admin-preview feature. Keep related handlers in this module. */
  function save() {
    if (!db) return;
    try {
      let t = db.transaction("data", "readwrite");
      t.objectStore("data").put(state, "site");
      t.onerror = () =>
        notice(
          tr("Browser storage is full. Export a backup.", "فضای ذخیره‌سازی پر است؛ خروجی بگیرید."),
        );
    } catch (e) {
      notice(e.message);
    }
  }
  function pageData() {
    return state.pages[route] || (state.pages[route] = { texts: {}, images: {}, layout: null });
  }
  /** openDb: admin-preview feature. Keep related handlers in this module. */
  function openDb() {
    return new Promise((resolve) => {
      try {
        let r = indexedDB.open("shahrniaz-editor-v1", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("data");
        r.onsuccess = () => {
          db = r.result;
          let q = db.transaction("data").objectStore("data").get("site");
          q.onsuccess = () => resolve(q.result || null);
          q.onerror = () => resolve(null);
        };
        r.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  async function boot() {
    let saved = await openDb();
    if (saved && saved.version === 1) state = saved;
    else if (seed) {
      try {
        let x = JSON.parse(seed.textContent);
        if (x.version === 1) state = x;
      } catch {}
    }
    owner = sessionStorage.getItem("sn-owner") === "yes";
    window.SN_RENDER(false);
  }
  function nav(current, lang) {
    return state.menus
      .map(
        (m) =>
          '<a href="' +
          esc(m.href) +
          '" ' +
          (current === m.href.slice(1) ? 'aria-current="page"' : "") +
          ">" +
          esc(lang === "fa" ? m.fa : m.en) +
          "</a>",
      )
      .join("");
  }
  function accountButton() {
    return (
      '<button type="button" id="sn-account" class="sn-account">' +
      (owner ? tr("Editor", "ویرایشگر") : tr("Log in / Sign up", "ورود / ثبت‌نام")) +
      "</button>"
    );
  }
  /** theme: admin-preview feature. Keep related handlers in this module. */
  function theme() {
    let root = document.documentElement;
    for (let k of ["paper", "ink", "accent"])
      root.style.setProperty("--" + k, state.theme[k] || stateDefault().theme[k]);
    if (state.logo)
      document
        .querySelectorAll(".brand img,.footer-logos img:first-child")
        .forEach((x) => (x.src = state.logo));
  }
  /** authModal: admin-preview feature. Keep related handlers in this module. */
  function authModal(tab) {
    let modal = document.getElementById("sn-auth");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "sn-auth";
      modal.className = "sn-auth";
      document.body.append(modal);
    }
    let ownerPanel = tab === "owner",
      signup = tab === "signup";
    modal.innerHTML =
      window.SHN_TEMPLATES.render("shahrniaz/04-admin-preview/authModal-1", []) +
      (ownerPanel
        ? tr("Owner access", "ورود مالک")
        : signup
          ? tr("Create your account", "ساخت حساب کاربری")
          : tr("Welcome back", "خوش آمدید")) +
      "</h2><p>" +
      tr(
        "Your workspace lives in this browser in this offline preview.",
        "در این پیش‌نمایش آفلاین، حساب شما در همین مرورگر ذخیره می‌شود.",
      ) +
      '</p><div class="sn-auth-tabs"><button data-tab="login">' +
      tr("Log in", "ورود") +
      '</button><button data-tab="signup">' +
      tr("Sign up", "ثبت‌نام") +
      '</button><button data-tab="owner">' +
      tr("Owner", "مالک") +
      '</button></div><form id="sn-auth-form">' +
      (ownerPanel
        ? "<label>" +
          tr("Owner access code", "کد ورود مالک") +
          '<input name="code" type="password" inputmode="numeric" autocomplete="off" required></label>'
        : "<label>" +
          tr("Email", "ایمیل") +
          '<input name="email" type="email" autocomplete="email" required></label><label>' +
          tr("Password", "رمز عبور") +
          '<input name="password" type="password" minlength="8" autocomplete="' +
          (signup ? "new-password" : "current-password") +
          '" required></label>') +
      '<button class="sn-main-button">' +
      (ownerPanel
        ? tr("Open editor", "ورود به ویرایشگر")
        : signup
          ? tr("Create account", "ساخت حساب")
          : tr("Log in", "ورود")) +
      '</button><p id="sn-auth-error" role="alert"></p></form><div class="sn-auth-foot">' +
      tr("Owner of the studio?", "مالک استودیو هستید؟") +
      ' <button data-tab="owner">' +
      tr("Use your access code", "با کد وارد شوید") +
      "</button></div></div>";
    modal.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => modal.remove()));
    modal.querySelectorAll("[data-tab]").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === tab);
      b.onclick = () => authModal(b.dataset.tab);
    });
    modal.querySelector("form").onsubmit = async (e) => {
      e.preventDefault();
      let f = e.target,
        d = Object.fromEntries(new FormData(f)),
        err = modal.querySelector("#sn-auth-error");
      if (ownerPanel) {
        if (d.code.trim() === OWNER_ACCESS_CODE) {
          owner = true;
          sessionStorage.setItem("sn-owner", "yes");
          modal.remove();
          location.hash = "#/admin";
          window.SN_RENDER();
          notice(tr("Owner access opened.", "پنل مدیریت باز شد."));
        } else err.textContent = tr("The access code is incorrect.", "کد ورود درست نیست.");
        return;
      }
      let email = d.email.trim().toLowerCase(),
        key = "sn-user-" + email,
        entry;
      try {
        entry = JSON.parse(localStorage.getItem(key) || "null");
      } catch {}
      if (signup) {
        if (entry) {
          err.textContent = tr(
            "This email is already registered in this browser.",
            "این ایمیل در این مرورگر ثبت شده است.",
          );
          return;
        }
        let salt = crypto.randomUUID(),
          hash = await digest(salt + d.password);
        localStorage.setItem(key, JSON.stringify({ salt, hash, email }));
        sessionStorage.setItem("sn-client", email);
        modal.remove();
        notice(tr("Your local account is ready.", "حساب محلی شما ساخته شد."));
      } else {
        if (!entry || (await digest(entry.salt + d.password)) !== entry.hash) {
          err.textContent = tr("Email or password is incorrect.", "ایمیل یا رمز عبور درست نیست.");
          return;
        }
        sessionStorage.setItem("sn-client", email);
        modal.remove();
        notice(tr("You are signed in.", "وارد شدید."));
      }
      window.SN_RENDER(false);
    };
    modal.querySelector("input").focus();
  }
  async function digest(s) {
    let b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  /** page: admin-preview feature. Keep related handlers in this module. */
  function page() {
    if (!owner)
      return (
        '<section class="sn-admin-locked"><small>SHAHR NIAZ / OWNER</small><h1>' +
        tr("Studio editor", "ویرایشگر استودیو") +
        "</h1><p>" +
        tr(
          "Enter your owner access code to open the editor.",
          "برای ورود به ویرایشگر، کد مالک را وارد کنید.",
        ) +
        '</p><button id="sn-open-owner" class="sn-main-button">' +
        tr("Owner sign in", "ورود مالک") +
        "</button></section>"
      );
    return (
      '<section class="sn-admin-page"><div class="sn-admin-head"><small>SHAHR NIAZ / STUDIO EDITOR</small><h1>' +
      tr("Make this space yours.", "این فضا را به سلیقهٔ خودتان بسازید.") +
      "</h1><p>" +
      tr(
        "Choose a page to edit it directly. Manage your identity, navigation and backups here.",
        "صفحه‌ای را انتخاب کنید و همان‌جا ویرایش کنید. هویت بصری، منو و نسخهٔ پشتیبان را اینجا مدیریت کنید.",
      ) +
      '</p></div><div class="sn-admin-grid"><article class="sn-admin-card"><span>01 / ' +
      tr("PAGES", "صفحه‌ها") +
      "</span><h2>" +
      tr("Edit on the page", "ویرایش روی صفحه") +
      '</h2><div id="sn-admin-pages">' +
      Object.entries(labels)
        .map(
          ([path, name]) =>
            '<button data-edit-route="' + esc(path) + '">' + esc(name) + " <span>↗</span></button>",
        )
        .join("") +
      '</div></article><article class="sn-admin-card"><span>02 / ' +
      tr("IDENTITY", "هویت بصری") +
      "</span><h2>" +
      tr("Colours & logo", "رنگ‌ها و لوگو") +
      '</h2><div class="sn-colour-grid">' +
      [
        ["paper", "Background", "پس‌زمینه"],
        ["ink", "Text", "متن"],
        ["accent", "Accent", "رنگ تأکیدی"],
      ]
        .map(
          ([k, en, pr]) =>
            "<label>" +
            tr(en, pr) +
            '<input data-theme="' +
            k +
            '" type="color" value="' +
            esc(state.theme[k]) +
            '"></label>',
        )
        .join("") +
      '</div><label class="sn-upload-label">' +
      tr("Replace logo (PNG, JPG, SVG)", "جایگزینی لوگو (PNG، JPG، SVG)") +
      '<input id="sn-logo-file" type="file" accept="image/*"></label><button id="sn-logo-reset" class="sn-minor">' +
      tr("Use original logo", "بازگشت به لوگوی اصلی") +
      '</button></article><article class="sn-admin-card sn-menu-card"><span>03 / ' +
      tr("NAVIGATION", "منو") +
      "</span><h2>" +
      tr("Menu items", "آیتم‌های منو") +
      '</h2><div id="sn-menu-rows"></div><button id="sn-menu-add" class="sn-minor">+ ' +
      tr("Add menu item", "افزودن آیتم") +
      '</button></article><article class="sn-admin-card"><span>04 / ' +
      tr("BACKUP", "نسخهٔ پشتیبان") +
      "</span><h2>" +
      tr("Take your work with you", "کار خود را همراه ببرید") +
      "</h2><p>" +
      tr(
        "Save a settings file, or download a full HTML copy with your edits inside.",
        "فایل تنظیمات یا نسخهٔ کامل HTML همراه با ویرایش‌هایتان را دریافت کنید.",
      ) +
      '</p><div class="sn-backup-actions"><button id="sn-export-json" class="sn-minor">' +
      tr("Export settings", "خروجی تنظیمات") +
      ' ↓</button><label class="sn-minor">' +
      tr("Import settings", "ورود تنظیمات") +
      ' <input id="sn-import-json" type="file" accept="application/json" hidden></label><button id="sn-export-html" class="sn-minor">' +
      tr("Download edited website", "دانلود وب‌سایت ویرایش‌شده") +
      ' ↓</button></div><p class="sn-admin-note">' +
      tr(
        "This offline editor saves on this device. Public accounts, secure sign in and a shared admin dashboard need a server.",
        "این ویرایشگر آفلاین روی همین دستگاه ذخیره می‌کند. حساب عمومی، ورود امن و پنل مدیریت مشترک به سرور نیاز دارند.",
      ) +
      '</p><button id="sn-owner-out" class="sn-minor">' +
      tr("Sign out of owner mode", "خروج از حالت مالک") +
      "</button></article></div></section>"
    );
  }
  /** mount: admin-preview feature. Keep related handlers in this module. */
  function mount() {
    route = location.hash.slice(1) || "/";
    theme();
    let account = document.getElementById("sn-account");
    if (account)
      account.onclick = () =>
        owner ? ((location.hash = "#/admin"), window.SN_RENDER()) : authModal("login");
    if (route === "/admin") {
      editor = false;
      document.getElementById("sn-edit-bar")?.remove();
      document.getElementById("sn-inspector")?.remove();
      mountDashboard();
      return;
    }
    applyPage();
    if (owner) drawBar();
    else {
      document.getElementById("sn-edit-bar")?.remove();
      document.getElementById("sn-inspector")?.remove();
    }
  }
  /** mountDashboard: admin-preview feature. Keep related handlers in this module. */
  function mountDashboard() {
    let open = document.getElementById("sn-open-owner");
    if (open) open.onclick = () => authModal("owner");
    if (!owner) return;
    document.querySelectorAll("[data-edit-route]").forEach(
      (b) =>
        (b.onclick = () => {
          editor = true;
          location.hash = "#" + b.dataset.editRoute;
          window.SN_RENDER();
        }),
    );
    document.querySelectorAll("[data-theme]").forEach(
      (i) =>
        (i.oninput = () => {
          state.theme[i.dataset.theme] = i.value;
          theme();
          save();
        }),
    );
    document.getElementById("sn-logo-file").onchange = async (e) => {
      let f = e.target.files[0];
      if (f) {
        state.logo = await imageData(f, 900);
        save();
        theme();
        notice(tr("Logo updated.", "لوگو تغییر کرد."));
      }
    };
    document.getElementById("sn-logo-reset").onclick = () => {
      state.logo = "";
      save();
      window.SN_RENDER(false);
    };
    document.getElementById("sn-menu-add").onclick = () => {
      state.menus.push({
        id: crypto.randomUUID(),
        en: "New page",
        fa: "صفحهٔ جدید",
        href: "#/contact",
      });
      save();
      window.SN_RENDER(false);
    };
    menuRows();
    document.getElementById("sn-export-json").onclick = () =>
      download(
        JSON.stringify(state, null, 2),
        "Shahr-Niaz-editor-settings.json",
        "application/json",
      );
    document.getElementById("sn-import-json").onchange = async (e) => {
      try {
        let x = JSON.parse(await e.target.files[0].text());
        if (x.version !== 1 || !Array.isArray(x.menus) || !x.pages || !x.theme) throw Error();
        state = x;
        save();
        window.SN_RENDER(false);
        notice(tr("Settings imported.", "تنظیمات وارد شد."));
      } catch {
        notice(tr("This settings file is not valid.", "این فایل تنظیمات معتبر نیست."));
      }
    };
    document.getElementById("sn-export-html").onclick = exportHTML;
    document.getElementById("sn-owner-out").onclick = () => {
      owner = false;
      editor = false;
      sessionStorage.removeItem("sn-owner");
      window.SN_RENDER(false);
    };
  }
  /** menuRows: admin-preview feature. Keep related handlers in this module. */
  function menuRows() {
    let root = document.getElementById("sn-menu-rows");
    if (!root) return;
    root.innerHTML = state.menus
      .map(
        (m, i) =>
          '<div class="sn-menu-row" data-menu="' +
          i +
          '"><div><label>EN<input data-field="en" value="' +
          esc(m.en) +
          '"></label><label>فارسی<input data-field="fa" value="' +
          esc(m.fa) +
          '"></label><label>LINK<input data-field="href" value="' +
          esc(m.href) +
          window.SHN_TEMPLATES.render("shahrniaz/04-admin-preview/menuRows-2", []),
      )
      .join("");
    root.querySelectorAll("input").forEach(
      (i) =>
        (i.onchange = () => {
          let m = state.menus[+i.closest("[data-menu]").dataset.menu],
            v = i.value.trim();
          if (i.dataset.field === "href" && !/^#\/[a-zA-Z0-9/_-]*$/.test(v)) {
            notice(
              tr("Use a site link such as #/contact.", "لینک داخلی مانند #/contact وارد کنید."),
            );
            return;
          }
          m[i.dataset.field] = v;
          save();
        }),
    );
    root.querySelectorAll("[data-action]").forEach(
      (b) =>
        (b.onclick = () => {
          let i = +b.closest("[data-menu]").dataset.menu,
            a = b.dataset.action;
          if (a === "delete") state.menus.splice(i, 1);
          if (a === "copy")
            state.menus.splice(i + 1, 0, { ...state.menus[i], id: crypto.randomUUID() });
          if (a === "up" && i > 0)
            [state.menus[i - 1], state.menus[i]] = [state.menus[i], state.menus[i - 1]];
          if (a === "down" && i < state.menus.length - 1)
            [state.menus[i + 1], state.menus[i]] = [state.menus[i], state.menus[i + 1]];
          save();
          menuRows();
        }),
    );
  }
  /** applyPage: admin-preview feature. Keep related handlers in this module. */
  function applyPage() {
    let main = document.getElementById("main") || document.querySelector("main");
    if (!main) return;
    let p = pageData(),
      orig = [...main.children];
    let layout = p.layout || orig.map((_, i) => ({ type: "original", index: i }));
    if (route === "/products" && p.layout) {
      let max = Math.max(-1, ...layout.filter((x) => x.type === "original").map((x) => x.index));
      for (let i = max + 1; i < orig.length; i++) layout.push({ type: "original", index: i });
    }
    let nodes = layout
      .map((item) => {
        if (item.type === "original") return orig[item.index] || null;
        if (item.type === "clone") return orig[item.index]?.cloneNode(true) || null;
        if (item.type === "custom") {
          let n = document.createElement("section");
          n.className = "sn-custom-section wrap";
          let inner = document.createElement("div");
          inner.className = "sn-custom-inner";
          let h = document.createElement("h2");
          h.textContent = item.title || "New section";
          let q = document.createElement("p");
          q.textContent = item.body || "Add your text here.";
          inner.append(h, q);
          if (item.variant === "image") {
            let im = document.createElement("img");
            im.alt = item.alt || "New image";
            im.src =
              item.src ||
              "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22%3E%3Crect width=%22800%22 height=%22500%22 fill=%22%23deded5%22/%3E%3Ctext x=%22400%22 y=%22250%22 text-anchor=%22middle%22 font-size=%2228%22 fill=%22%23666%22%3EAdd your image%3C/text%3E%3C/svg%3E";
            inner.append(im);
          }
          n.append(inner);
          return n;
        }
        return null;
      })
      .filter(Boolean);
    main.replaceChildren(...nodes);
    nodes.forEach((node, ix) => {
      node.dataset.snSection = String(ix);
      let item = layout[ix],
        sectionKey = item.type === "original" ? "o" + item.index : item.id || "c" + item.index;
      let walk = (el, path) => {
        if (el.nodeType !== 1) return;
        el.dataset.snKey = sectionKey + ":" + path;
        [...el.children].forEach((child, j) => walk(child, path ? path + "." + j : String(j)));
      };
      walk(node, "");
    });
    for (let [key, value] of Object.entries(p.texts || {})) {
      let el = [...main.querySelectorAll("[data-sn-key]")].find((x) => x.dataset.snKey === key);
      if (el) el.textContent = value;
    }
    for (let [key, value] of Object.entries(p.images || {})) {
      let el = [...main.querySelectorAll("img[data-sn-key]")].find((x) => x.dataset.snKey === key);
      if (el) el.src = value;
    }
    if (editor) {
      main.classList.add("sn-editing");
    } else main.classList.remove("sn-editing");
  }
  /** drawBar: admin-preview feature. Keep related handlers in this module. */
  function drawBar() {
    let bar = document.getElementById("sn-edit-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sn-edit-bar";
      document.body.append(bar);
    }
    bar.innerHTML =
      "<span>SHAHR NIAZ / " +
      tr("EDITOR", "ویرایشگر") +
      '</span><button id="sn-toggle-edit" class="' +
      (editor ? "active" : "") +
      '">' +
      (editor ? tr("Editing on", "ویرایش فعال") : tr("Edit this page", "ویرایش این صفحه")) +
      '</button><button id="sn-add-section">+ ' +
      tr("Add section", "افزودن بخش") +
      '</button><button id="sn-admin-back">' +
      tr("Dashboard", "پنل مدیریت") +
      ' ↗</button><button id="sn-editor-exit">' +
      tr("Sign out", "خروج") +
      "</button>";
    document.getElementById("sn-toggle-edit").onclick = () => {
      editor = !editor;
      selected = null;
      window.SN_RENDER(false);
    };
    document.getElementById("sn-add-section").onclick = () => {
      let p = pageData();
      ensureLayout(p);
      let variant = confirm(
        tr(
          "Add an image section? Choose Cancel for a text section.",
          "بخش تصویری اضافه شود؟ برای بخش متنی «لغو» را بزنید.",
        ),
      )
        ? "image"
        : "text";
      p.layout.push({
        type: "custom",
        id: crypto.randomUUID(),
        variant,
        title: tr("Your new section", "بخش جدید شما"),
        body: tr("Click here to edit this text.", "برای ویرایش این متن کلیک کنید."),
      });
      save();
      editor = true;
      window.SN_RENDER(false);
      notice(tr("Section added at the end of this page.", "بخش جدید به انتهای صفحه اضافه شد."));
    };
    document.getElementById("sn-admin-back").onclick = () => {
      location.hash = "#/admin";
      window.SN_RENDER();
    };
    document.getElementById("sn-editor-exit").onclick = () => {
      owner = false;
      editor = false;
      sessionStorage.removeItem("sn-owner");
      window.SN_RENDER(false);
    };
  }
  function ensureLayout(p) {
    if (!p.layout)
      p.layout = [...document.querySelector("main").children].map((_, i) => ({
        type: "original",
        index: i,
      }));
  }
  /** sectionAction: admin-preview feature. Keep related handlers in this module. */
  function sectionAction(action) {
    let s = selected?.closest("[data-sn-section]");
    if (!s) return;
    let ix = +s.dataset.snSection,
      p = pageData();
    ensureLayout(p);
    if (action === "up" && ix > 0)
      [p.layout[ix - 1], p.layout[ix]] = [p.layout[ix], p.layout[ix - 1]];
    if (action === "down" && ix < p.layout.length - 1)
      [p.layout[ix + 1], p.layout[ix]] = [p.layout[ix], p.layout[ix + 1]];
    if (action === "copy") {
      let item = p.layout[ix],
        newId = crypto.randomUUID(),
        oldId = item.type === "original" ? "o" + item.index : item.id || "c" + item.index;
      for (let bucket of ["texts", "images"])
        for (let [key, value] of Object.entries(p[bucket] || {}))
          if (key.startsWith(oldId + ":")) p[bucket][newId + key.slice(oldId.length)] = value;
      p.layout.splice(
        ix + 1,
        0,
        item.type === "original"
          ? { type: "clone", index: item.index, id: newId }
          : { ...item, id: newId },
      );
    }
    if (action === "delete") p.layout.splice(ix, 1);
    save();
    selected = null;
    window.SN_RENDER(false);
  }
  /** inspect: admin-preview feature. Keep related handlers in this module. */
  function inspect(el) {
    selected = el;
    document.querySelectorAll(".sn-selected").forEach((x) => x.classList.remove("sn-selected"));
    el.classList.add("sn-selected");
    let panel = document.getElementById("sn-inspector");
    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "sn-inspector";
      document.body.append(panel);
    }
    let section = el.closest("[data-sn-section]"),
      isImg = el.tagName === "IMG",
      isText =
        !isImg &&
        ![...el.children].some((c) => c.matches("input,button,select,textarea,img,video,svg"));
    panel.innerHTML =
      '<div class="sn-inspector-head"><div><small>' +
      tr("ON-PAGE EDITOR", "ویرایش روی صفحه") +
      "</small><h3>" +
      tr("Selected element", "عنصر انتخاب‌شده") +
      '</h3></div><button id="sn-inspector-close">×</button></div><p class="sn-inspector-hint">' +
      esc(el.tagName.toLowerCase()) +
      " · " +
      esc((el.textContent || el.alt || "").trim().slice(0, 70)) +
      "</p>" +
      (isText
        ? "<label>" +
          tr("Text", "متن") +
          '<textarea id="sn-text-edit" rows="6">' +
          esc(el.textContent.trim()) +
          '</textarea></label><button id="sn-save-text" class="sn-main-button">' +
          tr("Save text", "ذخیرهٔ متن") +
          "</button>"
        : "") +
      (isImg
        ? '<label class="sn-upload-label">' +
          tr("Replace image", "جایگزینی تصویر") +
          '<input id="sn-image-edit" type="file" accept="image/*"></label>'
        : "") +
      "<hr><small>" +
      tr("SECTION", "بخش") +
      '</small><div class="sn-inspector-actions"><button data-section-action="up">↑ ' +
      tr("Move", "بالا") +
      '</button><button data-section-action="down">↓ ' +
      tr("Move", "پایین") +
      '</button><button data-section-action="copy">⧉ ' +
      tr("Copy", "کپی") +
      '</button><button data-section-action="delete">× ' +
      tr("Remove", "حذف") +
      '</button></div><p class="sn-inspector-hint">' +
      tr(
        "Select a heading, paragraph or image to edit it. Section controls apply to the whole highlighted block.",
        "برای ویرایش، متن یا عکس را انتخاب کنید. دکمه‌های بخش روی کل بلوک انتخاب‌شده اعمال می‌شوند.",
      ) +
      "</p>";
    panel.querySelector("#sn-inspector-close").onclick = () => {
      panel.remove();
      el.classList.remove("sn-selected");
      selected = null;
    };
    let saveText = panel.querySelector("#sn-save-text");
    if (saveText)
      saveText.onclick = () => {
        let value = panel.querySelector("#sn-text-edit").value;
        pageData().texts[el.dataset.snKey] = value;
        el.textContent = value;
        save();
        notice(tr("Text saved.", "متن ذخیره شد."));
      };
    let img = panel.querySelector("#sn-image-edit");
    if (img)
      img.onchange = async (e) => {
        let f = e.target.files[0];
        if (f) {
          let data = await imageData(f, 1800);
          pageData().images[el.dataset.snKey] = data;
          el.src = data;
          save();
          notice(tr("Image updated.", "تصویر تغییر کرد."));
        }
      };
    panel
      .querySelectorAll("[data-section-action]")
      .forEach((b) => (b.onclick = () => sectionAction(b.dataset.sectionAction)));
  }
  document.addEventListener(
    "click",
    (e) => {
      if (
        !owner ||
        !editor ||
        route === "/admin" ||
        e.target.closest("#sn-edit-bar,#sn-inspector,#sn-auth")
      )
        return;
      let main = e.target.closest("main");
      if (!main) return;
      let raw = e.target,
        el =
          raw.closest("img,h1,h2,h3,h4,p,small,span,strong,li,blockquote,figcaption") ||
          raw.closest("[data-sn-section]");
      if (!el || !el.dataset.snKey) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      inspect(el);
    },
    true,
  );
  /** imageData: admin-preview feature. Keep related handlers in this module. */
  async function imageData(file, max) {
    if (!file.type.startsWith("image/")) throw Error("Not an image");
    if (file.type === "image/svg+xml")
      return await file
        .text()
        .then((x) => "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(x))));
    let src = URL.createObjectURL(file);
    try {
      let im = new Image();
      im.src = src;
      await im.decode();
      let scale = Math.min(1, max / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = Math.round(im.width * scale);
      c.height = Math.round(im.height * scale);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", 0.83);
    } finally {
      URL.revokeObjectURL(src);
    }
  }
  function download(data, name, type) {
    let blob = new Blob([data], { type }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  /** exportHTML: admin-preview feature. Keep related handlers in this module. */
  function exportHTML() {
    let clone = document.documentElement.cloneNode(true);
    for (let selector of [
      "#header",
      "#footer",
      "main",
      "#sn-edit-bar",
      "#sn-inspector",
      "#sn-auth",
      "#sn-admin-notice",
    ]) {
      let n = clone.querySelector(selector);
      if (n) n.innerHTML = "";
    }
    let body = clone.querySelector("body");
    body.classList.remove("sn-editing");
    let seedEl = clone.querySelector("#sn-admin-seed");
    if (!seedEl) {
      seedEl = document.createElement("script");
      seedEl.id = "sn-admin-seed";
      seedEl.type = "application/json";
      body.insertBefore(seedEl, clone.querySelector("#sn-admin-code"));
    }
    seedEl.textContent = JSON.stringify(state).replace(/</g, "\\u003c");
    download("<!DOCTYPE html>\n" + clone.outerHTML, "Shahr-Niaz-edited.html", "text/html");
    notice(tr("Your edited website is downloading.", "نسخهٔ ویرایش‌شده در حال دانلود است."));
  }
  const OWNER_ACCESS_CODE = "2026";
  window.SN_ADMIN = { boot, nav, accountButton, mount, page, authModal, isOwner: () => owner };
  boot();
})();
