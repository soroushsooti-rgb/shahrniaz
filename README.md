# Shahr Niaz

اپ مستقل Frappe با مسیر `/shahrniaz`.

HTML: `shahrniaz/public/pages/index.html`

ظاهر: `shahrniaz/public/css/shahrniaz/`

منطق: `shahrniaz/public/js/shahrniaz/`

قالب‌ها و تنظیمات: `shahrniaz/public/templates/` و `shahrniaz/public/data/`.

برای ساخت خروجی پس از ویرایش JSON یا قالب: `python3 tools/build.py`.

اپ برای اجرای صفحات به نصب اپ دیگری وابسته نیست. ارتباط با اپ‌های دیگر فقط با URL و API عمومی فهرست نشانی‌ها انجام می‌شود.

## نگهداری و نصب مستقل

نقشه فایل‌ها: `docs/CODE_MAP.fa.md`. ارتباط قالب HTML با JavaScript در `docs/TEMPLATES.fa.md` آمده است.

این اپ را روی سایت مقصد با `bench --site SITE install-app shahrniaz` نصب کنید؛ پیش از آن پکیج باید با `bench pip install --no-deps -e apps/shahrniaz` نصب شده و نامش در `sites/apps.txt` ثبت شده باشد. `bench build --app shahrniaz` و پاک‌کردن کش سایت بعد از تغییر لازم است.

در `site_config.json` همان سایت، `shn_app_urls` را با کلیدهای `panel`، `shahrniaz`، `as` و `shop` و URL کامل هر بخش تنظیم کنید. `shn_directory_url` باید نشانی GET API `shn_portal.api.get_app_directory` روی سایت اصلی باشد. پیش‌فرض محلی در `public/data/integration.json` قابل ویرایش است؛ سپس خروجی را بسازید. URLها عمومی‌اند و نباید رمز یا توکن داشته باشند.

فایل‌های `generated-data.js`، `generated-templates.js`، `integration-defaults.js` و `www/*.html` خروجی ساخت هستند؛ منبع را ویرایش کنید.
