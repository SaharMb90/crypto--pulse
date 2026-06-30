# Crypto Pulse | کریپتو پالس

داشبورد دوزبانه (فارسی/انگلیسی) قیمت لحظه‌ای کریپتو، اخبار بازار، گرایش فنی (RSI+MACD+MA)، و **سابقه‌ی واقعی عملکرد سیگنال‌ها**.

Bilingual crypto dashboard: live prices, news, technical lean (RSI+MACD+MA), and a real, logged track record of signal accuracy.

## مهم — قبل از هر چیز / IMPORTANT FIRST
هیچ بخشی از این اپ سود تضمین نمی‌کنه. بخش "گرایش فنی" خروجی RSI+MACD+میانگین متحرکه. هر روز سیگنال هر کوین ثبت می‌شه و بعد از ۱۴ روز خودکار سنجیده می‌شه که درست بوده یا نه (با آستانه‌ی حرکت ۰.۵٪) — درصد دقت واقعی توی صفحه‌ی «سابقه‌ی عملکرد» نمایش داده می‌شه، نه یه عدد ادعایی.

This app makes no profit guarantees. Every day's lean per coin is logged; after 14 days it's automatically scored against actual price movement (0.5% threshold). The real accuracy % shows on the Track Record page — not a marketing claim.

## راه‌اندازی / Setup

### ۱. نصب و اجرای محلی
```bash
npm install
npm run dev
```

### ۲. ساخت دیتابیس Upstash Redis (رایگان)
سابقه‌ی سیگنال‌ها روی Vercel نیاز به یه دیتابیس داره چون Vercel فایل سیستم پایدار نداره.

1. به https://upstash.com برو و رایگان ثبت‌نام کن (با گیت‌هاب/گوگل)
2. یه دیتابیس Redis جدید بساز (نزدیک‌ترین region به کاربرات رو انتخاب کن)
3. از تب "REST API" دو مقدار `UPSTASH_REDIS_REST_URL` و `UPSTASH_REDIS_REST_TOKEN` رو کپی کن

### ۳. دیپلوی روی Vercel
```bash
npm install -g vercel
vercel
```
یا ریپو رو به گیت‌هاب پوش کن و از vercel.com import کن.

بعد توی تنظیمات پروژه روی Vercel → **Settings → Environment Variables**، این‌ها رو اضافه کن:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CRON_SECRET` (اختیاری ولی پیشنهادی — یه رشته‌ی تصادفی بساز، مثلاً با `openssl rand -hex 16`)

### ۴. فعال‌سازی Cron روزانه
فایل `vercel.json` چهار تا cron تعریف کرده، همه‌شون روزی یک بار (پلن رایگان Vercel فقط فرکانس روزانه رو برای cron پشتیبانی می‌کنه):
- `/api/signals/log` (۰۰:۳۰ تهران) — ثبت گرایش روزانه‌ی هر کوین (RSI+MACD+MA تکی)
- `/api/signals/evaluate` (۰۰:۴۰ تهران) — سنجش سیگنال‌هایی که ۱۴ روزشون گذشته
- `/api/predictions/log` (۰۰:۳۵ تهران) — ثبت پیش‌بینی ۲۴ساعته‌ی چندتایم‌فریمی (۳۰د/۱س/۴س/۱۲س + قیمت هدف)
- `/api/predictions/evaluate` (۰۰:۴۵ تهران) — این یکی صرفاً پشتیبانه؛ چون پنجره ۲۴ساعته‌ست و پلن رایگان cron ساعتی نداره، ارزیابی واقعی هر بار که صفحه‌ی `/predictions` باز بشه هم به‌صورت خودکار انجام می‌شه (lazy evaluation داخل API route).

⚠️ اگه تعداد cron job یا فرکانسش با محدودیت پلن فعلی Vercel‌ت جور نبود (این محدودیت‌ها گاهی عوض می‌شن)، توی Vercel dashboard خطا می‌بینی — کافیه یکی دو تا از کرون‌ها رو حذف کنی و به ارزیابی lazy تکیه کنی (که برای predictions از قبل همینطوریه).

اگه `CRON_SECRET` رو ست کردی، Vercel خودش این هدر رو موقع صدا زدن cron اضافه می‌کنه.

## بخش پیش‌بینی ۲۴ ساعته (صفحه‌ی /predictions)
داده‌ی کندل ۳۰دقیقه/۱ساعته/۴ساعته/۱۲ساعته از **API عمومی نوبیتکس** گرفته می‌شه (`market/udf/history`) — یعنی OHLC واقعی (Open/High/Low/Close/Volume واقعی از آردربوک نوبیتکس)، نه تقریب. این نزدیک‌تره به چیزی که خودت توی اپ نوبیتکس می‌بینی.

**محدودیت‌ها که باید بدونی:**
- نوبیتکس همه‌ی کوین‌ها رو لیست نکرده. الان BTC، ETH، SOL، XRP، DOGE از نوبیتکس میان؛ BNB چون به‌طور قابل‌اعتماد توی نوبیتکس لیست نیست، خودکار به روش قبلی (تقریب از CoinGecko) برمی‌گرده — کنار هر کوین توی صفحه‌ی predictions یه برچسب کوچیک نشون می‌ده داده‌ش از کجا اومده (`Nobitex OHLC` یا `CoinGecko (resampled)`).
- قیمت‌ها از جفت **USDT** نوبیتکس میان (مثلاً BTCUSDT)، نه از تومان/ریال — این به دلار نزدیکه ولی دقیقاً یکی نیست.
- اگه نوبیتکس موقتاً در دسترس نباشه (نگه‌داری، rate limit)، سیستم خودکار به روش تقریبی برمی‌گرده تا ثبت روزانه قطع نشه — این هم توی dataSource مشخصه.
- می‌تونی برای تست مستقیم این آدرس رو توی مرورگر باز کنی: `https://api.nobitex.ir/market/udf/history?symbol=BTCUSDT&resolution=60&from=<unix>&to=<unix>`

**نکته‌ی مهم درباره‌ی درصد اطمینان:** عددی که کنار هر پیش‌بینی می‌بینی (مثلاً ۶۵٪) یک "اطمینان فرمولی" است — یعنی چقدر اندیکاتورهای مختلف هم‌جهت‌اند، نه یک احتمال آماری اثبات‌شده. **عدد واقعی** بالای صفحه‌ست: "نرخ موفقیت واقعی"، که از مقایسه‌ی پیش‌بینی‌های گذشته با قیمت واقعی بعد از ۲۴ ساعت محاسبه می‌شه (آستانه‌ی موفقیت: حداقل ۱٪ حرکت در جهت درست). بعد از ۲ هفته (~۸۴ پیش‌بینی برای ۵-۶ کوین) این عدد معنادار می‌شه.

## ساختار / Structure
- `src/app/api/prices/route.ts` — قیمت لحظه‌ای از CoinGecko
- `src/app/api/news/route.ts` — اخبار از CoinDesk / Cointelegraph / Decrypt (RSS)
- `src/app/api/signals/log/route.ts` — ثبت روزانه‌ی گرایش تکی هر کوین
- `src/app/api/signals/evaluate/route.ts` — ارزیابی گرایش‌های ۱۴+ روزه
- `src/app/api/predictions/log/route.ts` — ثبت روزانه‌ی پیش‌بینی چندتایم‌فریمی + قیمت هدف
- `src/app/api/predictions/evaluate/route.ts` — ارزیابی پیش‌بینی‌های ۲۴+ ساعته
- `src/lib/indicators.ts` — RSI / SMA / EMA / MACD
- `src/lib/timeframes.ts` — کندل واقعی از نوبیتکس (با fallback به تقریب CoinGecko)
- `src/lib/multiSignal.ts` — ترکیب چندتایم‌فریمی + محاسبه‌ی قیمت هدف
- `src/lib/signalStore.ts` / `src/lib/predictionStore.ts` — منطق ثبت/ارزیابی/آمار
- `src/lib/redis.ts` — wrapper سبک روی Upstash REST API
- `src/app/track-record/page.tsx` — سابقه‌ی گرایش تکی (۱۴ روزه)
- `src/app/predictions/page.tsx` — سابقه‌ی پیش‌بینی چندتایم‌فریمی (۲۴ساعته) + نرخ موفقیت واقعی

## تست دستی قبل از منتظر موندن برای cron
```bash
curl https://your-app.vercel.app/api/signals/log -H "Authorization: Bearer YOUR_CRON_SECRET"
curl https://your-app.vercel.app/api/signals/evaluate -H "Authorization: Bearer YOUR_CRON_SECRET"
```
(اگه CRON_SECRET رو ست نکردی، هدر Authorization لازم نیست.)

## افزودن کوین جدید / Add a coin
توی `src/lib/coingecko.ts` آرایه‌ی COINS رو با شناسه‌ی CoinGecko آپدیت کن.

## محدودیت شبکه ایران
چون فچ به CoinGecko/RSS/Upstash از سمت سرور Vercel انجام می‌شه نه از مرورگر کاربر، فیلترینگ داخلی روی این درخواست‌ها تاثیر نداره.
