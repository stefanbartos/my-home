const locales = ["sk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sk";

const base = import.meta.env.BASE_URL.replace(/\/$/u, "");

/** Absolute URL for a path inside the site, e.g. url("/sci/") → "/my-home/sci/". */
export function url(path: string) {
    return `${base}${path}`;
}

/** Home page URL for a locale. */
export function homeUrl(lang: Locale) {
    return url(lang === defaultLocale ? "/" : `/${lang}/`);
}

const ui = {
    sk: {
        "site.description": "Blog Štefana Bartoša o lezení, jachtingu, motorkách, outdoore a IT.",
        skip: "Preskočiť na obsah",
        "nav.label": "Hlavná navigácia",
        "nav.home": "Domov",
        "nav.posts": "Články",
        "nav.about": "O mne",
        "lang.switch": "Switch to English",
        "lang.other": "EN",
        "theme.toggle": "Prepnúť svetlý/tmavý režim",
        "lightbox.label": "Prehliadač obrázkov",
        "lightbox.close": "Zavrieť",
        "lightbox.prev": "Predchádzajúci obrázok",
        "lightbox.next": "Ďalší obrázok",
        "code.copy": "Kopírovať kód",
        "code.copied": "Skopírované",

        "hero.eyebrow": "Ahoj, ja som",
        "hero.lead":
            "Frontend developer. Píšem o webovom vývoji, lezení a ďalších veciach, ktorým sa venujem.",

        "posts.eyebrow": "Zápisník",
        "posts.title": "Články",

        "about.eyebrow": "O mne",
        "about.title": "Kto tu píše",
        "about.p1":
            "Som frontend developer so zameraním na rýchle, prístupné a dobre použiteľné webové rozhrania. Vo voľnom čase sa venujem lezeniu, jachtingu a motorkám.",
        "about.p2": "Na tomto blogu zdieľam poznámky a skúsenosti z práce aj z voľného času.",
        "about.cred.title": "Inštruktor športových ciest (SCI)",
        "about.cred.text":
            "Kvalifikovaný inštruktor podľa Národnej sústavy kvalifikácií, s prípravou na Českom horolezeckom zväze.",
    },
    en: {
        "site.description":
            "Štefan Bartoš's personal blog – notes from code, from the road and everything in between.",
        skip: "Skip to content",
        "nav.label": "Main navigation",
        "nav.home": "Home",
        "nav.posts": "Posts",
        "nav.about": "About",
        "lang.switch": "Prepnúť do slovenčiny",
        "lang.other": "SK",
        "theme.toggle": "Toggle light/dark theme",
        "lightbox.label": "Image viewer",
        "lightbox.close": "Close",
        "lightbox.prev": "Previous image",
        "lightbox.next": "Next image",
        "code.copy": "Copy code",
        "code.copied": "Copied",

        "hero.eyebrow": "Hi, I'm",
        "hero.lead":
            "Frontend developer. I write about web development, climbing and the other things I spend my time on.",

        "posts.eyebrow": "Notebook",
        "posts.title": "Posts",

        "about.eyebrow": "About",
        "about.title": "Who writes here",
        "about.p1":
            "I'm a frontend developer focused on fast, accessible and usable web interfaces. In my free time I climb, sail and ride motorbikes.",
        "about.p2": "On this blog I share notes and experience from both work and free time.",
        "about.cred.title": "Sport Climbing Instructor (SCI)",
        "about.cred.text":
            "Qualified under the Czech National Qualifications Framework (NSK), trained by the Czech Mountaineering Federation (ČHS).",
    },
} as const;

const languageNames: Record<Locale, Record<string, string>> = {
    sk: { sk: "po slovensky", cs: "po česky", en: "po anglicky" },
    en: { sk: "in Slovak", cs: "in Czech", en: "in English" },
};

/** "in Czech" etc., shown on post cards whose language differs from the page. */
export function languageName(locale: Locale, lang: string) {
    return languageNames[locale][lang] ?? lang;
}

export type UIKey = keyof (typeof ui)["sk"];

export function useTranslations(lang: Locale) {
    return (key: UIKey) => ui[lang][key] ?? ui[defaultLocale][key];
}
