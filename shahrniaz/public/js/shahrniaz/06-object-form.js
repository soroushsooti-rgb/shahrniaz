/* مسئولیت این فایل: فرم درخواست ساخت اشیا و رفتار فیلدهای آن. */
/**
 * SHN / shahrniaz / object-form
 * Extracted from the original inline script #6.
 * Load order is defined by pages/index.html. See docs/CODE_MAP.fa.md.
 */
(function () {
  /** mount: object-form feature. Keep related handlers in this module. */
  function mount() {
    let form = document.getElementById("sn-object-form");
    if (!form) return;
    document
      .querySelectorAll("[data-object-scroll]")
      .forEach(
        (b) => (b.onclick = () => form.scrollIntoView({ block: "start", behavior: "smooth" })),
      );
    let status = document.getElementById("sn-object-status");
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      let d = new FormData(form),
        moods = d.getAll("mood"),
        files = [...form.elements.refs.files].map((f) => f.name);
      let brief =
        "SHAHR NIAZ / CUSTOM OBJECT ENQUIRY\n\nObject: " +
        d.get("object") +
        "\nIdea: " +
        d.get("idea") +
        "\nSize: " +
        (d.get("size") || "Not specified") +
        "\nMaterials: " +
        (d.get("materials") || "To discuss") +
        "\nMood: " +
        (moods.join(", ") || "To explore together") +
        "\nName: " +
        d.get("name") +
        "\nEmail: " +
        d.get("email") +
        "\nReference files to attach manually: " +
        (files.join(", ") || "None") +
        "\n\nThis enquiry was prepared offline. Files are not attached automatically.";
      let address = (window.SN_STUDIO_EMAIL || "").trim();
      if (!address) {
        status.textContent =
          document.documentElement.lang === "fa"
            ? "شرح درخواست آماده شد. ایمیل استودیو هنوز تنظیم نشده؛ متن زیر را کپی کنید و از راه تماس سایت بفرستید."
            : "Your brief is ready. The studio email is not configured; copy the text below and send it through the contact page.";
        let box = document.createElement("textarea");
        box.value = brief;
        box.readOnly = true;
        box.rows = 12;
        status.after(box);
        return;
      }
      location.href =
        "mailto:" +
        encodeURIComponent(address) +
        "?subject=" +
        encodeURIComponent("Custom object enquiry — Shahr Niaz") +
        "&body=" +
        encodeURIComponent(brief);
      status.textContent =
        document.documentElement.lang === "fa"
          ? "ایمیل آماده شد؛ فایل‌های مرجع را خودتان پیوست کنید."
          : "Email prepared; attach your reference files manually.";
    };
    let anchor = location.hash.includes("?object=");
    if (anchor) setTimeout(() => form.scrollIntoView({ block: "start", behavior: "smooth" }), 130);
  }
  window.SN_OBJECTS = { mount };
})();
