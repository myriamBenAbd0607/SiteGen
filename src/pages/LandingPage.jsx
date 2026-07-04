// ═══════════════════════════════════════════════════════════
// LANDING PAGE — Style Wix AI : blanc, minimaliste, Inter
// src/pages/LandingPage.jsx
// ═══════════════════════════════════════════════════════════
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../contexts/AuthContext'

const FEATURES = [
  { icon: '✦', title: 'IA générative',     desc: 'Llama 3.3 70B rédige tous vos textes et choisit le design optimal pour votre secteur.' },
  { icon: '◈', title: 'Design premium',    desc: '20+ variantes de sections, 18 palettes de couleurs sectorielles, génération de logo SVG.' },
  { icon: '⬡', title: 'Photos automatiques', desc: 'Unsplash & Pexels. Gemini Vision analyse vos propres photos et génère les descriptions.' },
  { icon: '◎', title: 'Multilingue',       desc: 'Français, Arabe, Anglais et Darija Tunisien. Le contenu est généré directement dans la langue choisie.' },
  { icon: '⊞', title: 'Section switcher',  desc: 'Changez la variante de chaque section en un clic, sans régénérer tout le site.' },
  { icon: '☁', title: 'Sauvegarde cloud',  desc: 'Tous vos sites sont sauvegardés automatiquement. Accédez-y depuis n\'importe où.' },
]

const SECTORS = ['💇‍♀️ Coiffure & beauté', '🍽️ Restaurant & café', '🏥 Médecin & santé', '🔧 Artisan', '🛒 Commerce', '🎯 Autre']

const STEPS = [
  { n: '01', title: 'Décrivez votre activité', desc: 'Nom, secteur, services — 2 minutes suffisent.' },
  { n: '02', title: "L'IA conçoit votre site", desc: 'Design, textes, images générés automatiquement.' },
  { n: '03', title: 'Personnalisez & exportez', desc: 'Ajustez chaque section et téléchargez votre site.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleCTA = () => navigate(user ? '/generate' : '/auth')

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#111827', background: '#fff' }}>

      {/* ── Importer Inter ── */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f3f4f6',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: 'white', fontWeight: '700'
          }}>⚡</div>
          <span style={{ fontWeight: '700', fontSize: '17px', letterSpacing: '-0.3px' }}>SiteGen</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} style={navLinkStyle}>Mes sites</button>
              <button onClick={() => navigate('/generate')} style={navBtnStyle}>+ Nouveau site</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={navLinkStyle}>Connexion</button>
              <button onClick={() => navigate('/auth')} style={navBtnStyle}>Commencer gratuitement</button>
            </>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section style={{
        padding: '100px 40px 80px',
        maxWidth: '860px', margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#f5f3ff', border: '1px solid #ede9fe',
          borderRadius: '100px', padding: '6px 14px',
          fontSize: '12px', fontWeight: '500', color: '#7c3aed',
          marginBottom: '32px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
          Llama 3.3 70B · Gemini 2.0 · Unsplash
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: '800',
          letterSpacing: '-2px',
          lineHeight: '1.05',
          marginBottom: '24px',
          color: '#0f0a1e',
        }}>
          Votre site vitrine<br />
          <span style={{ color: '#7c3aed' }}>en 5 minutes.</span>
        </h1>

        <p style={{
          fontSize: '18px', color: '#6b7280', lineHeight: '1.7',
          maxWidth: '540px', margin: '0 auto 40px', fontWeight: '400',
        }}>
          L'IA choisit le design, rédige les textes et sélectionne les images.
          Résultat professionnel. Aucune compétence technique requise.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleCTA} style={{
            background: '#7c3aed', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '14px 28px', fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', letterSpacing: '-0.2px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)' }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 24px rgba(124,58,237,0.35)' }}
          >
            {user ? '+ Créer un nouveau site' : 'Créer mon site gratuitement'}
          </button>
          {user && (
            <button onClick={() => navigate('/dashboard')} style={{
              background: 'white', color: '#374151',
              border: '1.5px solid #e5e7eb', borderRadius: '10px',
              padding: '14px 28px', fontSize: '15px', fontWeight: '500',
              cursor: 'pointer',
            }}>
              Voir mes sites →
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '48px',
          marginTop: '64px', paddingTop: '40px',
          borderTop: '1px solid #f3f4f6',
        }}>
          {[['5 min', 'Génération complète'], ['18', 'Palettes design'], ['20+', 'Variantes sections'], ['4', 'Langues']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f0a1e', letterSpacing: '-1px' }}>{v}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', fontWeight: '500' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTEURS
      ════════════════════════════════════════ */}
      <section style={{ background: '#fafafa', padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
            Conçu pour tous les secteurs
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {SECTORS.map(s => (
              <div key={s} style={{
                background: 'white', border: '1.5px solid #e5e7eb',
                borderRadius: '100px', padding: '8px 18px',
                fontSize: '13px', fontWeight: '500', color: '#374151',
              }}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMMENT ÇA MARCHE
      ════════════════════════════════════════ */}
      <section style={{ padding: '96px 40px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Comment ça marche</p>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#0f0a1e', margin: 0 }}>3 étapes, 5 minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: i === 1 ? '#7c3aed' : '#f5f3ff',
                color: i === 1 ? 'white' : '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '14px', margin: '0 auto 20px',
              }}>{s.n}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section style={{ background: '#fafafa', padding: '96px 40px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Fonctionnalités</p>
            <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#0f0a1e', margin: 0 }}>Tout ce dont vous avez besoin</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'white', border: '1.5px solid #f3f4f6',
                borderRadius: '16px', padding: '28px',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ede9fe'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#f5f3ff', color: '#7c3aed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', marginBottom: '16px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section style={{ padding: '96px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-1.5px', color: '#0f0a1e', marginBottom: '16px' }}>
            Prêt à créer votre site ?
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
            Rejoignez SiteGen et créez un site professionnel en quelques minutes.
          </p>
          <button onClick={handleCTA} style={{
            background: '#7c3aed', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '16px 36px', fontSize: '16px', fontWeight: '600',
            cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
          }}>
            {user ? '⚡ Créer un nouveau site' : '✦ Commencer gratuitement'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f3f4f6', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          SiteGen © {new Date().getFullYear()} — Générateur de sites vitrines par IA
        </p>
      </footer>
    </div>
  )
}

const navLinkStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '14px', fontWeight: '500', color: '#374151', padding: '8px 14px',
  borderRadius: '8px',
}
const navBtnStyle = {
  background: '#7c3aed', color: 'white', border: 'none',
  borderRadius: '8px', padding: '8px 16px',
  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
}