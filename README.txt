# Crypto Pulse · کریپتو پالس

**A bilingual (EN/FA) crypto dashboard: live prices, aggregated market news, transparent rule-based technical "leans" — and an honest, self-scoring track record of how those leans actually performed.**

**داشبورد دوزبانه‌ی کریپتو: قیمت لحظه‌ای، اخبار بازار، «گرایش» فنیِ قاعده‌محور و شفاف — و یک سابقه‌ی عملکردِ خودسنجِ صادقانه از اینکه آن گرایش‌ها واقعاً چقدر درست بودند.**

Built with Next.js + TypeScript, deployed serverless on Vercel with Upstash Redis.
ساخته‌شده با Next.js + TypeScript، دیپلوی serverless روی Vercel با Upstash Redis.

---

![Crypto Pulse dashboard — live price ticker and rule-based technical leans per coin](docs/dashboard.png)

![Latest crypto news aggregated from multiple outlets](docs/news.png)

---

## What it is · این چیست

Crypto Pulse shows live prices and a transparent, **rule-based** technical read (RSI + MACD + moving averages) for major coins, alongside market news pulled from several outlets. It makes **no profit claims**: every signal it generates is logged and later scored against real price movement, so the only accuracy number shown is one it actually earned.

کریپتو پالس قیمت لحظه‌ای و یک تحلیل فنیِ **قاعده‌محور و شفاف** (RSI + MACD + میانگین متحرک) برای کوین‌های اصلی نشان می‌دهد، در کنار اخبار بازار از چند منبع. **هیچ ادعای سودی** ندارد: هر سیگنالی که تولید می‌کند ثبت و بعداً با حرکت واقعی قیمت سنجیده می‌شود — پس تنها عددِ دقتی که نمایش داده می‌شود، عددی است که واقعاً به‌دست آمده.

---

## Technical highlights · نکات فنی

- **Real-time data pipeline.** Live prices from CoinGecko; real OHLC candles from Nobitex's public API (actual order-book data) with an automatic CoinGecko fallback; news aggregated from CoinDesk, Cointelegraph and Decrypt RSS. Each coin is labelled with its live data source (`Nobitex OHLC` vs `CoinGecko (resampled)`).
  خط‌لوله‌ی داده‌ی بلادرنگ: قیمت از CoinGecko، کندل واقعی OHLC از API عمومی نوبیتکس با fallback خودکار، و اخبار از چند منبع RSS — با برچسبِ منبعِ داده کنار هر کوین.

- **Transparent technical engine.** RSI(14), SMA/EMA and MACD combined into a readable "lean" with a confidence level, plus multi-timeframe (30m / 1h / 4h / 12h) 24-hour predictions with a target price — all computed in-app, no black box.
  موتور فنیِ شفاف: ترکیب RSI/میانگین‌ها/MACD به یک «گرایش» خوانا با سطح اطمینان، و پیش‌بینی ۲۴ساعته‌ی چندتایم‌فریمی با قیمت هدف — همه داخل اپ، بدون جعبه‌ی سیاه.

- **Honest, self-scoring evaluation.** Every daily lean is logged and auto-scored after 14 days against real movement (0.5% threshold); 24h predictions are scored after 24h (1% threshold). The Track Record page shows the **measured** accuracy, and the UI clearly separates a *formula confidence* from a *proven statistical probability*.
  ارزیابیِ خودسنج و صادقانه: هر گرایش ثبت و بعد از ۱۴ روز خودکار سنجیده می‌شود؛ صفحه‌ی Track Record دقتِ **واقعی** را نشان می‌دهد، و «اطمینان فرمولی» را از «احتمال آماریِ اثبات‌شده» جدا می‌کند.

- **Serverless architecture.** Next.js App Router API routes, Vercel cron jobs for daily logging/evaluation, and a lazy-evaluation fallback for the 24h window. Upstash Redis provides persistence (Vercel has no durable filesystem).
  معماری serverless: API routeهای Next.js، کرون‌های روزانه‌ی Vercel، و ارزیابیِ lazy برای پنجره‌ی ۲۴ساعته؛ ماندگاری با Upstash Redis.

- **Bilingual & resilient.** Full Persian/English UI with RTL support. Because all fetching happens server-side on Vercel (not in the user's browser), it keeps working behind Iran's network restrictions.
  دوزبانه و مقاوم: رابط کامل فارسی/انگلیسی با RTL؛ چون همه‌ی فچ‌ها سمت سرور انجام می‌شود، پشتِ محدودیت‌های شبکه‌ی ایران هم کار می‌کند.

---

## Tech stack · پشته‌ی فنی

Next.js (App Router) · TypeScript · React · Upstash Redis (REST) · Vercel (hosting + cron) · CoinGecko / Nobitex APIs · RSS (CoinDesk, Cointelegraph, Decrypt)

---

## Project structure · ساختار پروژه

| Path | Role |
|---|---|
| `src/app/api/prices/route.ts` | Live prices (CoinGecko) |
| `src/app/api/news/route.ts` | News aggregation (RSS) |
| `src/app/api/signals/log`, `/evaluate` | Log daily leans; score 14-day-old ones |
| `src/app/api/predictions/log`, `/evaluate` | Log multi-timeframe 24h predictions; score them |
| `src/lib/indicators.ts` | RSI / SMA / EMA / MACD |
| `src/lib/timeframes.ts` | Real Nobitex candles (CoinGecko fallback) |
| `src/lib/multiSignal.ts` | Multi-timeframe combination + target price |
| `src/lib/signalStore.ts`, `predictionStore.ts` | Logging / evaluation / stats |
| `src/lib/redis.ts` | Thin wrapper over Upstash REST |
| `src/app/track-record/page.tsx` | 14-day single-lean history |
| `src/app/predictions/page.tsx` | 24h multi-timeframe history + real success rate |

---

## Deployment · راه‌اندازی

<details>
<summary><b>Setup, environment variables & cron (click to expand) · نصب، متغیرها و کرون</b></summary>

### 1. Run locally · اجرای محلی
```bash
npm install
npm run dev
```

### 2. Create a free Upstash Redis DB · ساخت دیتابیس Upstash
Signal history needs a database because Vercel has no persistent filesystem.
1. Sign up free at https://upstash.com (GitHub/Google).
2. Create a Redis database (pick the region closest to your users).
3. From the **REST API** tab, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### 3. Deploy to Vercel · دیپلوی
```bash
npm i -g vercel
vercel
```
Or push to GitHub and import at vercel.com. Then add these in **Settings → Environment Variables**:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CRON_SECRET` (optional but recommended — e.g. `openssl rand -hex 16`)

### 4. Daily cron · کرون روزانه
`vercel.json` defines four once-a-day jobs (Vercel's free plan supports daily frequency only):
- `/api/signals/log` — log each coin's daily lean
- `/api/signals/evaluate` — score leans older than 14 days
- `/api/predictions/log` — log the multi-timeframe 24h prediction + target price
- `/api/predictions/evaluate` — backup; the 24h window is also evaluated lazily whenever `/predictions` is opened

> If the number/frequency of cron jobs ever exceeds your Vercel plan limits, delete one or two crons and rely on lazy evaluation.
> اگر تعداد یا فرکانس کرون‌ها با محدودیت پلن Vercel جور نبود، یکی‌دو کرون را حذف کن و به ارزیابیِ lazy تکیه کن.

### Manual test · تست دستی
```bash
curl https://your-app.vercel.app/api/signals/log -H "Authorization: Bearer YOUR_CRON_SECRET"
curl https://your-app.vercel.app/api/signals/evaluate -H "Authorization: Bearer YOUR_CRON_SECRET"
```
(No `Authorization` header needed if you didn't set `CRON_SECRET`.)

### Add a coin · افزودن کوین
Update the `COINS` array in `src/lib/coingecko.ts` with the CoinGecko id.

</details>

---

## Data sources & limits · منابع داده و محدودیت‌ها

- 24h prediction candles come from Nobitex's public `market/udf/history` endpoint — real OHLC, not an approximation.
- Prices use Nobitex **USDT** pairs (e.g. BTCUSDT); close to USD but not identical.
- Not every coin is listed on Nobitex; unlisted ones fall back to a CoinGecko approximation, shown by the per-coin source label.

---

## Disclaimer · سلب مسئولیت

**Not financial advice. Markets can move against any indicator.** The technical lean is an educational RSI + MACD + moving-average read, not a trade call.
**این مشاوره‌ی مالی نیست. بازار می‌تواند خلاف هر اندیکاتوری حرکت کند.** «گرایش فنی» یک خوانشِ آموزشی است، نه توصیه‌ی معامله.
