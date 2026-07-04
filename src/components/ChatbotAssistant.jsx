import { useState, useEffect } from 'react'
import { SECTOR_SPECIFIC_QUESTIONS, DEFAULT_QUESTIONS } from '../config/sector-questions'

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

  // Récupérer les questions spécifiques au secteur
  const sectorData = SECTOR_SPECIFIC_QUESTIONS[sector] || DEFAULT_QUESTIONS
  const questions = sectorData.questions || []
  const totalQuestions = questions.length

  // Mettre à jour la progression
  useEffect(() => {
    const answered = Object.keys(answers).length
    setProgress(Math.min((answered / totalQuestions) * 100, 100))
  }, [answers, totalQuestions])

  const currentQuestion = questions[currentStep]

  // Sélectionner une réponse
  const selectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))

    if (currentStep < totalQuestions - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      // Dernière question → afficher le résumé
      setShowSummary(true)
    }
  }

  // Revenir en arrière
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowSummary(false)
    }
  }

  // Passer les questions
  const skipQuestions = () => {
    onComplete({})
  }

  // Confirmer et terminer
  const confirmAndComplete = () => {
    setIsComplete(true)
    setTimeout(() => {
      onComplete(answers)
    }, 1500)
  }

  // Obtenir le label d'une option
  const getOptionLabel = (questionId, optionId) => {
    const q = questions.find(q => q.id === questionId)
    if (!q) return optionId
    const option = q.options?.find(o => o.id === optionId)
    return option ? option.label : optionId
  }

  // Écran de fin
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scale-up">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Merci pour vos réponses !
          </h3>
          <p className="text-gray-500 text-sm">
            Nous allons maintenant générer votre site en tenant compte de toutes vos préférences.
          </p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-3">Préparation de votre site...</p>
        </div>
      </div>
    )
  }

  // Écran de résumé (après toutes les questions)
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
            <button 
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 transition text-xl p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
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
            <button
              onClick={() => setShowSummary(false)}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              ← Modifier
            </button>

            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                ⏭ Annuler
              </button>
              <button
                onClick={confirmAndComplete}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                🚀 Générer mon site
              </button>
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

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sectorData.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{sectorData.title}</h3>
              <p className="text-xs text-gray-400">
                {sectorData.subtitle} • {currentStep + 1}/{totalQuestions}
              </p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition text-xl p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Barre de progression */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">{Math.round(progress)}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Questions spécifiques à votre secteur
          </p>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Question {currentStep + 1}/{totalQuestions}
            </span>
            <h2 className="text-xl font-bold text-gray-800 mt-3">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`
                    text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.icon || '📌'}</span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {option.label}
                      </div>
                      {isSelected && (
                        <div className="mt-1 text-xs text-blue-600 font-medium">✓ Sélectionné</div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${currentStep === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            ← Retour
          </button>

          <div className="flex gap-2">
            <button
              onClick={skipQuestions}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
            >
              ⏭ Passer
            </button>
            <button
              onClick={() => {
                // Si toutes les questions sont répondues, afficher le résumé
                if (Object.keys(answers).length === totalQuestions) {
                  setShowSummary(true)
                } else {
                  // Aller à la première question non répondue
                  const nextUnanswered = questions.findIndex(q => !answers[q.id])
                  if (nextUnanswered !== -1) {
                    setCurrentStep(nextUnanswered)
                  }
                }
              }}
              className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
            >
              {Object.keys(answers).length === totalQuestions ? '📋 Voir le résumé' : '⏭ Passer'}
            </button>
          </div>
        </div>

        {/* Réponses sélectionnées */}
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