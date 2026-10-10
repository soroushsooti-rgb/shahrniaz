/* مسئولیت این فایل: صفحات شهر نیاز، گالری، مشاوره و مسیریابی داخلی. */
/** Shahr Niaz: site-application. Original execution order: 9. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  let lang = window.SITE_LANGUAGE;
  window.setSiteLanguage = (value) => {
    lang = value;
    window.SITE_LANGUAGE = value;
    render(false);
  };
  const t = (en, fa) => window.siteTranslate(en, fa),
    tx = (a) => t(...a),
    main = $("#main");
  let current = "/",
    lastURL = "",
    transition = null,
    transitionToken = 0;
  const asset = (name, size = 1920) => {
    const path = `assets/${name.replace(/\.(webp|jpg|png)$/, "")}-${size}.webp`;
    return window.SN_EMBEDDED?.[path] || path;
  };
  const photo = (name, alt, cls = "", eager = false) =>
    `<img src="${asset(name)}" ${["objects", "courtyard", "real-shiraz-mall"].includes(name) ? `srcset="${asset(name, 640)} 640w, ${asset(name, 1280)} 1280w, ${asset(name)} ${name === "real-shiraz-mall" ? 1778 : 1536}w" sizes="100vw"` : ""} alt="${esc(alt)}" class="${cls}" width="1536" height="1024" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const arrow = '<span aria-hidden="true">↗</span>';
  const link = (url, text, cls = "text-link") =>
    `<a href="${url}" class="${cls}"><span>${text}</span>${arrow}</a>`;
  const worlds = window.SHN_DATA.get("shahrniaz/09-site-application/worlds-1");
  /** sketch: site-application feature. Keep related handlers in this module. */
  function sketch() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/sketch-1", []);
  }
  /** brand: site-application feature. Keep related handlers in this module. */
  function brand() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/brand-2", [
      window.SHN_TEMPLATES.text(t("Shahr Niaz home", "خانهٔ شهر نیاز")),
      window.SHN_TEMPLATES.text(window.SN_NEW_IMAGES["new-logo"]),
    ]);
  }
  /** shell: site-application feature. Keep related handlers in this module. */
  function shell() {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
    $(".skip").textContent = t("Skip to content", "رفتن به محتوا");
    $("#header").innerHTML = window.SHN_TEMPLATES.render("shahrniaz/09-site-application/shell-3", [
      window.SHN_TEMPLATES.text(brand()),
      window.SHN_TEMPLATES.text(t("Main navigation", "منوی اصلی")),
      window.SHN_TEMPLATES.text(
        window.SN_ADMIN
          ? window.SN_ADMIN.nav(current, lang)
          : [
              ["building", "Projects", "پروژه‌ها"],
              ["products", "Objects", "محصولات"],
              ["ai", "AI tools", "ابزارهای AI"],
              ["studio", "Studio", "استودیو"],
              ["contact", "Contact", "تماس"],
              ["estimate", "Start Project", "شروع پروژه"],
            ]
              .map(
                ([id, en, fa]) =>
                  `<a href="#/${id}" ${current.startsWith("/" + id) ? 'aria-current="page"' : ""}>${t(en, fa)}</a>`,
              )
              .join(""),
      ),
      window.SHN_TEMPLATES.text(current === "/partners" ? 'aria-current="page"' : ""),
      window.SHN_TEMPLATES.text(
        window.SN_ADMIN
          ? window.SN_ADMIN.accountButton()
          : '<button type="button" id="sn-account" class="sn-account">Log in / Sign up</button>',
      ),
      window.SHN_TEMPLATES.text(t("Menu +", "منو +")),
    ]);
    $("#footer").innerHTML = window.SHN_TEMPLATES.render("shahrniaz/09-site-application/shell-4", [
      window.SHN_TEMPLATES.text(
        t("A thought. A space. Something of your own.", "یک اندیشه. یک فضا. چیزی برای خودتان."),
      ),
      window.SHN_TEMPLATES.text(link("#/contact", t("Contact", "تماس"))),
      window.SHN_TEMPLATES.text(link("#/estimate", t("Start your design", "شروع طراحی"))),
      window.SHN_TEMPLATES.text(link("#/partners", "Partners")),
      window.SHN_TEMPLATES.text(window.SN_NEW_IMAGES["new-logo"]),
    ]);
    let assistant = document.getElementById("sn-project-assistant");
    if (!assistant) {
      assistant = document.createElement("aside");
      assistant.id = "sn-project-assistant";
      document.body.append(assistant);
    }
    assistant.innerHTML =
      '<div class="sn-assistant-panel" hidden><button type="button" class="sn-assistant-close" aria-label="' +
      t("Close", "بستن") +
      '">×</button><small>SHAHR NIAZ / PRIVATE START</small><h3>' +
      t("Have a space in mind?", "فضایی در ذهن دارید؟") +
      "</h3><p>" +
      t(
        "Tell us the essentials. A private call with Niaz is the first step.",
        "اطلاعات اصلی را بگویید. گفت‌وگوی خصوصی با نیاز، اولین قدم است.",
      ) +
      '</p><a href="#/estimate?scope=interior">' +
      t("Interior design", "طراحی داخلی") +
      ' ↗</a><a href="#/estimate?scope=exterior">' +
      t("Architecture & exterior", "معماری و نما") +
      ' ↗</a><a href="#/products">' +
      t("A custom object", "وسیلهٔ اختصاصی") +
      ' ↗</a></div><button type="button" class="sn-assistant-trigger" aria-expanded="false"><b>✳</b><span><strong>' +
      t("Start your project", "شروع پروژهٔ شما") +
      "</strong><small>" +
      t("Private call · personal proposal", "جلسهٔ خصوصی · پیشنهاد اختصاصی") +
      "</small></span><b>↗</b></button>";
    assistant.querySelector(".sn-assistant-trigger").onclick = () => {
      let panel = assistant.querySelector(".sn-assistant-panel"),
        open = panel.hidden;
      panel.hidden = !open;
      assistant.querySelector(".sn-assistant-trigger").setAttribute("aria-expanded", String(open));
    };
    assistant.querySelector(".sn-assistant-close").onclick = () => {
      assistant.querySelector(".sn-assistant-panel").hidden = true;
      assistant.querySelector(".sn-assistant-trigger").setAttribute("aria-expanded", "false");
    };
    $("#menu").onclick = () => menu();
  }
  function menu(force) {
    const open = force ?? !$("#nav").classList.contains("open");
    $("#nav").classList.toggle("open", open);
    $("#menu").setAttribute("aria-expanded", String(open));
    $("#menu").textContent = open ? t("Close −", "بستن −") : t("Menu +", "منو +");
  }
  /** oldHome: site-application feature. Keep related handlers in this module. */
  function oldHome() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/oldHome-5", [
      window.SHN_TEMPLATES.text(
        t(
          'One practice.<br>Three ways of <span class="serif">seeing.</span>',
          'یک رویکرد.<br>سه شیوهٔ <span class="serif">نگریستن.</span>',
        ),
      ),
      window.SHN_TEMPLATES.text(
        t("Choose a world.<br>Step inside.", "یک جهان را انتخاب کنید.<br>وارد شوید."),
      ),
      window.SHN_TEMPLATES.text(
        worlds
          .map((w, i) =>
            window.SHN_TEMPLATES.render("shahrniaz/09-site-application/oldHome-6", [
              window.SHN_TEMPLATES.text(w.id),
              window.SHN_TEMPLATES.text(w.id),
              window.SHN_TEMPLATES.text(w.id),
              window.SHN_TEMPLATES.text(t("Enter ", "ورود به ") + tx(w.name)),
              window.SHN_TEMPLATES.text(photo(w.image, tx(w.alt), "", true)),
              window.SHN_TEMPLATES.text(sketch()),
              window.SHN_TEMPLATES.text(i + 1),
              window.SHN_TEMPLATES.text(tx(w.name)),
              window.SHN_TEMPLATES.text(arrow),
              window.SHN_TEMPLATES.text(tx(w.line)),
            ]),
          )
          .join(""),
      ),
      window.SHN_TEMPLATES.text(t("Intelligence → Space → Object", "هوش ← فضا ← شیء")),
      window.SHN_TEMPLATES.text(
        link("#/painting", t("Painting — a place for art", "نقاشی — جایی برای هنر")),
      ),
    ]);
  }
  /** worldHero: site-application feature. Keep related handlers in this module. */
  function worldHero(id) {
    const w = worlds.find((x) => x.id === id);
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/worldHero-7", [
      window.SHN_TEMPLATES.text(t("Back to the beginning", "بازگشت به آغاز")),
      window.SHN_TEMPLATES.text(worlds.indexOf(w) + 1),
      window.SHN_TEMPLATES.text(tx(w.name)),
      window.SHN_TEMPLATES.text(id),
      window.SHN_TEMPLATES.text(photo(w.image, tx(w.alt), "", true)),
      window.SHN_TEMPLATES.text(sketch()),
      window.SHN_TEMPLATES.text(tx(w.name)),
      window.SHN_TEMPLATES.text(tx(w.line)),
    ]);
  }
  const SN_OBJECT_STUDIES = {
    screen: "/assets/shahrniaz/media/images/b51c8f640e2849bac6bd.jpg",
    light: "/assets/shahrniaz/media/images/1fa697ea61fcc60723c2.jpg",
  };

  /** objectStudies: site-application feature. Keep related handlers in this module. */
  function objectStudies() {
    const rows = [
      [
        "console",
        t("The woven console", "کنسولِ بافت‌دار"),
        t(
          "A metal lattice takes shape through additive manufacturing, then receives a hand-finished bronze surface.",
          "شبکهٔ فلزی با ساخت افزایشی شکل می‌گیرد و با پرداخت دست‌ساز برنزی کامل می‌شود.",
        ),
        asset("objects"),
      ],
      [
        "screen",
        t("The spatial screen", "جداکنندهٔ فضایی"),
        t(
          "A modular metal weave filters light and creates privacy without closing the room.",
          "بافت فلزیِ ماژولار نور را پالایش می‌کند و بدون بستن فضا، حریم می‌سازد.",
        ),
        SN_OBJECT_STUDIES.screen,
      ],
      [
        "light",
        t("The ribbon light", "چراغِ روبانی"),
        t(
          "A precision-printed inner lattice turns a slim metal profile into a warm architectural glow.",
          "شبکهٔ داخلیِ دقیق، پروفیل باریک فلزی را به نوری گرم و معمارانه تبدیل می‌کند.",
        ),
        SN_OBJECT_STUDIES.light,
      ],
    ];
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/objectStudies-8", [
      window.SHN_TEMPLATES.text(t("OBJECT STUDIES", "مطالعات اشیا")),
      window.SHN_TEMPLATES.text(t("Metal, light<br>and possibility.", "فلز، نور<br>و امکان.")),
      window.SHN_TEMPLATES.text(
        t(
          "Three explorations in digital fabrication and craft. These are design concepts, developed with the same care as our interiors.",
          "سه تجربه در ساخت دیجیتال و مهارت دست‌ساز؛ کانسپت‌هایی که با همان دقتِ فضاهای داخلی شکل گرفته‌اند.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        link(
          "#/estimate?scope=interior",
          t("Discuss a custom object", "گفت‌وگو دربارهٔ شیء اختصاصی"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        rows
          .map(([id, title, copy, img], i) =>
            window.SHN_TEMPLATES.render("shahrniaz/09-site-application/objectStudies-9", [
              window.SHN_TEMPLATES.text(img),
              window.SHN_TEMPLATES.text(esc(title)),
              window.SHN_TEMPLATES.text(i + 1),
              window.SHN_TEMPLATES.text(t("CONCEPT STUDY", "مطالعهٔ مفهومی")),
              window.SHN_TEMPLATES.text(title),
              window.SHN_TEMPLATES.text(copy),
            ]),
          )
          .join(""),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Concept imagery illustrates a possible design direction; specifications and fabrication are developed per commission.",
          "این تصاویر مسیرهای مفهومی طراحی را نشان می‌دهند؛ مشخصات فنی و ساخت برای هر سفارش جداگانه توسعه می‌یابد.",
        ),
      ),
    ]);
  }

  const SN_BILLIARD_IMAGE = "/assets/shahrniaz/media/images/3fd0152e911b7176650f.jpg";
  window.SN_BILLIARD_IMAGE = SN_BILLIARD_IMAGE;
  const OBJECT_CATALOG = window.SHN_DATA.get("shahrniaz/09-site-application/OBJECT_CATALOG-2");
  /** objectVisual: site-application feature. Keep related handlers in this module. */
  function objectVisual(item) {
    if (item.image === "billiard")
      return '<img src="' + SN_BILLIARD_IMAGE + '" alt="" loading="eager">';
    if (item.image === "concept-light")
      return '<img src="' + SN_OBJECT_STUDIES.light + '" alt="" loading="eager">';
    if (item.image === "concept-console")
      return '<img src="' + asset("objects") + '" alt="" loading="eager">';
    return photo(item.image, tx([item.en, item.fa]), "", true);
  }
  /** objectQuestion: site-application feature. Keep related handlers in this module. */
  function objectQuestion(selected) {
    return (
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/objectQuestion-10", []) +
      t("What should we<br>make for you?", "چه چیزی را<br>برای شما بسازیم؟") +
      "</h2><p>" +
      t(
        "A lamp, a billiard table, a piece of furniture or something that has no name yet. Tell us how it should work and feel; we will review the idea together.",
        "چراغ، میز بیلیارد، مبلمان یا وسیله‌ای که هنوز نامی ندارد. از کاربرد و حس دلخواهتان بگویید تا ایده را با هم بررسی کنیم.",
      ) +
      '</p><div class="sn-object-promise"><span>01 / ' +
      t("Your idea", "ایدهٔ شما") +
      "</span><span>02 / " +
      t("A private conversation", "گفت‌وگوی خصوصی") +
      "</span><span>03 / " +
      t("Design & fabrication proposal", "پیشنهاد طراحی و ساخت") +
      '</span></div></div><form id="sn-object-form"><label>' +
      t("What would you like us to design?", "چه وسیله‌ای می‌خواهید طراحی کنیم؟") +
      '<select name="object" required><option value="">' +
      t("Choose an object", "انتخاب وسیله") +
      "</option>" +
      OBJECT_CATALOG.map(
        (x) =>
          '<option value="' +
          x.id +
          '" ' +
          (x.id === selected ? "selected" : "") +
          ">" +
          tx([x.en, x.fa]) +
          "</option>",
      ).join("") +
      "</select></label><label>" +
      t("Describe your idea", "ایده‌تان را توصیف کنید") +
      '<textarea name="idea" rows="4" placeholder="' +
      t(
        "What is it for? Where will it live? What should it do?",
        "چه کاربردی دارد؟ کجا قرار می‌گیرد؟ چه ویژگی‌هایی می‌خواهید؟",
      ) +
      '" required></textarea></label><div class="sn-object-form-grid"><label>' +
      t("Approximate size", "ابعاد تقریبی") +
      '<input name="size" placeholder="' +
      t("e.g. 240 × 90 × 75 cm", "مثلاً ۲۴۰ × ۹۰ × ۷۵ سانتی‌متر") +
      '"></label><label>' +
      t("Preferred materials", "متریال دلخواه") +
      '<input name="materials" placeholder="' +
      t("Metal, wood, stone, glass...", "فلز، چوب، سنگ، شیشه...") +
      '"></label></div><fieldset><legend>' +
      t("What should it feel like?", "چه حس و حالی داشته باشد؟") +
      "</legend>" +
      [
        ["sculptural", "Sculptural", "مجسمه‌وار"],
        ["minimal", "Quiet & minimal", "آرام و مینیمال"],
        ["warm", "Warm & tactile", "گرم و ملموس"],
        ["bold", "Bold & expressive", "جسور و شاخص"],
        ["unsure", "Explore together", "با هم پیدا کنیم"],
      ]
        .map(
          (x) =>
            '<label><input type="checkbox" name="mood" value="' +
            x[0] +
            '"><span>' +
            t(x[1], x[2]) +
            "</span></label>",
        )
        .join("") +
      "</fieldset><label>" +
      t("Reference images or sketches (optional)", "عکس مرجع یا اسکچ (اختیاری)") +
      '<input name="refs" type="file" accept="image/*,.pdf" multiple></label><div class="sn-object-form-grid"><label>' +
      t("Your name", "نام شما") +
      '<input name="name" required autocomplete="name"></label><label>' +
      t("Your email", "ایمیل شما") +
      '<input name="email" type="email" required autocomplete="email"></label></div><p class="sn-object-form-note">' +
      t(
        "This offline preview prepares an email. Reference files are not sent automatically; attach them in your email. We discuss feasibility, timing and price after reviewing your brief.",
        "این نسخهٔ آفلاین یک ایمیل آماده می‌کند. فایل‌های مرجع خودکار ارسال نمی‌شوند؛ آن‌ها را به ایمیل پیوست کنید. امکان ساخت، زمان و هزینه پس از بررسی شرح شما مشخص می‌شود.",
      ) +
      '</p><button class="sn-object-submit" type="submit">' +
      t("Prepare my object enquiry", "آماده‌کردن درخواست وسیله") +
      ' ↗</button><p id="sn-object-status" role="status"></p></form></section>'
    );
  }
  /** products: site-application feature. Keep related handlers in this module. */
  function products() {
    let requested = new URLSearchParams(location.hash.split("?")[1] || "").get("object") || "";
    return (
      worldHero("products") +
      '<section class="wrap sn-objects-lead"><span class="eyebrow">OBJECTS / IN DEVELOPMENT</span><div><h2>' +
      t("Objects with a point of view.", "اشیایی با نگاه مخصوص خودشان.") +
      "</h2><p>" +
      t(
        "Explore the collection we are developing. Every object can begin with your space, your dimensions and your way of living. Private configuration previews are available by access code. The public collection is coming soon.",
        "مجموعه‌ای را ببینید که در حال توسعهٔ آن هستیم. هر وسیله می‌تواند از فضای شما، ابعاد شما و شیوهٔ زندگی شما شروع شود. پیش‌نمایش خصوصی کانفیگوراتور با کد دسترسی باز می‌شود. مجموعهٔ عمومی به‌زودی می‌آید.",
      ) +
      '</p><button type="button" data-object-scroll>' +
      t("Tell us what you need", "از وسیلهٔ دلخواهتان بگویید") +
      ' ↓</button></div></section><section class="wrap sn-config-coming"><div><span class="sn-coming-pill">COMING SOON</span><h2>' +
      t("Configure your object.", "وسیلهٔ خودتان را شکل دهید.") +
      "</h2><p>" +
      t(
        "Explore shape, size, material and finish in a private preview. Ask the studio for access, or tell us what you would like to make.",
        "فرم، اندازه، متریال و پرداخت را در پیش‌نمایش خصوصی ببینید. برای کد دسترسی با استودیو گفت‌وگو کنید یا ایدهٔ خودتان را بفرستید.",
      ) +
      '</p></div><div class="sn-config-steps"><span>01 / ' +
      t("Choose a piece", "انتخاب وسیله") +
      "</span><span>02 / " +
      t("Shape & dimensions", "فرم و ابعاد") +
      "</span><span>03 / " +
      t("Materials & finish", "متریال و پرداخت") +
      "</span><span>04 / " +
      t("Review with our studio", "بررسی با استودیو") +
      "</span></div></section>" +
      objectStudies() +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/products-11", []) +
      t("Made around you.", "ساخته‌شده برای شما.") +
      "</h2><p>" +
      t(
        "Select a category to see what we are preparing. Select a category for the story and a private preview of its editor. Your custom enquiry is welcome now.",
        "یک دسته را انتخاب کنید و ببینید چه چیزهایی در راه‌اند. در هر دسته معرفی قطعه و پیش‌نمایش خصوصی ویرایشگر را ببینید. درخواست ساخت اختصاصی را هم می‌پذیریم.",
      ) +
      '</p></div><div class="sn-object-category-grid">' +
      OBJECT_CATALOG.map(
        (x, i) =>
          '<a class="sn-object-category" href="#/products/item/' +
          x.id +
          '"><div class="sn-object-category-art">' +
          objectVisual(x) +
          '</div><div class="sn-object-category-foot"><span>' +
          String(i + 1).padStart(2, "0") +
          " / COMING SOON</span><h3>" +
          tx([x.en, x.fa]) +
          "</h3><p>" +
          t(x.descEn, x.descFa) +
          "</p><b>" +
          t("Explore the idea", "دیدن ایده") +
          " ↗</b></div></a>",
      ).join("") +
      "</div></section>" +
      objectQuestion(requested)
    );
  }
  /** objectPreview: site-application feature. Keep related handlers in this module. */
  function objectPreview() {
    let id = current.split("/")[3],
      item = OBJECT_CATALOG.find((x) => x.id === id);
    if (!item) return notFound();
    let ideas = [
      t("Purpose & daily use", "کاربرد و استفادهٔ روزمره"),
      t("Dimensions & proportions", "ابعاد و تناسبات"),
      t("Material & tactile finish", "متریال و پرداخت"),
      t("Construction details", "جزئیات ساخت"),
    ];
    return (
      '<section class="wrap sn-object-preview"><a href="#/products" class="sn-object-back">← ' +
      t("All objects", "همهٔ اشیا") +
      '</a><div class="sn-object-preview-grid"><div class="sn-object-preview-art">' +
      objectVisual(item) +
      '</div><div class="sn-object-preview-copy"><span class="sn-coming-pill">COMING SOON</span><h1>' +
      tx([item.en, item.fa]) +
      "</h1><p>" +
      t(item.descEn, item.descFa) +
      '</p><div class="sn-object-preview-list"><strong>' +
      t("What we will explore with you", "آنچه با شما بررسی می‌کنیم") +
      "</strong>" +
      ideas
        .map((x, i) => "<span>" + String(i + 1).padStart(2, "0") + " / " + x + "</span>")
        .join("") +
      "</div><p>" +
      t(
        "A private configurator preview is available with an access code. Our studio can also discuss a one-off version made for your project.",
        "پیش‌نمایش خصوصی کانفیگوراتور با کد دسترسی باز می‌شود. استودیو می‌تواند نسخهٔ اختصاصی متناسب با پروژهٔ شما را هم بررسی کند.",
      ) +
      '</p><div class="sn-object-preview-actions"><a class="sn-object-preview-cta" href="#/products?object=' +
      item.id +
      '">' +
      t("Describe your object", "از وسیلهٔ خودتان بگویید") +
      " ↗</a>" +
      (["table", "chair", "sofa", "cabinet", "kitchen", "billiard"].includes(item.id)
        ? '<a class="sn-object-private-link" href="#/products/configure/' +
          item.id +
          '">' +
          t("Private configurator preview", "پیش‌نمایش خصوصی کانفیگوراتور") +
          " ↗</a>"
        : "") +
      "</div></div></div></section>"
    );
  }
  /** configRoutePage: site-application feature. Keep related handlers in this module. */
  function configRoutePage() {
    const kind = current.split("/")[3];
    const inner =
      kind === "billiard"
        ? window.SN_CONFIG_GATE?.billiardPage()
        : kind === "kitchen"
          ? KitchenPlanner.page(lang)
          : Configurator.page(kind, lang);
    if (!inner) return notFound();
    const item = OBJECT_CATALOG.find((x) => x.id === kind);
    const picture = item
      ? item.image === "billiard"
        ? SN_BILLIARD_IMAGE
        : item.image.startsWith("room-")
          ? asset(item.image)
          : ""
      : "";
    return window.SN_CONFIG_GATE?.unlocked()
      ? inner
      : window.SN_CONFIG_GATE?.page(kind, inner, picture) || objectPreview();
  }
  /** oldBuilding: site-application feature. Keep related handlers in this module. */
  function oldBuilding() {
    const gallery = [
      [
        "shiraz-mall-exterior-aerial",
        t("Aerial exterior view", "نمای هوایی بیرونی"),
        t("Exterior · city scale", "بیرونی · مقیاس شهری"),
      ],
      [
        "shiraz-mall-exterior-front",
        t("Main glass frontage", "نمای اصلی شیشه‌ای"),
        t("Exterior · main elevation", "بیرونی · نمای اصلی"),
      ],
      [
        "shiraz-mall-brick-detail",
        t("Custom brick façade detail", "جزئیات آجرکاری نما"),
        t("Material · brick weave", "متریال · بافت آجر"),
      ],
      [
        "shiraz-mall-exterior-sunset",
        t("Semi-open terrace at sunset", "تراس نیمه‌باز در غروب"),
        t("Threshold · terrace", "فضای میانی · تراس"),
      ],
      [
        "shiraz-mall-exterior-street",
        t("Street-level perspective", "دید بنا از خیابان"),
        t("Exterior · public edge", "بیرونی · لبهٔ شهری"),
      ],
      [
        "shiraz-mall-exterior-night",
        t("Illuminated night elevation", "نمای نورپردازی‌شدهٔ شب"),
        t("Exterior · night", "بیرونی · شب"),
      ],
      [
        "shiraz-mall-interior-atrium",
        t("Central atrium from above", "آتریوم مرکزی از بالا"),
        t("Interior · atrium", "داخلی · آتریوم"),
      ],
      [
        "shiraz-mall-interior-escalators",
        t("Vertical circulation and light", "حرکت عمودی و نور"),
        t("Interior · circulation", "داخلی · گردش"),
      ],
      [
        "shiraz-mall-interior-gallery",
        t("Retail gallery", "گالری تجاری"),
        t("Interior · public floor", "داخلی · طبقهٔ عمومی"),
      ],
      [
        "shiraz-mall-interior-colour",
        t("Colour-coded levels", "طبقات با کدهای رنگی"),
        t("Wayfinding · colour", "راه‌یابی · رنگ"),
      ],
      [
        "shiraz-mall-interior-office",
        t("Office circulation", "راهروی بخش اداری"),
        t("Interior · office", "داخلی · اداری"),
      ],
      [
        "shiraz-mall-interior-service",
        t("Service interior", "فضای خدماتی داخلی"),
        t("Interior · service", "داخلی · خدماتی"),
      ],
    ];
    return (
      worldHero("building") +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/oldBuilding-12", [
        window.SHN_TEMPLATES.text(
          t("Commercial · cultural · administrative", "تجاری · فرهنگی · اداری"),
        ),
        window.SHN_TEMPLATES.text(
          t(
            'Shiraz Mall<br><span class="serif">Complex.</span>',
            'مجتمع<br><span class="serif">شیرازمال.</span>',
          ),
        ),
        window.SHN_TEMPLATES.text(t("Built area", "زیربنا")),
        window.SHN_TEMPLATES.text(t("Site area", "مساحت زمین")),
        window.SHN_TEMPLATES.text(t("Completion", "اتمام")),
        window.SHN_TEMPLATES.text(t("2021", "۱۴۰۰")),
        window.SHN_TEMPLATES.text(
          t("Yesterday,<br>reflected in today.", "دیروز،<br>در آینهٔ امروز."),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "The building is organised as two rotated volumes on its principal façades. Their position responds to orientation, views and the need to use a valuable urban site efficiently; the shift produces an approximately eight-metre cantilever on the south-east side.",
            "ساختمان از دو حجم چرخیده در نماهای اصلی شکل گرفته است. جای‌گیری آن‌ها به جهت جغرافیایی، دید و استفادهٔ مؤثر از زمین شهری پاسخ می‌دهد؛ این چرخش در جنوب‌شرقی کنسولی حدود هشت متر ایجاد کرده است.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Solid brick and reflective glass form the central material dialogue. The elongated bricks are woven in and out like the knots of an Iranian carpet, making shadow by day and holding custom light sources after dark.",
            "آجر صلب و شیشهٔ بازتابنده گفت‌وگوی اصلی متریال‌ها را می‌سازند. آجرهای کشیده مانند گره‌های فرش ایرانی درهم بافته شده‌اند؛ روز سایه‌روشن می‌سازند و شب منابع نور دست‌ساز را در خود جای می‌دهند.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Shiraz Mall project gallery", "گالری پروژهٔ شیرازمال")),
        window.SHN_TEMPLATES.text(
          gallery
            .map(
              (g, i) =>
                `<figure class="project-image project-image-${i + 1}">${photo(g[0], g[1])}<figcaption><span>${String(i + 1).padStart(2, "0")}</span><span>${g[2]}</span></figcaption></figure>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(t("Form & threshold", "فرم و فضای میانی")),
        window.SHN_TEMPLATES.text(t("Openings in a commercial volume.", "گشودگی در یک حجم تجاری.")),
        window.SHN_TEMPLATES.text(
          t(
            "Two semi-open spaces interrupt the main mass. The principal balcony uses an organic ceiling and focused night lighting to make a visible, inviting threshold between city and interior.",
            "دو فضای نیمه‌باز، تودهٔ اصلی را قطع می‌کنند. بالکن اصلی با سقفی ارگانیک و نورپردازی شبانه، آستانه‌ای شاخص و دعوت‌کننده میان شهر و فضای داخلی می‌سازد.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Interior & wayfinding", "فضای داخلی و راه‌یابی")),
        window.SHN_TEMPLATES.text(
          t("The building explains itself through colour.", "بنا با رنگ، خودش را توضیح می‌دهد."),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Six colour palettes organise parking, office floors and signage. Pistachio green, magenta and orange provide memorable reference points through the parking levels, while glazing lets internal activity remain visible from the street.",
            "شش پالت رنگی، پارکینگ، طبقات اداری و تابلوها را سازمان می‌دهند. سبز پسته‌ای، سرخابی و نارنجی نقاط مرجع به‌یادماندنی در پارکینگ می‌سازند و شیشه، رویدادهای داخل را از خیابان قابل‌دیدن نگه می‌دارد.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Architects", "معماران")),
        window.SHN_TEMPLATES.text(t("Niaz Esmaili, Shahram Zare", "نیاز اسمعیلی، شهرام زارع")),
        window.SHN_TEMPLATES.text(
          t(
            "Project images are reproduced from the studio’s official Shiraz Mall architecture and interior project pages. Project facts and design narrative are cross-checked with the studio page, LICC and the Iranian Society of Architects publication.",
            "تصاویر پروژه از صفحات رسمی معماری و طراحی داخلی شیرازمال در وب‌سایت استودیو بازنشر شده‌اند. اطلاعات و روایت طراحی با صفحهٔ استودیو، LICC و مطلب جامعهٔ معماران ایران تطبیق داده شده است.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          link(
            "https://www.shahrniaz.ae/p/Shiraz-Mall-Complex/",
            t("Official architecture page", "صفحهٔ رسمی معماری"),
          ),
        ),
        window.SHN_TEMPLATES.text(
          link(
            "https://www.shahrniaz.ae/p/Shiraz-Mall-Complex-Interior/",
            t("Official interior page", "صفحهٔ رسمی طراحی داخلی"),
          ),
        ),
      ])
    );
  }
  /** oldAi: site-application feature. Keep related handlers in this module. */
  function oldAi() {
    return (
      worldHero("ai") +
      `<section class="wrap reserved-section"><span class="eyebrow">${t("Next chapter", "مرحلهٔ بعد")}</span><h2>${t("Software / AI", "نرم‌افزار / هوش مصنوعی")}</h2><p>${t("Future tools for connecting your designs with your home. This section is not active yet.", "ابزارهایی برای پیوند طرح‌های شما با خانه‌تان. این بخش هنوز فعال نشده است.")}</p></section>`
    );
  }
  /** painting: site-application feature. Keep related handlers in this module. */
  function painting() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/painting-13", [
      window.SHN_TEMPLATES.text(t("Home", "خانه")),
      window.SHN_TEMPLATES.text(t("Painting", "نقاشی")),
      window.SHN_TEMPLATES.text(t("A place for art", "جایی برای هنر")),
      window.SHN_TEMPLATES.text(
        t(
          'A different<br>kind of <span class="serif">space.</span>',
          'جنس دیگری<br>از <span class="serif">فضا.</span>',
        ),
      ),
      window.SHN_TEMPLATES.text(t("Painting", "نقاشی")),
      window.SHN_TEMPLATES.text(t("A space<br>for painting.", "فضایی<br>برای نقاشی.")),
      window.SHN_TEMPLATES.text(
        t(
          "The artworks and their titles will be added to this collection.",
          "آثار نقاشی و عنوان‌هایشان به این مجموعه اضافه خواهند شد.",
        ),
      ),
    ]);
  }
  /** oldContact: site-application feature. Keep related handlers in this module. */
  function oldContact() {
    return `<section class="wrap simple-contact"><span class="eyebrow">${t("Contact", "تماس")}</span><h1>${t('Let’s talk<br>about <span class="serif">your design.</span>', 'دربارهٔ<br><span class="serif">طرحتان حرف بزنیم.</span>')}</h1><p>${t("Download your design from its 3D editor and share it through your existing studio contact.", "طرحتان را از ویرایشگر سه‌بعدی دانلود کنید و از مسیر ارتباطی فعلی با استودیو به اشتراک بگذارید.")}</p><div class="actions">${link("#/products", t("Choose a product", "انتخاب محصول"), "button")}${link("https://www.shahrniaz.ae/", t("Existing studio website", "وب‌سایت فعلی استودیو"))}</div></section>`;
  }
  /** notFound: site-application feature. Keep related handlers in this module. */
  function notFound() {
    return `<section class="wrap simple-contact"><span class="eyebrow">404</span><h1>${t('Back to<br>the <span class="serif">beginning.</span>', 'بازگشت به<br><span class="serif">آغاز.</span>')}</h1><div class="actions">${link("#/", t("Home", "خانه"), "button")}</div></section>`;
  }
  function dispose() {
    Configurator.dispose();
    KitchenPlanner.dispose();
  }
  /** parse: site-application feature. Keep related handlers in this module. */
  function parse() {
    let raw = (location.hash || window.CONNECTED_HASH || "#/").slice(1).split("?")[0];
    const redirects = {
      "/work": "/building",
      "/about": "/studio",
      "/services": "/building",
      "/start": "/contact",
      "/privacy": "/contact",
      "/products/all": "/products",
      "/products/category/furniture": "/products",
      "/products/category/lighting": "/products",
      "/products/collections/material-studies": "/products",
      "/products/timber-chair-study": "/products/configure/chair",
      "/products/stone-table-study": "/products/configure/table",
      "/products/metal-pendant-study": "/products",
    };
    if (raw.startsWith("/building/") || raw.startsWith("/archive/")) raw = "/building";
    if (raw.startsWith("/ai/")) raw = "/ai";
    current = redirects[raw] || raw || "/";
    if (current !== raw) history.replaceState(history.state, "", "#" + current);
  }
  /** render: site-application feature. Keep related handlers in this module. */
  function render(reset = true, scroll = 0) {
    dispose();
    parse();
    shell();
    document.body.classList.toggle("config-mode", current.startsWith("/products/configure/"));
    document.body.classList.toggle("building-mode", current === "/building");
    document.body.classList.toggle("experience-mode", current.startsWith("/products/configure/"));
    let html;
    if (current === "/") html = home() + partnersTeaser();
    else if (current === "/partners") html = partnersPage();
    else if (current === "/products") html = products();
    else if (current.startsWith("/products/item/")) html = objectPreview();
    else if (current.startsWith("/products/configure/")) html = configRoutePage();
    else if (current === "/building") html = building();
    else if (current === "/ai") html = ai();
    else if (current === "/studio") html = studio();
    else if (current === "/estimate") html = estimatePage();
    else if (current === "/admin") html = window.SN_ADMIN ? window.SN_ADMIN.page() : "";
    else if (current === "/settings")
      html = window.SN_ADMIN?.isOwner() ? settingsPage() : window.SN_ADMIN?.page() || "";
    else if (current.startsWith("/project/")) html = projectPage();
    else if (current === "/painting") html = painting();
    else if (current === "/contact") html = contact();
    else html = notFound();
    main.innerHTML = html;
    document.getElementById("sn-config-relock")?.remove();
    mountNew();
    if (current.startsWith("/products/configure/")) {
      const kind = current.split("/")[3];
      if (window.SN_CONFIG_GATE?.unlocked()) {
        if (kind === "kitchen") KitchenPlanner.mount(lang);
        else if (FURNITURE.types[kind]) Configurator.mount(kind, lang);
      }
      window.SN_CONFIG_GATE?.mount(kind);
    }
    window.SN_STUDIO_EMAIL = settings.email;
    window.SN_OBJECTS?.mount();

    window.SN_ADMIN?.mount();
    document.title = ($("h1")?.textContent || "Shahr Niaz") + " — Shahr Niaz";
    $('meta[name="description"]').content = t(
      "Shahr Niaz. Customise furniture, cabinetry and kitchens in 3D.",
      "شهر نیاز. مبلمان، کمد و آشپزخانه را به صورت سه‌بعدی شخصی‌سازی کنید.",
    );
    lastURL = location.href;
    if (reset) {
      scrollTo({ top: scroll, behavior: "instant" });
      main.focus({ preventScroll: true });
    }
    $("#announcer").textContent = $("h1")?.textContent || "";
  }
  function saveScroll() {
    history.replaceState({ ...history.state, scrollY }, "", location.href);
  }
  function cancelTransition() {
    transitionToken++;
    transition?.animations.forEach((a) => a.cancel());
    transition?.node.remove();
    transition = null;
    main.classList.remove("world-arriving");
    $(".world-hero")?.classList.remove("shared-hidden");
  }
  // Keep the image present: animate its frame into the exact destination image rectangle.
  /** enterWorld: site-application feature. Keep related handlers in this module. */
  async function enterWorld(anchor) {
    if (transition) return;
    saveScroll();
    const token = ++transitionToken,
      source = anchor.querySelector(".door-visual"),
      r = source.getBoundingClientRect();
    const node = document.createElement("div");
    node.className = "shared-frame " + anchor.dataset.enter;
    node.setAttribute("aria-hidden", "true");
    node.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
    node.innerHTML = source.innerHTML;
    node.querySelector(".door-index")?.remove();
    const sourceImage = source.querySelector("img"),
      copy = node.querySelector("img");
    copy.style.objectPosition = getComputedStyle(sourceImage).objectPosition;
    document.body.append(node);
    transition = { node, animations: [] };
    anchor.classList.add("selected");
    $(".doors").classList.add("door-siblings-fade");
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (token !== transitionToken) return;
    history.pushState({ scrollY: 0 }, "", anchor.getAttribute("href"));
    render();
    main.classList.add("world-arriving");
    const target = $(".world-hero");
    target.classList.add("shared-hidden");
    const end = target.getBoundingClientRect();
    const targetImage = target.querySelector("img");
    try {
      await targetImage.decode();
    } catch {}
    if (token !== transitionToken) return;
    const duration = innerWidth < 600 ? 660 : 780;
    const anim = node.animate(
      [
        { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" },
        {
          left: end.left + "px",
          top: end.top + "px",
          width: end.width + "px",
          height: end.height + "px",
        },
      ],
      { duration, easing: "cubic-bezier(.2,.7,.16,1)", fill: "forwards" },
    );
    transition.animations.push(anim);
    const reveal = main.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 420,
      delay: 140,
      easing: "ease-out",
      fill: "both",
    });
    transition.animations.push(reveal);
    try {
      await anim.finished;
    } catch {}
    if (token !== transitionToken) return;
    target.classList.remove("shared-hidden");
    main.classList.remove("world-arriving");
    node.remove();
    transition = null;
  }
  /** enterAIChapter: site-application feature. Keep related handlers in this module. */
  function enterAIChapter() {
    const overlay = document.createElement("div");
    overlay.className = "ai-gateway";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<strong>${t("INTELLIGENCE / SPACE", "هوش / فضا")}</strong><small>SHAHR NIAZ · SOFTWARE / AI</small>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("active"));
    saveScroll();
    setTimeout(() => {
      history.pushState({ scrollY: 0 }, "", "#/ai");
      render();
      overlay.classList.add("exit");
      setTimeout(() => overlay.remove(), 460);
    }, 570);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (a.classList.contains("skip")) {
      e.preventDefault();
      main.focus();
      return;
    }
    const href = a.getAttribute("href");
    if (
      !href?.startsWith("#/") ||
      e.button !== 0 ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    if (transition) return;
    if (
      href === "#/ai" &&
      current !== "/ai" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      enterAIChapter();
      return;
    }
    if (a.dataset.enter && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      enterWorld(a);
      return;
    }
    saveScroll();
    history.pushState({ scrollY: 0 }, "", href);
    render();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#nav").classList.contains("open")) {
      menu(false);
      $("#menu").focus();
    }
  });
  window.addEventListener("popstate", () => {
    cancelTransition();
    render(true, history.state?.scrollY || 0);
  });
  window.addEventListener("hashchange", () => {
    if (location.href !== lastURL) {
      cancelTransition();
      render();
    }
  });
  window.addEventListener("resize", () => {
    if (transition) {
      cancelTransition();
      render();
    }
    if (innerWidth > 800 && $("#nav")?.classList.contains("open")) menu(false);
  });
  window.SN_NEW_IMAGES = window.SHN_DATA.get("shahrniaz/09-site-application/SN_NEW_IMAGES-3");
  const galleryData = window.SHN_DATA.get("shahrniaz/09-site-application/galleryData-4");
  const defaultSettings = {
    design: 150,
    build: 3500,
    landDesign: 65,
    landBuild: 700,
    engineering: 45,
    contingency: 15,
    email: "shahrniaz77@gmail.com",
    downloads: [],
  };
  let settings = { ...defaultSettings };
  try {
    settings = {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem("sn-studio-settings") || "{}"),
    };
  } catch {}
  const SN_ENQUIRY_IMAGES = {
    ai: "/assets/shahrniaz/media/images/5a4bb17a5ad909acb0bd.jpg",
    calm: "/assets/shahrniaz/media/images/02bbf895a4c0b191875e.jpg",
    warm: "/assets/shahrniaz/media/images/6f642b304ee7cabe457b.jpg",
    bold: "/assets/shahrniaz/media/images/48ea5241f785d895dd05.jpg",
  };
  const SN_COUNTRY_CODES = window.SHN_DATA.get("shahrniaz/09-site-application/SN_COUNTRY_CODES-5");
  const SN_CONSULT_IMAGES = {
    kitchen: "/assets/shahrniaz/media/images/48bae6710f2cd5e79825.jpg",
    office: "/assets/shahrniaz/media/images/1ac60e50c768a48896ed.jpg",
    villa: "/assets/shahrniaz/media/images/1605c15663a1223380ec.jpg",
    residential: "/assets/shahrniaz/media/images/a5dcba0bce52a347f030.jpg",
    commercial: "/assets/shahrniaz/media/images/2ebb8c8ff06de728483a.jpg",
    tower: "/assets/shahrniaz/media/images/c2947fdd1ff53b595947.jpg",
  };
  const rp = (name, alt = "", eager = false) =>
    `<img src="${window.SN_NEW_IMAGES[name]}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  const heading = (k, h, p = "") =>
    `<section class="wrap editorial-head"><span class="eyebrow">${k}</span><h1>${h}</h1>${p ? `<p>${p}</p>` : ""}</section>`;

  const AS_PARTNER_URL = "AS-Industries-Offline-v8.html#/";
  /** partnersTeaser: site-application feature. Keep related handlers in this module. */
  function partnersTeaser() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/partnersTeaser-14", [
      window.SHN_TEMPLATES.text(AS_PARTNER_URL),
    ]);
  }
  /** partnersPage: site-application feature. Keep related handlers in this module. */
  function partnersPage() {
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/partnersPage-15", [
      window.SHN_TEMPLATES.text(window.SN_NEW_IMAGES["new-logo"]),
      window.SHN_TEMPLATES.text(AS_PARTNER_URL),
    ]);
  }

  const originalShopPartnerPage = partnersPage;
  partnersPage = function () {
    const card = window.SHN_TEMPLATES.render("shahrniaz/09-site-application/card-16", [
      window.SHN_TEMPLATES.text(t("SHOP / PERSONAL PRODUCTS", "فروشگاه / محصولات شخصی")),
      window.SHN_TEMPLATES.text(
        t(
          "Pet keychains, photo figurines and kitchen products.",
          "جاکلیدی حیوانات، فیگور از روی عکس و محصولات آشپزخانه.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Visit AS Shop ↗", "ورود به AS Shop ↗")),
    ]);
    return originalShopPartnerPage()
      .replace("Two studios.<br>One connected path.", t("Partners", "پارتنرها"))
      .replace("ENGINEERING / FABRICATION / SHOP", "ENGINEERING / FABRICATION")
      .replace(
        "Prototyping, 3D printing, custom parts and a shop for personal objects, including AS Shop pet keychains.",
        t(
          "Prototyping, 3D printing and custom parts.",
          "نمونه‌سازی، چاپ سه‌بعدی و ساخت قطعات اختصاصی.",
        ),
      )
      .replace("</article></div></section>", "</article>" + card + "</div></section>");
  };

  /** home: site-application feature. Keep related handlers in this module. */
  function home() {
    const path = (href, img, kicker, title, copy, action, primary = false) =>
      `<a class="ux-path-card ${primary ? "primary" : ""}" href="${href}"><img src="${img}" alt="" loading="lazy"><div><small>${kicker}</small><h3>${title}</h3><p>${copy}</p><b>${action}</b></div></a>`;
    const start = (scope, img, title, copy) =>
      `<a class="ux-start-card" href="#/estimate?scope=${scope}"><img src="${img}" alt="" loading="lazy"><span><strong>${title}</strong><small>${copy}</small><b>${t("Choose this path", "انتخاب این مسیر")} ↗</b></span></a>`;
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/home-17", [
      window.SHN_TEMPLATES.text(
        rp(
          "mall",
          t("Shiraz Mall, a selected Shahr Niaz project", "شیرازمال، پروژهٔ منتخب شهر نیاز"),
          true,
        ),
      ),
      window.SHN_TEMPLATES.text(
        t("ARCHITECTURE · INTERIORS · OBJECTS", "معماری · فضای داخلی · اشیا"),
      ),
      window.SHN_TEMPLATES.text(
        t("A clearer start<br>for your next space.", "فضای تازهٔ شما،<br>با شروعی روشن."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Tell us what you want to create. Begin with a free private design call, then receive a tailored proposal. Currently welcoming projects in Iran, Dubai and England.",
          "بگویید چه فضایی می‌خواهید بسازید. با یک گفت‌وگوی خصوصی رایگان شروع کنید و سپس پیشنهاد طراحی متناسب با پروژه‌تان دریافت کنید. پذیرای پروژه‌های ایران، دبی و انگلستان هستیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        link("#/estimate", t("Start my design", "شروع پروژهٔ طراحی"), "button"),
      ),
      window.SHN_TEMPLATES.text(link("#/building", t("See our work", "دیدن پروژه‌ها"))),
      window.SHN_TEMPLATES.text(t("02 MIN / TO START", "۲ دقیقه / شروع")),
      window.SHN_TEMPLATES.text(t("72H / YOUR PROPOSAL", "۷۲ ساعت / پیشنهاد شما")),
      window.SHN_TEMPLATES.text(t("FREE / FIRST CALL", "رایگان / جلسهٔ اول")),
      window.SHN_TEMPLATES.text(t("SELECTED WORK", "پروژهٔ منتخب")),
      window.SHN_TEMPLATES.text(t("FIND YOUR WAY", "مسیرتان را پیدا کنید")),
      window.SHN_TEMPLATES.text(t("What brings you here?", "چه کمکی از ما می‌خواهید؟")),
      window.SHN_TEMPLATES.text(
        t(
          "Choose a clear next step. You can explore the studio before sharing a project.",
          "قدم بعدی را ساده انتخاب کنید. می‌توانید پیش از ثبت پروژه، کارهای استودیو را ببینید.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        path(
          "#/estimate",
          SN_ENQUIRY_IMAGES.calm,
          "01 / " + t("DESIGN", "طراحی"),
          t("Design a space", "طراحی یک فضا"),
          t(
            "A guided brief and private first conversation.",
            "ثبت مرحله‌به‌مرحلهٔ اطلاعات پروژه و گفت‌وگوی خصوصی اولیه.",
          ),
          t("Start my project", "شروع پروژه"),
          true,
        ),
      ),
      window.SHN_TEMPLATES.text(
        path(
          "#/building",
          window.SN_NEW_IMAGES.mall,
          "02 / " + t("PROJECTS", "پروژه‌ها"),
          t("See our work", "دیدن پروژه‌ها"),
          t(
            "Explore architecture, interiors and built work.",
            "معماری، فضای داخلی و پروژه‌های انجام‌شده را ببینید.",
          ),
          t("Explore projects", "کاوش پروژه‌ها"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        path(
          "#/products",
          asset("objects"),
          "03 / " + t("OBJECTS", "اشیا"),
          t("Shape an object", "طراحی یک محصول"),
          t("Explore furniture and custom pieces.", "مبلمان و قطعات اختصاصی را بررسی کنید."),
          t("Explore objects", "دیدن محصولات"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        path(
          "#/ai",
          SN_ENQUIRY_IMAGES.ai,
          "04 / " + t("TOOLS", "ابزارها"),
          t("Explore our tools", "دیدن ابزارها"),
          t(
            "See the software and AI behind the practice.",
            "نرم‌افزار و ابزارهای AI مجموعه را بشناسید.",
          ),
          t("Explore tools", "دیدن ابزارها"),
        ),
      ),
      window.SHN_TEMPLATES.text(t("START A DESIGN", "شروع طراحی")),
      window.SHN_TEMPLATES.text(t("Start with your space.", "از فضای خودتان شروع کنید.")),
      window.SHN_TEMPLATES.text(
        t(
          "One choice opens a guided brief. Share as much as you know, then request a free discovery call.",
          "با یک انتخاب وارد ثبت مرحله‌به‌مرحلهٔ اطلاعات پروژه شوید. هرقدر اطلاعات دارید وارد کنید و درخواست جلسهٔ رایگان بدهید.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        start(
          "interior",
          SN_ENQUIRY_IMAGES.calm,
          t("Interior", "فضای داخلی"),
          t("Rooms, kitchens, workplaces and more", "اتاق‌ها، آشپزخانه، فضای کار و بیشتر"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        start(
          "exterior",
          SN_CONSULT_IMAGES.villa,
          t("Exterior", "فضای بیرونی"),
          t("Homes, façades, towers and landscapes", "خانه، نما، برج و محوطه"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        start(
          "both",
          SN_CONSULT_IMAGES.residential,
          t("Whole project", "کل پروژه"),
          t("Inside and outside, considered together", "داخل و بیرون، در یک نگاه"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Have a plot plan, survey or inspiration images? Bring them along. The first call is free.",
          "نقشهٔ زمین، پلان یا تصویر الهام‌بخش دارید؟ همراه بیاورید. جلسهٔ اول رایگان است.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("THE EXPERIENCE", "مسیر دریافت خدمت")),
      window.SHN_TEMPLATES.text(
        t("From first thought to a clear proposal.", "از ایدهٔ اول تا پیشنهادی روشن."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Niaz Esmaili, our professional designer and co-founder, personally shapes your design. AI helps us explore possibilities faster.",
          "نیاز اسمعیلی، طراح حرفه‌ای و هم‌بنیان‌گذار مجموعه، شخصاً مسیر طراحی شما را شکل می‌دهد. AI کمک می‌کند گزینه‌ها را سریع‌تر بسنجیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("TELL US", "شرح دهید")),
      window.SHN_TEMPLATES.text(t("Choose your project", "پروژه‌تان را انتخاب کنید")),
      window.SHN_TEMPLATES.text(
        t(
          "Choose the project, pin the site and add any plans or needs you already know.",
          "نوع پروژه و مکان آن را انتخاب کنید؛ پلان‌ها و نیازهایی که می‌دانید اضافه کنید.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("WE LISTEN", "ما می‌شنویم")),
      window.SHN_TEMPLATES.text(t("A private design conversation", "گفت‌وگوی خصوصی طراحی")),
      window.SHN_TEMPLATES.text(
        t(
          "Meet with us for a free 20-minute call to understand priorities, constraints and possibilities.",
          "در یک جلسهٔ رایگان ۲۰ دقیقه‌ای، اولویت‌ها، محدودیت‌ها و فرصت‌های پروژه را با هم بررسی می‌کنیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("YOU DECIDE", "شما تصمیم می‌گیرید")),
      window.SHN_TEMPLATES.text(t("Receive your proposal", "پیشنهادتان را دریافت کنید")),
      window.SHN_TEMPLATES.text(
        t(
          "Within 72 hours after the call and information review, receive the design scope, stages and fee proposal.",
          "ظرف ۷۲ ساعت پس از جلسه و بررسی اطلاعات، محدودهٔ طراحی، مراحل و هزینهٔ پیشنهادی را دریافت کنید.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        t("Start with a free private consultation", "شروع با مشاورهٔ خصوصی رایگان"),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "There is no design fee for the first call. We quote the paid design work after we understand your project.",
          "جلسهٔ اول هزینه‌ای ندارد. پس از شناخت پروژه، هزینهٔ مراحل طراحی را شفاف اعلام می‌کنیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        link("#/estimate", t("Start my brief", "شروع شرح پروژه"), "button"),
      ),
      window.SHN_TEMPLATES.text(t("SELECTED WORK", "پروژه‌های منتخب")),
      window.SHN_TEMPLATES.text(t("See the thinking in practice.", "این نگاه را در عمل ببینید.")),
      window.SHN_TEMPLATES.text(link("#/building", t("View all projects", "دیدن همهٔ پروژه‌ها"))),
      window.SHN_TEMPLATES.text(
        [galleryData[0], galleryData[1], galleryData[5], galleryData[3]].map(projectCard).join(""),
      ),
      window.SHN_TEMPLATES.text(
        t("Your idea deserves a clear beginning.", "ایدهٔ شما شایستهٔ شروعی روشن است."),
      ),
      window.SHN_TEMPLATES.text(
        link("#/estimate", t("Start my design", "شروع پروژهٔ طراحی"), "button"),
      ),
    ]);
  }

  function projectCard(p) {
    return `<a class="project-card" href="#/project/${p.id}">${rp(p.images[0], tx(p.name))}<div><h3>${tx(p.name)}</h3><span>↗</span></div><p>${tx(p.label)} / ${t("Iran", "ایران")}</p></a>`;
  }
  /** building: site-application feature. Keep related handlers in this module. */
  function building() {
    return (
      heading(
        t("Building / Our practice", "ساختمان / خدمات ما"),
        t("Designed together.<br>Built with purpose.", "طراحی یکپارچه.<br>ساخت هدفمند."),
        t(
          "Architecture, interiors, structure, electrical and mechanical engineering, landscape and construction coordination. Currently welcoming projects in Iran, Dubai and England.",
          "معماری، فضای داخلی، سازه، برق، تأسیسات مکانیکی، لندسکیپ و هماهنگی اجرا؛ فعال در دبی، ریشه‌دار در ایران و با نگاهی بین‌المللی.",
        ),
      ) +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/building-18", [
        window.SHN_TEMPLATES.text(
          [
            t("Architecture", "معماری"),
            t("Interiors", "طراحی داخلی"),
            t("Engineering / MEP", "مهندسی / تأسیسات"),
            t("Landscape", "لندسکیپ"),
            t("Design & build", "طراحی و اجرا"),
          ]
            .map((x) => `<span>${x}</span>`)
            .join(""),
        ),
        window.SHN_TEMPLATES.text(t("Project archive", "آرشیو پروژه‌ها")),
        window.SHN_TEMPLATES.text(
          link("#/estimate", t("Estimate your project", "برآورد پروژهٔ شما")),
        ),
        window.SHN_TEMPLATES.text(
          [
            ["all", "All", "همه"],
            ["commercial", "Commercial", "تجاری"],
            ["residential", "Residential", "مسکونی"],
            ["interiors", "Interiors", "داخلی"],
            ["landscape", "Landscape", "لندسکیپ"],
          ]
            .map(
              ([id, en, fa], i) =>
                `<button data-filter="${id}" aria-pressed="${!i}">${t(en, fa)}</button>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(galleryData.map(projectCard).join("")),
      ])
    );
  }
  /** projectPage: site-application feature. Keep related handlers in this module. */
  function projectPage() {
    const p = galleryData.find((x) => x.id === current.split("/")[2]);
    if (!p) return notFound();
    return (
      heading(tx(p.label), tx(p.name), tx(p.desc)) +
      `${["hospitality", "mall", "cinema"].includes(p.id) ? `<div class="wrap project-source"><a class="text-link" href="https://www.shahrniaz.ae/p/${p.id === "hospitality" ? "Shiraz-Mall-Food-Court" : p.id === "mall" ? "Shiraz-Mall-Complex" : p.id === "cinema" ? "Shiraz-Mall-Cimplex" : ""}/" target="_blank" rel="noopener">${t("Visit the studio’s original archive", "مشاهدهٔ آرشیو اصلی استودیو")} ↗</a></div>` : ""}<section class="detail-gallery">${p.images.map((im, i) => `<figure>${rp(im, tx(p.name) + " / " + (i + 1), i === 0)}<figcaption>${String(i + 1).padStart(2, "0")} / ${tx(p.name)}</figcaption></figure>`).join("")}</section><div class="wrap cta">${link("#/building", t("Back to projects", "بازگشت به پروژه‌ها"))}${link("#/estimate", t("Discuss a similar project", "شروع پروژه‌ای مشابه"))}</div>`
    );
  }
  /** peopleSection: site-application feature. Keep related handlers in this module. */
  function peopleSection() {
    return (
      '<section class="wrap people"><div class="section-heading"><h2>' +
      t("People", "افراد") +
      "</h2><span>" +
      t("A shared practice since 1998", "همکاری از ۱۳۷۷") +
      '</span></div><div class="people-grid"><article>' +
      rp("shahram", t("Shahram Zare", "شهرام زارع")) +
      "<h3>" +
      t("Shahram Zare", "شهرام زارع") +
      "</h3><p>" +
      t("Architect · Co-founder", "معمار · هم‌بنیان‌گذار") +
      '</p><p class="sn-person-bio">' +
      t(
        "Shahram helped establish Shahr Niaz in 1998. His architectural perspective connects the ambition of a project to the decisions that make it possible to build.",
        "شهرام از بنیان‌گذاران شهر نیاز در سال ۱۳۷۷ است. نگاه معماری او ایدهٔ هر پروژه را به تصمیم‌هایی پیوند می‌دهد که ساخت آن را ممکن می‌کنند.",
      ) +
      '</p></article><article><span class="eyebrow">DESIGN DIRECTION</span><h3>' +
      t("Niaz Esmaili", "نیاز اسمعیلی") +
      "</h3><p>" +
      t("Designer · Co-founder", "طراح · هم‌بنیان‌گذار") +
      '</p><p class="sn-person-bio">' +
      t(
        "Niaz helped establish the studio and guides its design direction. She begins by listening to how clients want to live and translates those priorities into spaces and objects with a personal point of view.",
        "نیاز از بنیان‌گذاران استودیو است و مسیر طراحی آن را هدایت می‌کند. او کار را با شنیدن شیوهٔ زندگی و خواسته‌های کارفرما آغاز می‌کند و آن‌ها را به فضاها و محصولاتی با هویت شخصی تبدیل می‌کند.",
      ) +
      "</p></article></div></section>"
    );
  }
  /** studio: site-application feature. Keep related handlers in this module. */
  function studio() {
    return (
      heading(
        t("Studio / A new chapter", "استودیو / فصل تازه"),
        t("Rooted in experience.<br>Open to what’s next.", "ریشه در تجربه.<br>رو به آینده."),
        t(
          "Founded by Shahram Zare and Niaz Esmaili in 1998, Shahr Niaz brings an enduring architectural partnership into a new era. Our rebrand marks our expansion into Dubai and the integration of our own software and AI into the practice.",
          "شهر نیاز در سال ۱۳۷۷ به دست شهرام زارع و نیاز اسمعیلی شکل گرفت. اکنون این همکاری معماری وارد دوره‌ای تازه می‌شود؛ بازآفرینی برند ما با گسترش فعالیت در دبی و ورود نرم‌افزار و هوش مصنوعی خودمان به مجموعه همراه است.",
        ),
      ) +
      peopleSection() +
      `<div class="wrap cta">${link("#/contact", t("Work with us", "همکاری با ما"))}${link("#/painting", t("Painting & art", "نقاشی و هنر"))}</div>`
    );
  }
  /** ai: site-application feature. Keep related handlers in this module. */
  function ai() {
    const rows = settings.downloads;
    return (
      heading(
        t("Software / AI", "نرم‌افزار / هوش مصنوعی"),
        t("Intelligence,<br>shared.", "هوش،<br>برای همه."),
        t(
          "We build software and AI tools, and bring AI into the way we design. Less repetitive work gives us more room to explore your project, compare alternatives and work towards better value.",
          "ما نرم‌افزار و ابزارهای هوش مصنوعی می‌سازیم و AI را وارد شیوهٔ طراحی‌مان کرده‌ایم. کاهش کارهای تکراری، فرصت بیشتری برای بررسی پروژهٔ شما، مقایسهٔ گزینه‌ها و رسیدن به هزینهٔ مناسب‌تر ایجاد می‌کند.",
        ),
      ) +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/ai-19", [
        window.SHN_TEMPLATES.text(SN_ENQUIRY_IMAGES.ai),
        window.SHN_TEMPLATES.text(
          t("AI-inspired architectural concept", "کانسپت معماری الهام‌گرفته از هوش مصنوعی"),
        ),
        window.SHN_TEMPLATES.text(t("DESIGN × TECHNOLOGY", "طراحی × تکنولوژی")),
        window.SHN_TEMPLATES.text(t("Free tools & downloads", "ابزارها و دانلودهای رایگان")),
        window.SHN_TEMPLATES.text(t("Built by Shahr Niaz", "ساختهٔ شهر نیاز")),
        window.SHN_TEMPLATES.text(t("Kitchen planner", "طراح آشپزخانه")),
        window.SHN_TEMPLATES.text(
          t(
            "Free browser tool · 2D + 3D · export your design",
            "ابزار رایگان در مرورگر · دوبعدی و سه‌بعدی · خروجی طرح",
          ),
        ),
        window.SHN_TEMPLATES.text(
          rows
            .map(
              (r, i) =>
                `<a href="${esc(r.url)}" download target="_blank" rel="noopener"><span>0${i + 2}</span><div><h3>${esc(r.name)}</h3><p>${t("Free download", "دانلود رایگان")} · ${esc(r.platform)}</p></div><b>↓</b></a>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(
          !rows.length
            ? `<p class="note">${t("Downloadable software and AI releases will appear here when their installation files are available.", "نسخه‌های قابل دانلود نرم‌افزار و ابزارهای AI پس از آماده‌شدن فایل نصب، اینجا قرار می‌گیرند.")}</p>`
            : "",
        ),
      ])
    );
  }
  /** contact: site-application feature. Keep related handlers in this module. */
  function contact() {
    return (
      heading(
        t("Contact", "تماس"),
        t("Let’s make<br>something meaningful.", "ایدهٔ شما را<br>با هم پیش ببریم."),
        t(
          "Tell us about your project in Iran, Dubai or England. Start with a brief or contact our team in Dubai.",
          "دربارهٔ خانه، محوطه یا پروژهٔ آینده‌تان بگویید. با شرح پروژه شروع کنید یا با تیم ما در دبی تماس بگیرید.",
        ),
      ) +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/contact-20", [
        window.SHN_TEMPLATES.text(esc(settings.email)),
        window.SHN_TEMPLATES.text(esc(settings.email)),
        window.SHN_TEMPLATES.text(
          link("#/estimate", t("Start your design", "شروع طراحی"), "button"),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Architecture · Engineering · Interiors · Furniture",
            "معماری · مهندسی · طراحی داخلی · مبلمان",
          ),
        ),
      ])
    );
  }
  function landingEstimate() {
    return (
      '<div id="estimate" class="landing-estimate">' +
      estimatePage().replace("<h1>", "<h2>").replace("</h1>", "</h2>") +
      "</div>"
    );
  }
  function snServiceLocation(code) {
    return { IR: "Iran", AE: "Dubai, UAE", GB: "England, UK" }[code] || "";
  }
  function countryOptions() {
    return '<option value="IR">Iran</option><option value="AE">Dubai, UAE</option><option value="GB">England, UK</option>';
  }
  const CX_SCOPE = [
    ["interior", "Interior", "فضای داخلی", "warm"],
    ["exterior", "Architecture & exterior", "معماری و نمای بیرونی", "villa"],
    ["both", "Whole project", "کل پروژه", "residential"],
  ];
  const CX_PROJECTS = window.SHN_DATA.get("shahrniaz/09-site-application/CX_PROJECTS-6");
  const CX_STYLES = window.SHN_DATA.get("shahrniaz/09-site-application/CX_STYLES-7");
  const CX_FILES = [
    ["plot", "Plot plan / title deed", "نقشهٔ زمین / سند"],
    ["survey", "Site survey / dimensions", "برداشت زمین / ابعاد"],
    ["plans", "Existing floor plans", "پلان‌های موجود"],
    ["photos", "Site photos / video", "عکس و ویدئوی محل"],
    ["permits", "Planning conditions / permits", "ضوابط / مجوزها"],
    ["inspiration", "Inspiration / references", "تصاویر الهام‌بخش"],
    ["other", "Other document", "مدرک دیگر"],
  ];
  const CX_AREAS = [
    ["living", "Living", "نشیمن"],
    ["kitchen", "Kitchen", "آشپزخانه"],
    ["dining", "Dining", "ناهارخوری"],
    ["bedrooms", "Bedrooms", "اتاق‌خواب"],
    ["bathrooms", "Bathrooms", "حمام و سرویس"],
    ["office", "Work space", "فضای کار"],
    ["facade", "Facade", "نما"],
    ["terrace", "Terrace", "تراس"],
    ["garden", "Garden", "باغ"],
    ["pool", "Pool", "استخر"],
    ["parking", "Parking", "پارکینگ"],
    ["storage", "Storage", "انبار"],
    ["accessibility", "Accessibility", "دسترس‌پذیری"],
    ["sustainability", "Sustainability", "پایداری"],
  ];
  const cxDraft =
    window.SN_CONSULT_DRAFT ||
    (window.SN_CONSULT_DRAFT = window.SHN_DATA.get(
      "shahrniaz/09-site-application/SN_CONSULT_DRAFT-8",
    ));
  function cxImage(key) {
    return (
      SN_CONSULT_IMAGES[key] ||
      SN_ENQUIRY_IMAGES[key] ||
      window.SN_NEW_IMAGES?.[key] ||
      asset("objects")
    );
  }
  /** cxCard: site-application feature. Keep related handlers in this module. */
  function cxCard(row, name, selected, desc = "") {
    const [id, en, fa, img] = row;
    return `<label class="cx-card ux-choice-card"><input type="radio" name="${name}" value="${id}" ${id === selected ? "checked" : ""}><span>${img ? `<img src="${cxImage(img)}" alt="" loading="eager">` : ""}<strong>${t(en, fa)}</strong><small>${desc || t("Choose this direction", "انتخاب این مسیر")}</small></span></label>`;
  }
  function cxField(name, en, fa, type = "text", placeholder = "", extra = "") {
    return `<label class="cx-field"><span>${t(en, fa)}</span><input name="${name}" type="${type}" placeholder="${placeholder}" ${extra}></label>`;
  }
  /** estimatePage: site-application feature. Keep related handlers in this module. */
  function estimatePage() {
    const labels = [
      ["Your idea", "ایدهٔ شما"],
      ["Your place", "مکان شما"],
      ["Meet Niaz", "دیدار با نیاز"],
    ];
    return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/estimatePage-21", [
      window.SHN_TEMPLATES.text(t("Back to home", "بازگشت به خانه")),
      window.SHN_TEMPLATES.text(
        t("Tell us the story<br>of your space.", "داستان فضای خود را<br>برای ما بگویید."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Begin with what you know. Add plans, plot details and inspiration as you go. We currently welcome projects in Iran, Dubai and England.",
          "از چیزهایی که می‌دانید شروع کنید. پلان، اطلاعات زمین و تصاویر دلخواه را به‌تدریج اضافه کنید تا گفت‌وگوی دقیق‌تری داشته باشیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Begin your brief ↓", "شروع شرح پروژه ↓")),
      window.SHN_TEMPLATES.text(t("A private start", "شروع خصوصی")),
      window.SHN_TEMPLATES.text(
        t("A free 20-minute discovery call.", "جلسهٔ آشنایی ۲۰ دقیقه‌ای رایگان."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Designed with Niaz Esmaili, our professional designer and co-founder.",
          "با طراحی نیاز اسمعیلی، طراح حرفه‌ای و هم‌بنیان‌گذار مجموعه.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "We aim to arrange your call within 72 hours of a complete brief, subject to confirmation. After the call and review, we send a written scope, stages and design fee proposal within 72 hours.",
          "هدف ما برگزاری جلسه ظرف ۷۲ ساعت پس از دریافت شرح کامل پروژه است؛ زمان با ایمیل تأیید می‌شود. پس از جلسه و بررسی، محدودهٔ کار، مراحل و پیشنهاد هزینهٔ طراحی را ظرف ۷۲ ساعت مکتوب می‌فرستیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        labels.map((x, i) => `<span data-step-label="${i}">${t(...x)}</span>`).join(""),
      ),
      window.SHN_TEMPLATES.text(t("Your project", "پروژهٔ شما")),
      window.SHN_TEMPLATES.text(t("Where shall we begin?", "از کجا شروع کنیم؟")),
      window.SHN_TEMPLATES.text(
        t(
          "Choose the part of your project you want us to explore first.",
          "بخشی را انتخاب کنید که می‌خواهید ابتدا با هم بررسی کنیم.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        CX_SCOPE.map((x) =>
          cxCard(x, "scope", cxDraft.scope, t("Choose this focus", "انتخاب این بخش")),
        ).join(""),
      ),
      window.SHN_TEMPLATES.text(t("What kind of project is it?", "چه نوع پروژه‌ای دارید؟")),
      window.SHN_TEMPLATES.text(t("Choose the closest match", "نزدیک‌ترین گزینه را انتخاب کنید")),
      window.SHN_TEMPLATES.text(
        cxField("otherProject", "Tell us in a few words", "در چند کلمه توضیح دهید"),
      ),
      window.SHN_TEMPLATES.text(t("Location & files", "مکان و مدارک")),
      window.SHN_TEMPLATES.text(t("Let us see the place.", "بگذارید مکان را ببینیم.")),
      window.SHN_TEMPLATES.text(
        t(
          "A location pin and any documents you already have help us understand the site. Nothing is required yet beyond country and city.",
          "نقطهٔ مکان و هر مدرکی که دارید به شناخت زمین کمک می‌کند. فعلاً جز کشور و شهر، بقیه اختیاری است.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Project location", "محل پروژه")),
      window.SHN_TEMPLATES.text(t("Choose a location", "انتخاب محل")),
      window.SHN_TEMPLATES.text(countryOptions()),
      window.SHN_TEMPLATES.text(cxField("city", "City", "شهر")),
      window.SHN_TEMPLATES.text(
        cxField(
          "address",
          "Site address, plot number or neighbourhood",
          "آدرس، شمارهٔ پلاک یا محله",
          "text",
          t("Optional", "اختیاری"),
        ),
      ),
      window.SHN_TEMPLATES.text(t("Pin your site", "مکان پروژه را مشخص کنید")),
      window.SHN_TEMPLATES.text(t("Optional · online map", "اختیاری · نقشهٔ آنلاین")),
      window.SHN_TEMPLATES.text(
        t(
          "The map is here on the page. Add a map link, coordinates or your current location to centre it on your plot, then trace your boundary. A deed alone cannot reliably place a pin.",
          "نقشه همین‌جا نمایش داده می‌شود. با لینک، مختصات یا موقعیت فعلی آن را روی زمینتان ببرید و سپس محدوده را ترسیم کنید. سند به‌تنهایی مکان را با اطمینان مشخص نمی‌کند.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Choose on OpenStreetMap ↗", "انتخاب روی نقشه ↗")),
      window.SHN_TEMPLATES.text(t("Use my location", "موقعیت فعلی من")),
      window.SHN_TEMPLATES.text(
        cxField(
          "mapLink",
          "Paste a Google Maps or OpenStreetMap link",
          "لینک نقشهٔ گوگل یا OpenStreetMap را وارد کنید",
          "url",
          t("Paste map link", "لینک نقشه را وارد کنید"),
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "lat",
          "Latitude",
          "عرض جغرافیایی",
          "number",
          "25.2048",
          'step="any" min="-90" max="90"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "lon",
          "Longitude",
          "طول جغرافیایی",
          "number",
          "55.2708",
          'step="any" min="-180" max="180"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Map requires internet. Location and permit details are reviewed by a person.",
          "نقشه به اینترنت نیاز دارد. موقعیت و ضوابط توسط متخصص بررسی می‌شود.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Share what you have", "هر چه دارید به اشتراک بگذارید")),
      window.SHN_TEMPLATES.text(t("You can add files later", "بعداً هم می‌توانید اضافه کنید")),
      window.SHN_TEMPLATES.text(CX_FILES.map((x) => `<span>${t(x[1], x[2])}</span>`).join("")),
      window.SHN_TEMPLATES.text(t("Document type", "نوع مدرک")),
      window.SHN_TEMPLATES.text(
        CX_FILES.map((x) => `<option value="${x[0]}">${t(x[1], x[2])}</option>`).join(""),
      ),
      window.SHN_TEMPLATES.text(t("Add files", "افزودن فایل")),
      window.SHN_TEMPLATES.text(
        t(
          "In this offline preview, files stay on this device. The studio will receive them only when you attach them to your email or when a secure upload service is connected. You may hide unnecessary personal ID details on title deeds.",
          "در این نسخهٔ آفلاین فایل‌ها روی همین دستگاه می‌مانند. استودیو فقط وقتی آن‌ها را به ایمیل پیوست کنید یا سرویس آپلود امن متصل شود، دریافتشان می‌کند. اگر سند مالکیت می‌فرستید، اطلاعات هویتی غیرضروری را بپوشانید.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Space needs", "نیازهای فضا")),
      window.SHN_TEMPLATES.text(t("How should it live?", "قرار است چگونه زندگی کند؟")),
      window.SHN_TEMPLATES.text(
        t(
          "Use rough numbers if that is all you have. “Not sure yet” is a perfectly good answer.",
          "اگر فقط عدد تقریبی دارید همان را بنویسید. «هنوز مطمئن نیستم» هم پاسخ خوبی است.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Land & building", "زمین و ساختمان")),
      window.SHN_TEMPLATES.text(
        cxField("plotArea", "Plot area", "مساحت زمین", "number", "m²", 'min="0" step="any"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "existingArea",
          "Existing / planned built area",
          "زیربنای موجود / مدنظر",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "floorsWanted",
          "Desired floors above ground",
          "طبقات دلخواه روی زمین",
          "number",
          "0",
          'min="0" step="1"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "floorsAllowed",
          "Permitted floors, if known",
          "طبقات مجاز، اگر می‌دانید",
          "number",
          "0",
          'min="0" step="1"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField("basements", "Basement levels", "طبقات زیرزمین", "number", "0", 'min="0" step="1"'),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Planning permissions differ by location. Your entries are your understanding, not a verification by the studio.",
          "ضوابط در هر منطقه متفاوت‌اند. این اعداد اطلاعات اولیهٔ شما هستند و تأیید مجوز محسوب نمی‌شوند.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Rooms & everyday life", "فضاها و زندگی روزمره")),
      window.SHN_TEMPLATES.text(t("Optional", "اختیاری")),
      window.SHN_TEMPLATES.text(
        cxField("bedrooms", "Bedrooms", "اتاق‌خواب", "number", "0", 'min="0" step="1"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField("bathrooms", "Bathrooms / WCs", "حمام / سرویس", "number", "0", 'min="0" step="1"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "kitchenArea",
          "Kitchen area",
          "مساحت آشپزخانه",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField("workstations", "Workstations", "تعداد جای کار", "number", "0", 'min="0" step="1"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField("meetingRooms", "Meeting rooms", "اتاق جلسه", "number", "0", 'min="0" step="1"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "commercialArea",
          "Public / retail area",
          "مساحت عمومی / تجاری",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "guestRooms",
          "Guest rooms / units",
          "اتاق مهمان / واحد",
          "number",
          "0",
          'min="0" step="1"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "seats",
          "Seats / capacity",
          "تعداد نفرات / ظرفیت",
          "number",
          "0",
          'min="0" step="1"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "gardenArea",
          "Garden / outdoor area",
          "مساحت باغ / فضای باز",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "poolArea",
          "Pool area, if planned",
          "مساحت استخر، در صورت نیاز",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "parkingCars",
          "Parking spaces / cars",
          "تعداد جای پارک / خودرو",
          "number",
          "0",
          'min="0" step="1"',
        ),
      ),
      window.SHN_TEMPLATES.text(
        cxField(
          "parkingArea",
          "Parking area",
          "مساحت پارکینگ",
          "number",
          "m²",
          'min="0" step="any"',
        ),
      ),
      window.SHN_TEMPLATES.text(t("What matters most?", "کدام فضاها مهم‌ترند؟")),
      window.SHN_TEMPLATES.text(
        CX_AREAS.map(
          (x) =>
            `<label><input type="checkbox" name="area" value="${x[0]}"><span>${t(x[1], x[2])}</span></label>`,
        ).join(""),
      ),
      window.SHN_TEMPLATES.text(
        t("More details for a sharper proposal", "جزئیات بیشتر برای پیشنهاد دقیق‌تر"),
      ),
      window.SHN_TEMPLATES.text(t("Planning status", "وضعیت مجوز")),
      window.SHN_TEMPLATES.text(t("Not sure yet", "هنوز مشخص نیست")),
      window.SHN_TEMPLATES.text(t("No application yet", "هنوز اقدام نشده")),
      window.SHN_TEMPLATES.text(t("In progress", "در حال پیگیری")),
      window.SHN_TEMPLATES.text(t("Approved", "تأییدشده")),
      window.SHN_TEMPLATES.text(
        cxField("budget", "Indicative budget / currency", "بودجهٔ تقریبی / ارز"),
      ),
      window.SHN_TEMPLATES.text(cxField("start", "Ideal project start", "زمان دلخواه شروع")),
      window.SHN_TEMPLATES.text(
        t(
          "Site constraints, accessibility, sustainability, family needs or anything else",
          "محدودیت زمین، دسترس‌پذیری، پایداری، نیازهای خانواده یا هر نکتهٔ دیگر",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Design feeling", "حس طراحی")),
      window.SHN_TEMPLATES.text(
        t("Show us what feels like you.", "نشان دهید چه چیزی به شما نزدیک است."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "A direction is a conversation starter, not a fixed design. You can also upload reference images in the previous step.",
          "این انتخاب فقط آغاز گفت‌وگوست و طرح نهایی را محدود نمی‌کند. می‌توانید در مرحلهٔ قبل تصویر مرجع هم اضافه کنید.",
        ),
      ),
      window.SHN_TEMPLATES.text(
        t("Describe the feeling in your own words", "حس دلخواهتان را با کلمات خودتان توصیف کنید"),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Light, privacy, materials, a memory, a place...",
          "نور، حریم خصوصی، متریال، یک خاطره، یک مکان...",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Meet in Dubai time", "جلسه با ساعت دبی")),
      window.SHN_TEMPLATES.text(t("Let us make time for your idea.", "برای ایده‌تان وقت بگذاریم.")),
      window.SHN_TEMPLATES.text(
        t(
          "Choose a preferred 20-minute call time. All slots are shown in Dubai time, with your local time alongside. The studio confirms availability by email.",
          "زمان دلخواه جلسهٔ ۲۰ دقیقه‌ای را انتخاب کنید. ساعت دبی و ساعت محلی شما کنار هم نمایش داده می‌شود. استودیو زمان نهایی را از طریق ایمیل تأیید می‌کند.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("How can we reach you?", "چطور با شما تماس بگیریم؟")),
      window.SHN_TEMPLATES.text(
        cxField("name", "Your name", "نام شما", "text", "", 'autocomplete="name"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField("email", "Email address", "ایمیل", "email", "", 'autocomplete="email"'),
      ),
      window.SHN_TEMPLATES.text(
        cxField("phone", "Phone / WhatsApp", "تلفن / واتساپ", "tel", "", 'autocomplete="tel"'),
      ),
      window.SHN_TEMPLATES.text(t("Preferred contact", "روش تماس دلخواه")),
      window.SHN_TEMPLATES.text(t("Phone / WhatsApp", "تلفن / واتساپ")),
      window.SHN_TEMPLATES.text(t("Review", "مرور")),
      window.SHN_TEMPLATES.text(t("Your project, clearly framed.", "تصویری روشن از پروژهٔ شما.")),
      window.SHN_TEMPLATES.text(
        t(
          "Review the essentials. You can return to any step before preparing the request.",
          "اطلاعات اصلی را مرور کنید. پیش از آماده‌کردن درخواست، می‌توانید به مراحل قبل برگردید.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Free private call", "جلسهٔ خصوصی رایگان")),
      window.SHN_TEMPLATES.text(
        t("20 minutes · time confirmed by email", "۲۰ دقیقه · زمان با ایمیل تأیید می‌شود"),
      ),
      window.SHN_TEMPLATES.text(t("Personal proposal", "پیشنهاد اختصاصی")),
      window.SHN_TEMPLATES.text(
        t(
          "Scope, stages and design fee within 72 hours after the call and information review",
          "محدوده، مراحل و هزینهٔ طراحی ظرف ۷۲ ساعت پس از جلسه و بررسی اطلاعات",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Design begins by agreement", "شروع طراحی با توافق")),
      window.SHN_TEMPLATES.text(
        t("No design fee is charged at this stage", "در این مرحله هزینهٔ طراحی دریافت نمی‌شود"),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "I understand this preview prepares an email request. My preferred time is not a confirmed booking, and uploaded files are not sent automatically.",
          "می‌دانم این نسخه یک ایمیل درخواست آماده می‌کند. زمان انتخابی رزرو قطعی نیست و فایل‌های آپلودشده خودکار ارسال نمی‌شوند.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Back", "بازگشت")),
      window.SHN_TEMPLATES.text(t("Continue", "ادامه")),
      window.SHN_TEMPLATES.text(
        t("Thoughtful design starts with listening.", "طراحیِ دقیق با شنیدن آغاز می‌شود."),
      ),
      window.SHN_TEMPLATES.text(
        t(
          "Niaz Esmaili will personally guide your design direction.",
          "نیاز اسمعیلی شخصاً مسیر طراحی شما را هدایت می‌کند.",
        ),
      ),
      window.SHN_TEMPLATES.text(cxImage("villa")),
      window.SHN_TEMPLATES.text(t("Your vision. Our expertise.", "چشم‌انداز شما. تجربهٔ ما.")),
      window.SHN_TEMPLATES.text(t("Private 20-minute first call", "جلسهٔ خصوصی ۲۰ دقیقه‌ای اولیه")),
      window.SHN_TEMPLATES.text(
        t("Written proposal after consultation", "پیشنهاد مکتوب پس از مشاوره"),
      ),
      window.SHN_TEMPLATES.text(t("Iran · Dubai · England", "پروژه‌ها در کشورهای مختلف")),
      window.SHN_TEMPLATES.text(
        t("Tell us what you are imagining.", "به ما بگویید چه چیزی در ذهن دارید."),
      ),
      window.SHN_TEMPLATES.text(t("One last step: send it.", "یک گام مانده: ارسال درخواست.")),
      window.SHN_TEMPLATES.text(
        t(
          "Your project summary is ready. Download it, then open your email and attach your plans or documents yourself. The studio has not received anything yet.",
          "خلاصهٔ پروژه آماده است. آن را دانلود کنید، سپس ایمیل را باز کنید و پلان‌ها یا مدارک را خودتان پیوست کنید. استودیو هنوز چیزی دریافت نکرده است.",
        ),
      ),
      window.SHN_TEMPLATES.text(t("Download project brief", "دانلود خلاصهٔ پروژه")),
      window.SHN_TEMPLATES.text(t("Open email to send ↗", "بازکردن ایمیل برای ارسال ↗")),
    ]);
  }

  /** settingsPage: site-application feature. Keep related handlers in this module. */
  function settingsPage() {
    return (
      heading(
        t("Studio settings", "تنظیمات استودیو"),
        t("Make it yours.", "مطابق نیاز شما."),
        t(
          "Prototype settings are saved on this browser. Export them to transfer to another device. For a public website, these controls require a protected administration service.",
          "تنظیمات این نسخه در همین مرورگر ذخیره می‌شود. برای انتقال به دستگاه دیگر خروجی بگیرید. در سایت عمومی، این کنترل‌ها باید به مدیریت دارای احراز هویت متصل شوند.",
        ),
      ) +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/settingsPage-22", [
        window.SHN_TEMPLATES.text(
          [
            ["design", "Architecture design / m²", "طراحی معماری / مترمربع"],
            ["build", "Construction / m²", "ساخت / مترمربع"],
            ["landDesign", "Landscape design / m²", "طراحی محوطه / مترمربع"],
            ["landBuild", "Landscape construction / m²", "اجرای محوطه / مترمربع"],
            ["engineering", "Engineering design / m²", "طراحی مهندسی / مترمربع"],
            ["contingency", "Budget range ± %", "دامنهٔ بودجه ± درصد"],
          ]
            .map(
              ([key, en, fa]) =>
                `<label>${t(en, fa)}${key !== "contingency" ? " (AED)" : ""}<input name="${key}" value="${settings[key]}" type="number" min="0" max="${key === "contingency" ? 50 : 1000000}" step="0.01" required></label>`,
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(t("Enquiry email", "ایمیل دریافت درخواست")),
        window.SHN_TEMPLATES.text(esc(settings.email)),
        window.SHN_TEMPLATES.text(t("Free software downloads", "دانلودهای رایگان نرم‌افزار")),
        window.SHN_TEMPLATES.text(
          t(
            "Add up to three releases using direct HTTPS download links. Leave unused rows empty.",
            "تا سه نرم‌افزار با لینک مستقیم HTTPS اضافه کنید. ردیف‌های اضافی را خالی بگذارید.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          [0, 1, 2]
            .map((i) =>
              window.SHN_TEMPLATES.render("shahrniaz/09-site-application/settingsPage-23", [
                window.SHN_TEMPLATES.text(t("Name", "نام")),
                window.SHN_TEMPLATES.text(i),
                window.SHN_TEMPLATES.text(esc(settings.downloads[i]?.name || "")),
                window.SHN_TEMPLATES.text(t("Platform / version", "پلتفرم / نسخه")),
                window.SHN_TEMPLATES.text(i),
                window.SHN_TEMPLATES.text(esc(settings.downloads[i]?.platform || "")),
                window.SHN_TEMPLATES.text(t("Download URL", "لینک دانلود")),
                window.SHN_TEMPLATES.text(i),
                window.SHN_TEMPLATES.text(esc(settings.downloads[i]?.url || "")),
              ]),
            )
            .join(""),
        ),
        window.SHN_TEMPLATES.text(t("Save settings", "ذخیرهٔ تنظیمات")),
        window.SHN_TEMPLATES.text(t("Export settings", "خروجی تنظیمات")),
        window.SHN_TEMPLATES.text(t("Import settings", "ورود تنظیمات")),
      ])
    );
  }
  function saveBlob(data, name, type = "application/json") {
    const a = document.createElement("a"),
      u = URL.createObjectURL(new Blob([data], { type }));
    a.href = u;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 2000);
  }
  /** oldMountNew: site-application feature. Keep related handlers in this module. */
  function oldMountNew() {
    document.querySelectorAll("[data-estimate-jump]").forEach(
      (a) =>
        (a.onclick = (e) => {
          e.preventDefault();
          document.getElementById("estimate").scrollIntoView({ behavior: "smooth" });
        }),
    );
    $$("[data-filter]").forEach(
      (b) =>
        (b.onclick = () => {
          $$("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          $("#archive-grid").innerHTML = galleryData
            .filter((p) => b.dataset.filter === "all" || p.category === b.dataset.filter)
            .map(projectCard)
            .join("");
        }),
    );
    const form = $("#estimate-form");
    if (form) {
      let report = "";
      const calc = () => {
        const d = Object.fromEntries(new FormData(form));
        const valid =
          ["area", "land", "city"].every((k) => form.elements[k].checkValidity()) &&
          (d.type === "landscape" ? +d.land > 0 : +d.area > 0 || +d.land > 0);
        if (!valid) {
          $("#estimate-values").innerHTML =
            `<p>${t("Enter a valid area and complete the required fields.", "مساحت معتبر و فیلدهای الزامی را وارد کنید.")}</p>`;
          report = "";
          return;
        }
        const landscape = d.type === "landscape",
          a = landscape ? 0 : +d.area,
          l = +d.land,
          q = +d.quality,
          f = d.type === "commercial" ? 1.2 : d.type === "interior" ? 0.7 : 1;
        const design = (a * settings.design * f + l * settings.landDesign) * q,
          engineering = a * settings.engineering * +d.mep,
          build = (a * settings.build * f + l * settings.landBuild) * q;
        const range = (n) => {
          const v = settings.contingency / 100;
          return `${Math.round(n * (1 - v)).toLocaleString()} – ${Math.round(n * (1 + v)).toLocaleString()}`;
        };
        const rows = [
          [t("Architecture & landscape design", "طراحی معماری و محوطه"), design],
          [t("Engineering design", "طراحی مهندسی"), engineering],
          [t("Construction", "اجرا"), build],
          [t("Design + construction total", "مجموع طراحی و اجرا"), design + engineering + build],
        ];
        $("#estimate-values").innerHTML = rows
          .map(
            ([label, n]) =>
              `<div><span>${label}</span><strong>${range(n)}</strong><small>AED</small></div>`,
          )
          .join("");
        report = `SHAHR NIAZ — INDICATIVE ESTIMATE\nIllustrative rates — not a quotation\nCity: ${d.city}\nType: ${d.type}\nArea: ${a} m²; landscape: ${l} m²\nFinish factor: ${q}\n${rows.map(([k, v]) => `${k}: AED ${range(v)}`).join("\n")}\nExcludes land, taxes, approvals and loose furniture. Subject to site review.\nName: ${d.name}\nEmail: ${d.email}\nBrief: ${d.brief}`;
      };
      form.oninput = calc;
      form.onchange = calc;
      calc();
      form.onsubmit = (e) => {
        e.preventDefault();
        calc();
        if (report)
          location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Project enquiry — Shahr Niaz")}&body=${encodeURIComponent(report)}`;
      };
      $("#save-estimate").onclick = () => {
        calc();
        if (report) saveBlob(report, "Shahr-Niaz-estimate.txt", "text/plain");
        else form.reportValidity();
      };
    }
    const sf = $("#settings-form");
    if (sf) {
      sf.onsubmit = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(sf)),
          next = { ...settings, downloads: [] };
        for (const k of [
          "design",
          "build",
          "landDesign",
          "landBuild",
          "engineering",
          "contingency",
        ])
          next[k] = Number(d[k]);
        next.email = d.email;
        for (let i = 0; i < 3; i++) {
          if (d["name" + i] || d["url" + i]) {
            if (!d["name" + i] || !/^https:\/\//i.test(d["url" + i])) {
              $("#settings-status").textContent = t(
                "Each download needs a name and an HTTPS URL.",
                "هر دانلود به نام و لینک HTTPS نیاز دارد.",
              );
              return;
            }
            next.downloads.push({
              name: d["name" + i],
              platform: d["platform" + i],
              url: d["url" + i],
            });
          }
        }
        try {
          localStorage.setItem("sn-studio-settings", JSON.stringify(next));
          settings = next;
          $("#settings-status").textContent = t(
            "Settings saved on this browser.",
            "تنظیمات در این مرورگر ذخیره شد.",
          );
        } catch {
          $("#settings-status").textContent = t(
            "Storage is unavailable. Export settings instead.",
            "ذخیره‌سازی در دسترس نیست؛ از تنظیمات خروجی بگیرید.",
          );
        }
      };
      $("#export-settings").onclick = () =>
        saveBlob(JSON.stringify(settings, null, 2), "Shahr-Niaz-settings.json");
      $("#import-settings").onchange = async (e) => {
        try {
          const v = JSON.parse(await e.target.files[0].text());
          for (const k of [
            "design",
            "build",
            "landDesign",
            "landBuild",
            "engineering",
            "contingency",
          ])
            if (
              typeof v[k] !== "number" ||
              !Number.isFinite(v[k]) ||
              v[k] < 0 ||
              v[k] > (k === "contingency" ? 50 : 1000000)
            )
              throw Error();
          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ||
            !Array.isArray(v.downloads) ||
            v.downloads.length > 3 ||
            v.downloads.some(
              (r) =>
                typeof r.name !== "string" ||
                typeof r.platform !== "string" ||
                !/^https:\/\//i.test(r.url),
            )
          )
            throw Error();
          localStorage.setItem("sn-studio-settings", JSON.stringify(v));
          settings = v;
          render(false);
        } catch {
          $("#settings-status").textContent = t(
            "Invalid settings file. Nothing changed.",
            "فایل تنظیمات معتبر نیست؛ تغییری اعمال نشد.",
          );
        }
      };
    }
  }

  const plannerServices = window.SHN_DATA.get("shahrniaz/09-site-application/plannerServices-9");
  const consultCatalog = window.SHN_DATA.get("shahrniaz/09-site-application/consultCatalog-10");
  const wizardProjects = window.SHN_DATA.get("shahrniaz/09-site-application/wizardProjects-11");
  const wizardMoods = window.SHN_DATA.get("shahrniaz/09-site-application/wizardMoods-12");
  const wizardAreas = window.SHN_DATA.get("shahrniaz/09-site-application/wizardAreas-13");
  const wizardDraft =
    window.SN_WIZARD_DRAFT ||
    (window.SN_WIZARD_DRAFT = {
      step: 0,
      scope: "",
      project: "",
      areas: [],
      mood: "",
      country: "",
      city: "",
      name: "",
      email: "",
      phone: "",
      method: "email",
      visionNote: "",
      otherProject: "",
      area: "",
      timing: "",
      reference: "",
      notes: "",
      terms: false,
      lastPreset: "",
    });

  /** mountNew: site-application feature. Keep related handlers in this module. */
  function mountNew() {
    oldMountNew();
    const form = $("#cx-form");
    if (!form) return;
    const root = form.closest(".cx-page"),
      allSteps = [...form.querySelectorAll(".cx-step")];
    const [projectStep, siteStep, needsStep, styleStep, meetingStep, reviewStep] = allSteps;
    const styleMore = document.createElement("details");
    styleMore.className = "cx-easy-more";
    styleMore.id = "cx-style-more";
    styleMore.innerHTML =
      "<summary>" +
      t("Add a visual direction (optional)", "انتخاب حس و سبک (اختیاری)") +
      " <span>+</span></summary><p>" +
      t(
        "Choose images that feel close to your vision. You can change your mind later.",
        "تصاویری را که به ایده‌تان نزدیک‌اند انتخاب کنید. بعداً هم می‌توانید نظرتان را عوض کنید.",
      ) +
      "</p>";
    styleMore.append(styleStep.querySelector("#cx-styles"), styleStep.querySelector(".cx-vision"));
    projectStep.append(styleMore);
    const needsMore = document.createElement("details");
    needsMore.className = "cx-easy-more";
    needsMore.id = "cx-needs-more";
    needsMore.innerHTML =
      "<summary>" +
      t("Add site and room details (optional)", "افزودن اطلاعات زمین و فضاها (اختیاری)") +
      " <span>+</span></summary><p>" +
      t(
        "If you know floor counts, room needs or parking, add them here. Rough numbers are fine.",
        "اگر تعداد طبقات، نیاز فضاها یا پارکینگ را می‌دانید، همین‌جا وارد کنید. عدد تقریبی هم کافی است.",
      ) +
      "</p>";
    needsStep.querySelectorAll(".cx-block,.cx-more").forEach((x) => needsMore.append(x));
    siteStep.append(needsMore);
    const reviewBox = document.createElement("section");
    reviewBox.className = "cx-compact-review";
    reviewBox.innerHTML =
      '<span class="cx-step-kicker">' +
      t("Before you send", "پیش از ارسال") +
      "</span><h3>" +
      t("Your request at a glance", "درخواست شما در یک نگاه") +
      "</h3>";
    reviewBox.append(
      reviewStep.querySelector("#cx-review"),
      reviewStep.querySelector(".cx-next-steps"),
      reviewStep.querySelector(".cx-consent"),
    );
    meetingStep.append(reviewBox);
    meetingStep.dataset.cxStep = "2";
    [needsStep, styleStep, reviewStep].forEach((x) => x.remove());
    meetingStep.querySelector(".cx-step-kicker").textContent =
      "03 / " + t("MEET NIAZ", "دیدار با نیاز");
    meetingStep.querySelector("h2").textContent = t(
      "Meet Niaz Esmaili.",
      "با نیاز اسمعیلی آشنا شوید.",
    );
    meetingStep.querySelector("p").textContent = t(
      "Choose a preferred time for a private 20-minute conversation with Niaz. Times are shown in Dubai time and your local time. We confirm the appointment by email.",
      "برای گفت‌وگوی خصوصی ۲۰ دقیقه‌ای با نیاز زمان دلخواهتان را انتخاب کنید. ساعت دبی و ساعت محلی شما نمایش داده می‌شود و وقت از طریق ایمیل تأیید می‌شود.",
    );
    const d = cxDraft,
      steps = [projectStep, siteStep, meetingStep],
      error = $("#cx-error");
    const preset = new URLSearchParams(location.hash.split("?")[1] || "").get("scope");
    if (["interior", "exterior", "both"].includes(preset) && preset !== d.lastPreset) {
      Object.assign(d, { step: 0, scope: preset, project: "", style: "", lastPreset: preset });
    }
    if (!preset) d.lastPreset = "";
    $("#cx-jump").onclick = () =>
      $("#cx-top").scrollIntoView({ behavior: "smooth", block: "start" });
    const fieldNames = [
      "otherProject",
      "country",
      "city",
      "address",
      "mapLink",
      "lat",
      "lon",
      "plotArea",
      "existingArea",
      "floorsWanted",
      "floorsAllowed",
      "basements",
      "bedrooms",
      "bathrooms",
      "workstations",
      "meetingRooms",
      "commercialArea",
      "guestRooms",
      "seats",
      "gardenArea",
      "poolArea",
      "parkingCars",
      "parkingArea",
      "kitchenArea",
      "budget",
      "planning",
      "start",
      "notes",
      "vision",
      "name",
      "email",
      "phone",
      "contact",
      "fileKind",
    ];
    if (d.country && !["IR", "AE", "GB"].includes(d.country)) {
      d.country = "";
      d.city = "";
    }
    fieldNames.forEach((k) => {
      if (form.elements[k]) form.elements[k].value = d[k] || "";
    });
    if (d.country === "AE") {
      d.city = "Dubai";
      form.elements.city.value = "Dubai";
      form.elements.city.readOnly = true;
    }
    form.querySelectorAll("input[name=scope]").forEach((x) => (x.checked = x.value === d.scope));
    form
      .querySelectorAll("input[name=area]")
      .forEach((x) => (x.checked = d.areas.includes(x.value)));
    form.elements.consent.checked = !!d.consent;
    const textRow = (id, list) => {
      const x = list.find((y) => y[0] === id);
      return x ? t(x[1], x[2]) : "";
    };
    const focusName = () => textRow(d.scope, CX_SCOPE);
    const projectName = () =>
      d.project === "other"
        ? d.otherProject || t("Another project", "پروژهٔ دیگر")
        : textRow(d.project, CX_PROJECTS[d.scope] || []);
    const styleName = () => textRow(d.style, CX_STYLES[d.scope] || []);
    const slotName = () =>
      d.slot === "flex"
        ? t("Please suggest a time", "لطفاً زمان پیشنهاد کنید")
        : d.slot
          ? new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-GB", {
              timeZone: "Asia/Dubai",
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(d.slot)) + " Dubai"
          : "—";
    const isResidential = () =>
      ["villa", "apartment", "residential", "renovation", "other"].includes(d.project);
    const isLandscape = () => ["landscape", "facade"].includes(d.project);
    const isCommercial = () => !isResidential() && !isLandscape();
    const renderProgram = () => {
      $("#cx-residential-fields").hidden = !isResidential();
      $("#cx-commercial-fields").hidden = !isCommercial();
      $("#cx-landscape-fields").hidden = !isLandscape();
      const note = $("#cx-permit-note");
      const conflict =
        d.floorsWanted !== "" && d.floorsAllowed !== "" && +d.floorsWanted > +d.floorsAllowed;
      note.hidden = !conflict;
      if (conflict)
        note.textContent = t(
          "Your desired floors exceed the allowance you entered. We can discuss options in the call; this is not a planning approval.",
          "تعداد طبقات دلخواه از تعداد مجازی که وارد کرده‌اید بیشتر است. گزینه‌ها را در جلسه بررسی می‌کنیم؛ این تأیید مجوز نیست.",
        );
    };
    const renderCards = () => {
      const scope = d.scope || "interior";
      if (!(CX_PROJECTS[scope] || []).some((x) => x[0] === d.project)) d.project = "";
      if (!(CX_STYLES[scope] || []).some((x) => x[0] === d.style)) d.style = "";
      $("#cx-projects").innerHTML = CX_PROJECTS[scope]
        .map((x) => cxCard(x, "project", d.project))
        .join("");
      $("#cx-styles").innerHTML = CX_STYLES[scope]
        .map((x) => cxCard(x, "style", d.style, t("Explore this feeling", "این حس را ببینید")))
        .join("");
      $("#cx-other-project").hidden = d.project !== "other";
      renderProgram();
    };
    const renderMap = () => {
      const inputLat = Number(d.lat),
        inputLon = Number(d.lon),
        valid =
          d.lat !== "" &&
          d.lon !== "" &&
          Number.isFinite(inputLat) &&
          Number.isFinite(inputLon) &&
          Math.abs(inputLat) <= 90 &&
          Math.abs(inputLon) <= 180;
      const sample = { IR: [35.6892, 51.389], AE: [25.2048, 55.2708], GB: [51.5072, -0.1276] }[
        d.country
      ] || [25.2048, 55.2708];
      const lat = valid ? inputLat : sample[0],
        lon = valid ? inputLon : sample[1],
        span = valid ? 0.002 : 0.025,
        west = lon - span,
        east = lon + span,
        south = lat - span * 0.57,
        north = lat + span * 0.57;
      const url =
        "https://www.openstreetmap.org/export/embed.html?bbox=" +
        encodeURIComponent([west, south, east, north].join(",")) +
        "&layer=mapnik" +
        (valid ? "&marker=" + encodeURIComponent(lat + "," + lon) : "");
      const box = $("#cx-map-preview");
      box.innerHTML =
        '<iframe title="' +
        t("Site map inside Shahr Niaz", "نقشهٔ زمین در شهر نیاز") +
        '" loading="lazy" src="' +
        url +
        '"></iframe><span class="cx-map-status">' +
        (valid
          ? t(
              "Map centred on your pin · trace the outline below",
              "نقشه روی نقطهٔ شماست · محدوده را ترسیم کنید",
            )
          : t(
              "Sample map view · add a map link or coordinates for your site",
              "نمای نمونهٔ دبی · لینک یا مختصات زمین را وارد کنید",
            )) +
        '</span><a href="https://www.openstreetmap.org/?mlat=' +
        lat +
        "&mlon=" +
        lon +
        "#map=17/" +
        lat +
        "/" +
        lon +
        '" target="_blank" rel="noopener noreferrer">' +
        t("View full map ↗", "نمایش نقشهٔ کامل ↗") +
        "</a>";
      window.SN_PLOT?.mount(box, d, form);
    };
    const parseMap = (url) => {
      if (!url) return null;
      let m =
        url.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/) ||
        url.match(/#map=\d+\/(-?\d{1,2}\.\d+)\/(-?\d{1,3}\.\d+)/) ||
        url.match(/[?&#](?:q|query|ll|center)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
      if (!m) {
        const a = url.match(/!3d(-?\d{1,2}\.\d+)/),
          b = url.match(/!4d(-?\d{1,3}\.\d+)/);
        if (a && b) m = [null, a[1], b[1]];
      }
      if (!m) {
        m = url.trim().match(/^(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)$/);
      }
      if (!m) return null;
      const lat = +m[1],
        lon = +m[2];
      return Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? [lat, lon] : null;
    };
    const setPin = (lat, lon) => {
      d.lat = String(Math.round(lat * 1e6) / 1e6);
      d.lon = String(Math.round(lon * 1e6) / 1e6);
      form.elements.lat.value = d.lat;
      form.elements.lon.value = d.lon;
      renderMap();
    };
    $("#cx-geolocate").onclick = () => {
      if (!navigator.geolocation) {
        error.textContent = t(
          "Location is unavailable in this browser. Paste a map link instead.",
          "موقعیت مکانی در این مرورگر در دسترس نیست. لینک نقشه را وارد کنید.",
        );
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setPin(p.coords.latitude, p.coords.longitude);
          error.textContent = "";
        },
        () => {
          error.textContent = t(
            "Location access was not granted. Paste a map link instead.",
            "دسترسی به موقعیت داده نشد. لینک نقشه را وارد کنید.",
          );
        },
        { enableHighAccuracy: false, timeout: 9000 },
      );
    };
    const searchLink = () => {
      $("#cx-map-search").href =
        "https://www.openstreetmap.org/search?query=" +
        encodeURIComponent([d.address, d.city, d.country].filter(Boolean).join(", ") || "Dubai");
    };
    const urls = [];
    const renderFiles = () => {
      urls.splice(0).forEach((u) => URL.revokeObjectURL(u));
      const list = $("#cx-file-list");
      if (!d.files.length) {
        list.innerHTML = `<div class="cx-file-empty">${t("No files added yet. You can continue.", "هنوز فایلی اضافه نشده؛ می‌توانید ادامه دهید.")}</div>`;
        return;
      }
      list.innerHTML = d.files
        .map((it, i) => {
          const f = it.file,
            kind = textRow(it.kind, CX_FILES),
            mb = (f.size / 1048576).toFixed(1);
          let preview = "";
          if (f.type.startsWith("image/")) {
            const u = URL.createObjectURL(f);
            urls.push(u);
            preview = `<img src="${u}" alt="">`;
          } else if (f.type === "application/pdf") {
            const u = URL.createObjectURL(f);
            urls.push(u);
            preview = `<a href="${u}" target="_blank" rel="noopener">PDF ↗</a>`;
          } else preview = `<span class="cx-file-icon">FILE</span>`;
          return window.SHN_TEMPLATES.render("shahrniaz/09-site-application/renderFiles-24", [
            window.SHN_TEMPLATES.text(preview),
            window.SHN_TEMPLATES.text(esc(f.name)),
            window.SHN_TEMPLATES.text(kind),
            window.SHN_TEMPLATES.text(mb),
            window.SHN_TEMPLATES.text(i),
            window.SHN_TEMPLATES.text(esc(f.name)),
          ]);
        })
        .join("");
    };
    const locateFromGeoFile = async (file) => {
      try {
        const raw = await file.text();
        if (/\.geojson$|\.json$/i.test(file.name)) {
          const data = JSON.parse(raw),
            pairs = [];
          const walk = (x) => {
            if (Array.isArray(x)) {
              if (x.length >= 2 && typeof x[0] === "number" && typeof x[1] === "number")
                pairs.push(x);
              else x.forEach(walk);
            } else if (x && typeof x === "object") Object.values(x).forEach(walk);
          };
          walk(data.coordinates || data.geometry || data.features || data);
          if (pairs.length) {
            if (window.SN_PLOT?.importCoordinates(pairs, d, setPin)) return;
            const a = pairs.reduce((v, p) => [v[0] + p[1], v[1] + p[0]], [0, 0]);
            setPin(a[0] / pairs.length, a[1] / pairs.length);
          }
        } else if (/\.kml$/i.test(file.name)) {
          const xml = new DOMParser().parseFromString(raw, "application/xml"),
            pairs = (xml.querySelector("coordinates")?.textContent || "")
              .trim()
              .split(/\s+/)
              .map((v) => v.split(",").map(Number))
              .filter((v) => v.length > 1);
          if (!window.SN_PLOT?.importCoordinates(pairs, d, setPin) && pairs.length)
            setPin(pairs[0][1], pairs[0][0]);
        }
      } catch {}
    };
    $("#cx-files-input").onchange = (e) => {
      const arr = [...e.target.files],
        rejected = [];
      for (const f of arr) {
        if (f.size > 25 * 1048576) {
          rejected.push(f.name);
          continue;
        }
        if (d.files.length >= 12) {
          rejected.push(f.name);
          continue;
        }
        d.files.push({ file: f, kind: d.fileKind });
        if (/\.(geojson|json|kml)$/i.test(f.name)) locateFromGeoFile(f);
      }
      error.textContent = rejected.length
        ? t(
            "Some files were skipped. Maximum 12 files, 25 MB each.",
            "بعضی فایل‌ها پذیرفته نشدند. حداکثر ۱۲ فایل، هرکدام تا ۲۵ مگابایت.",
          )
        : "";
      e.target.value = "";
      renderFiles();
      updateAside();
    };
    $("#cx-file-list").onclick = (e) => {
      const b = e.target.closest("[data-remove-file]");
      if (!b) return;
      d.files.splice(+b.dataset.removeFile, 1);
      renderFiles();
      updateAside();
    };
    const renderSlots = () => {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "your device";
      $("#cx-your-zone").textContent = t("Your time zone: ", "ساعت شما: ") + zone;
      const now = new Date(),
        dubaiNow = new Date(now.getTime() + 4 * 3600000),
        y = dubaiNow.getUTCFullYear(),
        m = dubaiNow.getUTCMonth(),
        day = dubaiNow.getUTCDate(),
        slots = [];
      for (let i = 0; i < 16 && slots.length < 18; i++) {
        const date = new Date(Date.UTC(y, m, day + i)),
          wd = date.getUTCDay();
        if (wd === 0 || wd === 6) continue;
        for (const h of [10, 13, 16]) {
          const utc = new Date(Date.UTC(y, m, day + i, h - 4));
          if (utc.getTime() > Date.now() + 2 * 3600000) slots.push(utc);
        }
      }
      const fmtDubai = (x) =>
        new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-GB", {
          timeZone: "Asia/Dubai",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(x);
      const fmtLocal = (x) =>
        new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(x);
      $("#cx-slots").innerHTML =
        slots
          .map(
            (x) =>
              `<label class="cx-slot"><input type="radio" name="slot" value="${x.toISOString()}" ${d.slot === x.toISOString() ? "checked" : ""}><span><strong>${fmtDubai(x)}</strong><small>${t("Your local time", "ساعت محلی شما")}: ${fmtLocal(x)}</small></span></label>`,
          )
          .join("") +
        `<label class="cx-slot cx-flex-slot"><input type="radio" name="slot" value="flex" ${d.slot === "flex" ? "checked" : ""}><span><strong>${t("Suggest another time", "زمان دیگری پیشنهاد دهید")}</strong><small>${t("We will coordinate by email", "از طریق ایمیل هماهنگ می‌کنیم")}</small></span></label>`;
    };
    const brief = () => {
      const country = snServiceLocation(d.country);
      const rows = [
        ["Project focus", focusName()],
        ["Project type", projectName()],
        ["Country", country],
        ["City", d.city],
        ["Address / plot", d.address],
        ["Map link", d.mapLink],
        ["Coordinates", d.lat && d.lon ? d.lat + ", " + d.lon : ""],
        ["Plot area m2", d.plotArea],
        ["Manual site outline and walls", window.SN_PLOT?.compact(d) || ""],
        [
          "Site sketch attachment",
          d.plotPoints?.length ? "Attach the downloaded SVG sketch manually if available" : "None",
        ],
        ["Built area m2", d.existingArea],
        ["Desired floors", d.floorsWanted],
        ["Permitted floors (client supplied)", d.floorsAllowed],
        ["Basements", d.basements],
        ["Bedrooms", isResidential() ? d.bedrooms : ""],
        ["Bathrooms / WCs", isResidential() ? d.bathrooms : ""],
        ["Parking spaces", d.parkingCars],
        ["Parking area m2", d.parkingArea],
        ["Kitchen area m2", isResidential() ? d.kitchenArea : ""],
        ["Workstations", isCommercial() ? d.workstations : ""],
        ["Meeting rooms", isCommercial() ? d.meetingRooms : ""],
        ["Commercial area m2", isCommercial() ? d.commercialArea : ""],
        ["Guest rooms / units", isCommercial() ? d.guestRooms : ""],
        ["Seats / capacity", isCommercial() ? d.seats : ""],
        ["Garden area m2", isLandscape() ? d.gardenArea : ""],
        ["Pool area m2", isLandscape() ? d.poolArea : ""],
        ["Priority areas", d.areas.map((x) => textRow(x, CX_AREAS)).join(", ")],
        ["Planning status", d.planning],
        ["Indicative budget", d.budget],
        ["Ideal start", d.start],
        ["Notes", d.notes],
        ["Style", styleName()],
        ["Vision", d.vision],
        ["Preferred call in Dubai time", slotName()],
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Preferred contact", d.contact],
        [
          "Documents to attach manually",
          d.files.map((x) => x.file.name + " (" + textRow(x.kind, CX_FILES) + ")").join("; "),
        ],
      ];
      return (
        "SHAHR NIAZ / PRIVATE DESIGN DISCOVERY\nFree 20-minute call · proposed design scope and fee within 72 hours after consultation and information review\n\n" +
        rows.map(([k, v]) => k + ": " + (v || "—")).join("\n") +
        "\n\nThis request was prepared in the offline website preview. Preferred call time is subject to confirmation. Files are not transmitted automatically."
      );
    };
    const renderReview = () => {
      const country = snServiceLocation(d.country);
      const rows = [
        [t("Project", "پروژه"), [focusName(), projectName()].filter(Boolean).join(" · ")],
        [t("Location", "مکان"), [d.city, country].filter(Boolean).join(" · ")],
        [
          t("Site pin", "نقطهٔ زمین"),
          d.lat && d.lon ? d.lat + ", " + d.lon : t("Not added", "ثبت نشده"),
        ],
        [
          t("Plot outline", "محدودهٔ زمین"),
          d.plotPoints?.length
            ? d.plotPoints.length +
              " " +
              t("corners", "گوشه") +
              (window.SN_PLOT?.metrics(d)?.area
                ? " · " +
                  window.SN_PLOT.metrics(d).area.toFixed(1) +
                  " m² " +
                  t("approx.", "تقریبی")
                : "")
            : t("Not drawn", "ترسیم نشده"),
        ],
        [
          t("Space needs", "نیازهای فضا"),
          [
            isResidential() && d.bedrooms && d.bedrooms + " " + t("bedrooms", "اتاق‌خواب"),
            isResidential() && d.bathrooms && d.bathrooms + " " + t("baths", "حمام"),
            isCommercial() && d.workstations && d.workstations + " " + t("workstations", "جای کار"),
            isCommercial() && d.guestRooms && d.guestRooms + " " + t("guest rooms", "اتاق مهمان"),
            isLandscape() && d.gardenArea && d.gardenArea + " m² " + t("outdoor", "فضای باز"),
            d.parkingCars && d.parkingCars + " " + t("cars", "خودرو"),
          ]
            .filter(Boolean)
            .join(" · ") || t("To discuss", "در جلسه بررسی می‌شود"),
        ],
        [t("Style", "سبک"), styleName() || t("To explore together", "برای کشف مشترک")],
        [t("Preferred call", "زمان پیشنهادی"), slotName()],
        [
          t("Documents", "مدارک"),
          d.files.length + " " + t("file(s) on your device", "فایل روی دستگاه شما"),
        ],
        [t("Contact", "تماس"), d.email],
      ];
      $("#cx-review").innerHTML = rows
        .map(([label, value]) => `<div><span>${label}</span><strong>${esc(value)}</strong></div>`)
        .join("");
    };
    const updateAside = () => {
      $("#cx-aside-choice").textContent =
        [
          focusName(),
          projectName(),
          d.city,
          d.files.length ? t(d.files.length + " document(s)", d.files.length + " مدرک") : null,
        ]
          .filter(Boolean)
          .join(" · ") ||
        t("Tell us what you are imagining.", "به ما بگویید چه چیزی در ذهن دارید.");
    };
    const show = (scroll = false) => {
      d.step = Math.max(0, Math.min(2, d.step));
      steps.forEach((x, i) => (x.hidden = i !== d.step));
      if (d.step === 1) renderMap();
      $("#cx-fill").style.width = ((d.step + 1) / 3) * 100 + "%";
      $("#cx-count").textContent = t("Step ", "گام ") + (d.step + 1) + t(" of 3", " از ۳");
      const active = $('[data-step-label="' + d.step + '"]');
      $("#cx-progress-name").textContent = active?.textContent || "";
      root
        .querySelectorAll("[data-step-label]")
        .forEach((x, i) => x.classList.toggle("active", i === d.step));
      $("#cx-prev").hidden = d.step === 0;
      $("#cx-next").textContent =
        d.step === 2
          ? t("Prepare my request →", "آماده‌کردن درخواست ←")
          : t("Continue →", "ادامه ←");
      error.textContent = "";
      if (d.step === 2) renderReview();
      updateAside();
      if (scroll) {
        $("#cx-top").scrollIntoView({ behavior: "auto", block: "start" });
        steps[d.step].querySelector("h2")?.setAttribute("tabindex", "-1");
        steps[d.step].querySelector("h2")?.focus({ preventScroll: true });
      }
    };
    const validate = () => {
      if (d.step === 0 && !d.scope) return t("Choose a design focus.", "بخش طراحی را انتخاب کنید.");
      if (d.step === 0 && !d.project)
        return t("Choose a project type.", "نوع پروژه را انتخاب کنید.");
      if (d.step === 0 && d.project === "other" && !d.otherProject.trim())
        return t("Tell us a little about your project.", "کمی دربارهٔ پروژه‌تان بنویسید.");
      if (d.step === 1 && !d.country) return t("Choose your country.", "کشور را انتخاب کنید.");
      if (d.step === 1 && !d.city.trim())
        return t("Add your city or region.", "شهر یا منطقه را وارد کنید.");
      if (
        d.step === 1 &&
        (d.lat || d.lon) &&
        (!(d.lat && d.lon) || Math.abs(+d.lat) > 90 || Math.abs(+d.lon) > 180)
      )
        return t(
          "Add valid latitude and longitude, or leave both blank.",
          "مختصات معتبر وارد کنید یا هر دو را خالی بگذارید.",
        );
      if (d.step === 1) {
        for (const n of [
          "plotArea",
          "existingArea",
          "floorsWanted",
          "floorsAllowed",
          "basements",
          "bedrooms",
          "bathrooms",
          "parkingCars",
          "parkingArea",
          "kitchenArea",
          "workstations",
          "meetingRooms",
          "commercialArea",
          "guestRooms",
          "seats",
          "gardenArea",
          "poolArea",
        ])
          if (d[n] !== "" && (+d[n] < 0 || !Number.isFinite(+d[n]))) {
            needsMore.open = true;
            return t("Please use zero or a positive number.", "عدد صفر یا بزرگ‌تر وارد کنید.");
          }
      }
      if (d.step === 2 && !d.slot)
        return t(
          "Choose a preferred time or ask us to suggest one.",
          "یک زمان دلخواه یا گزینهٔ پیشنهاد زمان را انتخاب کنید.",
        );
      if (d.step === 2 && !d.name.trim()) return t("Add your name.", "نام خود را وارد کنید.");
      if (d.step === 2 && (!form.elements.email.checkValidity() || !d.email.trim()))
        return t("Add a valid email address.", "ایمیل معتبر وارد کنید.");
      if (d.step === 2 && d.contact === "phone" && !d.phone.trim())
        return t("Add your phone or WhatsApp number.", "شمارهٔ تلفن یا واتساپ را وارد کنید.");
      if (d.step === 2 && !d.consent)
        return t(
          "Please confirm how this preview sends your request.",
          "لطفاً روش ارسال درخواست در این نسخه را تأیید کنید.",
        );
      return "";
    };
    form.addEventListener("change", (e) => {
      const x = e.target;
      if (x.name === "scope") {
        d.scope = x.value;
        d.project = "";
        d.style = "";
        renderCards();
      } else if (x.name === "project") {
        d.project = x.value;
        $("#cx-other-project").hidden = x.value !== "other";
        renderProgram();
      } else if (x.name === "style") d.style = x.value;
      else if (x.name === "area")
        d.areas = [...form.querySelectorAll("input[name=area]:checked")].map((n) => n.value);
      else if (x.name === "slot") d.slot = x.value;
      else if (x.name === "consent") d.consent = x.checked;
      else if (fieldNames.includes(x.name)) d[x.name] = x.value;
      if (x.name === "country") {
        if (x.value === "AE") {
          d.city = "Dubai";
          form.elements.city.value = "Dubai";
          form.elements.city.readOnly = true;
        } else {
          if (form.elements.city.readOnly) {
            d.city = "";
            form.elements.city.value = "";
          }
          form.elements.city.readOnly = false;
        }
        renderMap();
      }
      if (x.name === "mapLink") {
        const pair = parseMap(x.value);
        if (pair) setPin(...pair);
      }
      if (["lat", "lon"].includes(x.name)) renderMap();
      if (["floorsWanted", "floorsAllowed"].includes(x.name)) renderProgram();
      if (["city", "address", "country"].includes(x.name)) searchLink();
      error.textContent = "";
      updateAside();
    });
    form.addEventListener("input", (e) => {
      const x = e.target;
      if (fieldNames.includes(x.name)) d[x.name] = x.value;
      if (["city", "address"].includes(x.name)) searchLink();
      if (["floorsWanted", "floorsAllowed"].includes(x.name)) renderProgram();
      error.textContent = "";
      updateAside();
    });
    form.onsubmit = (e) => e.preventDefault();
    $("#cx-prev").onclick = () => {
      if (d.step > 0) {
        d.step--;
        show(true);
      }
    };
    $("#cx-next").onclick = () => {
      const problem = validate();
      if (problem) {
        error.textContent = problem;
        error.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (d.step < 2) {
        d.step++;
        show(true);
        return;
      }
      const subject = "Shahr Niaz — design discovery request";
      const body = brief();
      $("#cx-email").href =
        "mailto:" +
        encodeURIComponent(settings.email) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      $("#cx-ready-files").innerHTML = d.files.length
        ? `<strong>${t("Attach these files to the email:", "این فایل‌ها را به ایمیل پیوست کنید:")}</strong><ul>${d.files.map((x) => `<li>${esc(x.file.name)}</li>`).join("")}</ul>`
        : `<span>${t("No files to attach.", "فایلی برای پیوست نیست.")}</span>`;
      $("#cx-ready").hidden = false;
      $("#cx-ready-close").focus();
    };
    $("#cx-download").onclick = () =>
      saveBlob(brief(), "Shahr-Niaz-design-discovery.txt", "text/plain;charset=utf-8");
    $("#cx-ready-close").onclick = () => ($("#cx-ready").hidden = true);
    $("#cx-ready").onclick = (e) => {
      if (e.target.id === "cx-ready") e.currentTarget.hidden = true;
    };
    renderCards();
    renderFiles();
    renderSlots();
    searchLink();
    show();
  }

  const customerProjectBefore = projectPage;
  projectPage = function () {
    const html = customerProjectBefore(),
      p = galleryData.find((x) => x.id === current.split("/")[2]);
    if (!p) return html;
    return (
      html +
      `<section class="wrap customer-journey"><h2>${t("Your project can start here.", "پروژهٔ شما می‌تواند از اینجا شروع شود.")}</h2><p>${t("1. Tell us about your space and priorities. 2. Meet Niaz in a free 20-minute private call. 3. Review a proposal with the scope, design stages and fee before deciding.", "۱. فضا و اولویت‌هایتان را شرح دهید. ۲. در جلسهٔ خصوصی رایگان ۲۰ دقیقه‌ای با نیاز گفت‌وگو کنید. ۳. پیش از تصمیم‌گیری، پیشنهاد شامل محدودهٔ طراحی، مراحل و هزینه را بررسی کنید.")}</p><a class="button" href="#/estimate?reference=${encodeURIComponent(p.id)}">${t("Start a similar project", "شروع پروژه‌ای مشابه")} ↗</a></section>`
    );
  };
  const customerMountBefore = mountNew;
  mountNew = function () {
    const id = new URLSearchParams(location.hash.split("?")[1] || "").get("reference"),
      p = galleryData.find((x) => x.id === id);
    if (p && cxDraft.customerReference !== id) {
      cxDraft.vision =
        (cxDraft.vision ? cxDraft.vision + "\n" : "") +
        t("Inspired by: ", "الهام از پروژهٔ: ") +
        tx(p.name);
      cxDraft.customerReference = id;
    }
    customerMountBefore();
  };
  const customerProductsBefore = products;
  products = function () {
    return (
      customerProductsBefore() +
      window.SHN_TEMPLATES.render("shahrniaz/09-site-application/view-25", [
        window.SHN_TEMPLATES.text(
          t(
            "From the piece you like to the piece you need.",
            "از محصولی که می‌پسندید تا محصولی که نیاز دارید.",
          ),
        ),
        window.SHN_TEMPLATES.text(
          t(
            "Choose a product as your reference. Tell us the dimensions, intended use and finish. We review design and manufacturing before confirming a quote and delivery.",
            "یک محصول را به‌عنوان مرجع انتخاب کنید. ابعاد، کاربرد و پرداخت دلخواهتان را بگویید. پیش از اعلام قیمت و زمان تحویل، طراحی و امکان ساخت را بررسی می‌کنیم.",
          ),
        ),
        window.SHN_TEMPLATES.text(t("Discuss my custom piece", "گفت‌وگو دربارهٔ محصول اختصاصی من")),
        window.SHN_TEMPLATES.text(
          t("Browse ready keychains and making services", "دیدن جاکلیدی‌های آماده و خدمات ساخت"),
        ),
      ])
    );
  };

  history.scrollRestoration = "manual";
  window.SN_RENDER = render;
  render(false);
  window.SN_TEST = { types: FURNITURE.types, worlds };
})();
