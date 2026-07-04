// ═══════════════════════════════════════════════════════════
// AUTH PAGE — Style Wix AI : épuré, blanc, Inter
// src/pages/AuthPage.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez dans quelques minutes.',
  'auth/network-request-failed': 'Problème de connexion réseau.',
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid #e5e7eb', borderRadius: '10px',
  padding: '12px 16px', fontSize: '14px', color: '#111827',
  outline: 'none', fontFamily: 'inherit', background: '#fff',
  transition: 'border-color 0.15s',
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  useEffect(() => { if (user) navigate('/welcome', { replace: true }) }, [user, navigate])

  const handleChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError('') }

  const handleRegister = async () => {
    if (!form.name.trim()) return setError('Veuillez entrer votre nom.')
    if (form.password !== form.confirm) return setError('Les mots de passe ne correspondent pas.')
    if (form.password.length < 6) return setError('Minimum 6 caractères requis.')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(cred.user, { displayName: form.name.trim() })

      // ⭐ CRÉATION DU DOCUMENT UTILISATEUR AVEC 3 CRÉDITS GRATUITS
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: form.name.trim(),
        email: form.email.toLowerCase(),
        createdAt: serverTimestamp(),
        sitesCount: 0,
        credits: 3, // ⭐ 3 crédits offerts à l'inscription
        plan: 'free',
        creditsUsed: 0,
        transactions: [{
          type: 'bonus',
          amount: 3,
          description: 'Crédits de bienvenue 🎁',
          date: new Date().toISOString()
        }]
      })

      navigate('/welcome', { replace: true })
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Une erreur est survenue.')
    } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate('/welcome', { replace: true })
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Une erreur est survenue.')
    } finally { setLoading(false) }
  }

  const handleSubmit = e => { e.preventDefault(); mode === 'register' ? handleRegister() : handleLogin() }

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      minHeight: '100vh', display: 'flex', background: '#fff',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Panneau gauche */}
      <div style={{
        width: '45%', background: '#0f0a1e',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '40px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
          pointerEvents: 'none',
        }} />

        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px', width: 'fit-content',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>⚡</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>SiteGen</span>
        </button>

        <div style={{ position: 'relative' }}>
          <p style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
            GÉNÉRATEUR IA
          </p>
          <h2 style={{
            color: 'white', fontSize: '36px', fontWeight: '800',
            letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '16px',
          }}>
            Votre site vitrine<br />
            <span style={{ color: '#a78bfa' }}>en 5 minutes.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', marginBottom: '32px' }}>
            L'IA choisit le design, rédige les textes et sélectionne les images.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              ['✦', 'IA générative', 'Llama 3.3 70B'],
              ['◈', 'Design premium', '20+ variantes'],
              ['⬡', 'Photos auto', 'Unsplash & Pexels'],
              ['◎', 'Multilingue', '4 langues'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '6px', color: '#a78bfa' }}>{icon}</div>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{title}</div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#374151', fontSize: '12px' }}>SiteGen © {new Date().getFullYear()}</p>
      </div>

      {/* Panneau droit */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <h1 style={{
            fontSize: '28px', fontWeight: '800', letterSpacing: '-0.8px',
            color: '#0f0a1e', marginBottom: '6px',
          }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Créer un compte'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            {mode === 'login' ? 'Accédez à vos sites générés' : 'Rejoignez SiteGen gratuitement + 3 crédits offerts 🎁'}
          </p>

          <div style={{
            display: 'flex', background: '#f9fafb',
            border: '1.5px solid #f3f4f6', borderRadius: '12px',
            padding: '4px', marginBottom: '28px',
          }}>
            {[['login', 'Connexion'], ['register', 'Inscription']].map(([m, lbl]) => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '10px', borderRadius: '9px',
                border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? '#0f0a1e' : '#9ca3af',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}>{lbl}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Votre nom</label>
                <input name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Mariem Ben Ali" required
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle, borderColor: focused === 'name' ? '#7c3aed' : '#e5e7eb' }} />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="vous@exemple.com" required
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={{ ...inputStyle, borderColor: focused === 'email' ? '#7c3aed' : '#e5e7eb' }} />
            </div>

            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="6 caractères minimum" required
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={{ ...inputStyle, borderColor: focused === 'password' ? '#7c3aed' : '#e5e7eb' }} />
            </div>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                  placeholder="Répétez le mot de passe" required
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle, borderColor: focused === 'confirm' ? '#7c3aed' : '#e5e7eb' }} />
              </div>
            )}

            {error && (
              <div style={{
                background: '#fef2f2', border: '1.5px solid #fecaca',
                borderRadius: '10px', padding: '12px 14px',
                display: 'flex', gap: '8px', alignItems: 'flex-start',
              }}>
                <span style={{ color: '#ef4444', fontSize: '14px' }}>⚠</span>
                <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#a78bfa' : '#7c3aed',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '13px', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginTop: '4px',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }} />
                  {mode === 'login' ? 'Connexion...' : 'Création...'}
                </>
              ) : mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '20px' }}>
            {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
            {' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7c3aed', fontWeight: '600', fontSize: '13px', fontFamily: 'inherit',
            }}>
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#374151', marginBottom: '6px', letterSpacing: '0.2px',
}