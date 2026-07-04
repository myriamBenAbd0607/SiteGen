// ─── QUESTIONS SPÉCIFIQUES PAR SECTEUR ────────────────────

export const SECTOR_SPECIFIC_QUESTIONS = {
  'Coiffure & beauté': {
    icon: '💇‍♀️',
    title: 'Questions pour votre salon de beauté',
    subtitle: 'Aidez-nous à créer un site qui reflète votre expertise',
    questions: [
      {
        id: 'specialite',
        question: 'Quelle est votre spécialité principale ?',
        options: [
          { id: 'coupe', label: '✂️ Coupe & coiffure', icon: '✂️' },
          { id: 'coloration', label: '🎨 Coloration & balayage', icon: '🎨' },
          { id: 'soins', label: '💆 Soins & bien-être', icon: '💆' },
          { id: 'tout', label: '🌟 Tout-en-un', icon: '🌟' }
        ]
      },
      {
        id: 'clientele',
        question: 'Quel est votre public principal ?',
        options: [
          { id: 'femmes', label: '👩 Femmes', icon: '👩' },
          { id: 'hommes', label: '👨 Hommes', icon: '👨' },
          { id: 'mixte', label: '👫 Mixte', icon: '👫' },
          { id: 'premium', label: '💎 Clientèle premium', icon: '💎' }
        ]
      },
      {
        id: 'ambiance_salon',
        question: 'Quelle ambiance souhaitez-vous pour votre salon ?',
        options: [
          { id: 'luxe', label: '✨ Luxueux & Chic', icon: '✨' },
          { id: 'cosy', label: '🛋️ Cosy & Confortable', icon: '🛋️' },
          { id: 'moderne', label: '🏙️ Moderne & Dynamique', icon: '🏙️' },
          { id: 'nature', label: '🌿 Naturel & Zen', icon: '🌿' }
        ]
      },
      {
        id: 'services_phare',
        question: 'Quel est votre service le plus demandé ?',
        options: [
          { id: 'coupe_phare', label: '✂️ Coupe tendance', icon: '✂️' },
          { id: 'coloration_phare', label: '🎨 Coloration créative', icon: '🎨' },
          { id: 'coiffage', label: '💄 Coiffage & maquillage', icon: '💄' },
          { id: 'soin_phare', label: '💆 Soin capillaire', icon: '💆' }
        ]
      },
      {
        id: 'prix_salon',
        question: 'Quelle est votre gamme de prix ?',
        options: [
          { id: 'economique', label: '💰 Économique', icon: '💰' },
          { id: 'moyen', label: '💵 Moyenne gamme', icon: '💵' },
          { id: 'premium_salon', label: '💎 Premium', icon: '💎' },
          { id: 'luxe_salon', label: '👑 Luxe', icon: '👑' }
        ]
      }
    ]
  },

  'Restaurant & café': {
    icon: '🍽️',
    title: 'Questions pour votre restaurant',
    subtitle: 'Aidez-nous à créer un site qui donne faim',
    questions: [
      {
        id: 'type_cuisine',
        question: 'Quel type de cuisine proposez-vous ?',
        options: [
          { id: 'gastronomique', label: '🍷 Gastronomique', icon: '🍷' },
          { id: 'traditionnel', label: '🍲 Traditionnel', icon: '🍲' },
          { id: 'fusion', label: '🍣 Fusion & Moderne', icon: '🍣' },
          { id: 'fast', label: '🍔 Fast-food', icon: '🍔' }
        ]
      },
      {
        id: 'ambiance_resto',
        question: 'Quelle ambiance pour votre restaurant ?',
        options: [
          { id: 'chic', label: '🕯️ Chic & Élégant', icon: '🕯️' },
          { id: 'convivial', label: '🍷 Convivial & Chaleureux', icon: '🍷' },
          { id: 'moderne_resto', label: '🏙️ Moderne & Branché', icon: '🏙️' },
          { id: 'intime', label: '🌹 Intime & Romantique', icon: '🌹' }
        ]
      },
      {
        id: 'service_resto',
        question: 'Quel type de service proposez-vous ?',
        options: [
          { id: 'sur_place', label: '🍽️ Sur place', icon: '🍽️' },
          { id: 'emporter', label: '🥡 À emporter', icon: '🥡' },
          { id: 'livraison', label: '🚴 Livraison', icon: '🚴' },
          { id: 'tout_resto', label: '🔄 Les trois', icon: '🔄' }
        ]
      },
      {
        id: 'specialite_resto',
        question: 'Quelle est votre spécialité ?',
        options: [
          { id: 'viande', label: '🥩 Viandes', icon: '🥩' },
          { id: 'poisson', label: '🐟 Poissons & Fruits de mer', icon: '🐟' },
          { id: 'vegetarien', label: '🥗 Végétarien', icon: '🥗' },
          { id: 'dessert', label: '🍰 Desserts', icon: '🍰' }
        ]
      },
      {
        id: 'prix_resto',
        question: 'Quelle est votre fourchette de prix ?',
        options: [
          { id: 'economique_resto', label: '💰 €', icon: '💰' },
          { id: 'moyen_resto', label: '💵 €€', icon: '💵' },
          { id: 'premium_resto', label: '💎 €€€', icon: '💎' },
          { id: 'luxe_resto', label: '👑 €€€€', icon: '👑' }
        ]
      }
    ]
  },

  'Médecin & santé': {
    icon: '🏥',
    title: 'Questions pour votre cabinet médical',
    subtitle: 'Aidez-nous à créer un site rassurant et professionnel',
    questions: [
      {
        id: 'specialite_med',
        question: 'Quelle est votre spécialité ?',
        options: [
          { id: 'general', label: '🩺 Médecine générale', icon: '🩺' },
          { id: 'specialiste', label: '🔬 Médecine spécialisée', icon: '🔬' },
          { id: 'chirurgie', label: '🏥 Chirurgie', icon: '🏥' },
          { id: 'esthetique', label: '✨ Médecine esthétique', icon: '✨' }
        ]
      },
      {
        id: 'public_med',
        question: 'Quel est votre public principal ?',
        options: [
          { id: 'enfants', label: '👶 Enfants', icon: '👶' },
          { id: 'adultes', label: '🧑 Adultes', icon: '🧑' },
          { id: 'seniors', label: '👴 Seniors', icon: '👴' },
          { id: 'tous', label: '👨‍👩‍👧‍👦 Tous âges', icon: '👨‍👩‍👧‍👦' }
        ]
      },
      {
        id: 'valeur_med',
        question: 'Quelle valeur souhaitez-vous transmettre ?',
        options: [
          { id: 'confiance', label: '🤝 Confiance', icon: '🤝' },
          { id: 'expertise', label: '🎓 Expertise', icon: '🎓' },
          { id: 'humanite', label: '❤️ Humanité', icon: '❤️' },
          { id: 'innovation', label: '💡 Innovation', icon: '💡' }
        ]
      },
      {
        id: 'urgence',
        question: 'Proposez-vous des consultations d\'urgence ?',
        options: [
          { id: 'oui_urgence', label: '✅ Oui', icon: '✅' },
          { id: 'non_urgence', label: '❌ Non, sur rendez-vous', icon: '❌' }
        ]
      },
      {
        id: 'teleconsultation',
        question: 'Proposez-vous la téléconsultation ?',
        options: [
          { id: 'oui_tel', label: '✅ Oui', icon: '✅' },
          { id: 'non_tel', label: '❌ Non', icon: '❌' }
        ]
      }
    ]
  },

  'Artisan & réparation': {
    icon: '🔧',
    title: 'Questions pour votre atelier',
    subtitle: 'Aidez-nous à créer un site qui met en valeur votre savoir-faire',
    questions: [
      {
        id: 'metier',
        question: 'Quel est votre métier principal ?',
        options: [
          { id: 'plomberie', label: '🔧 Plomberie', icon: '🔧' },
          { id: 'electricite', label: '⚡ Électricité', icon: '⚡' },
          { id: 'menuiserie', label: '🪵 Menuiserie', icon: '🪵' },
          { id: 'general_artisan', label: '🔨 Multiservices', icon: '🔨' }
        ]
      },
      {
        id: 'depannage',
        question: 'Proposez-vous des services de dépannage ?',
        options: [
          { id: 'oui_dep', label: '✅ Dépannage 24/7', icon: '✅' },
          { id: 'non_dep', label: '❌ Uniquement sur devis', icon: '❌' }
        ]
      },
      {
        id: 'garantie',
        question: 'Proposez-vous une garantie sur vos travaux ?',
        options: [
          { id: 'oui_gar', label: '✅ Oui, garantie 2 ans', icon: '✅' },
          { id: 'non_gar', label: '❌ Non', icon: '❌' }
        ]
      },
      {
        id: 'deplacement',
        question: 'Effectuez-vous des déplacements ?',
        options: [
          { id: 'oui_dep', label: '✅ Oui, à domicile', icon: '✅' },
          { id: 'non_dep', label: '❌ Non, en atelier', icon: '❌' }
        ]
      },
      {
        id: 'urgence_artisan',
        question: 'Proposez-vous un service d\'urgence ?',
        options: [
          { id: 'oui_urgence_art', label: '✅ Oui, 24h/24', icon: '✅' },
          { id: 'non_urgence_art', label: '❌ Non', icon: '❌' }
        ]
      }
    ]
  },

  'Commerce & épicerie': {
    icon: '🛒',
    title: 'Questions pour votre commerce',
    subtitle: 'Aidez-nous à créer un site qui donne envie d\'acheter',
    questions: [
      {
        id: 'type_produit',
        question: 'Quel est votre produit principal ?',
        options: [
          { id: 'alimentaire', label: '🥫 Épicerie fine', icon: '🥫' },
          { id: 'bio', label: '🌿 Bio & Naturel', icon: '🌿' },
          { id: 'local', label: '🏪 Produits locaux', icon: '🏪' },
          { id: 'general_com', label: '🏬 Commerce général', icon: '🏬' }
        ]
      },
      {
        id: 'vente_en_ligne',
        question: 'Vendez-vous en ligne ?',
        options: [
          { id: 'oui_vl', label: '✅ Oui, avec livraison', icon: '✅' },
          { id: 'non_vl', label: '❌ Uniquement en magasin', icon: '❌' }
        ]
      },
      {
        id: 'livraison_com',
        question: 'Proposez-vous la livraison ?',
        options: [
          { id: 'oui_livraison', label: '✅ Oui', icon: '✅' },
          { id: 'non_livraison', label: '❌ Non', icon: '❌' }
        ]
      },
      {
        id: 'click_collect',
        question: 'Proposez-vous le click & collect ?',
        options: [
          { id: 'oui_click', label: '✅ Oui', icon: '✅' },
          { id: 'non_click', label: '❌ Non', icon: '❌' }
        ]
      },
      {
        id: 'fidelisation',
        question: 'Avez-vous un programme de fidélisation ?',
        options: [
          { id: 'oui_fidel', label: '✅ Oui', icon: '✅' },
          { id: 'non_fidel', label: '❌ Non', icon: '❌' }
        ]
      }
    ]
  },

  'Autre': {
    icon: '🎯',
    title: 'Questions pour votre activité',
    subtitle: 'Aidez-nous à mieux comprendre votre activité',
    questions: [
      {
        id: 'secteur_autre',
        question: 'Pouvez-vous préciser votre secteur d\'activité ?',
        options: [
          { id: 'service', label: '📋 Services', icon: '📋' },
          { id: 'conseil', label: '💡 Conseil', icon: '💡' },
          { id: 'formation', label: '🎓 Formation', icon: '🎓' },
          { id: 'autre_secteur', label: '📌 Autre', icon: '📌' }
        ]
      },
      {
        id: 'public_autre',
        question: 'Qui sont vos clients ?',
        options: [
          { id: 'particuliers_autre', label: '👤 Particuliers', icon: '👤' },
          { id: 'pro_autre', label: '🏢 Professionnels', icon: '🏢' },
          { id: 'mixte_autre', label: '🔄 Mixte', icon: '🔄' }
        ]
      },
      {
        id: 'objectif_autre',
        question: 'Quel est votre objectif principal ?',
        options: [
          { id: 'acquisition', label: '📈 Acquisition de clients', icon: '📈' },
          { id: 'fidelisation_autre', label: '❤️ Fidélisation', icon: '❤️' },
          { id: 'notoriete', label: '🌟 Notoriété', icon: '🌟' },
          { id: 'vente_autre', label: '💰 Vente', icon: '💰' }
        ]
      }
    ]
  }
}

// ─── OPTIONS PAR DÉFAUT ────────────────────────────────────
export const DEFAULT_QUESTIONS = {
  icon: '🎯',
  title: 'Questions pour votre activité',
  subtitle: 'Aidez-nous à créer un site qui vous correspond',
  questions: [
    {
      id: 'activite',
      question: 'Quel est votre cœur d\'activité ?',
      options: [
        { id: 'service_defaut', label: '📋 Service', icon: '📋' },
        { id: 'produit_defaut', label: '📦 Produit', icon: '📦' },
        { id: 'conseil_defaut', label: '💡 Conseil', icon: '💡' },
        { id: 'autre_defaut', label: '📌 Autre', icon: '📌' }
      ]
    },
    {
      id: 'public_defaut',
      question: 'Qui sont vos clients ?',
      options: [
        { id: 'particuliers_defaut', label: '👤 Particuliers', icon: '👤' },
        { id: 'pro_defaut', label: '🏢 Professionnels', icon: '🏢' },
        { id: 'mixte_defaut', label: '🔄 Mixte', icon: '🔄' }
      ]
    },
    {
      id: 'objectif_defaut',
      question: 'Quel est votre objectif principal ?',
      options: [
        { id: 'acquisition_defaut', label: '📈 Acquisition de clients', icon: '📈' },
        { id: 'fidelisation_defaut', label: '❤️ Fidélisation', icon: '❤️' },
        { id: 'notoriete_defaut', label: '🌟 Notoriété', icon: '🌟' },
        { id: 'vente_defaut', label: '💰 Vente', icon: '💰' }
      ]
    }
  ]
}