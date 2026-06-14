/* ============================================================
   TimeTravel Agency — data.js
   Source de vérité unique : catalogue, quiz, prompts IA,
   base de connaissances du mode local, textes de secours.
   Tous les modules (chat, quiz, itinéraires, réservation)
   lisent ces données — aucune incohérence possible.
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};

  /* ---------- Catalogue ---------- */
  var DESTS = {
    paris: {
      key: 'paris', label: 'Paris 1889', labelLong: 'Paris 1889',
      year: 1889, yearLabel: '1889', epoque: 'Mai 1889',
      days: 4, duree: '4 jours', prixN: 12400, prix: '12 400 €',
      risque: 'faible', risqueLabel: 'Faible',
      pitch: "Paris 1889, c'est la Belle Époque à son apogée : l'Exposition Universelle bat son plein, la tour de M. Eiffel vient d'ouvrir et le Tout-Paris hésite entre scandale et émerveillement. Quatre jours, 12 400 € par personne, risque paradoxal faible. Tenue de soirée fournie, souvenirs garantis."
    },
    cretace: {
      key: 'cretace', label: 'le Crétacé (−65M)', labelLong: 'Le Crétacé',
      year: -65000000, yearLabel: '−65 000 000', epoque: 'Maastrichtien',
      days: 3, duree: '3 jours', prixN: 24800, prix: '24 800 €',
      risque: 'élevé', risqueLabel: 'Élevé · escorte de stase',
      pitch: "Le Crétacé est notre expédition la plus spectaculaire : les derniers géants de la Terre, observés depuis nos plateformes de stase, et un ciel nocturne que personne n'a revu depuis 65 millions d'années. Trois jours, 24 800 € par personne, escorte de stase permanente. Le safari ultime, en toute sécurité."
    },
    florence: {
      key: 'florence', label: 'Florence 1504', labelLong: 'Florence 1504',
      year: 1504, yearLabel: '1504', epoque: 'Septembre 1504',
      days: 4, duree: '4 jours', prixN: 14900, prix: '14 900 €',
      risque: 'modéré', risqueLabel: 'Modéré',
      pitch: "Florence 1504, c'est la Renaissance à l'instant exact où elle bascule dans la légende : le David vient d'être dévoilé, Léonard remplit ses carnets, la ville entière bruisse de génie. Quatre jours, 14 900 € par personne, risque modéré. Étoffes toscanes et lettre d'introduction des Médicis incluses."
    }
  };

  var YEARS = { home: 2026, reserver: 2026, paris: 1889, cretace: -65000000, florence: 1504 };

  var LABELS = { paris: 'Paris 1889', cretace: 'Le Crétacé', florence: 'Florence 1504' };

  var TITLES = {
    home: 'TimeTravel Agency — Voyages temporels de luxe',
    paris: 'Paris 1889 — TimeTravel Agency',
    cretace: 'Le Crétacé — TimeTravel Agency',
    florence: 'Florence 1504 — TimeTravel Agency',
    reserver: 'Réservation — TimeTravel Agency'
  };

  /* ---------- Quiz « L'oracle de Chronos » ---------- */
  var QUIZ = [
    { t: "Quel type d'expérience recherchez-vous ?", o: [["Culturelle et artistique", 'florence'], ["Aventure et nature sauvage", 'cretace'], ["Élégance et mondanités", 'paris']] },
    { t: "Votre rapport au confort ?", o: [["Grand hôtel et champagne", 'paris'], ["Bivouac d'exception, frisson garanti", 'cretace'], ["Palazzo et banquets", 'florence']] },
    { t: "Vous préférez…", o: [["L'effervescence urbaine", 'paris'], ["La nature sans aucun témoin", 'cretace'], ["L'art et l'architecture", 'florence']] },
    { t: "Le souvenir idéal à rapporter ?", o: [["Une vue depuis la tour Eiffel toute neuve", 'paris'], ["Le regard d'un T. rex à 400 mètres", 'cretace'], ["Le David dévoilé sous vos yeux", 'florence']] }
  ];

  /* ---------- Centres d'intérêt (itinéraires) ---------- */
  var CHIPS = {
    paris: ['Expositions & pavillons', 'Gastronomie Belle Époque', 'Cabarets & mondanités', 'Sciences & inventions', 'Flânerie haussmannienne'],
    cretace: ['Grands sauropodes', 'Canopée & flore primitive', "Affût du T. rex", 'Lagunes & ptérosaures', 'Bivouac sous les étoiles'],
    florence: ['Ateliers des maîtres', 'Architecture & Duomo', 'Banquets toscans', 'Intrigues des Médicis', 'Collections & galeries']
  };

  /* ---------- Prompts IA (Mistral) ---------- */
  var SYS = "Tu es Chronos, concierge virtuel de TimeTravel Agency, agence de voyage temporel de luxe (fictive, projet étudiant M1/M2). Destinations au départ du terminal de Paris, 2026 : 1) Paris 1889, Belle Époque, Exposition Universelle, tour Eiffel toute neuve — 4 jours, 12 400 € par personne, risque paradoxal faible. 2) Le Crétacé, −65 millions d'années, dinosaures, nature primitive, escorte de stase obligatoire — 3 jours, 24 800 €, risque élevé. 3) Florence 1504, Renaissance, dévoilement du David, atelier de Léonard — 4 jours, 14 900 €, risque modéré. Inclus : champ de stase certifié, garde-robe et monnaie d'époque, assurance paradoxe, chrononaute accompagnateur. Classe Première Temporelle : +45 %. Ton : professionnel, chaleureux, passionné d'histoire, une pointe d'humour subtil sur les paradoxes. Réponds toujours en français, en 50 à 100 mots, sans markdown ni listes à puces. Invente des détails crédibles et cohérents si besoin. Quand c'est pertinent, recommande une destination et invite à utiliser la page Réservation.";

  function buildQuizPrompt(answers, destLabel) {
    return "Tu es Chronos, concierge de TimeTravel Agency, agence de voyage temporel de luxe (fictive). Un client a répondu à notre quiz : " + answers.join(' · ') +
      ". Sa destination recommandée est " + destLabel +
      ". En 55 à 75 mots, en français, ton luxe sobre et chaleureux, explique-lui pourquoi cette époque est faite pour lui, en t'appuyant sur ses réponses. Commence directement, sans markdown ni guillemets.";
  }

  function buildItinPrompt(dest, selLabels) {
    var d = DESTS[dest];
    var sel = selLabels.length ? selLabels.join(', ') : "découverte générale de l'époque";
    return "Tu es Chronos, concierge de TimeTravel Agency, agence de voyage temporel de luxe (fictive). Compose un itinéraire de " + d.days +
      " jours à destination de " + d.label + " pour un voyageur intéressé par : " + sel +
      ". Réponds en français, sans markdown, format strict : une ligne par jour sous la forme « Jour N — Titre évocateur : deux phrases élégantes et concrètes. » Reste crédible historiquement (ou scientifiquement pour le Crétacé), ton luxe sobre, aucune introduction ni conclusion.";
  }

  /* ---------- Chat : accueil & suggestions ---------- */
  var CHAT_WELCOME = "Bienvenue chez TimeTravel Agency. Je suis Chronos, votre concierge temporel. Une époque vous fait rêver — ou hésitez-vous encore ?";

  var CHAT_SUGGESTIONS = [
    'Quelle destination pour une lune de miel ?',
    'Le Crétacé est-il vraiment sûr ?',
    'Que comprend le prix ?'
  ];

  var CHAT_LOCAL_HINT = "\n\n(Je vous réponds en mode local. Pour activer l'IA générative Mistral, ajoutez votre clé gratuite via l'icône ⚙ ci-dessus.)";

  /* ---------- Textes de secours : quiz ---------- */
  var FALLBACK_QUIZ = {
    paris: "Votre goût pour l'élégance, l'effervescence et la modernité naissante désigne Paris 1889 : la Belle Époque vous attend, entre la tour de M. Eiffel et les soirées de l'Exposition Universelle.",
    cretace: "Votre âme d'exploration réclame l'origine du monde : le Crétacé vous offrira une nature sans témoin, des géants au lever du jour et un ciel que personne n'a revu depuis 65 millions d'années.",
    florence: "Votre sensibilité pour l'art et la beauté vous destine à Florence 1504 : le David vient d'être dévoilé, les ateliers bruissent de génie, la Renaissance vous ouvre ses portes."
  };

  /* ---------- Textes de secours : itinéraires ----------
     Le mode local compose un programme jour par jour : on part
     d'une trame de base, puis chaque centre d'intérêt choisi
     remplace une journée par sa variante thématique. */
  var FALLBACK_ITIN = {
    paris: {
      base: [
        "Jour 1 — L'arrivée par la porte de service de l'Histoire : Translation en douceur, vestiaire Belle Époque et première flânerie le long de la Seine illuminée. Le soir, dîner d'acclimatation sous les arcades du Palais-Royal.",
        "Jour 2 — L'Exposition Universelle : Une journée entière entre les pavillons des nations et les machines qui annoncent le siècle à venir. Champagne au premier étage de la tour de M. Eiffel au coucher du soleil.",
        "Jour 3 — Paris des artistes : Montmartre, ses ateliers et ses guinguettes, avant une soirée de cancan et de conversations avec le Tout-Paris. Votre chrononaute veille à la modération temporelle.",
        "Jour 4 — Adieux à la Belle Époque : Rien ne quitte l'époque, tout se savoure — promenade au jardin du Luxembourg et translation de retour avant le crépuscule."
      ],
      byChip: {
        'Expositions & pavillons': "Jour 0 — Le tour du monde en un jardin : Des pavillons des nations au palais des Beaux-Arts, l'Exposition se déplie comme un atlas vivant. Votre guide vous souffle les anecdotes que les journaux n'imprimeront jamais.",
        'Gastronomie Belle Époque': "Jour 0 — Le ventre de Paris : Déjeuner aux Halles entre montagnes d'huîtres et primeurs, puis dîner en cabinet particulier où le service est une chorégraphie. Le champagne, lui, ne connaît pas d'époque.",
        'Cabarets & mondanités': "Jour 0 — La nuit du Tout-Paris : Cancan étourdissant, loges dorées et conversations avec des inconnus bientôt illustres. L'absinthe se déguste avec modération — le protocole y veille.",
        'Sciences & inventions': "Jour 0 — Le siècle des machines : La Galerie des Machines gronde de pistons et d'avenir, les démonstrations d'électricité tiennent du prodige. Vous verrez le futur avec les yeux de 1889.",
        'Flânerie haussmannienne': "Jour 0 — Boulevards et passages couverts : Grands magasins, passages vitrés et terrasses où Paris se regarde vivre. Une leçon d'élégance à ciel ouvert."
      }
    },
    cretace: {
      base: [
        "Jour 1 — La traversée des soixante-cinq millions d'années : Translation longue distance, briefing de stase et installation au campement suspendu. Au crépuscule, premiers chants de ptérosaures sur la lagune.",
        "Jour 2 — Le royaume des géants : Journée d'observation au cœur des troupeaux de sauropodes, sous escorte de stase permanente. Le sol tremble — vous, jamais.",
        "Jour 3 — Le dernier matin du monde : Aube sur la plaine, affût silencieux et adieux aux derniers seigneurs de la Terre avant la translation de retour. Personne n'en revient inchangé."
      ],
      byChip: {
        'Grands sauropodes': "Jour 0 — Les colosses de la plaine : Un troupeau d'alamosaures traverse la brume du matin, à portée de regard et hors de portée du temps. Sur la plateforme, le silence est total.",
        'Canopée & flore primitive': "Jour 0 — Sous la canopée originelle : Fougères arborescentes, conifères géants et toutes premières fleurs de l'histoire du monde. L'herbier restera dans vos souvenirs — protocole oblige.",
        "Affût du T. rex": "Jour 0 — L'affût du tyran : Quatre cents mètres, un champ de stase et le Tyrannosaurus rex en chasse dans la lumière rasante. Votre rythme cardiaque, lui, n'est couvert par aucune assurance.",
        'Lagunes & ptérosaures': "Jour 0 — Les seigneurs du ciel : Croisière de stase sur la lagune pendant que les ptérosaures pêchent en rase-mottes. Au soir, leurs silhouettes barrent un soleil énorme.",
        'Bivouac sous les étoiles': "Jour 0 — Nuit primitive : Un ciel sans aucune lumière humaine, la Voie lactée telle que personne ne la reverra. Le campement de stase veille ; vous, vous rêvez."
      }
    },
    florence: {
      base: [
        "Jour 1 — L'entrée dans la Renaissance : Translation discrète, étoffes toscanes et lettre d'introduction des Médicis remise en main propre. Première promenade au fil de l'Arno à l'heure dorée.",
        "Jour 2 — Le dévoilement du David : Place de la Seigneurie, la foule retient son souffle devant le colosse de Michel-Ange. L'après-midi, ateliers des maîtres et leçons de perspective.",
        "Jour 3 — Génie et intrigues : Matinée dans l'atelier de Léonard — carnets, pigments, machines volantes — puis banquet aux chandelles dans un palazzo ami. Écoutez plus que vous ne parlez : consigne de la maison.",
        "Jour 4 — Adieux florentins : Marché aux étoffes, coupole de Brunelleschi au lever du jour et dernière vue depuis San Miniato avant la translation de retour."
      ],
      byChip: {
        'Ateliers des maîtres': "Jour 0 — La main des maîtres : Pigments broyés, esquisses et secrets d'atelier chez les héritiers de Verrocchio. Vous repartirez avec un regard neuf — c'est le seul souvenir autorisé.",
        'Architecture & Duomo': "Jour 0 — La leçon de Brunelleschi : Ascension de la coupole à l'aube, quand Florence s'éveille en contrebas. Le génie se mesure ici en briques et en audace.",
        'Banquets toscans': "Jour 0 — La table des Médicis : Vins des collines, gibier aux épices et musique de cour jusque tard dans la nuit. Les intrigues s'y dégustent aussi — avec discrétion.",
        'Intrigues des Médicis': "Jour 0 — Le jeu des puissants : Antichambres, messes basses et alliances qui se nouent le temps d'une promenade. Votre chrononaute vous souffle qui regarde qui.",
        'Collections & galeries': "Jour 0 — Cabinets de merveilles : Manuscrits enluminés, marbres antiques et collections privées ouvertes par faveur. La Renaissance se visite ici de l'intérieur."
      }
    }
  };

  /* ---------- Mode local : détection de destination ---------- */
  var DEST_KEYWORDS = {
    paris: ['paris', 'eiffel', '1889', 'belle epoque', 'exposition universelle', 'exposition', 'cabaret', 'cabarets', 'montmartre', 'haussmann', 'cancan'],
    cretace: ['cretace', 'dinosaure', 'dinosaures', 'dino', 'dinos', 't rex', 'trex', 'tyrannosaure', 'prehistoire', 'prehistorique', 'jurassique', '65 millions', '65000000', 'sauropode', 'sauropodes', 'pterosaure', 'pterosaures', 'maastrichtien', 'safari'],
    florence: ['florence', 'renaissance', 'david', 'leonard', 'vinci', 'michel ange', 'michelange', 'medicis', '1504', 'toscane', 'duomo', 'italie', 'palazzo']
  };

  /* ---------- Mode local : intentions ----------
     Chaque intention = mots-clés (sans accents) + réponse rédigée
     dans la voix de Chronos. Les phrases comptent double, les mots
     simples comptent un point. `d` est la destination détectée
     (objet DESTS) ou null. */
  function allPrices() {
    return "Paris 1889 est à " + DESTS.paris.prix + " par personne pour " + DESTS.paris.duree +
      ", Florence 1504 à " + DESTS.florence.prix + " pour " + DESTS.florence.duree +
      ", et l'expédition Crétacé à " + DESTS.cretace.prix + " pour " + DESTS.cretace.duree + ", escorte de stase comprise.";
  }

  var INTENTS = [
    {
      id: 'salutation',
      kw: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'hey', 'bonjours'],
      answer: function (d) {
        return "Bienvenue au terminal de Paris, 2026. Je suis Chronos, concierge temporel de la maison. Trois époques sont au départ : Paris 1889, le Crétacé et Florence 1504. Dites-moi ce qui vous fait rêver — l'élégance, le vertige des origines ou le génie de la Renaissance — et je vous guiderai.";
      }
    },
    {
      id: 'merci',
      kw: ['merci', 'parfait', 'genial', 'super', 'formidable', 'top'],
      answer: function (d) {
        return "C'est un plaisir — le temps me laisse rarement l'occasion de m'ennuyer, mais jamais celle de mal servir. Si l'envie vous prend de franchir le pas, la page Réservation confirme votre traversée en quelques instants. Je reste à votre disposition, à toutes les époques.";
      }
    },
    {
      id: 'prix',
      kw: ['prix', 'tarif', 'tarifs', 'cout', 'coute', 'coutent', 'combien', 'euros', 'cher', 'chere', 'budget'],
      answer: function (d) {
        if (d) {
          return d.labelLong + " est proposé à " + d.prix + " par personne pour " + d.duree +
            " — champ de stase certifié, garde-robe et monnaie d'époque, assurance paradoxe et chrononaute accompagnateur inclus. La Première Temporelle (+45 %) ajoute une suite de stase privée. La page Réservation calcule votre total en direct.";
        }
        return allPrices() + " Tout est inclus : stase, garde-robe d'époque, assurance paradoxe, chrononaute. Comptez +45 % pour la Première Temporelle et sa suite de stase privée.";
      }
    },
    {
      id: 'paiement',
      kw: ['payer', 'paiement', 'paiements', 'acompte', 'echeancier', 'carte bancaire', 'virement', 'reglement', 'regler', 'versement', 'arrhes', 'facture', 'mode de paiement'],
      answer: function (d) {
        return "Le règlement est limpide : un acompte de 30 % confirme votre dossier, le solde est dû trente jours avant le départ. Nous acceptons la carte bancaire et le virement, et un échéancier sans frais est possible sur les expéditions longues. Tout se finalise depuis la page Réservation, où votre total" + (d ? " pour " + d.labelLong : "") + " s'affiche en direct.";
      }
    },
    {
      id: 'duree',
      kw: ['duree', 'durees', 'longtemps', 'dure', 'durent', 'combien de temps', 'temps sur place', 'combien de jours', 'duree du sejour', 'nombre de jours'],
      answer: function (d) {
        if (d) {
          return d.labelLong + " se déguste en " + d.duree + " — c'est le tempo idéal pour s'immerger sans éveiller les soupçons de l'époque. Le départ et le retour se font le même jour de 2026 : le temps du voyage ne vous est jamais décompté. Élégant, n'est-ce pas ?";
        }
        return "Comptez " + DESTS.paris.duree + " pour Paris 1889, " + DESTS.cretace.duree + " pour le Crétacé et " + DESTS.florence.duree + " pour Florence 1504. Et grâce à la translation temporelle, vous revenez le jour même de votre départ en 2026 — vos congés n'en sauront rien.";
      }
    },
    {
      id: 'securite',
      kw: ['securite', 'danger', 'dangereux', 'dangereuse', 'risque', 'risques', 'risquee', 'peur', 'paradoxe', 'paradoxes', 'accident', 'proteger', 'protege', 'proteges', 'securise', 'vraiment sur', 'est il sur', 'est ce sur', 'sans risque', 'sain et sauf'],
      answer: function (d) {
        if (d && d.key === 'cretace') {
          return "Question légitime — on ne rend pas visite au Tyrannosaurus rex à la légère. Le risque paradoxal du Crétacé est classé élevé, c'est pourquoi l'escorte de stase y est obligatoire et permanente : un champ d'invisibilité totale, certifié, que rien n'a jamais traversé. En vingt ans d'expéditions, notre seul incident reste un chapeau emporté par le vent.";
        }
        if (d) {
          return d.labelLong + " présente un risque paradoxal " + d.risque + ". Champ de stase certifié, protocole strict de non-interférence, assurance paradoxe et chrononaute à vos côtés : votre passage ne laisse aucune trace dans la ligne temporelle — et la ligne temporelle n'en laisse aucune sur vous.";
        }
        return "Toutes nos traversées s'effectuent sous champ de stase certifié, avec assurance paradoxe et chrononaute accompagnateur. Le risque est faible à Paris 1889, modéré à Florence 1504, élevé au Crétacé — d'où l'escorte de stase permanente là-bas. Notre devise : ne rien changer au passé, sauf vos souvenirs.";
      }
    },
    {
      id: 'inclus',
      kw: ['inclus', 'incluse', 'compris', 'comprend', 'comprends', 'prestation', 'prestations', 'comprend le prix', 'que comprend', 'assurance', 'inclut', 'fourni', 'fournie', 'fournis', 'transport', 'transfert', 'transferts', 'hebergement', 'heberge', 'repas', 'nourriture', 'prevu', 'quoi de prevu'],
      answer: function (d) {
        return "Chaque traversée comprend le champ de stase certifié, la garde-robe et la monnaie d'époque, les usages et le vocabulaire essentiels (briefing avant départ), l'assurance paradoxe et votre chrononaute accompagnateur" +
          (d && d.key === 'cretace' ? " — renforcé, pour le Crétacé, d'une escorte de stase permanente" : "") +
          ". La Première Temporelle ajoute une suite de stase privée et un départ prioritaire, pour 45 % de plus. Il ne vous reste qu'à apporter votre curiosité.";
      }
    },
    {
      id: 'reservation',
      kw: ['reserver', 'reservation', 'reserve', 'booking', 'acompte', 'annuler', 'annulation', 'confirmer', 'dossier', 'disponibilite', 'disponibilites', 'place', 'places'],
      answer: function (d) {
        return "Rien de plus simple : la page Réservation vous laisse choisir " + (d ? d.labelLong : "votre époque") + ", la date de départ (à partir du 15 juin 2026), le nombre de voyageurs et votre classe. La validation est immédiate, un numéro de dossier vous est remis, et votre chrononaute référent vous contacte sous 24 heures pour la préparation d'époque. Annulation libre jusqu'à 72 heures du départ — le temps est de notre côté.";
      }
    },
    {
      id: 'classe',
      kw: ['premiere', 'classe', 'classes', 'temporelle', 'suite', 'surclassement', 'upgrade', 'decouverte', 'difference entre'],
      answer: function (d) {
        return "Deux classes au choix. La Classe Découverte, au tarif standard, comprend déjà tout : stase, garde-robe, assurance paradoxe, chrononaute. La Première Temporelle, à +45 %, y ajoute une suite de stase privée, un départ prioritaire et quelques attentions que je laisse à la surprise — disons que le champagne y est servi à la température exacte de votre époque préférée.";
      }
    },
    {
      id: 'lune-de-miel',
      kw: ['lune de miel', 'romantique', 'couple', 'amoureux', 'mariage', 'noces', 'fiancee', 'fiance', 'demande en mariage', 'anniversaire de mariage', 'saint valentin'],
      answer: function (d) {
        if (d && d.key === 'cretace') {
          return "Une lune de miel au Crétacé ? J'admire — rien ne soude un couple comme un T. rex à quatre cents mètres. Mais si vous m'autorisez une confidence de concierge : Paris 1889 reste notre destination la plus demandée des jeunes mariés. Champagne au premier étage de la tour Eiffel, valse à l'Exposition… Le grand frisson peut attendre le premier anniversaire.";
        }
        return "Pour une lune de miel, je conseille sans hésiter Paris 1889 : champagne au premier étage d'une tour Eiffel toute neuve, valses à l'Exposition Universelle, nuits de la Belle Époque — " + DESTS.paris.prix + " par personne, 4 jours. Florence 1504 séduira les couples d'esthètes : l'Arno à l'heure dorée vaut toutes les déclarations. Voulez-vous que la page Réservation vous tende les bras ?";
      }
    },
    {
      id: 'famille',
      kw: ['famille', 'enfant', 'enfants', 'fils', 'fille', 'ado', 'adolescent', 'adolescents', 'quel age', 'age minimum', 'familial'],
      answer: function (d) {
        return "Nos traversées familiales sont possibles dès 12 ans — l'assurance paradoxe l'exige, les enfants ayant un talent certain pour interroger les mauvaises personnes aux mauvaises époques. Le Crétacé demande 16 ans révolus, escorte de stase oblige. Paris 1889 et Florence 1504 émerveillent les jeunes esprits : machines, dinosaures de papier, ateliers d'artistes. Le passé est le plus beau des terrains de jeu — bien encadré.";
      }
    },
    {
      id: 'meteo',
      kw: ['meteo', 'climat', 'temperature', 'temperatures', 'chaud', 'froid', 'pluie', 'pleuvoir', 'saison', 'soleil', 'neige', 'quel temps', 'beau temps', 'degres', 'tropical', 'humidite', 'temps qu il fait', 'fait il chaud', 'fait il froid'],
      answer: function (d) {
        if (d && d.key === 'cretace') {
          return "Le Maastrichtien est généreux : comptez 25 à 30 °C, une humidité tropicale et des ciels d'une pureté inconnue depuis. Nos plateformes de stase sont climatisées, votre équipement est fourni. Prévoyez simplement de bons yeux — les couchers de soleil du Crétacé n'ont jamais été égalés.";
        }
        if (d && d.key === 'florence') {
          return "Septembre 1504 offre à Florence sa plus belle lumière : 22 à 26 °C, des soirées douces sur l'Arno et cette clarté toscane qui a fait école chez les peintres. Les étoffes fournies sont coupées pour la saison. Le seul orage à craindre est politique — votre chrononaute vous en tiendra éloigné.";
        }
        if (d && d.key === 'paris') {
          return "Mai 1889 à Paris est un enchantement : 15 à 20 °C, marronniers en fleurs et lumière dorée sur l'Exposition Universelle. Les soirées sont fraîches, mais la garde-robe Belle Époque fournie y pourvoit — un châle de soie n'a jamais nui à l'élégance d'un boulevard.";
        }
        return "Mai 1889 à Paris est délicieux : 15 à 20 °C, marronniers en fleurs et lumière dorée sur l'Exposition. Florence en septembre 1504 frôle les 25 °C, et le Crétacé campe en climat tropical, 30 °C au cœur du jour. Dans tous les cas, la garde-robe d'époque fournie est adaptée — l'élégance ne transige pas avec le confort.";
      }
    },
    {
      id: 'conseil',
      kw: ['conseil', 'conseille', 'conseilles', 'choisir', 'hesite', 'hesitation', 'recommande', 'recommandes', 'recommandation', 'laquelle', 'quelle destination', 'quelle epoque', 'indecis', 'indecise', 'que me', 'meilleure destination', 'meilleur voyage', 'idee', 'suggestion'],
      answer: function (d) {
        if (d) return d.pitch + " Souhaitez-vous que je vous parle des prix, de la sécurité ou du programme ?";
        return "Tout dépend de ce que votre cœur réclame. L'élégance, les bals et la modernité naissante ? Paris 1889. Le vertige des origines, les géants et un ciel vierge ? Le Crétacé. L'art, le génie et les intrigues de cour ? Florence 1504. Et si l'hésitation persiste, consultez l'oracle de Chronos — quatre questions, une révélation. C'est mon double mystique qui s'en charge.";
      }
    },
    {
      id: 'quiz',
      kw: ['quiz', 'oracle', 'test', 'questionnaire', 'questions pour choisir'],
      answer: function (d) {
        return "L'oracle de Chronos est notre rituel maison : quatre questions, trente secondes, et il désigne l'époque qui vous correspond — avec une justification composée sur mesure. Vous le trouverez sur la page d'accueil, bouton « Consulter l'oracle ». Les voyageurs en ressortent rarement indécis, et toujours intrigués.";
      }
    },
    {
      id: 'fonctionnement',
      kw: ['comment ca marche', 'fonctionne', 'fonctionnement', 'machine', 'technologie', 'translation', 'voyage temporel', 'voyage dans le temps', 'retour', 'revenir', 'depart', 'terminal', 'physique', 'possible'],
      answer: function (d) {
        return "Tout part de notre terminal de Paris, 2026. La translation temporelle s'effectue sous champ de stase : vous voyez l'époque, elle ne vous voit pas — sauf protocole d'immersion encadré. Garde-robe, monnaie et usages vous sont fournis avant le départ, un chrononaute vous accompagne à chaque instant, et le retour s'effectue le jour même de votre départ. Le seul décalage horaire, c'est l'émerveillement.";
      }
    },
    {
      id: 'bagages',
      kw: ['bagage', 'bagages', 'valise', 'valises', 'vetement', 'vetements', 'habit', 'habits', 'tenue', 'tenues', 'apporter', 'emporter', 'preparer', 'preparation'],
      answer: function (d) {
        return "Voyagez léger : la maison fournit la garde-robe d'époque complète" + (d ? " pour " + d.labelLong : "") + ", la monnaie locale et un briefing d'usages — votre chrononaute ajuste le moindre détail, du chapeau aux chaussures. Les objets anachroniques restent au vestiaire du terminal (oui, même votre téléphone : le passé n'a pas de réseau, et c'est très bien ainsi).";
      }
    },
    {
      id: 'pratique',
      kw: ['photo', 'photos', 'prendre des photos', 'souvenir', 'souvenirs', 'rapporter', 'ramener', 'accessible', 'accessibilite', 'fauteuil', 'fauteuil roulant', 'handicap', 'pmr', 'groupe', 'groupes', 'reduction', 'tarif de groupe'],
      answer: function (d) {
        return "Quelques précisions de la maison : les photographies sont autorisées sous protocole d'immersion (l'objectif ne quitte jamais le champ de stase), mais aucun objet d'époque ne peut être rapporté — la non-interférence est absolue, le seul souvenir permis tient dans vos yeux. Nos plateformes de stase sont accessibles aux personnes à mobilité réduite, et un tarif dégressif s'applique dès six voyageurs : demandez-le via la page Réservation.";
      }
    },
    {
      id: 'aurevoir',
      kw: ['au revoir', 'a bientot', 'bonne journee', 'bonne soiree', 'adieu', 'bye'],
      answer: function (d) {
        return "À très bientôt — dans ce siècle ou dans un autre. Quand vous serez prêt, la page Réservation vous ouvre les portes du temps, et je reste ici, à votre service, entre deux époques. Chronos ne dort jamais : c'est l'un des rares avantages de mon poste.";
      }
    }
  ];

  /* Réponses par défaut (aucune intention reconnue) — rotation */
  var DEFAULT_REPLIES = [
    "Voilà une question qui mérite mieux que ma première réponse — reformulez-la, je vous prie. En attendant, sachez que trois époques sont au départ : Paris 1889 pour l'élégance, le Crétacé pour le vertige, Florence 1504 pour le génie. Je peux vous parler des prix, de la sécurité ou des programmes.",
    "Mes archives hésitent sur ce point précis. Demandez-moi les tarifs, les durées, la sécurité paradoxale ou des conseils selon vos envies — ou laissez l'oracle de Chronos trancher en quatre questions, sur la page d'accueil. Le temps joue pour nous.",
    "Je crains de mal saisir — la faute aux interférences entre siècles, sans doute. Essayez par exemple : « Que comprend le prix ? », « Le Crétacé est-il sûr ? » ou « Quelle époque pour une lune de miel ? ». Je connais nos trois destinations mieux que ma propre horloge."
  ];

  function destPitch(d) { return d.pitch + " Puis-je vous détailler le programme, les prix ou la sécurité ?"; }

  /* ---------- Export ---------- */
  TT.data = {
    DESTS: DESTS,
    YEARS: YEARS,
    LABELS: LABELS,
    TITLES: TITLES,
    QUIZ: QUIZ,
    CHIPS: CHIPS,
    SYS: SYS,
    buildQuizPrompt: buildQuizPrompt,
    buildItinPrompt: buildItinPrompt,
    CHAT_WELCOME: CHAT_WELCOME,
    CHAT_SUGGESTIONS: CHAT_SUGGESTIONS,
    CHAT_LOCAL_HINT: CHAT_LOCAL_HINT,
    FALLBACK_QUIZ: FALLBACK_QUIZ,
    FALLBACK_ITIN: FALLBACK_ITIN,
    DEST_KEYWORDS: DEST_KEYWORDS,
    INTENTS: INTENTS,
    DEFAULT_REPLIES: DEFAULT_REPLIES,
    destPitch: destPitch
  };
})();
