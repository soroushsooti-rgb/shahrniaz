/* مسئولیت این فایل: وضعیت طرح مبلمان، انتخاب‌ها و ذخیره‌سازی مرورگر. */
/** Shahr Niaz: furniture-state. Original execution order: 5. */
window.FurnitureState = (() => {
  const D = window.FURNITURE,
    clone = (x) => JSON.parse(JSON.stringify(x));
  const clamp = (v, a, b, f = a) =>
    Number.isFinite(Number(v)) ? Math.max(a, Math.min(b, Number(v))) : f;
  /** normalise: furniture-state feature. Keep related handlers in this module. */
  function normalise(type, input = {}) {
    const model = D.types[type];
    if (!model) throw new Error("Unknown furniture type");
    const c = clone(model.defaults);
    for (const [k, [min, max]] of Object.entries(model.ranges))
      c[k] = Math.round(clamp(input[k] ?? c[k], min, max, c[k]));
    for (const k of ["material", "baseMaterial", "frontMaterial", "counterMaterial"])
      if (k in c && D.materials[input[k]]) c[k] = input[k];
    if ("upholstery" in c && D.upholstery[input.upholstery]) c.upholstery = input.upholstery;
    if ("color" in c && D.colors[input.color]) c.color = input.color;
    for (const k of [
      "arms",
      "tufted",
      "doors",
      "sink",
      "hob",
      "hood",
      "dishwasher",
      "oven",
      "fridge",
      "island",
    ])
      if (typeof input[k] === "boolean" && k in c) c[k] = input[k];
    if (type === "table") {
      if (["four", "trestle", "pedestal"].includes(input.legs)) c.legs = input.legs;
      if (["soft", "square"].includes(input.edge)) c.edge = input.edge;
    }
    if (type === "sofa") {
      c.seats = Math.min(c.seats, Math.max(2, Math.floor((c.width - 2 * c.armWidth) / 46)));
      c.height = Math.max(c.height, c.seatHeight + 25);
    }
    if (type === "chair") c.height = Math.max(c.height, c.seatHeight + 25);
    if (type === "cabinet") {
      c.columns = Math.min(c.columns, Math.floor(c.width / 40));
      if (["bar", "knob", "none"].includes(input.handles)) c.handles = input.handles;
      if (["slab", "shaker"].includes(input.doorStyle)) c.doorStyle = input.doorStyle;
      if (["none", "vertical", "frame"].includes(input.groove)) c.groove = input.groove;
      const raw = Array.isArray(input.bays) ? input.bays : [];
      c.bays = Array.from({ length: c.columns }, (_, i) => {
        const b = raw[i] || c.bays[i] || { type: "shelves", shelves: 3, drawers: 2 };
        return {
          type: ["hang", "shelves", "drawers"].includes(b.type) ? b.type : "shelves",
          shelves: Math.round(clamp(b.shelves, 1, 6, 3)),
          drawers: Math.round(clamp(b.drawers, 1, 4, 2)),
          weight: clamp(b.weight, 0.0001, 1000, 1),
        };
      });
      const minimum = 36,
        total = c.bays.reduce((s, b) => s + b.weight, 0),
        available = c.width - minimum * c.columns;
      const widths = c.bays.map((b) => minimum + (available * b.weight) / total);
      c.bays.forEach((b, i) => (b.actualWidth = widths[i]));
    }
    if (type === "kitchen") {
      if (["straight", "l", "u"].includes(input.layout)) c.layout = input.layout;
      if (["bar", "knob", "profile", "none"].includes(input.handles)) c.handles = input.handles;
      if (["slab", "shaker"].includes(input.doorStyle)) c.doorStyle = input.doorStyle;
      if (["none", "vertical", "frame"].includes(input.groove)) c.groove = input.groove;
      if (c.layout === "straight") c.island = false;
    }
    return c;
  }
  /** bayWidth: furniture-state feature. Keep related handlers in this module. */
  function bayWidth(c, index, value) {
    const available = c.width - 36 * c.columns;
    if (available <= 0) return c;
    const w = clamp(value, 36, c.width - 36 * (c.columns - 1), c.bays[index].actualWidth);
    const ratio = (w - 36) / available;
    const others = c.bays.reduce((s, b, i) => s + (i === index ? 0 : b.weight), 0);
    if (c.columns === 1) return c;
    c.bays.forEach(
      (b, i) =>
        (b.weight =
          i === index
            ? Math.max(0.0001, ratio)
            : Math.max(0.0001, ((1 - ratio) * b.weight) / others)),
    );
    return c;
  }
  /** estimate: furniture-state feature. Keep related handlers in this module. */
  function estimate(type, c) {
    let parts = [];
    const add = (id, en, fa, value) => {
      if (value > 0)
        parts.push({ id, name: [en, fa], value: Math.round(value / 1000000) * 1000000 });
    };
    if (type === "cabinet") {
      add("carcass", "Cabinet body", "بدنهٔ کمد", c.width * c.height * 0.0095 * 1000000);
      if (c.doors)
        add(
          "fronts",
          "Doors and finish",
          "درها و پرداخت",
          c.width *
            c.height *
            0.0058 *
            1000000 *
            (D.materials[c.frontMaterial].kind === "paint" ? 1.22 : 1),
        );
      add(
        "interior",
        "Interior fittings",
        "تجهیزات داخلی",
        c.bays.reduce(
          (s, b) => s + 18 + b.shelves * 4 + (b.type === "drawers" ? b.drawers * 13 : 0),
          0,
        ) * 1000000,
      );
      if (c.handles !== "none")
        add(
          "hardware",
          "Handles and hardware",
          "دستگیره و یراق",
          c.columns * (c.handles === "knob" ? 3.5 : 6.5) * 1000000,
        );
    } else if (type === "kitchen") {
      const run =
          c.width +
          (c.layout === "straight" ? 0 : c.depth) +
          (c.layout === "u" ? c.width * 0.72 : 0),
        metres = run / 100;
      add(
        "cabinets",
        "Cabinet runs",
        "یونیت‌های کابینت",
        metres * 118000000 * (D.materials[c.frontMaterial].kind === "paint" ? 1.18 : 1),
      );
      add(
        "worktop",
        "Worktop",
        "صفحهٔ روی کابینت",
        metres * (c.counterMaterial === "marble" ? 52000000 : 34000000),
      );
      add(
        "hardware",
        "Doors and hardware",
        "در و یراق",
        metres * (c.handles === "profile" ? 22000000 : 14000000),
      );
      const appliancePrice = {
        sink: 42000000,
        hob: 85000000,
        hood: 76000000,
        dishwasher: 210000000,
        oven: 145000000,
        fridge: 360000000,
        island: 155000000,
      };
      for (const [key, value] of Object.entries(appliancePrice))
        if (c[key])
          add(
            key,
            {
              sink: "Sink",
              hob: "Hob",
              hood: "Hood",
              dishwasher: "Dishwasher",
              oven: "Oven",
              fridge: "Fridge",
              island: "Island",
            }[key],
            {
              sink: "سینک",
              hob: "گاز رومیزی",
              hood: "هود",
              dishwasher: "ماشین ظرف‌شویی",
              oven: "فر",
              fridge: "یخچال",
              island: "جزیره",
            }[key],
            value,
          );
    }
    return {
      parts,
      total: parts.reduce((s, p) => s + p.value, 0),
      currency: "IRR",
      status: "provisional-design-estimate",
    };
  }
  return { normalise, clone, bayWidth, estimate };
})();
