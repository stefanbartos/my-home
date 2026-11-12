const locales = ["sk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sk";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

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
        "site.description": "Osobná stránka Štefana Bartoša — kód, skaly a poznámky.",
        skip: "Preskočiť na obsah",
        "nav.label": "Hlavná navigácia",
        "nav.home": "Domov",
        "nav.sci": "SCI",
        "nav.firstAid": "Prvá pomoc",
        "nav.frontend": "Frontend",
        "lang.switch": "Switch to English",
        "lang.other": "EN",

        "hero.eyebrow": "Ahoj, ja som",
        "hero.lead":
            "Cez deň skladám webové komponenty, cez víkend istím na skalách. Sem si odkladám poznámky z kurzov, výletov a všetkého medzi tým.",
        "hero.chipsLabel": "O mne v skratke",
        "hero.chip.dev": "frontend developer",
        "hero.chip.climb": "lezec & drytool",
        "hero.chip.aid": "outdoor prvá pomoc",
        "hero.bolt.code": "kód",
        "hero.bolt.aid": "prvá pomoc",
        "hero.bolt.rock": "skaly",

        "routes.eyebrow": "Topo",
        "routes.title": "Cesty na tejto skale",
        "routes.sci.text":
            "Poznámky z kurzu skalného inštruktora: uzly, štandy, slaňovanie a záchranné techniky.",
        "routes.sci.meta": "dlhá cesta · 40+ krokov",
        "routes.aid.text":
            "Čo patrí do outdoorovej lekárničky a ako postupovať, keď sa niečo pokazí.",
        "routes.aid.meta": "krátka, ale dôležitá",
        "routes.frontend.name": "Frontend Best Practices",
        "routes.frontend.text":
            "Čo nastaviť v každom frontend projekte: bezpečnosť závislostí, CI a zdravie kódu.",
        "routes.frontend.meta": "z práce · v angličtine",

        "about.eyebrow": "Beta",
        "about.title": "O mne",
        "about.p1":
            "Som frontend developer — baví ma, keď je rozhranie rýchle, prístupné a príjemné na dotyk. Mimo obrazovky ma nájdeš na pieskovci, vápenci alebo v ľade s cepínmi v rukách.",
        "about.p2":
            "Táto stránka je môj otvorený zápisník. Nič tu nie je dokonalé, ale všetko je overené v teréne.",
        "now.eyebrow": "Práve teraz",
        "now.1": "pripravujem sa na SCI",
        "now.2": "ladím túto stránku v Astre",
        "now.3": "dopĺňam lekárničku",
    },
    en: {
        "site.description": "Štefan Bartoš's personal site — code, rock and notes.",
        skip: "Skip to content",
        "nav.label": "Main navigation",
        "nav.home": "Home",
        "nav.sci": "SCI",
        "nav.firstAid": "First aid",
        "nav.frontend": "Frontend",
        "lang.switch": "Prepnúť do slovenčiny",
        "lang.other": "SK",

        "hero.eyebrow": "Hi, I'm",
        "hero.lead":
            "By day I build web components, at weekends I belay on the crag. This is where I keep notes from courses, trips and everything in between.",
        "hero.chipsLabel": "About me in brief",
        "hero.chip.dev": "frontend developer",
        "hero.chip.climb": "climber & drytooler",
        "hero.chip.aid": "outdoor first aid",
        "hero.bolt.code": "code",
        "hero.bolt.aid": "first aid",
        "hero.bolt.rock": "rock",

        "routes.eyebrow": "Topo",
        "routes.title": "Routes on this crag",
        "routes.sci.text":
            "Notes from the rock-climbing instructor course: knots, anchors, abseiling and rescue techniques.",
        "routes.sci.meta": "long route · in Czech",
        "routes.aid.text":
            "What goes into an outdoor first-aid kit and what to do when things go wrong.",
        "routes.aid.meta": "short but important · in Slovak",
        "routes.frontend.name": "Frontend Best Practices",
        "routes.frontend.text":
            "What to set up in every frontend project: dependency security, CI and code health.",
        "routes.frontend.meta": "from work · checklist",

        "about.eyebrow": "Beta",
        "about.title": "About me",
        "about.p1":
            "I'm a frontend developer — I like interfaces that are fast, accessible and pleasant to touch. Away from the screen you'll find me on sandstone, limestone or ice with axes in hand.",
        "about.p2":
            "This site is my open notebook. Nothing here is perfect, but all of it has been tested in the field.",
        "now.eyebrow": "Right now",
        "now.1": "preparing for the SCI exam",
        "now.2": "tuning this site in Astro",
        "now.3": "restocking my first-aid kit",
    },
} as const;

export type UIKey = keyof (typeof ui)["sk"];

export function useTranslations(lang: Locale) {
    return (key: UIKey) => ui[lang][key] ?? ui[defaultLocale][key];
}
