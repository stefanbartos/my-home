---
layout: ../layouts/Default.astro
title: Frontend Best Practices
lang: sk
summary:
  sk: Čo nastaviť v každom frontend projekte – bezpečnosť závislostí, CI a zdravie kódu.
  en: What to set up in every frontend project – dependency security, CI and code health.
---

# Frontend Best Practices

## Bezpečnosť

- **V projektovom `.npmrc` nastavte `strict-allow-scripts=true`.** npm potom zlyhá pri inštalácii, keď má niektorá závislosť install skripty, ktoré `allowScripts` v `package.json` nepokrýva. Na vašom počítači ani v CI tak nespustí nič, čo ste neskontrolovali. Pozrite [dokumentáciu npm](https://docs.npmjs.com/cli/using-npm/config#strict-allow-scripts).

  ```ini
  strict-allow-scripts=true
  ```

- **V projektovom `.npmrc` nastavte `min-release-age=7`.** npm potom inštaluje len verzie zverejnené aspoň pred 7 dňami. Komunita tak má čas odhaliť a stiahnuť kompromitované vydanie skôr, než sa k vám dostane. Pozrite [dokumentáciu npm](https://docs.npmjs.com/cli/using-npm/config#min-release-age).

  ```ini
  min-release-age=7
  min-release-age-exclude[]=@myorg/*
  ```

  Pozor: zdrží to aj naliehavé bezpečnostné opravy. Ak chcete balík (alebo vlastné balíky) pustiť hneď, pridajte ho do `min-release-age-exclude` ako v druhom riadku vyššie. Oneskorenie preskočí len ten balík. Jeho závislosti stále čakajú.

## Install skripty

- **Každú závislosť s install skriptami uveďte v `allowScripts` v `package.json`.** Hodnota `true` povolí jej skript `preinstall`, `install` alebo `postinstall`, hodnota `false` ho preskočí. `false` použite vždy, keď balík funguje aj bez skriptu, a `true` len pre balíky, ktoré ste skontrolovali a skript naozaj potrebujú, napríklad natívne moduly, ktoré sa pri inštalácii kompilujú. So `strict-allow-scripts=true` (pozrite [Bezpečnosť](#bezpečnosť)) npm zlyhá, keď balík s install skriptami v zozname chýba, takže nový skript sa nespustí, kým o ňom nerozhodnete.

  ```json
  "allowScripts": {
    "lefthook": false
  }
  ```

  Skript `postinstall` v Lefthooku len inštaluje Git hooky. Skript `prepare` robí to isté pri každom `npm install` (pozrite [Git hooky](#git-hooky)), takže nastavením `lefthook` na `false` nič nestratíte a na vašom počítači sa nespustí ďalší skript z balíka.

## Kontajnerové obrazy

- **Používajte tag Node obrazu so suffixom OS.** Holý tag ako `node:22` nehovorí, na akom OS beží, a predvolený základ sa zmení, keď vyjde nové vydanie Debianu. Systémové knižnice a natívne moduly sa tak môžu rozbiť bez akejkoľvek zmeny na vašej strane. Suffix ako `-bookworm`, `-trixie` alebo `-alpine` OS zviditeľní a drží ho pevne, kým ho zámerne nezmeníte.

  ```dockerfile
  # Nepoužívajte: OS nie je vidieť, zmení sa s ďalším vydaním Debianu
  FROM node:22

  # Používajte: OS je jasne uvedený
  FROM node:22-bookworm
  ```

- **V pipelinoch a Dockerfiloch pripnite kontajnerové obrazy cez digest.** Tag ako `node:22-alpine` sa dá znova pushnúť a ukazovať na iný obsah, takže kompromitovaný alebo zmenený obraz sa dostane do buildu bez akejkoľvek zmeny na vašej strane. Digest vždy ukazuje na ten istý obraz. Tag pred ním nechajte, aby bolo stále vidieť, o akú verziu ide.

  Rovnaký zápis funguje v GitLab CI, GitHub Actions aj v Dockerfiloch:

  ```yaml
  # GitLab CI (.gitlab-ci.yml)
  image: node:22-alpine@sha256:<digest>
  ```

  ```yaml
  # GitHub Actions: kontajner jobu, services a Docker akcie
  jobs:
    build:
      container:
        image: node:22-alpine@sha256:<digest>
      services:
        db:
          image: postgres:17@sha256:<digest>
      steps:
        - uses: docker://node:22-alpine@sha256:<digest>
  ```

  ```dockerfile
  # Dockerfile
  FROM node:22-alpine@sha256:<digest>
  ```

  Pripnite digest multi-arch indexu (ukáže ho `docker buildx imagetools inspect node:22-alpine`), nie digest jednej platformy. Aktualizácie automatizujte: Renovate aktualizuje digesty vo všetkých súboroch vyššie. Dependabot pokrýva len Dockerfily a Compose súbory, nie obrazy uvedené v YAML pre GitHub Actions alebo GitLab CI. Pripnutie bez automatických aktualizácií vás nechá na starom obraze, ktorý prestane dostávať bezpečnostné záplaty.

## Zdravie kódu

- **Spúšťajte [fallow](https://fallow.tools/docs) v CI.** Nepoužívané súbory, exporty a závislosti sa pri zmenách kódu potichu hromadia a bežný build kvôli nim nezlyhá. fallow ich nájde spolu so skopírovaným kódom a príliš zložitými funkciami v jednom rýchlom prechode a pre väčšinu frameworkov bez konfigurácie. Pridajte `--fail-on-issues`, aby nálezy zhodili build. Bez neho fallow vždy skončí s kódom 0.

  ```json
  "scripts": {
    "lint:fallow": "fallow --fail-on-issues"
  }
  ```

## Git hooky

- **Formátovač a linter spúšťajte v pre-commit hooku.** Problémy zachytíte na svojom počítači za pár sekúnd, skôr než sa dostanú do commitu, review alebo CI. Hook sa dá preskočiť cez `git commit --no-verify`, takže rovnaké kontroly nechajte aj v CI.

- **Používajte [Lefthook](https://lefthook.dev/), nie husky s lint-staged.** JavaScriptové nástroje prechádzajú na rýchle natívne nástroje ako oxfmt a oxlint a spúšťač hookov by mal ísť s nimi. Lefthook je jedna skompilovaná binárka bez štartu Node.js a bez závislostí. Jeden `lefthook.yml` nahradí skripty hookov z husky aj konfiguráciu lint-staged. Každému príkazu odovzdá len stagované súbory (`{staged_files}`) a znova stagne to, čo formátovač opravil (`stage_fixed: true`).

  ```sh
  npm install --save-dev lefthook
  ```

  ```json
  "scripts": {
    "prepare": "lefthook install"
  }
  ```

  ```yaml
  # lefthook.yml
  pre-commit:
    jobs:
      - name: format
        glob: "*.{js,ts,vue,json,css,scss,yml,md}"
        run: ./node_modules/.bin/oxfmt {staged_files}
        stage_fixed: true
      - name: lint
        glob: "*.{js,ts,vue}"
        run: ./node_modules/.bin/oxlint {staged_files}
  ```

  Skript `prepare` inštaluje hooky pri každom `npm install`, takže v `allowScripts` môžete nastaviť `lefthook` na `false` a vlastný install skript Lefthooku preskočiť (pozrite [Install skripty](#install-skripty)).

- **Nástroje volajte z `node_modules/.bin`, nie cez `npx`.** Keď balík nie je nainštalovaný lokálne (čerstvý klon pred `npm install`, chýbajúca závislosť alebo preklep v názve), `npx` ho stiahne z registra a spustí. V Git hooku ani v CI nie je terminál, ktorý by sa vás spýtal, takže to urobí bez potvrdenia. Spustíte tak kód, ktorý lockfile nepripína a ktorý obíde `min-release-age` aj `allowScripts`. Volanie binárky cez cestu spustí len to, čo je nainštalované, a keď chýba, hlasno zlyhá.

  ```yaml
  # lefthook.yml
  # Nepoužívajte: stiahne a spustí oxlint, ak nie je nainštalovaný
  run: npx oxlint {staged_files}

  # Používajte: spustí len lokálne nainštalovanú verziu
  run: ./node_modules/.bin/oxlint {staged_files}
  ```

  Lefthook spúšťa príkazy z koreňa repozitára, takže relatívna cesta funguje. Príkazy v skriptoch `package.json` sa už hľadajú v `node_modules/.bin`, takže tam môžete volať `oxfmt` alebo `oxlint` priamo menom.
