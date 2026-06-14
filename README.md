# ⧗ TimeTravel Agency — Webapp Interactive

> Projet supervisé IA · M1/M2 · Session 2 : Webapp & Agents IA
> Agence (fictive) de voyage temporel de luxe — réservez votre traversée vers **Paris 1889**, **le Crétacé** ou **Florence 1504**, guidé par **Chronos**, notre concierge IA.

🔗 **Démo en ligne :** _[à compléter après déploiement — voir la section Déploiement]_

---

## 🚀 Démo locale

Le site est **100 % statique** : aucune installation, aucune compilation.

- **Le plus simple :** double-cliquez sur `index.html` — il s'ouvre directement dans le navigateur.
- **Avec un petit serveur local** (recommandé pour tester comme en production) :
  ```bash
  npx serve .
  # ou
  python -m http.server 8000
  ```
  puis ouvrez `http://localhost:8000`.

> 💡 Le chatbot, le quiz et les itinéraires **fonctionnent sans aucune clé** grâce à un mode local intégré. Pour activer l'**IA générative Mistral**, voir la section [Configuration de la clé Mistral](#-configuration-de-la-clé-mistral).

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| **Multi-vues + routeur** | Accueil + 3 pages destination + page réservation, navigation sans rechargement. URL partageables (`#/paris`) et boutons précédent/suivant du navigateur opérationnels. |
| **Saut temporel cinématique** | Chaque changement d'époque déclenche un overlay « translation temporelle » avec compteur d'années animé (easing cubique, de 2026 vers 1889 / −65 000 000 / 1504). |
| **HUD d'époque** | L'année courante est affichée en permanence dans la barre de navigation. |
| **Chatbot IA « Chronos »** | Concierge temporel à **deux niveaux** : API **Mistral** si une clé est fournie, sinon **moteur local** intelligent. Personnalité d'agent de voyage de luxe, contexte complet des 3 offres, suggestions de questions, badge de mode transparent. |
| **Quiz « L'oracle de Chronos »** | 4 questions → scoring par destination → recommandation **rédigée par l'IA** à partir des réponses (texte de secours si hors-ligne). |
| **Itinéraires IA jour par jour** | Sur chaque page destination : sélection de centres d'intérêt (chips) → composition d'un programme « Jour N — … » sur mesure (mode local compris). |
| **Réservation complète** | Choix destination / date / voyageurs / classe, calcul du prix en direct (Première Temporelle +45 %), validation, écran de confirmation avec n° de dossier. |
| **Ambiances par époque** | Chaque destination a sa teinte propre : or Belle Époque, vert Crétacé, terracotta Renaissance — sur une base commune noir profond + or. |
| **Intégration des visuels Session 1** | Emplacements `<img>` câblés pour les héros et les cartes, *lazy loading*, et **secours élégant** (placeholder coloré par destination) si une image manque. |
| **Responsive & accessible** | Menu burger mobile, breakpoints 1080/900/768/560 px, apparitions au scroll, focus visible, navigation clavier, `prefers-reduced-motion`. |

---

## 🗂 Structure du projet

```
index.html              Page unique : 5 vues + overlays (saut, quiz, chat)
css/
  base.css              Variables (palette), reset, keyframes, accessibilité
  components.css        Boutons, chips, cartes, formulaires, modal, chat, overlay
  pages.css            Header/burger, hero, pages destination, réservation, footer + responsive
js/
  data.js              Source unique : catalogue, quiz, prompts IA, base de connaissances, secours
  ai.js                Couche IA : client Mistral + gestion de clé + moteur local
  chat.js              Widget Chronos
  quiz.js              Oracle (modal, scoring, focus trap)
  itinerary.js         Chips + génération d'itinéraires
  booking.js           Réservation (validation, total, confirmation)
  app.js               Routeur, saut temporel, burger, reveals, visuels, délégation
assets/img/            Visuels Session 1 (voir assets/img/README.md)
legacy/                Version d'origine archivée (artifact Claude.ai, non déployable)
PROMPTS.md             Prompts documentés (build + runtime)
LICENSE                Licence MIT
```

**Pourquoi du vanilla sans framework / sans build ?** Le site doit être déployable par simple glisser-déposer et fonctionner aussi bien depuis un fichier local (`file://`) qu'hébergé. Les scripts sont chargés avec `defer` et partagent un namespace unique `window.TT` — pas de modules ES (qui échouent en `file://`), pas d'étape de compilation.

---

## 🤖 Fonctionnalités IA — architecture à deux niveaux

Toutes les fonctions IA passent par `js/ai.js`, qui tente d'abord l'**API Mistral**, puis bascule **automatiquement** sur un **moteur local** en cas d'absence de clé ou d'erreur réseau. La démo ne casse donc **jamais**.

1. **Chat Chronos** — prompt système (rôle, catalogue, prix, ton) + historique de conversation (12 derniers tours) rejoué à chaque appel.
2. **Oracle (quiz)** — les 4 réponses du client sont injectées dans le prompt ; l'IA justifie la recommandation en 55–75 mots.
3. **Itinéraires** — destination + durée + centres d'intérêt → format imposé « Jour N — Titre : deux phrases ».

**Cohérence des réponses (mode local).** Le moteur local normalise la question (sans accents), détecte la destination évoquée par mots-clés, puis sélectionne une *intention* (prix, durée, sécurité, classe, lune de miel, famille, météo, conseil…) parmi une base de connaissances. Les réponses sont **composées à partir du même objet `DESTS`** que la réservation et le reste du site : les prix, durées et risques ne peuvent donc jamais se contredire. C'est la garantie de cohérence, avec ou sans IA générative.

---

## 🔑 Configuration de la clé Mistral

L'IA générative est **optionnelle** (le mode local suffit à la démo), mais recommandée pour des réponses « vraie IA ».

1. Créez une clé **gratuite** sur [console.mistral.ai](https://console.mistral.ai/).
2. Ouvrez le chat (bouton **C** en bas à droite) → icône **⚙** → collez la clé → **OK**.
3. Le badge passe de « mode local » à « **IA Mistral** ». Le modèle utilisé est `mistral-small-latest`.

> 🔒 **Sécurité & transparence.** La clé reste dans votre navigateur (`localStorage`) et n'est envoyée qu'à `api.mistral.ai`. Elle **n'est jamais committée** dans le dépôt (voir `.gitignore`). Ne partagez pas une clé dans le code source.

---

## 🖼 Assets Session 1

Déposez vos 6 visuels dans `assets/img/` avec les noms exacts ci-dessous (`.jpg` ou `.webp`) :

| Fichier | Usage |
|---|---|
| `paris-hero.jpg` / `paris-card.jpg` | Héros + carte — Paris 1889 |
| `cretace-hero.jpg` / `cretace-card.jpg` | Héros + carte — Crétacé |
| `florence-hero.jpg` / `florence-card.jpg` | Héros + carte — Florence 1504 |

Si un fichier manque, un **placeholder élégant** aux couleurs de la destination s'affiche automatiquement. Détails dans [`assets/img/README.md`](assets/img/README.md).

---

## 🎨 Direction artistique

- **Thème** : luxe sombre — noir profond `#0B0908`, or `#C8A75C`, ivoire `#EDE4D2`.
- **Typographies** : Cormorant Garamond (titres, chiffres d'époque) + Jost (texte, interface).
- **Motifs** : anneaux concentriques animés (ondes temporelles), halos coniques en rotation lente.
- **Micro-interactions** : hover sur cartes (élévation + bordure or), chips sélectionnables, apparitions en cascade au scroll.

---

## ♿ Accessibilité & responsive

- Menu burger sous 768 px ; grilles qui se replient (900/560 px) ; chat et modal adaptés au mobile.
- Lien d'évitement « Aller au contenu », `lang="fr"`, focus visible doré, labels de formulaire reliés.
- Modal quiz : `role="dialog"`, fermeture par Échap, piège à focus, retour du focus à l'ouvrant.
- Zones de réponse IA en `aria-live="polite"`. Respect de `prefers-reduced-motion` (animations désactivées).

---

## 🧰 Stack technique

- HTML / CSS / JavaScript **vanilla** (aucune dépendance hors Google Fonts).
- **API Mistral** (`mistral-small-latest`) pour la génération de texte.
- Routeur par *hash*, `IntersectionObserver`, `fetch` + `AbortController`.

---

## 🪄 Outils IA utilisés (transparence)

- **Génération du design initial** : Claude (artifact `.dc.html`, conservé dans `legacy/`).
- **Portage en site déployable + intégration Mistral** : Claude Code (réécriture vanilla, refactor des styles, couche IA à deux niveaux).
- **Chatbot / quiz / itinéraires en production** : **Mistral Small** via API, avec moteur local de secours.
- **Visuels** : générés en Session 1 avec **Midjourney** (images) ; prompts détaillés dans [`PROMPTS.md`](PROMPTS.md).

---

## 🔍 Réflexion sur le processus

La première version (Session 1 / artifact Claude.ai) était visuellement aboutie mais **ne fonctionnait que dans l'environnement Claude.ai** : elle dépendait d'un runtime propriétaire (`window.React` jamais chargé → page blanche ailleurs) et appelait `window.claude.complete()` pour toute l'IA — inexistant une fois déployé.

Le travail de Session 2 a donc consisté à :

1. **Rendre le projet réellement déployable** — réécriture en HTML/CSS/JS vanilla, sans build ni runtime caché, testé en `file://` comme en serveur.
2. **Remplacer l'IA « magique » par une vraie intégration** — client Mistral documenté + **moteur local de secours** pour que la démo tienne en toutes circonstances (jury hors-ligne, quota épuisé, pas de clé).
3. **Refactor pour la qualité de code** — styles inline → classes sémantiques, données centralisées dans `data.js` (source unique de vérité), modules séparés par responsabilité.
4. **Combler les manques UX** — responsive/burger, accessibilité, apparitions au scroll, secours d'images.

**Ce que l'IA a bien fait :** le design, les animations et les textes d'ambiance, très réussis dès le départ. **Ce qu'il a fallu reprendre à la main :** tout ce qui touche à l'exécution hors de l'environnement d'origine (runtime, intégration API réelle, gestion d'erreurs, sécurité de la clé). Leçon retenue : un code généré « qui s'affiche » n'est pas un code « qui se déploie » — la valeur ajoutée est dans le portage, la robustesse et la transparence.

---

## ☁️ Déploiement

Le projet est prêt à être déployé tel quel (statique). Au choix :

- **Netlify** — glissez-déposez le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages** — poussez le dépôt puis activez Pages sur la branche `main` (dossier racine).
- **Vercel** — « Import Project », aucun réglage de build (framework : *Other*).
- **Docker** — image nginx prête à l'emploi (voir `Dockerfile`) :

```bash
docker compose up --build          # → http://localhost:8080
# ou, sans compose :
docker build -t timetravel-agency .
docker run --rm -p 8080:80 timetravel-agency
```

  L'image (~74 Mo, `nginx:alpine`) ne contient que le site (pas de `legacy/`, `notes/`, `uploads/`) et n'embarque aucun secret — la clé Mistral est saisie côté navigateur. Déployable sur tout hébergeur de conteneurs (Render, Railway, Fly.io, Google Cloud Run…).

Après déploiement : testez l'URL sur mobile et desktop, vérifiez le chat, le quiz, les itinéraires et la réservation, puis collez l'URL en haut de ce README.

---

## 👥 Crédits

- **Groupe** : Mohamed Daoudi, Luc Charlopeau.
- **Code** : généré avec Claude, porté et supervisé par le groupe.
- **IA texte** : Mistral Small (API) + moteur local maison.
- **Polices** : Cormorant Garamond & Jost (Google Fonts, licence SIL OFL).
- **Visuels** : générés en Session 1 avec Midjourney (prompts dans [`PROMPTS.md`](PROMPTS.md)).

## 📝 Licence

Code sous licence **MIT** (voir [`LICENSE`](LICENSE)). Projet pédagogique M1/M2 Digital & IA.

## 🔭 Pistes d'amélioration

- Voix de Chronos (synthèse vocale) pendant le saut temporel.
- Plus de destinations (Rome antique, Woodstock 1969…).
- Sauvegarde des réservations (localStorage / backend).
