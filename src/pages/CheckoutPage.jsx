// ═══════════════════════════════════════════════════════════
// CHECKOUT PAGE — Simulation paiement
// src/pages/CheckoutPage.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCredits } from '../hooks/useCredits'

// ─── Formatage carte / expiry ─────────────────────────────
const fmtCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
const fmtExpiry = v => { const d = v.replace(/\D/g,'').slice(0,4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d }

export default function CheckoutPage() {
  const navigate            = useNavigate()
  const { state }           = useLocation()
  const pack                = state?.pack          // reçu de PricingPage via navigate('/checkout', { state: { pack } })
  const { addCredits, credits } = useCredits()

  const [phase, setPhase]   = useState('form')     // 'form' | 'processing' | 'success'
  const [progress, setProgress] = useState(0)
  const [card, setCard]     = useState({ number:'', expiry:'', cvc:'', name:'' })
  const [errors, setErrors] = useState({})

  // ── Redirection si pas de pack dans le state ─────────────
  useEffect(() => {
    if (!pack) navigate('/pricing', { replace: true })
  }, [pack, navigate])

  // ── Animation barre de progression (~2 s) ────────────────
  useEffect(() => {
    if (phase !== 'processing') return
    let v = 0
    const id = setInterval(() => {
      v += 100 / 50           // 50 ticks × 40 ms = 2 000 ms
      setProgress(Math.min(v, 100))
      if (v >= 100) { clearInterval(id); setPhase('success') }
    }, 40)
    return () => clearInterval(id)
  }, [phase])

  if (!pack) return null

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (card.number.replace(/\s/g,'').length < 16) e.number = 'Numéro incomplet (16 chiffres)'
    if (card.expiry.length < 5)                    e.expiry = 'Date invalide (MM/AA)'
    if (card.cvc.length < 3)                       e.cvc    = 'CVC invalide (3 chiffres)'
    if (!card.name.trim())                         e.name   = 'Nom requis'
    setErrors(e)
    return !Object.keys(e).length
  }

  // ── Soumission ────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setPhase('processing')
    await addCredits(pack)    // addCredits attend le pack complet (cf. useCredits.js)
  }

  // ─── Styles partagés ──────────────────────────────────────
  const S = {
    page:  { fontFamily:"'Inter', -apple-system, sans-serif", minHeight:'100%', background:'#fafafa', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' },
    card:  { background:'white', border:'1.5px solid #f3f4f6', borderRadius:20, padding:'40px', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
    label: { display:'block', fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 },
    input: { width:'100%', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#111827', outline:'none', boxSizing:'border-box', fontFamily:'inherit', transition:'border-color 0.15s' },
    btn:   { width:'100%', padding:'14px', borderRadius:12, border:'none', cursor:'pointer', fontFamily:"'Inter', sans-serif", fontSize:14, fontWeight:700, transition:'all 0.15s' },
    err:   { fontSize:11, color:'#dc2626', marginTop:4 },
  }

  const focusIn  = e => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)' }
  const focusOut = e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }

  // ══ SUCCÈS ════════════════════════════════════════════════
  if (phase === 'success') return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign:'center' }}>

        <div style={{ width:72, height:72, borderRadius:'50%', background:'#f0fdf4', border:'2px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 20px' }}>
          ✅
        </div>

        <h1 style={{ fontSize:22, fontWeight:800, color:'#0f0a1e', letterSpacing:'-0.5px', margin:'0 0 8px' }}>
          Paiement confirmé !
        </h1>
        <p style={{ fontSize:14, color:'#6b7280', margin:'0 0 6px' }}>
          <span style={{ fontWeight:700, color:'#059669' }}>+{pack.credits} crédits</span> ajoutés à votre compte.
        </p>
        <p style={{ fontSize:12, color:'#9ca3af', margin:'0 0 28px' }}>
          Nouveau solde : <strong>{(credits ?? 0)} crédits</strong>
        </p>

        {/* Récapitulatif */}
        <div style={{ background:'#fafafa', border:'1.5px solid #f3f4f6', borderRadius:12, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'#9ca3af', letterSpacing:'1px', textTransform:'uppercase', margin:'0 0 12px' }}>Récapitulatif</p>
          {[['Pack', pack.name], ['Crédits ajoutés', `${pack.credits} crédits`], ['Montant', `${pack.price.toFixed(2)} €`]].map(([l, v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, marginBottom:8, borderBottom:'1px solid #f3f4f6' }}>
              <span style={{ fontSize:12, color:'#6b7280' }}>{l}</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#111827' }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/generate')} style={{ ...S.btn, background:'#7c3aed', color:'white', boxShadow:'0 4px 16px rgba(124,58,237,0.3)', marginBottom:10 }}
          onMouseEnter={e => e.currentTarget.style.background='#6d28d9'}
          onMouseLeave={e => e.currentTarget.style.background='#7c3aed'}>
          ⚡ Générer un site maintenant
        </button>
        <button onClick={() => navigate('/dashboard')} style={{ ...S.btn, background:'transparent', color:'#9ca3af', fontWeight:500 }}
          onMouseEnter={e => e.currentTarget.style.color='#374151'}
          onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}>
          Aller au dashboard →
        </button>
      </div>
    </div>
  )

  // ══ TRAITEMENT ════════════════════════════════════════════
  if (phase === 'processing') return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#f5f3ff', border:'2px solid #ddd6fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 20px' }}>
          🔐
        </div>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#0f0a1e', margin:'0 0 6px' }}>Traitement en cours…</h2>
        <p style={{ fontSize:13, color:'#9ca3af', margin:'0 0 28px' }}>Sécurisation du paiement simulé</p>

        {/* Barre */}
        <div style={{ height:6, background:'#f3f4f6', borderRadius:6, overflow:'hidden', marginBottom:10 }}>
          <div style={{ height:'100%', background:`linear-gradient(90deg, #7c3aed, #a78bfa)`, borderRadius:6, width:`${progress}%`, transition:'width 0.08s linear' }} />
        </div>
        <p style={{ fontSize:11, color:'#9ca3af' }}>
          {progress < 40 ? 'Vérification de la carte…' : progress < 75 ? 'Autorisation bancaire…' : 'Ajout des crédits…'}
        </p>
      </div>
    </div>
  )

  // ══ FORMULAIRE ════════════════════════════════════════════
  return (
    <div style={S.page}>
      <div style={{ width:'100%', maxWidth:460 }}>

        {/* Retour */}
        <button onClick={() => navigate('/pricing')} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:13, display:'flex', alignItems:'center', gap:6, marginBottom:24, fontFamily:'inherit', padding:0 }}
          onMouseEnter={e => e.currentTarget.style.color='#374151'}
          onMouseLeave={e => e.currentTarget.style.color='#6b7280'}>
          ← Retour aux tarifs
        </button>

        <div style={S.card}>

          {/* Résumé pack */}
          <div style={{ background:pack.bgColor || '#f5f3ff', border:`1.5px solid ${pack.color}30`, borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:pack.color, letterSpacing:'1.5px', textTransform:'uppercase', margin:'0 0 4px' }}>Pack sélectionné</p>
              <p style={{ fontSize:18, fontWeight:800, color:'#0f0a1e', margin:0, letterSpacing:'-0.4px' }}>{pack.name}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:22, fontWeight:800, color:'#0f0a1e', margin:'0 0 2px', letterSpacing:'-0.5px' }}>{pack.price.toFixed(2)} €</p>
              <p style={{ fontSize:11, color:pack.color, fontWeight:600, margin:0 }}>⚡ {pack.credits} crédits</p>
            </div>
          </div>

          {/* Alerte simulation */}
          <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:10, padding:'10px 14px', marginBottom:24, display:'flex', gap:10, alignItems:'flex-start' }}>
            <span>⚠️</span>
            <p style={{ margin:0, fontSize:11, color:'#92400e', lineHeight:1.5 }}>
              <strong>Mode démo</strong> — Aucun débit réel. Entrez des chiffres quelconques valides.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:'#0f0a1e', margin:0, letterSpacing:'-0.3px' }}>
              Informations de paiement
            </h2>

            {/* Nom */}
            <div>
              <label style={S.label}>Nom sur la carte</label>
              <input style={S.input} type="text" placeholder="MARIEM BEN ALI"
                value={card.name}
                onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                onFocus={focusIn} onBlur={focusOut}
              />
              {errors.name && <p style={S.err}>{errors.name}</p>}
            </div>

            {/* Numéro */}
            <div>
              <label style={S.label}>Numéro de carte</label>
              <div style={{ position:'relative' }}>
                <input style={{ ...S.input, paddingRight:44 }} type="text" inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={e => setCard(p => ({ ...p, number: fmtCard(e.target.value) }))}
                  onFocus={focusIn} onBlur={focusOut}
                />
                <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>💳</span>
              </div>
              {errors.number && <p style={S.err}>{errors.number}</p>}
            </div>

            {/* Expiry + CVC */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <label style={S.label}>Expiration</label>
                <input style={S.input} type="text" inputMode="numeric" placeholder="MM/AA"
                  value={card.expiry}
                  onChange={e => setCard(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))}
                  onFocus={focusIn} onBlur={focusOut}
                />
                {errors.expiry && <p style={S.err}>{errors.expiry}</p>}
              </div>
              <div>
                <label style={S.label}>CVC</label>
                <input style={S.input} type="text" inputMode="numeric" placeholder="123"
                  value={card.cvc}
                  onChange={e => setCard(p => ({ ...p, cvc: e.target.value.replace(/\D/g,'').slice(0,3) }))}
                  onFocus={focusIn} onBlur={focusOut}
                />
                {errors.cvc && <p style={S.err}>{errors.cvc}</p>}
              </div>
            </div>

            {/* Bouton payer */}
            <button type="submit" style={{ ...S.btn, background:'#7c3aed', color:'white', marginTop:4, boxShadow:'0 4px 16px rgba(124,58,237,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background='#6d28d9'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='#7c3aed'; e.currentTarget.style.transform='translateY(0)' }}>
              🔒 Payer {pack.price.toFixed(2)} € — obtenir {pack.credits} crédits
            </button>

            <p style={{ textAlign:'center', fontSize:11, color:'#d1d5db', margin:0 }}>
              Simulation uniquement — aucun prélèvement réel
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}