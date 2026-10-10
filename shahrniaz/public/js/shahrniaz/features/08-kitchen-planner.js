/* مسئولیت این فایل: چیدمان آشپزخانه، ماژول‌ها، اندازه‌ها و خروجی طرح. */
/** Shahr Niaz: kitchen-planner. Original execution order: 8. */
window.KitchenPlanner = (() => {
  const D = window.FURNITURE,
    S = window.FurnitureState;
  let instance = null,
    sequence = 0;
  const clone = (x) => JSON.parse(JSON.stringify(x)),
    esc = (v) =>
      String(v ?? "").replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
      );
  const id = () => `K${String(++sequence).padStart(2, "0")}`;
  const moduleNames = {
    base: ["Base cabinet", "کابینت زمینی"],
    wall: ["Wall cabinet", "کابینت دیواری"],
    tall: ["Tall pantry", "کمد بلند"],
    sink: ["Sink cabinet", "کابینت سینک"],
    hob: ["Hob cabinet", "کابینت گاز"],
    hood: ["Hood", "هود"],
    dishwasher: ["Dishwasher", "ماشین ظرف‌شویی"],
    oven: ["Oven", "فر"],
    fridge: ["Fridge", "یخچال"],
    island: ["Island cabinet", "کابینت جزیره"],
    diningTable: ["Dining table", "میز ناهارخوری"],
    diningChair: ["Dining chair", "صندلی ناهارخوری"],
  };
  const wallNames = {
    north: ["North wall", "دیوار شمالی"],
    east: ["East wall", "دیوار شرقی"],
    south: ["South wall", "دیوار جنوبی"],
    west: ["West wall", "دیوار غربی"],
    island: ["Island / centre", "جزیره / مرکز"],
    free: ["Free / angled", "آزاد / زاویه‌دار"],
  };
  const frontNames = {
    doors: ["Doors", "در"],
    drawers: ["Drawers", "کشو"],
    open: ["Open shelves", "قفسهٔ باز"],
    appliance: ["Appliance front", "نمای دستگاه"],
  };
  const roomPoints = (c) => {
    const w = c.width,
      d = c.depth;
    if (c.roomShape === "lroom")
      return [
        [0, 0],
        [w, 0],
        [w, d * 0.58],
        [w * 0.72, d * 0.58],
        [w * 0.72, d],
        [0, d],
      ];
    if (c.roomShape === "angled") {
      const rise = d * 0.34,
        run = Math.min(w * 0.38, rise / Math.tan(((Number(c.cornerAngle) || 40) * Math.PI) / 180));
      return [
        [0, 0],
        [w, 0],
        [w, d],
        [run, d],
        [0, d - rise],
      ];
    }
    return [
      [0, 0],
      [w, 0],
      [w, d],
      [0, d],
    ];
  };
  /** newModule: kitchen-planner feature. Keep related handlers in this module. */
  function newModule(kind = "base", run = "north", offset = 0, width = 60, c = { height: 270 }) {
    const tall = ["tall", "fridge"].includes(kind),
      upper = ["wall", "hood"].includes(kind),
      appliance = ["dishwasher", "oven", "fridge"].includes(kind),
      loose = ["diningTable", "diningChair"].includes(kind);
    if (kind === "diningTable") width = 160;
    if (kind === "diningChair") width = 50;
    return {
      id: id(),
      kind,
      run: loose ? "free" : run,
      offset,
      width,
      depth:
        kind === "diningTable" ? 90 : kind === "diningChair" ? 50 : upper ? 35 : tall ? 65 : 60,
      height:
        kind === "diningTable"
          ? 75
          : kind === "diningChair"
            ? 86
            : upper
              ? 72
              : tall
                ? Math.max(190, c.height - 18)
                : 82,
      elevation: loose ? 0 : upper ? 145 : 8,
      front: loose ? "open" : appliance ? "appliance" : kind === "island" ? "drawers" : "doors",
      doors: width > 65 ? 2 : 1,
      drawers: 3,
      shelves: upper ? 2 : 1,
      finish: null,
      style: null,
      groove: null,
      handle: null,
      doorState: "closed",
      frontType: "solid",
      internalLight: "off",
      crossOffset: 0,
      rotation: 0,
    };
  }
  function defaults() {
    const c = window.SHN_DATA.get("shahrniaz/08-kitchen-planner/c-1");
    c.modules = generate(c);
    return c;
  }
  /** generate: kitchen-planner feature. Keep related handlers in this module. */
  function generate(c) {
    const a = [],
      push = (kind, run, offset, width) => a.push(newModule(kind, run, offset, width, c));
    let x = 0;
    for (const [kind, width] of [
      ["sink", 80],
      ["dishwasher", 60],
      ["base", 60],
      ["hob", 80],
      ["oven", 60],
    ]) {
      if (x + width > c.width - 70) break;
      push(kind, "north", x, width);
      x += width;
    }
    if (c.width - 70 - x >= 20) push("base", "north", x, c.width - 70 - x);
    push("fridge", "north", c.width - 70, 70);
    for (let wx = 0; wx < c.width - 70; wx += 60) {
      const width = Math.min(60, c.width - 70 - wx),
        below = a.find(
          (m) => m.run === "north" && m.kind === "hob" && Math.abs(m.offset - wx) < 40,
        );
      if (width >= 20) push(below ? "hood" : "wall", "north", wx, width);
    }
    if (c.layout !== "straight") {
      let y = 70;
      while (y + 60 <= c.depth) {
        push("base", "west", y, 60);
        y += 60;
      }
    }
    if (c.layout === "u") {
      let y = 70;
      while (y + 60 <= c.depth) {
        push("base", "east", y, 60);
        y += 60;
      }
    }
    return a;
  }
  /** normalise: kitchen-planner feature. Keep related handlers in this module. */
  function normalise(raw) {
    const c = { ...defaults(), ...clone(raw || {}) };
    c.wallFinishes = {
      north: "white",
      east: "white",
      south: "white",
      west: "white",
      ...(raw?.wallFinishes || {}),
    };
    c.customWalls = (Array.isArray(raw?.customWalls) ? raw.customWalls : []).map((w, i) => ({
      id: w.id || `W${i + 1}`,
      x: Number(w.x) || 0,
      y: Number(w.y) || 0,
      length: Math.max(60, Math.min(800, Number(w.length) || 240)),
      angle: Math.max(-180, Math.min(180, Number(w.angle) || 0)),
      height: Math.max(120, Math.min(400, Number(w.height) || c.height)),
    }));
    c.ceilingLights = Math.max(0, Math.min(12, Number(c.ceilingLights) || 0));
    c.lightIntensity = Math.max(0.2, Math.min(3, Number(c.lightIntensity) || 1));
    for (const key of [
      "width",
      "depth",
      "height",
      "wallThickness",
      "cornerAngle",
      "doorOffset",
      "doorWidth",
      "windowOffset",
      "windowWidth",
      "windowSill",
    ])
      c[key] = Number(c[key]);
    c.width = Math.max(240, Math.min(800, c.width));
    c.depth = Math.max(200, Math.min(700, c.depth));
    c.height = Math.max(210, Math.min(400, c.height));
    c.wallThickness = Math.max(8, Math.min(40, c.wallThickness));
    c.cornerAngle = Math.max(25, Math.min(85, c.cornerAngle || 40));
    if (!["rectangle", "lroom", "angled"].includes(c.roomShape)) c.roomShape = "rectangle";
    if (!Array.isArray(c.modules)) c.modules = generate(c);
    c.modules = c.modules.map((m) => {
      const loose = ["island", "free"].includes(m.run),
        width = Math.max(20, Math.min(220, Number(m.width) || 60)),
        custom = c.customWalls.find((w) => w.id === m.run),
        along = custom ? custom.length : ["north", "south"].includes(m.run) ? c.width : c.depth;
      return {
        ...newModule(m.kind, m.run, m.offset, width, c),
        ...m,
        width,
        depth: Math.max(20, Math.min(140, Number(m.depth) || 60)),
        height: Math.max(20, Math.min(c.height - 2, Number(m.height) || 82)),
        elevation: Math.max(0, Math.min(c.height - 20, Number(m.elevation) || 0)),
        offset: loose
          ? Math.max(
              -c.width / 2 + width / 2,
              Math.min(c.width / 2 - width / 2, Number(m.offset) || 0),
            )
          : Math.max(0, Math.min(Math.max(0, along - width), Number(m.offset) || 0)),
        crossOffset: Math.max(-c.depth / 2, Math.min(c.depth / 2, Number(m.crossOffset) || 0)),
        rotation: Math.max(-180, Math.min(180, Number(m.rotation) || 0)),
        doors: Math.max(1, Math.min(4, Number(m.doors) || 1)),
        drawers: Math.max(1, Math.min(6, Number(m.drawers) || 3)),
        shelves: Math.max(0, Math.min(8, Number(m.shelves) || 0)),
        doorState: m.doorState === "open" ? "open" : "closed",
        frontType: m.frontType === "glass" ? "glass" : "solid",
        internalLight: m.internalLight === "warm" ? "warm" : "off",
      };
    });
    return c;
  }
  /** price: kitchen-planner feature. Keep related handlers in this module. */
  function price(c) {
    const rates = {
      base: 112,
      wall: 88,
      tall: 185,
      sink: 128,
      hob: 132,
      hood: 76,
      dishwasher: 210,
      oven: 145,
      fridge: 360,
      island: 145,
      diningTable: 165,
      diningChair: 58,
    };
    const finishFactor = D.materials[c.frontMaterial]?.kind === "paint" ? 1.16 : 1;
    const parts = c.modules.map((m) => ({
      name: moduleNames[m.kind],
      value: Math.round((((rates[m.kind] || 100) * m.width) / 60) * finishFactor) * 1000000,
    }));
    parts.push({
      name: ["Worktop and finishing", "صفحه و پرداخت"],
      value:
        Math.round(
          (c.modules
            .filter((m) => ["base", "sink", "hob", "island"].includes(m.kind))
            .reduce((s, m) => s + m.width, 0) /
            100) *
            (c.counterMaterial === "marble" ? 54 : 36),
        ) * 1000000,
    });
    return { parts, total: parts.reduce((s, p) => s + p.value, 0) };
  }
  /** checks: kitchen-planner feature. Keep related handlers in this module. */
  function checks(c) {
    const out = [];
    const wallLength = (run) => (["north", "south"].includes(run) ? c.width : c.depth);
    c.modules.forEach((m) => {
      if (!["island", "free"].includes(m.run) && m.offset + m.width > wallLength(m.run) + 0.01)
        out.push([
          "error",
          `${m.id}: `,
          `از طول ${wallNames[m.run][1]} بیرون زده است.`,
          `${m.id} extends beyond the ${wallNames[m.run][0].toLowerCase()}.`,
        ]);
      if (m.elevation + m.height > c.height)
        out.push([
          "error",
          `${m.id}: `,
          "ارتفاع یونیت از سقف بیشتر است.",
          "Module exceeds the ceiling height.",
        ]);
    });
    for (const run of ["north", "east", "south", "west"]) {
      const list = c.modules.filter((m) => m.run === run);
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i],
            b = list[j],
            horizontal = a.offset < b.offset + b.width && b.offset < a.offset + a.width,
            vertical = a.elevation < b.elevation + b.height && b.elevation < a.elevation + a.height;
          if (horizontal && vertical)
            out.push([
              "error",
              `${b.id}: `,
              "با یونیت کناری هم‌پوشانی دارد.",
              "Overlaps an adjacent module.",
            ]);
        }
    }
    if (!c.modules.some((m) => m.kind === "sink"))
      out.push(["warn", "", "سینک در پلان نیست.", "No sink is placed."]);
    if (c.modules.some((m) => m.kind === "hob") && !c.modules.some((m) => m.kind === "hood"))
      out.push(["warn", "", "برای گاز، هود تعریف نشده است.", "The hob has no hood."]);
    const island = c.modules.find((m) => m.run === "island");
    if (island) {
      const aisle = (c.depth - island.depth - 120) / 2;
      if (aisle < 107)
        out.push([
          "warn",
          "",
          `فاصلهٔ تقریبی اطراف جزیره ${Math.max(0, Math.round(aisle))} سانتی‌متر است؛ برای بازبینی حرفه‌ای علامت‌گذاری شد.`,
          `Approximate island aisle is ${Math.max(0, Math.round(aisle))} cm; professional review is required.`,
        ]);
    }
    return out;
  }
  /** page: kitchen-planner feature. Keep related handlers in this module. */
  function page(lang) {
    const t = (en, fa) => window.siteTranslate(en, fa),
      shape = (id, title, fa, svg) =>
        `<button data-onboard-shape="${id}" aria-pressed="${id === "rectangle"}"><svg viewBox="0 0 140 105" aria-hidden="true">${svg}</svg><b>${t(title, fa)}</b><span>${id === "rectangle" ? t("Four straight walls", "چهار دیوار صاف") : id === "lroom" ? t("Room with a recess", "فضای دارای شکستگی") : t("Any non-square corner", "گوشهٔ غیرقائم")}</span></button>`;
    return window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/page-1", [
      window.SHN_TEMPLATES.text(lang === "fa" ? "rtl" : "ltr"),
      window.SHN_TEMPLATES.text(
        t("Start here — it takes about one minute", "از اینجا شروع کنید — حدود یک دقیقه"),
      ),
      window.SHN_TEMPLATES.text(
        t("What shape is<br>your kitchen?", "آشپزخانه‌تان<br>چه شکلی است؟"),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Choose the closest shape. You can enter exact measurements on the next screen.",
          "نزدیک‌ترین شکل را انتخاب کنید. اندازه‌های دقیق را در صفحهٔ بعد وارد می‌کنید.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        shape("rectangle", "Rectangle", "مستطیلی", '<path d="M18 18h104v69H18z"/>'),
      ),
      window.SHN_TEMPLATES.text(
        shape("lroom", "L-shaped room", "اِل‌شکل", '<path d="M18 18h104v39H78v30H18z"/>'),
      ),
      window.SHN_TEMPLATES.text(
        shape(
          "angled",
          "Angled / unusual",
          "زاویه‌دار / نامنظم",
          '<path d="M18 18h104v69H53L18 64z"/>',
        ),
      ),
      window.SHN_TEMPLATES.text(t("What would you like inside?", "داخل آن چه می‌خواهید؟")),
      window.SHN_TEMPLATES.text(t("An island", "جزیره")),
      window.SHN_TEMPLATES.text(t("Placed with a safe starting gap", "با فاصلهٔ اولیهٔ مناسب")),
      window.SHN_TEMPLATES.text(t("Dining table", "میز غذاخوری")),
      window.SHN_TEMPLATES.text(t("Table with four chairs", "میز با چهار صندلی")),
      window.SHN_TEMPLATES.text(t("Create my starting plan", "پلان اولیه‌ام را بساز")),
      window.SHN_TEMPLATES.text(
        t("I prefer to open the detailed editor", "می‌خواهم مستقیم وارد تنظیمات دقیق شوم"),
      ),
      window.SHN_TEMPLATES.text(t("Products", "محصولات")),
      window.SHN_TEMPLATES.text(t("Kitchen project", "پروژهٔ آشپزخانه")),
      window.SHN_TEMPLATES.text(t("Plan first. Build with precision.", "اول پلان؛ سپس ساخت دقیق.")),
      window.SHN_TEMPLATES.text(t("2D + 3D linked", "پلان و سه‌بعدی هم‌زمان")),
      window.SHN_TEMPLATES.text(t("2D plan", "پلان ۲بعدی")),
      window.SHN_TEMPLATES.text(t("Split", "هم‌زمان")),
      window.SHN_TEMPLATES.text(t("3D", "سه‌بعدی")),
      window.SHN_TEMPLATES.text(t("Click a unit to edit it", "برای ویرایش، روی هر یونیت بزنید")),
      window.SHN_TEMPLATES.text(t("Scaled kitchen floor plan", "پلان مقیاس‌دار آشپزخانه")),
      window.SHN_TEMPLATES.text(
        t(
          "Dimensions in cm · fabrication exports in mm",
          "ابعاد به سانتی‌متر · خروجی ساخت به میلی‌متر",
        ),
      ),
    ]);
  }
  /** mount: kitchen-planner feature. Keep related handlers in this module. */
  function mount(lang) {
    dispose();
    const t = (en, fa) => window.siteTranslate(en, fa),
      tx = (a) => t(...a);
    let c = normalise(),
      step = "room",
      view = "3d",
      selected = c.modules[0]?.id,
      selectedWall = "north",
      viewer = null,
      onboardShape = "rectangle";
    const onboardFeatures = new Set(),
      q = (s) => document.querySelector(s),
      qa = (s) => [...document.querySelectorAll(s)],
      host = q("#kitchen-3d");
    if (!host) return;
    host.insertAdjacentHTML(
      "afterend",
      `<nav class="kp-dock" aria-label="${t("Add to kitchen", "افزودن به آشپزخانه")}">${[
        ["wall", "╱", "Wall", "دیوار"],
        ["base", "▤", "Cabinet", "کابینت"],
        ["sink", "⌑", "Sink", "سینک"],
        ["hob", "⊙", "Hob", "گاز"],
        ["hood", "⌂", "Hood", "هود"],
        ["fridge", "▥", "Fridge", "یخچال"],
        ["island", "▬", "Island", "جزیره"],
        ["light", "✦", "Light", "چراغ"],
      ]
        .map(
          (x) =>
            `<button data-studio-add="${x[0]}"><i>${x[1]}</i><span>${t(x[2], x[3])}</span></button>`,
        )
        .join("")}</nav>`,
    );
    q(".kp-canvas").dataset.view = "3d";
    q(".kp-viewbar").innerHTML =
      `<strong>${t("3D KITCHEN STUDIO", "استودیوی سه‌بعدی آشپزخانه")}</strong><span>${t("Select an object, then drag it where you want", "وسیله را انتخاب کنید و به جای دلخواه بکشید")}</span>`;
    q(".kp-head h1").textContent = t("Design directly in 3D.", "طراحی مستقیم در فضای سه‌بعدی.");
    q(".kp-head-status").innerHTML = `<i></i>${t("Live 3D studio", "استودیوی سه‌بعدی زنده")}`;
    const needs = { oven: "both", hood: "wall", fridge: "integrated", layout: "l", island: false };
    const steps = [
      ["room", t("02 Define space", "۰۲ تعریف فضا")],
      ["plan", t("03 Suggestions", "۰۳ پیشنهادها")],
      ["units", t("04A Cabinets", "۰۴الف کابینت‌ها")],
      ["materials", t("04B Materials", "۰۴ب متریال")],
      ["review", t("05 Make it happen", "۰۵ نهایی‌سازی")],
    ];
    const field = (key, label, min, max, unit = "cm", value = c[key]) =>
      `<label class="kp-field"><span>${label}</span><span><input data-kp="${key}" type="number" min="${min}" max="${max}" step="1" value="${Math.round(value)}"><i>${unit}</i></span></label>`;
    const choice = (key, label, options, value = c[key]) =>
      `<fieldset class="kp-choice"><legend>${label}</legend><div>${options.map((o) => `<button data-kp-choice="${key}" data-value="${o[0]}" aria-pressed="${String(value) === String(o[0])}">${t(o[1], o[2])}</button>`).join("")}</div></fieldset>`;
    const swatches = (key, label, ids, value = c[key]) =>
      `<fieldset class="kp-swatches"><legend>${label}</legend><div>${ids.map((v) => `<button data-kp-choice="${key}" data-value="${v}" aria-pressed="${value === v}"><i style="--c:${D.materials[v].color}" class="${D.materials[v].kind}"></i><span>${tx(D.materials[v].name)}</span></button>`).join("")}</div></fieldset>`;
    /** panel: kitchen-planner feature. Keep related handlers in this module. */
    function panel() {
      const p = q("#kp-panel"),
        m = c.modules.find((x) => x.id === selected);
      let html = `<div class="kp-panel-title"><span>${steps.find((x) => x[0] === step)[1]}</span><b>${t("Changes appear instantly in both views.", "تغییرات فوراً در هر دو نما دیده می‌شوند.")}</b></div>`;
      if (step === "room") {
        const custom = c.customWalls.find((w) => w.id === selectedWall),
          wallLength = custom
            ? custom.length
            : ["north", "south"].includes(selectedWall)
              ? c.width
              : c.depth;
        html += `<h2>${custom ? t("Edit this wall", "ویرایش این دیوار") : t("Build the room", "ساخت فضای آشپزخانه")}</h2><p>${t("Select a wall directly in 3D. Add another wall from the toolbar whenever the room has an unusual corner.", "دیوار را مستقیماً در سه‌بعدی انتخاب کنید. برای گوشه‌های نامنظم از نوار پایین دیوار تازه اضافه کنید.")}</p>${
          custom
            ? `<div class="kp-selected-wall"><b>${custom.id}</b><span>${Math.round(custom.angle)}°</span></div>${field("custom-length", t("Wall length", "طول دیوار"), 60, 800, "cm", custom.length)}${field("custom-angle", t("Wall angle", "زاویهٔ دیوار"), -180, 180, "°", custom.angle)}${field("custom-x", "X", -400, 400, "cm", custom.x)}${field("custom-y", "Y", -350, 350, "cm", custom.y)}<button class="kp-danger" id="kp-remove-wall">${t("Remove this wall", "حذف این دیوار")}</button>`
            : `${choice("roomShape", t("Starting room", "فرم اولیهٔ فضا"), [
                ["rectangle", "Rectangle", "مستطیلی"],
                ["lroom", "L-shaped", "اِل‌شکل"],
                ["angled", "Angled", "زاویه‌دار"],
              ])}${field("wall-length", t("Selected wall length", "طول دیوار انتخاب‌شده"), 240, 800, "cm", wallLength)}${c.roomShape === "angled" ? field("cornerAngle", t("Corner angle", "زاویهٔ گوشه"), 25, 85, "°") : ""}${field("height", t("Ceiling height", "ارتفاع سقف"), 210, 400)}`
        }<h3>${t("Wall finish", "متریال دیوار")}</h3><div class="kp-wall-finishes">${["white", "stone", "marble", "lacquerOlive", "lacquerClay"].map((v) => `<button data-wall-finish="${v}" aria-pressed="${c.wallFinishes[selectedWall] === v}"><i style="--c:${D.materials[v].color}"></i>${tx(D.materials[v].name)}</button>`).join("")}</div><details class="kp-advanced"><summary>${t("Exact room dimensions", "ابعاد دقیق فضا")}</summary>${field("width", t("Overall width", "عرض کلی"), 240, 800)}${field("depth", t("Overall depth", "عمق کلی"), 200, 700)}${field("wallThickness", t("Wall thickness", "ضخامت دیوار"), 8, 40)}</details>`;
      }
      if (step === "plan") {
        const image =
          window.SN_EMBEDDED?.["assets/kitchen-suggestions-1920.webp"] ||
          "assets/kitchen-suggestions-1920.webp";
        html += window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/panel-2", [
          window.SHN_TEMPLATES.text(t("Choose a starting point", "پیشنهاد اولیه را انتخاب کنید")),
          window.SHN_TEMPLATES.text(
            t(
              "Three complete suggestions are generated from your room. Choose the closest one; every detail remains editable.",
              "سه پیشنهاد کامل بر اساس فضای شما آماده شده است. نزدیک‌ترین گزینه را انتخاب کنید؛ تمام جزئیات بعداً قابل تغییر است.",
            ),
          ),
          window.SHN_TEMPLATES.text(image),
          window.SHN_TEMPLATES.text(
            [
              ["warm", "Warm walnut", "گردوی گرم", "L-shaped · island", "اِل شکل · جزیره"],
              ["olive", "Calm olive", "زیتونی آرام", "U-shaped · daylight", "یو شکل · نور روز"],
              ["dark", "Dark gallery", "گالری تیره", "Galley · glass", "خطی · شیشه"],
            ]
              .map(
                (s, i) =>
                  `<button data-suggestion="${s[0]}" aria-pressed="false"><i style="--i:${i}"></i><span><b>${t(s[1], s[2])}</b><small>${t(s[3], s[4])}</small></span></button>`,
              )
              .join(""),
          ),
          window.SHN_TEMPLATES.text(t("Openings and services", "بازشوها و تأسیسات")),
          window.SHN_TEMPLATES.text(t("Door", "در ورودی")),
          window.SHN_TEMPLATES.text(
            choice(
              "doorWall",
              t("Wall", "دیوار"),
              Object.entries(wallNames)
                .filter((x) => !["island", "free"].includes(x[0]))
                .map(([k, v]) => [k, ...v]),
            ),
          ),
          window.SHN_TEMPLATES.text(
            field("doorOffset", t("Distance from corner", "فاصله از گوشه"), 0, 700),
          ),
          window.SHN_TEMPLATES.text(field("doorWidth", t("Opening width", "عرض بازشو"), 60, 180)),
          window.SHN_TEMPLATES.text(t("Window", "پنجره")),
          window.SHN_TEMPLATES.text(
            choice(
              "windowWall",
              t("Wall", "دیوار"),
              Object.entries(wallNames)
                .filter((x) => !["island", "free"].includes(x[0]))
                .map(([k, v]) => [k, ...v]),
            ),
          ),
          window.SHN_TEMPLATES.text(
            field("windowOffset", t("Distance from corner", "فاصله از گوشه"), 0, 700),
          ),
          window.SHN_TEMPLATES.text(field("windowWidth", t("Window width", "عرض پنجره"), 40, 300)),
          window.SHN_TEMPLATES.text(
            field("windowSill", t("Sill height", "ارتفاع کف پنجره"), 40, 200),
          ),
        ]);
      }
      if (step === "units")
        html += window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/panel-3", [
          window.SHN_TEMPLATES.text(
            t("Move things where you want", "وسایل را همان‌جا که می‌خواهید ببرید"),
          ),
          window.SHN_TEMPLATES.text(
            t(
              "Select an item in 3D, then drag it. The arrows and X/Y boxes are there when you want exact control.",
              "در نمای سه‌بعدی وسیله را انتخاب کنید و بکشید. برای کنترل دقیق‌تر از فلش‌ها و عددهای X و Y استفاده کنید.",
            ),
          ),
          window.SHN_TEMPLATES.text(t("Add to the room", "به فضا اضافه کنید")),
          window.SHN_TEMPLATES.text(
            [
              ["base", "Cabinet", "کابینت"],
              ["island", "Island", "جزیره"],
              ["diningTable", "Table", "میز"],
              ["diningChair", "Chair", "صندلی"],
            ]
              .map((x) => `<button data-add="${x[0]}">+ ${t(x[1], x[2])}</button>`)
              .join(""),
          ),
          window.SHN_TEMPLATES.text(t("All items in this room", "همهٔ وسایل این فضا")),
          window.SHN_TEMPLATES.text(c.modules.length),
          window.SHN_TEMPLATES.text(
            c.modules
              .map(
                (x) =>
                  `<button data-module-list="${x.id}" aria-pressed="${x.id === selected}"><span>${x.id}</span><b>${tx(moduleNames[x.kind])}</b><small>${x.width} × ${x.depth} × ${x.height}</small></button>`,
              )
              .join(""),
          ),
          window.SHN_TEMPLATES.text(
            t("Add appliance or special cabinet", "افزودن دستگاه یا کابینت ویژه"),
          ),
          window.SHN_TEMPLATES.text(
            [
              ["wall", "Wall cabinet", "کابینت دیواری"],
              ["tall", "Tall unit", "کمد بلند"],
              ["sink", "Sink", "سینک"],
              ["hob", "Hob", "گاز"],
              ["dishwasher", "Dishwasher", "ظرف‌شویی"],
              ["oven", "Oven", "فر"],
              ["fridge", "Fridge", "یخچال"],
            ]
              .map((x) => `<button data-add="${x[0]}">+ ${t(x[1], x[2])}</button>`)
              .join(""),
          ),
          window.SHN_TEMPLATES.text(m ? moduleEditor(m) : ""),
        ]);
      if (step === "materials")
        html += window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/panel-4", [
          window.SHN_TEMPLATES.text(t("Light the space", "نورپردازی فضا")),
          window.SHN_TEMPLATES.text(
            t(
              "Start with the mood. Open a material group only when you want to change it.",
              "ابتدا حال‌وهوای نور را انتخاب کنید. فقط هنگام نیاز، گروه متریال مربوط را باز کنید.",
            ),
          ),
          window.SHN_TEMPLATES.text(
            choice("lightingMood", t("Lighting mood", "حال‌وهوای نور"), [
              ["warm", "Warm home", "گرم خانگی"],
              ["neutral", "Neutral daylight", "نور طبیعی"],
              ["dramatic", "Architectural", "معماری"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            field(
              "ceilingLights",
              t("Ceiling lights", "تعداد چراغ سقفی"),
              0,
              12,
              "",
              c.ceilingLights,
            ),
          ),
          window.SHN_TEMPLATES.text(
            field("lightIntensity", t("Light intensity", "شدت نور"), 0.2, 3, "×", c.lightIntensity),
          ),
          window.SHN_TEMPLATES.text(t("Cabinet materials", "متریال کابینت")),
          window.SHN_TEMPLATES.text(
            swatches("material", t("Cabinet body", "بدنهٔ کابینت"), [
              "oak",
              "walnut",
              "ash",
              "white",
              "black",
            ]),
          ),
          window.SHN_TEMPLATES.text(
            swatches("frontMaterial", t("Door finish", "نمای درها"), [
              "oak",
              "walnut",
              "ash",
              "white",
              "black",
              "lacquerSand",
              "lacquerOlive",
              "lacquerClay",
              "lacquerBlue",
            ]),
          ),
          window.SHN_TEMPLATES.text(
            swatches("counterMaterial", t("Worktop", "صفحهٔ کابینت"), [
              "stone",
              "marble",
              "oak",
              "black",
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("doorStyle", t("Door style", "مدل در"), [
              ["slab", "Plain", "ساده"],
              ["shaker", "Framed", "قاب‌دار"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("groove", t("Door detail", "جزئیات در"), [
              ["none", "Clean", "ساده"],
              ["vertical", "Vertical grooves", "شیار عمودی"],
              ["frame", "Frame line", "خط قاب"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("handles", t("Handle", "دستگیره"), [
              ["bar", "Bar", "خطی"],
              ["knob", "Knob", "دکمه‌ای"],
              ["profile", "Integrated", "پروفیل مخفی"],
              ["none", "Touch-open", "بدون دستگیره"],
            ]),
          ),
          window.SHN_TEMPLATES.text(t("Room surfaces", "سطوح فضا")),
          window.SHN_TEMPLATES.text(
            swatches("floorFinish", t("Floor", "کف آشپزخانه"), ["stone", "marble", "oak", "black"]),
          ),
          window.SHN_TEMPLATES.text(
            swatches("backsplashFinish", t("Backsplash", "کاشی بین کابینتی"), [
              "white",
              "stone",
              "marble",
              "lacquerOlive",
              "lacquerBlue",
            ]),
          ),
          window.SHN_TEMPLATES.text(t("Sink and appliances", "سینک و تجهیزات")),
          window.SHN_TEMPLATES.text(
            choice("sinkModel", t("Sink model", "مدل سینک"), [
              ["undermount", "Undermount", "زیرکار"],
              ["farmhouse", "Apron front", "فارم‌هاوس"],
              ["double", "Double bowl", "دو لگنه"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("tapModel", t("Tap model", "مدل شیر"), [
              ["arc", "High arc", "قوس بلند"],
              ["square", "Square", "گوشه‌دار"],
              ["pullout", "Pull-out", "شلنگ‌دار"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("fridgeStyle", t("Fridge style", "مدل یخچال"), [
              ["steelSide", "Steel side-by-side", "ساید استیل"],
              ["whiteTop", "White top-freezer", "سفید فریزر بالا"],
              ["blackFrench", "Black French door", "چهار در مشکی"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            choice("hoodStyle", t("Hood style", "مدل هود"), [
              ["chimney", "Chimney", "شومینه‌ای"],
              ["integrated", "Integrated", "مخفی"],
              ["island", "Island hood", "هود جزیره"],
            ]),
          ),
        ]);
      if (step === "review") html += review();
      const at = steps.findIndex((x) => x[0] === step);
      html += `<nav class="kp-guide-nav">${at > 0 ? `<button data-guide-step="${steps[at - 1][0]}">← ${t("Back", "قبلی")}</button>` : "<span></span>"}${at < steps.length - 1 ? `<button class="next" data-guide-step="${steps[at + 1][0]}">${t("Continue", "ادامه")} →</button>` : ""}</nav>`;
      p.innerHTML = html;
      bindPanel();
    }
    /** moduleEditor: kitchen-planner feature. Keep related handlers in this module. */
    function moduleEditor(m) {
      const loose = ["island", "free"].includes(m.run),
        furniture = ["diningTable", "diningChair"].includes(m.kind);
      return window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/moduleEditor-5", [
        window.SHN_TEMPLATES.text(t("Selected", "انتخاب‌شده")),
        window.SHN_TEMPLATES.text(m.id),
        window.SHN_TEMPLATES.text(tx(moduleNames[m.kind])),
        window.SHN_TEMPLATES.text(
          t(
            "Drag this item in 3D or tap the arrows. Each tap moves 5 cm.",
            "این وسیله را در نمای سه‌بعدی بکشید یا از فلش‌ها استفاده کنید. هر بار ۵ سانتی‌متر جابه‌جا می‌شود.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Move up", "حرکت به بالا")),
        window.SHN_TEMPLATES.text(t("Move left", "حرکت به چپ")),
        window.SHN_TEMPLATES.text(t("Move down", "حرکت به پایین")),
        window.SHN_TEMPLATES.text(t("Move right", "حرکت به راست")),
        window.SHN_TEMPLATES.text(
          field(
            "m-offset",
            loose
              ? "X — " + t("left / right", "چپ / راست")
              : t("Position along wall", "موقعیت روی دیوار"),
            -400,
            800,
            "cm",
            m.offset,
          ),
        ),
        window.SHN_TEMPLATES.text(
          loose
            ? field(
                "m-crossOffset",
                "Y — " + t("forward / back", "جلو / عقب"),
                -350,
                350,
                "cm",
                m.crossOffset,
              )
            : "",
        ),
        window.SHN_TEMPLATES.text(
          loose
            ? `<div class="kp-rotate"><span>${t("Angle", "زاویه")} · ${Math.round(m.rotation || 0)}°</span><button data-rotate="-15">↶ 15°</button><button data-rotate="15">15° ↷</button></div>`
            : "",
        ),
        window.SHN_TEMPLATES.text(t("More settings", "تنظیمات بیشتر")),
        window.SHN_TEMPLATES.text(t("Size, type and doors", "ابعاد، نوع و درها")),
        window.SHN_TEMPLATES.text(t("Duplicate", "تکثیر")),
        window.SHN_TEMPLATES.text(t("Remove", "حذف")),
        window.SHN_TEMPLATES.text(
          choice(
            "m-kind",
            t("Type", "نوع"),
            Object.entries(moduleNames).map(([k, v]) => [k, ...v]),
            m.kind,
          ),
        ),
        window.SHN_TEMPLATES.text(
          choice(
            "m-run",
            t("Placement", "محل قرارگیری"),
            Object.entries(wallNames).map(([k, v]) => [k, ...v]),
            m.run,
          ),
        ),
        window.SHN_TEMPLATES.text(field("m-width", t("Width", "عرض"), 20, 220, "cm", m.width)),
        window.SHN_TEMPLATES.text(field("m-depth", t("Depth", "عمق"), 20, 140, "cm", m.depth)),
        window.SHN_TEMPLATES.text(
          field("m-height", t("Height", "ارتفاع"), 20, 390, "cm", m.height),
        ),
        window.SHN_TEMPLATES.text(
          !furniture
            ? field("m-elevation", t("Height from floor", "فاصله از کف"), 0, 350, "cm", m.elevation)
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture
            ? choice(
                "m-front",
                t("Front organisation", "تقسیم‌بندی نما"),
                Object.entries(frontNames).map(([k, v]) => [k, ...v]),
                m.front,
              )
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture && m.front === "doors"
            ? field("m-doors", t("Door count", "تعداد در"), 1, 4, "", m.doors)
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture && m.front === "drawers"
            ? field("m-drawers", t("Drawer count", "تعداد کشو"), 1, 6, "", m.drawers)
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture && m.front === "open"
            ? field("m-shelves", t("Shelf count", "تعداد طبقه"), 0, 8, "", m.shelves)
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture
            ? choice(
                "m-style",
                t("Door style override", "مدل در این یونیت"),
                [
                  ["", "Use project default", "پیش‌فرض پروژه"],
                  ["slab", "Plain", "ساده"],
                  ["shaker", "Framed", "قاب‌دار"],
                ],
                m.style || "",
              )
            : "",
        ),
        window.SHN_TEMPLATES.text(
          !furniture
            ? choice(
                "m-handle",
                t("Handle override", "دستگیرهٔ این یونیت"),
                [
                  ["", "Use project default", "پیش‌فرض پروژه"],
                  ["bar", "Bar", "خطی"],
                  ["knob", "Knob", "دکمه‌ای"],
                  ["profile", "Integrated", "پروفیل مخفی"],
                  ["none", "Touch-open", "بدون دستگیره"],
                ],
                m.handle || "",
              )
            : "",
        ),
      ]);
    }
    /** review: kitchen-planner feature. Keep related handlers in this module. */
    function review() {
      const issues = checks(c),
        estimate = price(c),
        valid = issues.filter((x) => x[0] === "error").length === 0,
        format = (n) => new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(n);
      return window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/review-6", [
        window.SHN_TEMPLATES.text(t("Build review", "بازبینی پیش از ساخت")),
        window.SHN_TEMPLATES.text(valid ? "ready" : ""),
        window.SHN_TEMPLATES.text(
          valid
            ? t("Geometry ready for workshop review", "هندسه آمادهٔ بازبینی کارگاهی است")
            : t("Resolve geometry conflicts", "تداخل‌های هندسی را برطرف کنید"),
        ),
        window.SHN_TEMPLATES.text(c.modules.length),
        window.SHN_TEMPLATES.text(t("modules", "یونیت")),
        window.SHN_TEMPLATES.text(
          issues.length
            ? issues
                .map((x) => `<div class="${x[0]}"><b>${x[1]}</b>${t(x[3], x[2])}</div>`)
                .join("")
            : `<div class="ok">${t("No geometric conflict detected.", "تداخل هندسی پیدا نشد.")}</div>`,
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Confirm site dimensions, plumbing, drainage, gas, power, ventilation and appliance model numbers before release.",
            "پیش از تأیید، ابعاد محل، آب، فاضلاب، گاز، برق، تهویه و مدل دقیق تجهیزات را کنترل کنید.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Panel thickness, edge banding, hinge plates, runners, fillers and installation tolerances require workshop approval.",
            "ضخامت ورق، نوار لبه، پلیت لولا، ریل، فیلر و لقی نصب باید توسط کارگاه تأیید شوند.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Provisional live estimate", "پیش‌برآورد زنده")),
        window.SHN_TEMPLATES.text(format(estimate.total)),
        window.SHN_TEMPLATES.text(t("IRR", "ریال")),
        window.SHN_TEMPLATES.text(
          t(
            "Comparison only — not a supplier quotation.",
            "فقط برای مقایسه — قیمت قطعی فروشنده نیست.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Save on this device", "ذخیره در دستگاه")),
        window.SHN_TEMPLATES.text(t("Project JSON", "فایل پروژه JSON")),
        window.SHN_TEMPLATES.text(t("Scaled plan SVG", "پلان مقیاس‌دار SVG")),
        window.SHN_TEMPLATES.text(t("Cut list CSV", "لیست برش CSV")),
        window.SHN_TEMPLATES.text(t("Workshop specification", "مشخصات کارگاهی")),
      ]);
    }
    /** moduleBox: kitchen-planner feature. Keep related handlers in this module. */
    function moduleBox(m) {
      if (m.run === "north") return { x: m.offset, y: 0, w: m.width, d: m.depth };
      if (m.run === "south") return { x: m.offset, y: c.depth - m.depth, w: m.width, d: m.depth };
      if (m.run === "west") return { x: 0, y: m.offset, w: m.depth, d: m.width };
      if (m.run === "east") return { x: c.width - m.depth, y: m.offset, w: m.depth, d: m.width };
      const wall = c.customWalls.find((w) => w.id === m.run);
      if (wall) {
        const a = (wall.angle * Math.PI) / 180,
          cx = c.width / 2 + wall.x + Math.cos(a) * (m.offset + m.width / 2),
          cy = c.depth / 2 + wall.y + Math.sin(a) * (m.offset + m.width / 2);
        return { x: cx - m.width / 2, y: cy - m.depth / 2, w: m.width, d: m.depth };
      }
      return {
        x: c.width / 2 + m.offset - m.width / 2,
        y: c.depth / 2 + m.crossOffset - m.depth / 2,
        w: m.width,
        d: m.depth,
      };
    }
    /** modulesCollide: kitchen-planner feature. Keep related handlers in this module. */
    function modulesCollide(target) {
      const a = moduleBox(target),
        eps = 0.25;
      return c.modules.some((other) => {
        if (other.id === target.id) return false;
        const vertical =
          target.elevation < other.elevation + other.height - eps &&
          other.elevation < target.elevation + target.height - eps;
        if (!vertical) return false;
        const b = moduleBox(other);
        return (
          a.x < b.x + b.w - eps &&
          b.x < a.x + a.w - eps &&
          a.y < b.y + b.d - eps &&
          b.y < a.y + a.d - eps
        );
      });
    }
    /** snapModule: kitchen-planner feature. Keep related handlers in this module. */
    function snapModule(m) {
      if (["island", "free"].includes(m.run)) return;
      const max = (["north", "south"].includes(m.run) ? c.width : c.depth) - m.width,
        candidates = [0, max];
      c.modules
        .filter(
          (x) =>
            x.id !== m.id &&
            x.run === m.run &&
            m.elevation < x.elevation + x.height &&
            x.elevation < m.elevation + m.height,
        )
        .forEach((x) => candidates.push(x.offset + x.width, x.offset - m.width));
      const nearest = candidates.reduce(
        (a, b) => (Math.abs(b - m.offset) < Math.abs(a - m.offset) ? b : a),
        candidates[0],
      );
      if (Math.abs(nearest - m.offset) <= 10) m.offset = Math.max(0, Math.min(max, nearest));
    }
    /** findOpenPosition: kitchen-planner feature. Keep related handlers in this module. */
    function findOpenPosition(m) {
      const walls = ["north", "west", "east", "south"];
      for (const run of walls) {
        m.run = run;
        const limit = ["north", "south"].includes(run) ? c.width : c.depth;
        for (let pos = 0; pos <= limit - m.width; pos += 5) {
          m.offset = pos;
          if (!modulesCollide(m)) return true;
        }
      }
      return false;
    }
    /** findLoosePosition: kitchen-planner feature. Keep related handlers in this module. */
    function findLoosePosition(m) {
      for (let radius = 0; radius < Math.max(c.width, c.depth); radius += 20)
        for (const [x, y] of [
          [0, -radius],
          [radius, 0],
          [0, radius],
          [-radius, 0],
          [radius, radius],
          [-radius, radius],
        ]) {
          m.offset = Math.max(-c.width / 2 + m.width / 2, Math.min(c.width / 2 - m.width / 2, x));
          m.crossOffset = Math.max(
            -c.depth / 2 + m.depth / 2,
            Math.min(c.depth / 2 - m.depth / 2, y),
          );
          if (!modulesCollide(m)) return true;
        }
      return false;
    }
    /** studioAdd: kitchen-planner feature. Keep related handlers in this module. */
    function studioAdd(kind) {
      if (kind === "wall") {
        const wall = {
          id: `W${Date.now().toString().slice(-4)}`,
          x: -100,
          y: 0,
          length: 240,
          angle: 0,
          height: c.height,
        };
        c.customWalls.push(wall);
        c.wallFinishes[wall.id] = "white";
        selectedWall = wall.id;
        step = "room";
        refresh();
        return;
      }
      if (kind === "light") {
        c.ceilingLights = Math.min(12, c.ceilingLights + 1);
        step = "materials";
        refresh();
        return;
      }
      const loose = kind === "island",
        run = loose
          ? "island"
          : c.customWalls.some((w) => w.id === selectedWall)
            ? selectedWall
            : "north",
        m = newModule(
          kind,
          run,
          0,
          kind === "sink" || kind === "hob" ? 80 : kind === "fridge" ? 70 : 60,
          c,
        );
      if (loose) findLoosePosition(m);
      else if (c.customWalls.some((w) => w.id === run)) {
        for (
          let pos = 0;
          pos <= c.customWalls.find((w) => w.id === run).length - m.width;
          pos += 5
        ) {
          m.offset = pos;
          if (!modulesCollide(m)) break;
        }
      } else findOpenPosition(m);
      c.modules.push(m);
      selected = m.id;
      step = "units";
      refresh();
    }
    /** applySuggestion: kitchen-planner feature. Keep related handlers in this module. */
    function applySuggestion(id) {
      if (id === "warm")
        Object.assign(c, {
          layout: "l",
          material: "walnut",
          frontMaterial: "lacquerSand",
          counterMaterial: "marble",
          floorFinish: "stone",
          lightingMood: "warm",
        });
      if (id === "olive")
        Object.assign(c, {
          layout: "u",
          material: "ash",
          frontMaterial: "lacquerOlive",
          counterMaterial: "stone",
          floorFinish: "marble",
          lightingMood: "neutral",
        });
      if (id === "dark")
        Object.assign(c, {
          layout: "straight",
          material: "walnut",
          frontMaterial: "black",
          counterMaterial: "marble",
          floorFinish: "black",
          lightingMood: "dramatic",
        });
      c.modules = generate(c);
      if (needs.island || id === "warm") {
        const island = newModule("island", "island", 0, 140, c);
        island.crossOffset = 55;
        c.modules.push(island);
      }
      selected = c.modules[0]?.id;
      step = "units";
      refresh();
      status(
        t(
          "Starting suggestion applied. Select anything in 3D to change it.",
          "پیشنهاد اولیه اعمال شد. برای تغییر، هر چیزی را در فضای سه‌بعدی انتخاب کنید.",
        ),
      );
    }
    /** resizeWall: kitchen-planner feature. Keep related handlers in this module. */
    function resizeWall(run, value) {
      const horizontal = ["north", "south"].includes(run),
        key = horizontal ? "width" : "depth",
        old = c[key],
        attached = c.modules.filter((m) => m.run === run),
        minimum = Math.max(240, ...attached.map((m) => m.width + 20));
      c[key] = Math.max(minimum, Number(value) || old);
      const ratio = c[key] / old;
      attached.forEach((m) => (m.offset *= ratio));
      c = normalise(c);
      for (const band of [
        c.modules.filter((m) => m.run === run && m.elevation < 120),
        c.modules.filter((m) => m.run === run && m.elevation >= 120),
      ]) {
        let end = 0;
        band
          .sort((a, b) => a.offset - b.offset)
          .forEach((m) => {
            m.offset = Math.max(end, m.offset);
            end = m.offset + m.width;
            if (end > c[key]) {
              m.offset = Math.max(0, c[key] - m.width);
              end = c[key];
            }
          });
      }
    }
    /** bindWallDrag: kitchen-planner feature. Keep related handlers in this module. */
    function bindWallDrag() {
      const svg = q("#kitchen-plan");
      svg.onpointerdown = (e) => {
        const line = e.target.closest?.("[data-plan-wall]");
        if (!line) return;
        selectedWall = line.dataset.planWall;
        step = "room";
        drawSteps();
        panel();
        if (!["east", "south"].includes(selectedWall)) return;
        const move = (event) => {
          const point = svg.createSVGPoint();
          point.x = event.clientX;
          point.y = event.clientY;
          const p = point.matrixTransform(svg.getScreenCTM().inverse()),
            vw = 1000,
            vh = 700,
            pad = 85,
            scale = Math.min((vw - pad * 2) / c.width, (vh - pad * 2) / c.depth),
            ox = (vw - c.width * scale) / 2,
            oy = (vh - c.depth * scale) / 2;
          resizeWall(
            selectedWall,
            selectedWall === "east" ? (p.x - ox) / scale : (p.y - oy) / scale,
          );
          drawPlan();
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          refresh();
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up, { once: true });
      };
    }
    /** drawPlan: kitchen-planner feature. Keep related handlers in this module. */
    function drawPlan() {
      const svg = q("#kitchen-plan"),
        vw = 1000,
        vh = 700,
        pad = 85,
        scale = Math.min((vw - pad * 2) / c.width, (vh - pad * 2) / c.depth),
        ox = (vw - c.width * scale) / 2,
        oy = (vh - c.depth * scale) / 2,
        wall = Math.max(8, c.wallThickness * scale),
        elements = [],
        points = roomPoints(c)
          .map(([x, y]) => `${ox + x * scale},${oy + y * scale}`)
          .join(" ");
      elements.push(
        `<polygon class="room-fill" points="${points}"/><polygon class="walls" points="${points}" stroke-width="${wall}"/><g class="wall-handles"><line data-plan-wall="north" x1="${ox}" y1="${oy}" x2="${ox + c.width * scale}" y2="${oy}"/><line data-plan-wall="east" x1="${ox + c.width * scale}" y1="${oy}" x2="${ox + c.width * scale}" y2="${oy + c.depth * scale}"/><line data-plan-wall="south" x1="${ox}" y1="${oy + c.depth * scale}" x2="${ox + c.width * scale}" y2="${oy + c.depth * scale}"/><line data-plan-wall="west" x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + c.depth * scale}"/></g>`,
      );
      const rect = (m) => {
        const b = moduleBox(m);
        return { x: ox + b.x * scale, y: oy + b.y * scale, w: b.w * scale, h: b.d * scale };
      };
      c.modules.forEach((m) => {
        const r = rect(m),
          upper = ["wall", "hood"].includes(m.kind),
          cx = r.x + r.w / 2,
          cy = r.y + r.h / 2,
          rotate = ["island", "free"].includes(m.run)
            ? ` transform="rotate(${m.rotation || 0} ${cx} ${cy})"`
            : "",
          collision = modulesCollide(m);
        elements.push(
          `<g data-plan-module="${m.id}" class="plan-module movable ${upper ? "upper" : ""} ${selected === m.id ? "selected" : ""} ${collision ? "collision" : ""}"${rotate}><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${["diningTable", "diningChair"].includes(m.kind) ? 8 : 0}"/><text x="${cx}" y="${cy + 4}">${m.id}</text>${selected === m.id ? `<g class="move-handle"><circle cx="${cx}" cy="${cy}" r="18"/><path d="M${cx - 9} ${cy}h18M${cx} ${cy - 9}v18M${cx - 9} ${cy}l4-4m-4 4 4 4m14-4-4-4m4 4-4 4m-5-9-4 4m4-4 4 4m-4 14-4-4m4 4 4-4"/></g>` : ""}</g>`,
        );
      });
      const opening = (wallName, offset, width, cls) => {
        const o = offset * scale,
          l = width * scale;
        if (wallName === "north" || wallName === "south")
          elements.push(
            `<line class="${cls}" x1="${ox + o}" x2="${ox + o + l}" y1="${wallName === "north" ? oy : oy + c.depth * scale}" y2="${wallName === "north" ? oy : oy + c.depth * scale}"/>`,
          );
        else
          elements.push(
            `<line class="${cls}" y1="${oy + o}" y2="${oy + o + l}" x1="${wallName === "west" ? ox : ox + c.width * scale}" x2="${wallName === "west" ? ox : ox + c.width * scale}"/>`,
          );
      };
      opening(c.doorWall, c.doorOffset, c.doorWidth, "door-opening");
      opening(c.windowWall, c.windowOffset, c.windowWidth, "window-opening");
      elements.push(
        `<g class="dimensions"><line x1="${ox}" x2="${ox + c.width * scale}" y1="${oy - 35}" y2="${oy - 35}"/><text x="${vw / 2}" y="${oy - 45}">${c.width} cm</text><line y1="${oy}" y2="${oy + c.depth * scale}" x1="${ox - 35}" x2="${ox - 35}"/><text transform="translate(${ox - 48} ${vh / 2}) rotate(-90)">${c.depth} cm</text></g>`,
      );
      svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
      svg.innerHTML = elements.join("");
      qa("[data-plan-wall]").forEach((line) => {
        line.classList.toggle("selected", line.dataset.planWall === selectedWall);
        line.onclick = () => {
          selectedWall = line.dataset.planWall;
          step = "room";
          drawSteps();
          panel();
          drawPlan();
        };
      });
      qa("[data-plan-module]").forEach((g) => {
        g.onpointerdown = (e) => {
          e.preventDefault();
          const m = c.modules.find((x) => x.id === g.dataset.planModule),
            before = { offset: m.offset, crossOffset: m.crossOffset };
          selected = m.id;
          step = "units";
          drawSteps();
          panel();
          drawPlan();
          viewer?.update(c, { selectedModule: selected });
          let moved = false;
          const move = (event) => {
            moved = true;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const p = point.matrixTransform(svg.getScreenCTM().inverse());
            if (["island", "free"].includes(m.run)) {
              m.offset = Math.max(
                -c.width / 2 + m.width / 2,
                Math.min(c.width / 2 - m.width / 2, (p.x - ox) / scale - c.width / 2),
              );
              m.crossOffset = Math.max(
                -c.depth / 2 + m.depth / 2,
                Math.min(c.depth / 2 - m.depth / 2, (p.y - oy) / scale - c.depth / 2),
              );
            } else if (["north", "south"].includes(m.run))
              m.offset = Math.max(0, Math.min(c.width - m.width, (p.x - ox) / scale - m.width / 2));
            else
              m.offset = Math.max(0, Math.min(c.depth - m.width, (p.y - oy) / scale - m.width / 2));
            drawPlan();
          };
          const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            snapModule(m);
            if (moved && modulesCollide(m)) {
              Object.assign(m, before);
              status(
                t(
                  "Objects cannot pass through each other. The last valid position was restored.",
                  "آبجکت‌ها نمی‌توانند داخل هم بروند؛ آخرین موقعیت درست برگردانده شد.",
                ),
              );
            }
            refresh();
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up, { once: true });
        };
      });
    }
    /** bindPanel: kitchen-planner feature. Keep related handlers in this module. */
    function bindPanel() {
      qa("[data-kp]").forEach(
        (input) =>
          (input.onchange = () => {
            const key = input.dataset.kp,
              value = Number(input.value),
              wall = c.customWalls.find((w) => w.id === selectedWall);
            if (key === "wall-length") resizeWall(selectedWall, value);
            else if (key.startsWith("custom-") && wall) wall[key.slice(7)] = value;
            else if (key.startsWith("m-")) {
              const m = c.modules.find((x) => x.id === selected),
                before = clone(m);
              m[key.slice(2)] = value;
              c = normalise(c);
              const changed = c.modules.find((x) => x.id === selected);
              if (modulesCollide(changed)) {
                Object.assign(changed, before);
                status(
                  t(
                    "This value would create a geometric overlap.",
                    "این مقدار باعث تداخل هندسی می‌شود.",
                  ),
                );
              }
            } else c[key] = value;
            refresh();
          }),
      );
      qa("[data-kp-choice]").forEach(
        (button) =>
          (button.onclick = () => {
            const key = button.dataset.kpChoice,
              value = button.dataset.value;
            if (key.startsWith("m-")) {
              const m = c.modules.find((x) => x.id === selected),
                prop = key.slice(2),
                before = clone(m);
              if (prop === "kind") {
                const replacement = newModule(value, m.run, m.offset, m.width, c);
                Object.assign(m, replacement, { id: m.id, run: replacement.run, offset: m.offset });
              } else m[prop] = value;
              if (modulesCollide(m)) Object.assign(m, before);
            } else c[key] = value;
            refresh();
          }),
      );
      qa("[data-wall-select]").forEach(
        (b) =>
          (b.onclick = () => {
            selectedWall = b.dataset.wallSelect;
            panel();
            drawPlan();
            viewer?.update(c, { selectedWall });
          }),
      );
      qa("[data-wall-finish]").forEach(
        (b) =>
          (b.onclick = () => {
            c.wallFinishes[selectedWall] = b.dataset.wallFinish;
            refresh();
          }),
      );
      qa("[data-suggestion]").forEach(
        (b) => (b.onclick = () => applySuggestion(b.dataset.suggestion)),
      );
      qa("[data-module-list]").forEach((b) => (b.onclick = () => select(b.dataset.moduleList)));
      qa("[data-guide-step]").forEach(
        (b) =>
          (b.onclick = () => {
            step = b.dataset.guideStep;
            drawSteps();
            panel();
            q(".kp-panel").scrollTo({ top: 0, behavior: "smooth" });
          }),
      );
      qa("[data-nudge]").forEach(
        (b) =>
          (b.onclick = () => {
            const m = c.modules.find((x) => x.id === selected),
              before = clone(m),
              dir = b.dataset.nudge,
              loose = ["island", "free"].includes(m.run),
              verticalWall = ["east", "west"].includes(m.run);
            if (loose) {
              if (dir === "left") m.offset -= 5;
              if (dir === "right") m.offset += 5;
              if (dir === "up") m.crossOffset -= 5;
              if (dir === "down") m.crossOffset += 5;
            } else if ((verticalWall && dir === "up") || (!verticalWall && dir === "left"))
              m.offset -= 5;
            else if ((verticalWall && dir === "down") || (!verticalWall && dir === "right"))
              m.offset += 5;
            snapModule(m);
            c = normalise(c);
            if (modulesCollide(c.modules.find((x) => x.id === selected))) {
              Object.assign(
                c.modules.find((x) => x.id === selected),
                before,
              );
              status(t("Objects cannot overlap.", "آبجکت‌ها نمی‌توانند داخل هم قرار بگیرند."));
            }
            refresh();
          }),
      );
      qa("[data-rotate]").forEach(
        (b) =>
          (b.onclick = () => {
            const m = c.modules.find((x) => x.id === selected),
              before = m.rotation;
            m.rotation = (Number(m.rotation) || 0) + Number(b.dataset.rotate);
            if (m.rotation > 180) m.rotation -= 360;
            if (m.rotation < -180) m.rotation += 360;
            if (modulesCollide(m)) m.rotation = before;
            refresh();
          }),
      );
      qa("[data-add]").forEach(
        (b) =>
          (b.onclick = () => {
            const kind = b.dataset.add,
              loose = ["island", "diningTable", "diningChair"].includes(kind),
              run = kind === "island" ? "island" : loose ? "free" : "north",
              m = newModule(kind, run, 0, kind === "sink" ? 80 : 60, c);
            if (loose) findLoosePosition(m);
            else findOpenPosition(m);
            c.modules.push(m);
            selected = m.id;
            refresh();
          }),
      );
      qa("[data-studio-add]").forEach((b) => (b.onclick = () => studioAdd(b.dataset.studioAdd)));
      q("#kp-remove-wall")?.addEventListener("click", () => {
        c.customWalls = c.customWalls.filter((w) => w.id !== selectedWall);
        c.modules = c.modules.filter((m) => m.run !== selectedWall);
        selectedWall = "north";
        refresh();
      });
      q("#kp-generate")?.addEventListener("click", () => {
        c.modules = generate(c);
        selected = c.modules[0]?.id;
        refresh();
      });
      q("#kp-remove")?.addEventListener("click", () => {
        c.modules = c.modules.filter((m) => m.id !== selected);
        selected = c.modules[0]?.id;
        refresh();
      });
      q("#kp-duplicate")?.addEventListener("click", () => {
        const src = c.modules.find((m) => m.id === selected),
          copy = { ...clone(src), id: id() };
        ["island", "free"].includes(copy.run) ? findLoosePosition(copy) : findOpenPosition(copy);
        c.modules.push(copy);
        selected = copy.id;
        refresh();
      });
      q("#kp-save")?.addEventListener("click", save);
      q("#kp-json")?.addEventListener("click", downloadJSON);
      q("#kp-svg")?.addEventListener("click", downloadSVG);
      q("#kp-csv")?.addEventListener("click", downloadCSV);
      q("#kp-spec")?.addEventListener("click", downloadSpec);
    }
    /** injectDoorActions: kitchen-planner feature. Keep related handlers in this module. */
    function injectDoorActions() {
      if (step !== "units") return;
      const m = c.modules.find((x) => x.id === selected),
        advanced = q(".kp-advanced");
      if (
        !m ||
        !advanced ||
        ["diningTable", "diningChair"].includes(m.kind) ||
        m.front === "appliance"
      )
        return;
      advanced.insertAdjacentHTML(
        "beforebegin",
        window.SHN_TEMPLATES.render("shahrniaz/08-kitchen-planner/injectDoorActions-7", [
          window.SHN_TEMPLATES.text(t("Cabinet experience", "حالت کابینت")),
          window.SHN_TEMPLATES.text(m.doorState === "closed"),
          window.SHN_TEMPLATES.text(t("Doors closed", "درها بسته")),
          window.SHN_TEMPLATES.text(m.doorState === "open"),
          window.SHN_TEMPLATES.text(t("Doors open", "درها باز")),
          window.SHN_TEMPLATES.text(m.frontType === "solid"),
          window.SHN_TEMPLATES.text(t("Solid", "توپر")),
          window.SHN_TEMPLATES.text(m.frontType === "glass"),
          window.SHN_TEMPLATES.text(t("Glass", "شیشه‌ای")),
          window.SHN_TEMPLATES.text(m.internalLight === "off"),
          window.SHN_TEMPLATES.text(t("Light off", "نور خاموش")),
          window.SHN_TEMPLATES.text(m.internalLight === "warm"),
          window.SHN_TEMPLATES.text(t("Warm LED", "نور گرم")),
        ]),
      );
      qa("[data-door-prop]").forEach(
        (b) =>
          (b.onclick = () => {
            m[b.dataset.doorProp] = b.dataset.value;
            refresh();
          }),
      );
    }
    /** refresh: kitchen-planner feature. Keep related handlers in this module. */
    function refresh(redrawPanel = true) {
      c = normalise(c);
      if (!c.modules.some((m) => m.id === selected)) selected = c.modules[0]?.id;
      drawPlan();
      viewer?.update(c, { selectedModule: selected, selectedWall });
      q("#kp-room-summary").textContent =
        `${c.width} × ${c.depth} × ${c.height} cm · ${c.modules.length} ${t("objects", "آبجکت")}`;
      if (redrawPanel) {
        panel();
        injectDoorActions();
      }
      window.SN_CONFIG = {
        type: "kitchen",
        config: clone(c),
        selectedModule: selected,
        selectedWall,
        viewer,
      };
    }
    function select(moduleId) {
      selected = moduleId;
      step = "units";
      drawSteps();
      refresh();
      if (view === "3d") viewer?.render();
    }
    /** drawSteps: kitchen-planner feature. Keep related handlers in this module. */
    function drawSteps() {
      q("#kp-stepbar").innerHTML =
        `<div class="wrap">${steps.map((s) => `<button data-step="${s[0]}" aria-pressed="${step === s[0]}">${s[1]}</button>`).join("")}</div>`;
      qa("[data-step]").forEach(
        (b) =>
          (b.onclick = () => {
            step = b.dataset.step;
            drawSteps();
            panel();
          }),
      );
    }
    function setView(v) {
      view = v;
      const canvas = q(".kp-canvas");
      canvas.dataset.view = v;
      qa("[data-kp-view]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.kpView === v)),
      );
      viewer?.resize();
    }
    /** addDiningSet: kitchen-planner feature. Keep related handlers in this module. */
    function addDiningSet() {
      const table = newModule("diningTable", "free", 0, 160, c);
      table.crossOffset = 75;
      c.modules.push(table);
      const spots = [
        [-115, 75, 90],
        [115, 75, -90],
        [-115, 0, 90],
        [115, 0, -90],
      ];
      spots.forEach(([offset, crossOffset, rotation]) => {
        const chair = newModule("diningChair", "free", offset, 50, c);
        Object.assign(chair, { crossOffset, rotation });
        c.modules.push(chair);
      });
    }
    function closeOnboarding() {
      q("#kp-onboard").classList.add("hidden");
      document.body.classList.remove("onboarding-open");
      setTimeout(() => viewer?.resize(), 50);
    }
    /** bindOnboarding: kitchen-planner feature. Keep related handlers in this module. */
    function bindOnboarding() {
      document.body.classList.add("onboarding-open");
      const root = q(".kp-onboard-inner"),
        row = (key, title, fa, options) =>
          `<section class="kp-need-row"><h2>${t(title, fa)}</h2><div>${options.map((o, i) => `<button data-need="${key}" data-value="${o[0]}" aria-pressed="${i === 0}"><i>${o[1]}</i><span><b>${t(o[2], o[3])}</b><small>${t(o[4], o[5])}</small></span></button>`).join("")}</div></section>`;
      root.innerHTML = window.SHN_TEMPLATES.render(
        "shahrniaz/08-kitchen-planner/bindOnboarding-8",
        [
          window.SHN_TEMPLATES.text(
            t("Step 1 of 5 · Your kitchen needs", "مرحلهٔ ۱ از ۵ · نیازهای آشپزخانه"),
          ),
          window.SHN_TEMPLATES.text(
            t("Let’s build around<br>how you live.", "بیایید بر اساس<br>شیوهٔ زندگی شما بسازیم."),
          ),
          window.SHN_TEMPLATES.text(
            t(
              "Four quick choices give the planner a useful starting point. Everything can be changed later.",
              "چهار انتخاب کوتاه، نقطهٔ شروع مناسبی می‌سازد. بعداً همه‌چیز قابل تغییر است.",
            ),
          ),
          window.SHN_TEMPLATES.text(
            row("oven", "Where should the oven go?", "فر کجا قرار بگیرد؟", [
              [
                "both",
                "◫",
                "Show both options",
                "هر دو گزینه",
                "Built-in or below the worktop",
                "توکار یا زیر صفحه",
              ],
              [
                "tall",
                "▥",
                "In a tall unit",
                "داخل کمد بلند",
                "Comfortable eye level",
                "در ارتفاع مناسب",
              ],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            row("hood", "What kind of extractor?", "چه نوع هودی؟", [
              [
                "wall",
                "⌂",
                "Wall or ceiling",
                "دیواری یا سقفی",
                "Visible architectural element",
                "عنصر معماری نمایان",
              ],
              [
                "integrated",
                "▬",
                "Integrated",
                "مخفی",
                "Hidden inside cabinetry",
                "پنهان داخل کابینت",
              ],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            row("fridge", "How should the fridge look?", "یخچال چگونه دیده شود؟", [
              [
                "integrated",
                "▥",
                "Integrated",
                "توکار",
                "A continuous cabinet front",
                "نمای یکپارچه",
              ],
              [
                "freestanding",
                "▤",
                "Freestanding",
                "مستقل",
                "Visible steel or colour",
                "استیل یا رنگ نمایان",
              ],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            row("layout", "Which layout feels closest?", "کدام فرم نزدیک‌تر است؟", [
              ["l", "⌜", "L-shaped", "اِل شکل", "Two connected runs", "دو ردیف متصل"],
              ["u", "⊔", "U-shaped", "یو شکل", "Three working sides", "سه ضلع کاری"],
              ["straight", "—", "Straight", "خطی", "One clear wall", "یک دیوار اصلی"],
            ]),
          ),
          window.SHN_TEMPLATES.text(
            t("Include an island in suggestions", "جزیره را در پیشنهادها لحاظ کن"),
          ),
          window.SHN_TEMPLATES.text(
            t("Only when the starting clearance is workable", "فقط وقتی فاصلهٔ اولیه مناسب باشد"),
          ),
          window.SHN_TEMPLATES.text(t("Define my space", "تعریف فضای من")),
          window.SHN_TEMPLATES.text(t("Open an empty room", "ورود به فضای خالی")),
        ],
      );
      qa("[data-need]").forEach(
        (b) =>
          (b.onclick = () => {
            needs[b.dataset.need] = b.dataset.value;
            qa(`[data-need="${b.dataset.need}"]`).forEach((x) =>
              x.setAttribute("aria-pressed", String(x === b)),
            );
          }),
      );
      const start = () => {
        needs.island = !!q("#kp-need-island")?.checked;
        c.layout = needs.layout;
        c.hoodStyle = needs.hood === "integrated" ? "integrated" : "chimney";
        c.fridgeStyle = needs.fridge === "integrated" ? "blackFrench" : "steelSide";
        c.modules = generate(c);
        selected = c.modules[0]?.id;
        step = "room";
        drawSteps();
        refresh();
        closeOnboarding();
        status(
          t(
            "Now define the room. Then choose one of three generated suggestions.",
            "اکنون فضا را تعریف کنید؛ سپس یکی از سه پیشنهاد تولیدشده را انتخاب کنید.",
          ),
        );
      };
      q("#kp-onboard-go").onclick = start;
      q("#kp-onboard-skip").onclick = start;
    }
    function blob(content, name, mime) {
      const a = document.createElement("a"),
        url = URL.createObjectURL(new Blob([content], { type: mime }));
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function record() {
      return {
        schema: "shahrniaz-kitchen-project",
        version: 2,
        units: "cm",
        fabricationUnits: "mm",
        status: "workshop-review-required",
        config: clone(c),
        checks: checks(c),
        estimate: price(c),
      };
    }
    function save() {
      localStorage.setItem("sn-kitchen-project", JSON.stringify(record()));
      status(t("Project saved on this device.", "پروژه در این دستگاه ذخیره شد."));
    }
    function downloadJSON() {
      blob(
        JSON.stringify(record(), null, 2),
        "Shahr-Niaz-kitchen-project.json",
        "application/json",
      );
    }
    /** downloadSVG: kitchen-planner feature. Keep related handlers in this module. */
    function downloadSVG() {
      const svg = q("#kitchen-plan").cloneNode(true);
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      style.textContent =
        ".room-fill{fill:#f2f0ea}.walls{fill:none;stroke:#222}.plan-module rect{fill:#b59b72;stroke:#222}.plan-module text{font:12px sans-serif;text-anchor:middle}.dimensions{stroke:#555;fill:#555}.dimensions text{stroke:none;font:14px sans-serif;text-anchor:middle}.door-opening{stroke:#f2f0ea;stroke-width:18}.window-opening{stroke:#6b8790;stroke-width:10}";
      svg.prepend(style);
      blob(
        new XMLSerializer().serializeToString(svg),
        "Shahr-Niaz-kitchen-plan.svg",
        "image/svg+xml",
      );
    }
    /** cutRows: kitchen-planner feature. Keep related handlers in this module. */
    function cutRows() {
      const rows = [
        ["Module", "Part", "Quantity", "Length mm", "Width mm", "Thickness mm", "Material/finish"],
      ];
      c.modules.forEach((m) => {
        const W = Math.round(m.width * 10),
          D = Math.round(m.depth * 10),
          H = Math.round(m.height * 10),
          finish = m.finish || c.frontMaterial;
        if (["fridge", "dishwasher", "oven", "hood"].includes(m.kind)) {
          rows.push([
            m.id,
            "PURCHASED EQUIPMENT — VERIFY MANUFACTURER DATA SHEET",
            1,
            H,
            W,
            "",
            m.kind,
          ]);
          return;
        }
        if (["diningTable", "diningChair"].includes(m.kind)) {
          rows.push([
            m.id,
            "ROOM OBJECT — COMPLETE IN ITS DEDICATED FURNITURE EDITOR",
            1,
            W,
            D,
            H,
            m.kind,
          ]);
          return;
        }
        rows.push(
          [m.id, "Side", 2, H, D, 18, c.material],
          [m.id, "Top / bottom", 2, W - 36, D, 18, c.material],
          [m.id, "Back", 1, W - 36, H - 36, 3, c.material],
        );
        if (m.shelves) rows.push([m.id, "Shelf", m.shelves, W - 36, D - 20, 18, c.material]);
        if (m.front === "doors")
          rows.push([
            m.id,
            "Door",
            m.doors,
            Math.round((W - 4 * (m.doors + 1)) / m.doors),
            H - 4,
            18,
            finish,
          ]);
        if (m.front === "drawers")
          rows.push([
            m.id,
            "Drawer front",
            m.drawers,
            W - 4,
            Math.round((H - 4 * (m.drawers + 1)) / m.drawers),
            18,
            finish,
          ]);
      });
      return rows;
    }
    function downloadCSV() {
      blob(
        "\uFEFF" +
          cutRows()
            .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
            .join("\n"),
        "Shahr-Niaz-kitchen-cut-list.csv",
        "text/csv;charset=utf-8",
      );
    }
    /** downloadSpec: kitchen-planner feature. Keep related handlers in this module. */
    function downloadSpec() {
      const issue = checks(c),
        text = [
          `SHAHR NIAZ / KITCHEN WORKSHOP REVIEW`,
          `Room: ${c.width * 10} × ${c.depth * 10} × ${c.height * 10} mm`,
          `Wall: ${c.wallThickness * 10} mm`,
          `Door: ${c.doorWall} / ${c.doorOffset * 10} / ${c.doorWidth * 10} mm`,
          `Window: ${c.windowWall} / ${c.windowOffset * 10} / ${c.windowWidth * 10} / sill ${c.windowSill * 10} mm`,
          "",
          ...c.modules.map(
            (m) =>
              `${m.id} | ${m.kind} | ${m.run} @ x ${m.offset * 10} / y ${m.crossOffset * 10} mm | angle ${m.rotation || 0}° | ${m.width * 10} × ${m.depth * 10} × ${m.height * 10} mm | elevation ${m.elevation * 10} mm | ${m.front}`,
          ),
          "",
          "REVIEW FLAGS",
          ...issue.map((x) => `${x[0].toUpperCase()}: ${x[3]}`),
          "",
          "MANDATORY: verify site measure, wall plumb/square, services, appliance data sheets, panel system, hardware drilling, fillers, scribes, clearances and local code before production.",
          "",
          JSON.stringify(record(), null, 2),
        ].join("\n");
      blob(
        "\uFEFF" + text,
        "Shahr-Niaz-kitchen-workshop-specification.txt",
        "text/plain;charset=utf-8",
      );
    }
    /** moveFrom3D: kitchen-planner feature. Keep related handlers in this module. */
    function moveFrom3D(moduleId, point) {
      const m = c.modules.find((x) => x.id === moduleId);
      if (!m) return;
      const before = { offset: m.offset, crossOffset: m.crossOffset };
      if (["island", "free"].includes(m.run)) {
        m.offset = point.x;
        m.crossOffset = point.y;
      } else if (["north", "south"].includes(m.run)) m.offset = point.x + c.width / 2 - m.width / 2;
      else m.offset = point.y + c.depth / 2 - m.width / 2;
      c = normalise(c);
      const moved = c.modules.find((x) => x.id === moduleId);
      snapModule(moved);
      if (modulesCollide(moved)) Object.assign(moved, before);
      selected = moduleId;
      drawPlan();
      panel();
      viewer?.update(c, { selectedModule: selected, selectedWall });
      window.SN_CONFIG = { type: "kitchen", config: clone(c), selectedModule: selected, viewer };
    }
    function selectWall(wall) {
      selectedWall = wall;
      step = "room";
      drawSteps();
      refresh();
    }
    function status(text) {
      q("#kp-status").textContent = text;
    }
    drawSteps();
    panel();
    drawPlan();
    bindWallDrag();
    try {
      viewer = new Furniture3D.Viewer(host, "kitchen", c, {
        label: t("Linked 3D kitchen model", "مدل سه‌بعدی هم‌زمان آشپزخانه"),
        selectedModule: selected,
        selectedWall,
        onSelectModule: select,
        onSelectWall: selectWall,
        onMoveModule: moveFrom3D,
      });
    } catch (e) {
      host.innerHTML = `<div class="render-fallback"><h2>${t("3D unavailable", "نمای سه‌بعدی در دسترس نیست")}</h2><p>${t("The scaled plan and workshop exports remain available.", "پلان مقیاس‌دار و خروجی‌های کارگاهی همچنان در دسترس‌اند.")}</p></div>`;
    }
    qa("[data-kp-view]").forEach((b) => (b.onclick = () => setView(b.dataset.kpView)));
    bindOnboarding();
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("sn-kitchen-project") || "null");
    } catch {}
    if (saved?.schema === "shahrniaz-kitchen-project") {
      const restore = document.createElement("button");
      restore.className = "kp-restore";
      restore.textContent = t("Open saved kitchen project", "بازکردن پروژهٔ ذخیره‌شده");
      restore.onclick = () => {
        c = normalise(saved.config);
        selected = c.modules[0]?.id;
        refresh();
        closeOnboarding();
        status(t("Saved project opened.", "پروژهٔ ذخیره‌شده باز شد."));
      };
      q(".kp-panel").prepend(restore);
    }
    const liveRestore = (e) => {
      if (e.detail?.type === "kitchen") {
        c = normalise(e.detail.config);
        selected = c.modules[0]?.id;
        refresh();
      }
    };
    window.addEventListener("sn-restore-live", liveRestore);
    refresh();
    instance = {
      dispose: () => {
        viewer?.dispose();
        document.body.classList.remove("onboarding-open");
        window.removeEventListener("sn-restore-live", liveRestore);
      },
      getConfig: () => clone(c),
    };
    return instance;
  }
  function dispose() {
    instance?.dispose();
    instance = null;
  }
  return { page, mount, dispose };
})();
