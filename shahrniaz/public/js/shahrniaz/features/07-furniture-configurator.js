/* مسئولیت این فایل: کنترل‌های تغییر ابعاد و جنس، ذخیره و خروجی طرح مبلمان. */
/** Shahr Niaz: furniture-configurator. Original execution order: 7. */
window.Configurator = (() => {
  const D = window.FURNITURE,
    S = window.FurnitureState;
  let instance = null;
  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const saveFile = (content, name, mime) => {
    const a = document.createElement("a"),
      url = URL.createObjectURL(new Blob([content], { type: mime }));
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  /** page: furniture-configurator feature. Keep related handlers in this module. */
  function page(type, lang) {
    const t = (en, fa) => window.siteTranslate(en, fa),
      tx = (a) => t(...a),
      model = D.types[type];
    if (!model) return "";
    return window.SHN_TEMPLATES.render("shahrniaz/07-furniture-configurator/page-1", [
      window.SHN_TEMPLATES.text(type),
      window.SHN_TEMPLATES.text(t("Products", "محصولات")),
      window.SHN_TEMPLATES.text(t("Made for you", "به انتخاب شما")),
      window.SHN_TEMPLATES.text(tx(model.single)),
      window.SHN_TEMPLATES.text(t("Customisable in 3D", "قابل شخصی‌سازی سه‌بعدی")),
      window.SHN_TEMPLATES.text(t("View direction", "جهت دید")),
      window.SHN_TEMPLATES.text(
        [
          ["perspective", "3D", "سه‌بعدی"],
          ["front", "Front", "روبرو"],
          ["side", "Side", "کنار"],
          ["top", "Top", "بالا"],
        ]
          .map(
            ([id, en, fa]) =>
              `<button data-view="${id}" aria-pressed="${id === "perspective"}">${t(en, fa)}</button>`,
          )
          .join(""),
      ),
      window.SHN_TEMPLATES.text(t("Download preview image", "دانلود تصویر طرح")),
      window.SHN_TEMPLATES.text(t("Image", "تصویر")),
      window.SHN_TEMPLATES.text(
        t(
          "Drag to turn · scroll or pinch to zoom",
          "بکشید تا بچرخد · برای زوم از دو انگشت استفاده کنید",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Zoom out", "کوچک‌نمایی")),
      window.SHN_TEMPLATES.text(t("Reset view", "بازنشانی دید")),
      window.SHN_TEMPLATES.text(t("Zoom in", "بزرگ‌نمایی")),
      window.SHN_TEMPLATES.text(
        type === "cabinet"
          ? `<label class="inside-toggle"><input id="inside-toggle" type="checkbox"> ${t("Look inside", "نمایش داخل کمد")}</label>`
          : "",
      ),
      window.SHN_TEMPLATES.text(lang === "fa" ? "rtl" : "ltr"),
      window.SHN_TEMPLATES.text(
        type === "kitchen"
          ? t("Build your kitchen.", "آشپزخانه‌تان را بچینید.")
          : t("Make it your own.", "برای خودتان طراحی کنید."),
      ),
      window.SHN_TEMPLATES.text(
        type === "kitchen"
          ? t("Choose a plan, finishes and appliances.", "فرم، متریال و تجهیزات را انتخاب کنید.")
          : t(
              "Choose a size. Try a material. See it change.",
              "ابعاد را انتخاب کنید. متریال را عوض کنید. نتیجه را ببینید.",
            ),
      ),
      window.SHN_TEMPLATES.text(t("Customisation steps", "بخش‌های شخصی‌سازی")),
      window.SHN_TEMPLATES.text(t("Size", "ابعاد")),
      window.SHN_TEMPLATES.text(t("Materials", "متریال")),
      window.SHN_TEMPLATES.text(
        ["cabinet", "kitchen"].includes(type) ? t("Layout", "چیدمان") : t("Details", "جزئیات"),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Suggested design ranges and provisional prices. Final dimensions, services, materials and quotation are reviewed before manufacture.",
          "ابعاد و قیمت‌ها پیشنهادی‌اند. ابعاد، تأسیسات، متریال و قیمت نهایی پیش از ساخت بررسی می‌شوند.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Save my design", "ذخیرهٔ طرح من")),
      window.SHN_TEMPLATES.text(t("Download design", "دانلود فایل طرح")),
      window.SHN_TEMPLATES.text(t("Open design", "بازکردن طرح")),
      window.SHN_TEMPLATES.text(t("Saved on this device", "طرح ذخیره‌شده در این دستگاه")),
      window.SHN_TEMPLATES.text(t("Reset this design", "بازنشانی این طرح")),
      window.SHN_TEMPLATES.text(t("Download specifications", "دانلود مشخصات")),
    ]);
  }
  /** mount: furniture-configurator feature. Keep related handlers in this module. */
  function mount(type, lang) {
    dispose();
    const t = (en, fa) => window.siteTranslate(en, fa),
      tx = (a) => t(...a),
      model = D.types[type];
    let c = S.normalise(type),
      selected = 0,
      inside = type !== "cabinet",
      panel = "dimensions",
      viewer = null;
    const q = (s) => document.querySelector(s),
      qa = (s) => [...document.querySelectorAll(s)];
    const host = q("#furniture-stage");
    if (!host) return;
    const labels = {
      width: t("Width", "طول"),
      depth: t("Depth", "عمق"),
      height: t("Height", "ارتفاع"),
      thickness: t("Top thickness", "ضخامت صفحه"),
      seatHeight: t("Seat height", "ارتفاع نشیمن"),
      armWidth: t("Arm width", "پهنای دسته"),
      seats: t("Seat cushions", "تعداد نشیمن"),
      columns: t("Compartments", "تعداد بخش‌ها"),
    };
    const range = (key, min, max, step = 1, value = c[key], label = labels[key], unit = "cm") =>
      window.SHN_TEMPLATES.render("shahrniaz/07-furniture-configurator/range-2", [
        window.SHN_TEMPLATES.text(key),
        window.SHN_TEMPLATES.text(label),
        window.SHN_TEMPLATES.text(key),
        window.SHN_TEMPLATES.text(key),
        window.SHN_TEMPLATES.text(min),
        window.SHN_TEMPLATES.text(max),
        window.SHN_TEMPLATES.text(step),
        window.SHN_TEMPLATES.text(Math.round(value * 10) / 10),
        window.SHN_TEMPLATES.text(label),
        window.SHN_TEMPLATES.text(unit === "cm" ? t("cm", "سانتی‌متر") : ""),
        window.SHN_TEMPLATES.text(key),
        window.SHN_TEMPLATES.text(key),
        window.SHN_TEMPLATES.text(min),
        window.SHN_TEMPLATES.text(max),
        window.SHN_TEMPLATES.text(step),
        window.SHN_TEMPLATES.text(value),
        window.SHN_TEMPLATES.text(label),
        window.SHN_TEMPLATES.text(min),
        window.SHN_TEMPLATES.text(max),
      ]);
    const choice = (key, title, options) =>
      `<fieldset class="choice-group"><legend>${title}</legend><div class="choices">${options.map(([id, en, fa]) => `<button data-choice="${key}" data-value="${id}" aria-pressed="${String(c[key]) === String(id)}">${t(en, fa)}</button>`).join("")}</div></fieldset>`;
    const swatches = (key, title, ids, source = D.materials) =>
      `<fieldset class="swatch-group"><legend>${title} <span id="selected-${key}">${tx(source[c[key]].name)}</span></legend><div class="swatches">${ids.map((id) => window.SHN_TEMPLATES.render("shahrniaz/07-furniture-configurator/swatches-3", [window.SHN_TEMPLATES.text(key), window.SHN_TEMPLATES.text(id), window.SHN_TEMPLATES.text(tx(source[id].name)), window.SHN_TEMPLATES.text(c[key] === id), window.SHN_TEMPLATES.text(tx(source[id].name)), window.SHN_TEMPLATES.text(source[id].kind || ""), window.SHN_TEMPLATES.text(source[id].color), window.SHN_TEMPLATES.text(tx(source[id].name))])).join("")}</div></fieldset>`;
    /** details: furniture-configurator feature. Keep related handlers in this module. */
    function details() {
      if (type === "table")
        return (
          choice("legs", t("Base", "پایه"), [
            ["four", "Four legs", "چهار پایه"],
            ["trestle", "Panel legs", "پایهٔ صفحه‌ای"],
            ["pedestal", "Central base", "پایهٔ مرکزی"],
          ]) +
          choice("edge", t("Edge", "لبه"), [
            ["soft", "Soft edge", "لبهٔ نرم"],
            ["square", "Straight edge", "لبهٔ صاف"],
          ]) +
          range("thickness", ...model.ranges.thickness)
        );
      if (type === "chair")
        return (
          range("seatHeight", ...model.ranges.seatHeight) +
          choice("arms", t("Armrests", "دسته"), [
            ["false", "Without arms", "بدون دسته"],
            ["true", "With arms", "با دسته"],
          ])
        );
      if (type === "sofa")
        return (
          range("seatHeight", ...model.ranges.seatHeight) +
          range("armWidth", ...model.ranges.armWidth) +
          choice("seats", t("Seat layout", "چیدمان نشیمن"), [
            [2, "Two", "دو قسمت"],
            [3, "Three", "سه قسمت"],
            [4, "Four", "چهار قسمت"],
          ]) +
          choice("tufted", t("Backrest buttons", "دکمه‌های پشتی"), [
            ["false", "Plain", "ساده"],
            ["true", "Button detail", "دکمه‌دار"],
          ])
        );
      if (type === "kitchen")
        return (
          choice("layout", t("Kitchen plan", "فرم آشپزخانه"), [
            ["straight", "Straight", "خطی"],
            ["l", "L-shaped", "اِل شکل"],
            ["u", "U-shaped", "یو شکل"],
          ]) +
          choice("doorStyle", t("Door model", "مدل در"), [
            ["slab", "Plain slab", "صفحهٔ ساده"],
            ["shaker", "Framed", "قاب‌دار"],
          ]) +
          choice("groove", t("Door detail", "طرح و شیار در"), [
            ["none", "Clean", "ساده"],
            ["vertical", "Vertical grooves", "شیار عمودی"],
            ["frame", "Frame line", "خط قاب"],
          ]) +
          choice("handles", t("Handles", "دستگیره"), [
            ["bar", "Bar", "خطی"],
            ["knob", "Knob", "دکمه‌ای"],
            ["profile", "Integrated profile", "پروفیل مخفی"],
            ["none", "Touch-open", "بدون دستگیره"],
          ]) +
          `<h3 class="bay-heading">${t("Appliances & elements", "تجهیزات و عناصر")}</h3>` +
          [
            ["sink", "Sink", "سینک"],
            ["hob", "Hob", "گاز رومیزی"],
            ["hood", "Hood", "هود"],
            ["dishwasher", "Dishwasher", "ماشین ظرف‌شویی"],
            ["oven", "Oven", "فر"],
            ["fridge", "Fridge", "یخچال"],
            ["island", "Island", "جزیره"],
          ]
            .map(([id, en, fa]) =>
              choice(id, t(en, fa), [
                ["true", "Included", "دارد"],
                ["false", "Remove", "حذف"],
              ]),
            )
            .join("")
        );
      const b = c.bays[selected];
      return window.SHN_TEMPLATES.render("shahrniaz/07-furniture-configurator/details-4", [
        window.SHN_TEMPLATES.text(
          t(
            "Choose a compartment below, or click it in the 3D view.",
            "یک بخش را از اینجا یا از روی مدل سه‌بعدی انتخاب کنید.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          range(
            "columns",
            1,
            Math.min(6, Math.floor(c.width / 40)),
            1,
            c.columns,
            labels.columns,
            "count",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Select compartment", "انتخاب بخش کمد")),
        window.SHN_TEMPLATES.text(
          c.bays
            .map(
              (b, i) =>
                `<button data-bay="${i}" aria-pressed="${selected === i}"><span class="bay-drawing ${b.type}"></span><span>${i + 1}</span></button>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(t("Compartment", "بخش")),
        window.SHN_TEMPLATES.text(selected + 1),
        window.SHN_TEMPLATES.text(
          c.columns > 1
            ? range(
                "bayWidth",
                37,
                Math.floor(c.width - 36 * (c.columns - 1) - 1),
                1,
                b.actualWidth,
                t("Compartment width", "پهنای این بخش"),
              )
            : "",
        ),
        window.SHN_TEMPLATES.text(t("Inside", "داخل کمد")),
        window.SHN_TEMPLATES.text(
          [
            ["hang", "Hanging", "رگال"],
            ["shelves", "Shelves", "طبقه"],
            ["drawers", "Drawers", "کشو"],
          ]
            .map(
              ([id, en, fa]) =>
                `<button data-bay-type="${id}" aria-pressed="${b.type === id}">${t(en, fa)}</button>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(
          b.type !== "hang"
            ? range("shelves", 1, 6, 1, b.shelves, t("Shelves", "تعداد طبقه"), "count")
            : "",
        ),
        window.SHN_TEMPLATES.text(
          b.type === "drawers"
            ? range("drawers", 1, 4, 1, b.drawers, t("Drawers", "تعداد کشو"), "count")
            : "",
        ),
        window.SHN_TEMPLATES.text(
          choice("doors", t("Front", "نمای جلو"), [
            ["true", "With doors", "با در"],
            ["false", "Open storage", "بدون در"],
          ]),
        ),
        window.SHN_TEMPLATES.text(
          c.doors
            ? choice("doorStyle", t("Door model", "مدل در"), [
                ["slab", "Plain slab", "صفحهٔ ساده"],
                ["shaker", "Framed", "قاب‌دار"],
              ]) +
                choice("groove", t("Door detail", "طرح و شیار در"), [
                  ["none", "Clean", "ساده"],
                  ["vertical", "Vertical grooves", "شیار عمودی"],
                  ["frame", "Frame line", "خط قاب"],
                ]) +
                choice("handles", t("Handles", "دستگیره"), [
                  ["bar", "Bar", "خطی"],
                  ["knob", "Knob", "دکمه‌ای"],
                  ["none", "Touch-open", "بدون دستگیره"],
                ])
            : "",
        ),
      ]);
    }
    /** materials: furniture-configurator feature. Keep related handlers in this module. */
    function materials() {
      let html = swatches(
        "material",
        type === "sofa"
          ? t("Legs", "پایه‌ها")
          : type === "chair"
            ? t("Frame", "بدنه")
            : ["cabinet", "kitchen"].includes(type)
              ? t("Cabinet body", "بدنهٔ کابینت")
              : t("Tabletop", "صفحهٔ میز"),
        type === "table"
          ? ["oak", "walnut", "ash", "stone", "black"]
          : ["oak", "walnut", "ash", "white", "black"],
      );
      if (type === "table")
        html += swatches("baseMaterial", t("Base material", "متریال پایه"), [
          "oak",
          "walnut",
          "black",
          "metal",
        ]);
      if (["cabinet", "kitchen"].includes(type))
        html += swatches("frontMaterial", t("Door finish & colour", "متریال و رنگ درها"), [
          "oak",
          "walnut",
          "ash",
          "white",
          "black",
          "lacquerSand",
          "lacquerOlive",
          "lacquerClay",
          "lacquerBlue",
        ]);
      if (type === "kitchen")
        html += swatches("counterMaterial", t("Worktop", "صفحهٔ روی کابینت"), [
          "stone",
          "marble",
          "oak",
          "black",
        ]);
      if (["sofa", "chair"].includes(type))
        html +=
          choice("upholstery", t("Upholstery", "روکش"), [
            ["fabric", "Fabric", "پارچه"],
            ["leather", "Leather", "چرم"],
          ]) + swatches("color", t("Colour", "رنگ"), Object.keys(D.colors), D.colors);
      return (
        html +
        `<p class="material-note">${t("Colours and textures are visual approximations.", "رنگ و بافت در تصویر تقریبی است.")}</p>`
      );
    }
    /** drawPanels: furniture-configurator feature. Keep related handlers in this module. */
    function drawPanels() {
      q("#control-panels").innerHTML = window.SHN_TEMPLATES.render(
        "shahrniaz/07-furniture-configurator/drawPanels-5",
        [
          window.SHN_TEMPLATES.text(panel !== "dimensions" ? "hidden" : ""),
          window.SHN_TEMPLATES.text(t("All dimensions in centimetres", "همهٔ ابعاد به سانتی‌متر")),
          window.SHN_TEMPLATES.text(
            ["width", "depth", "height"].map((k) => range(k, ...model.ranges[k])).join(""),
          ),
          window.SHN_TEMPLATES.text(panel !== "materials" ? "hidden" : ""),
          window.SHN_TEMPLATES.text(materials()),
          window.SHN_TEMPLATES.text(panel !== "details" ? "hidden" : ""),
          window.SHN_TEMPLATES.text(details()),
        ],
      );
      bindPanels();
    }
    function setPanel(value) {
      panel = value;
      qa("[data-controls]").forEach((e) => (e.hidden = e.dataset.controls !== panel));
      qa("[data-panel]").forEach((e) =>
        e.setAttribute("aria-pressed", String(e.dataset.panel === panel)),
      );
    }
    /** sync: furniture-configurator feature. Keep related handlers in this module. */
    function sync() {
      qa("[data-range],[data-number]").forEach((input) => {
        const key = input.dataset.range || input.dataset.number;
        let value =
          key === "bayWidth"
            ? c.bays[selected].actualWidth
            : ["shelves", "drawers"].includes(key)
              ? c.bays?.[selected]?.[key]
              : c[key];
        if (Number.isFinite(value) && document.activeElement !== input)
          input.value = Math.round(value * 10) / 10;
      });
      qa("[data-choice]").forEach((b) =>
        b.setAttribute("aria-pressed", String(String(c[b.dataset.choice]) === b.dataset.value)),
      );
      qa("[data-bay-type]").forEach((b) =>
        b.setAttribute("aria-pressed", String(c.bays?.[selected]?.type === b.dataset.bayType)),
      );
      for (const k of ["material", "frontMaterial", "baseMaterial", "counterMaterial", "color"])
        if (q("#selected-" + k))
          q("#selected-" + k).textContent = tx((k === "color" ? D.colors : D.materials)[c[k]].name);
      q("#scene-dimensions").textContent =
        `${c.width} × ${c.depth} × ${c.height} ${t("cm", "سانتی‌متر")}`;
      q("#stage-measurements").innerHTML =
        `<span>${t("W", "طول")} ${c.width}</span><span>${t("D", "عمق")} ${c.depth}</span><span>${t("H", "ارتفاع")} ${c.height}</span>`;
      const estimate = S.estimate(type, c),
        format = (value) => new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(value);
      q("#config-summary").innerHTML =
        `<span>${t("Your configuration", "انتخاب شما")}</span><strong>${c.width} × ${c.depth} × ${c.height} ${t("cm", "سانتی‌متر")}</strong><small>${tx(D.materials[c.material].name)}${c.upholstery ? " · " + tx(D.upholstery[c.upholstery].name) + " · " + tx(D.colors[c.color].name) : ""}${type === "cabinet" ? " · " + c.columns + " " + t("compartments", "بخش") : ""}</small>${estimate.total ? `<div class="live-price"><span>${t("Live design estimate", "پیش‌برآورد زندهٔ طراحی")}</span><b>${format(estimate.total)} ${t("IRR", "ریال")}</b><details><summary>${t("Price breakdown", "ریز برآورد")}</summary>${estimate.parts.map((p) => `<div><span>${tx(p.name)}</span><span>${format(p.value)}</span></div>`).join("")}</details></div>` : ""}`;
      window.SN_CONFIG = { type, config: S.clone(c), selected, inside, viewer };
    }
    /** update: furniture-configurator feature. Keep related handlers in this module. */
    function update(key, value, refresh = false) {
      const oldColumns = c.columns;
      if (key === "bayWidth") c = S.bayWidth(c, selected, value);
      else if (["shelves", "drawers"].includes(key)) c.bays[selected][key] = value;
      else c[key] = value;
      c = S.normalise(type, c);
      selected = Math.min(selected, (c.bays?.length || 1) - 1);
      viewer?.update(c, { inside, selected });
      if (refresh || c.columns !== oldColumns) drawPanels();
      sync();
    }
    /** bindPanels: furniture-configurator feature. Keep related handlers in this module. */
    function bindPanels() {
      qa("[data-range]").forEach(
        (input) => (input.oninput = () => update(input.dataset.range, Number(input.value))),
      );
      qa("[data-number]").forEach(
        (input) =>
          (input.onchange = () => {
            const k = input.dataset.number;
            update(k, input.value === "" ? Number(input.min) : Number(input.value));
            input.value =
              k === "bayWidth"
                ? Math.round(c.bays[selected].actualWidth * 10) / 10
                : ["shelves", "drawers"].includes(k)
                  ? c.bays[selected][k]
                  : c[k];
          }),
      );
      qa("[data-choice]").forEach(
        (b) =>
          (b.onclick = () => {
            const key = b.dataset.choice,
              value = ["true", "false"].includes(b.dataset.value)
                ? b.dataset.value === "true"
                : key === "seats"
                  ? Number(b.dataset.value)
                  : b.dataset.value;
            update(key, value, key === "doors");
            if (key === "seats" && c.seats !== value)
              message(
                t(
                  "The seat count was adjusted to fit the selected width.",
                  "تعداد نشیمن با طول انتخابی هماهنگ شد.",
                ),
              );
          }),
      );
      qa("[data-bay]").forEach((b) => (b.onclick = () => selectBay(Number(b.dataset.bay))));
      qa("[data-bay-type]").forEach(
        (b) =>
          (b.onclick = () => {
            c.bays[selected].type = b.dataset.bayType;
            update("bays", c.bays, true);
          }),
      );
    }
    function selectBay(i) {
      selected = Math.max(0, Math.min(c.bays.length - 1, i));
      panel = "details";
      setPanel(panel);
      drawPanels();
      viewer?.update(c, { inside, selected });
      sync();
      q(`[data-bay="${selected}"]`)?.focus({ preventScroll: true });
    }
    function message(text) {
      q("#config-status").textContent = text;
    }
    /** saved: furniture-configurator feature. Keep related handlers in this module. */
    function saved() {
      let data = null;
      try {
        data = JSON.parse(localStorage.getItem("sn-design-" + type) || "null");
      } catch {}
      q("#saved-design").innerHTML = data
        ? `<p>${tx(model.single)} · ${esc(data.config.width)} × ${esc(data.config.depth)} × ${esc(data.config.height)} ${t("cm", "سانتی‌متر")}</p><button id="restore-design">${t("Open saved design", "بازکردن طرح ذخیره‌شده")}</button>`
        : `<p>${t("No saved design yet.", "هنوز طرحی ذخیره نشده است.")}</p>`;
      q("#restore-design")?.addEventListener("click", () => apply(data.config));
    }
    function apply(data) {
      c = S.normalise(type, data);
      selected = 0;
      viewer?.update(c, { inside, selected });
      drawPanels();
      sync();
      message(t("Design opened.", "طرح باز شد."));
    }
    drawPanels();
    try {
      viewer = new Furniture3D.Viewer(host, type, c, {
        inside,
        selected,
        label: t(
          "3D preview. Drag or use arrow keys to rotate; plus and minus to zoom.",
          "نمای سه‌بعدی. با کشیدن یا کلیدهای جهت بچرخانید؛ با مثبت و منفی زوم کنید.",
        ),
        onSelect: selectBay,
      });
    } catch (error) {
      host.insertAdjacentHTML(
        "beforeend",
        `<div class="render-fallback"><h2>${t("3D needs WebGL", "نمای سه‌بعدی به WebGL نیاز دارد")}</h2><p>${t("Enable graphics acceleration or use a browser with WebGL. Your dimensions and design files still work here.", "شتاب گرافیکی مرورگر را فعال کنید یا از مرورگر سازگار با WebGL استفاده کنید. کنترل ابعاد و فایل طرح همچنان کار می‌کنند.")}</p></div>`,
      );
      q("#image-export").disabled = true;
      console.warn("3D unavailable:", error.message);
    }
    sync();
    saved();
    qa("[data-panel]").forEach((b) => (b.onclick = () => setPanel(b.dataset.panel)));
    qa("[data-view]").forEach(
      (b) =>
        (b.onclick = () => {
          viewer?.setView(b.dataset.view);
          qa("[data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        }),
    );
    q("#zoom-out").onclick = () => viewer?.changeZoom(0.1);
    q("#zoom-in").onclick = () => viewer?.changeZoom(-0.1);
    q("#zoom-reset").onclick = () => viewer?.setView("perspective");
    q("#inside-toggle")?.addEventListener("change", (e) => {
      inside = e.target.checked;
      viewer?.update(c, { inside, selected });
      sync();
    });
    q("#reset-design").onclick = () => {
      apply(model.defaults);
      viewer?.setView("perspective");
      message(t("Starting design restored.", "طرح اولیه بازگردانده شد."));
    };
    const record = () => ({
      schema: "shahrniaz-furniture",
      version: 1,
      type,
      units: "cm",
      status: "design-proposal-not-manufacturing-specification",
      config: S.clone(c),
    });
    q("#save-design").onclick = () => {
      try {
        localStorage.setItem("sn-design-" + type, JSON.stringify(record()));
        saved();
        message(
          t(
            "Saved on this device. Nothing was sent.",
            "طرح در این دستگاه ذخیره شد. چیزی ارسال نشده است.",
          ),
        );
      } catch {
        message(
          t(
            "Storage is unavailable. Download your design instead.",
            "ذخیرهٔ مرورگر در دسترس نیست. فایل طرح را دانلود کنید.",
          ),
        );
      }
    };
    q("#export-design").onclick = () => {
      saveFile(
        JSON.stringify(record(), null, 2),
        "Shahr-Niaz-" + type + "-design.json",
        "application/json",
      );
      message(
        t(
          "Design downloaded. Open it here to continue later.",
          "فایل طرح دانلود شد؛ بعداً همین‌جا بازش کنید.",
        ),
      );
    };
    q("#import-design").onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (file.size > 100000) throw Error();
        const data = JSON.parse(await file.text());
        if (
          data.schema !== "shahrniaz-furniture" ||
          data.version !== 1 ||
          data.type !== type ||
          !data.config ||
          data.units !== "cm"
        )
          throw Error();
        apply(data.config);
      } catch {
        message(
          t(
            "Choose a valid saved design for this furniture type.",
            "فایل معتبر ذخیره‌شده برای همین نوع محصول را انتخاب کنید.",
          ),
        );
      }
      e.target.value = "";
    };
    q("#image-export").onclick = () => {
      if (!viewer) return;
      const a = document.createElement("a");
      a.href = viewer.snapshot();
      a.download = "Shahr-Niaz-" + type + "-preview.png";
      a.click();
      message(t("Preview image downloaded.", "تصویر طرح دانلود شد."));
    };
    q("#download-dimensions").onclick = () => {
      let text =
        "SHAHR NIAZ / " +
        tx(model.single) +
        "\n" +
        t(
          "Design proposal and provisional price — review before manufacture",
          "پیشنهاد طراحی و قیمت اولیه — نیازمند بررسی پیش از ساخت",
        ) +
        "\n\n";
      for (const k of ["width", "depth", "height", "thickness", "seatHeight", "armWidth", "seats"])
        if (c[k])
          text +=
            (labels[k] || k) +
            ": " +
            c[k] +
            (k === "seats" ? "" : " " + t("cm", "سانتی‌متر")) +
            "\n";
      for (const k of ["material", "frontMaterial", "baseMaterial", "counterMaterial"])
        if (c[k])
          text +=
            t(
              k === "material"
                ? "Material"
                : k === "frontMaterial"
                  ? "Door finish"
                  : k === "counterMaterial"
                    ? "Worktop"
                    : "Base material",
              k === "material"
                ? "متریال"
                : k === "frontMaterial"
                  ? "متریال در"
                  : k === "counterMaterial"
                    ? "صفحهٔ روی کابینت"
                    : "متریال پایه",
            ) +
            ": " +
            tx(D.materials[c[k]].name) +
            "\n";
      if (c.upholstery)
        text +=
          t("Upholstery", "روکش") +
          ": " +
          tx(D.upholstery[c.upholstery].name) +
          " / " +
          tx(D.colors[c.color].name) +
          "\n";
      if (type === "cabinet") {
        text +=
          t("Doors", "در") + ": " + t(c.doors ? "Yes" : "No", c.doors ? "دارد" : "ندارد") + "\n";
        c.bays.forEach(
          (b, i) =>
            (text += `${t("Compartment", "بخش")} ${i + 1}: ${Math.round(b.actualWidth)} cm / ${tx({ hang: ["Hanging", "رگال"], shelves: ["Shelves", "طبقه"], drawers: ["Drawers", "کشو"] }[b.type])} / ${b.shelves} ${t("shelves", "طبقه")} / ${b.type === "drawers" ? b.drawers : 0} ${t("drawers", "کشو")}\n`),
        );
      }
      const estimate = S.estimate(type, c);
      if (estimate.total) {
        text +=
          "\n" +
          t("PROVISIONAL DESIGN ESTIMATE", "پیش‌برآورد طراحی") +
          ": " +
          estimate.total +
          " IRR\n";
        estimate.parts.forEach((p) => (text += tx(p.name) + ": " + p.value + " IRR\n"));
      }
      text += "\n" + JSON.stringify(record(), null, 2);
      saveFile(
        "\uFEFF" + text,
        "Shahr-Niaz-" + type + "-specification.txt",
        "text/plain;charset=utf-8",
      );
      message(
        t(
          "Specification downloaded. Nothing has been ordered.",
          "مشخصات دانلود شد. سفارشی ثبت نشده است.",
        ),
      );
    };
    const liveRestore = (e) => {
      if (e.detail?.type === type) apply(e.detail.config);
    };
    window.addEventListener("sn-restore-live", liveRestore);
    instance = {
      dispose: () => {
        viewer?.dispose();
        window.removeEventListener("sn-restore-live", liveRestore);
      },
      getConfig: () => S.clone(c),
    };
    return instance;
  }
  function dispose() {
    instance?.dispose();
    instance = null;
    delete window.SN_CONFIG;
  }
  return { page, mount, dispose };
})();
