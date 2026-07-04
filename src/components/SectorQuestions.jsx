import { useState, useEffect } from 'react'

// ─── QUESTIONS SPÉCIFIQUES PAR SECTEUR ────────────────────
const SECTOR_SPECIFIC_QUESTIONS = {
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

const DEFAULT_QUESTIONS = {
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

export default function SectorQuestions({ 
  sector, 
  onComplete, 
  onBack,
  initialAnswers,
  formData 
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const sectorData = SECTOR_SPECIFIC_QUESTIONS[sector] || DEFAULT_QUESTIONS
  const questions = sectorData.questions || []
  const totalQuestions = questions.length

  useEffect(() => {
    const answered = Object.keys(answers).length
    setProgress(Math.min((answered / totalQuestions) * 100, 100))
  }, [answers, totalQuestions])

  const currentQuestion = questions[currentStep]

  const selectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))

    if (currentStep < totalQuestions - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      setShowSummary(true)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowSummary(false)
    }
  }

  const skipQuestions = () => {
    onComplete({})
  }

  const confirmAndComplete = () => {
    setIsComplete(true)
    setTimeout(() => {
      onComplete(answers)
    }, 1500)
  }

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scale-up">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Merci pour vos réponses !</h3>
          <p className="text-gray-500 text-sm">Nous allons maintenant générer votre site en tenant compte de toutes vos préférences.</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-3">Préparation de votre site...</p>
        </div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{sectorData.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Récapitulatif</h3>
                <p className="text-xs text-gray-400">Vérifiez vos réponses</p>
              </div>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition text-xl p-2 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {questions.map((q) => {
              const answerId = answers[q.id]
              const option = q.options.find(o => o.id === answerId)
              return (
                <div key={q.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{q.question}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-1">
                    {option ? `${option.icon || '📌'} ${option.label}` : '❌ Non répondu'}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
            <button onClick={() => setShowSummary(false)} className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition">← Modifier</button>
            <div className="flex gap-2">
              <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">⏭ Annuler</button>
              <button onClick={confirmAndComplete} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">🚀 Générer mon site</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sectorData.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{sectorData.title}</h3>
              <p className="text-xs text-gray-400">{sectorData.subtitle} • {currentStep + 1}/{totalQuestions}</p>
            </div>
          </div>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition text-xl p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500">{Math.round(progress)}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Questions spécifiques à votre secteur</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Question {currentStep + 1}/{totalQuestions}</span>
            <h2 className="text-xl font-bold text-gray-800 mt-3">{currentQuestion.question}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.icon || '📌'}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      {isSelected && <div className="mt-1 text-xs text-blue-600 font-medium">✓ Sélectionné</div>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button onClick={goBack} disabled={currentStep === 0} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}>← Retour</button>
          <div className="flex gap-2">
            <button onClick={skipQuestions} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">⏭ Passer</button>
            <button onClick={() => {
              if (Object.keys(answers).length === totalQuestions) {
                setShowSummary(true)
              } else {
                const nextUnanswered = questions.findIndex(q => !answers[q.id])
                if (nextUnanswered !== -1) setCurrentStep(nextUnanswered)
              }
            }} className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition">
              {Object.keys(answers).length === totalQuestions ? '📋 Voir le résumé' : '⏭ Passer'}
            </button>
          </div>
        </div>

        {Object.keys(answers).length > 0 && (
          <div className="px-6 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(answers).map(([key, value]) => {
                const q = questions.find(q => q.id === key)
                const option = q?.options.find(o => o.id === value)
                return option ? (
                  <span key={key} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {option.icon || '📌'} {option.label}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.3s ease-out; }
      `}</style>
    </div>
  )
}