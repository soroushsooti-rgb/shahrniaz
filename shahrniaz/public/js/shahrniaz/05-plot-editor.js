/* مسئولیت این فایل: ترسیم زمین، نقاط و دیوارها در فرم پروژه. */
/**
 * SHN / shahrniaz / plot-editor
 * Extracted from the original inline script #5.
 * Load order is defined by pages/index.html. See docs/CODE_MAP.fa.md.
 */
(function () {
  "use strict";
  const T = (en, fa) => (document.documentElement.lang === "fa" ? fa : en);
  const W = 1000,
    H = 570;
  /** clean: plot-editor feature. Keep related handlers in this module. */
  function clean(d) {
    if (!Array.isArray(d.plotPoints)) d.plotPoints = [];
    if (!Array.isArray(d.plotWalls)) d.plotWalls = [];
    d.plotClosed = !!d.plotClosed;
    if (!Number.isFinite(+d.plotReference) || +d.plotReference < 0) d.plotReference = "";
    if (!Number.isFinite(+d.plotWallHeight) || +d.plotWallHeight < 0) d.plotWallHeight = "";
  }
  /** metrics: plot-editor feature. Keep related handlers in this module. */
  function metrics(d) {
    let pts = d.plotPoints || [],
      ref = +d.plotReference || 0;
    if (pts.length < 2 || !ref) return null;
    let first = Math.hypot((pts[1][0] - pts[0][0]) * W, (pts[1][1] - pts[0][1]) * H);
    if (first < 1) return null;
    let scale = ref / first,
      edges = [];
    for (let i = 0; i < pts.length - (d.plotClosed ? 0 : 1); i++) {
      let a = pts[i],
        b = pts[(i + 1) % pts.length],
        dx = (b[0] - a[0]) * W,
        dy = (b[1] - a[1]) * H;
      edges.push({
        length: Math.hypot(dx, dy) * scale,
        angle: ((Math.atan2(-dy, dx) * 180) / Math.PI + 360) % 360,
      });
    }
    let area = null;
    if (d.plotClosed && pts.length >= 3) {
      let twice = 0;
      for (let i = 0; i < pts.length; i++) {
        let a = pts[i],
          b = pts[(i + 1) % pts.length];
        twice += a[0] * W * (b[1] * H) - b[0] * W * (a[1] * H);
      }
      area = (Math.abs(twice) * scale * scale) / 2;
    }
    return { edges, area, perimeter: edges.reduce((v, e) => v + e.length, 0), scale };
  }
  /** compact: plot-editor feature. Keep related handlers in this module. */
  function compact(d) {
    let m = metrics(d),
      parts = [];
    parts.push(T("Corners", "گوشه‌ها") + ": " + (d.plotPoints || []).length);
    parts.push(
      T("Sketch vertices (relative 0–1)", "گوشه‌های طرح (مختصات نسبی ۰ تا ۱)") +
        ": " +
        (d.plotPoints || [])
          .map((p, i) => i + 1 + "=" + p[0].toFixed(4) + "," + p[1].toFixed(4))
          .join("; "),
    );
    parts.push(T("Closed outline", "محدودهٔ بسته") + ": " + (d.plotClosed ? "yes" : "no"));
    if (m) {
      parts.push(
        T("Approx. area", "مساحت تقریبی") +
          ": " +
          (m.area == null ? "—" : m.area.toFixed(1) + " m²"),
      );
      parts.push(T("Approx. perimeter", "محیط تقریبی") + ": " + m.perimeter.toFixed(1) + " m");
      parts.push(
        T("Edges", "اضلاع") +
          ": " +
          m.edges
            .map(
              (e, i) =>
                i +
                1 +
                ": " +
                e.length.toFixed(1) +
                " m, " +
                e.angle.toFixed(0) +
                "°, wall " +
                (d.plotWalls[i] ? "yes" : "no"),
            )
            .join("; "),
      );
    } else
      parts.push(
        T(
          "Measurements need a known first-edge length.",
          "اندازه‌ها به طولِ معلومِ ضلع اول نیاز دارند.",
        ),
      );
    if (d.plotWallHeight)
      parts.push(
        T("Requested wall height", "ارتفاع دیوار درخواستی") + ": " + d.plotWallHeight + " m",
      );
    return parts.join("\n");
  }
  /** mount: plot-editor feature. Keep related handlers in this module. */
  function mount(box, d, form) {
    if (!box) return;
    clean(d);
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "cx-plot-svg";
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-label", T("Manual site boundary sketch", "ترسیم دستی محدودهٔ زمین"));
    box.append(svg);
    let tools = document.getElementById("cx-plot-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.id = "cx-plot-tools";
      box.after(tools);
    }
    let drawing = false,
      drag = -1;
    /** draw: plot-editor feature. Keep related handlers in this module. */
    function draw() {
      let p = d.plotPoints,
        closed = d.plotClosed,
        poly = p.map((x) => (x[0] * W).toFixed(1) + "," + (x[1] * H).toFixed(1)).join(" "),
        markup = "";
      if (p.length >= 3 && closed)
        markup +=
          '<polygon points="' +
          poly +
          '" fill="rgba(171,193,114,.24)" stroke="#dfeaa5" stroke-width="3"/>';
      else if (p.length >= 2)
        markup +=
          '<polyline points="' +
          poly +
          '" fill="none" stroke="#dfeaa5" stroke-width="4" stroke-dasharray="10 6"/>';
      for (let i = 0; i < p.length - (closed ? 0 : 1); i++) {
        let a = p[i],
          b = p[(i + 1) % p.length];
        if (d.plotWalls[i])
          markup +=
            '<line x1="' +
            a[0] * W +
            '" y1="' +
            a[1] * H +
            '" x2="' +
            b[0] * W +
            '" y2="' +
            b[1] * H +
            '" stroke="#f3aa59" stroke-width="9" stroke-linecap="round"/>';
      }
      p.forEach((x, i) => {
        markup +=
          '<circle data-vertex="' +
          i +
          '" cx="' +
          x[0] * W +
          '" cy="' +
          x[1] * H +
          '" r="11" fill="#f5f1e9" stroke="#214031" stroke-width="4"/><text x="' +
          (x[0] * W + 17) +
          '" y="' +
          (x[1] * H - 13) +
          '" fill="#fff" stroke="#163324" stroke-width="3" paint-order="stroke" font-size="22" font-weight="700">' +
          (i + 1) +
          "</text>";
      });
      svg.innerHTML = markup;
      svg.classList.toggle("active", drawing);
      drawTools();
    }
    /** drawTools: plot-editor feature. Keep related handlers in this module. */
    function drawTools() {
      let m = metrics(d),
        len = d.plotPoints.length,
        ready = d.plotClosed && len >= 3;
      tools.innerHTML =
        '<div class="cx-plot-intro"><div><span>02 / ' +
        T("SITE OUTLINE", "محدودهٔ زمین") +
        "</span><h4>" +
        T("Trace your plot, corner by corner.", "گوشه‌های زمین را یکی‌یکی مشخص کنید.") +
        "</h4></div><p>" +
        T(
          "If you do not have a survey yet, sketch the outline by eye. Drag any numbered corner to adjust it. This is a design brief, not a legal boundary or site survey.",
          "اگر هنوز نقشه‌برداری ندارید، محدوده را تقریبی ترسیم کنید. هر گوشهٔ شماره‌دار را می‌توانید جابه‌جا کنید. این طرح اولیه است و مرز رسمی یا نقشه‌برداری محسوب نمی‌شود.",
        ) +
        '</p></div><div class="cx-plot-actions"><button type="button" data-plot="draw" class="' +
        (drawing ? "active" : "") +
        '">' +
        (drawing
          ? T("Drawing is on", "ترسیم فعال است")
          : T("Draw / edit outline", "ترسیم / ویرایش محدوده")) +
        '</button><button type="button" data-plot="close" ' +
        (len < 3 || ready ? "disabled" : "") +
        ">" +
        T("Close outline", "بستن محدوده") +
        '</button><button type="button" data-plot="corner" ' +
        (!ready ? "disabled" : "") +
        ">" +
        T("Add a corner", "افزودن گوشه") +
        '</button><button type="button" data-plot="undo" ' +
        (!len ? "disabled" : "") +
        ">" +
        T("Undo point", "بازگشت یک نقطه") +
        '</button><button type="button" data-plot="reset" ' +
        (!len ? "disabled" : "") +
        ">" +
        T("Clear", "پاک‌کردن") +
        '</button></div><div class="cx-plot-fields"><label>' +
        T("Known length of the first side (metres)", "طولِ معلومِ ضلع اول (متر)") +
        '<input id="cx-plot-reference" type="number" min="0" step="any" placeholder="e.g. 24" value="' +
        (d.plotReference || "") +
        '"></label><label>' +
        T("Planned boundary wall height (metres)", "ارتفاع دیوار مدنظر (متر)") +
        '<input id="cx-plot-height" type="number" min="0" step="any" placeholder="e.g. 2.2" value="' +
        (d.plotWallHeight || "") +
        '"></label></div><p class="cx-plot-scale-note">' +
        T(
          "Enter one measured side from a deed, survey or tape measurement. We scale the other sides and area from that reference. Without it, we keep only the shape.",
          "طول یک ضلع را از سند، نقشه‌برداری یا اندازه‌گیری وارد کنید. اضلاع و مساحت دیگر با همان مقیاس تخمین زده می‌شوند. بدون آن فقط شکل حفظ می‌شود.",
        ) +
        '</p><div class="cx-plot-result">' +
        (m
          ? "<div><strong>" +
            (m.area == null ? "—" : m.area.toFixed(1) + " m²") +
            "</strong><span>" +
            T("Approx. plot area", "مساحت تقریبی زمین") +
            "</span></div><div><strong>" +
            m.perimeter.toFixed(1) +
            " m</strong><span>" +
            T("Approx. perimeter", "محیط تقریبی") +
            "</span></div>"
          : "<div><strong>" +
            T("Shape first", "ابتدا شکل") +
            "</strong><span>" +
            T(
              "Measurements appear after a known side is entered.",
              "اندازه‌ها پس از واردکردن یک ضلعِ معلوم نمایش داده می‌شوند.",
            ) +
            "</span></div>") +
        "</div>" +
        (m && m.area != null
          ? '<button class="cx-plot-use" type="button" data-plot="use">' +
            T("Use this approximate area in my brief", "ثبت این مساحت تقریبی در شرح پروژه") +
            "</button>"
          : "") +
        (len >= 2
          ? '<button class="cx-plot-use" type="button" data-plot="download">' +
            T("Download site sketch to attach", "دانلود طرح زمین برای پیوست") +
            " ↓</button>"
          : "") +
        (ready
          ? '<div class="cx-wall-list"><div><strong>' +
            T("Which edges need a boundary wall?", "کدام ضلع‌ها دیوار می‌خواهند؟") +
            '</strong><button type="button" data-plot="all-walls">' +
            T("Select all", "انتخاب همه") +
            "</button></div>" +
            d.plotPoints
              .map(
                (_, i) =>
                  '<label><input type="checkbox" data-wall="' +
                  i +
                  '" ' +
                  (d.plotWalls[i] ? "checked" : "") +
                  "><span>" +
                  T("Side", "ضلع") +
                  " " +
                  (i + 1) +
                  " → " +
                  (((i + 1) % len) + 1) +
                  "</span><small>" +
                  (m
                    ? m.edges[i].length.toFixed(1) + " m · " + m.edges[i].angle.toFixed(0) + "°"
                    : T("Scale needed", "نیاز به مقیاس")) +
                  "</small></label>",
              )
              .join("") +
            "</div>"
          : "") +
        '<p class="cx-plot-legal">' +
        T(
          "Map imagery may not include cadastral parcels. All lengths and wall positions need professional survey and local permission review before design or construction.",
          "نقشه ممکن است مرز ثبتی زمین‌ها را نشان ندهد. اندازه‌ها و محل دیوار پیش از طراحی یا اجرا باید با نقشه‌برداری و ضوابط محل بررسی شوند.",
        ) +
        "</p>";
      tools.querySelectorAll("[data-plot]").forEach(
        (b) =>
          (b.onclick = () => {
            let a = b.dataset.plot;
            if (a === "download") {
              let u = URL.createObjectURL(new Blob([svg.outerHTML], { type: "image/svg+xml" })),
                link = document.createElement("a");
              link.href = u;
              link.download = "Shahr-Niaz-site-sketch.svg";
              link.click();
              setTimeout(() => URL.revokeObjectURL(u), 10000);
              return;
            }
            if (a === "draw") {
              drawing = !drawing;
              draw();
              return;
            }
            if (a === "close") {
              d.plotClosed = true;
              drawing = false;
            }
            if (a === "corner") {
              d.plotClosed = false;
              drawing = true;
            }
            if (a === "undo") {
              d.plotPoints.pop();
              d.plotClosed = false;
              d.plotWalls.pop();
              drawing = true;
            }
            if (a === "reset") {
              d.plotPoints = [];
              d.plotClosed = false;
              d.plotWalls = [];
              drawing = false;
            }
            if (a === "all-walls") d.plotWalls = d.plotPoints.map(() => true);
            if (a === "use" && m?.area != null) {
              d.plotArea = m.area.toFixed(1);
              if (form.elements.plotArea) form.elements.plotArea.value = d.plotArea;
            }
            draw();
          }),
      );
      tools.querySelectorAll("[data-wall]").forEach(
        (x) =>
          (x.onchange = () => {
            d.plotWalls[+x.dataset.wall] = x.checked;
            draw();
          }),
      );
      tools.querySelector("#cx-plot-reference").onchange = (e) => {
        d.plotReference = e.target.value;
        draw();
      };
      tools.querySelector("#cx-plot-height").onchange = (e) => {
        d.plotWallHeight = e.target.value;
        draw();
      };
    }
    const point = (e) => {
      let r = svg.getBoundingClientRect();
      return [
        Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      ];
    };
    svg.addEventListener("pointerdown", (e) => {
      if (!drawing) return;
      let vertex = e.target.closest("[data-vertex]");
      if (vertex) {
        drag = +vertex.dataset.vertex;
        svg.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    });
    svg.addEventListener("pointermove", (e) => {
      if (drag < 0) return;
      d.plotPoints[drag] = point(e);
      draw();
    });
    svg.addEventListener("pointerup", (e) => {
      if (drag >= 0) {
        drag = -1;
        try {
          svg.releasePointerCapture(e.pointerId);
        } catch {}
        draw();
      }
    });
    svg.addEventListener("click", (e) => {
      if (!drawing || d.plotClosed || e.target.closest("[data-vertex]")) return;
      d.plotPoints.push(point(e));
      draw();
    });
    draw();
  }
  /** importCoordinates: plot-editor feature. Keep related handlers in this module. */
  function importCoordinates(raw, d, setPin) {
    let a = raw
      .filter(
        (p) =>
          Array.isArray(p) &&
          Number.isFinite(+p[0]) &&
          Number.isFinite(+p[1]) &&
          Math.abs(+p[0]) <= 180 &&
          Math.abs(+p[1]) <= 90,
      )
      .map((p) => [+p[0], +p[1]]);
    if (a.length > 2 && a[0][0] === a[a.length - 1][0] && a[0][1] === a[a.length - 1][1]) a.pop();
    if (a.length < 3 || a.length > 200) return false;
    let lon = a.reduce((v, p) => v + p[0], 0) / a.length,
      lat = a.reduce((v, p) => v + p[1], 0) / a.length,
      c = Math.cos((lat * Math.PI) / 180),
      xs = a.map((p) => (p[0] - lon) * c),
      ys = a.map((p) => p[1] - lat),
      minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys),
      spanX = Math.max(maxX - minX, 1e-10),
      spanY = Math.max(maxY - minY, 1e-10),
      ratio = Math.min(0.76 / spanX, (0.76 * H) / W / spanY);
    d.plotPoints = a.map((p, i) => [0.5 + xs[i] * ratio, 0.5 - (ys[i] * ratio * W) / H]);
    d.plotClosed = true;
    d.plotWalls = [];
    let dlat = ((a[1][1] - a[0][1]) * Math.PI) / 180,
      dlon = ((a[1][0] - a[0][0]) * Math.PI) / 180,
      h =
        Math.sin(dlat / 2) ** 2 +
        Math.cos((a[0][1] * Math.PI) / 180) *
          Math.cos((a[1][1] * Math.PI) / 180) *
          Math.sin(dlon / 2) ** 2;
    d.plotReference = (6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))).toFixed(2);
    d.plotSource = "coordinates";
    setPin(lat, lon);
    return true;
  }
  window.SN_PLOT = { mount, metrics, compact, importCoordinates };
})();
