# 🧠 Prompts documentés — TimeTravel Agency

Transparence sur l'usage de l'IA dans ce projet (critère « Open Source & Documentation »).
Trois familles de prompts : **construction** du site, **exécution** (runtime, envoyés à Mistral), et **visuels** (Session 1).

---

## 1. Prompts de construction (design & code)

Prompts utilisés pour générer puis porter l'application.

**Génération initiale (Session 1, artifact Claude.ai) :**
- « Crée une webapp multi-vues pour TimeTravel Agency, thème luxe sombre noir + or, typographie Cormorant Garamond / Jost, avec un HUD affichant l'année courante. »
- « Ajoute une transition de saut temporel : overlay plein écran avec compteur d'années animé en easing cubique entre l'époque de départ et d'arrivée. »
- « Implémente Chronos, chatbot concierge : prompt système avec catalogue et prix, ton agent de voyage de luxe, réponses en français de 50 à 100 mots, fallback si l'API échoue. »
- « Quiz 4 questions avec scoring par destination, puis génération IA d'une justification personnalisée à partir des réponses. »
- « Générateur d'itinéraire jour par jour : chips de centres d'intérêt, format de sortie strict, crédibilité historique. »

**Portage en site déployable (Session 2, Claude Code) :**
- « Le projet ne tourne que dans Claude.ai (window.React et window.claude.complete absents une fois déployé). Réécris-le en HTML/CSS/JS vanilla, sans build, déployable en glisser-déposer, qui marche aussi en file://. »
- « Remplace window.claude.complete par un vrai client API Mistral (mistral-small-latest), avec gestion de clé via localStorage et un moteur de secours local pour que la démo ne casse jamais. »
- « Convertis tous les styles inline en classes CSS sémantiques, centralise les données dans un seul fichier data.js (source unique de vérité). »
- « Ajoute le responsive (menu burger, breakpoints), les apparitions au scroll (IntersectionObserver) et l'accessibilité (focus visible, ARIA, prefers-reduced-motion). »

---

## 2. Prompts d'exécution (runtime — envoyés à Mistral)

Ces prompts sont dans `js/data.js` et partent réellement à l'API à chaque interaction.

### 2.1 Prompt système de Chronos (`SYS`)

> Tu es Chronos, concierge virtuel de TimeTravel Agency, agence de voyage temporel de luxe (fictive, projet étudiant M1/M2). Destinations au départ du terminal de Paris, 2026 : 1) Paris 1889, Belle Époque, Exposition Universelle, tour Eiffel toute neuve — 4 jours, 12 400 € par personne, risque paradoxal faible. 2) Le Crétacé, −65 millions d'années, dinosaures, nature primitive, escorte de stase obligatoire — 3 jours, 24 800 €, risque élevé. 3) Florence 1504, Renaissance, dévoilement du David, atelier de Léonard — 4 jours, 14 900 €, risque modéré. Inclus : champ de stase certifié, garde-robe et monnaie d'époque, assurance paradoxe, chrononaute accompagnateur. Classe Première Temporelle : +45 %. Ton : professionnel, chaleureux, passionné d'histoire, une pointe d'humour subtil sur les paradoxes. Réponds toujours en français, en 50 à 100 mots, sans markdown ni listes à puces. Invente des détails crédibles et cohérents si besoin. Quand c'est pertinent, recommande une destination et invite à utiliser la page Réservation.

Utilisé pour : le **chat** (système + historique de conversation), l'**oracle** et les **itinéraires** (système + prompt dédié ci-dessous).

### 2.2 Prompt de l'oracle (quiz) — `buildQuizPrompt(answers, destLabel)`

> Tu es Chronos, concierge de TimeTravel Agency […]. Un client a répondu à notre quiz : **{réponses jointes par « · »}**. Sa destination recommandée est **{destination}**. En 55 à 75 mots, en français, ton luxe sobre et chaleureux, explique-lui pourquoi cette époque est faite pour lui, en t'appuyant sur ses réponses. Commence directement, sans markdown ni guillemets.

Variables : `answers` = libellés des 4 réponses choisies ; `destLabel` = destination gagnante au scoring.

### 2.3 Prompt des itinéraires — `buildItinPrompt(dest, interests)`

> Tu es Chronos, concierge de TimeTravel Agency […]. Compose un itinéraire de **{N}** jours à destination de **{destination}** pour un voyageur intéressé par : **{centres d'intérêt}**. Réponds en français, sans markdown, format strict : une ligne par jour sous la forme « Jour N — Titre évocateur : deux phrases élégantes et concrètes. » Reste crédible historiquement (ou scientifiquement pour le Crétacé), ton luxe sobre, aucune introduction ni conclusion.

Variables : `N` = durée (4 / 3 / 4) ; `centres d'intérêt` = chips sélectionnés, ou « découverte générale de l'époque » si aucun.

---

## 3. Prompts des visuels (Session 1)

Visuels générés avec **Midjourney** (v6). Direction artistique commune imposée à chaque prompt
pour rester cohérent avec le site : **luxe sombre, noir profond + or champagne, lumière
cinématographique, photoréalisme**. Format `--ar 16:9` pour les images « hero » (plein écran),
`--ar 3:2` pour les « card » (cartes d'accueil). Les fichiers correspondants vont dans
`assets/img/` (`paris-hero.jpg`, `paris-card.jpg`, etc.).

### Paris 1889
- **Hero** — `Paris 1889, Exposition Universelle at dusk, brand-new Eiffel Tower glowing with thousands of gas lights, Belle Époque crowd in formal evening wear, ornate iron-and-glass pavilions, golden hour, volumetric light, deep black and champagne-gold palette, cinematic wide establishing shot, photorealistic, ultra-detailed --ar 16:9 --style raw`
- **Card** — `Belle Époque Parisian boulevard at night, 1889, elegant couple in evening dress under glowing gas lamps, wet cobblestones reflecting golden light, Haussmann architecture, intimate cinematic composition, dark gold tones, photorealistic --ar 3:2 --style raw`

### Crétacé (−65 M)
- **Hero** — `Late Cretaceous landscape 65 million years ago, herd of colossal sauropods crossing a misty primeval plain at sunrise, distant volcanic mountains, lush tree ferns and ancient conifers, dramatic god rays, warm golden haze over a dark moody palette, cinematic ultra-wide, photorealistic --ar 16:9 --style raw`
- **Card** — `Tyrannosaurus rex silhouette at golden hour in a prehistoric wetland, dramatic backlight, towering ferns, atmospheric haze, sense of awe and danger, dark cinematic tones with gold rim light, photorealistic close perspective --ar 3:2 --style raw`

### Florence 1504
- **Hero** — `Florence 1504 at golden hour, Renaissance skyline with Brunelleschi's Duomo, Arno river reflecting warm light, terracotta rooftops, Michelangelo's David being unveiled before a crowd in Piazza della Signoria, painterly cinematic realism, deep shadows and golden highlights --ar 16:9 --style raw`
- **Card** — `Renaissance artist's workshop in Florence 1504, candlelit interior, scattered pigments and sketches, an unfinished marble sculpture, warm chiaroscuro lighting, intimate and luxurious mood, dark background with golden glow, photorealistic --ar 3:2 --style raw`



## 4. Itérations & enseignements

- **Itération clé :** la version d'origine semblait complète mais affichait une page blanche hors de Claude.ai. Le diagnostic (runtime + appels IA propriétaires) a réorienté toute la Session 2 vers le **portage** plutôt que l'ajout de features.
- **Choix de robustesse :** plutôt que de dépendre entièrement d'une API, ajout d'un **moteur local** (base d'intentions paramétrée par le catalogue) — la démo reste cohérente même sans clé ni réseau.
- **Précision des prompts :** le format strict « Jour N — Titre : deux phrases » donne des itinéraires nettement plus exploitables qu'une consigne libre (conseil du sujet : « élégant » vaut mieux que « beau »).
