import express  from 'express'
import cors     from 'cors'
import dotenv   from 'dotenv'
import fs       from 'fs'
import path     from 'path'
import { fileURLToPath } from 'url'

const saveSiteRecord           = (data) => ({ id: `site_${Date.now()}`, ...data })
const getVariantRecommendation = (_secteur) => ({})
const trackPerformance         = (_id, _metrics) => null
const analyzePerformance       = (_secteur) => ({ message: 'CIO désactivé' })

dotenv.config()

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// ═══════════════════════════════════════════════════════════
// REGISTRE DES COMPOSANTS
// ═══════════════════════════════════════════════════════════
const COMPONENTS_REGISTRY = {
  navbar: {
    'navbar-a': { tags: ['transparent', 'premium', 'plein écran'] },
    'navbar-b': { tags: ['topbar-contact', 'professionnel', 'sticky blanc'] },
  },
  hero: {
    'hero-a': { tags: ['plein écran', 'image fond', 'texte gauche', 'impactant'] },
    'hero-b': { tags: ['split 50/50', 'image droite', 'stats inline', 'élégant'] },
    'hero-c': { tags: ['centré', 'dégradé', 'sans image', 'minimaliste'] },
  },
  stats: {
    'stats-a': { tags: ['overlap sombre', 'chiffres dorés', 'après hero plein écran'] },
    'stats-b': { tags: ['cards blanches', 'fond clair', 'hover border accent'] },
  },
  services: {
    'services-a': { tags: ['grille 3 cols', 'icônes SVG', 'hover lift', 'fond clair'] },
    'services-b': { tags: ['liste alternée', 'image + texte', 'storytelling'] },
  },
  portfolio: {
    'portfolio-a': { tags: ['bento grid', 'tailles variées', 'overlay hover', 'créatif'] },
    'portfolio-b': { tags: ['magazine', 'cards uniformes', 'tag + titre + meta'] },
  },
  about: {
    'about-a': { tags: ['split image gauche', 'texte droite', 'badge flottant', 'premium'] },
    'about-b': { tags: ['centré', '3 valeurs cards', 'minimaliste', 'B2B'] },
  },
  testimonials: {
    'testimonials-a': { tags: ['3 cards', 'fond clair', 'avatar + étoiles', 'classique'] },
    'testimonials-b': { tags: ['fond sombre', 'citation large', 'une à la fois', 'luxe'] },
  },
  faq: {
    'faq-a': { tags: ['accordéon', 'texte gauche + liste droite', 'split 2 cols'] },
    'faq-b': { tags: ['accordéon', 'pleine largeur', 'centré', 'simple'] },
  },
  cta: {
    'cta-a': { tags: ['fond sombre', 'titre géant', 'mot en filigrane', 'bold'] },
    'cta-b': { tags: ['fond accent', 'formulaire inline', 'contact direct'] },
  },
  footer: {
    'footer-a': { tags: ['4 colonnes', 'services + contact + horaires', 'complet'] },
    'footer-b': { tags: ['minimal centré', 'logo + tagline + réseaux', 'luxe'] },
  },
}

// Contraintes par secteur
const SECTOR_CONSTRAINTS = {
  'Coiffure & beauté':    { forbidden: [],             preferHero: ['hero-a','hero-b'] },
  'Restaurant & café':    { forbidden: [],             preferHero: ['hero-a'] },
  'Médecin & santé':      { forbidden: ['portfolio-a'],preferHero: ['hero-b','hero-c'] },
  'Artisan & réparation': { forbidden: [],             preferHero: ['hero-a'] },
  'Commerce & épicerie':  { forbidden: [],             preferHero: ['hero-a','hero-b'] },
  'Autre':                { forbidden: [],             preferHero: ['hero-b','hero-c'] },
}

// ═══════════════════════════════════════════════════════════
// FONCTIONS DE DESCRIPTION DES PRÉFÉRENCES (ASSISTANT IA)
// ═══════════════════════════════════════════════════════════
function getStyleDescription(style) {
  const map = {
    elegant: "un design luxueux et raffiné avec une typographie élégante, des espaces généreux et des détails soignés",
    modern: "un design moderne et dynamique avec des couleurs vives, des layouts innovants et une énergie positive",
    minimal: "un design minimaliste et épuré avec beaucoup d'espace blanc, une hiérarchie claire et des lignes nettes",
    creative: "un design créatif et original avec des effets visuels surprenants, une personnalité forte et unique"
  }
  return map[style] || map.modern
}

function getAmbianceDescription(ambiance) {
  const map = {
    chaleureux: "une ambiance chaleureuse et accueillante avec des couleurs chaudes, des photos humaines et un ton amical",
    professionnel: "une ambiance professionnelle et sérieuse avec un design sobre, des couleurs neutres et un ton expert",
    inspirant: "une ambiance inspirante et motivante avec des images évocatrices, des messages positifs et de l'énergie",
    intime: "une ambiance intime et personnelle avec des photos authentiques, une proximité réelle et un ton chaleureux"
  }
  return map[ambiance] || map.professionnel
}

function getPrioriteDescription(priorite) {
  const map = {
    conversion: "convertir les visiteurs en leads et maximiser les prises de contact (formulaires, appels, emails)",
    branding: "renforcer l'image de marque et le positionnement de l'entreprise (notoriété, identité, valeurs)",
    information: "informer clairement les clients sur les services, l'expertise et les réalisations",
    vente: "optimiser le parcours d'achat et augmenter les ventes en ligne (panier, paiement, fidélisation)"
  }
  return map[priorite] || map.conversion
}

function getTonDescription(ton) {
  const map = {
    formel: "un ton formel et élégant avec un langage soutenu, un vocabulaire précis et une classe naturelle",
    chaleureux: "un ton chaleureux et amical avec un langage accessible, proche du client et convivial",
    expert: "un ton expert et pédagogique avec un langage de confiance, explicatif et rassurant",
    audacieux: "un ton audacieux et disruptif avec un langage original, provocateur et marquant"
  }
  return map[ton] || map.chaleureux
}

function getCtaDescription(cta) {
  const map = {
    contact: "pousser les visiteurs à contacter l'entreprise via le formulaire, le téléphone ou l'email",
    devis: "encourager la demande de devis personnalisé avec un formulaire dédié et des arguments convaincants",
    reservation: "faciliter la prise de rendez-vous en ligne avec un système simple et rapide",
    decouvrir: "inciter à explorer les services, le portfolio et les réalisations de l'entreprise"
  }
  return map[cta] || map.contact
}

function buildInfluencePrompt(preferences) {
  if (!preferences) return ''

  const style = preferences.style || 'modern'
  const ambiance = preferences.ambiance || 'professionnel'
  const priorite = preferences.priorite || 'conversion'
  const ton = preferences.ton || 'chaleureux'
  const cta = preferences.cta || 'contact'

  return `
╔══════════════════════════════════════════════════════════════╗
║              🎯 PRÉFÉRENCES DU CLIENT (ASSISTANT IA)        ║
╚══════════════════════════════════════════════════════════════╝

🎨 STYLE VISUEL : ${getStyleDescription(style)}
🌅 AMBIANCE : ${getAmbianceDescription(ambiance)}
🎯 OBJECTIF PRINCIPAL : ${getPrioriteDescription(priorite)}
💬 TON : ${getTonDescription(ton)}
⚡ ACTION PRINCIPALE : ${getCtaDescription(cta)}

╔══════════════════════════════════════════════════════════════╗
║                    📋 INSTRUCTIONS SPÉCIALES                 ║
╚══════════════════════════════════════════════════════════════╝

1. 🎨 Le style visuel DOIT guider le choix des variantes de sections
   → ${style === 'elegant' ? 'Privilégie les variantes "a" (élégantes)' : ''}
   → ${style === 'modern' ? 'Privilégie les variantes "b" (modernes)' : ''}
   → ${style === 'minimal' ? 'Privilégie les variantes "b" ou "c" (épurées)' : ''}
   → ${style === 'creative' ? 'Privilégie les variantes "a" (créatives)' : ''}

2. 💬 Le ton DOIT influencer la rédaction de TOUS les textes
   → ${ton === 'formel' ? 'Utilise un vocabulaire soutenu et élégant' : ''}
   → ${ton === 'chaleureux' ? 'Utilise un ton convivial et accessible' : ''}
   → ${ton === 'expert' ? 'Utilise un ton de confiance et pédagogique' : ''}
   → ${ton === 'audacieux' ? 'Utilise un ton original et marquant' : ''}

3. 🎯 L'objectif principal DOIT orienter la structure du site
   → ${priorite === 'conversion' ? 'Mets en avant les formulaires et CTA de contact' : ''}
   → ${priorite === 'branding' ? 'Mets en avant l\'identité et les valeurs de la marque' : ''}
   → ${priorite === 'information' ? 'Structure le contenu de façon claire et pédagogique' : ''}
   → ${priorite === 'vente' ? 'Optimise le parcours d\'achat et les appels à l\'action' : ''}

4. ⚡ L'action principale DOIT être mise en avant dans les CTA
   → ${cta === 'contact' ? 'CTA : "Nous contacter", "Appelez-nous", "Envoyez un message"' : ''}
   → ${cta === 'devis' ? 'CTA : "Demander un devis", "Obtenir un tarif", "Estimation gratuite"' : ''}
   → ${cta === 'reservation' ? 'CTA : "Réserver maintenant", "Prendre rendez-vous", "Réservez en ligne"' : ''}
   → ${cta === 'decouvrir' ? 'CTA : "Découvrir", "Voir nos réalisations", "Explorer nos services"' : ''}

ADAPTE TOUT LE CONTENU ET LE LAYOUT EN CONSÉQUENCE.
`
}

// ═══════════════════════════════════════════════════════════
// MAP POUR LES VARIANTES BASÉES SUR LES PRÉFÉRENCES
// ═══════════════════════════════════════════════════════════
function getVariantOverrides(preferences) {
  if (!preferences) return {}

  const style = preferences.style || 'modern'
  const variantMap = {
    elegant: { hero: 'hero-a', portfolio: 'portfolio-a', footer: 'footer-a' },
    modern: { hero: 'hero-b', portfolio: 'portfolio-b', footer: 'footer-b' },
    minimal: { hero: 'hero-c', portfolio: 'portfolio-b', footer: 'footer-b' },
    creative: { hero: 'hero-a', portfolio: 'portfolio-a', footer: 'footer-a' }
  }

  return variantMap[style] || variantMap.modern
}

// ═══════════════════════════════════════════════════════════
// FONCTIONS POUR LE CHATBOT CONTEXTUEL
// ═══════════════════════════════════════════════════════════
function generateChatbotQuestions(formData) {
  const { nom, secteur, services } = formData
  const serviceList = services?.split(',').map(s => s.trim()).filter(Boolean) || []
  
  const sectorQuestions = {
    'Coiffure & beauté': {
      question: `💇‍♀️ Pour votre salon de beauté "${nom}", quel est votre spécialité principale ?`,
      options: [
        { id: 'coupe', label: '✂️ Coupe & coiffure', desc: 'Spécialiste en coupe et mise en forme' },
        { id: 'coloration', label: '🎨 Coloration & balayage', desc: 'Expert en colorations et techniques avancées' },
        { id: 'soins', label: '💆 Soins & bien-être', desc: 'Soins du visage et du corps' },
        { id: 'tout', label: '🌟 Tout-en-un', desc: 'Gamme complète de services' }
      ]
    },
    'Restaurant & café': {
      question: `🍽️ Pour votre établissement "${nom}", quel est votre style culinaire principal ?`,
      options: [
        { id: 'gastronomique', label: '🍷 Gastronomique', desc: 'Cuisine raffinée et haut de gamme' },
        { id: 'traditionnel', label: '🍲 Traditionnel', desc: 'Cuisine authentique et familiale' },
        { id: 'moderne', label: '🍣 Fusion & Moderne', desc: 'Cuisine innovante et créative' },
        { id: 'fast', label: '🍔 Fast-food & Casual', desc: 'Service rapide et accessible' }
      ]
    },
    'Médecin & santé': {
      question: `🏥 Pour votre cabinet "${nom}", quelle est votre spécialité médicale ?`,
      options: [
        { id: 'general', label: '🩺 Médecine générale', desc: 'Soins primaires et suivi global' },
        { id: 'specialiste', label: '🔬 Médecine spécialisée', desc: 'Expertise dans un domaine spécifique' },
        { id: 'chirurgie', label: '🏥 Chirurgie', desc: 'Interventions chirurgicales' },
        { id: 'esthetique', label: '✨ Médecine esthétique', desc: 'Soins esthétiques et régénératifs' }
      ]
    },
    'Artisan & réparation': {
      question: `🔧 Pour votre atelier "${nom}", quel est votre métier principal ?`,
      options: [
        { id: 'plomberie', label: '🔧 Plomberie', desc: 'Installations et réparations' },
        { id: 'electricite', label: '⚡ Électricité', desc: 'Installations électriques' },
        { id: 'menuiserie', label: '🪵 Menuiserie', desc: 'Travail du bois et agencements' },
        { id: 'general', label: '🔨 Multiservices', desc: 'Tous types de réparations' }
      ]
    },
    'Commerce & épicerie': {
      question: `🛒 Pour votre commerce "${nom}", quel est votre produit principal ?`,
      options: [
        { id: 'alimentaire', label: '🥫 Épicerie fine', desc: 'Produits alimentaires de qualité' },
        { id: 'bio', label: '🌿 Bio & Naturel', desc: 'Produits biologiques et sains' },
        { id: 'local', label: '🏪 Produits locaux', desc: 'Circuits courts et artisans locaux' },
        { id: 'general_com', label: '🏬 Commerce général', desc: 'Large gamme de produits' }
      ]
    }
  }

  let specificQuestion = sectorQuestions[secteur]
  
  if (!specificQuestion) {
    specificQuestion = {
      question: `🎯 Pour votre activité "${nom}" (${secteur}), quel est votre principal atout ?`,
      options: [
        { id: 'qualite', label: '🌟 Qualité premium', desc: 'Excellence et savoir-faire' },
        { id: 'prix', label: '💰 Rapport qualité-prix', desc: 'Prix compétitifs et accessibles' },
        { id: 'service', label: '🤝 Service personnalisé', desc: 'Accompagnement sur mesure' },
        { id: 'rapide', label: '⚡ Rapidité & Efficacité', desc: 'Solutions rapides et efficaces' }
      ]
    }
  }

  const servicesQuestion = serviceList.length > 0 ? {
    question: `📋 J'ai vu que vous proposez : ${serviceList.join(', ')}. Parmi ces services, lequel est le plus demandé par vos clients ?`,
    options: serviceList.slice(0, 4).map(s => ({
      id: s,
      label: `⭐ ${s}`,
      desc: `Service phare de votre activité`
    }))
  } : null

  const audienceQuestion = {
    question: `👥 Qui sont vos clients principaux ?`,
    options: [
      { id: 'particuliers', label: '👤 Particuliers', desc: 'Grand public et consommateurs' },
      { id: 'professionnels', label: '🏢 Professionnels', desc: 'Entreprises et institutions' },
      { id: 'mixte', label: '🔄 Mixte', desc: 'Particuliers et professionnels' },
      { id: 'niche', label: '🎯 Niche spécifique', desc: 'Public très ciblé' }
    ]
  }

  const competitionQuestion = {
    question: `🏁 Comment vous différenciez-vous de vos concurrents ?`,
    options: [
      { id: 'expertise', label: '🎓 Expertise unique', desc: 'Savoir-faire exceptionnel' },
      { id: 'prix', label: '💰 Prix avantageux', desc: 'Meilleur rapport qualité-prix' },
      { id: 'service', label: '🌟 Service client exceptionnel', desc: 'Expérience client premium' },
      { id: 'innovation', label: '💡 Innovation', desc: 'Solutions nouvelles et créatives' }
    ]
  }

  const questions = [
    {
      id: 'specifique',
      ...specificQuestion
    },
    ...(servicesQuestion ? [{
      id: 'service_principal',
      ...servicesQuestion
    }] : []),
    {
      id: 'audience',
      ...audienceQuestion
    },
    {
      id: 'differentiation',
      ...competitionQuestion
    },
    {
      id: 'final_goal',
      question: `🎯 En un mot, quel est votre objectif principal avec ce site ?`,
      options: [
        { id: 'attirer', label: '📈 Attirer de nouveaux clients', desc: 'Développer votre clientèle' },
        { id: 'fidéliser', label: '❤️ Fidéliser vos clients', desc: 'Renforcer la relation client' },
        { id: 'vendre', label: '💰 Vendre en ligne', desc: 'Augmenter les ventes' },
        { id: 'informer', label: '📚 Informer et rassurer', desc: 'Mettre en avant votre expertise' },
        { id: 'image', label: '✨ Améliorer votre image', desc: 'Renforcer votre marque' }
      ]
    }
  ]

  return questions
}

function mapChatbotPreferencesToStyle(preferences) {
  const styleMap = {
    coupe: 'elegant',
    coloration: 'creative',
    soins: 'modern',
    tout: 'minimal',
    gastronomique: 'elegant',
    traditionnel: 'minimal',
    moderne: 'modern',
    fast: 'modern',
    general: 'professionnel',
    specialiste: 'expert',
    chirurgie: 'professionnel',
    esthetique: 'elegant',
    plomberie: 'professionnel',
    electricite: 'professionnel',
    menuiserie: 'minimal',
    alimentaire: 'modern',
    bio: 'minimal',
    local: 'chaleureux',
    qualite: 'elegant',
    prix: 'modern',
    service: 'chaleureux',
    rapide: 'modern',
    expertise: 'expert',
    innovation: 'creative',
    general_com: 'modern'
  }

  const ambianceMap = {
    particuliers: 'chaleureux',
    professionnels: 'professionnel',
    mixte: 'professionnel',
    niche: 'intime'
  }

  const tonMap = {
    attirer: 'chaleureux',
    fideliser: 'chaleureux',
    vendre: 'audacieux',
    informer: 'expert',
    image: 'elegant'
  }

  const ctaMap = {
    attirer: 'contact',
    fideliser: 'contact',
    vendre: 'devis',
    informer: 'decouvrir',
    image: 'decouvrir'
  }

  const result = {}
  
  if (preferences.specifique) {
    result.style = styleMap[preferences.specifique] || 'modern'
  }
  if (preferences.audience) {
    result.ambiance = ambianceMap[preferences.audience] || 'professionnel'
  }
  if (preferences.final_goal) {
    result.priorite = 'conversion'
    result.ton = tonMap[preferences.final_goal] || 'chaleureux'
    result.cta = ctaMap[preferences.final_goal] || 'contact'
  }

  return result
}

// ═══════════════════════════════════════════════════════════
// ROUTES DU CHATBOT
// ═══════════════════════════════════════════════════════════
app.post('/chatbot/questions', (req, res) => {
  const { formData } = req.body
  const questions = generateChatbotQuestions(formData)
  res.json({ questions })
})

app.post('/chatbot/map-preferences', (req, res) => {
  const { preferences } = req.body
  const mapped = mapChatbotPreferencesToStyle(preferences)
  res.json({ 
    success: true, 
    mapped,
    original: preferences
  })
})

// ═══════════════════════════════════════════════════════════
// ROUTES POUR LES QUESTIONS SECTORIELLES
// ═══════════════════════════════════════════════════════════
app.post('/sector-questions', (req, res) => {
  const { secteur } = req.body
  // Importer les questions sectorielles
  // (Les questions sont définies dans le frontend via sector-questions.js)
  // On renvoie un message de confirmation
  res.json({ 
    success: true, 
    message: `Questions spécifiques pour le secteur ${secteur}` 
  })
})

app.post('/sector-questions/map', (req, res) => {
  const { answers, secteur } = req.body
  
  // Mapper les réponses sectorielles vers des préférences de style
  const result = {}
  
  // Mapping des réponses coiffure/beauté
  const coiffureMap = {
    coupe: 'elegant',
    coloration: 'creative',
    soins: 'modern',
    tout: 'minimal',
    femmes: 'elegant',
    hommes: 'modern',
    mixte: 'modern',
    premium: 'elegant',
    luxe: 'elegant',
    cosy: 'chaleureux',
    moderne: 'modern',
    nature: 'minimal'
  }
  
  // Mapping des réponses restaurant
  const restoMap = {
    gastronomique: 'elegant',
    traditionnel: 'minimal',
    fusion: 'creative',
    fast: 'modern',
    chic: 'elegant',
    convivial: 'chaleureux',
    moderne_resto: 'modern',
    intime: 'chaleureux',
    sur_place: 'chaleureux',
    emporter: 'modern',
    livraison: 'modern',
    tout_resto: 'modern'
  }
  
  // Mapping des réponses médical
  const medMap = {
    general: 'professionnel',
    specialiste: 'expert',
    chirurgie: 'professionnel',
    esthetique: 'elegant',
    enfants: 'chaleureux',
    adultes: 'professionnel',
    seniors: 'chaleureux',
    tous: 'professionnel',
    confiance: 'professionnel',
    expertise: 'expert',
    humanite: 'chaleureux',
    innovation: 'creative'
  }
  
  // Mapping des réponses artisan
  const artisanMap = {
    plomberie: 'professionnel',
    electricite: 'professionnel',
    menuiserie: 'minimal',
    general_artisan: 'professionnel'
  }
  
  // Mapping des réponses commerce
  const commerceMap = {
    alimentaire: 'modern',
    bio: 'minimal',
    local: 'chaleureux',
    general_com: 'modern'
  }
  
  // Appliquer le mapping selon le secteur
  let styleMap = {}
  if (secteur === 'Coiffure & beauté') styleMap = coiffureMap
  else if (secteur === 'Restaurant & café') styleMap = restoMap
  else if (secteur === 'Médecin & santé') styleMap = medMap
  else if (secteur === 'Artisan & réparation') styleMap = artisanMap
  else if (secteur === 'Commerce & épicerie') styleMap = commerceMap
  
  // Mapper chaque réponse
  for (const [key, value] of Object.entries(answers)) {
    if (styleMap[value]) {
      result.style = styleMap[value]
      break
    }
  }
  
  // Ajouter des préférences par défaut si nécessaire
  if (!result.style) {
    result.style = 'modern'
  }
  
  // Définir l'ambiance en fonction du secteur
  const ambianceMap = {
    'Coiffure & beauté': 'chaleureux',
    'Restaurant & café': 'chaleureux',
    'Médecin & santé': 'professionnel',
    'Artisan & réparation': 'professionnel',
    'Commerce & épicerie': 'chaleureux'
  }
  result.ambiance = ambianceMap[secteur] || 'professionnel'
  
  // Définir les autres préférences par défaut
  result.priorite = 'conversion'
  result.ton = 'chaleureux'
  result.cta = 'contact'
  
  res.json({ 
    success: true, 
    mapped: result,
    original: answers
  })
})

// ═══════════════════════════════════════════════════════════
// CHARGEUR DE SECTIONS
// ═══════════════════════════════════════════════════════════
function loadSection(sectionName, variantKey) {
  const p = path.join(__dirname, 'templates/sections', sectionName, `${variantKey}.html`)
  try { 
    const content = fs.readFileSync(p, 'utf-8')
    return content
  }
  catch { 
    console.warn(`⚠️ Section introuvable: ${p}`)
    return `<!-- ${variantKey} manquant -->` 
  }
}

const LAYOUT_SHELL = fs.readFileSync(
  path.join(__dirname, 'templates/layouts/universal.html'), 'utf-8'
)

// ═══════════════════════════════════════════════════════════
// ASSEMBLAGE FINAL
// ═══════════════════════════════════════════════════════════
function assemblePage(chosenLayout, vars) {
  const defaultOrder = [
    'navbar', 'hero', 'stats', 'services',
    'portfolio', 'about', 'process', 'testimonials',
    'faq', 'cta', 'gallery', 'footer'
  ]

  const sectionOrder = vars.SECTIONS_ORDER || defaultOrder

  const sectionsHtml = sectionOrder
    .filter(name => chosenLayout[name])
    .map(name => {
      const sectionHtml = loadSection(name, chosenLayout[name])
      return `<!-- SECTION:${name} -->\n${sectionHtml}\n<!-- /SECTION:${name} -->`
    })
    .join('\n')

  let html = LAYOUT_SHELL.replace('{{ALL_SECTIONS}}', sectionsHtml)

  return Object.entries(vars).reduce((h, [key, val]) => {
    if (key === 'SECTIONS_ORDER') return h
    return h.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val ?? '')
  }, html)
}

// ═══════════════════════════════════════════════════════════
// VALIDATION DU CHOIX DU LLM
// ═══════════════════════════════════════════════════════════
function validateLayout(llmLayout, secteur) {
  const constraints = SECTOR_CONSTRAINTS[secteur] || { forbidden: [], preferHero: [] }
  const validated = {}

  for (const [section, variants] of Object.entries(COMPONENTS_REGISTRY)) {
    const availableKeys = Object.keys(variants)
    const llmChoice = llmLayout?.[section]

    if (llmChoice && availableKeys.includes(llmChoice) && !constraints.forbidden.includes(llmChoice)) {
      validated[section] = llmChoice
    } else {
      validated[section] = availableKeys.find(k => !constraints.forbidden.includes(k)) || availableKeys[0]
      if (llmChoice) console.warn(`⚠️ Variante invalide "${llmChoice}" pour ${section} → fallback: ${validated[section]}`)
    }
  }
  return validated
}

// ═══════════════════════════════════════════════════════════
// PROMPT — LE LLM CHOISIT LES VARIANTES + LE CONTENU
// ═══════════════════════════════════════════════════════════
function buildPrompt({ nom, secteur, servicesList, langue, fallbackTheme, preferences }) {

  const influencePrompt = buildInfluencePrompt(preferences)

  // ── Ajouter les réponses spécifiques au secteur ──
  let sectorSpecificPrompt = ''
  if (preferences) {
    const sectorDetails = Object.entries(preferences)
      .filter(([key]) => [
        'specialite', 'clientele', 'ambiance_salon', 'services_phare', 'prix_salon',
        'type_cuisine', 'ambiance_resto', 'service_resto', 'specialite_resto', 'prix_resto',
        'specialite_med', 'public_med', 'valeur_med', 'urgence', 'teleconsultation',
        'metier', 'depannage', 'garantie', 'deplacement', 'urgence_artisan',
        'type_produit', 'vente_en_ligne', 'livraison_com', 'click_collect', 'fidelisation',
        'secteur_autre', 'public_autre', 'objectif_autre'
      ].includes(key))
      .map(([key, value]) => {
        const labels = {
          specialite: `Spécialité principale : ${value}`,
          clientele: `Clientèle cible : ${value}`,
          ambiance_salon: `Ambiance du salon : ${value}`,
          services_phare: `Service phare : ${value}`,
          prix_salon: `Gamme de prix : ${value}`,
          type_cuisine: `Type de cuisine : ${value}`,
          ambiance_resto: `Ambiance du restaurant : ${value}`,
          service_resto: `Type de service : ${value}`,
          specialite_resto: `Spécialité culinaire : ${value}`,
          prix_resto: `Fourchette de prix : ${value}`,
          specialite_med: `Spécialité médicale : ${value}`,
          public_med: `Public cible : ${value}`,
          valeur_med: `Valeur transmise : ${value}`,
          urgence: `Consultations d'urgence : ${value}`,
          teleconsultation: `Téléconsultation : ${value}`,
          metier: `Métier principal : ${value}`,
          depannage: `Service de dépannage : ${value}`,
          garantie: `Garantie : ${value}`,
          deplacement: `Déplacements : ${value}`,
          urgence_artisan: `Service d'urgence : ${value}`,
          type_produit: `Type de produit : ${value}`,
          vente_en_ligne: `Vente en ligne : ${value}`,
          livraison_com: `Livraison : ${value}`,
          click_collect: `Click & collect : ${value}`,
          fidelisation: `Programme de fidélisation : ${value}`,
          secteur_autre: `Secteur d'activité : ${value}`,
          public_autre: `Public cible : ${value}`,
          objectif_autre: `Objectif principal : ${value}`
        }
        return labels[key] || `${key}: ${value}`
      })
      .join('\n   ')

    if (sectorDetails) {
      sectorSpecificPrompt = `
═══════════════════════════════════════════
🎯 DÉTAILS SPÉCIFIQUES AU SECTEUR
═══════════════════════════════════════════
   ${sectorDetails}

Ces informations doivent influencer le contenu et le choix des variantes.
`
    }
  }

  const catalog = Object.entries(COMPONENTS_REGISTRY)
    .map(([section, variants]) =>
      `${section}:\n` + Object.entries(variants)
        .map(([key, meta]) => `  "${key}" → [${meta.tags.join(', ')}]`)
        .join('\n')
    ).join('\n\n')

  return `Tu es un expert en design web et copywriting premium.
Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans texte avant ou après.
Langue de tout le contenu : ${langue}.

${influencePrompt}
${sectorSpecificPrompt}

═══════════════════════════════════════════
ENTREPRISE
═══════════════════════════════════════════
Nom : ${nom}
Secteur : ${secteur}
Services : ${servicesList.join(', ')}

═══════════════════════════════════════════
CATALOGUE DES COMPOSANTS DISPONIBLES
═══════════════════════════════════════════
${catalog}

═══════════════════════════════════════════
FORMAT DE SORTIE ATTENDU (complet, tous les champs)
═══════════════════════════════════════════
{
  "layout": {
    "navbar":       "navbar-a | navbar-b",
    "hero":         "hero-a | hero-b | hero-c",
    "stats":        "stats-a | stats-b",
    "services":     "services-a | services-b",
    "portfolio":    "portfolio-a | portfolio-b",
    "about":        "about-a | about-b",
    "testimonials": "testimonials-a | testimonials-b",
    "faq":          "faq-a | faq-b",
    "cta":          "cta-a | cta-b",
    "footer":       "footer-a | footer-b"
  },

  "theme": {
    "dark":        "couleur sombre hex (fond dark sections)",
    "accent":      "couleur accent hex (boutons, chiffres, liens actifs)",
    "accentLight": "version très claire de l'accent rgba(..., 0.12)",
    "lightBg":     "fond clair sections hex"
  },

  "hero": {
    "badge":       "3-4 mots courts accrocheurs",
    "title":       "4-6 mots avec <em>1 mot clé</em>",
    "subtitle":    "12-16 mots",
    "ctaPrimary":  "texte bouton principal",
    "ctaSecondary":"texte bouton secondaire",
    "rating":      "4.9/5",
    "ratingLabel": "avis vérifiés",
    "stat1Val": "valeur courte ex: 500+",
    "stat1Lbl": "label court",
    "stat2Val": "valeur courte",
    "stat2Lbl": "label court",
    "imageQuery":  "describe ideal hero photo in English, 6 words max"
  },

  "stats": [
    {"value": "chiffre+", "label": "label court"},
    {"value": "chiffre",  "label": "label court"},
    {"value": "chiffre%", "label": "label court"},
    {"value": "chiffre★", "label": "label court"}
  ],

  "services": {
    "eyebrow": "label 2 mots majuscules",
    "title":   "titre section 4 mots",
    "items": [
      {"num":"01","icon":"star","title":"${servicesList[0]||'Service'}","description":"12-16 mots concis"},
      {"num":"02","icon":"layout","title":"${servicesList[1]||'Service'}","description":"12-16 mots concis"},
      {"num":"03","icon":"heart","title":"${servicesList[2]||'Service'}","description":"12-16 mots concis"}
    ]
  },

  "portfolio": {
    "eyebrow": "label 2 mots",
    "title":   "titre 4-5 mots",
    "desc":    "description 10 mots",
    "items": [
      {"tag":"tag","title":"titre projet","meta":["info1","info2"],"imageQuery":"photo in English 5 words"},
      {"tag":"tag","title":"titre projet","meta":["info1","info2"],"imageQuery":"photo in English 5 words"},
      {"tag":"tag","title":"titre projet","meta":["info1","info2"],"imageQuery":"photo in English 5 words"},
      {"tag":"tag","title":"titre projet","meta":["info1","info2"],"imageQuery":"photo in English 5 words"},
      {"tag":"tag","title":"titre projet","meta":["info1","info2"],"imageQuery":"photo in English 5 words"}
    ]
  },

  "about": {
    "eyebrow":     "label 2 mots",
    "title":       "titre 5-6 mots",
    "paragraphs":  ["§1 présentation 2-3 phrases", "§2 expertise 2-3 phrases"],
    "highlights":  ["point fort 1", "point fort 2", "point fort 3", "point fort 4"],
    "cta":         "texte bouton",
    "badgeNum":    "12",
    "badgeLabel":  "ans d'expertise",
    "imageQuery":  "professional about image in English 5 words"
  },

  "testimonials": {
    "eyebrow": "label 2 mots",
    "title":   "titre 4-5 mots",
    "items": [
      {"stars":5,"text":"15-20 mots citation client crédible","name":"Prénom Nom","role":"rôle client"},
      {"stars":5,"text":"15-20 mots citation client crédible","name":"Prénom Nom","role":"rôle client"},
      {"stars":5,"text":"15-20 mots citation client crédible","name":"Prénom Nom","role":"rôle client"}
    ]
  },

  "faq": {
    "title":    "titre 4 mots",
    "subtitle": "sous-titre 8 mots",
    "cta":      "texte bouton",
    "items": [
      {"question":"question pertinente ?","answer":"réponse complète 20 mots"},
      {"question":"question pertinente ?","answer":"réponse complète 20 mots"},
      {"question":"question pertinente ?","answer":"réponse complète 20 mots"},
      {"question":"question pertinente ?","answer":"réponse complète 20 mots"},
      {"question":"question pertinente ?","answer":"réponse complète 20 mots"}
    ]
  },

  "cta": {
    "label":    "Prêt à démarrer ?",
    "title":    "titre géant 5-6 mots",
    "subtitle": "sous-titre 10 mots",
    "cta":      "texte bouton"
  },

  "footer": {
    "tagline":  "slogan 6-8 mots",
    "hours":    "Lun–Sam : 9h–18h",
    "bgWord":   "MOT_EN_MAJUSCULES"
  },

  "nav": {
    "portfolio": "Réalisations",
    "services":  "Services",
    "about":     "À propos",
    "faq":       "FAQ",
    "cta":       "Nous contacter"
  },

  "topbar":     "texte topbar court (10 mots max)",
  "gallery":    { "eyebrow": "label", "title": "titre galerie" },

  "meta": {
    "title":       "${nom} — ${secteur}",
    "footerRights":"Tous droits réservés."
  }
}

RÈGLES ABSOLUES :
1. Choisis les variantes layout selon l'identité visuelle du secteur "${secteur}", pas au hasard
2. Tout le texte (sauf imageQuery) doit être en ${langue}
3. imageQuery doit TOUJOURS être en anglais (utilisé pour l'API images)
4. Ne jamais utiliser "Lorem ipsum" ou "Votre entreprise"
5. Services : exactement ${servicesList.length} items dans l'ordre : ${servicesList.join(', ')}
6. JSON valide uniquement — premier caractère { dernier caractère }`
}

// ═══════════════════════════════════════════════════════════
// THÈMES FALLBACK PAR SECTEUR
// ═══════════════════════════════════════════════════════════
const SECTOR_THEMES = {
  'Coiffure & beauté':    { dark:'#1a0e14', accent:'#C9748A', accentLight:'rgba(201,116,138,0.12)', lightBg:'#FDF8FA' },
  'Restaurant & café':    { dark:'#1a0d00', accent:'#C0622A', accentLight:'rgba(192,98,42,0.12)',   lightBg:'#FFF7ED' },
  'Médecin & santé':      { dark:'#001a40', accent:'#2563EB', accentLight:'rgba(37,99,235,0.12)',   lightBg:'#F0F7FF' },
  'Artisan & réparation': { dark:'#1a1000', accent:'#D97706', accentLight:'rgba(217,119,6,0.12)',   lightBg:'#FEFCE8' },
  'Commerce & épicerie':  { dark:'#001a0d', accent:'#16A34A', accentLight:'rgba(22,163,74,0.12)',   lightBg:'#F2FDF5' },
  'Autre':                { dark:'#0e1117', accent:'#C9A84C', accentLight:'rgba(201,168,76,0.12)',  lightBg:'#F8F6F2' },
}

// ═══════════════════════════════════════════════════════════
// RÉSOLUTION D'IMAGES
// ═══════════════════════════════════════════════════════════
const FALLBACK_IMAGES = {
  hero: {
    'Coiffure & beauté':    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    'Restaurant & café':    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    'Médecin & santé':      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    'Artisan & réparation': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
    'Commerce & épicerie':  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    'Autre':                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
  }
}

async function resolveImage(query, type = 'general', secteur = '') {
  if (!query) return FALLBACK_IMAGES.hero[secteur] || FALLBACK_IMAGES.hero['Autre']

  if (process.env.UNSPLASH_ACCESS_KEY) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
        { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
      )
      if (res.ok) {
        const d = await res.json()
        if (d?.urls?.regular) return d.urls.regular
      }
    } catch {}
  }

  if (process.env.PEXELS_API_KEY) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: process.env.PEXELS_API_KEY } }
      )
      if (res.ok) {
        const d = await res.json()
        const photos = d?.photos ?? []
        if (photos.length) {
          const pick = photos[Math.floor(Math.random() * photos.length)]
          if (pick?.src?.large) return pick.src.large
        }
      }
    } catch {}
  }

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ' professional high quality')}?width=1200&height=600&nologo=true`
}

// ═══════════════════════════════════════════════════════════
// GEMINI VISION
// ═══════════════════════════════════════════════════════════
function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') return null
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/)
  return match ? { mimeType: match[1], data: match[2] } : null
}

async function describeImageWithGemini(dataUrl, { nom, secteur, langue }) {
  const parsed = parseDataUrl(dataUrl)
  if (!parsed || !process.env.GEMINI_API_KEY) return ''
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Décris cette photo en ${langue} pour le site vitrine de "${nom}" (${secteur}). 8-15 mots, sans guillemets, sans préfixe.` },
              { inline_data: { mime_type: parsed.mimeType, data: parsed.data } }
            ]
          }]
        })
      }
    )
    const d = await res.json()
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text
    return text ? text.trim().replace(/^["'«]+|["'»]+$/g, '') : ''
  } catch { return '' }
}

// ═══════════════════════════════════════════════════════════
// MAPPERS HTML
// ═══════════════════════════════════════════════════════════
const SVG_ICONS = {
  camera:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><circle cx="12" cy="13" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
  layout:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>',
  star:      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>',
  home:      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>',
  heart:     '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  scissors:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 1 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"/>',
  briefcase: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"/>',
  pen:       '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>',
  utensils:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-3 1.5v-1.5m-3 1.5v-1.5M3 13.5h18M5.25 13.5v6a.75.75 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75v-6"/>',
  wrench:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.5-3.096c.317-.384.74-.626 1.208-.766M13.125 12.07l.743-3.095a.75.75 0 0 1 1.448 0l.743 3.095m-2.934 0a5.25 5.25 0 0 0-3.13 0"/>',
  shopping:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>',
}

function mapStats(stats) {
  return stats.map((s, i) => `
    <div class="stat-item" style="transition-delay:${i * 0.1}s">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </div>`).join('')
}

function mapPortfolioA(items) {
  const bentoClasses = ['bento-card-1','bento-card-2','bento-card-3','bento-card-4','bento-card-5']
  return items.slice(0, 5).map((item, i) => `
    <div class="bento-card ${bentoClasses[i]}">
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      <div class="bento-card__info">
        <span class="bento-card__tag">${item.tag}</span>
        <div class="bento-card__title">${item.title}</div>
        <div class="bento-card__meta">${item.meta.map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </div>`).join('')
}

function mapPortfolioB(items) {
  return items.slice(0, 6).map((item) => `
    <div class="pb-card">
      <div class="pb-card__img-wrap">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      </div>
      <div class="pb-card__body">
        <span class="pb-card__tag">${item.tag}</span>
        <h3 class="pb-card__title">${item.title}</h3>
        <div class="pb-card__meta">${item.meta.map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </div>`).join('')
}

function mapServices(items) {
  return items.map((s, i) => `
    <div class="service-card">
      <span class="service-num">${s.num || `0${i+1}`}</span>
      <div class="service-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          ${SVG_ICONS[s.icon] || SVG_ICONS.star}
        </svg>
      </div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>`).join('')
}

function mapTestimonials(items) {
  return items.map(t => `
    <div class="testi-card fade-in">
      <div class="testi-stars">${'★'.repeat(t.stars || 5)}</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author">
        <img class="testi-avatar" src="${t.avatarUrl || ''}" alt="${t.name}" loading="lazy"
          onerror="this.style.display='none'">
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
    </div>`).join('')
}

function mapFaq(items) {
  return items.map((item, i) => `
    <div class="faq-item${i === 0 ? ' active' : ''}">
      <div class="faq-question">
        ${item.question}
        <span class="faq-toggle">+</span>
      </div>
      <div class="faq-answer"><p>${item.answer}</p></div>
    </div>`).join('')
}

function mapFooterServicesList(servicesList) {
  return servicesList.slice(0, 5).map(s =>
    `<a href="#services" style="display:block;color:rgba(255,255,255,0.4);text-decoration:none;font-size:0.9rem;margin-bottom:8px;transition:color 0.3s;"
       onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">${s}</a>`
  ).join('')
}

function buildGallerySection(items, eyebrow, title) {
  if (!items?.length) return ''
  const cards = items.map(item => `
    <div style="border-radius:16px;overflow:hidden;background:var(--light-bg);">
      <img src="${item.url}" alt="${item.desc||''}" loading="lazy"
        style="width:100%;height:240px;object-fit:cover;display:block;">
      ${item.desc ? `<p style="padding:12px 16px;font-size:0.85rem;color:var(--gray-text);">${item.desc}</p>` : ''}
    </div>`).join('')
  return `
<section id="gallery" style="padding:80px 24px;background:var(--light-bg);">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="text-align:center;max-width:600px;margin:0 auto 3rem;">
      <span style="color:var(--accent);font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;font-weight:600;">${eyebrow}</span>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:2.2rem;font-weight:700;color:var(--dark);margin-top:8px;">${title}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">${cards}</div>
  </div>
</section>`
}

// ═══════════════════════════════════════════════════════════
// ROUTE — GÉNÉRATION LOGO
// ═══════════════════════════════════════════════════════════
app.post('/generate-logo', async (req, res) => {
  const { nom, secteur, couleur_principale, couleur_secondaire } = req.body
  const prompt = `Tu es un designer SVG senior. Crée un logo SVG pour "${nom}" (${secteur}).
RÈGLES : Réponds UNIQUEMENT avec SVG brut. viewBox="0 0 240 72" width="240" height="72".
Couleur principale : ${couleur_principale}. Couleur texte : ${couleur_secondaire}.
Structure : icône géométrique simple à gauche (x=8-56, centrée y=36) + nom "${nom}" à droite.
Style minimaliste et premium. Pas de dégradés.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 1500, temperature: 0.4 })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Erreur Groq')
    let svg = data.choices[0].message.content.replace(/^```svg\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim()
    if (!svg.startsWith('<svg')) { const m = svg.match(/<svg[\s\S]*<\/svg>/); svg = m ? m[0] : null }
    if (!svg) throw new Error('SVG invalide')
    res.json({ svg, base64: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` })
  } catch (error) {
    console.error('Erreur logo:', error)
    res.status(500).json({ error: 'Impossible de générer le logo' })
  }
})

// ═══════════════════════════════════════════════════════════
// ROUTE — SUGGESTIONS BASÉES SUR LES PRÉFÉRENCES
// ═══════════════════════════════════════════════════════════
app.post('/suggest-variants', (req, res) => {
  const { preferences, secteur } = req.body
  
  const style = preferences?.style || 'modern'
  const variantMap = {
    elegant: { hero: 'hero-a', portfolio: 'portfolio-a', footer: 'footer-a' },
    modern: { hero: 'hero-b', portfolio: 'portfolio-b', footer: 'footer-b' },
    minimal: { hero: 'hero-c', portfolio: 'portfolio-b', footer: 'footer-b' },
    creative: { hero: 'hero-a', portfolio: 'portfolio-a', footer: 'footer-a' }
  }
  
  const suggested = variantMap[style] || variantMap.modern  
  const sectorSuggestions = SECTOR_CONSTRAINTS[secteur] || {}
  let alternativeHero = suggested.hero
  if (sectorSuggestions.preferHero && sectorSuggestions.preferHero.length > 0) {
    alternativeHero = sectorSuggestions.preferHero[0]
  }

  const styleLabels = {
    elegant: 'Vous avez choisi un style élégant et raffiné → nous recommandons des variantes "a" (luxueuses)',
    modern: 'Vous avez choisi un style moderne et dynamique → nous recommandons des variantes "b" (contemporaines)',
    minimal: 'Vous avez choisi un style minimaliste et épuré → nous recommandons des variantes "b" ou "c" (simples)',
    creative: 'Vous avez choisi un style créatif et original → nous recommandons des variantes "a" (artistiques)'
  }
  
  res.json({
    suggested,
    alternative: { hero: alternativeHero },
    reasoning: styleLabels[style] || styleLabels.modern,
    sectorInfluence: sectorSuggestions.preferHero ? `Le secteur "${secteur}" préfère les variantes: ${sectorSuggestions.preferHero.join(', ')}` : 'Aucune contrainte sectorielle spécifique',
    preferences
  })
})


// ─── Rate limit basique par IP (en mémoire) ─────────────
const rateLimitMap = new Map()
function checkRateLimit(ip, maxPerMinute = 10) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + 60000 }
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60000 }
  entry.count++
  rateLimitMap.set(ip, entry)
  return entry.count <= maxPerMinute
}

// ═══════════════════════════════════════════════════════════
// ROUTE PRINCIPALE — GÉNÉRATION DU SITE
// ═══════════════════════════════════════════════════════════
app.post('/generate', async (req, res) => {
  const startTime = Date.now()
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (!checkRateLimit(clientIp, 10)) {
    return res.status(429).json({ error: 'Trop de requêtes. Attendez une minute avant de réessayer.' })
  }

  const { nom, secteur, services, telephone, email, adresse, langue, template: tpl, images, preferences } = req.body
  if (!nom || !secteur) {
    return res.status(400).json({ error: 'Les champs "nom" et "secteur" sont obligatoires.' })
  }
  const servicesList = (services || '').split(',').map(s => s.trim()).filter(Boolean)
  const fallbackTheme = SECTOR_THEMES[secteur] || SECTOR_THEMES['Autre']

  const baseTheme = {
    dark: tpl?.secondary || fallbackTheme.dark,
    accent: tpl?.primary || fallbackTheme.accent,
    accentLight: fallbackTheme.accentLight,
    lightBg: tpl?.accent || fallbackTheme.lightBg,
  }

  try {
    const variantOverrides = getVariantOverrides(preferences)
    if (Object.keys(variantOverrides).length > 0) {
      console.log(`🎯 Préférences client:`, preferences)
      console.log(`📐 Variantes influencées par les préférences:`, variantOverrides)
    }

    const prompt = buildPrompt({ 
      nom, secteur, servicesList, langue, 
      fallbackTheme: baseTheme,
      preferences
    })

    // ── Appel Groq avec timeout 30s ───────────────────────
    const groqController = new AbortController()
    const groqTimeout = setTimeout(() => groqController.abort(), 30000)

    let groqRes
    try {
      groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Tu es un expert JSON. Retourne uniquement du JSON valide, sans markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 3500, temperature: 0.6
        }),
        signal: groqController.signal
      })
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') throw new Error('Le service IA a mis trop de temps à répondre (>30s). Réessayez.')
      throw fetchErr
    } finally {
      clearTimeout(groqTimeout)
    }

    const groqData = await groqRes.json()
    if (!groqRes.ok) throw new Error(groqData.error?.message || 'Erreur Groq')

    const raw = groqData.choices[0].message.content

    // ── Extraction + auto-réparation JSON tronqué ─────────
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Pas de JSON valide dans la réponse du LLM')

    let d
    try {
      d = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      console.warn('⚠️ JSON tronqué, tentative de réparation...')
      let repaired = jsonMatch[0]
      // Fermer une string ouverte éventuelle
      const unclosedStr = repaired.match(/"[^"]*$/)
      if (unclosedStr) repaired = repaired.slice(0, unclosedStr.index) + '"'
      // Compter et fermer accolades/crochets manquants
      let braces = 0, brackets = 0, inStr = false, esc = false
      for (const ch of repaired) {
        if (esc) { esc = false; continue }
        if (ch === '\\' && inStr) { esc = true; continue }
        if (ch === '"') { inStr = !inStr; continue }
        if (inStr) continue
        if (ch === '{') braces++; else if (ch === '}') braces--
        else if (ch === '[') brackets++; else if (ch === ']') brackets--
      }
      repaired = repaired.replace(/,\s*$/, '')
      repaired += ']'.repeat(Math.max(0, brackets)) + '}'.repeat(Math.max(0, braces))
      try {
        d = JSON.parse(repaired)
        console.log('✅ JSON réparé avec succès')
      } catch {
        throw new Error('JSON invalide même après réparation. Relancez la génération.')
      }
    }

    const layoutWithPreferences = { ...d.layout, ...variantOverrides }
    const cioRecommendation = getVariantRecommendation(secteur)
    const layoutWithCio = { ...layoutWithPreferences, ...cioRecommendation }
    const chosenLayout = validateLayout(layoutWithCio, secteur)

    const theme = {
      dark: (d.theme?.dark && /^#[0-9A-Fa-f]{6}$/.test(d.theme.dark)) ? d.theme.dark : baseTheme.dark,
      accent: (d.theme?.accent && /^#[0-9A-Fa-f]{6}$/.test(d.theme.accent)) ? d.theme.accent : baseTheme.accent,
      accentLight: d.theme?.accentLight || baseTheme.accentLight,
      lightBg: (d.theme?.lightBg && /^#[0-9A-Fa-f]{6}$/.test(d.theme.lightBg)) ? d.theme.lightBg : baseTheme.lightBg,
    }

    console.log(`🧩 Layout final (LLM + CIO + Préférences) pour "${nom}" [${secteur}] :`)
    Object.entries(chosenLayout).forEach(([s, v]) => {
      const fromCio = cioRecommendation[s] === v
      const fromPrefs = variantOverrides[s] === v
      let source = ''
      if (fromPrefs) source = '  ← préférence client'
      else if (fromCio) source = '  ← recommandé par CIO'
      console.log(`   ${s}: ${v}${source}`)
    })

    const [heroUrl, aboutUrl, ...portfolioUrls] = await Promise.all([
      images?.hero ? Promise.resolve(images.hero) : resolveImage(d.hero?.imageQuery, 'hero', secteur),
      images?.about ? Promise.resolve(images.about) : resolveImage(d.about?.imageQuery, 'about', secteur),
      ...(d.portfolio?.items || []).map(item => resolveImage(item.imageQuery, 'portfolio', secteur))
    ])

    const [avatarUrls, galleryDescriptions] = await Promise.all([
      Promise.all((d.testimonials?.items || []).map(() => resolveImage('professional person headshot smiling'))),
      images?.gallery?.length
        ? Promise.all(images.gallery.map(img => describeImageWithGemini(img, { nom, secteur, langue })))
        : Promise.resolve([])
    ])

    if (d.portfolio?.items) d.portfolio.items = d.portfolio.items.map((item, i) => ({ ...item, imageUrl: portfolioUrls[i] }))
    if (d.testimonials?.items) d.testimonials.items = d.testimonials.items.map((t, i) => ({ ...t, avatarUrl: avatarUrls[i] }))

    const portfolioHtml = chosenLayout.portfolio === 'portfolio-b'
      ? mapPortfolioB(d.portfolio?.items || [])
      : mapPortfolioA(d.portfolio?.items || [])

    const logoHtml = images?.logo
      ? `<img src="${images.logo}" alt="${nom}" style="height:44px;width:auto;max-width:180px;object-fit:contain;">`
      : `<span style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;letter-spacing:-0.5px;">${nom}</span>`

    const galleryItems = (images?.gallery || []).map((url, i) => ({ url, desc: galleryDescriptions[i] || '' }))

    const vars = {
      THEME_DARK: theme.dark,
      THEME_ACCENT: theme.accent,
      THEME_ACCENT_LIGHT: theme.accentLight,
      THEME_LIGHT_BG: theme.lightBg,
      NOM: nom,
      LOGO_HTML: logoHtml,
      NAV_PORTFOLIO: d.nav?.portfolio || 'Réalisations',
      NAV_SERVICES: d.nav?.services || 'Services',
      NAV_ABOUT: d.nav?.about || 'À propos',
      NAV_FAQ: d.nav?.faq || 'FAQ',
      NAV_CTA: d.nav?.cta || 'Contact',
      TOP_BAR_TEXT: d.topbar || '',
      TELEPHONE: telephone || '',
      EMAIL: email || '',
      HERO_IMAGE_URL: heroUrl,
      HERO_BADGE: d.hero?.badge || '',
      HERO_TITLE: d.hero?.title || nom,
      HERO_SUBTITLE: d.hero?.subtitle || '',
      HERO_CTA_PRIMARY: d.hero?.ctaPrimary || 'Découvrir',
      HERO_CTA_SECONDARY: d.hero?.ctaSecondary || 'En savoir plus',
      HERO_RATING: d.hero?.rating || '4.9/5',
      HERO_RATING_LABEL: d.hero?.ratingLabel || 'avis clients',
      HERO_STAT_1_VAL: d.hero?.stat1Val || d.stats?.[0]?.value || '500+',
      HERO_STAT_1_LBL: d.hero?.stat1Lbl || d.stats?.[0]?.label || 'clients',
      HERO_STAT_2_VAL: d.hero?.stat2Val || d.stats?.[1]?.value || '10 ans',
      HERO_STAT_2_LBL: d.hero?.stat2Lbl || d.stats?.[1]?.label || "d'expérience",
      STATS_HTML: mapStats(d.stats || []),
      SERVICES_EYEBROW: d.services?.eyebrow || 'Nos services',
      SERVICES_TITLE: d.services?.title || 'Ce que nous proposons',
      SERVICES_HTML: mapServices(d.services?.items || []),
      PORTFOLIO_EYEBROW: d.portfolio?.eyebrow || 'Réalisations',
      PORTFOLIO_TITLE: d.portfolio?.title || 'Nos projets',
      PORTFOLIO_DESC: d.portfolio?.desc || '',
      PORTFOLIO_HTML: portfolioHtml,
      PORTFOLIO_B_HTML: portfolioHtml,
      GALLERY_SECTION: buildGallerySection(galleryItems, d.gallery?.eyebrow || 'Galerie', d.gallery?.title || 'Nos photos'),
      ABOUT_IMAGE_URL: aboutUrl,
      ABOUT_EYEBROW: d.about?.eyebrow || 'À propos',
      ABOUT_TITLE: d.about?.title || 'Notre histoire',
      ABOUT_PARAGRAPHS_HTML: (d.about?.paragraphs || []).map(p => `<p>${p}</p>`).join(''),
      ABOUT_HIGHLIGHTS_HTML: (d.about?.highlights || []).map(h => `<li>${h}</li>`).join(''),
      ABOUT_CTA: d.about?.cta || 'En savoir plus',
      ABOUT_BADGE_NUM: d.about?.badgeNum || '10',
      ABOUT_BADGE_LABEL: d.about?.badgeLabel || 'ans',
      TESTIMONIALS_EYEBROW: d.testimonials?.eyebrow || 'Témoignages',
      TESTIMONIALS_TITLE: d.testimonials?.title || 'Ce que disent nos clients',
      TESTIMONIALS_HTML: mapTestimonials(d.testimonials?.items || []),
      FAQ_TITLE: d.faq?.title || 'Questions fréquentes',
      FAQ_SUBTITLE: d.faq?.subtitle || '',
      FAQ_CTA: d.faq?.cta || 'Nous contacter',
      FAQ_HTML: mapFaq(d.faq?.items || []),
      CTA_LABEL: d.cta?.label || 'Prêt à démarrer ?',
      CTA_TITLE: d.cta?.title || 'Votre projet commence ici.',
      CTA_SUBTITLE: d.cta?.subtitle || '',
      CTA_BTN: d.cta?.cta || 'Démarrer maintenant',
      FOOTER_TAGLINE: d.footer?.tagline || '',
      FOOTER_HOURS: d.footer?.hours || 'Lun–Sam 9h–18h',
      FOOTER_BG_WORD: d.footer?.bgWord || nom.split(' ')[0].toUpperCase(),
      FOOTER_SERVICES_LIST: mapFooterServicesList(servicesList),
      FOOTER_SOCIAL_LINKS: ['Facebook', 'Instagram', 'LinkedIn'].map(n =>
        `<a href="#" style="color:rgba(255,255,255,0.3);text-decoration:none;font-size:0.85rem;transition:color 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='rgba(255,255,255,0.3)'">${n}</a>`
      ).join(''),
      FOOTER_YEAR: String(new Date().getFullYear()),
      FOOTER_RIGHTS: d.meta?.footerRights || 'Tous droits réservés.',
      ADRESSE: adresse || '',
      WHATSAPP_NUMBER: (telephone || '').replace(/\D/g, ''),
    }

    const html = assemblePage(chosenLayout, vars)

    const duration = Date.now() - startTime
    console.log(`✅ Site généré : ${nom} — ${duration}ms`)

    const siteRecord = saveSiteRecord({
      nom,
      secteur,
      layout: chosenLayout,
      theme,
      durationMs: duration,
      preferences: preferences || null,
    })

    res.json({
      html,
      meta: {
        layout: chosenLayout,
        theme,
        durationMs: duration,
        siteId: siteRecord.id,
        vars,
        preferences: preferences || null,
      }
    })

  } catch (error) {
    console.error('Erreur génération:', error)
    res.status(500).json({ error: error.message })
  }
})

// ═══════════════════════════════════════════════════════════
// ROUTE — REGÉNÉRER UNE SECTION SEULE
// ═══════════════════════════════════════════════════════════
app.post('/regenerate-section', (req, res) => {
  const { sectionName, variantKey, vars } = req.body

  const available = COMPONENTS_REGISTRY[sectionName]
  if (!available || !available[variantKey]) {
    return res.status(400).json({
      error: `Variante "${variantKey}" inconnue pour la section "${sectionName}"`,
      available: available ? Object.keys(available) : []
    })
  }

  const rawHtml = loadSection(sectionName, variantKey)

  const html = Object.entries(vars || {}).reduce((h, [key, val]) => {
    return h.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val ?? '')
  }, rawHtml)

  const cleaned = html.replace(/\{\{[A-Z_0-9]+\}\}/g, '')

  res.json({ html: cleaned })
})

// ═══════════════════════════════════════════════════════════
// ROUTE CIO — TRACKING
// ═══════════════════════════════════════════════════════════
app.post('/track', (req, res) => {
  const { siteId, metrics } = req.body
  if (!siteId) return res.status(400).json({ error: 'siteId requis' })

  const updated = trackPerformance(siteId, metrics || {})
  if (!updated) return res.status(404).json({ error: 'Site introuvable' })

  res.json({ ok: true, site: updated })
})

app.get('/cio/analyze/:secteur', (req, res) => {
  res.json(analyzePerformance(req.params.secteur))
})

app.listen(3001, () => console.log('✅ Backend sur http://localhost:3001'))