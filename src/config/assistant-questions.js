// ═══════════════════════════════════════════════════════════
// ASSISTANT IA — Questions et préférences
// ═══════════════════════════════════════════════════════════

export const ASSISTANT_QUESTIONS = {
  style: {
    question: "Quel style visuel préférez-vous pour votre site ?",
    icon: "🎨",
    options: [
      { 
        id: "elegant", 
        label: "Élégant & Raffiné", 
        description: "Design épuré, typographie soignée, ambiance luxueuse",
        emoji: "✨",
        tags: ["premium", "sophisticated", "luxury"]
      },
      { 
        id: "modern", 
        label: "Moderne & Dynamique", 
        description: "Layout contemporain, couleurs vives, énergie positive",
        emoji: "🚀",
        tags: ["modern", "dynamic", "energetic"]
      },
      { 
        id: "minimal", 
        label: "Minimaliste & Clair", 
        description: "Design épuré, beaucoup d'espace, focus sur le contenu",
        emoji: "⬜",
        tags: ["minimal", "clean", "simple"]
      },
      { 
        id: "creative", 
        label: "Créatif & Original", 
        description: "Design unique, effets visuels, personnalité marquée",
        emoji: "🎭",
        tags: ["creative", "artistic", "unique"]
      }
    ]
  },

  ambiance: {
    question: "Quelle ambiance souhaitez-vous créer ?",
    icon: "🌅",
    options: [
      { 
        id: "chaleureux", 
        label: "Chaleureuse & Accueillante", 
        description: "Couleurs chaudes, photos humaines, ton amical",
        emoji: "🤗",
        tags: ["warm", "friendly", "welcoming"]
      },
      { 
        id: "professionnel", 
        label: "Professionnelle & Sérieuse", 
        description: "Design sobre, couleurs neutres, ton expert",
        emoji: "💼",
        tags: ["professional", "serious", "expert"]
      },
      { 
        id: "inspirant", 
        label: "Inspirante & Motivante", 
        description: "Images évocatrices, messages positifs, énergie",
        emoji: "🌟",
        tags: ["inspiring", "motivational", "uplifting"]
      },
      { 
        id: "intime", 
        label: "Intime & Personnelle", 
        description: "Ambiance feutrée, photos authentiques, proximité",
        emoji: "🕯️",
        tags: ["intimate", "personal", "authentic"]
      }
    ]
  },

  priorite: {
    question: "Quel est votre objectif principal ?",
    icon: "🎯",
    options: [
      { 
        id: "conversion", 
        label: "Générer des contacts", 
        description: "Maximiser les prises de contact et demandes de devis",
        emoji: "📞",
        tags: ["conversion", "leads", "contact"]
      },
      { 
        id: "branding", 
        label: "Renforcer l'image de marque", 
        description: "Mettre en valeur l'identité et le positionnement",
        emoji: "🏷️",
        tags: ["branding", "identity", "positioning"]
      },
      { 
        id: "information", 
        label: "Informer vos clients", 
        description: "Présenter clairement vos services et expertises",
        emoji: "📚",
        tags: ["information", "education", "clarity"]
      },
      { 
        id: "vente", 
        label: "Vendre en ligne", 
        description: "Optimiser le parcours d'achat et les conversions",
        emoji: "🛒",
        tags: ["sales", "ecommerce", "purchase"]
      }
    ]
  },

  ton: {
    question: "Quel ton souhaitez-vous utiliser ?",
    icon: "💬",
    options: [
      { 
        id: "formel", 
        label: "Formel & Élégant", 
        description: "Langage soutenu, vocabulaire précis, classe",
        emoji: "🎩",
        tags: ["formal", "elegant", "refined"]
      },
      { 
        id: "chaleureux", 
        label: "Chaleureux & Amical", 
        description: "Ton convivial, proche du client, accessible",
        emoji: "😊",
        tags: ["warm", "friendly", "approachable"]
      },
      { 
        id: "expert", 
        label: "Expert & Pédagogue", 
        description: "Ton de confiance, explicatif, rassurant",
        emoji: "🎓",
        tags: ["expert", "educational", "trustworthy"]
      },
      { 
        id: "audacieux", 
        label: "Audacieux & Disruptif", 
        description: "Ton provocateur, original, qui marque les esprits",
        emoji: "🔥",
        tags: ["bold", "disruptive", "memorable"]
      }
    ]
  },

  cta: {
    question: "Quelle action principale voulez-vous que vos visiteurs effectuent ?",
    icon: "⚡",
    options: [
      { 
        id: "contact", 
        label: "Me contacter", 
        description: "Formulaire de contact, téléphone, email",
        emoji: "📱",
        tags: ["contact", "reach", "connect"]
      },
      { 
        id: "devis", 
        label: "Demander un devis", 
        description: "Formulaire de demande de devis personnalisé",
        emoji: "📊",
        tags: ["quote", "estimate", "proposal"]
      },
      { 
        id: "reservation", 
        label: "Réserver un rendez-vous", 
        description: "Système de prise de rendez-vous en ligne",
        emoji: "📅",
        tags: ["booking", "appointment", "schedule"]
      },
      { 
        id: "decouvrir", 
        label: "Découvrir mes services", 
        description: "Explorer le portfolio et les offres",
        emoji: "🔍",
        tags: ["discover", "explore", "learn"]
      }
    ]
  }
}

// ─── Mapping des préférences vers les variantes ──────────
export function getVariantPreferences(preferences) {
  const variantMap = {
    // Hero
    hero: {
      elegant: 'hero-a',
      modern: 'hero-b',
      minimal: 'hero-c',
      creative: 'hero-a'
    },
    // Portfolio
    portfolio: {
      elegant: 'portfolio-a',
      modern: 'portfolio-b',
      minimal: 'portfolio-b',
      creative: 'portfolio-a'
    },
    // Footer
    footer: {
      elegant: 'footer-a',
      modern: 'footer-b',
      minimal: 'footer-b',
      creative: 'footer-a'
    }
  }

  const result = {}
  const style = preferences.style || 'modern'

  for (const [section, mapping] of Object.entries(variantMap)) {
    result[section] = mapping[style] || mapping.modern
  }

  return result
}

// ─── Génère le prompt d'influence pour le LLM ────────────
export function buildInfluencePrompt(preferences) {
  const styleMap = {
    elegant: "un design luxueux et raffiné, avec une typographie élégante et des espaces généreux",
    modern: "un design moderne et dynamique, avec des couleurs vives et des layouts innovants",
    minimal: "un design minimaliste et épuré, avec beaucoup d'espace blanc et une hiérarchie claire",
    creative: "un design créatif et original, avec des effets visuels surprenants et une personnalité forte"
  }

  const ambianceMap = {
    chaleureux: "une ambiance chaleureuse et accueillante, avec des couleurs chaudes et des photos humaines",
    professionnel: "une ambiance professionnelle et sérieuse, avec un design sobre et des couleurs neutres",
    inspirant: "une ambiance inspirante et motivante, avec des images évocatrices et des messages positifs",
    intime: "une ambiance intime et personnelle, avec des photos authentiques et une proximité réelle"
  }

  const prioriteMap = {
    conversion: "convertir les visiteurs en leads et maximiser les prises de contact",
    branding: "renforcer l'image de marque et le positionnement de l'entreprise",
    information: "informer clairement les clients sur les services et l'expertise",
    vente: "optimiser le parcours d'achat et augmenter les ventes en ligne"
  }

  const tonMap = {
    formel: "un ton formel et élégant, avec un langage soutenu et un vocabulaire précis",
    chaleureux: "un ton chaleureux et amical, avec un langage accessible et proche du client",
    expert: "un ton expert et pédagogique, avec un langage de confiance et explicatif",
    audacieux: "un ton audacieux et disruptif, avec un langage original et marquant"
  }

  const ctaMap = {
    contact: "pousser les visiteurs à contacter l'entreprise via le formulaire ou les coordonnées",
    devis: "encourager la demande de devis personnalisé",
    reservation: "faciliter la prise de rendez-vous en ligne",
    decouvrir: "inciter à explorer les services et le portfolio"
  }

  const style = preferences.style || 'modern'
  const ambiance = preferences.ambiance || 'professionnel'
  const priorite = preferences.priorite || 'conversion'
  const ton = preferences.ton || 'chaleureux'
  const cta = preferences.cta || 'contact'

  return `
=== INFLUENCES DU CLIENT ===

🎨 STYLE VISUEL : ${styleMap[style]}
🌅 AMBIANCE : ${ambianceMap[ambiance]}
🎯 OBJECTIF PRINCIPAL : ${prioriteMap[priorite]}
💬 TON : ${tonMap[ton]}
⚡ ACTION PRINCIPALE : ${ctaMap[cta]}

Adapte le contenu et le design en fonction de ces préférences.
Le style visuel doit guider le choix des variantes de sections.
Le ton doit influencer la rédaction de tous les textes.
L'objectif principal doit orienter la structure et les CTA.
`
}