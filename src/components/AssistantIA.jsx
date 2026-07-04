import { useState, useEffect } from 'react'
import { ASSISTANT_QUESTIONS } from '../config/assistant-questions'

// ─── COMPOSANT ASSISTANT IA ───────────────────────────────
export default function AssistantIA({ onComplete, onClose, initialPreferences }) {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState(initialPreferences || {})
  const [showAssistant, setShowAssistant] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const questions = Object.entries(ASSISTANT_QUESTIONS)
  const totalSteps = questions.length
  const currentQuestion = questions[step]
  const questionKey = currentQuestion?.[0]
  const questionData = currentQuestion?.[1]

  // Sélectionner une option
  const selectOption = (optionId) => {
    // ⚠️ FIX: construire les nouvelles préférences ici, pas depuis l'état async
    const newPreferences = { ...preferences, [questionKey]: optionId }
    setPreferences(newPreferences)

    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setIsComplete(true)
      setTimeout(() => {
        onComplete(newPreferences)  // ← passe newPreferences, pas preferences (qui serait stale)
        setShowAssistant(false)
      }, 1000)
    }
  }

  // Revenir en arrière
  const goBack = () => {
    if (step > 0) setStep(step - 1)
  }

  // Recommencer
  const reset = () => {
    setStep(0)
    setPreferences({})
    setIsComplete(false)
  }

  // Barre de progression
  const progress = ((step + 1) / totalSteps) * 100

  if (!showAssistant) return null

  // Écran de fin
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scale-up">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Préférences enregistrées !</h3>
          <p className="text-gray-500 text-sm">
            L'IA va maintenant générer votre site en tenant compte de vos choix.
          </p>
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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{questionData.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Assistant IA</h3>
              <p className="text-xs text-gray-400">Étape {step + 1}/{totalSteps}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-xl">
            ✕
          </button>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            {questionData.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questionData.options.map((option) => {
              const isSelected = preferences[questionKey] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => selectOption(option.id)}
                  className={`
                    text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {option.description}
                      </div>
                      {isSelected && (
                        <div className="mt-1 text-xs text-blue-600 font-medium">
                          ✓ Sélectionné
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={goBack}
            disabled={step === 0}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${step === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            ← Retour
          </button>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              ↻ Recommencer
            </button>
            <button
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              ⏭ Passer
            </button>
          </div>
        </div>

        {/* Indicateur de sélection */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(preferences).map(([key, value]) => {
            const q = ASSISTANT_QUESTIONS[key]
            const option = q?.options.find(o => o.id === value)
            return option ? (
              <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {q?.icon} {option.label}
              </span>
            ) : null
          })}
          {Object.keys(preferences).length === 0 && (
            <span className="text-xs text-gray-400">Aucune préférence sélectionnée</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── STYLES ADDITIONNELS ──────────────────────────────────
const styles = `
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
`

// Ajouter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}