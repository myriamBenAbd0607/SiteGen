// ═══════════════════════════════════════════════════════════
// WELCOME PAGE — Thème clair (light mode)
// Adapté pour AppLayout avec fond #fafafa
// src/pages/WelcomePage.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const STEPS = [
  {
    id: 'secteur',
    ask: (name) => `Bonjour ${name} 👋 Pour créer votre site idéal, j'ai 4 questions rapides. Quel est votre secteur ?`,
    options: [
      { label: '💇‍♀️ Coiffure & beauté', value: 'Coiffure & beauté' },
      { label: '🍽️ Restaurant & café',   value: 'Restaurant & café' },
      { label: '🏥 Médecin & santé',      value: 'Médecin & santé' },
      { label: '🔧 Artisan',              value: 'Artisan & réparation' },
      { label: '🛒 Commerce',             value: 'Commerce & épicerie' },
      { label: '🎯 Autre',               value: 'Autre' },
    ]
  },
  {
    id: 'style',
    ask: () => 'Quel style visuel préférez-vous ?',
    options: [
      { label: '✨ Élégant & Raffiné',   value: 'elegant' },
      { label: '🚀 Moderne & Dynamique', value: 'modern' },
      { label: '⬜ Minimaliste',         value: 'minimal' },
      { label: '🎭 Créatif & Original',  value: 'creative' },
    ]
  },
  {
    id: 'priorite',
    ask: () => 'Votre objectif principal ?',
    options: [
      { label: '📞 Générer des contacts', value: 'conversion' },
      { label: '🏷️ Image de marque',      value: 'branding' },
      { label: '📚 Informer mes clients', value: 'information' },
      { label: '🛒 Vendre en ligne',      value: 'vente' },
    ]
  },
  {
    id: 'ton',
    ask: () => 'Quel ton pour vos textes ?',
    options: [
      { label: '🎩 Formel',     value: 'formel' },
      { label: '😊 Amical',    value: 'chaleureux' },
      { label: '🎓 Expert',    value: 'expert' },
      { label: '🔥 Audacieux', value: 'audacieux' },
    ]
  },
]

// ── Bulle de chat — thème clair ──────────────────────────
function Bubble({ text, isUser, isNew }) {
  return (
    <div style={{
      display: 'flex', gap: 10, marginBottom: 12,
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: isNew ? 'fadeUp 0.25s ease-out' : 'none',
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0, alignSelf: 'flex-end',
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
        }}>⚡</div>
      )}
      <div style={{
        maxWidth: 280, padding: '10px 14px', borderRadius: 14,
        fontSize: 13.5, lineHeight: 1.55,
        ...(isUser ? {
          // Bulle utilisateur : violet
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
          color: 'white', borderBottomRightRadius: 4,
          boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
        } : {
          // Bulle IA : blanc avec bordure légère
          background: 'white',
          border: '1.5px solid #e5e7eb',
          color: '#111827',
          borderBottomLeftRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        })
      }}>
        {text}
      </div>
    </div>
  )
}

// ── Indicateur de frappe ─────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-end' }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
      }}>⚡</div>
      <div style={{
        padding: '12px 16px', borderRadius: 14, borderBottomLeftRadius: 4,
        background: 'white', border: '1.5px solid #e5e7eb',
        display: 'flex', gap: 5, alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {[0, 120, 240].map(d => (
          <div key={d} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#d1d5db',
            animation: `bounce 1s ${d}ms infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════
export default function WelcomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const name = user?.displayName?.split(' ')[0] || 'vous'
  const chatRef = useRef(null)

  const [phase, setPhase]           = useState('home') // 'home' | 'chat'
  const [log, setLog]               = useState([])
  const [step, setStep]             = useState(0)
  const [answers, setAnswers]       = useState({})
  const [typing, setTyping]         = useState(false)
  const [done, setDone]             = useState(false)
  const [lastMsgIdx, setLastMsgIdx] = useState(0)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [log, typing])

  const addMsg = (text, isUser) => {
    setLog(prev => { setLastMsgIdx(prev.length); return [...prev, { text, isUser }] })
  }

  const startChat = () => {
    setPhase('chat')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMsg(STEPS[0].ask(name), false)
    }, 700)
  }

  const answer = (opt) => {
    addMsg(opt.label, true)
    const cur  = STEPS[step]
    const next = { ...answers, [cur.id]: opt.value }
    setAnswers(next)
    const nextStep = step + 1
    setTyping(true)
    if (nextStep < STEPS.length) {
      setStep(nextStep)
      setTimeout(() => {
        setTyping(false)
        addMsg(STEPS[nextStep].ask(name), false)
      }, 800)
    } else {
      setTimeout(() => {
        setTyping(false)
        addMsg("Parfait, j'ai tout ce qu'il me faut ! 🎉 Je prépare votre session de génération...", false)
        setDone(true)
      }, 800)
    }
  }

  const goGenerate = () => {
    sessionStorage.setItem('sitegen_ai_answers', JSON.stringify(answers))
    navigate('/generate')
  }

  return (
    <div style={{
      minHeight: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, position: 'relative',
      background: '#fafafa',       // ← fond clair cohérent avec AppLayout
    }}>

      {/* Lueurs décoratives subtiles sur fond clair */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(99,102,241,0.06),transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(139,92,246,0.05),transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* ════════════════ PHASE HOME ════════════════ */}
      {phase === 'home' ? (
        <div style={{ textAlign: 'center', maxWidth: 520, position: 'relative', zIndex: 1 }}>

          {/* Icône */}
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto 28px',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: '0 12px 40px rgba(99,102,241,0.25)',
          }}>⚡</div>

          {/* Titre */}
          <h1 style={{
            color: '#0f0a1e',          // ← sombre sur fond clair
            fontSize: 34, fontWeight: 800,
            letterSpacing: '-0.8px', marginBottom: 10, lineHeight: 1.15,
          }}>
            Bonjour, {name} 👋
          </h1>

          {/* Sous-titre */}
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 8, lineHeight: 1.65 }}>
            Créez votre site vitrine professionnel en 5 minutes.
          </p>
          <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 44, lineHeight: 1.6 }}>
            L'assistant comprend vos besoins, puis l'IA génère un site sur mesure.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 44,
            padding: '24px 32px',
            background: 'white',
            border: '1.5px solid #f3f4f6',
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            {[['⚡', '5 min', 'Génération'], ['🎨', '18', 'Palettes'], ['🤖', '100%', 'Personnalisé']].map(([ic, v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{ic}</div>
                <div style={{ color: '#0f0a1e', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{v}</div>
                <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* CTA principal */}
          <button onClick={startChat} style={{
            padding: '14px 44px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: 'white', fontWeight: 700, fontSize: 15,
            boxShadow: '0 8px 28px rgba(99,102,241,0.3)',
            transition: 'all 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.3)' }}
          >
            ✦ Démarrer l'assistant
          </button>

          {/* Lien secondaire */}
          <div style={{ marginTop: 16 }}>
            <button onClick={() => navigate('/generate')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', fontSize: 12, fontFamily: 'inherit',
              textDecoration: 'underline', transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            >
              Passer directement au formulaire →
            </button>
          </div>
        </div>

      ) : (
        /* ════════════════ PHASE CHAT ════════════════ */
        <div style={{
          width: '100%', maxWidth: 500,
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 100px)',
          position: 'relative', zIndex: 1,
        }}>

          {/* En-tête du chat */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20, flexShrink: 0,
            padding: '12px 16px',
            background: 'white', border: '1.5px solid #f3f4f6',
            borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>Assistant SiteGen</div>
              <div style={{ color: '#9ca3af', fontSize: 11 }}>
                {done ? 'Terminé ✓' : `Étape ${Math.min(step + 1, STEPS.length)} / ${STEPS.length}`}
              </div>
            </div>
            {/* Barre de progression */}
            <div style={{ display: 'flex', gap: 4 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 3, borderRadius: 2,
                  background: i < step || done ? '#6366f1' : i === step ? '#c7d2fe' : '#e5e7eb',
                  transition: 'all 0.4s',
                }} />
              ))}
            </div>
          </div>

          {/* Zone messages */}
          <div
            ref={chatRef}
            className="hide-scrollbar"
            style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}
          >
            {log.map((m, i) => (
              <Bubble key={i} text={m.text} isUser={m.isUser} isNew={i === lastMsgIdx} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Options de réponse */}
          {!typing && !done && step < STEPS.length && (
            <div style={{ flexShrink: 0, marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STEPS[step].options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => answer(opt)}
                    style={{
                      padding: '10px 14px', borderRadius: 10,
                      border: '1.5px solid #e5e7eb',
                      background: 'white', color: '#374151',
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s', fontFamily: 'inherit',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f5f3ff'
                      e.currentTarget.style.borderColor = '#a5b4fc'
                      e.currentTarget.style.color = '#4338ca'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.color = '#374151'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA final */}
          {done && (
            <div style={{ flexShrink: 0, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={goGenerate} style={{
                padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                color: 'white', fontWeight: 700, fontSize: 14,
                boxShadow: '0 6px 24px rgba(99,102,241,0.3)',
                transition: 'transform 0.15s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✦ Générer mon site →
              </button>
              <button onClick={() => navigate('/generate')} style={{
                padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#9ca3af', fontSize: 12,
                fontFamily: 'inherit',
              }}>
                Remplir manuellement
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bounce  { 0%,80%,100% { transform:translateY(0) } 40% { transform:translateY(-5px) } }
        .hide-scrollbar::-webkit-scrollbar { display:none }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none }
      `}</style>
    </div>
  )
}