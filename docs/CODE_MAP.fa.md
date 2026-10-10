# shahrniaz — نقشه کد

مسیرهای جدول نسبت به پوشه پکیج shahrniaz هستند.

| فایل | مسئولیت |
| --- | --- |
| hooks.py | معرفی اپ و ماژول Frappe |
| integration.py | خواندن URL عمومی از تنظیمات همان سایت |
| www/*.py | کنترلر مسیر و ارسال تنظیمات عمومی به قالب |
| www/*.html | خروجی HTML ساخته‌شده؛ ویرایش مستقیم نکنید |
| `public/css/shahrniaz/01-base.css` | سبک اصلی سایت، اندازه‌ها، رنگ‌ها، فونت و حالت موبایل |
| `public/css/shahrniaz/02-layout-refinements.css` | اصلاحات چیدمان و نمای سایت شهر نیاز |
| `public/css/shahrniaz/03-admin-preview.css` | مدیریت نمایشی محلی، تنظیمات و خروجی؛ مستقل از مدیریت Frappe |
| `public/css/shahrniaz/04-autumn-update.css` | اصلاحات نمای صفحات و بخش‌های اضافه‌شده در نسخهٔ اولیه |
| `public/css/shahrniaz/05-private-configurator.css` | پیش‌نمایش دارای کد سمت مرورگر و طراحی میز بیلیارد |
| `public/css/shahrniaz/06-language.css` | سبک نمایش زبان و متن‌های فارسی |
| `public/css/shahrniaz/07-customer-flow.css` | ظاهر مسیر درخواست و راهنمای کاربر |
| `public/css/shahrniaz/template-overrides.css` | قواعد ثابت ظاهری که از ویژگی style قالب‌های HTML جدا شده‌اند |
| `public/data/asset-manifest.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/integration.json` | هویت اپ و نشانی‌های جایگزین مستقل از API |
| `public/data/module-manifest.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/01-embedded-assets/SN_EMBEDDED-1.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/01-language-init/SITE_EN-1.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/01-language-init/SITE_FA-2.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/04-furniture-catalog/FURNITURE-1.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/08-kitchen-planner/c-1.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/consultCatalog-10.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/CX_PROJECTS-6.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/CX_STYLES-7.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/galleryData-4.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/OBJECT_CATALOG-2.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/plannerServices-9.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/SN_CONSULT_DRAFT-8.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/SN_COUNTRY_CODES-5.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/SN_NEW_IMAGES-3.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/wizardAreas-13.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/wizardMoods-12.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/wizardProjects-11.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/shahrniaz/09-site-application/worlds-1.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/source-index.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/style-index.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/data/template-index.json` | داده یا فهرست منبع قابل ویرایش؛ نام مسیر حوزه مصرف را مشخص می‌کند |
| `public/js/app-context.js` | هویت ثابت همین اپ، زبان و تنظیمات اولیه |
| `public/js/app-navigation.js` | لینک URL بین سایت‌ها و دریافت API فهرست مقصدها |
| `public/js/generated-data.js` | خروجی ساخته‌شده؛ منبع در data یا templates |
| `public/js/generated-templates.js` | خروجی ساخته‌شده؛ منبع در data یا templates |
| `public/js/integration-defaults.js` | خروجی ساخته‌شده؛ منبع در data یا templates |
| `public/js/shahrniaz/01-language-init.js` | تشخیص زبان اولیه و معرفی فرهنگ ترجمه‌ها |
| `public/js/shahrniaz/02-language-additions.js` | تکمیل ترجمه‌های فروشگاه و درخواست‌ها |
| `public/js/shahrniaz/04-admin-preview.js` | مدیریت نمایشی محلی، تنظیمات و خروجی؛ مستقل از مدیریت Frappe |
| `public/js/shahrniaz/05-plot-editor.js` | ترسیم زمین، نقاط و دیوارها در فرم پروژه |
| `public/js/shahrniaz/06-object-form.js` | فرم درخواست ساخت اشیا و رفتار فیلدهای آن |
| `public/js/shahrniaz/07-private-configurator.js` | پیش‌نمایش دارای کد سمت مرورگر و طراحی میز بیلیارد |
| `public/js/shahrniaz/08-language-runtime.js` | اعمال ترجمه روی متن‌ها و حفظ مقدار فیلدها هنگام تغییر زبان |
| `public/js/shahrniaz/features/01-embedded-assets.js` | نگاشت تصاویر شهر نیاز به فایل‌های مستقل رسانه |
| `public/js/shahrniaz/features/02-three-vendor.js` | کتابخانهٔ اصلی Three.js؛ کد شخص ثالث با اعلان مجوز اصلی |
| `public/js/shahrniaz/features/03-geometry-helpers.js` | کمک‌تابع‌های هندسی مدل سه‌بعدی مبلمان |
| `public/js/shahrniaz/features/04-furniture-catalog.js` | معرفی کاتالوگ مبلمان؛ جنس، ابعاد و انتخاب‌ها در JSON |
| `public/js/shahrniaz/features/05-furniture-state.js` | وضعیت طرح مبلمان، انتخاب‌ها و ذخیره‌سازی مرورگر |
| `public/js/shahrniaz/features/06-furniture-renderer.js` | مدل‌ها، نور، متریال و نمایش سه‌بعدی مبلمان |
| `public/js/shahrniaz/features/07-furniture-configurator.js` | کنترل‌های تغییر ابعاد و جنس، ذخیره و خروجی طرح مبلمان |
| `public/js/shahrniaz/features/08-kitchen-planner.js` | چیدمان آشپزخانه، ماژول‌ها، اندازه‌ها و خروجی طرح |
| `public/js/shahrniaz/features/09-site-application.js` | صفحات شهر نیاز، گالری، مشاوره و مسیریابی داخلی |
| `public/pages/index.html` | اسکلت HTML و ترتیب بارگیری CSS و JavaScript |

تصاویر و فونت‌ها در public/media همین اپ قرار دارند. قالب‌ها در TEMPLATES.fa.md فهرست شده‌اند.
