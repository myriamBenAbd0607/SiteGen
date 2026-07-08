// ═══════════════════════════════════════════════════════════
// APP LAYOUT — Sidebar avec widget crédits
// src/AppLayout.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { useAuth } from './contexts/AuthContext'
import { useCredits } from './hooks/useCredits'

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts)
  const diff  = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)  return "À l'instant"
  if (mins < 60) return `il y a ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `il y a ${hrs}h`
  return `il y a ${Math.floor(hrs / 24)}j`
}

const SECTOR_ICONS = {
  'Coiffure & beauté': '💇‍♀️', 'Restaurant & café': '🍽️',
  'Médecin & santé': '🏥',    'Artisan & réparation': '🔧',
  'Commerce & épicerie': '🛒', 'Autre': '🎯',
}

// Couleur du widget crédit selon le solde
function getCreditColor(n) {
  if (n === null || n === undefined) return '#7c3aed'
  if (n === 0)  return '#dc2626'
  if (n <= 2)   return '#d97706'
  if (n <= 5)   return '#7c3aed'
  return '#059669'
}

export default function AppLayout({ children }) {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const [sites, setSites]         = useState([])
  const [collapsed, setCollapsed] = useState(false)

  // ─── Crédits en temps réel ──────────────────────────────
  const { credits, creditsUsed, loading: creditsLoading } = useCredits()
  const creditCol     = getCreditColor(credits)
  const creditsTotal  = (credits ?? 0) + (creditsUsed ?? 0)
  const creditPct     = creditsTotal > 0
    ? Math.min((credits / creditsTotal) * 100, 100)
    : 0

  useEffect(() => {
    if (!user?.uid) return
    const q = query(collection(db, 'sites'), where('userId', '==', user.uid))
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => {
        const ta = a.createdAt?.toDate?.() || new Date(0)
        const tb = b.createdAt?.toDate?.() || new Date(0)
        return tb - ta
      })
      setSites(data)
    }, () => {})
    return unsub
  }, [user?.uid])

  const handleLogout = async () => { await signOut(auth); navigate('/', { replace: true }) }
  const isActive = (path) => location.pathname === path

  const navItem = (path, icon, label) => (
    <button onClick={() => navigate(path)} style={{
      width: '100%', display: 'flex', alignItems: 'center',
      gap: collapsed ? 0 : '10px',
      padding: collapsed ? '10px 0' : '9px 12px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      background: isActive(path) ? '#f5f3ff' : 'transparent',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      color: isActive(path) ? '#7c3aed' : '#6b7280',
      fontSize: '13px', fontWeight: isActive(path) ? '600' : '500',
      transition: 'all 0.15s', fontFamily: 'inherit',
    }}
      onMouseEnter={e => { if (!isActive(path)) e.currentTarget.style.background = '#f9fafb' }}
      onMouseLeave={e => { if (!isActive(path)) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ fontSize: '15px', flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  )

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: '#f9fafb',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside style={{
        width: collapsed ? '60px' : '232px',
        flexShrink: 0, transition: 'width 0.2s ease',
        background: 'white',
        borderRight: '1.5px solid #f3f4f6',
        display: 'flex', flexDirection: 'column',
        overflowX: 'hidden',
      }}>

        {/* ── Logo ─────────────────────────────────────────── */}
        <div style={{
          padding: collapsed ? '16px 0' : '16px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1.5px solid #f3f4f6',
          minHeight: '60px',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: 'white', fontWeight: '700', flexShrink: 0,
              }}>⚡</div>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f0a1e', letterSpacing: '-0.3px' }}>SiteGen</span>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', color: 'white',
            }}>⚡</div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#d1d5db', fontSize: '16px', padding: '2px',
            display: collapsed ? 'none' : 'block',
          }}>‹</button>
        </div>

        {/* ── Nav principal ─────────────────────────────────── */}
        <div style={{ padding: '12px 8px', borderBottom: '1.5px solid #f3f4f6' }}>
          <button onClick={() => navigate('/generate')} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : '8px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 12px',
            background: isActive('/generate') ? '#7c3aed' : '#f5f3ff',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            color: isActive('/generate') ? 'white' : '#7c3aed',
            fontSize: '13px', fontWeight: '600',
            fontFamily: 'inherit', transition: 'all 0.15s',
            marginBottom: '4px',
          }}>
            <span style={{ fontSize: '14px' }}>✦</span>
            {!collapsed && <span>Nouveau site</span>}
          </button>

          {navItem('/welcome',   '⌂', 'Accueil')}
          {navItem('/dashboard', '▤', 'Mes sites')}
          {navItem('/pricing',   '⚡', 'Crédits')}
        </div>

        {/* ── Widget crédits ────────────────────────────────── */}
        {!creditsLoading && credits !== null && (
          <div style={{ padding: '10px 8px', borderBottom: '1.5px solid #f3f4f6' }}>
            {!collapsed ? (
              /* Version déployée */
              <div style={{
                padding: '12px',
                background: '#fafafa',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
              }}>
                {/* En-tête */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>
                    Crédits
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: creditCol, fontFamily: 'inherit' }}>
                    {credits}
                  </span>
                </div>

                {/* Barre de progression */}
                <div style={{
                  height: '4px', background: '#f3f4f6',
                  borderRadius: '4px', marginBottom: '10px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    background: creditCol,
                    borderRadius: '4px',
                    width: `${creditPct}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>

                {/* CTA ou label */}
                {credits <= 2 ? (
                  <button
                    onClick={() => navigate('/pricing')}
                    style={{
                      width: '100%', padding: '7px', borderRadius: '7px',
                      background: '#7c3aed', color: 'white',
                      border: 'none', cursor: 'pointer',
                      fontSize: '11px', fontWeight: '700',
                      fontFamily: 'inherit', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                  >
                    {credits === 0 ? '⚠ Plus de crédits' : '⚡ Recharger les crédits'}
                  </button>
                ) : (
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0, textAlign: 'center' }}>
                    {credits} crédit{credits > 1 ? 's' : ''} disponible{credits > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              /* Version réduite — juste un badge numéroté */
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  title={`${credits} crédit${credits > 1 ? 's' : ''}`}
                  style={{
                    width: '26px', height: '26px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '800', cursor: 'pointer',
                    color: creditCol,
                    background: credits === 0 ? '#fee2e2' : credits <= 2 ? '#fffbeb' : '#f5f3ff',
                    border: `1.5px solid ${creditCol}30`,
                  }}
                  onClick={() => navigate('/pricing')}
                >
                  {credits}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Récents ───────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {!collapsed && sites.length > 0 && (
            <p style={{
              fontSize: '10px', fontWeight: '700', color: '#4f6689',
              letterSpacing: '1px', textTransform: 'uppercase',
              padding: '0 4px', marginBottom: '8px',
            }}>Récents · {sites.length}</p>
          )}
          {sites.slice(0, 8).map(site => (
            <button key={site.id} onClick={() => navigate('/dashboard')} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '8px', padding: collapsed ? '8px 0' : '8px 10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'transparent', border: 'none',
              borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.15s', textAlign: 'left',
              fontFamily: 'inherit',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '26px', height: '26px', borderRadius: '7px',
                background: site.palette?.primary ? `${site.palette.primary}18` : '#f5f3ff',
                border: `1.5px solid ${site.palette?.primary || '#7c3aed'}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', flexShrink: 0,
              }}>
                {SECTOR_ICONS[site.secteur] || '🎯'}
              </div>
              {!collapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '12px', fontWeight: '500', color: '#111827',
                    margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {site.nom}
                  </p>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>
                    {timeAgo(site.createdAt)}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── Profil + déconnexion ──────────────────────────── */}
        <div style={{
          padding: collapsed ? '12px 8px' : '12px',
          borderTop: '1.5px solid #f3f4f6',
        }}>
          {!collapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px', background: '#f9fafb',
              borderRadius: '10px', marginBottom: '6px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0,
              }}>
                {user?.displayName?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '12px', fontWeight: '600', color: '#111827',
                  margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.displayName || 'Utilisateur'}
                </p>
                <p style={{
                  fontSize: '10px', color: '#9ca3af', margin: 0,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.email}
                </p>
              </div>
            </div>
          )}

          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : '8px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '8px 0' : '8px 10px',
            background: 'transparent', border: 'none',
            borderRadius: '8px', cursor: 'pointer',
            color: '#9ca3af', fontSize: '12px', fontWeight: '500',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent' }}
          >
            <span>⎋</span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ══ CONTENU PRINCIPAL ════════════════════════════════ */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#fafafa' }}>
        {children}
      </main>
    </div>
  )
}