(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dictionary",
    ()=>dictionary
]);
const dictionary = {
    en: {
        dir: "ltr",
        appName: "Crypto Pulse",
        tagline: "Live prices, market news, and educational technical leans — every hour, both languages.",
        nav: {
            dashboard: "Dashboard",
            news: "News",
            disclaimer: "Disclaimer"
        },
        prices: {
            title: "Live Prices",
            subtitle: "Refreshes automatically — last update shown below",
            lastUpdate: "Last update",
            change24h: "24h",
            loading: "Loading prices…",
            error: "Could not load prices right now."
        },
        signals: {
            title: "Technical Lean",
            subtitle: "Rule-based RSI + moving-average read. Educational only — not a trade call.",
            bullish: "Leaning up",
            bearish: "Leaning down",
            neutral: "No clear lean",
            confidence: "Confidence",
            low: "low",
            medium: "medium",
            high: "high",
            disclaimerShort: "Not financial advice. Markets can move against any indicator."
        },
        news: {
            title: "Latest News",
            subtitle: "Pulled from multiple crypto outlets",
            loading: "Loading news…",
            error: "Could not load news right now.",
            readMore: "Read source ↗",
            source: "Source"
        },
        disclaimerPage: {
            title: "Disclaimer",
            body: [
                "Crypto Pulse is an educational dashboard. Nothing on this page is financial, investment, or trading advice.",
                "Price data and 'technical lean' indicators are generated from simple, publicly known formulas (RSI, moving averages) applied to recent price history. They are not predictions, are not backtested for reliability, and carry no guarantee of any outcome — including the 1–5% profit targets sometimes mentioned casually around crypto trading.",
                "Cryptocurrency markets are highly volatile. You could lose some or all of any money you trade with. Always do your own research and consider consulting a licensed financial advisor before making decisions."
            ]
        },
        footer: "Built for personal/educational use. Data via CoinGecko & public RSS feeds.",
        track: {
            title: "Signal Track Record",
            subtitle: "Every lean is logged daily. After 14 days we check whether price actually moved the predicted direction by at least 0.5%.",
            navLabel: "Track Record",
            accuracy: "Accuracy",
            totalLogged: "Total logged",
            evaluated: "Evaluated",
            correct: "Correct",
            incorrect: "Incorrect",
            skipped: "Skipped (flat / no lean)",
            noData: "No signals logged yet — once the daily cron runs, history will build up here.",
            pending: "Pending (< 14 days)",
            colDate: "Date",
            colLean: "Lean",
            colPriceAtLog: "Price logged",
            colPriceNow: "Price after 14d",
            colMove: "Move",
            colOutcome: "Outcome",
            setupNote: "Requires Upstash Redis env vars + Vercel Cron — see README."
        },
        predictions: {
            title: "24h Multi-Timeframe Predictions",
            subtitle: "Combines 30m/1h/4h/12h RSI, MACD, moving averages, and volume into a daily call with a target price. The confidence % is a formula-based heuristic, NOT a statistically validated probability — that only comes from the realized hit rate below, once enough days are logged.",
            navLabel: "Predictions",
            heuristicLabel: "Heuristic confidence (not a real probability yet)",
            realizedLabel: "Realized hit rate (the real number)",
            target: "24h target",
            expectedMove: "Projected move",
            timeframeBreakdown: "Timeframe scores (30m / 1h / 4h / 12h)",
            hit: "Hit",
            miss: "Miss",
            pending: "Pending (< 24h)",
            colDate: "Date",
            colLean: "Lean",
            colConfidence: "Confidence",
            colPriceAtLog: "Price logged",
            colTarget: "Target",
            colPriceAfter: "Price after 24h",
            colActualMove: "Actual move",
            colOutcome: "Outcome",
            noData: "No predictions logged yet.",
            threshold: "A call counts as a Hit if price moved ≥1% in the predicted direction within 24h."
        }
    },
    fa: {
        dir: "rtl",
        appName: "کریپتو پالس",
        tagline: "قیمت لحظه‌ای، اخبار بازار و گرایش فنی آموزشی — هر ساعت، دوزبانه.",
        nav: {
            dashboard: "داشبورد",
            news: "اخبار",
            disclaimer: "سلب مسئولیت"
        },
        prices: {
            title: "قیمت لحظه‌ای",
            subtitle: "به‌صورت خودکار به‌روزرسانی می‌شود — زمان آخرین به‌روزرسانی پایین آمده",
            lastUpdate: "آخرین به‌روزرسانی",
            change24h: "۲۴ ساعت",
            loading: "در حال بارگذاری قیمت‌ها…",
            error: "قیمت‌ها در حال حاضر قابل دریافت نیستند."
        },
        signals: {
            title: "گرایش فنی",
            subtitle: "بر اساس RSI و میانگین متحرک. فقط جنبه آموزشی دارد — توصیه معاملاتی نیست.",
            bullish: "گرایش صعودی",
            bearish: "گرایش نزولی",
            neutral: "گرایش مشخصی نیست",
            confidence: "اطمینان",
            low: "پایین",
            medium: "متوسط",
            high: "بالا",
            disclaimerShort: "این توصیه مالی نیست. بازار می‌تواند خلاف هر اندیکاتوری حرکت کند."
        },
        news: {
            title: "آخرین اخبار",
            subtitle: "گردآوری‌شده از چند منبع خبری کریپتو",
            loading: "در حال بارگذاری اخبار…",
            error: "اخبار در حال حاضر قابل دریافت نیست.",
            readMore: "مشاهده منبع ↗",
            source: "منبع"
        },
        disclaimerPage: {
            title: "سلب مسئولیت",
            body: [
                "کریپتو پالس یک داشبورد آموزشی است. هیچ‌چیز در این صفحه توصیه مالی، سرمایه‌گذاری یا معاملاتی نیست.",
                "داده‌های قیمت و اندیکاتورهای «گرایش فنی» از فرمول‌های ساده و عمومی (RSI، میانگین متحرک) روی تاریخچه اخیر قیمت ساخته می‌شوند. این‌ها پیش‌بینی نیستند، از نظر قابلیت اطمینان آزمایش نشده‌اند و هیچ تضمینی برای هیچ نتیجه‌ای — از جمله اهداف سود ۱ تا ۵ درصدی که گاهی در فضای معاملات کریپتو مطرح می‌شود — ندارند.",
                "بازارهای کریپتو نوسان بسیار بالایی دارند. ممکن است بخشی یا تمام سرمایه‌ای که با آن معامله می‌کنید را از دست بدهید. همیشه تحقیق شخصی انجام دهید و پیش از تصمیم‌گیری با یک مشاور مالی دارای مجوز مشورت کنید."
            ]
        },
        footer: "ساخته‌شده برای استفاده شخصی/آموزشی. داده‌ها از CoinGecko و فیدهای RSS عمومی.",
        track: {
            title: "سابقه‌ی سیگنال‌ها",
            subtitle: "هر گرایش هر روز ثبت می‌شود. بعد از ۱۴ روز بررسی می‌شود که آیا قیمت واقعاً حداقل ۰.۵٪ در جهت پیش‌بینی‌شده حرکت کرده یا نه.",
            navLabel: "سابقه‌ی عملکرد",
            accuracy: "درصد دقت",
            totalLogged: "تعداد کل ثبت‌شده",
            evaluated: "ارزیابی‌شده",
            correct: "درست",
            incorrect: "غلط",
            skipped: "نادیده‌گرفته‌شده (بدون حرکت / بدون گرایش)",
            noData: "هنوز سیگنالی ثبت نشده — بعد از اجرای cron روزانه، تاریخچه اینجا جمع می‌شود.",
            pending: "در انتظار (کمتر از ۱۴ روز)",
            colDate: "تاریخ",
            colLean: "گرایش",
            colPriceAtLog: "قیمت زمان ثبت",
            colPriceNow: "قیمت بعد از ۱۴ روز",
            colMove: "حرکت",
            colOutcome: "نتیجه",
            setupNote: "نیاز به env variable های Upstash Redis و Vercel Cron دارد — به README مراجعه کن."
        },
        predictions: {
            title: "پیش‌بینی چندتایم‌فریمی ۲۴ ساعته",
            subtitle: "ترکیب RSI، MACD، میانگین متحرک و حجم در چهار تایم‌فریم ۳۰دقیقه/۱ساعته/۴ساعته/۱۲ساعته، با یک قیمت هدف. درصد اطمینان یک حدس فرمولیه، نه احتمال آماری اثبات‌شده — احتمال واقعی فقط از نرخ موفقیت واقعی پایین صفحه به‌دست میاد، بعد از ثبت چند روز کافی.",
            navLabel: "پیش‌بینی‌ها",
            heuristicLabel: "اطمینان فرمولی (هنوز احتمال واقعی نیست)",
            realizedLabel: "نرخ موفقیت واقعی (عدد واقعی)",
            target: "هدف ۲۴ ساعته",
            expectedMove: "حرکت پیش‌بینی‌شده",
            timeframeBreakdown: "امتیاز هر تایم‌فریم (۳۰د / ۱س / ۴س / ۱۲س)",
            hit: "درست",
            miss: "غلط",
            pending: "در انتظار (کمتر از ۲۴ ساعت)",
            colDate: "تاریخ",
            colLean: "گرایش",
            colConfidence: "اطمینان",
            colPriceAtLog: "قیمت زمان ثبت",
            colTarget: "هدف",
            colPriceAfter: "قیمت بعد از ۲۴ساعت",
            colActualMove: "حرکت واقعی",
            colOutcome: "نتیجه",
            noData: "هنوز پیش‌بینی‌ای ثبت نشده.",
            threshold: "اگه قیمت ظرف ۲۴ ساعت حداقل ۱٪ در جهت پیش‌بینی‌شده حرکت کنه، «درست» حساب می‌شه."
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/LocaleContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleProvider",
    ()=>LocaleProvider,
    "useLocale",
    ()=>useLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const LocaleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function LocaleProvider({ children }) {
    _s();
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("fa");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocaleProvider.useEffect": ()=>{
            const stored = window.localStorage.getItem("cp_locale");
            if (stored === "en" || stored === "fa") setLocaleState(stored);
        }
    }["LocaleProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocaleProvider.useEffect": ()=>{
            document.documentElement.lang = locale;
            document.documentElement.dir = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dictionary"][locale].dir;
        }
    }["LocaleProvider.useEffect"], [
        locale
    ]);
    function setLocale(l) {
        setLocaleState(l);
        window.localStorage.setItem("cp_locale", l);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocaleContext.Provider, {
        value: {
            locale,
            setLocale,
            t: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dictionary"][locale]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/LocaleContext.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(LocaleProvider, "WB8fN1s4JL1yXLTRBCARYZF9cZQ=");
_c = LocaleProvider;
function useLocale() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
    return ctx;
}
_s1(useLocale, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "LocaleProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_075u-4u._.js.map