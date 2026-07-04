import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import ChatbotAssistant from './components/ChatbotAssistant'
import SectorQuestions from './components/SectorQuestions'
import { collection, addDoc, serverTimestamp , doc, updateDoc, increment } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './contexts/AuthContext'

// ─── HELPER — Sauvegarde d'un site dans Firestore ──────────
async function saveSiteToFirestore({ userId, formData, htmlSnapshot, layout, palette, preferences }) {
  if (!userId) {
    console.error('❌ userId manquant — sauvegarde annulée')
    return null
  }
  try {
    const docRef = await addDoc(collection(db, 'sites'), {
      userId,
      nom:         formData.nom       || '',
      secteur:     formData.secteur   || '',
      services:    formData.services  || '',
      telephone:   formData.telephone || '',
      email:       formData.email     || '',
      adresse:     formData.adresse   || '',
      langue:      formData.langue    || 'Français',
      htmlSnapshot: htmlSnapshot      || '',
      layout:      layout             || {},
      palette:     palette            || {},
      preferences: preferences        || {},
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    })
    try{
      await updateDoc (doc(db , 'users' , userId), { sitesCount: increment(1) })
    } catch(err) { console.error('❌ Erreur mise à jour Firestore:', err) }
    console.log('✅ Site sauvegardé Firestore:', docRef.id)
    return docRef.id
  } catch (err) {
    console.error('❌ Erreur sauvegarde Firestore:', err)
    return null
  }
}

// ─── PALETTES PREMIUM PAR SECTEUR ────────────────────────
const SECTOR_PALETTES = {
  'Coiffure & beauté': [
    { id:'rose-gold',  name:'Rose Gold',    primary:'#C9748A', secondary:'#1a0e14', accent:'#FDF0F3', lightBg:'#FDF8FA', preview:'#C9748A' },
    { id:'nude-chic',  name:'Nude Chic',    primary:'#B08D7A', secondary:'#2a1a14', accent:'#FDF5F0', lightBg:'#FAF5F2', preview:'#B08D7A' },
    { id:'violet-lux', name:'Violet Luxe',  primary:'#9B59B6', secondary:'#1a0a2e', accent:'#F8F0FF', lightBg:'#FAF5FF', preview:'#9B59B6' },
  ],
  'Restaurant & café': [
    { id:'terracotta', name:'Terracotta',   primary:'#C0622A', secondary:'#1a0d00', accent:'#FFF3EC', lightBg:'#FFF7ED', preview:'#C0622A' },
    { id:'olive-chic', name:'Olive & Or',   primary:'#8B7D3A', secondary:'#1a1500', accent:'#FDFAEC', lightBg:'#FAFAED', preview:'#8B7D3A' },
    { id:'bordeaux',   name:'Bordeaux',     primary:'#8B1A3A', secondary:'#1a0010', accent:'#FFF0F3', lightBg:'#FDF5F7', preview:'#8B1A3A' },
  ],
  'Médecin & santé': [
    { id:'blue-trust', name:'Bleu Confiance', primary:'#2563EB', secondary:'#001a40', accent:'#EFF6FF', lightBg:'#F0F7FF', preview:'#2563EB' },
    { id:'teal-care',  name:'Teal Santé',     primary:'#0D9488', secondary:'#001a18', accent:'#F0FDFA', lightBg:'#F0FDFB', preview:'#0D9488' },
    { id:'sage-calm',  name:'Sage Calme',     primary:'#5C8A6A', secondary:'#0a1a0e', accent:'#F0FDF4', lightBg:'#F3FBF5', preview:'#5C8A6A' },
  ],
  'Artisan & réparation': [
    { id:'amber-craft', name:'Ambre Craft', primary:'#D97706', secondary:'#1a1000', accent:'#FFFBEB', lightBg:'#FEFCE8', preview:'#D97706' },
    { id:'iron-steel',  name:'Acier',       primary:'#475569', secondary:'#0f172a', accent:'#F8FAFC', lightBg:'#F1F5F9', preview:'#475569' },
    { id:'copper',      name:'Cuivre',      primary:'#B45309', secondary:'#1a0e00', accent:'#FFF7ED', lightBg:'#FEF9EE', preview:'#B45309' },
  ],
  'Commerce & épicerie': [
    { id:'fresh-green', name:'Fresh Green', primary:'#16A34A', secondary:'#001a0d', accent:'#F0FDF4', lightBg:'#F2FDF5', preview:'#16A34A' },
    { id:'market-red',  name:'Market Red',  primary:'#DC2626', secondary:'#1a0000', accent:'#FFF5F5', lightBg:'#FEF2F2', preview:'#DC2626' },
    { id:'ocean-blue',  name:'Océan',       primary:'#0284C7', secondary:'#001a30', accent:'#F0F9FF', lightBg:'#F0FAFF', preview:'#0284C7' },
  ],
  'Autre': [
    { id:'gold-premium', name:'Or Premium', primary:'#C9A84C', secondary:'#0e1117', accent:'#FDF9EC', lightBg:'#F8F6F2', preview:'#C9A84C' },
    { id:'indigo-pro',   name:'Indigo Pro', primary:'#4F46E5', secondary:'#0f0a2e', accent:'#EEF2FF', lightBg:'#F5F3FF', preview:'#4F46E5' },
    { id:'charcoal',     name:'Charcoal',   primary:'#374151', secondary:'#111827', accent:'#F9FAFB', lightBg:'#F3F4F6', preview:'#374151' },
  ],
}

const VARIANT_LABELS = {
  'navbar-a': 'Transparent',       'navbar-b': 'Topbar contact',
  'hero-a':   'Plein écran',       'hero-b':   'Split 50/50',       'hero-c': 'Centré dégradé',
  'stats-a':  'Overlap sombre',    'stats-b':  'Cards claires',
  'services-a': 'Grille icônes',   'services-b': 'Liste alternée',
  'portfolio-a':'Bento grid',      'portfolio-b':'Magazine',
  'about-a':  'Split image',       'about-b':  'Centré valeurs',
  'testimonials-a':'Cards 3 cols', 'testimonials-b':'Citation large',
  'faq-a':    'Split 2 cols',      'faq-b':    'Pleine largeur',
  'cta-a':    'Fond sombre bold',  'cta-b':    'Fond accent formulaire',
  'footer-a': '4 colonnes',        'footer-b': 'Minimal centré',
}

const VARIANTS_PER_SECTION = {
  navbar:       ['navbar-a', 'navbar-b'],
  hero:         ['hero-a', 'hero-b', 'hero-c'],
  stats:        ['stats-a', 'stats-b'],
  services:     ['services-a', 'services-b'],
  portfolio:    ['portfolio-a', 'portfolio-b'],
  about:        ['about-a', 'about-b'],
  testimonials: ['testimonials-a', 'testimonials-b'],
  faq:          ['faq-a', 'faq-b'],
  cta:          ['cta-a', 'cta-b'],
  footer:       ['footer-a', 'footer-b'],
}

const SECTION_ICONS = {
  navbar: '🔝', hero: '🖼️', stats: '📊', services: '⚙️',
  portfolio: '🗂️', about: 'ℹ️', testimonials: '💬',
  faq: '❓', cta: '📣', footer: '🦶',
}

// ─── ASSISTANT IA — QUESTIONS ET PRÉFÉRENCES ─────────────
const ASSISTANT_QUESTIONS = {
  style: {
    question: "Quel style visuel préférez-vous pour votre site ?", icon: "🎨",
    options: [
      { id: "elegant",  label: "Élégant & Raffiné",    description: "Design épuré, typographie soignée, ambiance luxueuse", emoji: "✨" },
      { id: "modern",   label: "Moderne & Dynamique",   description: "Layout contemporain, couleurs vives, énergie positive", emoji: "🚀" },
      { id: "minimal",  label: "Minimaliste & Clair",   description: "Design épuré, beaucoup d'espace, focus sur le contenu", emoji: "⬜" },
      { id: "creative", label: "Créatif & Original",    description: "Design unique, effets visuels, personnalité marquée",  emoji: "🎭" },
    ]
  },
  ambiance: {
    question: "Quelle ambiance souhaitez-vous créer ?", icon: "🌅",
    options: [
      { id: "chaleureux",   label: "Chaleureuse & Accueillante", description: "Couleurs chaudes, photos humaines, ton amical",     emoji: "🤗" },
      { id: "professionnel",label: "Professionnelle & Sérieuse",  description: "Design sobre, couleurs neutres, ton expert",        emoji: "💼" },
      { id: "inspirant",    label: "Inspirante & Motivante",      description: "Images évocatrices, messages positifs, énergie",   emoji: "🌟" },
      { id: "intime",       label: "Intime & Personnelle",        description: "Ambiance feutrée, photos authentiques, proximité", emoji: "🕯️" },
    ]
  },
  priorite: {
    question: "Quel est votre objectif principal ?", icon: "🎯",
    options: [
      { id: "conversion", label: "Générer des contacts",        description: "Maximiser les prises de contact et demandes de devis", emoji: "📞" },
      { id: "branding",   label: "Renforcer l'image de marque", description: "Mettre en valeur l'identité et le positionnement",    emoji: "🏷️" },
      { id: "information",label: "Informer vos clients",        description: "Présenter clairement vos services et expertises",     emoji: "📚" },
      { id: "vente",      label: "Vendre en ligne",             description: "Optimiser le parcours d'achat et les conversions",   emoji: "🛒" },
    ]
  },
  ton: {
    question: "Quel ton souhaitez-vous utiliser ?", icon: "💬",
    options: [
      { id: "formel",    label: "Formel & Élégant",    description: "Langage soutenu, vocabulaire précis, classe",               emoji: "🎩" },
      { id: "chaleureux",label: "Chaleureux & Amical", description: "Ton convivial, proche du client, accessible",              emoji: "😊" },
      { id: "expert",    label: "Expert & Pédagogue",  description: "Ton de confiance, explicatif, rassurant",                  emoji: "🎓" },
      { id: "audacieux", label: "Audacieux & Disruptif",description: "Ton provocateur, original, qui marque les esprits",      emoji: "🔥" },
    ]
  },
  cta: {
    question: "Quelle action principale voulez-vous que vos visiteurs effectuent ?", icon: "⚡",
    options: [
      { id: "contact",    label: "Me contacter",              description: "Formulaire de contact, téléphone, email",              emoji: "📱" },
      { id: "devis",      label: "Demander un devis",         description: "Formulaire de demande de devis personnalisé",          emoji: "📊" },
      { id: "reservation",label: "Réserver un rendez-vous",   description: "Système de prise de rendez-vous en ligne",            emoji: "📅" },
      { id: "decouvrir",  label: "Découvrir mes services",    description: "Explorer le portfolio et les offres",                 emoji: "🔍" },
    ]
  }
}

// ─── COMPOSANT ASSISTANT IA ──────────────────────────────
function AssistantIA({ onComplete, onClose, initialPreferences }) {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState(initialPreferences || {})
  const [showAssistant, setShowAssistant] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const questions    = Object.entries(ASSISTANT_QUESTIONS)
  const totalSteps   = questions.length
  const currentQuestion = questions[step]
  const questionKey  = currentQuestion?.[0]
  const questionData = currentQuestion?.[1]

  const selectOption = (optionId) => {
    const newPreferences = { ...preferences, [questionKey]: optionId }
    setPreferences(newPreferences)
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setIsComplete(true)
      setTimeout(() => {
        onComplete(newPreferences)
        setShowAssistant(false)
      }, 1000)
    }
  }

  const goBack = () => { if (step > 0) setStep(step - 1) }
  const reset  = () => { setStep(0); setPreferences({}); setIsComplete(false) }
  const progress = ((step + 1) / totalSteps) * 100

  if (!showAssistant) return null

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-slide-up">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Préférences enregistrées !</h3>
          <p className="text-gray-500 text-sm">L'IA va maintenant générer votre site en tenant compte de vos choix.</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion || !questionData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{questionData.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Assistant IA</h3>
              <p className="text-xs text-gray-400">Étape {step + 1}/{totalSteps}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-xl">✕</button>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">{questionData.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questionData.options.map((option) => {
              const isSelected = preferences[questionKey] === option.id
              return (
                <button key={option.id} onClick={() => selectOption(option.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{option.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      {isSelected && <div className="mt-1 text-xs text-blue-600 font-medium">✓ Sélectionné</div>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={goBack} disabled={step === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
            ← Retour
          </button>
          <div className="flex gap-2">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">↻ Recommencer</button>
            <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">⏭ Passer</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(preferences).map(([key, value]) => {
            const q = ASSISTANT_QUESTIONS[key]
            const option = q?.options.find(o => o.id === value)
            return option ? (
              <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{q?.icon} {option.label}</span>
            ) : null
          })}
          {Object.keys(preferences).length === 0 && <span className="text-xs text-gray-400">Aucune préférence sélectionnée</span>}
        </div>
      </div>
    </div>
  )
}

// ─── COMPOSANT PALETTE CARD ───────────────────────────────
function PaletteCard({ palette, selected, onSelect }) {
  return (
    <div onClick={() => onSelect(palette)}
      className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 hover:scale-105 ${selected ? 'border-gray-800 shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}
    >
      <div className="h-14 w-full relative" style={{ backgroundColor: palette.preview }}>
        <div className="absolute bottom-0 left-0 right-0 h-5" style={{ backgroundColor: palette.secondary }} />
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: palette.primary }} />
      </div>
      <div className="p-2 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">{palette.name}</span>
          {selected && <span className="text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded-full">✓</span>}
        </div>
        <div className="flex gap-1 mt-1.5 h-2">
          <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.primary }} />
          <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.secondary }} />
          <div className="flex-1 rounded-sm border border-gray-100" style={{ backgroundColor: palette.lightBg }} />
        </div>
      </div>
    </div>
  )
}

// ─── COMPOSANT LAYOUT RESULT BADGES ──────────────────────
function LayoutBadges({ layout }) {
  if (!layout) return null
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 overflow-hidden mt-3">
      <div className="px-3 py-2 bg-indigo-100 flex items-center gap-2">
        <span className="text-xs font-bold text-indigo-700">🤖 Layout choisi par l'IA</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-indigo-100">
        {Object.entries(layout).map(([section, variant]) => (
          <div key={section} className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs text-indigo-500">{SECTION_ICONS[section] || '▸'} {section}</span>
            <span className="text-xs font-semibold text-indigo-800 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
              {VARIANT_LABELS[variant] || variant}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SECTION SWITCHER ────────────────────────────────────
function SectionSwitcher({ layout, onSwitch, switchingSection, variantsPerSection, variantLabels }) {
  const [openSection, setOpenSection] = useState(null)
  if (!layout) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-1">
      {Object.entries(layout).map(([sectionName, currentVariant]) => {
        const variants = variantsPerSection[sectionName] || []
        if (variants.length <= 1) return null
        const isOpen    = openSection === sectionName
        const isLoading = switchingSection === sectionName
        return (
          <div key={sectionName} className="relative">
            <button onClick={() => setOpenSection(isOpen ? null : sectionName)} disabled={!!switchingSection}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isLoading ? 'bg-blue-50 border-blue-200 text-blue-400 cursor-wait' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
              }`}>
              {isLoading ? <span className="animate-spin">⏳</span> : <span className="text-gray-400">⊞</span>}
              <span className="capitalize">{sectionName}</span>
              <span className="text-gray-400 text-xs">{variantLabels[currentVariant] || currentVariant}</span>
              <span className="text-gray-300">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 min-w-[180px] overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{sectionName}</span>
                </div>
                {variants.map(variant => (
                  <button key={variant} onClick={() => { setOpenSection(null); onSwitch(sectionName, variant) }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition ${
                      variant === currentVariant ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    {variant === currentVariant ? <span className="text-blue-500 text-xs">✓</span> : <span className="text-gray-300 text-xs">○</span>}
                    {variantLabels[variant] || variant}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── IMAGE UPLOAD FIELD ──────────────────────────────────
function ImageUploadField({ label, hint, preview, onChange, multiple = false }) {
  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {label}{hint && <span className="text-xs text-gray-400 font-normal ml-1">{hint}</span>}
        </label>
      )}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
        <span className="text-2xl mb-1">📁</span>
        <span className="text-sm text-gray-500">Cliquer pour choisir</span>
        <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={onChange} />
      </label>
      {preview && !multiple && (
        <div className="mt-2 relative inline-block">
          <img src={preview} alt="preview" className="h-16 w-auto rounded-lg object-cover border border-gray-200 shadow-sm" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">✓</span>
        </div>
      )}
      {preview && multiple && preview.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {preview.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt={`gallery ${i+1}`} className="h-14 w-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{i+1}</span>
            </div>
          ))}
          <div className="h-14 w-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">+photo</div>
        </div>
      )}
    </div>
  )
}

// ─── CIO SUGGESTIONS ─────────────────────────────────────
function CIOSuggestions({ sector }) {
  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    if (!sector) return
    fetch(`http://localhost:3001/cio/analyze/${encodeURIComponent(sector)}`)
      .then(res => res.json()).then(data => setSuggestions(data.suggestions || [])).catch(() => {})
  }, [sector])
  if (!suggestions.length) return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs text-gray-500">🔍 Pas encore de suggestions CIO. Continuez à générer des sites pour ce secteur.</p>
    </div>
  )
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-2">
        <span className="text-lg">💡</span>
        <div>
          <h4 className="text-sm font-semibold text-indigo-700">Améliorations suggérées (CIO)</h4>
          <ul className="text-xs text-indigo-600 mt-1 list-disc pl-4 space-y-1">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── PREVIEW ─────────────────────────────────────────────
function Preview({ html, siteId, device }) {
  const iframeRef     = useRef(null)
  const trackedEvents = useRef(new Set())
  const timeTracked   = useRef(false)

  const trackEvent = useCallback((event, extra = {}) => {
    if (!siteId) return
    fetch('http://localhost:3001/track', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, metrics: { [event]: 1, ...extra } })
    }).catch(() => {})
  }, [siteId])

  useEffect(() => {
    if (!siteId) return
    const key = `tracked_${siteId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, 'true')
    trackEvent('views', { views: 1 })
  }, [siteId, trackEvent])

  useEffect(() => {
    if (!iframeRef.current || !siteId) return
    const iframe = iframeRef.current
    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        doc.querySelectorAll('a[href="#contact"]').forEach(el => {
          el.addEventListener('click', () => {
            const key = `click_cta_${siteId}`
            if (!trackedEvents.current.has(key)) { trackedEvents.current.add(key); trackEvent('conversions', { event: 'click_cta' }) }
          })
        })
        doc.querySelectorAll('form').forEach(el => {
          el.addEventListener('submit', () => {
            const key = `submit_contact_${siteId}`
            if (!trackedEvents.current.has(key)) { trackedEvents.current.add(key); trackEvent('conversions', { event: 'submit_contact' }) }
          })
        })
        if (!timeTracked.current) {
          setTimeout(() => { if (!timeTracked.current) { timeTracked.current = true; trackEvent('avgTimeOnSiteSec', { value: 30 }) } }, 30000)
        }
      } catch {}
    }
    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [siteId, trackEvent])

  const deviceWidths = { mobile: '390px', tablet: '768px', desktop: '100%' }
  return (
    <div className="flex justify-center bg-gray-200 rounded-2xl p-4">
      <iframe ref={iframeRef} srcDoc={html} title="Site généré" sandbox="allow-scripts allow-same-origin"
        style={{ width: deviceWidths[device] || '100%', height: '700px', border: 'none', borderRadius: '12px', background: 'white', transition: 'width 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} />
    </div>
  )
}

// ─── REBUILD HTML ─────────────────────────────────────────
function rebuildHtml(fullHtml, sectionName, newSectionHtml) {
  const regex = new RegExp(`<!-- SECTION:${sectionName} -->[\\s\\S]*?<!-- /SECTION:${sectionName} -->`, 'i')
  const withSentinel = `<!-- SECTION:${sectionName} -->\n${newSectionHtml}\n<!-- /SECTION:${sectionName} -->`
  return regex.test(fullHtml) ? fullHtml.replace(regex, withSentinel) : fullHtml
}

// ═══════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════
export default function App() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ 
    nom: '', secteur: '', services: '', 
    telephone: '', email: '', adresse: '', langue: 'Français' 
  })
  const [selectedPalette, setSelectedPalette] = useState(null)
  const [images, setImages] = useState({ logo: null, hero: null, gallery: [] })
  const [html, setHtml] = useState('')
  const [generatedLayout, setGeneratedLayout] = useState(null)
  const [siteId, setSiteId] = useState(null)
  const [currentLayout, setCurrentLayout] = useState(null)
  const [currentVars, setCurrentVars] = useState(null)
  const [switchingSection, setSwitchingSection] = useState(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showSectorQuestions, setShowSectorQuestions] = useState(false)
  const [preferences, setPreferences] = useState(null)
  const [sectorAnswers, setSectorAnswers] = useState(null)

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(null)
  const [firestoreId, setFirestoreId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [device, setDevice] = useState('desktop')
  const [step, setStep] = useState(1)
  const [logoMode, setLogoMode] = useState('upload')
  const [logoLoading, setLogoLoading] = useState(false)
  const [generatedLogo, setGeneratedLogo] = useState(null)

  // ─── Restaurer depuis localStorage ────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sitegen_last')
      if (saved) {
        const { html: savedHtml, layout, vars, meta } = JSON.parse(saved)
        if (savedHtml) {
          setHtml(savedHtml)
          setGeneratedLayout(layout || null)
          setCurrentLayout(layout || null)
          setCurrentVars(vars || null)
          setSiteId(meta?.siteId || null)
          if (meta?.firestoreId) setFirestoreId(meta.firestoreId)
          setStep(2)
        }
      }
    } catch {}
  }, [])

  // ─── Pré-remplissage depuis sessionStorage ──────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('sitegen_prefill')
      if (raw) {
        const data = JSON.parse(raw)
        setFormData(prev => ({ ...prev, ...data }))
        sessionStorage.removeItem('sitegen_prefill')
        console.log('✅ Pré-remplissage depuis Dashboard appliqué')
      }
    } catch (err) {
      console.warn('⚠️ Erreur lors du pré-remplissage:', err)
    }
  }, []) 
  const aiAnswers = sessionStorage.getItem('sitegen_ai_answers')
if (aiAnswers) {
  const parsed = JSON.parse(aiAnswers)
  if (parsed.secteur) setFormData(prev => ({ ...prev, secteur: parsed.secteur }))
  const prefs = {}
  if (parsed.style)    prefs.style    = parsed.style
  if (parsed.objectif) prefs.priorite = parsed.objectif
  if (parsed.ton)      prefs.ton      = parsed.ton
  if (Object.keys(prefs).length > 0) setPreferences(prefs)
  sessionStorage.removeItem('sitegen_ai_answers')
}

  const toBase64 = f => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Échec lecture'))
    reader.readAsDataURL(f)
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'secteur') setSelectedPalette(null)
  }

  const handleLogoUpload = async e => {
    const f = e.target.files[0]; if (!f) return
    try { const b = await toBase64(f); setImages(p => ({ ...p, logo: b })) } catch (err) { console.error(err) }
  }

  const handleHeroUpload = async e => {
    const f = e.target.files[0]; if (!f) return
    try { const b = await toBase64(f); setImages(p => ({ ...p, hero: b })) } catch (err) { console.error(err) }
  }

  const handleGalleryUpload = async e => {
    const files = Array.from(e.target.files); if (!files.length) return
    try { const b64s = await Promise.all(files.map(toBase64)); setImages(p => ({ ...p, gallery: [...p.gallery, ...b64s] })) }
    catch (err) { console.error(err) }
  }

  const removeGalleryImage = i => setImages(p => ({ ...p, gallery: p.gallery.filter((_, j) => j !== i) }))

  const handleGenerateLogo = async () => {
    if (!formData.nom || !formData.secteur) { alert("Remplissez d'abord le nom et le secteur"); return }
    setLogoLoading(true)
    try {
      const palette = selectedPalette || (SECTOR_PALETTES[formData.secteur] || SECTOR_PALETTES['Autre'])[0]
      const res  = await fetch('http://localhost:3001/generate-logo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nom: formData.nom, 
          secteur: formData.secteur, 
          couleur_principale: palette.primary, 
          couleur_secondaire: palette.secondary 
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGeneratedLogo(data)
      setImages(p => ({ ...p, logo: data.base64 }))
    } catch (err) { alert('Erreur : ' + err.message) }
    finally { setLogoLoading(false) }
  }

  const handleChatbotComplete = (prefs) => { 
    setPreferences(prefs)
    setShowChatbot(false) 
  }

  const handleSectorQuestionsComplete = (answers) => {
    setSectorAnswers(answers)
    setShowSectorQuestions(false)
    generateSite(answers)
  }

  // ─── GÉNÉRATION + SAUVEGARDE FIRESTORE ───────────────────
  const generateSite = async (additionalAnswers = {}) => {
    setLoading(true)
    setLoadingStep('Analyse de vos informations...')
    setGeneratedLayout(null)
    setSiteId(null)
    setCurrentLayout(null)
    setCurrentVars(null)
    setSaveSuccess(null)
    setFirestoreId(null)

    try {
      const allPreferences = { ...preferences, ...additionalAnswers }
      const palette = selectedPalette || null

      setLoadingStep("Génération du contenu par l'IA...")
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 35000)

      let res
      try {
        res = await fetch('http://localhost:3001/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            template: palette ? { 
              primary: palette.primary, 
              secondary: palette.secondary, 
              accent: palette.lightBg 
            } : null,
            images,
            preferences: allPreferences
          }),
          signal: controller.signal
        })
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') {
          throw new Error('Délai dépassé (35s). Vérifiez que le serveur est démarré sur localhost:3001.')
        }
        throw new Error('Impossible de contacter le serveur. Vérifiez que le backend tourne sur localhost:3001.')
      } finally {
        clearTimeout(timeout)
      }

      setLoadingStep('Recherche et optimisation des images...')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (!data.html || data.html.length < 100) {
        throw new Error('Le site généré est vide. Vérifiez les logs du backend.')
      }

      setLoadingStep('Assemblage du site...')
      await new Promise(r => setTimeout(r, 300))

      setHtml(data.html)
      setGeneratedLayout(data.meta?.layout || null)
      setSiteId(data.meta?.siteId || null)
      setCurrentLayout(data.meta?.layout || null)
      setCurrentVars(data.meta?.vars || null)

      // ── Sauvegarde Firestore ──────────────────────────────
      setLoadingStep('Sauvegarde de votre site...')
      setIsSaving(true)

      let docId = null

      if (!user?.uid) {
        console.warn('⚠️ Utilisateur non connecté — sauvegarde Firestore ignorée')
        setSaveSuccess(false)
        setIsSaving(false)
      } else {
        try {
          docId = await saveSiteToFirestore({
            userId: user.uid,
            formData,
            htmlSnapshot: data.html,
            layout: data.meta?.layout || {},
            palette: palette || {},
            preferences: allPreferences || {},
          })
          if (docId) {
            setFirestoreId(docId)
            setSaveSuccess(true)
            console.log('✅ Site sauvegardé avec ID:', docId, 'pour l\'utilisateur:', user.uid)
          } else {
            setSaveSuccess(false)
          }
        } catch (saveErr) {
          console.error('❌ Erreur lors de la sauvegarde:', saveErr)
          setSaveSuccess(false)
        } finally {
          setIsSaving(false)
        }
      }

      // ─── localStorage ──────────────────────────────────────
      try {
        localStorage.setItem('sitegen_last', JSON.stringify({
          html: data.html,
          layout: data.meta?.layout,
          vars: data.meta?.vars,
          meta: {
            siteId: data.meta?.siteId,
            firestoreId: docId || null
          }
        }))
      } catch {}

      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err) {
      console.error('❌ Erreur génération:', err)
      alert('Erreur de génération : ' + err.message)
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.nom || !formData.secteur) { 
      alert('Veuillez remplir au minimum le nom et le secteur.'); 
      return 
    }
    if (preferences && Object.keys(preferences).length > 0) { 
      setShowSectorQuestions(true)
      return 
    }
    await generateSite()
  }

  const handleSwitchVariant = async (sectionName, newVariant) => {
    if (!currentVars) return
    setSwitchingSection(sectionName)
    try {
      const res = await fetch('http://localhost:3001/regenerate-section', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sectionName, 
          variantKey: newVariant, 
          vars: currentVars 
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const newLayout = { ...currentLayout, [sectionName]: newVariant }
      setCurrentLayout(newLayout)
      setGeneratedLayout(newLayout)
      setHtml(prevHtml => rebuildHtml(prevHtml, sectionName, data.html))
    } catch (err) { alert('Erreur : ' + err.message) }
    finally { setSwitchingSection(null) }
  }

  const currentPalettes = SECTOR_PALETTES[formData.secteur] || SECTOR_PALETTES['Autre']
  const imagesCount = [images.logo, images.hero, ...images.gallery].filter(Boolean).length

  const resetAll = () => {
    setStep(1)
    setHtml('')
    setGeneratedLayout(null)
    setSiteId(null)
    setCurrentLayout(null)
    setCurrentVars(null)
    setPreferences(null)
    setSectorAnswers(null)
    setFirestoreId(null)
    setSaveSuccess(null)
    try { localStorage.removeItem('sitegen_last') } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-lg font-bold text-blue-600 leading-none">SiteGen</h1>
              <p className="text-xs text-gray-400">Générateur de sites IA — Sfax</p>
            </div>
          </div>
          {step === 2 && (
            <button onClick={resetAll} className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition">
              ← Nouveau site
            </button>
          )}
        </div>
      </header>

      {/* ── ÉTAPE 1 : FORMULAIRE ── */}
      {step === 1 && (
        <main className="max-w-2xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Créez votre site en <span className="text-blue-600">5 minutes</span>
            </h2>
            <p className="text-gray-500">L'IA choisit automatiquement le meilleur design pour votre secteur</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Nom */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Nom de votre établissement <span className="text-red-400">*</span>
                </label>
                <input name="nom" value={formData.nom} onChange={handleChange} 
                  placeholder="Ex: Salon Mariem" required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>

              {/* Secteur */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Secteur d'activité <span className="text-red-400">*</span>
                </label>
                <select name="secteur" value={formData.secteur} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">-- Choisissez votre secteur --</option>
                  <option>Coiffure & beauté</option>
                  <option>Restaurant & café</option>
                  <option>Médecin & santé</option>
                  <option>Artisan & réparation</option>
                  <option>Commerce & épicerie</option>
                  <option>Autre</option>
                </select>
                {formData.secteur && (
                  <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5">
                    <p className="text-xs text-indigo-700">🤖 <strong>L'IA va choisir</strong> les meilleures variantes pour le secteur <strong>{formData.secteur}</strong>.</p>
                  </div>
                )}
              </div>

              {/* Assistant IA */}
              <div className="mt-2">
                <button type="button" onClick={() => setShowChatbot(true)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition text-blue-700 font-medium text-sm flex items-center justify-center gap-3 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
                  <span>Discuter avec l'assistant IA</span>
                  {preferences && (
                    <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full ml-2">
                      ✓ {Object.keys(preferences).length} réponses
                    </span>
                  )}
                </button>
                {preferences && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-indigo-700">📋 Préférences enregistrées</span>
                      <button type="button" onClick={() => setPreferences(null)} className="text-xs text-red-400 hover:text-red-600">✕ Effacer</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(preferences).map(([key, value]) => {
                        const labels = {
                          style:    { elegant: '✨ Élégant', modern: '🚀 Moderne', minimal: '⬜ Minimal',  creative: '🎭 Créatif'   },
                          ambiance: { chaleureux: '🤗 Chaleureux', professionnel: '💼 Pro', inspirant: '🌟 Inspirant', intime: '🕯️ Intime' },
                          priorite: { conversion: '📞 Contacts',  branding: '🏷️ Marque', information: '📚 Info',   vente: '🛒 Vente'  },
                          ton:      { formel: '🎩 Formel',  chaleureux: '😊 Amical', expert: '🎓 Expert',  audacieux: '🔥 Audacieux' },
                          cta:      { contact: '📱 Contact', devis: '📊 Devis',  reservation: '📅 RDV', decouvrir: '🔍 Découvrir' }
                        }
                        const icons = { style: '🎨', ambiance: '🌅', priorite: '🎯', ton: '💬', cta: '⚡' }
                        const label = labels[key]?.[value] || value
                        return (
                          <span key={key} className="text-xs bg-white border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-full">
                            {icons[key] || '📌'} {label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Vos services <span className="text-xs text-gray-400 font-normal ml-1">(séparés par des virgules)</span>
                </label>
                <input name="services" value={formData.services} onChange={handleChange}
                  placeholder="Ex: Coupe femme, Coloration, Soin capillaire"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>

              {/* Téléphone + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Téléphone</label>
                  <input name="telephone" value={formData.telephone} onChange={handleChange} 
                    placeholder="+216 XX XXX XXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} 
                    placeholder="contact@monsite.tn"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Adresse</label>
                <input name="adresse" value={formData.adresse} onChange={handleChange} 
                  placeholder="Ex: Rue de la République, Sfax"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>

              {/* Langue */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Langue du site</label>
                <select name="langue" value={formData.langue} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="Français">🇫🇷 Français</option>
                  <option value="Arabe">🇹🇳 Arabe</option>
                  <option value="Anglais">🇬🇧 Anglais</option>
                  <option value="Tunisien (Darija)">🇹🇳 Tunisien (Darija)</option>
                </select>
              </div>

              {/* IMAGES */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    📸 Photos de votre établissement <span className="text-xs text-gray-400 font-normal ml-1">(optionnel)</span>
                  </h3>
                  {imagesCount > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {imagesCount} photo{imagesCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-4">
                  <p className="text-xs text-blue-700">✨ <strong>Gemini IA</strong> analysera vos photos et générera des descriptions en <strong>{formData.langue}</strong>.</p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Logo */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-3">🏷️ Logo</label>
                    <div className="flex gap-2 mb-4">
                      {[['upload', "📁 J'ai un logo"], ['generate', "✨ Générer avec l'IA"]].map(([mode, label]) => (
                        <button key={mode} type="button" onClick={() => setLogoMode(mode)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${logoMode === mode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {logoMode === 'upload' && <ImageUploadField preview={images.logo} onChange={handleLogoUpload} />}
                    {logoMode === 'generate' && (
                      <div className="flex flex-col gap-3">
                        <button type="button" onClick={handleGenerateLogo} 
                          disabled={logoLoading || !formData.nom || !formData.secteur}
                          className={`py-2.5 rounded-lg text-sm font-medium transition ${logoLoading || !formData.nom || !formData.secteur ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                          {logoLoading ? '⏳ Génération...' : '✨ Générer mon logo'}
                        </button>
                        {generatedLogo && (
                          <div className="border border-gray-200 rounded-xl p-3 bg-white">
                            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-3" dangerouslySetInnerHTML={{ __html: generatedLogo.svg }} />
                            <p className="text-xs text-green-600 mt-2 text-center">✓ Logo ajouté au site</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Photo hero */}
                  <ImageUploadField label="Photo principale" hint="— apparaît en haut du site (hero)" preview={images.hero} onChange={handleHeroUpload} />
                  {/* Galerie */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Galerie photos <span className="text-xs text-gray-400 font-normal ml-1">— plusieurs photos possibles</span>
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <span className="text-2xl mb-1">🖼️</span>
                      <span className="text-sm text-gray-500">Cliquer pour ajouter des photos</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                    </label>
                    {images.gallery.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {images.gallery.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img} alt={`gallery ${i+1}`} className="h-14 w-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
                            <button type="button" onClick={() => removeGalleryImage(i)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 items-center justify-center hidden group-hover:flex">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Palette */}
              {formData.secteur && (
                <div className="border-t border-gray-100 pt-5">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">🎨 Palette de couleurs</label>
                  <p className="text-xs text-gray-400 mb-3">Pour le secteur <strong>{formData.secteur}</strong></p>
                  <div className="grid grid-cols-3 gap-2">
                    {currentPalettes.map(p => <PaletteCard key={p.id} palette={p} selected={selectedPalette?.id === p.id} onSelect={setSelectedPalette} />)}
                  </div>
                  {!selectedPalette && <p className="text-xs text-amber-600 mt-2">← Choisissez une palette (ou laissez l'IA décider)</p>}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={`mt-2 rounded-xl py-4 font-semibold text-white transition-all text-base ${
                  loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl active:scale-95'
                }`}>
                {loading ? (
                  <span className="flex flex-col items-center justify-center gap-1">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Génération en cours...
                    </span>
                    {loadingStep && <span className="text-xs font-normal text-blue-100">{loadingStep}</span>}
                    {isSaving  && <span className="text-xs font-normal text-blue-100">Sauvegarde Firestore...</span>}
                  </span>
                ) : '🚀 Générer mon site gratuitement'}
              </button>

              {/* Statut Firestore */}
              {saveSuccess === true && firestoreId && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-xs text-green-700 flex items-center gap-2">
                    ✅ Site sauvegardé dans Firestore
                    <span className="text-green-500 text-[10px] font-mono">ID: {firestoreId.slice(0, 12)}...</span>
                  </p>
                </div>
              )}
              {saveSuccess === false && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-700">⚠️ Sauvegarde Firestore échouée (site généré avec succès)</p>
                </div>
              )}
            </form>
          </div>
        </main>
      )}

      {/* ── ÉTAPE 2 : RÉSULTAT ── */}
      {step === 2 && html && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <CIOSuggestions sector={formData.secteur} />
          <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-green-500 text-lg">✅</span>
                <h2 className="text-lg font-semibold text-gray-800">Votre site est prêt !</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{formData.langue}</span>
                {selectedPalette && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">🎨 {selectedPalette.name}</span>}
                {preferences && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🤖 IA guidée</span>}
                {firestoreId  && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">☁️ Sauvegardé</span>}
              </div>
              {generatedLayout && <LayoutBadges layout={generatedLayout} />}
              {currentLayout && (
                <div>
                  <p className="text-xs text-gray-400 mt-2 mb-1">Changer la variante d'une section :</p>
                  <SectionSwitcher layout={currentLayout} onSwitch={handleSwitchVariant} switchingSection={switchingSection} variantsPerSection={VARIANTS_PER_SECTION} variantLabels={VARIANT_LABELS} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {[{ key:'mobile', label:'📱' }, { key:'tablet', label:'💻' }, { key:'desktop', label:'🖥️' }].map(({ key, label }) => (
                  <button key={key} onClick={() => setDevice(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${device === key ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { const w = window.open(''); w.document.write(html); w.document.close() }}
                  className="text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg transition">
                  ↗ Plein écran
                </button>
                <a href={`data:text/html;charset=utf-8,${encodeURIComponent(html)}`}
                  download={`${formData.nom.replace(/\s+/g,'-').toLowerCase()}-site.html`}
                  className="text-sm bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg transition inline-block">
                  ⬇️ Télécharger
                </a>
              </div>
            </div>
          </div>
          <Preview html={html} siteId={siteId} device={device} />
          <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap text-xs text-gray-500">
              {images.logo  && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">✓ Logo intégré</span>}
              {images.hero  && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">✓ Photo hero</span>}
              {images.gallery.length > 0 && <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">✓ {images.gallery.length} photo{images.gallery.length > 1 ? 's' : ''} galerie</span>}
              {firestoreId && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-blue-600">☁️ Sauvegardé cloud</span>}
            </div>
            <button onClick={resetAll} className="text-sm text-gray-500 hover:text-blue-600 transition">← Créer un autre site</button>
          </div>
        </main>
      )}

      {/* MODALS */}
      {showChatbot && (
        <ChatbotAssistant formData={formData} onComplete={handleChatbotComplete} onClose={() => setShowChatbot(false)} initialPreferences={preferences} />
      )}
      {showSectorQuestions && (
        <SectorQuestions sector={formData.secteur} formData={formData} onComplete={handleSectorQuestionsComplete} onBack={() => setShowSectorQuestions(false)} initialAnswers={sectorAnswers} />
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  )
}